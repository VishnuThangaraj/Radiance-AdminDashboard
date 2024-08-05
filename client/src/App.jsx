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
import MemberCalendar from "./components/MemberCalendar/MemberCalendar";
import Trainers from "./components/Trainers/Trainers";
import AdminCalendar from "./components/AdminCalendar/AdminCalendar";

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
    <Router>
      <Routes>
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
                  <Members />
                  <Sidebar userRole={user.role} />
                </>
              ) : (
                <>
                  <Navbar userDtls={user} />
                  <Sidebar userRole={user.role} />
                  <MemberCalendar User_Data={user} />
                </>
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />
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
          path="/calendar"
          element={
            user ? (
              user.role === "admin" ? (
                <>
                  <Navbar userDtls={user} />
                  <AdminCalendar user={user} />
                  <Sidebar userRole={user.role} />
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
    </Router>
  );
};

export default App;