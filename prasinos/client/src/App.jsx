import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import http from './http';
import UserContext from './contexts/UserContext';
import TopNavbarV2 from './pages/reusables/top_navbarv2'

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
        setUser(res.data.user);
      });
    }
  }, []);


  function falseAll() {
    for (var i = 0; i < is_accent.length; i++) {
      is_accent[i] = false
    };
  }

  var is_accent = [true, false, false, false, false, false, false, false];
  if (window.location.pathname.toString() == "/") {
    falseAll();
    is_accent[0] = true;
  }
  else if (window.location.pathname.toString() == "/booking") {
    falseAll();
    is_accent[1] = true;
  } else if (window.location.pathname.toString() == "/login") {
    is_accent[5] = true;
    is_accent[6] = false;
  } else if (window.location.pathname.toString() == "/register") {
    is_accent[6] = true;
    is_accent[5] = false;
  }

  const nav_state = is_accent;

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <TopNavbarV2></TopNavbarV2>

        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/register"} element={
            <>
              {nav_state[0] == true && (
                <>
                  <Home></Home>
                </>
              )}
              <Register></Register>
            </>
          } />
          <Route path={"/login"} element={
            <>
              {nav_state[0] == true && (
                <>
                  <Home></Home>
                </>
              )}
              <Login></Login>
            </>
          } />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}