// frontend/src/components/JobDetail.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import { toast } from 'react-toastify'; // Import toast

function JobDetail() {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const [applying, setApplying] = useState(false); // State để kiểm soát hiển thị form ứng tuyển
  const [applicationData, setApplicationData] = useState({
    resumeFile: null, // Đổi tên để rõ ràng là file
    coverLetter: '',
  });
  const [employerProfile, setEmployerProfile] = useState(null); // State cho hồ sơ công ty
  const [userCvs, setUserCvs] = useState([]); // State để lưu danh sách CV của người dùng
  const [selectedCvId, setSelectedCvId] = useState(''); // State cho CV được chọn từ dropdown

  const { currentUser } = useAuth(); // Lấy thông tin người dùng hiện tại

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get(`/jobs/${id}`);
        setJob(response.data);
        // Sau khi lấy thông tin công việc, gọi API để lấy hồ sơ công ty
        if (response.data.employerId) {
          console.log('Fetching employer profile for ID:', response.data.employerId); // ✅ Thêm dòng này
          fetchEmployerProfile(response.data.employerId);
        }
      } catch (error) {
        setError('Không thể tải chi tiết tin tuyển dụng.');
        console.error('Lỗi tải chi tiết tin tuyển dụng:', error);
        if (error.response && error.response.status === 404) {
          setError('Không tìm thấy tin tuyển dụng này.');
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchEmployerProfile = async (employerId) => {
      try {
        // API này cần là public hoặc có middleware phù hợp
        const response = await axiosInstance.get(`/employer-profile/public/${employerId}`);
        setEmployerProfile(response.data);
      } catch (error) {
        console.error('Lỗi tải hồ sơ công ty:', error);
        // Không nhất thiết phải hiển thị lỗi cho người dùng nếu không tìm thấy hồ sơ công ty
      }
    };

    const fetchUserCvs = async () => {
      if (currentUser && currentUser.role === 'applicant') {
        try {
          const response = await axiosInstance.get('/cvs/my'); // API lấy tất cả CV của người dùng hiện tại
          setUserCvs(response.data);
        } catch (err) {
          console.error('Lỗi khi tải danh sách CV của người dùng:', err);
          toast.error('Không thể tải danh sách CV của bạn.');
        }
      }
    };

    fetchJobDetails();
    fetchUserCvs(); // Gọi hàm này khi component mount
  }, [id, currentUser]); // Thêm currentUser vào dependency array để re-fetch khi trạng thái user thay đổi

  const handleApplyClick = () => {
    setApplying(true);
    // Reset form khi mở lại
    setApplicationData({ resumeFile: null, coverLetter: '' });
    setSelectedCvId('');
  };

  const handleInputChange = (e) => {
    const { name, type } = e.target;
    const value = type === 'file' ? e.target.files[0] : e.target.value;
    setApplicationData({ ...applicationData, [name]: value });
  };

  const handleCvSelectChange = (e) => {
    setSelectedCvId(e.target.value);
    // Khi chọn CV từ dropdown, đảm bảo không có file nào được chọn
    setApplicationData({ ...applicationData, resumeFile: null });
  };

  const handleFileChange = (e) => {
    // Khi tải file mới, đảm bảo không có CV nào được chọn từ dropdown
    setApplicationData({ ...applicationData, resumeFile: e.target.files[0] });
    setSelectedCvId('');
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Đặt trạng thái loading cho nút submit
    toast.dismiss(); // Xóa các toast cũ

    if (!selectedCvId && !applicationData.resumeFile) {
      toast.error('Vui lòng chọn hoặc tải lên CV của bạn.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('coverLetter', applicationData.coverLetter);

      if (selectedCvId) {
        formData.append('cvId', selectedCvId); // Gửi CV ID nếu người dùng chọn CV đã có
      } else if (applicationData.resumeFile) {
        formData.append('resume', applicationData.resumeFile); // Gửi file nếu người dùng tải lên
      }

      const response = await axiosInstance.post('/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Cần để gửi file
        },
      });
      console.log('Ứng tuyển thành công:', response.data);
      toast.success('Bạn đã ứng tuyển thành công!');
      setApplying(false); // Đóng form ứng tuyển
      // Reset form
      setApplicationData({ resumeFile: null, coverLetter: '' });
      setSelectedCvId('');
    } catch (error) {
      console.error('Lỗi khi ứng tuyển:', error);
      toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi ứng tuyển. Vui lòng thử lại.');
    } finally {
      setLoading(false); // Dừng trạng thái loading
    }
  };

  if (loading && !job) {
    // Hiển thị loading ban đầu
    return <div className="text-center py-10 text-gray-600">Đang tải chi tiết tin tuyển dụng...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500 text-lg">Lỗi: {error}</div>;
  }

  if (!job) {
    return <div className="text-center py-10 text-gray-600">Không có dữ liệu tin tuyển dụng.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
      {/* Tiêu đề và thông tin chung về công việc */}
      <h1 className="text-3xl font-bold mb-4 text-gray-800">{job.title}</h1>
      <p className="text-lg text-gray-600 mb-2">
        <span className="font-semibold">Công ty:</span> {job.company}
      </p>

      {/* Thông tin công ty (nếu có employerProfile) */}
      {employerProfile && (
        <div className="bg-gray-100 p-4 rounded-lg mt-4 mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-700">Thông tin công ty</h3>
          <div className="flex items-center mb-3">
            {employerProfile.companyLogo && (
              <img
                src={employerProfile.companyLogo}
                alt={`${employerProfile.companyName} Logo`}
                className="w-16 h-16 object-contain rounded-full mr-4 border border-gray-300 p-1"
              />
            )}
            <div>
              {employerProfile.companyName && (
                <p className="text-lg font-bold text-gray-800">{employerProfile.companyName}</p>
              )}
              {employerProfile.website && (
                <p className="text-sm text-blue-600 hover:underline">
                  <a href={employerProfile.website} target="_blank" rel="noopener noreferrer">
                    {employerProfile.website}
                  </a>
                </p>
              )}
            </div>
          </div>
          {employerProfile.location && (
            <p className="text-gray-700 mb-1">
              <span className="font-semibold">Địa điểm:</span> {employerProfile.location}
            </p>
          )}
          {employerProfile.description && (
            <p className="text-gray-700">
              <span className="font-semibold">Mô tả:</span> {employerProfile.description}
            </p>
          )}
        </div>
      )}

      {/* Các chi tiết khác của công việc */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 mb-6">
        <p>
          <span className="font-semibold">Địa điểm:</span> {job.location}
        </p>
        <p>
          <span className="font-semibold">Mức lương:</span> {job.salary}
        </p>
        <p>
          <span className="font-semibold">Loại hình:</span> {job.jobType}
        </p>
        <p>
          <span className="font-semibold">Hạn nộp hồ sơ:</span> {job.deadline}
        </p>
      </div>

      {/* Mô tả chi tiết */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">Mô tả công việc</h2>
        <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
      </div>

      {/* Nút ứng tuyển - chỉ hiện nếu là applicant và chưa bấm ứng tuyển */}
      {currentUser?.role === 'applicant' && !applying && (
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
          onClick={handleApplyClick}
        >
          Ứng tuyển ngay
        </button>
      )}

      {/* Form ứng tuyển */}
      {applying && (
        <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Form ứng tuyển</h3>
          <form onSubmit={handleApplySubmit} encType="multipart/form-data" className="space-y-4">
            {/* Chọn CV có sẵn */}
            <div>
              <label htmlFor="selectedCv" className="block font-semibold mb-1 text-gray-700">
                Chọn CV đã có:
              </label>
              {userCvs.length === 0 ? (
                <p className="text-sm text-blue-600 hover:underline cursor-pointer" onClick={() => window.location.href = '/create-cv'}>
                  Bạn chưa có CV nào? Tạo CV mới ngay!
                </p>
              ) : (
                <select
                  id="selectedCv"
                  name="selectedCv"
                  value={selectedCvId}
                  onChange={handleCvSelectChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">-- Chọn CV --</option>
                  {userCvs.map((cv, index) => (
                    <option key={cv.id ?? index} value={cv.id}>
                      {cv.title || cv.name || 'CV #' + (cv.id ?? index)}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Hoặc tải lên file mới */}
            <div>
              <label htmlFor="resumeFile" className="block font-semibold mb-1 text-gray-700">
                Hoặc tải lên CV mới (PDF, DOC, DOCX):
              </label>
              <input
                type="file"
                id="resumeFile"
                name="resumeFile"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="w-full"
              />
              {applicationData.resumeFile && (
                <p className="mt-1 text-sm text-gray-600">File đã chọn: {applicationData.resumeFile.name}</p>
              )}
            </div>

            {/* Thư xin việc */}
            <div>
              <label htmlFor="coverLetter" className="block font-semibold mb-1 text-gray-700">
                Thư xin việc (không bắt buộc):
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                value={applicationData.coverLetter}
                onChange={handleInputChange}
                rows={5}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Viết thư xin việc hoặc lời nhắn đến nhà tuyển dụng"
              />
            </div>

            {/* Nút submit và hủy */}
            <div className="flex justify-between items-center">
              <button
                type="submit"
                disabled={loading}
                className={`bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Đang gửi...' : 'Gửi hồ sơ'}
              </button>

              <button
                type="button"
                onClick={() => setApplying(false)}
                disabled={loading}
                className="text-gray-600 hover:text-gray-800 font-semibold"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default JobDetail;
