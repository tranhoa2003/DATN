// frontend/src/components/Home.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa token khỏi localStorage
    localStorage.removeItem('token');
    // Chuyển hướng người dùng về trang đăng nhập
    navigate('/login');
  };

  return (
    <div>
      <h2>Trang chủ</h2>
      <p>Chào mừng đến với TopCV!</p>

      {/* Các nội dung khác của trang chủ */}

      <button onClick={handleLogout}>Đăng xuất</button>
    </div>
  );
}

export default Home;