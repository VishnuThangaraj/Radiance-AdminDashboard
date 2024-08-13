import React, { useState, useRef, useEffect } from "react";
import { SnackbarProvider, useSnackbar } from "notistack";
import "./AddEvents.scss";

function AddEvents({ onClose }) {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [access, setAccess] = useState("private");
  const { enqueueSnackbar } = useSnackbar();

  const formRef = useRef(null);

  const handleClickOutside = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:6969/register-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: eventName,
          date: eventDate,
          access: access,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Event added:", result);
        onClose();
        window.location.reload();
      } else {
        const error = await response.json();
        console.error("Error adding event:", error.message);
      }
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  return (
    <div id="add_event-box" data-aos="fade-in">
      <div className="form-container" ref={formRef} data-aos="flip-up">
        <h2 className="text-center" style={{ fontWeight: "600" }}>
          ADD NEW EVENT
        </h2>{" "}
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="form-groups mb-3">
            <label htmlFor="eventName" className="ms-3">
              Event Name
            </label>
            <input
              type="text"
              id="eventName"
              className="px-4"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              style={{ padding: "12px 10px" }}
              required
            />
          </div>
          <div className="form-groups mb-4">
            <label htmlFor="eventDate" className="ms-3">
              Event Date
            </label>
            <input
              type="date"
              id="eventDate"
              className="px-3"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              style={{ padding: "12px 10px" }}
              required
            />
          </div>
          <div className="form-groups mb-4">
            <label htmlFor="access" className="ms-3">
              Access
            </label>
            <select
              id="access"
              value={access}
              onChange={(e) => setAccess(e.target.value)}
              style={{ padding: "12px 10px" }}
            >
              <option value="Private">Private</option>
              <option value="Public">Public</option>
            </select>
          </div>
          <button
            type="submit"
            className="submit-btn btn-primary mb-3 "
            style={{ borderRadius: "7%/60%" }}
          >
            Add Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddEvents;
