// frontend/src/components/ManageJobs.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';

function ManageJobs() {
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get('/jobs/my');
        setMyJobs(response.data);
        setLoading(false);
      } catch (error) {
        setError('Không thể tải danh sách tin tuyển dụng của bạn.');
        console.error('Lỗi tải tin tuyển dụng của bạn:', error);
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, []);

  const handleEdit = (jobId) => {
    navigate(`/edit-job/${jobId}`); // Chúng ta sẽ tạo route và có thể tái sử dụng PostJobForm cho việc này
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tin tuyển dụng này?')) {
      try {
        await axiosInstance.delete(`/jobs/${jobId}`);
        // Cập nhật lại danh sách tin tuyển dụng sau khi xóa thành công
        setMyJobs(myJobs.filter(job => job._id !== jobId));
        alert('Tin tuyển dụng đã được xóa thành công.');
      } catch (error) {
        console.error('Lỗi khi xóa tin tuyển dụng:', error);
        alert('Không thể xóa tin tuyển dụng. Vui lòng thử lại.');
      }
    }
  };

  if (loading) {
    return <div>Đang tải danh sách tin tuyển dụng của bạn...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <div>
      <h2>Quản Lý Tin Tuyển Dụng Của Bạn</h2>
      {myJobs.length > 0 ? (
        <ul>
          {myJobs.map(job => (
            <li key={job._id}>
              <strong>{job.title}</strong> - {job.company} ({job.location})
              <p>Ngày đăng: {new Date(job.postedDate).toLocaleDateString()}</p>
              <div>
                <button onClick={() => handleEdit(job._id)}>Chỉnh sửa</button>
                <button onClick={() => handleDelete(job._id)}>Xóa</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Bạn chưa đăng tin tuyển dụng nào.</p>
      )}
      <Link to="/post-job">Đăng Tin Tuyển Dụng Mới</Link>
    </div>
  );
}

export default ManageJobs;