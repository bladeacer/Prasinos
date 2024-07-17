import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Bookings from './pages/Bookings';
import AddBooking from './pages/AddBooking';
import EditBooking from './pages/EditBooking';
import MyForm from './pages/MyForm';
import Register from './pages/Register';
import Login from './pages/Login';
import BookEventPage from './pages/BookEventPage';
import EventListPage from './pages/EventListPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import http from './http';
import UserContext from './contexts/UserContext';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
        setUser(res.data.user);
      });
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
          <AppBar position="static" className="AppBar">
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/">
                  <Typography variant="h6" component="div">
                    Learning
                  </Typography>
                </Link>
                <Link to="/bookings"><Typography>Bookings - Staff</Typography></Link>
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
                <Route path="/" element={<Bookings />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/addbooking" element={<AddBooking />} />
                <Route path="/editbooking/:id" element={<EditBooking />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/form" element={<MyForm />} />
                <Route path="/bookeventpage/:id" element={<BookEventPage />} /> {/* Updated route */}
                <Route path="/eventlistpage" element={<EventListPage />} />
                <Route path="/payment" element={<PaymentPage />} /> {/* Routing to Payments Page */}
                <Route path="/paymentsuccess" element={<PaymentSuccessPage />} />
              </Routes>
            </Box>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
