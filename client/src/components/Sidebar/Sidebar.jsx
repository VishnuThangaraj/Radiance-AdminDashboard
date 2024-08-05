import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import {
  mdiSpeedometer,
  mdiCalendarMonth,
  mdiAccountMultiple,
  mdiYoga,
  mdiFileChart,
  mdiChevronDown,
  mdiChevronUp,
  mdiCircleSmall,
  mdiLogout,
  mdiCreditCardOutline,
  mdiCheckAll,
  mdiCheck,
} from "@mdi/js";
import Collapse from "react-collapse";
import "./Sidebar.css";

const Sidebar = ({ userRole }) => {
  const navigate = useNavigate();
  const [isReportOpen, setIsReportOpen] = useState(false);

  const adminSidebar = [
    {
      key: `sidebar-1`,
      label: "Members",
      value: "home",
      icon: mdiAccountMultiple,
      color: "#8f60e5",
    },
    {
      key: `sidebar-2`,
      label: "Trainers",
      value: "trainer",
      icon: mdiYoga,
      color: "#ffab06",
    },
    {
      key: `sidebar-3`,
      label: "Payment",
      value: "payment",
      icon: mdiCreditCardOutline,
      color: "#18be5a",
    },
    {
      key: `sidebar-3`,
      label: "Calendar",
      value: "calendar",
      icon: mdiCalendarMonth,
      color: "#0e85d6",
    },
  ];

  const userSidebar = [
    {
      key: `sidebar-u1`,
      label: "Dashboard",
      value: "home",
      icon: mdiSpeedometer,
      color: "#8f60e5",
    },
    {
      key: `sidebar-u4`,
      label: "Calendar",
      value: "home",
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
      localStorage.removeItem("userToken");
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
          {userRole === "admin" ? "Admin Dashboard" : "Employee Dashboard"}
        </div>
      </div>
      <div className="sidebar_navigation">Navigation</div>
      <div className="sidebar_menu">
        {userRole === "admin"
          ? adminSidebar.map((menu) => (
              <div
                key={menu.key}
                className="sidebar-content"
                onClick={() => handleItemClick(menu.value)}
              >
                <div className="icon-container">
                  <Icon path={menu.icon} size={0.7} color={menu.color} />
                </div>
                <span className="menu-label">{menu.label}</span>
              </div>
            ))
          : userSidebar.map((menu) => (
              <div
                key={menu.key}
                className="sidebar-content"
                onClick={() => handleItemClick(menu.value)}
              >
                <div className="icon-container">
                  <Icon path={menu.icon} size={0.7} color={menu.color} />
                </div>
                <span className="menu-label">{menu.label}</span>
              </div>
            ))}
        {userRole === "user" && (
          <>
            <div
              className="sidebar-content"
              onClick={() => setIsReportOpen(!isReportOpen)}
            >
              <div className="icon-container">
                <Icon path={mdiFileChart} size={0.7} color="#f7454d" />
              </div>
              <span className="menu-label">Report</span>
              <div className=" ms-4 icon-container chevron-container">
                <Icon
                  path={isReportOpen ? mdiChevronUp : mdiChevronDown}
                  size={0.7}
                  color="#8f60e5"
                />
              </div>
            </div>
            <Collapse isOpened={isReportOpen}>
              <div className="report-subsection ms-1">
                <div
                  className="sidebar-content pb-2"
                  onClick={() => handleItemClick("pfd")}
                >
                  <span
                    className="menu-label"
                    style={{
                      fontSize: "14px",
                    }}
                  >
                    <Icon path={mdiCheck} className="mx-2" size={0.8} />
                    Plan For The Day
                  </span>
                </div>
                <div
                  className="sidebar-content pt-0"
                  onClick={() => handleItemClick("eod")}
                >
                  <span
                    className="menu-label"
                    style={{
                      fontSize: "14px",
                    }}
                  >
                    <Icon path={mdiCheckAll} className="mx-2" size={0.8} />
                    End Of The Day
                  </span>
                </div>
              </div>
            </Collapse>
          </>
        )}
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