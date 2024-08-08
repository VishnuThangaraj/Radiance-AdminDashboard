import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./EditTrainerForm.scss";

const EditTrainerForm = ({ trainerId, onClose, onSave }) => {
  const [trainer, setTrainer] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    address: "",
    height: "",
    weight: "",
    age: "",
    gender: "",
    status: "",
  });

  const formRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const fetchTrainerDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:6969/trainer-data/${trainerId}`
        );
        setTrainer(response.data);
      } catch (error) {
        console.error("Error fetching Trainer details:", error);
      }
    };

    fetchTrainerDetails();
  }, [trainerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrainer((prevTrainer) => ({ ...prevTrainer, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      setTrainer((prevTrainer) => ({ ...prevTrainer, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:6969/trainer-data/${trainerId}`,
        trainer
      );

      if (response.status === 200) {
        showNotification("Trainer updated successfully!", "success");
        onSave();
        onClose();
        window.location.reload();
      } else {
        showNotification("Failed to update Trainer", "error");
      }
    } catch (error) {
      showNotification("Error updating Trainer. Please try again.", "error");
      console.error("Error:", error);
    }
  };

  const showNotification = (message, type) => {
    const notification = notificationRef.current;
    const icons = {
      success: `<i class="fa-solid fa-check-circle"></i>`,
      error: `<i class="fa-solid fa-exclamation-circle"></i>`,
    };
    const icon = icons[type] || icons.success;

    notification.innerHTML = `<div class="notification-content">
      <span class="notification-icon">${icon}</span>
      <span>${message}</span>
    </div>`;
    notification.className = `notification ${type}`;
    notification.style.opacity = "1";
    notification.style.transform = "translateY(0)";
    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateY(-100%)";
    }, 3000);
  };

  return (
    <>
      <div className="notification" ref={notificationRef}></div>
      <div className="edit-member-overlay" onClick={onClose} data-aos="fade-in">
        <div
          className="edit-member-form"
          onClick={(e) => e.stopPropagation()}
          data-aos="fade-down"
          data-aos-delay="150"
          ref={formRef}
        >
          <div id="editmbr-title" className="text-center mb-4">
            EDIT TRAINER
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={trainer.name ? "valid" : ""}
                  value={trainer.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={trainer.email ? "valid" : ""}
                  value={trainer.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone:</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className={trainer.phone ? "valid" : ""}
                  value={trainer.phone}
                  onChange={handleNumberChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address:</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className={trainer.address ? "valid" : ""}
                  value={trainer.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="height">Height (cm):</label>
                <input
                  type="text"
                  id="height"
                  name="height"
                  className={trainer.height ? "valid" : ""}
                  value={trainer.height}
                  onChange={handleNumberChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="weight">Weight (kg):</label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  className={trainer.weight ? "valid" : ""}
                  value={trainer.weight}
                  onChange={handleNumberChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">Age:</label>
                <input
                  type="text"
                  id="age"
                  name="age"
                  className={trainer.age ? "valid" : ""}
                  value={trainer.age}
                  onChange={handleNumberChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender:</label>
                <select
                  id="gender"
                  name="gender"
                  className={trainer.gender ? "valid" : ""}
                  value={trainer.gender}
                  onChange={handleChange}
                  style={{ padding: "11px" }}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="btn-holder text-center pt-3">
              <button type="submit" className="btn-submit px-5 me-3">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditTrainerForm;
