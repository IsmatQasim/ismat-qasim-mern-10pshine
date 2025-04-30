import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../constants/constant';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      try {
        await axios.get(`${BASE_URL}/api/auth/reset-password/${token}`);
        setIsTokenValid(true);
      } catch (error) {
        setIsTokenValid(false);
        toast.error(error.response?.data?.message || 'Invalid or expired token');
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in both password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/api/auth/reset-password/${token}`,
        { password: newPassword },
        { headers: { 'Content-Type': 'application/json' } }
      );
      toast.success('Password has been reset! Redirecting to login...');
      setTimeout(() => {
        navigate('/');
      }, 5000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Checking token...</div>;
  }

  if (!isTokenValid) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        Invalid or expired token. Please request a new password reset.
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
      }}
    >
      <h1 style={{ textAlign: 'center' }}>Reset Your Password</h1>
      <form onSubmit={handleResetPassword} style={{ width: '300px', textAlign: 'center' }}>
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '6px' }}
          />
        </div>
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '6px' }}
          />
        </div>
        <button type="submit" className="sent-button">
          Reset Password
        </button>
      </form>
     
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default ResetPassword;
