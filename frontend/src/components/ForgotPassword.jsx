import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { BASE_URL } from '../constants/constant';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email });
      toast.success('Reset link sent to your email');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center', marginTop:'10rem'}}>
      <ToastContainer />
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '0.5rem', width: '250px', borderRadius:'6px' }}
        />
        <br /><br />
        <button type="submit" className='sent-button'>Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
