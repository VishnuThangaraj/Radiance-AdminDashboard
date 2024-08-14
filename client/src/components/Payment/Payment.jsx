import React, { useState, useEffect } from "react";
import { SnackbarProvider, useSnackbar } from "notistack";
import Icon from "@mdi/react";
import axios from "axios";
import {
  mdiPrinterOutline,
  mdiCashClock,
  mdiFileDocumentOutline,
} from "@mdi/js";
import Transactions from "../Transactions/Transactions";
import PaymentPopup from "../PaymentPopup/PaymentPopup";
import html2pdf from "html2pdf.js";
import "./Payment.scss";

function Payment() {
  const [payments, setPayments] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
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
    return `${day}-${month}-${year}`;
  };

  const handleTransactionsClose = () => {
    setShowTransactions(false);
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

  const fetchAndGeneratePDF = async () => {
    try {
      const data = payments;

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; margin: 0; position: relative; min-height: 1000px;">
          <div style="text-align: center; white-space: nowrap;">
            <h2 style="margin: 0;">Radiance Yoga Center</h2>
          </div>
          <div class="sub" style="text-align:center;">
            <div>Payment List</div>
          </div>
          <hr style="border: 1px solid #ddd; margin: 20px 0;" />
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th>User ID</th>
                <th>Name</th>
                <th>Membership</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (pay) => `
                <tr>
                  <td>${pay.username}</td>
                  <td>${pay.name}</td>
                  <td>${pay.membership_details.name.toUpperCase()}</td>
                  <td>${formatDate(
                    pay.subscription_details.start_date.slice(0, 10)
                  )}</td>
                  <td>${formatDate(
                    pay.subscription_details.end_date.slice(0, 10)
                  )}</td>
                  <td>${
                    pay.subscription_details.payment_status ? "PAID" : "UNPAID"
                  }</td>
                  <td>&#8377; ${pay.membership_details.price}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
          <footer style="text-align: center; font-size: 10px; position: absolute; bottom: 0; width: 100%; border-top: 1px solid #ddd; padding: 10px 0; background-color: #fff;">
            © Radiance Yoga Center | 12 Alpha Street, Coimbatore | +91 6383 580 965
          </footer>
        </div>
      `;

      // Convert HTML content to PDF
      const opt = {
        margin: 0,
        filename: "Payment_List (Radiance Yoga Center).pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      };

      html2pdf().from(htmlContent).set(opt).save();
    } catch (error) {
      console.error("Error fetching or generating PDF:", error);
    }
  };

  const GenerateReceipt = async () => {
    if (!receiptData) return;

    try {
      const data = {
        name: receiptData.name,
        date: formatDate(new Date()),
        amount: receiptData.membership_details.price,
        subscriptionType: receiptData.membership_details.name.toUpperCase(),
        receiptId: receiptData._id,
      };

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 40px; margin: 0; position: relative; background-color: #f7f7f7;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h2 style="margin: 0; color: #333;">Radiance Yoga Center</h2>
            <p style="margin: 5px 0 0; font-size: 12px; color: #666;">12 Alpha Street, Coimbatore | +91 6383 580 965</p>
          </div>
          
          <div style="background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h3 style="margin: 0 0 20px; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Membership Purchase Receipt</h3>
            
            <div style="width: 100%>
            <p style="margin: 0; font-size: 14px;"><strong>Receipt ID:</strong> ${data.receiptId.slice(
              5
            )}</p></div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
              <div style="width: 48%;">
                <p style="margin: 0;padding-bottom:5px; font-size: 14px;"><strong>Name:</strong> ${
                  data.name
                }</p>
                <p style="margin: 0;padding-bottom:5px;  font-size: 14px;"><strong>Subscription Type:</strong> ${
                  data.subscriptionType
                }</p>
                <p style="margin: 0;padding-bottom:5px;  font-size: 14px;"><strong>Date:</strong> ${
                  data.date
                }</p>
              </div>
              <div style="width: 48%;">
                
                <p style="margin: 0;padding-bottom:5px;  font-size: 14px;"><strong>Amount Paid:</strong> ₹${
                  data.amount
                }</p>
                <p style="margin: 0;padding-bottom:5px;  font-size: 14px;"><strong>Payment Method:</strong> CASH</p>
              </div>
            </div>

            <div style="margin-top: 30px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #666;">Thank you for choosing Radiance Yoga Center for your wellness journey. We appreciate your membership and look forward to seeing you in our classes.</p>
            </div>
          </div>
          
          <footer style="text-align: center; font-size: 10px; margin-top: 40px;">
            © ${new Date().getFullYear()} Radiance Yoga Center | All Rights Reserved
          </footer>
        </div>
      `;

      const opt = {
        margin: 0,
        filename: `Receipt-${data.name} (Radiance Yoga Center).pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "pt", format: "a5", orientation: "portrait" },
      };

      html2pdf().from(htmlContent).set(opt).save();
    } catch (error) {
      console.error("Error generating receipt:", error);
    }
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

  const handleGenerateReceiptClick = (paymentData) => {
    setReceiptData(paymentData);
    GenerateReceipt();
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
            onClick={fetchAndGeneratePDF}
            data-aos="fade-left"
            data-aos-anchor="#example-anchor"
            data-aos-offset="500"
            data-aos-duration="500"
          >
            <Icon path={mdiPrinterOutline} size={1} /> Export
          </div>
          <div
            className="btn btn-outline-success transcation-btn"
            data-aos="fade-left"
            data-aos-anchor="#example-anchor"
            data-aos-offset="500"
            data-aos-duration="300"
            onClick={() => setShowTransactions(true)}
          >
            <Icon path={mdiCashClock} size={1} /> Transactions
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
                <th style={{ width: "8%", paddingInlineStart: "35px" }}>
                  Action
                </th>
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
                          className="btn btn-success px-3"
                          onClick={() => handleGenerateReceiptClick(pay)}
                        >
                          <Icon path={mdiFileDocumentOutline} size={1} /> Print
                        </div>
                      ) : (
                        <div
                          className="btn btn-primary payment-btn "
                          style={{ paddingInline: "31px" }}
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
      {showTransactions && <Transactions onClose={handleTransactionsClose} />}
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
