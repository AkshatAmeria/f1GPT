//This code is a complete data-ingestion script that scrapes Formula 1 websites, breaks their content into chunks, generates OpenAI embeddings, and stores those embeddings inside a vector database (Astra DB) for later retrieval and querying (e.g., in a RAG system).

import {DataAPIClient} from "@datastax/astra-db-ts"
import {PuppeteerWebBaseLoader} from "langchain/document_loaders/web/puppeteer"
import OpenAI from "openai"
import "dotenv/config"
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter"

const {ASTRA_DB_NAMESPACE , ASTRA_DB_COLLECTION , ASTRA_DB_API_ENDPOINT , ASTRA_DB_APPLICATION_TOKEN , OPENAI_API_KEY } =  process.env

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
})

type SimilarityMetric = "dot_product" | "cosine" | "euclidean"

const f1data = [
     "https://en.wikipedia.org/wiki/Formula_One",
     "https://www.formula1.com/",
     "https://www.bbc.com/sport/formula1",
     "https://www.motorsport.com/f1/",
     "https://www.skysports.com/f1",
     "https://racingnews365.com/",
     "https://www.gpfans.com/en/",
     "https://www.reddit.com/r/formula1/",
     "https://www.autosport.com/f1/"
]

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db  = client.db(ASTRA_DB_API_ENDPOINT , {namespace: ASTRA_DB_NAMESPACE})

const spiltter = new RecursiveCharacterTextSplitter({
    chunkSize: 512, 
     chunkOverlap: 100
})

const createCollection = async (similarityMetric : SimilarityMetric = "dot_product") => {
 const res = await db.createCollection(ASTRA_DB_COLLECTION , {
    vector:{
        dimension: 1536,
        metric: similarityMetric
    }
 })
 console.log(res);
}


const loadSampleData = async () => {
 const collection = await db.collection(ASTRA_DB_COLLECTION)

 for await ( const url of f1data ){
    const content = await scrapePage(url)
    const chunks = await spiltter.splitText(content)
    for await (const chunk of chunks) {
        const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: chunk,
            encoding_format: "float"
        })

        const vector = embedding.data[0].embedding
        const res = await collection.insertOne({
            $vector: vector,
            text: chunk,
        })
        console.log(res);
    }

 }
}

const scrapePage = async (url: string) => {
const loader = new PuppeteerWebBaseLoader(url , {
launchOptions:{
    headless: true
},
gotoOptions: {
    waitUntil: "domcontentloaded"
},
evaluate: async (page , browser) => {
const result = await page.evaluate(() => document.body.innerHTML)
await browser.close()
return result
}

})
return (await loader.scrape())?.replace(/<[^>]*>?/gm,'')

}

createCollection().then(() => loadSampleData())

