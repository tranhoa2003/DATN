import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editUserId, setEditUserId] = useState(null);
  const [editedUserData, setEditedUserData] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        // Thêm header xác thực nếu cần (ví dụ: token admin)
        // headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      setError('Không thể tải danh sách người dùng.');
      console.error('Lỗi tải danh sách người dùng:', error);
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
          // Thêm header xác thực nếu cần
          // headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
        });
        fetchUsers(); // Tải lại danh sách người dùng sau khi xóa
      } catch (error) {
        setError('Không thể xóa người dùng.');
        console.error('Lỗi xóa người dùng:', error);
      }
    }
  };

  const handleEditUser = (user) => {
    setEditUserId(user._id);
    setEditedUserData({ ...user }); // Sao chép dữ liệu người dùng vào state chỉnh sửa
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${editUserId}`, editedUserData, {
        // Thêm header xác thực nếu cần
        // headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      });
      setEditUserId(null); // Đóng form chỉnh sửa
      fetchUsers(); // Tải lại danh sách người dùng sau khi lưu
    } catch (error) {
      setError('Không thể cập nhật thông tin người dùng.');
      console.error('Lỗi cập nhật người dùng:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditUserId(null);
  };

  if (loading) {
    return <div>Đang tải danh sách người dùng...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <div>
      <h2>Quản lý Tài khoản Người dùng</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Vai trò</th>
            <th>Họ</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Đã xác thực</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.role}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.isVerified ? 'Có' : 'Không'}</td>
              <td>
                <button onClick={() => handleEditUser(user)}>Sửa</button>
                <button onClick={() => handleDeleteUser(user._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editUserId && (
        <div className="edit-form">
          <h3>Chỉnh sửa Người dùng</h3>
          <label>Vai trò:</label>
          <input type="text" name="role" value={editedUserData.role || ''} onChange={handleInputChange} /><br />

          <label>Họ:</label>
          <input type="text" name="firstName" value={editedUserData.firstName || ''} onChange={handleInputChange} /><br />

          <label>Tên:</label>
          <input type="text" name="lastName" value={editedUserData.lastName || ''} onChange={handleInputChange} /><br />

          <label>Email:</label>
          <input type="email" name="email" value={editedUserData.email || ''} onChange={handleInputChange} /><br />

          {/* Bạn có thể thêm các trường khác bạn muốn chỉnh sửa */}

          <button onClick={handleSaveEdit}>Lưu</button>
          <button onClick={handleCancelEdit}>Hủy</button>
        </div>
      )}
    </div>
  );
}

export default AdminUserManagement;