import React, { useRef, useEffect } from "react";
import "./Transcations.scss";

const Transcations = ({ onClose }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="transcations-overlay">
      <div className="transcations-card" ref={cardRef}>
        <h2>Transcations</h2>
        <button>Export As PDF</button>
        <p>No Transcation History.</p>
      </div>
    </div>
  );
};

export default Transcations;
