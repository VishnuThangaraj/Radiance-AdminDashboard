import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Icon from "@mdi/react";
import {
  mdiCalendarStarFourPoints,
  mdiYoga,
  mdiAccountGroup,
  mdiCalendarMonth,
} from "@mdi/js";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AddEvents from "../Forms/Calendar/AddEvents";
import "./Calendar.scss";

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [loading, setLoading] = useState(true);
  const [eventCounts, setEventCounts] = useState({});
  const [addEvent, setAddEvent] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:6969/get-calendar");
        const data = await response.json();

        const counts = data.calendars.reduce((acc, event) => {
          const date = new Date(event.date).toDateString();
          if (!acc[date]) {
            acc[date] = { trainers: 0, members: 0 };
          }
          if (event.role === "trainer") {
            acc[date].trainers += 1;
          } else if (event.role === "member") {
            acc[date].members += 1;
          }
          return acc;
        }, {});

        setEventCounts(counts);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleAddEvent = () => {
    setAddEvent(true);
  };

  const hideAddEvent = () => {
    setAddEvent(false);
  };

  const CustomDay = ({ date }) => {
    if (!date) return null;

    const dayDate = date.toDateString();
    const counts = eventCounts[dayDate] || { trainers: 0, members: 0 };

    return (
      <div className="custom-day">
        <div className="day-info text-left" style={{ cursor: "pointer" }}>
          <div className="evnt-pill">Events : {counts.trainers}</div>
          <div className="trainer-pill">Trainer : {counts.trainers}</div>
          <div className="member-pill">Members : {counts.members}</div>
        </div>
      </div>
    );
  };

  return (
    <div id="member_calendar" className="display-area">
      <div
        className="Top-holder my-flex-row"
        style={{ justifyContent: "space-between" }}
      >
        <div className="content-title ps-4" data-aos="fade-right">
          DASHBOARD
        </div>
        <div
          className="btn btn-success me-4"
          data-aos="fade-left"
          onClick={handleAddEvent}
        >
          <Icon path={mdiCalendarStarFourPoints} size={1} />
          &nbsp; Add Event
        </div>
      </div>
      <div className="ps-3 content" data-aos="zoom-in">
        <div className="calendar-holder">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <BigCalendar
              localizer={localizer}
              events={[]}
              startAccessor="start"
              endAccessor="end"
              components={{
                dateCellWrapper: ({ children, value }) => (
                  <div className="rbc-date-cell">
                    <CustomDay date={value} />
                    {children}
                  </div>
                ),
              }}
              className="m-3"
              style={{ height: 520, width: 1000 }}
              selectable
            />
          )}
        </div>
      </div>
      {addEvent && <AddEvents onClose={hideAddEvent} />}
    </div>
  );
};

export default Calendar;
