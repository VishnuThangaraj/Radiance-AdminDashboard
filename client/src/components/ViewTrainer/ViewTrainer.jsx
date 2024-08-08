import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ViewTrainer.scss";

const ViewTrainer = ({ trainerId, onClose }) => {
  const [trainer, setTrainer] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchTrainerDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:6969/trainer-data/${trainerId}`
        );
        setTrainer(response.data);
      } catch (error) {
        console.error("Error fetching trainer details:", error);
      }
    };

    fetchTrainerDetails();
  }, [trainerId]);

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

  if (!trainer) return null;

  return (
    <div
      className="view-trainer-overlay"
      data-aos="fade-in"
      data-aos-delay="10"
    >
      <div className="view-trainer" data-aos="flip-up" ref={modalRef}>
        <button
          className="close-btn btn btn-danger m-2 py-1"
          style={{ fontSize: "20px" }}
          onClick={onClose}
        >
          Close
        </button>
        <div className="view-trainer-content">
          <div className="profile-details">
            <h3 className="modal-title">Trainer Profile</h3>
            <p>
              <strong>ID :</strong> &nbsp;{trainer.username}
            </p>
            <p>
              <strong>Name :</strong> &nbsp;{trainer.name}
            </p>
            <p>
              <strong>Email :</strong> &nbsp;{trainer.email}
            </p>
            <p>
              <strong>Phone :</strong> &nbsp;{trainer.phone}
            </p>

            <p>
              <strong>Gender :</strong> &nbsp;{trainer.gender} &nbsp;&nbsp;
              <strong>Age :</strong> &nbsp;{trainer.age}
            </p>
            <p>
              <strong>Height :</strong> &nbsp;{trainer.height} cm &nbsp;&nbsp;
              <strong>Weight :</strong> &nbsp;{trainer.weight} kg
            </p>
            <p>
              <strong>Address :</strong> &nbsp;{trainer.address}
            </p>
          </div>
          <div
            className="profile-image mt-5"
            data-aos="fade-left"
            data-aos-delay="100"
          >
            <img src={"images/trainer-male.png"} alt="Profile" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTrainer;
