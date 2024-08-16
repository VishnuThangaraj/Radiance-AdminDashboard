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
const AdminDashboard = lazy(() =>
  import("./components/Dashboard/AdminDashboard")
);
const Attendance = lazy(() => import("./components/Attendance/Attendance"));
const Calendar = lazy(() => import("./components/Calendar/Calendar"));
const Login = lazy(() => import("./components/Login/Login"));
const Members = lazy(() => import("./components/Members/Members"));
const Membership = lazy(() => import("./components/Membership/Membership"));
const Payment = lazy(() => import("./components/Payment/Payment"));
const Trainers = lazy(() => import("./components/Trainers/Trainers"));

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
                  user.role === "admin" ? (
                    <>
                      <Navbar userDtls={user} />
                      <Sidebar userRole={user.role} />
                      <AdminDashboard />
                    </>
                  ) : (
                    <Navigate to="/member" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/member"
              element={
                user ? (
                  <>
                    <Navbar userDtls={user} />
                    <Sidebar userRole={user.role} />
                    <Members user={user} />
                  </>
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
                  <>
                    <Navbar userDtls={user} />
                    <Sidebar userRole={user.role} />
                    <Calendar user={user} />
                  </>
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
