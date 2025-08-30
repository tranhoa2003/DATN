import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance'; // Đảm bảo đường dẫn đúng
import { Link } from 'react-router-dom';

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false); // Để quản lý hiển thị toast
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState(''); // 'success' hoặc 'error'

  // Hàm hiển thị toast
  const displayToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setToastMessage('');
      setToastType('');
    }, 3000); // Tự động ẩn sau 3 giây
  };

  const getStatusDisplayName = (status) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'viewed': return 'Đã xem';
      case 'interviewed': return 'Đã phỏng vấn';
      case 'rejected': return 'Đã từ chối';
      default: return status;
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'viewed': return 'bg-blue-100 text-blue-800';
      case 'interviewed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    const fetchMyApplications = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get('/applications/me');
        setApplications(response.data);
      } catch (err) {
        setError('Không thể tải lịch sử ứng tuyển.');
        console.error('Lỗi tải lịch sử ứng tuyển:', err);
        displayToast('Lỗi khi tải lịch sử ứng tuyển của bạn.', 'error'); // Sử dụng toast tự xây dựng
      } finally {
        setLoading(false);
      }
    };

    fetchMyApplications();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl my-8">
      {/* Toast thông báo */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white
          ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
        >
          {toastMessage}
        </div>
      )}

      <h2 className="text-3xl font-extrabold mb-8 text-gray-900 text-center">Lịch Sử Ứng Tuyển Của Bạn</h2>

      {loading && (
        <div className="flex justify-center items-center h-64">
          {/* Spinner đơn giản bằng Tailwind */}
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent border-solid rounded-full animate-spin mr-3"></div>
          <p className="text-lg text-gray-600">Đang tải lịch sử ứng tuyển của bạn...</p>
        </div>
      )}

      {!loading && error && (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && applications.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg bg-gray-50">
          <p className="text-xl text-gray-600 mb-2">Bạn chưa ứng tuyển vào công việc nào.</p>
          <p className="text-gray-500">Hãy bắt đầu tìm kiếm công việc phù hợp ngay bây giờ!</p>
          <Link
            to="/jobs" // Thay đổi đường dẫn này nếu trang danh sách việc làm của bạn khác
            className="mt-4 inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Tìm kiếm việc làm
          </Link>
        </div>
      ) : (
        !loading && !error && (
          <ul className="space-y-6">
            {applications.map((app) => (
              <li key={app._id} className="p-5 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ease-in-out bg-white">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex-1 min-w-0 mb-3 sm:mb-0">
                    <Link to={`/jobs/${app.jobId._id}`} className="text-xl font-bold text-blue-700 hover:text-blue-800 hover:underline">
                      {/* Biểu tượng công việc (chỉ là text hoặc emoji đơn giản) */}
                      <span className="mr-2 text-gray-500" role="img" aria-label="briefcase">💼</span>
                      {app.jobId.title}
                    </Link>
                    <div className="flex items-center text-md text-gray-700 mt-1">
                      {/* Biểu tượng công ty */}
                      <span className="mr-1.5 text-gray-500" role="img" aria-label="building">🏢</span>
                      <span>{app.jobId.company}</span>
                    </div>
                    {app.jobId.salary && (
                      <div className="flex items-center text-sm text-gray-500 mt-0.5">
                        <span className="mr-1">💰</span>
                        <span>Lương: {app.jobId.salary}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-500 mt-0.5">
                      {/* Biểu tượng lịch */}
                      <span className="mr-1.5 text-gray-500" role="img" aria-label="calendar">🗓️</span>
                      <span>Ngày ứng tuyển: {new Date(app.appliedDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span
                      className={`px-4 py-1.5 text-sm rounded-full font-semibold whitespace-nowrap
                        ${getStatusClasses(app.status)}
                      `}
                    >
                      {getStatusDisplayName(app.status)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}

export default MyApplications;