import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const email = localStorage.getItem('emailForOTP');

  useEffect(() => {
    if (!email) {
      setError('Không tìm thấy email để xác thực. Vui lòng đăng ký lại.');
    }
  }, [email]);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        email,
        otp,
      });

      setMessage(res.data.message);
      setError('');
      localStorage.removeItem('emailForOTP');
      setTimeout(() => navigate('/login'), 1500); // Điều hướng sau 1.5s
    } catch (err) {
      setError(err.response?.data?.message || 'Xác thực OTP thất bại');
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Xác thực OTP</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="Nhập mã OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit" disabled={!email}>Xác thực</button>
      </form>
    </div>
  );
}

export default VerifyOTP;
