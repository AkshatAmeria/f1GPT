// "use client"

// import Image from "next/image"
// import f1GPTLogo from "./assets/f1GPTLogo.png"
// import { Message } from "ai"
// import { useChat } from "ai/react"
// import Bubble from "./components/Bubble"
// import LoadingBubble from "./components/LoadingBubble"
// import PromptSuggestionRow from "./components/PromptSuggestionsRow"


// const Home = () => {

// const {append, isLoading , messages , input , handleInputChange, handleSubmit } = useChat()

//     const noMessages = !messages || messages.length === 0

// const handlePrompt  = ( promptText ) => {
//     const msg:Message = {
//         id: crypto.randomUUID(),
//         content: promptText,
//         role:"user"
//     }
//     append(msg)
// }

//     return (
// <main>
//     <Image src={f1GPTLogo} alt="f1GPT Logo" width={200} height={200}  />
//     <section className={noMessages ? "" : "populated"}>
//         {noMessages ? (
// <>
// <p className="starter-text">
// The Ultimate F1 Companion: Your Personal AI-Powered Racing Assistant! Ask me anything about Formula 1.We hope you enjoy using Formula One GPT!
// </p>
// <br/>
// <PromptSuggestionRow onPromptClick={handlePrompt}/>
// </>
//         ):(
// <>
// {/* map messages onto text bubbles */}
// {messages.map((message, index) => <Bubble key={`message-${index}`} message = {message}/>)} 
// {isLoading && <LoadingBubble/>}
// </>
//         )}
     
//     </section>

//        <form onSubmit={handleSubmit}>
// <input className="question-box" onChange={handleInputChange} value={input} placeholder="Ask me something...."/>
// <input type="submit"/>
//         </form>

// </main>
//     )
// }
// export default Home


"use client"

import Image from "next/image"
import f1GPTLogo from "./assets/f1GPTLogo.png"
import { Message } from "ai"
import { useChat } from "ai/react"
import Bubble from "./components/Bubble"
import LoadingBubble from "./components/LoadingBubble"
import PromptSuggestionRow from "./components/PromptSuggestionsRow"

const Home = () => {
  const { append, isLoading, messages, input, handleInputChange, handleSubmit } = useChat()
  const noMessages = !messages || messages.length === 0

  const handlePrompt = (promptText) => {
    const msg = {
      id: crypto.randomUUID(),
      content: promptText,
      role: "user",
    }
    append(msg)
  }

  return (
    <main>
      {/* Header Section with Logo + Title */}
      <div className="header">
        <Image src={f1GPTLogo} alt="Formula One GPT Logo" width={160} height={160} />
        <h1 className="f1-title">
          Formula <span>One GPT</span>
        </h1>
      </div>

      <section className={noMessages ? "" : "populated"}>
        {noMessages ? (
          <>
            <p className="starter-text">
              The Ultimate F1 Companion: Your Personal AI-Powered Racing Assistant! 🏎️  
              Ask me anything about Formula 1 — drivers, races, stats, and history.
            </p>
            <br />
            <PromptSuggestionRow onPromptClick={handlePrompt} />
          </>
        ) : (
          <>
            {messages.map((message, index) => (
              <Bubble key={`message-${index}`} message={message} />
            ))}
            {isLoading && <LoadingBubble />}
          </>
        )}
      </section>

      <form onSubmit={handleSubmit}>
        <input
          className="question-box"
          onChange={handleInputChange}
          value={input}
          placeholder="Ask me something about Formula 1..."
        />
        <input type="submit" value="Send" />
      </form>
    </main>
  )
}

export default Home
