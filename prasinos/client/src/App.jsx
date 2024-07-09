import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import http from './http';
import { UserContext, StaffContext } from './contexts/Contexts';
import TopNavbarV2 from './pages/reusables/top_navbarv2';

import Settings from './pages/Settings';
import Unauthorized from './pages/Unauthorized';
import DangerZone from './pages/dangerZone'
import EditUser from './pages/EditUser';
import ResetPassword from './pages/ResetPassword';
import { is_accent } from './pages/reusables/accent_parser';
import { HomeWrapper, BookingWrapper, EventWrapper, RewardsWrapper, SupportWrapper, SelectLogWrapper, EverythingWrapper } from './pages/reusables/wrappers';
import RoutePlaceholder from './pages/reusables/route_placeholders';
import StaffLogin from './pages/staffLogin';
import StaffRegister from './pages/staffRegister';
import StaffHome from './pages/staffHome';
import ResetEndpoint from './pages/ResetEndpoints';

export default function App() {
  const [user, setUser] = useState(null);
  const [staff, setStaff] = useState(null);
  const [uuid, setUUID] = useState("");

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
        setUser(res.data.user);
      });
      http.get('/staff/auth').then((res) => {
        setStaff(res.data.staff);
      });
    }
    if (!sessionStorage.getItem("resetURL")) {
      sessionStorage.setItem("resetURL", crypto.randomUUID())
    }
    setUUID(sessionStorage.getItem("resetURL"))
  }, []);
  // Note to self: Make an everything wrapper 

  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
        <Router>
          <TopNavbarV2></TopNavbarV2>

          <Routes>
            {RoutePlaceholder(false)}
            <Route path="/resethandler/:id/:uuid" element={
              <>
                {!user && (
                  Unauthorized(false)
                )}
                {user && (
                  ResetEndpoint()
                )}
              </>} />

            <Route path={"/"} element={<></>}></Route>

            <Route path={"/home"} element={HomeWrapper()} />
            <Route path={"/booking"} element={BookingWrapper()} />
            <Route path={"/events"} element={EventWrapper()} />
            <Route path={"/rewards"} element={RewardsWrapper()} />
            <Route path={"/support"} element={SupportWrapper()} />
            <Route path={"/settings"} element={
              <>
                {is_accent[7] && user && (
                  Settings(false, user)
                )}
                {is_accent[7] && !user && (
                  Unauthorized(false)
                )}
              </>
            } />
            <Route path={"/dangerZone"} element={
              <>
                {is_accent[9] && !user && (
                  Unauthorized(false)
                )}
                {is_accent[9] && user && (
                  <>
                    {Settings(true, user)}
                    <DangerZone />
                  </>
                )}
              </>
            } />
            <Route path={"/register"} element={
              <>
                {!user && (
                  EverythingWrapper()
                )}
                {user && (
                  Unauthorized(true)
                )}
              </>
            } />
            <Route path={"/login"} element={
              <>
                {!user && (
                  EverythingWrapper()
                )}
                {user && (
                  Unauthorized(true)
                )}
              </>
            } />
            <Route path={`/edit/:id`} element={
              <>
                {!user || (window.location.pathname != `/edit/${user.id}`) && (
                  Unauthorized(-1)
                )}
                {user && (
                  <EditUser />
                )}
              </>
            } />
            <Route path={`/reset/:id/:uuid`} element={
              <>
                {!user || (window.location.pathname != `/reset/${user.id}/${uuid}`) && (
                  Unauthorized(-1)
                )}
                {user && (
                  <ResetPassword />
                )}
              </>
            } />
          </Routes>
        </Router>
      </UserContext.Provider>

      <StaffContext.Provider value={{ staff, setStaff }}>
        <Router>
          <Routes>
            {RoutePlaceholder(true)}
            <Route path="/resethandler/:id/:uuid" element={<></>} />
            <Route path={"/"} element={<></>} />

            <Route path={"/staffLogin"} element={
              <>
                {!staff && (
                  <StaffLogin />
                )}
                {staff && (
                  Unauthorized(3)
                )}
              </>
            } />
            <Route path={"/staffRegister"} element={
              <>
                {!staff && (
                  <StaffRegister />
                )}
                {staff && (
                  Unauthorized(3)
                )}
              </>
            } />
            <Route path={"/staffHome"} element={
              <>
                {!staff && (
                  Unauthorized(2)
                )}
                {staff && (
                  <StaffHome />
                )}
              </>
            } />

          </Routes>
        </Router>
      </StaffContext.Provider>

      <Router>
        <Routes>
          {/* Apparently you can get usercontext values outside of the user context provider */}

          {RoutePlaceholder(false)}
          {RoutePlaceholder(true)}
          <Route path="/resethandler/:id/:uuid" element={<></>} />

          <Route path={"/"} element={
            <>
              {!user && !staff && (
                SelectLogWrapper()
              )}
              {user || staff && (
                Unauthorized(true)
              )}
            </>
          } />

        </Routes>

      </Router>
    </>
  );
}