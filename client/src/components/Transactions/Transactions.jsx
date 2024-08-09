import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import Icon from "@mdi/react";
import { mdiPrinterOutline } from "@mdi/js";
import html2pdf from "html2pdf.js";
import "./Transactions.scss";

const Transactions = ({ onClose }) => {
  const [transactions, setTransactions] = useState([]);
  const cardRef = useRef(null);

  useEffect(() => {
    const getTransactions = async () => {
      const response = await axios.get(
        `http://localhost:6969/get-transactions`
      );
      setTransactions(response.data);
    };

    getTransactions();

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

  const fetchAndGeneratePDF = async () => {
    try {
      const data = transactions;

      const htmlContent = `
  <div style="font-family: Arial, sans-serif; padding: 20px; margin: 0; position: relative; min-height: 1000px;">
    <div style="text-align: center; white-space: nowrap;">
      <h2 style="margin: 0;">Radiance Yoga Center</h2>
    </div>
    <div class="sub" style="text-align:center;">
    <div>Transcation History</div>
    </div>
    <hr style="border: 1px solid #ddd; margin: 20px 0;" />
    <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 8px; border: 1px solid #ddd;">Transaction ID</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Amount</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Date</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Time</th>
        </tr>
      </thead>
      <tbody>
        ${data
          .map(
            (transaction) => `
          <tr>
            <td>RYC-TR${transaction._id.slice(15)}</td>
            <td>₹ ${transaction.payment}</td>
            <td>${formatDate(transaction.date.slice(0, 10))}</td>
            <td>${formatDateToIST(transaction.date)}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
    <footer style="text-align: center; font-size: 10px; position: absolute; bottom: 0; width: 100%; border-top: 1px solid #ddd; padding: 10px 0; background-color: #fff;">
      © Radiance Yoga Center    |    12 Alpha Street, Coimbatore    |    +91 6383 580 965
    </footer>
  </div>
`;

      // Convert HTML content to PDF
      const opt = {
        margin: 0,
        filename: "Transcation_History (Radiance Yoga Center).pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      };

      html2pdf().from(htmlContent).set(opt).save();
    } catch (error) {
      console.error("Error fetching or generating PDF:", error);
    }
  };

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
            Transactions{" "}
          </h2>
          <button
            onClick={fetchAndGeneratePDF}
            className="btn btn-warning printer-btn py-1"
          >
            <Icon path={mdiPrinterOutline} size={1} />
          </button>
        </div>

        {/* The content you want to convert to PDF */}
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
                {transactions.length > 0 ? (
                  transactions.map((transcation) => (
                    <tr key={transcation._id}>
                      <td>RYC-TR{transcation._id.slice(15)}</td>
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

export default Transactions;
