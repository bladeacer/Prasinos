import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Events from './pages/Events';
import AddEvent from './pages/AddEvent';
import AdminDashboard from './pages/AdminDashboard';
import EditEvent from './pages/EditEvent';
import MyForm from './pages/MyForm';
import Register from './pages/Register';
import ReviewEvent from './pages/ReviewEvent';
import Login from './pages/Login';
import http from './http';
import UserContext from './contexts/UserContext';
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
                    <Link to="/events"><Typography>Events</Typography></Link>
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

          <Container>
            <Routes>
              <Route path={"/"} element={<Events />} />
              <Route path={"/events"} element={<Events />} />
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
              <Route path={"/login"} element={<Login />} />
              <Route path={"/form"} element={<MyForm />} />
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
