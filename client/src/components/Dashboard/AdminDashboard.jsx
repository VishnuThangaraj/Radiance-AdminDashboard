import React from "react";
import "./AdminDashboard.scss";

function AdminDashboard() {
  return (
    <div id="admin-dashboard" className="display-area">
      <div className="content-title" data-aos="fade-right">
        DASHBOARD
      </div>
      <div className="top-widgets-hold my-flex-row">
        <div className="dash-widget">
          <div className="wid-logo">H</div>
          <div className="wid-text">
            <div className="wid-title">vishnu</div>
            <div className="wid-description">55</div>
          </div>
        </div>
        <div className="dash-widget">2</div>
        <div className="dash-widget">3</div>
        <div className="dash-widget">4</div>
      </div>
    </div>
  );
}

export default AdminDashboard;
