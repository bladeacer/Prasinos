import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import 'bootstrap/dist/css/bootstrap.min.css';
// import Header from './Header.jsx';
import MyTheme from './themes/MyTheme';
import HomePage from './pages/HomePage';
import Bookings from './pages/Bookings';
import EditBooking from './pages/EditBooking';
import MyForm from './pages/MyForm';
import Register from './pages/Register';
import Login from './pages/Login';
import BookEventPage from './pages/BookEventPage';
import EventListPage from './pages/EventListPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import StaffBooking from './pages/StaffBooking';
import PaymentPage from './pages/PaymentPage';
import http from './http';
import UserContext from './contexts/UserContext';
import Dashboard from './pages/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        setIsLoading(true);
        try {
          const res = await http.get('/user/auth');
          setUser(res.data.user);
        } catch (error) {
          console.error("Error during authentication:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
          <AppBar position="static" className="AppBar">
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/">
                  <Typography variant="h6" component="div">
                    Prasinos
                  </Typography>
                </Link>
                <Link to="/staffbooking"><Typography>Bookings - Staff</Typography></Link>
                <Link to="/dashboard"><Typography>Dashboard - Staff</Typography></Link>
                {user && (
                  <Link to={`/bookings/${user.id}`}><Typography>Bookings - User</Typography></Link>
                )}
                <Link to="/eventlistpage"><Typography>Events</Typography></Link>
                <Box sx={{ flexGrow: 1 }}></Box>
                {user && (
                  <>
                    <Typography>{user.name}</Typography>
                    <Button onClick={logout}>Logout</Button>
                  </>
                )}
                {!user && (
                  <>
                    <Link to="/register"><Typography>Register</Typography></Link>
                    <Link to="/login"><Typography>Login</Typography></Link>
                  </>
                )}
              </Toolbar>
            </Container>
          </AppBar>

          <Container sx={{ display: 'flex' }}>
            <Box sx={{ flexGrow: 1, padding: 2 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/bookings/:id" element={<Bookings />} />
                <Route path="/editbooking/:id" element={<EditBooking />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/form" element={<MyForm />} />
                <Route path="/bookeventpage/:id" element={<BookEventPage />} /> {/* Updated route */}
                <Route path="/eventlistpage" element={<EventListPage />} />
                <Route path="/payment" element={<PaymentPage />} /> {/* Routing to Payments Page */}
                <Route path="/booking-success" element={<BookingSuccessPage />} />
                <Route path="/staffbooking" element={<StaffBooking />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </Box>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
