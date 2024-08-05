import React, { useEffect, useRef } from "react";
import "./PfdReport.css";

const PfdReport = ({ tasks, onClose }) => {
  const reportRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (reportRef.current && !reportRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="pfd-report-overlay">
      <div className="pfd-report-container" ref={reportRef}>
        <h3 className="pfd-report-title">Plan for the Day Report</h3>
        <table className="pfd-report-table">
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Description</th>
              <th>Time Required</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <tr key={index}>
                  <td>{task.name}</td>
                  <td>{task.description}</td>
                  <td>{task.time_required} hours</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No tasks found for this day.</td>
              </tr>
            )}
          </tbody>
        </table>
        {/* <button className="pfd-report-close-btn" onClick={onClose}>
          Close
        </button> */}
      </div>
    </div>
  );
};

export default PfdReport;
