import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button, Box, Drawer, List, ListItemButton, ListItemText, IconButton } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import UserContext1 from './contexts/UserContext';
import { UserContext, StaffContext } from './contexts/Contexts';
import http from './http';
import ResetPassword from './pages/ResetPassword';
import { is_accent, goof_check } from './pages/reusables/accent_parser';
import { HomeWrapper, BookingWrapper, EventWrapper, RewardsWrapper, SupportWrapper, SelectLogWrapper, EverythingWrapper } from './pages/reusables/wrappers';
import EditUser from './pages/EditUser';
import StaffLogin from './pages/staffLogin';
import StaffRegister from './pages/staffRegister';
import StaffHome from './pages/staffHomev2';
import Verify from './pages/Verify';
import MyTheme from './themes/MyTheme';
import Unauthorized from './pages/Unauthorized';
import DangerZone from './pages/dangerZone'
import Settings from './pages/Settings';
import TopNavbarV2 from './pages/reusables/top_navbarv2';
import VerifyHandler from './pages/Verifyhandler';
import Logo from './pages/prasinos-logo.jpg';
import Homepage from './pages/HomePage';
import EventFeedback from './pages/EventFeedback';
import EditEventFeedback from './pages/EditEventFeedback';
import WebsiteFeedback from './pages/WebsiteFeedback';
import EditWebsiteFeedback from './pages/EditWebsiteFeedback';
import RetrieveEventFb from './pages/RetrieveEventFb';
import RetrieveWebsiteFbS from './pages/RetrieveWebsiteFbS';
import RetrieveWebsiteFbU from './pages/RetrieveWebsiteFbU';
import ViewWebsitefb from './pages/ViewWebsitefb';
import Register from './pages/Register';
import Login from './pages/Login';
import ChatBot from './pages/Chatbot';
import Reply from './pages/Reply';
import Reward from './pages/Rewards';
import AddReward from './pages/AddReward';
import UserRewards from './pages/UserRewards';
import Events from './pages/UserEventListPage';
import Bookings from './pages/Bookings';
import AddBooking from './pages/AddBooking';
import EventsProposal from './pages/Events';
import EditBooking from './pages/EditBooking';
import MyForm from './pages/MyForm';
import Dashboard from './pages/Dashboard';
import BookEventPage from './pages/BookEventPage';
import EventListPage from './pages/EventListPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import StaffBooking from './pages/StaffBooking';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import ViewUsers from './pages/staffHomev2';
import AddEvent from './pages/AddEvent';
import EditEvent from './pages/EditEvent';
import ViewEvent from './pages/ViewEvent';
import EditReward from './pages/EditReward';
import ReviewEvent from './pages/ReviewEvent';
import AdminDashboard from './pages/AdminDashboard';
import EventAttendance from './pages/Attendance';
import chatbotIcon from './assets/chatbot-icon.png';
import ForgetPassword from './pages/ForgetPassword';
import AboutUs from './pages/AboutUs';

