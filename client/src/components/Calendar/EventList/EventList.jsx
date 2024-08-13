import React, { useEffect, useRef, useState } from "react";
import Icon from "@mdi/react";
import { mdiDelete, mdiArrowLeft } from "@mdi/js";
import "./EventList.scss";

const EventList = ({ events, onClose }) => {
  const [eventToDelete, setEventToDelete] = useState(null);
  const eventListRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        eventListRef.current &&
        !eventListRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleDeleteClick = (id) => {
    setEventToDelete(id);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(
        `http://localhost:6969/delete-event/${eventToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        onClose(); // Close the event list after deletion, or re-fetch events
      } else {
        console.error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleBack = () => {
    setEventToDelete(null);
  };

  return (
    <div className="event-list-overlay">
      <div className="event-list" ref={eventListRef}>
        <h3>Events</h3>
        <ul>
          {events.map((event) => (
            <li key={event._id} className="event-item">
              <span>{event.name}</span>
              {eventToDelete === event._id ? (
                <div className="confirm-buttons">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={handleDeleteConfirm}
                  >
                    Remove
                  </button>
                  <button
                    className="btn btn-secondary btn-sm "
                    onClick={handleBack}
                  >
                    <Icon path={mdiArrowLeft} size={1} />
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteClick(event._id)}
                >
                  <Icon path={mdiDelete} size={0.8} />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventList;
