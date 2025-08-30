// frontend/src/components/UserProfile.jsx
import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance'; // Đảm bảo đây là axiosInstance của bạn

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get('/user/profile'); // Gọi API đúng với backend
        setUser(res.data);
        setFormData(res.data); // Khởi tạo formData với dữ liệu user từ backend
        setLoading(false);
      } catch (err) {
        console.error('Lỗi khi tải hồ sơ người dùng:', err.response?.data || err.message);
        setError('Không thể tải hồ sơ người dùng. Vui lòng thử lại. ' + (err.response?.data?.message || ''));
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      // Chỉ gửi các trường có thể chỉnh sửa, ví dụ 'name'
      const dataToUpdate = {
        name: formData.name,
        // Nếu có các trường khác trong tương lai, thêm vào đây
      };
      const res = await axios.put('/user/profile', dataToUpdate);
      setUser(res.data); // Cập nhật state user với dữ liệu mới từ server
      setEditing(false);
    } catch (err) {
      console.error('Lỗi khi cập nhật hồ sơ:', err.response?.data || err.message);
      setError('Không thể cập nhật hồ sơ. Vui lòng thử lại. ' + (err.response?.data?.message || ''));
    }
  };

  if (loading) return <div className="text-center p-4">Đang tải hồ sơ...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Hồ sơ cá nhân</h2>

      {/* Email (thường không chỉnh sửa) */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
        <p className="text-gray-900 text-lg">{user.email}</p>
      </div>

      {/* Name */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Họ và Tên:</label>
        {editing ? (
          <input
            type="text"
            name="name" // Cần khớp với tên trường trong schema của bạn
            value={formData.name || ''}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Nhập họ và tên của bạn"
          />
        ) : (
          <p className="text-gray-900 text-lg">{user.name || 'Chưa cập nhật'}</p>
        )}
      </div>

      {/* Vai trò (chỉ hiển thị, không chỉnh sửa) */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Vai trò:</label>
        <p className="text-gray-900 text-lg">{user.role}</p>
      </div>

      {/* Trạng thái xác thực (chỉ hiển thị) */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Trạng thái xác thực:</label>
        <p className="text-gray-900 text-lg">{user.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-6">
        {editing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
            >
              Lưu thay đổi
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setFormData(user); // Đặt lại formData về dữ liệu ban đầu nếu hủy
              }}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
            >
              Hủy
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
          >
            Chỉnh sửa hồ sơ
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;