import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Icon from "@mdi/react";
import { mdiCalendarStarFourPoints, mdiCalendarCheck } from "@mdi/js";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AddEvents from "../Forms/Calendar/AddEvents";
import EventList from "./EventList/EventList";
import "./Calendar.scss";

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [addEvent, setAddEvent] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "http://localhost:6969/get-calendar-attendance"
        );
        const data = await response.json();

        // Group events by date
        const groupedEvents = data.calendars.reduce((acc, event) => {
          const date = moment(event.date).startOf("day").format("YYYY-MM-DD");
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(event);
          return acc;
        }, {});

        // Prepare events for the calendar
        const calendarEvents = Object.keys(groupedEvents).map((date) => {
          const dayEvents = groupedEvents[date];
          return {
            id: dayEvents[0]._id,
            title: `${dayEvents.length} Event${
              dayEvents.length > 1 ? "s" : ""
            }`,
            start: new Date(date),
            end: new Date(date),
            allDay: true,
            events: dayEvents,
          };
        });

        setEvents(calendarEvents);
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

  const showEventList = (dayEvents) => {
    setSelectedEvents(dayEvents);
  };

  const hideEventList = () => {
    setSelectedEvents(null);
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.events.length > 1 ? "#ff7f50" : "#1e90ff",
      },
    };
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
              startAccessor="start"
              endAccessor="end"
              eventPropGetter={eventStyleGetter}
              components={{
                dateCellWrapper: ({ children, value }) => {
                  const dateStr = moment(value).format("YYYY-MM-DD");
                  const dayEvents = events.find(
                    (event) =>
                      moment(event.start).format("YYYY-MM-DD") === dateStr
                  );

                  return (
                    <div
                      className="rbc-date-cell custom-date-cell"
                      style={{ marginTop: "38px" }}
                    >
                      <div className="buttons-container">
                        {dayEvents && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => showEventList(dayEvents.events)}
                          >
                            <Icon path={mdiCalendarCheck} size={0.6} />{" "}
                            {dayEvents.events.length}
                          </button>
                        )}
                        <div className="btn btn-secondary">T : 0 | m : 0</div>
                      </div>
                      {children}
                    </div>
                  );
                },
                agenda: {
                  event: ({ event }) => (
                    <div>
                      {event.events.map((e) => (
                        <div key={e._id}>{e.name}</div>
                      ))}
                    </div>
                  ),
                },
              }}
              className="m-3"
              style={{ height: 520, width: 1000 }}
              selectable
              views={["month", "agenda"]}
            />
          )}
        </div>
      </div>
      {addEvent && <AddEvents onClose={hideAddEvent} />}
      {selectedEvents && (
        <EventList events={selectedEvents} onClose={hideEventList} />
      )}
    </div>
  );
};

export default Calendar;
