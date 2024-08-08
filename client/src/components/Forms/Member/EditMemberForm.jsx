import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./EditMemberForm.scss";

const EditMemberForm = ({ memberId, onClose, onSave }) => {
  const [member, setMember] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    height: "",
    weight: "",
    age: "",
    gender: "",
    trainer_id: "",
    subscriptionId: "",
  });
  const [trainers, setTrainers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [subscriptionDetails, setSubscriptionDetails] = useState({});
  const formRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:6969/member-data/${memberId}`
        );

        if (response.ok) {
          const data = await response.json();
          setMember(data);
        } else {
          console.error("Failed to fetch member details");
        }
      } catch (error) {
        console.error("Error fetching member details:", error);
      }
    };

    const fetchTrainers = async () => {
      try {
        const response = await fetch("http://localhost:6969/get-trainers");
        const data = await response.json();
        setTrainers(data);
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };

    const fetchPlans = async () => {
      try {
        const response = await axios.get(
          "http://localhost:6969/get-membership"
        );
        setPlans(response.data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    fetchMemberDetails();
    fetchTrainers();
    fetchPlans();

    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [memberId, onClose]);

  useEffect(() => {
    const selectedPlan = plans.find(
      (plan) => plan._id === member.subscriptionId
    );
    setSubscriptionDetails(selectedPlan || {});
  }, [member.subscriptionId, plans]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && isNaN(value)) return;
    setMember((prevMember) => ({ ...prevMember, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:6969/member-data/${memberId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(member),
        }
      );

      if (response.ok) {
        showNotification("Member updated successfully!", "success");
        onSave();
        onClose();
      } else {
        showNotification("Failed to update member details", "error");
      }
    } catch (error) {
      showNotification(
        "Error updating member details. Please try again.",
        "error"
      );
      console.error("Error updating member details:", error);
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
    <div className="edit-member-overlay" onClick={onClose} data-aos="fade-in">
      <div
        className="edit-member-form"
        onClick={(e) => e.stopPropagation()}
        ref={formRef}
        data-aos="fade-down"
      >
        <h3 id="editmbr-title" className="text-center mb-4">
          EDIT MEMBER
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className={member.name ? "valid" : ""}
                value={member.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className={member.email ? "valid" : ""}
                value={member.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className={member.phone ? "valid" : ""}
                value={member.phone}
                onChange={handleChange}
                required
                pattern="[0-9]*"
                inputMode="numeric"
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                className={member.address ? "valid" : ""}
                value={member.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="height">Height (cm)</label>
              <input
                type="text"
                id="height"
                name="height"
                className={member.height ? "valid" : ""}
                value={member.height}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="text"
                id="weight"
                name="weight"
                className={member.weight ? "valid" : ""}
                value={member.weight}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="text"
                id="age"
                name="age"
                className={member.age ? "valid" : ""}
                value={member.age}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                className={member.gender ? "valid" : ""}
                value={member.gender}
                onChange={handleChange}
                style={{ padding: "13px" }}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="trainer_id">Trainer</label>
              <select
                id="trainer_id"
                name="trainer_id"
                className={member.trainer_id ? "valid" : ""}
                value={member.trainer_id}
                onChange={handleChange}
                style={{ padding: "13px" }}
                required
              >
                <option value="">Select Trainer</option>
                {trainers.map((trainer) => (
                  <option key={trainer._id} value={trainer._id}>
                    {trainer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="subscription">Membership</label>
              <select
                id="subscription"
                name="subscriptionId"
                className={member.subscriptionId ? "valid" : ""}
                value={member.subscriptionId}
                onChange={handleChange}
                style={{ padding: "13px" }}
                required
              >
                <option value="">Select Membership</option>
                {plans.map((plan) => (
                  <option key={plan._id} value={plan._id}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group pt-4 ms-3">
              <div className="plan-price">
                <strong>Price : </strong> &#8377;{" "}
                {subscriptionDetails.price || 0}
              </div>
              <div className="plan-duration">
                <strong>Duration : </strong> {subscriptionDetails.duration || 0}{" "}
                {subscriptionDetails.duration === 1 ? "Month" : "Months"}
              </div>
            </div>
          </div>
          <div className="btn-holder text-center pt-3">
            <button type="submit" className="btn-submit px-5 me-3">
              Save
            </button>
          </div>
        </form>
        <div ref={notificationRef} className="notification"></div>
      </div>
    </div>
  );
};

export default EditMemberForm;
