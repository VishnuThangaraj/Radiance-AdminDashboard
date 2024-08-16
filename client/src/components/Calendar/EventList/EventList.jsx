import React, { useEffect, useRef, useState } from "react";
import { SnackbarProvider, useSnackbar } from "notistack";
import Icon from "@mdi/react";
import { mdiDelete, mdiArrowLeft } from "@mdi/js";
import "./EventList.scss";

const EventList = ({ user, events, onClose }) => {
  const [eventToDelete, setEventToDelete] = useState(null);
  const eventListRef = useRef(null);
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
    if (user.role !== "admin") {
      showNotification("Permission Denied: Unable to Remove Event", "warning");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:6969/del-calendar/${eventToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        showNotification("Event Removed from the Calendar", "success");
        onClose();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        console.error("Failed to delete event");
        showNotification("Unable to Delete Event", "warning");
      }
    } catch (error) {
      showNotification("Error Deleting Event", "error");
      console.error("Error deleting event:", error);
    }
  };

  const handleBack = () => {
    setEventToDelete(null);
  };

  return (
    <div className="event-list-overlay">
      <div className="event-list" ref={eventListRef}>
        <h3 className="text-center border-bottom pb-2">Events</h3>
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
