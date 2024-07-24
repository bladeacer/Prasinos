import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header.jsx';
import Chatbots from './pages/Chatbot.jsx';
import EventFeedback from './pages/EventFeedback.jsx';
import EditEventFeedback from './pages/EditEventFeedback.jsx';
import WebsiteFeedback from './pages/WebsiteFeedback.jsx';
import EditWebsiteFeedback from './pages/EditWebsiteFeedback.jsx';
import RetrieveEventFb from './pages/RetrieveEventFb.jsx';
import RetrieveWebsiteFbS from './pages/RetrieveWebsiteFbS.jsx';
import RetrieveWebsiteFbU from './pages/RetrieveWebsiteFbU.jsx';
import ViewWebsitefb from './pages/ViewWebsitefb.jsx';
import Homepage from './pages/Homepage.jsx'
import Register from './pages/Register';
import Login from './pages/Login';
import Test from './pages/test';
import Reply from './pages/Reply';
import Chatgpt from './pages/Chatgpt';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Header/>
      <Container>
        <Routes>
          <Route path="/" element={<Homepage/>}/>
          <Route path="/chatbot" element={<Chatbots />} />
          <Route path="/eventfeedback" element={<EventFeedback />} />
          <Route path={"/editeventfeedback/:id"} element={<EditEventFeedback />} />
          <Route path="/websitefeedback" element={<WebsiteFeedback />} />
          <Route path={"/editwebsitefeedback/:id"} element={<EditWebsiteFeedback />} />
          <Route path={"/retrieveeventfb"} element={<RetrieveEventFb />} />
          <Route path={"/retrievewebsitefb"} element={<RetrieveWebsiteFbS />} />
          <Route path={"/retrievewebsitefbuser"} element={<RetrieveWebsiteFbU />} />
          <Route path={"/viewwebsitefb/:id"} element={<ViewWebsitefb />} />
          <Route path={"/register"} element={<Register />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/test"} element={<Test />} />
          <Route path={"/chatgpt"} element={<Chatgpt />} />
          <Route path={"/replywebsitefb/:id"} element={<Reply />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
