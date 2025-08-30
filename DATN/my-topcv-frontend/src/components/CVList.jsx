// frontend/src/components/CVList.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Link } from 'react-router-dom';

function CVList() {
  const [cvList, setCvList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserCVs = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get('/cv/my'); // ✅ Sửa lại đúng route
        setCvList(response.data);
        setLoading(false);
      } catch (error) {
        setError('Không thể tải danh sách CV.');
        console.error('Lỗi tải danh sách CV:', error);
        setLoading(false);
      }
    };

    fetchUserCVs();
  }, []);

  if (loading) {
    return <div>Đang tải danh sách CV...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <div>
      <h2>Danh sách CV đã lưu</h2>
      {cvList.length > 0 ? (
        <ul>
          {cvList.map(cv => (
            <li key={cv._id}>
                <span>CV ngày tạo: {new Date(cv.createdAt).toLocaleDateString()}</span>
                &nbsp;|&nbsp;
                <Link to={`/view-cv/${cv._id}`}>Xem chi tiết</Link>
                <Link to={`/edit-cv/${cv._id}`} style={{ marginLeft: '10px' }}>Chỉnh sửa</Link> {/* Thêm link chỉnh sửa */}
            </li>

          ))}
        </ul>
      ) : (
        <p>Bạn chưa có CV nào. <Link to="/create-cv">Tạo CV ngay!</Link></p>
      )}
    </div>
  );
}

export default CVList;