import React, { useEffect, useState, useRef } from "react";
import Icon from "@mdi/react";
import { mdiAccountGroup, mdiYoga, mdiAccount, mdiAccountClock } from "@mdi/js";
import "./AdminDashboard.scss";
import axios from "axios";
import counterUp from "counterup2";
import "waypoints/lib/noframework.waypoints";

const AdminDashboard = () => {
  const [dashCounters, setDashCounters] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [payments, setPayments] = useState({});

  const revenueRef = useRef(null);
  const unpaidRef = useRef(null);

  const topWidget = [
    {
      key: "t-wid1",
      icon: mdiAccountGroup,
      name: "totalUsers",
      title: "TOTAL MEMBERS",
      color: "#6861ce",
    },
    {
      key: "t-wid2",
      icon: mdiYoga,
      name: "totalTrainers",
      title: "TRAINERS",
      color: "#ffab15",
    },
    {
      key: "t-wid3",
      icon: mdiAccount,
      name: "totalMembers",
      title: "MEMBERS",
      color: "#47abf7",
    },
    {
      key: "t-wid4",
      icon: mdiAccountClock,
      name: "activeTrainers",
      title: "ACTIVE",
      color: "#31ce35",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashResponse, txnResponse, paymentResponse] = await Promise.all([
          axios.get("http://localhost:6969/dashboard-count"),
          axios.get("http://localhost:6969/get-transactions"),
          axios.get("http://localhost:6969/get-transactions-due"),
        ]);

        if (dashResponse.status === 200) {
          const data = dashResponse.data;
          setDashCounters({
            ...data,
            totalUsers: data.totalMembers + data.totalTrainers,
          });
        }

        if (txnResponse.status === 200) {
          setTransactions(txnResponse.data);
        }

        if (paymentResponse.status === 200) {
          setPayments(paymentResponse.data);
        }
      } catch (err) {
        console.error("Error Fetching Data", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (revenueRef.current && unpaidRef.current) {
      const waypoint = new Waypoint({
        element: revenueRef.current,
        handler: function () {
          counterUp(revenueRef.current, {
            duration: 800,
            delay: 16,
          });
          counterUp(unpaidRef.current, {
            duration: 800,
            delay: 16,
          });
          this.destroy();
        },
        offset: "bottom-in-view",
      });
    }
  }, [payments]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const options = {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const formattedDate = date.toLocaleString("en-US", options);

    const [monthDay, year, timePart] = formattedDate.split(", ");
    const formattedTime = timePart.replace(
      /^(\d+):(\d+)\s([APM]{2})$/,
      (match, hour, minute, period) => {
        return `${hour}:${minute}${period.toLowerCase()}`;
      }
    );

    return `${monthDay}, ${year}, ${formattedTime}`;
  };

  return (
    <div id="admin-dashboard" className="display-area">
      <div className="content-title" data-aos="fade-right">
        DASHBOARD
      </div>
      <div className="top-widgets-hold my-flex-row">
        {topWidget.map((widget, index) => (
          <div className="dash-widget" key={widget.key} data-aos="zoom-in">
            <div
              className="wid-logo my-flex-center"
              data-aos="zoom-in-down"
              data-aos-delay={200 + 50 * index}
            >
              <Icon path={widget.icon} size={2} color={widget.color} />
            </div>
            <div className="wid-text pt-1">
              <div className="wid-title my-flex-center">{widget.title}</div>
              <div
                className="wid-description"
                style={{ fontSize: "20px", letterSpacing: "1px" }}
              >
                {dashCounters[widget.name] || 0}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bottom-widgets-hold my-flex-row">
        <div className="dash-transcation" data-aos="zoom-in">
          <h2
            className="pt-3"
            style={{
              paddingInlineStart: "20px",
              fontSize: "20px",
              letterSpacing: "1px",
            }}
          >
            Transaction History
          </h2>
          <div className="table-wrapper" style={{ maxHeight: "320px" }}>
            <table id="transcation-table">
              <thead>
                <tr id="transcation_tr">
                  <th>PAYMENT NUMBER</th>
                  <th>DATE & TIME</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: "600", letterSpacing: "1px" }}>
                      <span
                        className="btn btn-round btn-success btn-sm me-2"
                        style={{ paddingInlineStart: "8px" }}
                      >
                        <i className="fa fa-check p-0"></i>
                      </span>
                      Payment from # {txn._id.slice(16)}
                    </td>
                    <td>{formatDate(txn.date)}</td>
                    <td>&#8377; {txn.payment}.00</td>
                    <td>
                      <div className="badge">COMPLETED</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="dash-revenue">
          <div
            className="dash-received cash-widget mb-3"
            data-aos="fade-left"
            data-aos-delay="200"
          >
            <div className="wid-title-revenue">Total Revenue</div>
            <div
              className="my-flex-row ps-5"
              style={{ justifyContent: "space-between" }}
            >
              <div
                className="wid-price make-green"
                ref={revenueRef}
                data-counter-start={0}
                data-counter-end={payments.totalPayment || 0}
              >
                <span style={{ color: "black" }}>&#8377;</span>{" "}
                {payments.totalPayment}
              </div>
              <div className="sdf" data-aos="fade-down" data-aos-delay="300">
                <img src="images/cash.png" />
              </div>
            </div>
          </div>
          <div
            className="dash-balance cash-widget"
            data-aos="fade-left"
            data-aos-delay="300"
          >
            <div className="wid-title-balance ">Unpaid Amount</div>
            <div
              className="my-flex-row ps-5"
              style={{ justifyContent: "space-between" }}
            >
              <div
                className="wid-price make-red"
                ref={unpaidRef}
                data-counter-start={0}
                data-counter-end={
                  payments.totalCost - payments.totalPayment || 0
                }
              >
                <span style={{ color: "black" }}>&#8377;</span>{" "}
                {payments.totalCost - payments.totalPayment}
              </div>
              <div className="sdf" data-aos="fade-up" data-aos-delay="300">
                <img src="images/loss.png" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
