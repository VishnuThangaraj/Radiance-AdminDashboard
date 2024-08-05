import React, { useEffect, useRef } from "react";
import "./EodReport.css";

const formatDateToIST = (dateString) => {
  const date = new Date(dateString);
  // Convert to IST (UTC+5:30)
  const offset = 5.5 * 60 * 60 * 1000;
  const localDate = new Date(date.getTime() + offset);

  // Format to 12-hour time with AM/PM
  const hours = localDate.getHours() % 12 || 12;
  const minutes = localDate.getMinutes().toString().padStart(2, "0");
  const ampm = localDate.getHours() >= 12 ? "PM" : "AM";

  return `${hours}:${minutes} ${ampm}`;
};

const EodReport = ({ tasks, onClose }) => {
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
    <div className="report-overlay">
      <div className="report-container" ref={reportRef}>
        <h3 className="report-title text-center">End of the Day Report</h3>
        <div className="report-content">
          {tasks.length ? (
            <div className="report-table-container">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Task Name</th>
                    <th>Description</th>
                    <th>Time Worked</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Completion</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, index) => (
                    <tr
                      key={index}
                      className={`${
                        task.completion_percentage < 100
                          ? "make-red"
                          : "make-green"
                      }`}
                    >
                      <td>{task.name}</td>
                      <td>{task.description}</td>
                      <td>{task.total_hours_worked} hours</td>
                      <td>{formatDateToIST(task.start_time)}</td>
                      <td>{formatDateToIST(task.end_time)}</td>
                      <td>{task.completion_percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No EOD data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EodReport;
