import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:6969/login",
        { username, password },
        { withCredentials: true }
      );
      if (onLogin) onLogin(username);
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.");
      console.error("Login failed:", err);
    }
  };

  return (
    <section
      className="ftco-section"
      style={{
        backgroundImage: `url('/images/background.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        width: "100%",
        paddingBottom: "140px",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center mb-5">
            <h2 className="heading-section">RADIANCE YOGA CENTER</h2>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="login-wrap p-0">
              <form onSubmit={handleSubmit} className="signin-form">
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    aria-label="Username"
                  />
                </div>
                <div className="form-group">
                  <input
                    id="password-field"
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-label="Password"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className={`fa fa-fw ${
                      showPassword ? "fa-eye" : "fa-eye-slash"
                    } field-icon`}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  ></span>
                </div>
                <div className="form-group">
                  <button
                    type="submit"
                    className="form-control btn btn-primary submit px-3"
                  >
                    Sign In
                  </button>
                </div>
                <div className="form-group d-md-flex">
                  <div className="w-50">
                    <label className="checkbox-wrap checkbox-primary">
                      Remember Me
                      <input type="checkbox" defaultChecked />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  <div className="w-50 text-md-right">
                    <a href="#" style={{ color: "#fff" }}>
                      Forgot Password
                    </a>
                  </div>
                </div>
              </form>
              <p className="w-100 text-center">
                &mdash; Or Sign In With &mdash;
              </p>
              <div className="social d-flex text-center">
                <a href="#" className="px-2 py-2 mr-md-1 rounded">
                  <span className="ion-logo-facebook mr-2"></span> Facebook
                </a>
                <a href="#" className="px-2 py-2 ml-md-1 rounded">
                  <span className="ion-logo-twitter mr-2"></span> Twitter
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
