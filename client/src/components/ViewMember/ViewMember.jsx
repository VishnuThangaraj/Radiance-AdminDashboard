import React, { useState, useEffect, useRef } from "react";
import "./ViewMember.css"; // Add necessary styling

const ViewMember = ({ memberId, onClose }) => {
  const [member, setMember] = useState(null);
  const modalRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!member) return null;

  return (
    <div className="view-member-overlay" data-aos="fade-in" data-aos-delay="10">
      <div className="view-member" data-aos="flip-up" ref={modalRef}>
        <button className="close-btn btn btn-danger m-2" onClick={onClose}>
          Close
        </button>
        <div className="view-member-content">
          <div className="profile-details">
            <h3 className="modal-title">Member Profile</h3>
            <p>
              <strong>ID :</strong> &nbsp;{member.username}
            </p>
            <p>
              <strong>Name :</strong> &nbsp;{member.name}
            </p>
            <p>
              <strong>Email :</strong> &nbsp;{member.email}
            </p>
            <p>
              <strong>Phone :</strong> &nbsp;{member.phone}
            </p>
            <p>
              <strong>Position :</strong> &nbsp;{member.position}
            </p>
            <p>
              <strong>Address :</strong> &nbsp;{member.address}
            </p>
          </div>
          <div className="profile-image mt-5">
            <img
              src={member.profilePic || "/images/profile_avatar.png"}
              alt="Profile"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMember;
