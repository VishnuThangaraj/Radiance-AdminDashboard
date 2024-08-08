import React, { useState } from "react";
import axios from "axios";
import "./Login.scss";

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
    <section className="vh-100 form-back">
      <div className="container h-100">
        <div className="row d-flex justify-content-center  align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card" style={{ borderRadius: "1rem" }}>
              <div className="row g-0">
                <div className="col-md-6 col-lg-5 d-none d-md-block">
                  <img
                    src="images/login.jpg"
                    alt="login form"
                    className="img-fluid"
                    style={{ borderRadius: "1rem 0 0 1rem", height: "100%" }}
                  />
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 pb-0 text-black">
                    <form onSubmit={handleSubmit}>
                      {error && (
                        <p className="error-message make-red">{error}</p>
                      )}
                      <div className="d-flex align-items-center mb-3 pb-1">
                        <img src="images/logo.png" className="me-4" />
                        <span className="h1 fw-bold mb-0">Radiance</span>
                      </div>
                      <h5
                        className="fw-normal mb-3 pb-3"
                        style={{ letterSpacing: "1px" }}
                      >
                        Sign into your account
                      </h5>
                      <div className="form-outline mb-4">
                        <input
                          type="text"
                          id="form2Example17"
                          className="form-controls form-control-lg"
                          placeholder="Username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          aria-label="Username"
                        />
                      </div>
                      <div className="form-outline mb-4">
                        <input
                          id="password-field"
                          type={showPassword ? "text" : "password"}
                          className="form-controls form-control-lg"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          aria-label="Password"
                        />
                      </div>
                      <div className="pt-1 mb-4">
                        <button type="submit" className="btn btn-dark px-5">
                          Login
                        </button>
                      </div>
                      <a className="small text-muted" href="#!">
                        Forgot password?
                      </a>
                      <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                        Don't have an account?{" "}
                        <a href="#!" style={{ color: "#393f81" }}>
                          Register here
                        </a>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
