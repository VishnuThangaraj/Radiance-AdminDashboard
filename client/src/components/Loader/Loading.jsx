import React from "react";
import Logo from "/images/logo.png";
import "./Loading.scss";

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <img src={Logo} alt="Loading" className="loading-image fa-bounce" />
        <div className="loading-text text-light">Loading...</div>
      </div>
    </div>
  );
};

export default Loading;
