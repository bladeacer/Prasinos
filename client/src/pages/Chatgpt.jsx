import { useState } from 'react';
import '../App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

const API_KEY = "sk-proj-uRqqqHJVT5aM3BPg8LfMT3BlbkFJqgEZXPkVRV9STUC7X6EK";
const systemMessage = {
  role: "system", content: "Explain things like you're talking to a software professional with 2 years of experience."
};

function Chatgpt() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT",
      direction: "incoming"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages, retryCount = 0) {
    const maxRetries = 5;
    const retryDelay = 1000; // Initial delay of 1 second

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage,
        ...apiMessages
      ]
    };

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      }).then((data) => {
        return data.json();
        }).then((data) => {
        console.log(data);
      });

      if (response.status === 429) {
        if (retryCount < maxRetries) {
          console.log(`Retrying... Attempt ${retryCount + 1}`);
          await new Promise(resolve => setTimeout(resolve, retryDelay * (retryCount + 1)));
          return processMessageToChatGPT(chatMessages, retryCount + 1);
        } else {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.choices || !data.choices.length) {
        throw new Error("No response from ChatGPT");
      }

      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT",
        direction: "incoming"
      }]);
    } catch (error) {
      console.error("Error processing message:", error);
      setMessages([...chatMessages, {
        message: "There was an error processing your request.",
        sender: "ChatGPT",
        direction: "incoming"
      }]);
    } finally {
      setIsTyping(false);
    }
  }


  return (
    <div className="App">
      <div style={{ position: "relative", height: "600px", width: "700px", paddingTop: "150px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              {messages.map((message, i) => (
                <Message key={i} model={message} />
              ))}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default Chatgpt;
