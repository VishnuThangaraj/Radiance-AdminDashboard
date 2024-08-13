import React, { useState } from "react";
import { SnackbarProvider, useSnackbar } from "notistack";
import AttendanceView from "./AttendanceView/AttendanceView";
import "./Attendance.scss";

const Attendance = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [memberId, setMemberId] = useState("");
  const [trainerId, setTrainerId] = useState("");
  const [recentLogin, setRecentLogin] = useState(null);
  const [viewKey, setViewKey] = useState(0); // Added state for forcing re-render
  const { enqueueSnackbar } = useSnackbar();

  const showNotification = (message, type) => {
    enqueueSnackbar(message, {
      variant: type,
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const checkResponse = await fetch("http://localhost:6969/check-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const checkResult = await checkResponse.json();

      if (checkResponse.ok) {
        if (checkResult.role === "invalid") {
          showNotification("Invalid username", "error");
          setRole("");
          setMemberId("");
          setTrainerId("");
          return;
        }

        setRole(checkResult.role);
        const { id } = checkResult;

        if (checkResult.role === "member") {
          setMemberId(id);
          setTrainerId("");
        } else {
          setTrainerId(id);
          setMemberId("");
        }

        const payload = {
          username,
          role: checkResult.role,
        };

        const logResponse = await fetch(
          "http://localhost:6969/attendance-log",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        setUsername("");
        if (logResponse.ok) {
          showNotification("Log entry created successfully", "success");
          setRecentLogin({
            username,
            role: checkResult.role,
            action: "login",
            timestamp: new Date().toISOString(),
          });
          setViewKey((prevKey) => prevKey + 1); // Force re-render by updating key
        } else {
          showNotification("Failed to create log entry", "error");
        }
      } else {
        showNotification("Failed to check ID", "error");
      }
    } catch (error) {
      showNotification("An error occurred", "error");
      console.error("Error:", error);
    }
  };

  return (
    <div id="attendance-track" className="display-area">
      <div className="content-title" data-aos="fade-right">
        DASHBOARD
      </div>
      <div className="hello py-3" data-aos="zoom-out-up">
        Comprehensive Attendance Entry
      </div>
      <div
        className="attendance-form-container"
        data-aos="fade-left"
        data-aos-delay="150"
      >
        <input
          type="text"
          placeholder="Enter the Username"
          className="attendance-input-box"
          value={username}
          onChange={(e) => setUsername(e.target.value.toUpperCase())}
        />
        <button className="attendance-submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>

      <div className="card-container" data-aos="fade-up" data-aos-delay="200">
        <AttendanceView
          key={viewKey} // Pass the key to force re-render
          id={role === "member" ? memberId : trainerId}
          role={role}
          recentLogin={recentLogin}
          onClose={() => {
            setMemberId("");
            setTrainerId("");
            setRole("");
            setRecentLogin(null);
          }}
        />
      </div>
    </div>
  );
};

export default Attendance;
