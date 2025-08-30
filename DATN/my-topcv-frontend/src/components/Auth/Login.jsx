import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';  // Import hook useAuth để dùng login
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();  // Lấy hàm login từ context

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password });  // Gọi login từ context
      // Nếu login thành công, sẽ tự điều hướng trong context rồi
    } catch (error) {
      setError(error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.');
    }
  };

  return (
    <div>
      <h2>Đăng nhập</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label>Mật khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit">Đăng nhập</button>
      </form>
      <p>Chưa có tài khoản? <Link to="/register">Đăng ký</Link></p>
    </div>
  );
}

export default Login;
