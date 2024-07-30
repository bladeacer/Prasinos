import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyTheme from './themes/MyTheme';
import EventsProposal from './pages/Events';
import Events from './pages/UserEventListPage';
import AddEvent from './pages/AddEvent';
import AdminDashboard from './pages/AdminDashboard';
import EditEvent from './pages/EditEvent';
import HomePage from './pages/HomePage';
import Bookings from './pages/Bookings';
import AddBooking from './pages/AddBooking';
import EditBooking from './pages/EditBooking';
import MyForm from './pages/MyForm';
import Register from './pages/Register';
import ReviewEvent from './pages/ReviewEvent';
import Login from './pages/Login';
import BookEventPage from './pages/BookEventPage';
import EventListPage from './pages/EventListPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import http from './http';
import UserContext from './contexts/UserContext';
import EventAttendance from './pages/Attendance';
import ViewEvent from './pages/ViewEvent';
import Logo from './pages/prasinos-logo.jpg';

function App() {
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
        <ThemeProvider theme={MyTheme}>
          <AppBar position="static" className="AppBar" color='navbar'>
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                  <img src={Logo} alt="Logo" style={{ marginLeft: 10, height: 50 }} />
                </Link>
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
                    <Link to="/eventlistpage"><Typography>Events</Typography></Link>
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
                <Route path="/" element={<HomePage />} />
                <Route path={"/events"} element={<Events />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/addbooking" element={<AddBooking />} />
                <Route path={"/eventsproposal"} element={<EventsProposal />} />
                <Route path="/editbooking/:id" element={<EditBooking />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
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
            </Box>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
