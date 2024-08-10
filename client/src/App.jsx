import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Login from "./components/Login/Login";
import Members from "./components/Members/Members";
import Loading from "./components/Loader/Loading";
import { SnackbarProvider, useSnackbar } from "notistack";
import Trainers from "./components/Trainers/Trainers";
import Membership from "./components/Membership/Membership";
import Payment from "./components/Payment/Payment";
import Calendar from "./components/Calendar/Calendar";

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
                  </>
                ) : (
                  <>
                    <Navbar userDtls={user} />
                    <Sidebar userRole={user.role} />
                  </>
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
              <>
                <Navbar />
              </>
            }
          />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
};

export default App;
