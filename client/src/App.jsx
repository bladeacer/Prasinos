import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header.jsx';
import Chatbot from './pages/Chatbot.jsx';
import EventFeedback from './pages/EventFeedback.jsx'
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
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
