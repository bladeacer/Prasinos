import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import http from './http';
import UserContext from './contexts/UserContext';
import TopNavbarV2 from './pages/reusables/top_navbarv2'

import Register from './pages/Register'
import Login from './pages/Login';
import Home from './pages/Home';
import Booking from './pages/Booking'
import Events from './pages/Events'
import Rewards from './pages/Rewards'
import Support from './pages/Support'
import SelectLogin from './pages/selectLogin';


function falseAll() {
  for (var i = 0; i < is_accent.length; i++) {
    is_accent[i] = false
  };
}

var is_accent = [true, false, false, false, false, false, false, false];
if (window.location.pathname.toString() == "/home") {
  falseAll();
  is_accent[0] = true;
}
else if (window.location.pathname.toString() == "/booking") {
  falseAll();
  is_accent[1] = true;
}
else if (window.location.pathname.toString() == "/events") {
  falseAll();
  is_accent[2] = true;
}
else if (window.location.pathname.toString() == "/rewards") {
  falseAll();
  is_accent[3] = true;
}
else if (window.location.pathname.toString() == "/support") {
  falseAll();
  is_accent[4] = true;
}
else if (window.location.pathname.toString() == "/login") {
  is_accent[5] = true;
  is_accent[6] = false;
} else if (window.location.pathname.toString() == "/register") {
  is_accent[6] = true;
  is_accent[5] = false;
}
else (
  falseAll()
)



function HomeWrapper() {
  return (
    <>
      {is_accent[0] && (
        <>
          <Home></Home>
        </>
      )}
    </>
  )
}
function BookingWrapper() {
  return (
    <>
      {is_accent[1] && (
        <>
          <Booking></Booking>
        </>
      )}
    </>
  )
}
function EventWrapper() {
  return (
    <>
      {is_accent[2] && (
        <>
          <Events></Events>
        </>
      )}
    </>
  )
}
function RewardsWrapper() {
  return (
    <>
      {is_accent[3] && (
        <>
          <Rewards></Rewards>
        </>
      )}
    </>
  )
}
function SupportWrapper() {
  return (
    <>
      {is_accent[4] && (
        <>
          <Support></Support>
        </>
      )}
    </>
  )
}
function LoginWrapper() {
  return (
    <>
      {is_accent[5] && (
        <>
          <Login></Login>
        </>
      )}
    </>
  )
}

function RegisterWrapper() {
  return (
    <>
      {is_accent[6] && (
        <>
          <Register></Register>
        </>
      )}
    </>
  )
}

function EverythingWrapper() {
  return (
    <>
      {RegisterWrapper()}
      {LoginWrapper()}
      {BookingWrapper()}
      {RewardsWrapper()}
      {EventWrapper()}
      {SupportWrapper()}
      {HomeWrapper()}
    </>
  )
}

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
          <Route path={"/"} element={SelectLogin()} />
          <Route path={"/home"} element={HomeWrapper()} />
          <Route path={"/booking"} element={BookingWrapper()} />
          <Route path={"/events"} element={EventWrapper()} />
          <Route path={"/rewards"} element={RewardsWrapper()} />
          <Route path={"/support"} element={SupportWrapper()} />
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