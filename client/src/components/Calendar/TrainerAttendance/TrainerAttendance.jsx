import React, { useEffect, useState, useRef } from "react";
import "./TrainerAttendance.scss";

const TrainerAttendance = ({ attendanceDate, onClose }) => {
  const cardRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const convertToIST = (dateTimeString) => {
    const date = new Date(dateTimeString);

    const offsetIST = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + offsetIST);

    let hours = istDate.getUTCHours();
    const minutes = istDate.getUTCMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;

    const minutesFormatted = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}:${minutesFormatted} ${ampm}`;
  };

  return (
    <div className="attendance-list-overlay">
      <div className="attendance-list-card" ref={cardRef}>
        <div className="attendance-list-header">
          <h4 className="border-bottom">Attendance</h4>
        </div>
        <div className="pb-3">
          <span style={{ fontWeight: "600" }}>LOGIN &nbsp; &nbsp; :</span>
          &nbsp;
          {convertToIST(attendanceDate.firstLog.timestamp)}
        </div>
        <div>
          {" "}
          <span style={{ fontWeight: "600" }}>LOGOUT :</span>&nbsp;
          {convertToIST(attendanceDate.lastLog.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default TrainerAttendance;
