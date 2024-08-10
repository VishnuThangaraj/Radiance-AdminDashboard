import React from "react";
import "./Attendance.css";

const Attendance = () => {
  return (
    <div className="attendance-container">
      <div className="form-container">
        <input
          type="text"
          placeholder="Enter your data"
          className="input-box"
        />
        <button className="submit-button">Submit</button>
      </div>
    </div>
  );
};

export default Attendance;
