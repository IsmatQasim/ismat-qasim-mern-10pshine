import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import signup from "../assets/login.jpg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Invalid email format.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/signup", {
        name,
        email,
        password, 
      });

      if (response.status === 201) {
        toast.success("Signup successful! Redirecting to dashboard...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message;

        if (status === 409 || message === "User already exists") {
          toast.error("Email already registered.");
        } else if (status === 400) {
          toast.error("Please fill all fields correctly.");
        } else {
          toast.error("Signup failed. Please try again.");
        }
      } else {
        toast.error("Server not responding.");
      }
    }
  };

  return (
    <div className="signup-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="geometric-pattern">
        <img src={signup} alt="signup" />
      </div>

      <div className="signup-form-container">
        <div className="form-content">
          <h1 className="signup-title">Welcome To Notify!</h1>
          <p className="signup-subtitle">
            Create a free account to get started using Notify
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="submit-button">
              Sign Up
            </button>
          </form>
          <div className="create-account">
            <p>
              Already registered? <a href="/">Login to your account</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
