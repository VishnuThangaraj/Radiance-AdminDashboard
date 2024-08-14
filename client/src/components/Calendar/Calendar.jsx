import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Icon from "@mdi/react";
import { mdiCalendarStarFourPoints, mdiCalendarCheck } from "@mdi/js";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AddEvents from "../Forms/Calendar/AddEvents";
import EventList from "./EventList/EventList";
import AttendanceList from "./AttendanceList/AttendanceList";
import "./Calendar.scss";

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [counts, setCounts] = useState({});
  const [addEvent, setAddEvent] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState(null);
  const [selectedAttendance, setSelectedAttendance] = useState(null);

  useEffect(() => {
    const fetchEventsAndCounts = async () => {
      try {
        const startOfMonth = moment().startOf("month");
        const endOfMonth = moment().endOf("month");

        const datesInMonth = [];
        let currentDate = startOfMonth.clone();
        while (currentDate <= endOfMonth) {
          datesInMonth.push(currentDate.format("YYYY-MM-DD"));
          currentDate.add(1, "day");
        }

        const response = await fetch("http://localhost:6969/get-calendar");
        const data = await response.json();

        const groupedEvents = data.calendars.reduce((acc, event) => {
          const date = moment(event.date).startOf("day").format("YYYY-MM-DD");
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(event);
          return acc;
        }, {});

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

        const countsData = {};
        await Promise.all(
          datesInMonth.map(async (date) => {
            const countsResponse = await fetch(
              `http://localhost:6969/fetch-attendance/${date}`
            );
            const attendanceCount = await countsResponse.json();
            countsData[date] = {
              trainerCount: attendanceCount.trainerCount || 0,
              memberCount: attendanceCount.memberCount || 0,
            };
          })
        );

        setCounts(countsData);
      } catch (error) {
        console.error("Error fetching events or counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventsAndCounts();
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

  const showAttendanceList = async (dateStr) => {
    try {
      const response = await fetch(
        `http://localhost:6969/fetch-attendance-list/${dateStr}`
      );
      const attendanceData = await response.json();
      setSelectedAttendance(attendanceData.attendance || []);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const hideAttendanceList = () => {
    setSelectedAttendance(null);
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
                  const trainerCount = counts[dateStr]?.trainerCount || 0;
                  const memberCount = counts[dateStr]?.memberCount || 0;

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
                        <div
                          id="trainer_count"
                          className="btn btn-secondary"
                          onClick={() => showAttendanceList(dateStr)}
                        >
                          T: {trainerCount} | M: {memberCount}
                        </div>
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
      {selectedAttendance && (
        <AttendanceList
          attendance={selectedAttendance}
          onClose={hideAttendanceList}
        />
      )}
    </div>
  );
};

export default Calendar;
