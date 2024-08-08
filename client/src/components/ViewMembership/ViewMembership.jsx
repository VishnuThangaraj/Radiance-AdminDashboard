import React, { useState, useEffect, useRef } from "react";
import "./ViewMembership.scss";

const ViewMembership = ({ planId, onClose }) => {
  const [members, setMembers] = useState([]);
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:6969/get-members/${planId}`
        );
        if (response.ok) {
          const data = await response.json();
          setMembers(data);
        } else {
          console.error("Failed to fetch member details");
        }
      } catch (error) {
        console.error("Error fetching member details:", error);
      }
    };

    fetchMemberDetails();
  }, [planId]);

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

    // Get the day, month and year
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Format the date
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="view-member-overlay" data-aos="fade-in" data-aos-delay="10">
      <div className="vieqw-member" data-aos="flip-up" ref={modalRef}>
        <div className="header">
          <h3 className="modal-title">Members List</h3>
          <button
            className="close-btn btn btn-danger py-1"
            style={{ fontSize: "20px" }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="members-table">
          {members.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member._id}>
                    <td>{member.name}</td>
                    <td>{formatDate(member.start_date.slice(0, 10))}</td>
                    <td>{formatDate(member.end_date.slice(0, 10))}</td>
                    <td
                      className={`${
                        member.payment_status ? "make-green" : "make-red"
                      }`}
                    >
                      {member.payment_status ? "PAID" : "PENDING"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-members fa-fade">No members found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewMembership;
