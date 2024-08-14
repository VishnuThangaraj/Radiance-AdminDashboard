import React, { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiAccountGroup, mdiYoga, mdiAccount, mdiAccountClock } from "@mdi/js";
import "./AdminDashboard.scss";
import axios from "axios";

const AdminDashboard = () => {
  const [dashCounters, setDashCounters] = useState({});
  const [transactions, setTransactions] = useState([]);
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
        const [dashResponse, txnResponse] = await Promise.all([
          axios.get("http://localhost:6969/dashboard-count"),
          axios.get("http://localhost:6969/get-transactions"),
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
      } catch (err) {
        console.error("Error Fetching Data", err);
      }
    };

    fetchData();
  }, []);

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
            className="pt-2 "
            style={{ paddingInlineStart: "15px", fontSize: "25px" }}
          >
            Transaction History
          </h2>
          <table>
            <thead>
              <tr>
                <th>Payment Number</th>
                <th>Date & Time</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => (
                <tr key={index}>
                  <td>{txn._id}</td>
                  <td>{new Date(txn.date).toLocaleString()}</td>
                  {/* <td>${txn.amount.toFixed(2)}</td> */}
                  {/* <td>{txn.status}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="dash-revenue">
          <div
            className="dash-received cash-widget mb-3"
            data-aos="fade-left"
            data-aos-delay="200"
          >
            dd
          </div>
          <div
            className="dash-balance cash-widget"
            data-aos="fade-left"
            data-aos-delay="300"
          >
            dd
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
