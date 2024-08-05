import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./MemberCalendar.css";
import PfdReport from "../Reports/PfdReport";
import EodReport from "../Reports/EodReport";

const localizer = momentLocalizer(moment);

const MemberCalendar = ({ User_Data }) => {
  console.log(User_Data);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPfdReport, setShowPfdReport] = useState(false);
  const [showEodReport, setShowEodReport] = useState(false);
  const [currentPfdDate, setCurrentPfdDate] = useState(null);
  const [pfdStatus, setPfdStatus] = useState({});
  const [pfdData, setPfdData] = useState([]);
  const [eodData, setEodData] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = moment().startOf("day");
  const maxDate = moment("2026-12-31").endOf("day");
  const threeMonthsAgo = moment().subtract(3, "months").startOf("day");

  useEffect(() => {
    // Function to load pfdStatus for the last 3 months
    const loadPfdStatus = async () => {
      let currentDate = moment(threeMonthsAgo);
      const status = {};

      while (currentDate.isSameOrBefore(today)) {
        const formattedDate = currentDate.format("YYYY-MM-DD");
        try {
          const response = await fetch("http://localhost:6969/check_pfd", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              date: formattedDate,
              userId: User_Data.id,
            }),
          });
          const result = await response.json();
          status[formattedDate] = result.hasTasks;
        } catch (error) {
          console.error("Error checking PFD:", error);
        }
        currentDate = currentDate.add(1, "day");
      }

      setPfdStatus(status);
      setLoading(false); // Set loading to false once data is fetched
    };

    loadPfdStatus();
  }, [User_Data.id]);

  const fetchPfdData = async (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    try {
      const response = await fetch("http://localhost:6969/get_pfd_data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: formattedDate,
          userId: User_Data.id,
        }),
      });
      const result = await response.json();
      setPfdData(result.tasks || []);
    } catch (error) {
      console.error("Error fetching PFD data:", error);
    }
  };

  const fetchEodData = async (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    try {
      const response = await fetch("http://localhost:6969/get_eod_data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: formattedDate,
          userId: User_Data.id,
        }),
      });
      const result = await response.json();
      setEodData(result.tasks || []);
    } catch (error) {
      console.error("Error fetching EOD data:", error);
    }
  };

  const handleDateClick = (date) => {
    setCurrentPfdDate(date);
    fetchPfdData(date);
    setShowPfdReport(true);
  };

  const handlePfdSubmit = (tasks) => {
    const formattedDate = moment(currentPfdDate).format("YYYY-MM-DD");
    setPfdStatus((prevStatus) => ({
      ...prevStatus,
      [formattedDate]: true,
    }));
    setShowPfdReport(false);
  };

  const handleEodButtonClick = (date) => {
    if (isPfdAdded(date)) {
      fetchEodData(date);
      setShowEodReport(true);
    }
  };

  const isPfdAdded = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    return pfdStatus[formattedDate];
  };

  const isWithinRange = (date) => {
    return moment(date).isBetween(threeMonthsAgo, maxDate, "day", "[]");
  };

  const getButtonClass = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    if (moment(date).isAfter(today)) {
      return "btn-disabled";
    }
    return isPfdAdded(date) ? "btn-green" : "btn-disabled";
  };

  return (
    <div id="member_calendar" className="display-area">
      <div className="content">
        <div className="calendar-holder">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Calendar
              localizer={localizer}
              events={[]}
              startAccessor="start"
              endAccessor="end"
              className="ms-3 my-3"
              style={{ height: 530, width: 1000 }}
              selectable
              components={{
                dateCellWrapper: ({ children, value }) => (
                  <div
                    className="date-cell"
                    style={{ paddingInlineEnd: "84px" }}
                  >
                    <div className="date-content">{children}</div>
                    <div className="buttons">
                      <button
                        className={`btn py-0 ${getButtonClass(value)}`}
                        onClick={() => handleDateClick(value)}
                        disabled={moment(value).isAfter(today)}
                      >
                        PFD
                      </button>
                      <button
                        className="btn py-0"
                        onClick={() => {
                          if (isPfdAdded(value)) {
                            handleEodButtonClick(value);
                          }
                        }}
                        disabled={!isPfdAdded(value)}
                      >
                        EOD
                      </button>
                    </div>
                  </div>
                ),
              }}
            />
          )}
        </div>
      </div>
      {showPfdReport && (
        <PfdReport tasks={pfdData} onClose={() => setShowPfdReport(false)} />
      )}
      {showEodReport && (
        <EodReport tasks={eodData} onClose={() => setShowEodReport(false)} />
      )}
    </div>
  );
};

export default MemberCalendar;
