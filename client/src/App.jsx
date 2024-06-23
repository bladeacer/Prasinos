import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header.jsx';
import Chatbot from './pages/Chatbot.jsx';
import EventFeedback from './pages/EventFeedback.jsx';
import EditEventFeedback from './pages/EditEventFeedback.jsx';
import WebsiteFeedback from './pages/WebsiteFeedback.jsx';
import EditWebsiteFeedback from './pages/EditWebsiteFeedback.jsx';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Header/>
      <Container>
        <Routes>
          <Route path="/" />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/eventfeedback" element={<EventFeedback />} />
          <Route path={"/editeventfeedback/:id"} element={<EditEventFeedback />} />
          <Route path="/websitefeedback" element={<WebsiteFeedback />} />
          <Route path={"/editwebsitefeedback/:id"} element={<EditWebsiteFeedback />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
