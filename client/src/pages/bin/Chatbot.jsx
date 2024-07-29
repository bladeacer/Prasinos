import React from 'react'
import Chatbot from 'react-chatbot-kit'
import '../App.css';
import 'react-chatbot-kit/build/main.css';
import config from '../config.jsx';
import MessageParser from './MessageParser.jsx';
import ActionProvider from './ActionProvider.jsx';

function Chatbots() {
    return (
        <>
            <div style={{ marginTop: "150px", backgroundColor: "black", paddingLeft: "100px", width: "800px"}}>
                <Chatbot
                    config={config}
                    messageParser={MessageParser}
                    actionProvider={ActionProvider}
                />
            </div>
        </>
    );
}

export default Chatbots;