import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

function ChatBot() {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);

  // Define urlRegex at the top level
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  useEffect(() => {
    async function runGenerativeAI(userInput) {
      const apiKey = "AIzaSyAIbLJU7u-HPHeQ3UT5vDE-FmNlbAxo9Us";
      const genAI = new GoogleGenerativeAI(apiKey);

      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-pro',
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
        ],
        systemInstruction: `
          You are Prásinos Chatbot and your job is to assist our customers who have questions about our website.
          
          If the user asks for a about us page link, respond with "Here is the link: http://localhost:3000/about"
          Do not put full stop when printing any links.
          
          Speak English as your default language unless the user asks you to switch to another language, tell them you can only speak English, Malay, Tamil and Mandarin/Chinese.
          
          If the user chooses the language they want please make sure to translate all the text instructions to that language and translate the user messages as well and also make sure u reply them in the language they want.
          
          If you encounter any messages that are restricted and violate the safety settings, just tell the customer politely that you are unable to answer and ask them to submit their question in our website feedback form in our About Page "Here is the link: http://localhost:3000/about"
          
          Try your best to answer their questions if not just politely ask them to clarify or go to the about us page with the link. 
          
          If you cannot, politely inform them that you are unable to help and ask them to go to the About Page and the FAQ section has section that links them to a website feedback form so that our staff can assist them.
          
          When you ask if there is anymore questions they have in the users preffered language and if they say no or anything that have the same meaning end the conversation there and greet them goodbye have a lovely day in their preffered language.
          
          Prásinos contact/phone number is +65 12345678.
          Opening hours:
            - Monday-Friday: 9am to 6pm
            - Weekends and Public Holidays: 9am to 4pm

          Prásinos is based in Singapore, and our physical location is at 50 Serangoon Ave 2, Singapore 556129.
          Ask this once
          1. Events (Put an emoji)
          2. Rewards (Put an emoji)
          3. Account (Put an emoji)
          4. Website (Put an emoji)
          5. Others which allows the user to choose between the question category they want to ask.
          If the user chooses one of those options ask them what question they have relating to that option do not list those 5 options again
       
          Here are the FAQ questions along with the answers:
          1. What is the Prásinos website about? (Please give a short summary of this answer like 2 sentences)
            - A platform founded in 2020 for residents to participate in sustainability initiatives, share ideas, and collaborate on projects.
            - Enable users and organizations to advertise events (e.g., recycling drives and tree planting activities).
            - Encourage active involvement and foster a sense of community ownership over sustainability efforts.
            - Provide information on sustainable practices (e.g., waste reduction, energy conservation, water management, and green living tips).
            - Help raise awareness among residents and empower them to adopt more sustainable behaviors through our platform.
       
          2. What are the different tiers for the reward system?
            - There are 3 tiers: bronze(0 - 5000 points), silver (5001 - 15000 points), and gold (Abover 15000 points).
            - For each tier, users can earn more points (e.g., 50% more in silver, 75% more in gold).
            - Users participate in sustainability events to earn points, which can be spent by redeeming rewards until they run out.
       
          3. What is the Danger Zone?
            - It is used to securely edit account details like username, phonenumber and email, reset user account passwords, reset account data, and permanently delete accounts.
       
          4. How do I create events/propose/make an event?
            - Click on "Event Proposal" in the navbar, enter the relevant details about your event and submit and wait for approval usually take 2-5 business days. Once approved, your event is created, and you're good to go.
       
          5. How long does it take to get an event approved?
            - It takes around 2 days on average for us to approve or reject an event proposal.
       
          6. How will I get notified when my event is approved?
            - Our team will send an email to notify you if your event is approved or rejected and you can see it in the event proposal section that shows the event you proposed and its status.
       
          7. Can I cancel my booking for an event?
            - Yes, you can cancel your booking before the event starts, but not during the event duration.
       
          8. Can I edit my event after it is approved?
            - Yes, you can edit the Event Scope, Expected Attendance, Start Date, End Date, Start time and End Time, Location, Description and Participation Fee but our staff will need to approve the event again.
       
          9. What do I do if I forget my password?
            - Go to your account page, select the Danger Zone, and click on "Reset Password". An email will be sent to you to change your password.
       
          10. Can I retrieve my deleted account?
              - Unfortunately, accounts that are permanently deleted cannot be retrieved.

          11. Can I cancel my Event after it is approved?
              - Unfortunately, you are not able to cancel your event once it has been approved you can try to email our team at PrásinosSG@gmail.com to work out a solution.

          12. Can I book events for other people?
              - You are able to book up to 10 people for an event but they will not be able to receive points and if the event has a participation fee ypu will need to pay for them as well.

          13. How do I book an event?
              - You can navigate to the event page which shows all the events that are available for you to register and you can click on the register now button and enter the number of people as well as their details and register.

          14. How do I earn points?
              - Users participate in sustainability events to earn points, which can be spent by redeeming rewards until they run out.

          15. Can I propose events with locations that are in other countries?
              - Our website is a global platform that allows people from different countries to propose events in different locations other than Singapore.

          16. Where is Prásinos location/based at?
              - Prásinos is based in Singapore, and our physical location is at 50 Serangoon Ave 2, Singapore 556129.
              - Opening hours:
                - Monday-Friday: 9am to 6pm
                - Weekends and Public Holidays: 9am to 4pm
       
          17. How do I contact Prásinos? (Their contact/phone number)
              - Prásinos contact/phone number is +65 12345678.

          18. Password?
              - If you have any issues related to forgetting or wanting to change your password please click on the danger zone button in your accounts page and reset your password there.

          19. Location/based at?
              - Prásinos is based in Singapore, and our physical location is at 50 Serangoon Ave 2, Singapore 556129.
                - Opening hours:
                  - Monday-Friday: 9am to 6pm
                  - Weekends and Public Holidays: 9am to 4pm

          20. About Page
              - "Here is the link: http://localhost:3000/about"

          21. WebsiteFeedback/Feedback
              - Website feedback can be found in the about page at question 11 of the FAQ which has a link in blue to the form.

          22. How to create create account/register?
              - Please click on the sign up button and enter your username, email as well as your password to register an account successfully to register for events.
       
          23. How to login?
              - Please press on the sign in button to type your email and password to log into your account.

          24. Can I cancel my booking?
              - You can cancel your booking only before the event starts and you will get a full refund if the event has a participation fee.
          
          25. If they cannot find the email we sent them
              - Just ask them to repeat the process or the email is probably in their spam folder.
          `,
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
      const parsedMessage = parseResponse(result.response.text());
      setMessages(prevMessages => [...prevMessages, parsedMessage]); // Handle the generated response
    }

    if (userInput) {
      runGenerativeAI(userInput);
    }
  }, [userInput]);

  const parseResponse = (response) => {
    if (response.startsWith('table:')) {
      const rows = response.replace('table:', '').split(';');
      const tableData = rows.map(row => row.split(','));
      return { type: 'table', data: tableData };
    } else if (urlRegex.test(response)) {
      const parts = response.split(urlRegex);
      return { type: 'link', parts };
    }
    return { type: 'text', sender: 'bot', content: response };
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const input = event.target.elements.userInput.value;
    setMessages(prevMessages => [...prevMessages, { type: 'text', sender: 'user', content: input }]);
    setUserInput(input);
    event.target.reset();
  };

  const renderMessage = (message, index) => {
    if (message.type === 'table') {
      return (
        <div key={index} style={{ ...styles.message, alignSelf: 'flex-start', backgroundColor: '#e0e0e0', color: '#000' }}>
          <table style={styles.table}>
            <tbody>
              {message.data.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} style={styles.tableCell}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (message.type === 'link') {
      return (
        <div key={index} style={{ ...styles.message, alignSelf: 'flex-start', backgroundColor: '#e0e0e0', color: '#000' }}>
          {message.parts.map((part, i) =>
            urlRegex.test(part) ? (
              <a key={i} href={part} rel="noopener noreferrer" style={styles.link}>
                {part}
              </a>
            ) : (
              part
            )
          )}
        </div>
      );
    }
    return (
      <div key={index} style={{ ...styles.message, alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start', backgroundColor: message.sender === 'user' ? '#007bff' : '#e0e0e0', color: message.sender === 'user' ? '#fff' : '#000' }}>
        {message.content}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatWindow}>
        <div style={styles.chatHeader}>Prásinos Chatbot</div>
        <div style={styles.chatBody}>
          {messages.map((message, index) => renderMessage(message, index))}
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
    color: '#000',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#ffffff',
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