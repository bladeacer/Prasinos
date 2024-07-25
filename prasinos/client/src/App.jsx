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
import { is_accent, goof_check } from './pages/reusables/accent_parser';
import { HomeWrapper, BookingWrapper, EventWrapper, RewardsWrapper, SupportWrapper, SelectLogWrapper, EverythingWrapper } from './pages/reusables/wrappers';
import StaffLogin from './pages/staffLogin';
import StaffRegister from './pages/staffRegister';
import StaffHome from './pages/staffHomev2';
import ResetEndpoint from './pages/ResetEndpoints';
import Verify from './pages/Verify';
import VerifyHandler from './pages/Verifyhandler';

export default function App() {
  const [user, setUser] = useState(null);
  const [staff, setStaff] = useState(null);
  const [uuid, setUUID] = useState("");

  // UseEffect if current window location is not home
  useEffect(() => {
    if (sessionStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
        setUser(res.data.user);
        if (res.data.status === 301) {
          window.history.pushState({}, document.title, "/verify");
          window.location.href = window.location.href;
        }
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

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={
            SelectLogWrapper()
          } />
          <Route path="*" element={
            <>
              {is_accent[1] && ((user && user.verified) || !user) && (
                Unauthorized(false)
              )}
              {is_accent[2] && ((user && user.verified) || !user) && (
                Unauthorized(false)
              )}
              {is_accent[3] && ((user && user.verified) || !user) && (
                Unauthorized(false)
              )}
              {is_accent[4] && ((user && user.verified) || !user) && (
                Unauthorized(false)
              )}

              {((user && user.verified) || !user) && is_accent[5] && (
                Unauthorized(true)
              )}
              {((user && user.verified) || !user) && is_accent[6] && (
                Unauthorized(true)
              )}

              {is_accent[7] && ((user && user.verified) || !user) && (
                Unauthorized(false)
              )}
              {is_accent[9] && ((user && user.verified) || !user) && (
                Unauthorized(false)
              )}
              {((user && user.verified) || !user) && is_accent[10] && (
                Unauthorized(-1)
              )}
              {((user && user.verified) || !user) && is_accent[11] && (
                Unauthorized(-1)
              )}
              {((user && user.verified) || !user) && is_accent[12] && (
                Unauthorized(-1)
              )}

              {/* Basic staff pages from 13 to 15 */}
              {staff && is_accent[13] && (
                Unauthorized(3)
              )}
              {staff && is_accent[14] && (
                Unauthorized(3)
              )}
              {is_accent[15] && !staff && is_accent[15] && (
                Unauthorized(-2)
              )}

              {!user && is_accent[16] && (
                Unauthorized(-1)
              )}
              {user && user.verified && is_accent[17] && (
                Unauthorized(-1)
              )}
              {goof_check && (
                Unauthorized(-1)
              )}
            </>
          } />
        </Routes>
      </Router>

      <UserContext.Provider value={{ user, setUser }}>
        <Router>
          <TopNavbarV2 />
          <Routes>


            <Route path={"/home"} element={HomeWrapper()} />
            <Route path={"/booking"} element={
              <>
                {user && user.verified && (
                  BookingWrapper()
                )}
              </>
            } />
            <Route path={"/events"} element={
              <>
                {user && user.verified && (
                  EventWrapper()
                )}
              </>
            } />
            <Route path={"/rewards"} element={
              <>
                {user && user.verified && (
                  RewardsWrapper()
                )}
              </>
            } />
            <Route path={"/support"} element={
              <>
                {user && user.verified && (
                  SupportWrapper()
                )}
              </>
            } />
            <Route path={"/settings"} element={
              <>
                {is_accent[7] && user && user.verified && (
                  Settings(false, user)
                )}
              </>
            } />
            <Route path={"/dangerZone"} element={
              <>

                {is_accent[9] && user && user.verified && (
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

              </>
            } />
            <Route path={"/login"} element={
              <>
                {!user && (
                  EverythingWrapper()
                )}

              </>
            } />
            <Route path={"/edit"} element={
              <>
                {user && user.verified && is_accent[10] && (
                  <EditUser />
                )}
              </>
            } />
            <Route path={"/reset"} element={
              <>
                {user && user.verified && is_accent[11] && (
                  <ResetPassword />
                )}
              </>
            } />
            <Route path={"/verify"} element={
              <>
                {user && !user.verified && is_accent[12] && (
                  <>
                    <Verify />
                  </>
                )}

              </>
            } />

            <Route path="/:uuid" element={
              <>
                {user && user.verified && !staff && is_accent[16] && (
                  <ResetEndpoint />
                )}
              </>
            } />

            <Route path={"/verifyhandler"} element={
              <>
                {user && !user.verified && is_accent[17] && (
                  <>
                    <VerifyHandler />
                  </>
                )}
              </>
            } />
          </Routes>
        </Router>
      </UserContext.Provider>

      <StaffContext.Provider value={{ staff, setStaff }}>
        <Router>
          <Routes>
            <Route path={"/staffLogin"} element={
              <>
                {!staff && is_accent[13] && (
                  <StaffLogin />
                )}

              </>
            } />
            <Route path={"/staffRegister"} element={
              <>
                {!staff && is_accent[14] && (
                  <StaffRegister />
                )}

              </>
            } />
            <Route path={"/staffHome"} element={
              <>
                {staff && is_accent[15] && (
                  <StaffHome />
                )}
              </>
            } />
          </Routes>
        </Router>
      </StaffContext.Provider>
    </>
  );
}