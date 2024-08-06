import React, { useState, useEffect, useRef } from "react";
import "./EditMemberForm.css";

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
    subscription: "",
    start_date: "",
  });
  const [trainers, setTrainers] = useState([]);

  const formRef = useRef(null);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:6969/member-data/${memberId}`
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setMember(data);
        } else {
          console.error("Failed to fetch member details");
        }
      } catch (error) {
        console.error("Error fetching member details:", error);
      }
    };

    fetchMemberDetails();

    const fetchTrainers = async () => {
      try {
        const response = await fetch("http://localhost:6969/get-trainers");
        const data = await response.json();
        setTrainers(data);
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };

    fetchTrainers();

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
        onSave();
        onClose();
        window.location.reload();
      } else {
        console.error("Failed to update member details");
      }
    } catch (error) {
      console.error("Error updating member details:", error);
    }
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
                  <option key={trainer.id} value={trainer._id}>
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
                name="subscription"
                className={member.subscription ? "valid" : ""}
                value={member.subscription}
                onChange={handleChange}
                style={{ padding: "13px" }}
                required
              >
                <option value="">Select Membership</option>
                <option value="BASIC">Basic</option>
                <option value="PREMIUM">Premium</option>
                <option value="ELITE">Elite</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="start_date">Subscription Start Date</label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                className={member.start_date ? "valid" : ""}
                value={member.start_date.slice(0, 10)}
                onChange={handleChange}
                style={{ padding: "12px" }}
                required
              />
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
  );
};

export default EditMemberForm;
