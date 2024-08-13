import React, { Suspense, lazy, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Loading from "./components/Loader/Loading";
import { SnackbarProvider } from "notistack";
import "./App.scss";

// Lazy load components
const Login = lazy(() => import("./components/Login/Login"));
const Members = lazy(() => import("./components/Members/Members"));
const Trainers = lazy(() => import("./components/Trainers/Trainers"));
const Membership = lazy(() => import("./components/Membership/Membership"));
const Payment = lazy(() => import("./components/Payment/Payment"));
const Calendar = lazy(() => import("./components/Calendar/Calendar"));
const Attendance = lazy(() => import("./components/Attendance/Attendance"));

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const { data } = await axios.get("http://localhost:6969/profile", {
        withCredentials: true,
      });
      setUser(data.user);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) return <Loading />;

  return (
    <SnackbarProvider maxSnack={3}>
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route
              path="/"
              element={<Navigate to={user ? "/home" : "/login"} />}
            />
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/home" />
                ) : (
                  <Login
                    onLogin={async (username) => {
                      await fetchUserProfile();
                      window.location.href = "/home";
                    }}
                  />
                )
              }
            />
            <Route
              path="/home"
              element={
                user ? (
                  <>
                    <Navbar userDtls={user} />
                    <Sidebar userRole={user.role} />
                  </>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/member"
              element={
                user ? (
                  user.role === "admin" ? (
                    <>
                      <Navbar userDtls={user} />
                      <Members />
                      <Sidebar userRole={user.role} />
                    </>
                  ) : (
                    <>
                      <Navbar userDtls={user} />
                      <Sidebar userRole={user.role} />
                      {/* <MemberCalendar User_Data={user} /> */}
                    </>
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/trainer"
              element={
                user ? (
                  user.role === "admin" ? (
                    <>
                      <Navbar userDtls={user} />
                      <Sidebar userRole={user.role} />
                      <Trainers />
                    </>
                  ) : (
                    <Navigate to="/home" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/payment"
              element={
                user ? (
                  user.role === "admin" ? (
                    <>
                      <Navbar userDtls={user} />
                      <Sidebar userRole={user.role} />
                      <Payment />
                    </>
                  ) : (
                    <Navigate to="/home" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/membership"
              element={
                user ? (
                  user.role === "admin" ? (
                    <>
                      <Navbar userDtls={user} />
                      <Sidebar userRole={user.role} />
                      <Membership />
                    </>
                  ) : (
                    <Navigate to="/home" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/calendar"
              element={
                user ? (
                  user.role === "admin" ? (
                    <>
                      <Navbar userDtls={user} />
                      <Sidebar userRole={user.role} />
                      <Calendar />
                    </>
                  ) : (
                    <Navigate to="/home" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/attendance"
              element={
                user ? (
                  user.role === "admin" ? (
                    <>
                      <Navbar userDtls={user} />
                      <Sidebar userRole={user.role} />
                      <Attendance />
                    </>
                  ) : (
                    <Navigate to="/home" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </SnackbarProvider>
  );
};

export default App;
