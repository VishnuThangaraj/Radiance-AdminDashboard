import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import Icon from "@mdi/react";
import { mdiPrinterOutline } from "@mdi/js";
import "./Transcations.scss";

const Transcations = ({ onClose }) => {
  const [transcations, setTranscations] = useState([]);
  const cardRef = useRef(null);

  useEffect(() => {
    const getTranscations = async () => {
      const response = await axios.get(
        `http://localhost:6969/get-transcations`
      );
      setTranscations(response.data);
    };

    getTranscations();

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

  const formatDateToIST = (dateString) => {
    const date = new Date(dateString);

    // Convert to IST (UTC+5:30)
    const offset = 0;
    const utcOffset = date.getTimezoneOffset();
    const istDate = new Date(date.getTime() + (offset - utcOffset) * 60 * 1000);

    let hours = istDate.getUTCHours();
    let minutes = istDate.getUTCMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}:${minutes} ${ampm}`;
  };

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
    <div className="transcations-overlay" data-aos="fade-in">
      <div
        className="transcations-card"
        ref={cardRef}
        data-aos="flip-up"
        data-aos-delay="150"
      >
        <div className="header-hold my-flex-row">
          <h2
            style={{ paddingInlineStart: "145px", paddingInlineEnd: "125px" }}
          >
            Transcations{" "}
          </h2>
          <button className="btn btn-warning printer-btn py-1">
            <Icon path={mdiPrinterOutline} size={1} />
          </button>
        </div>
        <div className="transcation-table-holder" data-aos="zoom0in">
          <div className="table-wrapper">
            <table id="transcation_table">
              <thead>
                <tr>
                  <th style={{ width: "25%" }}>Transcation ID</th>
                  <th style={{ width: "10%" }}>Amount</th>
                  <th style={{ width: "20%" }}>Date</th>
                  <th style={{ width: "20%" }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {transcations.length > 0 ? (
                  transcations.map((transcation) => (
                    <tr key={transcation._id}>
                      <td>RYC-TR{transcation._id.slice(17)}</td>
                      <td> ₹ {transcation.payment}</td>
                      <td>{formatDate(transcation.date.slice(0, 10))}</td>
                      <td>{formatDateToIST(transcation.date)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center fa-fade"
                      style={{ padding: "150px 10px", fontSize: "20px" }}
                    >
                      Empty Transcation History
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transcations;
