import React, { useState, useEffect } from "react";
import "./EditMemberForm.css";

const EditMemberForm = ({ memberId, onClose, onSave }) => {
  const [member, setMember] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    address: "",
  });

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:6969/membersdata/${memberId}`
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

    fetchMemberDetails();
  }, [memberId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && isNaN(value)) return; // Allow only numbers for phone
    setMember((prevMember) => ({ ...prevMember, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:6969/membersdata/${memberId}`,
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
    <div className="edit-member-overlay" onClick={onClose} data-aos="fade-left">
      <div className="edit-member-form" onClick={(e) => e.stopPropagation()}>
        <div id="editmbr-title" className="text-center mb-4">
          EDIT MEMBER
        </div>
        <form onSubmit={handleSubmit}>
          <label className="edit-member-form-label">
            Name:
            <input
              type="text"
              name="name"
              value={member.name}
              onChange={handleChange}
              required
            />
          </label>
          <label className="edit-member-form-label">
            Email:
            <input
              type="email"
              name="email"
              value={member.email}
              onChange={handleChange}
              required
            />
          </label>
          <label className="edit-member-form-label">
            Position:
            <select
              name="position"
              value={member.position}
              onChange={handleChange}
              style={{ padding: "11px" }}
              required
            >
              <option value="">Select Position</option>
              <option value="Human Resource">Human Resource</option>
              <option value="Developer">Developer</option>
              <option value="Team Lead">Team Lead</option>
            </select>
          </label>
          <label className="edit-member-form-label">
            Address:
            <input
              type="text"
              name="address"
              value={member.address}
              onChange={handleChange}
            />
          </label>
          <label className="edit-member-form-label">
            Phone:
            <input
              type="tel"
              name="phone"
              value={member.phone}
              onChange={handleChange}
              required
            />
          </label>
          <div className="edit-member-form-buttons my-flex-row mx-4 mt-4">
            <button
              type="submit"
              className="sm-btn-edit edit-member-save-btn px-5"
            >
              Save
            </button>
            <button
              type="button"
              className="btn btn-secondary sm-btn-edit edit-member-close-btn px-5"
              style={{ padding: "12px" }}
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMemberForm;
