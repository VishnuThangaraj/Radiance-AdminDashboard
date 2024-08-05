import React, { useEffect, useState } from "react";
import moment from "moment";
import "./EndOfTheDay.css";

const EndOfTheDay = ({ userID }) => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [ttlHours, setTtlHours] = useState(0);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const formattedDate = moment().format("YYYY-MM-DD");
        const response = await fetch("http://localhost:6969/get_eod_data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: formattedDate,
            userId: userID,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();

        setTasks(data.tasks || []);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        setError("Failed to fetch tasks. Please try again later.");
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    };

    fetchTasks();
  }, [userID]);

  useEffect(() => {
    // Calculate total hours whenever tasks change
    const total = tasks.reduce(
      (sum, task) => sum + (task.total_hours_worked || 0),
      0
    );
    setTtlHours(total);
  }, [tasks]);

  const handleInputChange = (e, index, field) => {
    const { value } = e.target;
    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, [field]: value } : task
    );
    setTasks(newTasks);
  };

  const saveAllTasks = async () => {
    try {
      const tasksToUpdate = tasks
        .filter((task) => task.total_hours_worked === 0)
        .map((task) => ({
          ...task,
          start_time: formatTime(task.start_time),
          end_time: formatTime(task.end_time),
        }));

      const response = await fetch("http://localhost:6969/update_tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tasksToUpdate),
      });

      if (!response.ok) {
        throw new Error("Failed to update tasks");
      }

      const updatedTasks = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map(
          (task) =>
            updatedTasks.find((updated) => updated._id === task._id) || task
        )
      );
    } catch (error) {
      console.error("Failed to update tasks:", error);
      setError("Failed to update tasks. Please try again later.");
      setTimeout(() => {
        setError(null);
      }, 5000); // Clear error after 5 seconds
    }
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":").map(Number);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const convertUTCToIST = (utcDateString) => {
    const date = new Date(utcDateString);
    const offset = 5 * 60 + 30; // Offset in minutes
    const istDate = new Date(date.getTime() + offset * 60 * 1000);

    let hours = istDate.getUTCHours();
    const minutes = istDate.getUTCMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const getTextColor = (totalHours, requiredHours) => {
    if (totalHours > requiredHours) return "red";
    return "green";
  };

  const showSubmitButton = tasks.some((task) => task.total_hours_worked === 0);

  const filteredTasks = tasks;

  return (
    <div id="endoftheday" className="display-area" data-aos="zoom-in">
      <h2 data-aos="fade-right" data-aos-delay="200">
        End of the Day Report
      </h2>
      {error && <p className="error">{error}</p>}
      <div className="table-holder2">
        <div className="table-wrapper2">
          <table className="eod-table2">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Description</th>
                <th>Duration</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Completion</th>
                <th>Hours Worked</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task, index) => {
                  const isEditable = task.total_hours_worked === 0;
                  const totalHoursColor = getTextColor(
                    task.total_hours_worked,
                    task.time_required
                  );

                  return (
                    <tr
                      key={task._id}
                      className={`${
                        task.completion_percentage < 100 ? "make-red" : ""
                      }`}
                    >
                      <td>{task.name}</td>
                      <td>{task.description}</td>
                      <td>{task.time_required} Hours</td>
                      <td>
                        {task.total_hours_worked > 0 ? (
                          convertUTCToIST(task.start_time)
                        ) : (
                          <input
                            type="time"
                            value={formatTime(task.start_time)}
                            onChange={(e) =>
                              handleInputChange(e, index, "start_time")
                            }
                            disabled={!isEditable}
                          />
                        )}
                      </td>
                      <td>
                        {task.total_hours_worked > 0 ? (
                          convertUTCToIST(task.end_time)
                        ) : (
                          <input
                            type="time"
                            value={formatTime(task.end_time)}
                            onChange={(e) =>
                              handleInputChange(e, index, "end_time")
                            }
                            disabled={!isEditable}
                          />
                        )}
                      </td>
                      <td>
                        {task.total_hours_worked > 0 ? (
                          `${task.completion_percentage || 0}%`
                        ) : (
                          <input
                            type="number"
                            value={task.completion_percentage || ""}
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                index,
                                "completion_percentage"
                              )
                            }
                            min="0"
                            max="100"
                            disabled={!isEditable}
                          />
                        )}
                      </td>
                      <td style={{ color: totalHoursColor }}>
                        {task.total_hours_worked.toFixed(1)} Hours
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7">No tasks available for today.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className="submit-section my-flex-row"
        style={{ justifyContent: "space-between" }}
      >
        <span className="total_work_hours pt-4 ps-3">
          TOTAL WORK HOURS :{" "}
          <span
            id="eod-work-val"
            className={`${ttlHours >= 8 ? "make-green" : "make-red"}`}
          >{`${ttlHours.toFixed(1)}`}</span>
        </span>
        {showSubmitButton && (
          <button
            onClick={saveAllTasks}
            className="submit-button me-3"
            style={{
              borderRadius: "20%/50%",
            }}
          >
            Submit EOD
          </button>
        )}
      </div>
    </div>
  );
};

export default EndOfTheDay;
