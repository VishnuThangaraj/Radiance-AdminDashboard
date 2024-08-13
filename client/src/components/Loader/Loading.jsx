import React from "react";
import Logo from "/images/logo.png";
import "./Loading.scss";

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <img src="images/loader.png" alt="Loading" className="loading-image" />
        <div className="loading-text ">Loading...</div>
      </div>
    </div>
  );
};

export default Loading;
