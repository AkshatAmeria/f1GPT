import OpenAI from "openai";
import {OpenAIStream , StreamingTextResponse} from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";

const {
ASTRA_DB_NAMESPACE,
ASTRA_DB_COLLECTION,
ASTRA_DB_APPLICATION_TOKEN,
OPENAI_API_KEY,
ASTRA_DB_API_ENDPOINT

} = process.env

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
})

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT, {namespace: ASTRA_DB_NAMESPACE})


export async function POST(req:Request) {
    try {
        const {messages} = await req.json()
        const latestMessage = messages[messages?.length -1].content

        let docContext = ""
        const embedding = await openai.embeddings.create({
            model:"text-embedding-3-small",
            input: latestMessage,
            encoding_format:"float"

    })

    try {
        const collection = await db.collection(ASTRA_DB_COLLECTION)
       const cursor =  collection.find(null , {
            sort: {
                $vector: embedding.data[0].embedding,
            },
            limit: 10
        })
        const documents = cursor.toArray()
        //@ts-ignore
        const docMap = documents?.map(doc => doc.text)
        docContext = JSON.stringify(docMap)
    } catch (error) {
        console.log("Error: ", error)
        docContext = ""
    }
    const template = {
        role:"system",
        content:`You are a Formula 1 AI assistant. Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.
        -------------
        START CONTEXT 
        ${docContext}
        -------------
        END CONTEXT
        --------------------
        QUESTION: ${latestMessage}
        -----------------
        `
    }

    const response = await openai.chat.completions.create({
        model:"gpt-4o",
        messages: [template , ...messages ],
        temperature:0.7,
        stream:true
    })

    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
    } catch (error) {
        console.log("Error: ", error)
        return new Response("Internal Server Error" , {status: 500})
} 
}