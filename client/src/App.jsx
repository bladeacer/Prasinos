import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import logo from './assets/Logo.png';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { Typography } from '@mui/material';
import { LinkContainer } from 'react-router-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import http from './http';
import './App.css';
import UserContext from "./contexts/UserContext";
import Homepage from './pages/Homepage.jsx';
import Register from './pages/Register';
import Login from './pages/Login';

// Branden
import EventFeedback from './pages/EventFeedback.jsx';
import EditEventFeedback from './pages/EditEventFeedback.jsx';
import WebsiteFeedback from './pages/WebsiteFeedback.jsx';
import EditWebsiteFeedback from './pages/EditWebsiteFeedback.jsx';
import RetrieveEventFb from './pages/RetrieveEventFb.jsx';
import RetrieveWebsiteFbS from './pages/RetrieveWebsiteFbS.jsx';
import RetrieveWebsiteFbU from './pages/RetrieveWebsiteFbU.jsx';
import ViewWebsitefb from './pages/ViewWebsitefb.jsx';
import Reply from './pages/Reply';
import ChatBot from './pages/Chatbot.jsx';
import chatbotIcon from './assets/chatbot-icon.png';

// Jun Long
import AddReward from "./pages/AddReward"; // Staff
import Reward from "./pages/Rewards"; // Staff
import EditReward from "./pages/EditReward"; // Staff
import UserRewards from "./pages/UserRewards"; // User

// Manveer + Zara
import EventsProposal from './pages/Events';
import Events from './pages/UserEventListPage';
import AddEvent from './pages/AddEvent';
import AdminDashboard from './pages/AdminDashboard';
import EditEvent from './pages/EditEvent';
import Bookings from './pages/Bookings';
import EditBooking from './pages/EditBooking';
import MyForm from './pages/MyForm';
import ReviewEvent from './pages/ReviewEvent';
import BookEventPage from './pages/BookEventPage';
import EventListPage from './pages/EventListPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import EventAttendance from './pages/Attendance';
import ViewEvent from './pages/ViewEvent';

function App() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoading(true);
      http.get('/user/auth').then((res) => {
        setUser(res.data.user);
        setIsLoading(false);
      }).catch(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [localStorage.getItem("accessToken")]);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  const handleChatbotClick = () => {
    setShowChatbot(!showChatbot);
  };
  function ProtectedRoute({ children, allowedRoles }) {

    if (!user || !allowedRoles.includes(user.role)) {
      // Redirect user to home page if not allowed
      console.log("Redirecting to events");
      console.log(user);
      return <Events replace />;
    }

    return children;
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <Navbar className="bg-body-tertiary fixed-top" bg="light" data-bs-theme="light" expand="lg" style={{ paddingTop: "0", paddingBottom: "0", paddingRight: "2%" }}>
          <Container fluid>
            <Navbar.Brand href="/" className="navbar-brand-custom" style={{ paddingLeft: "4%" }}>
              <img alt="" src={logo} width="250" height="90" className="d-inline-block align-top" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
              <Nav className="ml-auto">
                <LinkContainer to="/" style={{ paddingRight: "3%" }}>
                  <Nav.Link>Home</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/eventlistpage" style={{ paddingRight: "3%" }}>
                  <Nav.Link>Events</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/websitefeedback" style={{ paddingRight: "3%" }}>
                  <Nav.Link>Contact</Nav.Link>
                </LinkContainer>
                {user && (
                  <>
                    <Typography style={{ marginTop: "2%", marginRight: "2%" }}>{user.name}</Typography>
                    <Button className="sign" onClick={logout}>Logout</Button>
                  </>
                )}
                {user && (
                  <Link to={`/user-rewards/${user.id}`}>
                    <Typography>User - Rewards</Typography>
                  </Link>
                )}
                {user && (
                  <Link to="/rewards">
                    <Typography>Staff - Rewards</Typography>
                  </Link>
                )}
                {user && user.role === 'admin' && (
                  <>
                    <Link to="/dashboard"><Typography>Dashboard</Typography></Link>
                  </>
                )}
                {user && user.role === 'admin' && (
                  <>
                    <Link to="/reviewevent"><Typography>Review Event</Typography></Link>
                  </>
                )}
                {user && user.role !== 'admin' && (
                  <>
                    <Link to="/eventsproposal"><Typography>Events Proposal</Typography></Link>
                  </>
                )}
                {user && user.role === 'admin' && (
                  <>
                    <Link to="/bookings"><Typography>Bookings - Staff</Typography></Link>
                  </>
                )}
                {!user && (
                  <>
                    <LinkContainer to="/register">
                      <Button variant="secondary" className="sign2">Register</Button>
                    </LinkContainer>
                    <LinkContainer to="/login">
                      <Button variant="success" className="sign2">Login</Button>
                    </LinkContainer>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Container>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            {/* Branden */}
            <Route path="/eventfeedback" element={<EventFeedback />} />
            <Route path="/editeventfeedback/:id" element={<EditEventFeedback />} />
            <Route path="/websitefeedback" element={<WebsiteFeedback />} />
            <Route path="/editwebsitefeedback/:id" element={<EditWebsiteFeedback />} />
            <Route path="/retrieveeventfb" element={<RetrieveEventFb />} />
            <Route path="/retrievewebsitefb" element={<RetrieveWebsiteFbS />} />
            <Route path="/retrievewebsitefbuser" element={<RetrieveWebsiteFbU />} />
            <Route path="/viewwebsitefb/:id" element={<ViewWebsitefb />} />
            <Route path="/chatbot" element={<ChatBot />} />
            <Route path="/replywebsitefb/:id" element={<Reply />} />
            {/* Jun Long */}
            <Route path="/rewards" element={<Reward />} />
            <Route path="/addreward" element={<AddReward />} />
            <Route path="/editreward/:id" element={<EditReward />} />
            <Route path="/user-rewards/:userid" element={<UserRewards />} />
            <Route
              path="/user-rewards/:userid/redeemed-rewards"
              element={<UserRewards />}
            />
            {/* Manveer + Zara */}
            <Route path={"/events"} element={<Events />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path={"/eventsproposal"} element={<EventsProposal />} />
            <Route path="/editbooking/:id" element={<EditBooking />} />
            <Route path="/form" element={<MyForm />} />
            <Route path="/bookeventpage/:id" element={<BookEventPage />} /> {/* Updated route */}
            <Route path="/eventlistpage" element={<EventListPage />} />
            <Route path="/payment" element={<PaymentPage />} /> {/* Routing to Payments Page */}
            <Route path="/paymentsuccess" element={<PaymentSuccessPage />} />
            <Route path={"/addevent"} element={<AddEvent />} />
            <Route path={"/editevent/:id"} element={<EditEvent />} />
            <Route path={"/event/:id"} element={<ViewEvent />} />
            <Route path={"/register"} element={<Register />} />
            <Route path={"/reviewevent"} element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ReviewEvent />
              </ProtectedRoute>
            } />
            <Route path={"/dashboard"} element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path={"/attendance/:eventId"} element={<EventAttendance />} /> {/* Add the new route */}
          </Routes>
          <div className="chatbot-icon-container" onClick={handleChatbotClick}>
            <img src={chatbotIcon} alt="Chatbot" className="chatbot-icon" />
          </div>
          {showChatbot && <ChatBot />}
        </Container>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
