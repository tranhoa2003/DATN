import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

function DashboardPage() {
  const { currentUser, logout } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    bio: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (currentUser) {
      // Load dữ liệu ban đầu
      setProfile({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        bio: currentUser.bio || '',
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    try {
      const res = await axios.put(
        `/api/users/${currentUser._id}`, // Giả sử bạn có route API này
        profile,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      setSuccess('Cập nhật thành công!');
    } catch (error) {
      console.error('Cập nhật thất bại', error);
      setSuccess('Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Quản lý hồ sơ</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Họ và tên</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Số điện thoại</label>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Giới thiệu bản thân</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Đang cập nhật...' : 'Cập nhật'}
        </button>

        {success && <p className="text-green-600 mt-2">{success}</p>}
      </form>

      <button
        onClick={logout}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Đăng xuất
      </button>
    </div>
  );
}

export default DashboardPage;
