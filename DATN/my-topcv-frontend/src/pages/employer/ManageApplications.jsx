// frontend/src/pages/employer/ManageApplications.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext'; // Để kiểm tra quyền
// import ChatBox from "../../components/Chat/ChatBox";




function ManageApplications() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth(); // Lấy thông tin người dùng

  useEffect(() => {
    const fetchEmployerJobs = async () => {
      if (!currentUser || currentUser.role !== 'employer') {
        setError('Bạn không có quyền truy cập trang này.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get('/jobs/my'); // API lấy các công việc của nhà tuyển dụng
        setJobs(response.data);
      } catch (err) {
        console.error('Lỗi khi tải danh sách công việc của nhà tuyển dụng:', err);
        setError('Không thể tải danh sách công việc của bạn. Vui lòng thử lại.');
        toast.error('Không thể tải danh sách công việc.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployerJobs();
  }, [currentUser]); // Re-fetch khi currentUser thay đổi

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Đang tải danh sách công việc...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500 text-lg">{error}</div>;
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        Bạn chưa đăng tin tuyển dụng nào. <Link to="/post-job" className="text-blue-600 hover:underline">Đăng tin ngay!</Link>
      </div>
    );
  }
  const targetUserId =
  jobs[0]?.applications?.[0]?.applicantId ??
  jobs[0]?.applicants?.[0]?._id;



  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Quản Lý Đơn Ứng Tuyển</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Tiêu đề công việc</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Địa điểm</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Số lượng ứng tuyển</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                <td className="py-3 px-4 border-b border-gray-200 text-gray-800 font-medium">
                  {job.title}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 text-gray-600">
                  {job.location}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 text-gray-600">
                  {/* Đây là nơi bạn sẽ hiển thị số lượng ứng tuyển thực tế */}
                  {/* Hiện tại, chúng ta chưa có API để lấy số lượng trực tiếp trong /jobs/my,
                      nên sẽ hiển thị một giá trị giả định hoặc cần một API riêng.
                      Để làm đúng, API /jobs/my cần trả về thêm countOfApplications.
                      VD: job.applicationCount || 0
                  */}
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {job.applicationCount || 'N/A'} đơn
                  </span>
                </td>
                <td className="py-3 px-4 border-b border-gray-200">
                  <Link
                    to={`/employer/applications/${job._id}`}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition duration-300"
                  >
                    Xem ứng viên
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* <ChatBox currentUserId={currentUser._id} receiverId={targetUserId} /> */}
    </div>
  );
}

export default ManageApplications;