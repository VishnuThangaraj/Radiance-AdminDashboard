import React, { useState, useEffect } from "react";
import "./AttendanceView.scss";

const AttendanceView = ({ id, role, onClose }) => {
  const [info, setInfo] = useState(null);
  const [recentLogin, setRecentLogin] = useState(null);

  useEffect(() => {
    const fetchInfo = async () => {
      if (id && role) {
        try {
          const response = await fetch(
            `http://localhost:6969/${role}-data/${id}`
          );
          if (response.ok) {
            const data = await response.json();
            setInfo(data);
            fetchRecentLogin(data.username);
          } else {
            console.error("Failed to fetch details");
          }
        } catch (error) {
          console.error("Error fetching details:", error);
        }
      }
    };

    const fetchRecentLogin = async (username) => {
      try {
        const response = await fetch(
          `http://localhost:6969/recent-log/${username}`
        );
        if (response.ok) {
          const data = await response.json();
          setRecentLogin(data);
        } else {
          console.error("Failed to fetch recent login");
        }
      } catch (error) {
        console.error("Error fetching recent login:", error);
      }
    };

    fetchInfo();
  }, [id, role]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);

    date.setHours(date.getUTCHours() + 5);
    date.setMinutes(date.getUTCMinutes() + 30);

    let hours = date.getHours();
    const minutes = date.getMinutes();

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="attendance-card" data-aos="fade-in">
      <div className="attendance-view-container">
        {/* Profile Card */}
        {info ? (
          <div
            className="card view-member-trainer-card"
            data-aos="flip-up"
            data-aos-delay="150"
          >
            <div className="view-member-trainer-content">
              <div className="profile-details">
                <h3 className="modal-title">
                  {role === "member" ? "Member Profile" : "Trainer Profile"}
                </h3>
                {role === "member" ? (
                  <>
                    <p>
                      <strong>Name :</strong> &nbsp;{info.name}
                    </p>
                    <p>
                      <strong>Email :</strong> &nbsp;{info.email}
                    </p>
                    <p>
                      <strong>Membership :</strong> &nbsp;{info.subscription}{" "}
                      <span
                        className={`${
                          info.payment ? "make-green" : "make-red"
                        }`}
                      >
                        {info.payment ? "(Paid)" : "(Pending)"}
                      </span>
                    </p>
                    <p>
                      <strong>Start Date :</strong> &nbsp;
                      {formatDate(info.start_date?.slice(0, 10))}
                    </p>
                    <p>
                      <strong>End Date :</strong> &nbsp;
                      {formatDate(info.end_date?.slice(0, 10))}
                    </p>
                    <p>
                      <strong>Trainer :</strong> &nbsp;{info.trainer_name}
                    </p>
                    <p>
                      <strong>Address :</strong> &nbsp;{info.address}
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>ID :</strong> &nbsp;{info.username}
                    </p>
                    <p>
                      <strong>Name :</strong> &nbsp;{info.name}
                    </p>
                    <p>
                      <strong>Email :</strong> &nbsp;{info.email}
                    </p>
                    <p>
                      <strong>Phone :</strong> &nbsp;{info.phone}
                    </p>
                    <p>
                      <strong>Gender :</strong> &nbsp;{info.gender} &nbsp;&nbsp;
                      <strong>Age :</strong> &nbsp;{info.age}
                    </p>
                    <p>
                      <strong>Height :</strong> &nbsp;{info.height} cm
                      &nbsp;&nbsp;
                      <strong>Weight :</strong> &nbsp;{info.weight} kg
                    </p>
                    <p>
                      <strong>Address :</strong> &nbsp;{info.address}
                    </p>
                  </>
                )}
              </div>
              <div className="profile-image mt-5 pt-3">
                <img
                  src={`${
                    role === "member"
                      ? "images/profile_avatar.png"
                      : "images/trainer-male.png"
                  }`}
                  alt="Profile"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="overlay-text-attendance fa-fade">
            Attendance details will appear Here.
          </div>
        )}

        {/* Recent Login Info Card */}
        {recentLogin && (
          <div
            className="card recent-login-card"
            data-aos="flip-up"
            data-aos-delay="150"
          >
            <h4 className="border-bottom pb-2 mb-3 text-center">
              Latest Attendance
            </h4>
            <p>
              <strong>Username:</strong> {recentLogin.username}
            </p>
            <p>
              <strong>Role:</strong>{" "}
              {recentLogin.role === "member" ? "Member" : "Trainer"}
            </p>
            <p>
              <strong>Action:</strong>{" "}
              <span
                className={`${
                  recentLogin.action === "login" ? "make-green" : "make-red"
                }`}
              >
                {recentLogin.action === "login" ? "LOGIN" : "LOGOUT"}
              </span>
            </p>
            <p>
              <strong>Date:</strong> {formatDate(recentLogin.timestamp)}
            </p>
            <p>
              <strong>Timestamp:</strong> {formatTime(recentLogin.timestamp)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceView;
