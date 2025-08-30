import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';


const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      // const token = localStorage.getItem('token'); // Không cần lấy token thủ công nếu dùng axiosInstance
      const res = await axiosInstance.get('/admin/users'); // axiosInstance sẽ tự động đính kèm token
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };
  const deleteUser = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) return;
    try {
      await axiosInstance.delete(`/admin/users/${id}`); // Sử dụng axiosInstance
      setUsers(users.filter(user => user._id !== id));
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
      setError('Lỗi khi xóa người dùng.'); // Hiển thị lỗi cho người dùng
    }
  };

  const updateRole = async (id, newRole) => {
    try {
      const res = await axiosInstance.put(`/admin/users/${id}/role`, { role: newRole }); // Sử dụng axiosInstance
      setUsers(users.map(user => (user._id === id ? res.data : user)));
    } catch (error) {
      console.error('Lỗi khi cập nhật quyền:', error);
      setError('Lỗi khi cập nhật quyền.'); // Hiển thị lỗi cho người dùng
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Đang tải danh sách người dùng...</p>;
   if (error) return <p style={{ color: 'red' }}>Lỗi: {error}</p>; // Hiển thị lỗi

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Danh sách người dùng</h2>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Tên</th>
            <th className="p-2 border">Vai trò</th>
            <th className="p-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="text-center">
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">{user.name || 'N/A'}</td>
              <td className="p-2 border">
                <select
                  value={user.role}
                  onChange={(e) => updateRole(user._id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => deleteUser(user._id)}
                  className="text-red-600 hover:underline"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserList;