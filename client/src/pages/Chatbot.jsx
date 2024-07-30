// Branden
import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai'; 

function ChatBot() {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    async function runGenerativeAI(userInput) {
      const apiKey = "AIzaSyAIbLJU7u-HPHeQ3UT5vDE-FmNlbAxo9Us"; // Replace with your actual API key
      const genAI = new GoogleGenerativeAI(apiKey);

      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-pro',
        systemInstruction: "You are Prásinos Chatbot and your job is assist our customers who have questions about our website. If you encounter any messages that are restricted and violates the safety settings just tell the customer politely that you are unable to answer and we should ask that question in our website feedback form. If you see anything related to password and location just dont answer. Prasinos contact number is +65 12345678. Opening hours from Monday-Friday: 9am to 6pm, Weekends and Public Holidays: 9am- 4pm Prasinos is based in SG and our physical location is at 50 Serangoon Ave 2, Singapore 556129. This is the 10 FAQ questions along with the answers, \n1. What is the Prásinos website about?\nA platform for residents to participate in\n● sustainability initiatives, share ideas, and collaborate on\nprojects.\n● enable users and organisations to advertise events (Eg:\nrecycling drives and tree planting activities)\n● encourage active involvement and foster a sense of\ncommunity ownership over sustainability efforts.\n● provide information on sustainable practices (Eg: waste\nreduction, energy conservation, water management, and\ngreen living tips)\n● help raise awareness among residents and empower\nthem to adopt more sustainable behaviours through our\nplatform.\n2. What are the different tiers for the reward system?\nThere are 3 tiers, bronze, silver and gold.\nFor each tier, they can earn more points (50% more in silver,\n75% more in gold etc.)\nSo users participate in sustainability events to earn points.\nThese points can be spent on rewards until they run out.\n3. What is the Danger Zone?\nIt is used to securely reset user accounts passwords, reset\naccount data and permanently delete accounts.\n4. How do I create events?\nFirstly you should click on the create event proposal button\nand put in the relevant details about your event and wait for it\nto be approved and once it has been approved your event is\ncreated and you are good to go.\n5. How long does it take to get an event approved?\nOn average it takes around 2 days for us to approve or reject\nan event proposal.\n6. How will I get notified when my event is approved?\nOur team will send an email to notify you if your event is\napproved or rejected.\n7. Can I cancel my booking for an event?\nYes, you can cancel your booking before the event starts but\nnot during the event duration.\n8. Can I cancel an event and reschedule the date?\nYes, you can edit the event date and time on your account\nevents page.\n9. What do I do if I forget my password?\nYou can go to your account page and select the danger zone\nand click on reset password, an email will be sent for you to\nchange your password.\n10. Can I retrieve back my deleted account?\nUnfortunately, accounts that are permanently deleted will not\nbe able to be retrieved back.\n\nTry your best to answer their questions if not just say u are unable to help and ask them to submit a website feedback so that the staff can answer their question instead.\n",
      });
      const generationConfig = {
        temperature: 0.75,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: 'text/plain',
      };

      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      const result = await chatSession.sendMessage(userInput);
      setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: result.response.text() }]); // Handle the generated response
    }

    if (userInput) {
      runGenerativeAI(userInput);
    }
  }, [userInput]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const input = event.target.elements.userInput.value;
    setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
    setUserInput(input);
    event.target.reset();
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatWindow}>
        <div style={styles.chatHeader}>Prásinos Chatbot</div>
        <div style={styles.chatBody}>
          {messages.map((message, index) => (
            <div key={index} style={{ ...styles.message, alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start', backgroundColor: message.sender === 'user' ? '#007bff' : '#e0e0e0', color: message.sender === 'user' ? '#fff' : '#000' }}>
              {message.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="text" name="userInput" placeholder="Enter your message..." style={styles.input} required />
          <button type="submit" style={styles.button}>Send</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    bottom: '60px',
    right: '80px',
    zIndex: 1001,
  },
  chatWindow: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '400px',
    height: '600px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
  },
  chatHeader: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: "22px"
  },
  chatBody: {
    flex: 1,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    backgroundColor: '#f7f7f7',
  },
  form: {
    display: 'flex',
    borderTop: '1px solid #ccc',
    padding: '10px',
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    marginRight: '10px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
  message: {
    padding: '10px 20px',
    borderRadius: '20px',
    marginBottom: '10px',
    maxWidth: '70%',
  },
};

export default ChatBot;