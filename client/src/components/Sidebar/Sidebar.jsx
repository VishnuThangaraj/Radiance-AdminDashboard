import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import {
  mdiSpeedometer,
  mdiCalendarMonth,
  mdiAccountMultiple,
  mdiYoga,
  mdiLogout,
  mdiCreditCardOutline,
  mdiCrown,
  mdiChartBoxMultipleOutline,
} from "@mdi/js";
import "./Sidebar.scss";

const Sidebar = ({ userRole }) => {
  const navigate = useNavigate();
  const currentPath = location.pathname.slice(1);

  const adminSidebar = [
    {
      key: `sidebar-1`,
      label: "Dashboard",
      value: "home",
      icon: mdiSpeedometer,
      color: "#8f60e5",
    },
    {
      key: `sidebar-2`,
      label: "Attendance",
      value: "attendance",
      icon: mdiChartBoxMultipleOutline,
      color: "#0e85d6",
    },
    {
      key: `sidebar-3`,
      label: "Members",
      value: "member",
      icon: mdiAccountMultiple,
      color: "#ffab06",
    },
    {
      key: `sidebar-4`,
      label: "Trainers",
      value: "trainer",
      icon: mdiYoga,
      color: "#ac2c36",
    },
    {
      key: `sidebar-5`,
      label: "Payment",
      value: "payment",
      icon: mdiCreditCardOutline,
      color: "#18be5a",
    },
    {
      key: `sidebar-6`,
      label: "Membership",
      value: "membership",
      icon: mdiCrown,
      color: "#ffab15",
    },

    {
      key: `sidebar-7`,
      label: "Calendar",
      value: "calendar",
      icon: mdiCalendarMonth,
      color: "#0e85d6",
    },
  ];

  const trainerSidebar = [
    {
      key: `sidebar-u2`,
      label: "Members",
      value: "member",
      icon: mdiAccountMultiple,
      color: "#ffab06",
    },
    {
      key: `sidebar-u4`,
      label: "Calendar",
      value: "calendar",
      icon: mdiCalendarMonth,
      color: "#06cf5d",
    },
  ];

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:6969/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleItemClick = (value) => {
    console.log("Navigating to:", value);
    navigate(`/${value}`);
    window.location.reload();
  };

  return (
    <div id="sidebar" data-aos="fade-right">
      <div className="sidebar_logo_holder">
        <span className="sidebar_brand">
          <span className="me-3">
            <img src="images/logo.png" height={40} width={40} />
          </span>
          RADIANCE
        </span>
      </div>
      <div className="user_main sidbar_menu">
        <div
          className="role_area fa-fade"
          style={{ "--fa-animation-duration": "2s" }}
        >
          {userRole === "admin" ? "Admin Dashboard" : "Trainer Dashboard"}
        </div>
      </div>
      <div className="sidebar_navigation">Navigation</div>
      <div className="sidebar_menu">
        {userRole === "admin"
          ? adminSidebar.map((menu, index) => (
              <div
                key={menu.key}
                className={`sidebar-content ${
                  currentPath === menu.value ? "nav-active" : ""
                }`}
                onClick={() => handleItemClick(menu.value)}
                data-aos="fade-right"
                data-aos-anchor="#example-anchor"
                data-aos-offset="200"
                data-aos-duration="300"
                data-aos-delay={300 + 50 * index}
              >
                <div className="icon-container">
                  <Icon path={menu.icon} size={0.7} color={menu.color} />
                </div>
                <span className="menu-label">{menu.label}</span>
              </div>
            ))
          : trainerSidebar.map((menu) => (
              <div
                key={menu.key}
                className={`sidebar-content ${
                  currentPath === menu.value ? "nav-active" : ""
                }`}
                onClick={() => handleItemClick(menu.value)}
              >
                <div className="icon-container">
                  <Icon path={menu.icon} size={0.7} color={menu.color} />
                </div>
                <span className="menu-label">{menu.label}</span>
              </div>
            ))}
      </div>
      <div className="logout-user text-center">
        <button
          className="btn btn-warningd log-btn "
          onClick={handleLogout}
          style={{
            color: "#f7454d",
            border: "1px solid #f7454d",
          }}
        >
          <Icon path={mdiLogout} size={1} />
          LOGOUT
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
