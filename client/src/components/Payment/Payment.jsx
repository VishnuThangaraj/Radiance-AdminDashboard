import React, { useState, useEffect } from "react";
import { SnackbarProvider, useSnackbar } from "notistack";
import Icon from "@mdi/react";
import axios from "axios";
import { mdiPrinterOutline, mdiCashClock } from "@mdi/js";
import Transcations from "../Transcations/Transcations";
import PaymentPopup from "../PaymentPopup/PaymentPopup"; // Import the popup component
import "./Payment.scss";

function Payment() {
  const [payments, setPayments] = useState([]);
  const [showTranscations, setShowTranscations] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const showNotification = (message, type) => {
    enqueueSnackbar(message, {
      variant: type,
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
    });
  };

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`http://localhost:6969/get-payments`);
        setPayments(response.data);
      } catch (err) {
        console.log("Error Fetching Payments Data", err);
      }
    };

    fetchPayments();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleTranscationsClose = () => {
    setShowTranscations(false);
  };

  const handlePayClick = (amount, sub_id, member_id) => {
    setSelectedAmount(amount);
    setSelectedSub(sub_id);
    setSelectedMember(member_id);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handlePaymentConfirm = () => {
    showNotification("Payment Successful!", "success");
    setShowPopup(false);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handlePaymentFailure = () => {
    showNotification("Payment Failure !", "warning");
    setShowPopup(false);
  };

  return (
    <div id="payment_section" className="display-area">
      <div className="content-title" data-aos="fade-right">
        DASHBOARD
      </div>
      <div className="content-title-holder py-2 my-flex-row">
        <div className="hello" data-aos="zoom-out-up">
          Comprehensive Payments List
        </div>
        <div className="utility-holder my-flex-row">
          <div
            className="btn btn-outline-info utl-btn"
            data-aos="fade-left"
            data-aos-anchor="#example-anchor"
            data-aos-offset="500"
            data-aos-duration="500"
          >
            <Icon path={mdiPrinterOutline} size={1} /> Export Data
          </div>
          <div
            className="btn btn-outline-success transcation-btn"
            data-aos="fade-left"
            data-aos-anchor="#example-anchor"
            data-aos-offset="500"
            data-aos-duration="300"
            onClick={() => setShowTranscations(true)}
          >
            <Icon path={mdiCashClock} size={1} /> Transcations
          </div>
        </div>
      </div>
      <div className="payment-table-holder mt-2 p-3" data-aos="zoom-in">
        <div className="table-wrapper">
          <table id="payment_table">
            <thead>
              <tr>
                <th style={{ width: "10%" }}>User ID</th>
                <th style={{ width: "10%" }}>Name</th>
                <th style={{ width: "10%" }}>Membership</th>
                <th style={{ width: "10%" }}>Start Date</th>
                <th style={{ width: "10%" }}>End Date</th>
                <th style={{ width: "10%" }}>Status</th>
                <th style={{ width: "8%" }}>Amount</th>
                <th style={{ width: "8%" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? (
                payments.map((pay) => (
                  <tr key={pay._id} className="payment-row">
                    <td>{pay.username}</td>
                    <td>{pay.name}</td>
                    <td>{pay.membership_details.name.toUpperCase()}</td>
                    <td>
                      {formatDate(
                        pay.subscription_details.start_date.slice(0, 10)
                      )}
                    </td>
                    <td>
                      {formatDate(
                        pay.subscription_details.end_date.slice(0, 10)
                      )}
                    </td>
                    <td
                      className={`${
                        pay.subscription_details.payment_status
                          ? "make-green"
                          : "make-red"
                      }`}
                    >
                      {pay.subscription_details.payment_status
                        ? "PAID"
                        : "UNPAID"}
                    </td>
                    <td>&#8377; {pay.membership_details.price}</td>
                    <td>
                      {pay.subscription_details.payment_status ? (
                        <div
                          className="btn btn-success px-4"
                          style={{ cursor: "not-allowed" }}
                        >
                          PAID
                        </div>
                      ) : (
                        <div
                          className="btn btn-primary payment-btn px-4"
                          onClick={() =>
                            handlePayClick(
                              pay.membership_details.price,
                              pay.subscription_details._id,
                              pay._id
                            )
                          }
                        >
                          PAY
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center fa-fade"
                    style={{ padding: "150px 10px", fontSize: "20px" }}
                  >
                    No Payment found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showTranscations && <Transcations onClose={handleTranscationsClose} />}
      {showPopup && (
        <PaymentPopup
          amount={selectedAmount}
          memberId={selectedMember}
          subId={selectedSub}
          onClose={handlePopupClose}
          onPay={handlePaymentConfirm}
          onFail={handlePaymentFailure}
        />
      )}
    </div>
  );
}

export default Payment;
