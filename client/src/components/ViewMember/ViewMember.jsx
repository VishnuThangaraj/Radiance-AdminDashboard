import React, { useState, useEffect, useRef } from "react";
import "./ViewMember.scss";

const ViewMember = ({ memberId, onClose }) => {
  const [member, setMember] = useState(null);
  const modalRef = useRef(null);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Format the date
    return `${day} ${month} ${year}`;
  };

  if (!member) return null;

  return (
    <div className="view-member-overlay" data-aos="fade-in" data-aos-delay="10">
      <div className="view-member" data-aos="flip-up" ref={modalRef}>
        <button
          className="close-btn btn btn-danger py-1 m-2"
          style={{ fontSize: "20px" }}
          onClick={onClose}
        >
          Close
        </button>
        <div className="view-member-content">
          <div className="profile-details">
            <h3 className="modal-title">Member Profile</h3>
            {/* <p>
              <strong>ID :</strong> &nbsp;{member.username}
            </p> */}
            <p>
              <strong>Name :</strong> &nbsp;{member.name}
            </p>
            <p>
              <strong>Email :</strong> &nbsp;{member.email}
            </p>
            {/* <p>
              <strong>Phone :</strong> &nbsp;{member.phone}
            </p>
            <p>
              <strong>Gender :</strong> &nbsp;{member.gender} &nbsp;&nbsp;
              <strong>Age :</strong> &nbsp;{member.age}
            </p>
            <p>
              <strong>Height :</strong> &nbsp;{member.height} &nbsp;&nbsp;
              <strong>Weight :</strong> &nbsp;{member.weight}
            </p> */}
            <p>
              <strong>Membership :</strong> &nbsp;{member.subscription}
              &nbsp;
              <span className={`${member.payment ? "make-green" : "make-red"}`}>
                {member.payment ? "(Paid)" : "(Pending)"}
              </span>
            </p>
            <p>
              <strong>Start Date :</strong> &nbsp;
              {formatDate(member.start_date.slice(0, 10))}
            </p>
            <p>
              <strong>End Date :</strong> &nbsp;
              {formatDate(member.end_date.slice(0, 10))}
            </p>
            <p>
              <strong>Trainer :</strong> &nbsp;{member.trainer_name}
            </p>
            <p>
              <strong>Address :</strong> &nbsp;{member.address}
            </p>
          </div>
          <div
            className="profile-image mt-5"
            data-aos="fade-left"
            data-aos-delay="100"
          >
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
