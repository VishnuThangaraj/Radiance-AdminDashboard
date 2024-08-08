import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./AddMemberForm.scss";

const AddMemberForm = ({ onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [subscriptionId, setSubscriptionId] = useState("");
  const [subscriptionDetails, setSubscriptionDetails] = useState({});
  const [plans, setPlans] = useState([]);
  const formRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    // Fetch trainers data
    const fetchTrainers = async () => {
      try {
        const response = await axios.get("http://localhost:6969/get-trainers");
        setTrainers(response.data);
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };

    fetchTrainers();

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
  }, [onClose]);

  useEffect(() => {
    const selectedPlan = plans.find((plan) => plan._id === subscriptionId);
    setSubscriptionDetails(selectedPlan || {});
  }, [subscriptionId, plans]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:6969/register-member",
        {
          name,
          email,
          phone,
          address,
          height,
          weight,
          age,
          gender,
          trainer_id: selectedTrainer,
          subscriptionDetails,
        }
      );

      if (response.status === 200) {
        showNotification("Member added successfully!", "success");
        window.location.reload();
        onClose();
      } else {
        showNotification(
          response.data.message || "Failed to add member",
          "error"
        );
      }
    } catch (error) {
      showNotification("Error adding member. Please try again.", "error");
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

  const handleNumberChange = (setter, min, max) => (e) => {
    const value = e.target.value;
    if (
      (value === "" || /^[0-9\b]+$/.test(value)) &&
      (min === undefined || (value >= min && value <= max))
    ) {
      setter(value);
    }
  };

  return (
    <>
      <div className="notification" ref={notificationRef}></div>
      <div className="add-member-form-overlay p-0" data-aos="fade-in">
        <div
          className="add-member-form"
          data-aos="fade-down"
          data-aos-delay="150"
          ref={formRef}
        >
          <h3 id="addmbr-title" className="text-center mb-4">
            ADD NEW MEMBER
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  className={name ? "valid" : ""}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className={email ? "valid" : ""}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  id="phone"
                  className={phone ? "valid" : ""}
                  value={phone}
                  onChange={handleNumberChange(setPhone)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  className={address ? "valid" : ""}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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
                  className={height ? "valid" : ""}
                  value={height}
                  onChange={handleNumberChange(setHeight)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  type="text"
                  id="weight"
                  className={weight ? "valid" : ""}
                  value={weight}
                  onChange={handleNumberChange(setWeight)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="text"
                  id="age"
                  className={age ? "valid" : ""}
                  value={age}
                  onChange={handleNumberChange(setAge, 0, 100)}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  className={gender ? "valid" : ""}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
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
                <label htmlFor="trainer">Trainer</label>
                <select
                  id="trainer"
                  className={selectedTrainer ? "valid" : ""}
                  value={selectedTrainer}
                  onChange={(e) => setSelectedTrainer(e.target.value)}
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
                  className={subscriptionId ? "valid" : ""}
                  value={subscriptionId}
                  onChange={(e) => setSubscriptionId(e.target.value)}
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
                  <strong>Duration : </strong>{" "}
                  {subscriptionDetails.duration || 0}{" "}
                  {subscriptionDetails.duration === 1 ? "Month" : "Months"}
                </div>
              </div>
            </div>
            <div className="btn-holder text-center pt-3">
              <button type="submit" className="btn-submit px-4 me-3">
                Add Member
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddMemberForm;