const App = () => {
  const [user, setUser] = useState(null);
  const [staff, setStaff] = useState(null);

  const [showChatbot, setShowChatbot] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        setIsLoading(true);
        try {
          const res = await http.get('/user/auth');
          setUser(res.data.user);
          //   http.get('/staff/auth').then((res) => {
          //     setStaff(res.data.staff);
          // });
          console.log("Response data:", res.data); // Log the entire response data
          console.log("User role:", res.data.user.role); // Log the user role from response
        } catch (error) {
          console.error("Error during authentication:", error); // Log any errors
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      console.log("User state updated:", user); // Log the updated user state
    }
  }, [user]);

  const handleChatbotClick = () => {
    setShowChatbot(!showChatbot);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location = "/";
  };

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  function ProtectedRoute({ children, allowedRoles }) {
    console.log("ProtectedRoute user:", user); // Debug log

    if (!user || !allowedRoles.includes(user.role)) {
      // Redirect user to home page if not allowed
      console.log("Redirecting to events");
      console.log(user);
      return <Events replace />;
    }

    return children;
  }

  const adminDrawer = (
    <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
      <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
        <List>
          <ListItemButton component={Link} to="/">
            <ListItemText primary="Home" />
          </ListItemButton>
          <ListItemButton component={Link} to="/dashboard">
            <ListItemText primary="Dashboard" />
          </ListItemButton>
          <ListItemButton component={Link} to="/rewards">
            <ListItemText primary="Rewards" />
          </ListItemButton>
          <ListItemButton component={Link} to="/reviewevent">
            <ListItemText primary="Review Event" />
          </ListItemButton>
          <ListItemButton component={Link} to="/staffbooking">
            <ListItemText primary="Bookings" />
          </ListItemButton>
          <ListItemButton component={Link} to="/retrievewebsitefb">
            <ListItemText primary="Website Feedback" />
          </ListItemButton>
          <ListItemButton component={Link} to="/viewusers">
            <ListItemText primary="View Users" />
          </ListItemButton>
          <ListItemButton component={Link} to="/staffRegister">
            <ListItemText primary="Register Staff" />
          </ListItemButton>
          <ListItemButton component={Link} to="/admindashboard">
            <ListItemText primary="Booking Dashboard" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
  

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
          <AppBar position="fixed" className="AppBar" color='navbar'>
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                  <img src={Logo} alt="Logo" style={{ marginLeft: 10, height: 50 }} />
                </Link>
                {user && user.role === 'admin' && (
                  <>
                    <IconButton onClick={toggleDrawer(true)} edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} style={{ marginLeft: "-17%"}}>
                      <MenuIcon />
                    </IconButton>
                    {adminDrawer}
                  </>
                )}
                {user && user.role !== 'admin' && (
                  <>
                    <Link to={'/home'}><Typography>Home</Typography></Link>
                    <Link to={`/user-rewards/${user.id}`}><Typography>Rewards</Typography></Link>
                    <Link to={`/bookings/${user.id}`}><Typography>Bookings</Typography></Link>
                    <Link to="/eventlistpage"><Typography>Events</Typography></Link>
                    <Link to="/eventsproposal"><Typography>Events Proposal</Typography></Link>
                    <Link to='/about'><Typography>About</Typography></Link>
                    <Link to="/websitefeedback"><Typography>Contact Us</Typography></Link>
                    <Link to='/settings'><Typography>Settings</Typography></Link>
                  </>
                )}
                <Box sx={{ flexGrow: 1 }}></Box>
                {user && (
                  <>
                    <Typography>{user.name}</Typography>
                    <Button onClick={logout}>Logout</Button>
                  </>
                )}
                {!user && (
                  <>
                    <Link to="/register" ><Typography>Register</Typography></Link>
                    <Link to="/login" ><Typography>Login</Typography></Link>
                  </>
                )}
              </Toolbar>
            </Container>
          </AppBar>
          <Container sx={{ display: 'flex' }}>
            <Box sx={{ flexGrow: 1, padding: 2 }}>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/home" element={<Homepage />} />
                <Route path="/viewusers" element={<ViewUsers />} />
                <Route path="/eventfeedback" element={<EventFeedback />} />
                <Route path="/editeventfeedback/:id" element={<EditEventFeedback />} />
                <Route path="/websitefeedback" element={<WebsiteFeedback />} />
                <Route path="/editwebsitefeedback/:id" element={<EditWebsiteFeedback />} />
                <Route path="/retrieveeventfb" element={<RetrieveEventFb />} />
                <Route path="/retrievewebsitefb" element={<RetrieveWebsiteFbS />} />
                <Route path="/retrievewebsitefbuser" element={<RetrieveWebsiteFbU />} />
                <Route path="/viewwebsitefb/:id" element={<ViewWebsitefb />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/bookings/:id" element={<Bookings />} />
                <Route path="/chatbot" element={<ChatBot />} />
                <Route path="/replywebsitefb/:id" element={<Reply />} />
                <Route path="/rewards" element={<Reward />} />
                <Route path="/addreward" element={<AddReward />} />
                <Route path="/user-rewards/:userid" element={<UserRewards />} />
                <Route path="/user-rewards/:userid/redeemed-rewards" element={<UserRewards />} />
                <Route path="/events" element={<Events />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/addbooking" element={<AddBooking />} />
                <Route path="/eventsproposal" element={<EventsProposal />} />
                <Route path="/editbooking/:id" element={<EditBooking />} />
                <Route path="/form" element={<MyForm />} />
                <Route path="/bookeventpage/:id" element={<BookEventPage />} />
                <Route path="/eventlistpage" element={<EventListPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/paymentsuccess" element={<PaymentSuccessPage />} />
                <Route path="/addevent" element={<AddEvent />} />
                <Route path="/editevent/:id" element={<EditEvent />} />
                <Route path="/event/:id" element={<ViewEvent />} />
                <Route path="/editreward/:id" element={<EditReward />} />
                <Route path="/resetpassword" element={<ResetPassword />} />
                <Route path="/staffLogin" element={<StaffLogin />} />
                <Route path="/staffRegister" element={<StaffRegister />} />
                <Route path="/staffHome" element={<StaffHome />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/booking-success" element={<BookingSuccessPage />} />
                <Route path="/staffbooking" element={<StaffBooking />} />
                <Route path="/admindashboard" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/verifyhandler" element={<VerifyHandler />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/dangerzone" element={<DangerZone />} />
                <Route path="/edit" element={<EditUser />} />
                <Route path="/resetendpoint" element={<ResetPassword />} />
                <Route path="/reset" element={<ForgetPassword />} />
                <Route path="/about" element={<AboutUs />} />



                <Route path="/reviewevent" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ReviewEvent />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/attendance/:eventId" element={<EventAttendance />} />
              </Routes>
              {(!user || (user && user.role !== 'admin')) && (
                <>
                  <div className="chatbot-icon-container" onClick={handleChatbotClick}>
                    <img src={chatbotIcon} alt="Chatbot" className="chatbot-icon" />
                  </div>
                  {showChatbot && <ChatBot />}
                </>
              )}
            </Box>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
};

export default App;