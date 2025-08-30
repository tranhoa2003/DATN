import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Register.css'; // 👈 Import file CSS riêng

function Register() {
  const [role, setRole] = useState('applicant');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp.');
      setMessage('');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        role,
        name: `${firstName} ${lastName}`,
        email,
        password,
      });

      setMessage(response.data.message);
      setError('');
      localStorage.setItem('emailForOTP', email);
      navigate('/verify-otp');
    } catch (error) {
      setError(error.response?.data?.message || 'Đã có lỗi xảy ra khi đăng ký.');
      setMessage('');
    }
  };

  return (
    <div className="register-container">
      <h2>Đăng ký</h2>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <form className="register-form" onSubmit={handleRegister}>
        <div className="form-group">
          <label>Vai trò:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="applicant">Ứng viên</option>
            <option value="employer">Nhà tuyển dụng</option>
          </select>
        </div>

        <div className="form-group">
          <label>Họ:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Tên:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Mật khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Xác nhận mật khẩu:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="register-button">Đăng ký</button>
      </form>

      <p className="login-link">Đã có tài khoản? <a href="/login">Đăng nhập</a></p>
    </div>
  );
}

export default Register;
