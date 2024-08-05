import React, { useState, useEffect } from "react";
import moment from "moment";
import Icon from "@mdi/react";
import { mdiArrowLeft } from "@mdi/js";
import "./PlanForTheDay.css";

const PlanForTheDay = ({ userID }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    time_required: "",
  });
  const [error, setError] = useState(null);
  const [removeIndex, setRemoveIndex] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const formattedDate = moment().format("YYYY-MM-DD");
        const response = await fetch("http://localhost:6969/get_pfd_data", {
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
      }
    };

    fetchTasks();
  }, [userID]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "time_required") {
      // Ensure value is a number between 1 and 24
      if (value === "" || /^[1-9]|1[0-9]|2[0-4]$/.test(value)) {
        setNewTask({ ...newTask, [name]: value });
      }
    } else {
      setNewTask({ ...newTask, [name]: value });
    }
  };

  const addTask = async () => {
    try {
      const response = await fetch("http://localhost:6969/add_task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: { ...newTask, user_id: userID },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const data = await response.json();
      setTasks([...tasks, data.task]);
      setNewTask({ name: "", description: "", time_required: "" });
      window.location.reload();
    } catch (error) {
      console.error("Failed to add task:", error);
      setError("Failed to add task. Please try again later.");
    }
  };

  const deleteTask = async (index) => {
    const taskToRemove = tasks[index];
    try {
      const response = await fetch(
        `http://localhost:6969/pfd/${taskToRemove._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove task");
      }

      setTasks(tasks.filter((_, i) => i !== index));
      setRemoveIndex(null);
    } catch (error) {
      console.error("Failed to remove task:", error);
      setError("Failed to remove task. Please try again later.");
    }
  };

  return (
    <div className="plan-for-the-day display-area" id="pfd_display">
      <div style={{ fontSize: "28px", paddingInlineStart: "4px" }}>
        Dashboard
      </div>
      {error && <p className="error text-danger fa-fade">{error}</p>}
      <div className="add-task mb-4" data-aos="fade-left">
        <input
          type="text"
          name="name"
          placeholder="Task Name"
          value={newTask.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Task Description"
          value={newTask.description}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="time_required"
          placeholder="Time Required (in Hours)"
          value={newTask.time_required}
          onChange={handleInputChange}
          min="1"
          max="24"
        />
        <button
          className="add-btn px-4"
          onClick={addTask}
          style={{ backgroundColor: "#30ce35" }}
        >
          Add Task
        </button>
      </div>
      <div className="task-table-container" data-aos="flip-up">
        <div className="pfd_head">PLAN FOR THE DAY</div>
        <table className="task-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Time Required</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <tr key={task._id || index}>
                  <td>{task.name || "N/A"}</td>
                  <td>{task.description || "N/A"}</td>
                  <td>{task.time_required || "N/A"} Hours</td>
                  <td>
                    {removeIndex === index ? (
                      <>
                        <button
                          className="delete-btn px-3"
                          onClick={() => deleteTask(index)}
                        >
                          Delete
                        </button>
                        <button
                          className="back-btn px-3"
                          onClick={() => setRemoveIndex(null)}
                        >
                          <Icon path={mdiArrowLeft} size={1} />
                        </button>
                      </>
                    ) : (
                      <button
                        className="remove-btn "
                        onClick={() => setRemoveIndex(index)}
                        style={{
                          borderRadius: "20px",
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No tasks available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlanForTheDay;
