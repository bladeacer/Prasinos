import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import { EverythingWrapper } from './pages/reusables/page_wrapper';

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


  // Note to self: Make an everything wrapper 

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <TopNavbarV2></TopNavbarV2>
        {EverythingWrapper()}

        <Routes>
          <Route path={"/"} element={EverythingWrapper()} />
          <Route path={"/booking"} element={EverythingWrapper()} />
          <Route path={"/events"} element={EverythingWrapper()} />
          <Route path={"/rewards"} element={EverythingWrapper()} />
          <Route path={"/support"} element={EverythingWrapper()} />
          {!user && (
            <>
              <Route path={"/register"} element={EverythingWrapper()} />
              <Route path={"/login"} element={EverythingWrapper()} />
            </>
          )}

        </Routes>

      </Router>
    </UserContext.Provider>
  );
}