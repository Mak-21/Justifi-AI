import React, { useState, useRef, useEffect } from "react";
import styles from "./AskJuris.module.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";
//ask juris implemented
const AskJuris = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(true);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add the user's message to the chat
    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    
    // Enable scrolling for user message
    setShouldScroll(true);
    
    // Show loading indicator
    setIsLoading(true);

    try {
      // Use serverless function endpoint
      const response = await axios.post('/.netlify/functions/chat', {
        prompt: input,
      });
    
      // Add the bot's response to the chat
      setShouldScroll(false);
      const botMessage = {
        text: response.data,
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error communicating with the backend:", error);
      const errorMessage = {
        text: "Oops! Something went wrong. Please try again.",
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !isLoading) {
      handleSend();
    }
  };

  useEffect(() => {
    // Only scroll if shouldScroll is true (user's message) or it's the initial welcome message
    if (shouldScroll && chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, shouldScroll]);

  // Define custom components for ReactMarkdown
  const markdownComponents = {
    h2: ({node, ...props}) => <h2 className={styles.markdownH2} {...props} />,
    h3: ({node, ...props}) => <h3 className={styles.markdownH3} {...props} />,
    ul: ({node, ...props}) => <ul className={styles.markdownUl} {...props} />,
    ol: ({node, ...props}) => <ol className={styles.markdownOl} {...props} />,
    li: ({node, ...props}) => <li className={styles.markdownLi} {...props} />,
    p: ({node, ...props}) => <p className={styles.markdownP} {...props} />,
    strong: ({node, ...props}) => <strong className={styles.markdownStrong} {...props} />,
    em: ({node, ...props}) => <em className={styles.markdownEm} {...props} />,
    code: ({node, ...props}) => <code className={styles.markdownCode} {...props} />,
    a: ({node, ...props}) => <a className={styles.markdownA} {...props} />
  };

  return (
    <div className={styles.chatbot}>
      <header className={styles.header}>
        <h1>Ask Juris AI</h1>
      </header>

      <div className={styles.chatWindow} ref={chatWindowRef}>
        {messages.length === 0 ? (
          <div className={styles.welcomeMessage}>
            <p>Hello! I'm Juris, your legal AI assistant.</p>
            <p>Ask me any legal question, and I'll do my best to help you with accurate information based on US federal law.</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                message.sender === "user" ? styles.messageUser : styles.messageBot
              }`}
            >
              {message.sender === "bot" ? (
                <div className={styles.markdownWrapper}>
                  <ReactMarkdown components={markdownComponents}>
                    {message.text}
                  </ReactMarkdown>
                </div>
              ) : (
                message.text
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className={`${styles.message} ${styles.messageBot}`}>
            <div className={styles.loadingDots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.inputContainer}>
        <input
          className={styles.input}
          type="text"
          placeholder="Ask legal questions..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button 
          className={styles.button} 
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? (
            <div className={styles.spinnerButton}>
              <div className={styles.spinner}></div>
            </div>
          ) : (
            "Ask"
          )}
        </button>
      </div>
    </div>
  );
};

export default AskJuris;