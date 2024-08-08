import React from "react";
import Icon from "@mdi/react";
import { mdiMail, mdiBell, mdiMagnify } from "@mdi/js";
import "./Navbar.scss";

const Navbar = ({ userDtls }) => {
  const userName = userDtls.name;

  return (
    <div id="navbar" data-aos="fade-down">
      <div className="navbar-left">
        <div
          className="search-container"
          data-aos="zoom-in-down"
          data-aos-delay="150"
        >
          <input
            type="text"
            className="search-bar ms-3 py-2"
            placeholder="Search..."
          />
          <Icon path={mdiMagnify} size={1} className="search-icon" />
        </div>
      </div>
      <div className="navbar-right">
        <Icon
          path={mdiMail}
          size={1}
          className="icon"
          data-aos="zoom-in-down"
          data-aos-delay="250"
        />
        <Icon
          path={mdiBell}
          size={1}
          className="icon"
          data-aos="zoom-in-down"
          data-aos-delay="350"
        />
        <div className="profile" data-aos="zoom-in-left" data-aos-delay="350">
          <img
            src="/images/profile_avatar.png"
            alt="Profile"
            className="profile-pic"
          />
          <span className="profile-name">{userName}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
