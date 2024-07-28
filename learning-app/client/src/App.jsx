import "./App.css";
import http from "./http";
import UserContext from "./contexts/UserContext";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { useState, useEffect } from "react";
import MyTheme from "./themes/MyTheme";

import AddReward from "./pages/AddReward"; // Staff
import Reward from "./pages/Rewards"; // Staff
import EditReward from "./pages/EditReward"; // Staff

import UserRewards from "./pages/UserRewards"; // User

import Homepage from "./pages/Homepage";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    if (localStorage.getItem("accessToken")) {
      http.get("/user/auth").then((res) => {
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
                    Prasinos
                  </Typography>
                </Link>
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
                <Box sx={{ flexGrow: 1 }}></Box>
                {user ? (
                  <>
                    <Typography>{user.name}</Typography>
                    <Button onClick={logout}>Logout</Button>
                  </>
                ) : (
                  <>
                    <Link to="/register">
                      <Typography>Register</Typography>
                    </Link>
                    <Link to="/login">
                      <Typography>Login</Typography>
                    </Link>
                  </>
                )}
              </Toolbar>
            </Container>
          </AppBar>
          <Container>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/rewards" element={<Reward />} />
              <Route path="/addreward" element={<AddReward />} />
              <Route path="/editreward/:id" element={<EditReward />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/user-rewards/:userid" element={<UserRewards />} />
              <Route
                path="/user-rewards/:userid/redeemed-rewards"
                element={<UserRewards />}
              />
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
