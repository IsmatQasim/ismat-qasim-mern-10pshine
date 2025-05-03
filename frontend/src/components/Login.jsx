import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate , Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import login from "../assets/login.jpg"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../constants/constant';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields!'); 
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);
      toast.success('Login successful!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);    } 
      catch (err) {
      if (err.response?.status === 404) {
        toast.error('Email not registered');
      } else if (err.response?.status === 401) {
        toast.error('Invalid credentials');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
      
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <div className="geometric-pattern">
        <img src={login} alt="Login Illustration" />
      </div>
      <div className="login-form-container">
        <div className="form-content">
          <h1 className="login-title">Welcome Back To Notify!</h1>
          <p className="login-subtitle">
            Create a free account or log in to get started using Notify
          </p>

          <form onSubmit={handleSubmit}>
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
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  data-testid="password-toggle"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              data-testid="login-button"
              aria-label="login"
              disabled={!email || !password}

            >
              Log in
            </button>
          </form>

          <div className="create-account">
            <p>
              Don't have an account? <Link to="/signup">Create an account</Link>
            </p>
          </div>
          <Link
            to="/forgot-password"
            className="forgot-password-link"
            data-discover="true"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
