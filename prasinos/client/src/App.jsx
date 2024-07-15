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
import StaffLogin from './pages/staffLogin';
import StaffRegister from './pages/staffRegister';
import StaffHome from './pages/staffHome';
import ResetEndpoint from './pages/ResetEndpoints';
import Verify from './pages/Verify';

export default function App() {
  const [user, setUser] = useState(null);
  const [staff, setStaff] = useState(null);
  const [uuid, setUUID] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("accessToken")) {
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
          <TopNavbarV2 />

          <Routes>
            <Route path="/:uuid" element={
              <>
                {!user && (
                  Unauthorized(-1)
                )}
                {user && (
                  <ResetEndpoint />
                )}
              </>} />

            <Route path={"/"} element={<></>}></Route>

            <Route path={"/home"} element={HomeWrapper()} />
            <Route path={"/booking"} element={
              <>
                {is_accent[1] && user && (
                  BookingWrapper()
                )}
                {is_accent[1] && !user && (
                  Unauthorized(false)
                )}
              </>
            } />
            <Route path={"/events"} element={
              <>
                {is_accent[2] && user && (
                  EventWrapper()
                )}
                {is_accent[2] && user && (
                  Unauthorized (false)
                )}
              </>
            } />
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
            <Route path={"/edit"} element={
              <>
                {!user && (
                  Unauthorized(-1)
                )}
                {user && (
                  <EditUser />
                )}
              </>
            } />
            <Route path={"/reset"} element={
              <>
                {/* 
                  Replace check with reset handler where one is referred from gmail or some other email
                  Abuse is_accent[x] once again, or we make another variable?
                */}

                {!user && (
                  Unauthorized(-1)
                )}
                {user && (
                  <ResetPassword />
                )}
              </>
            } />
            {/* Catch-all route */}
            <Route path="*" element={Unauthorized(-1)} />

          </Routes>
        </Router>
      </UserContext.Provider>

      <StaffContext.Provider value={{ staff, setStaff }}>
        <Router>
          <Routes>
            <Route path="/:uuid" element={<></>} />
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
            <Route path="*" element={Unauthorized(-1)} />

          </Routes>
        </Router>
      </StaffContext.Provider>

      <Router>
        <Routes>
          {/* Apparently you can get usercontext values outside of the user context provider */}
          <Route path="/:uuid" element={<></>} />

          <Route path={"/"} element={
            <>
              {!user && !staff && (
                SelectLogWrapper()
              )}
              {(user || staff) && (
                Unauthorized(true)
              )}
            </>
          } />
          <Route path="*" element={Unauthorized(-1)} />

        </Routes>
      </Router>
    </>
  );
}