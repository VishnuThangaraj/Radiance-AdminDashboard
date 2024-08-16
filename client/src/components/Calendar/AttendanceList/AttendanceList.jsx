import React, { useEffect, useState, useRef } from "react";
import "./AttendanceList.scss"; // Import your styles

const AttendanceList = ({ attendance, onClose }) => {
  const [names, setNames] = useState({});
  const cardRef = useRef(null);

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const namePromises = attendance.map(async (att) => {
          const isMember = att.username.startsWith("RYC-MB");
          const endpoint = isMember
            ? `http://localhost:6969/member-name/${att.username}`
            : `http://localhost:6969/trainer-name/${att.username}`;

          try {
            const response = await fetch(endpoint);
            if (!response.ok) {
              throw new Error(`Error fetching data for ${att.username}`);
            }
            const data = await response.json();
            return { username: att.username, name: data.name };
          } catch (fetchError) {
            console.error(fetchError.message);
            return { username: att.username, name: "Unknown" };
          }
        });

        const namesData = await Promise.all(namePromises);
        const namesMap = namesData.reduce((acc, { username, name }) => {
          acc[username] = name;
          return acc;
        }, {});

        setNames(namesMap);
      } catch (error) {
        console.error("Error fetching names:", error);
      }
    };

    fetchNames();

    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [attendance, onClose]);

  const sortedAttendance = attendance.sort((a, b) => {
    if (a.role === "trainer" && b.role === "member") return -1;
    if (a.role === "member" && b.role === "trainer") return 1;
    return 0;
  });

  return (
    <div className="attendance-list-overlay">
      <div className="attendance-list-card" ref={cardRef}>
        <div className="attendance-list-header">
          <h4 className="border-bottom">Attendance List</h4>
        </div>
        <ul>
          {sortedAttendance.length > 0 ? (
            sortedAttendance.map((att) => (
              <li
                key={att.username}
                className={`${att.role === "member" ? "make-green" : ""}`}
              >
                {names[att.username] || "Loading..."} - {att.role.toUpperCase()}
              </li>
            ))
          ) : (
            <p className="text-center fa-fade py-4">
              No attendance data available.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AttendanceList;
