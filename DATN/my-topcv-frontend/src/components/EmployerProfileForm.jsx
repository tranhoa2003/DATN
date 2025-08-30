// frontend/src/components/EmployerProfileForm.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

function EmployerProfileForm() {
  const [profileData, setProfileData] = useState({
    companyName: '',
    companyLogo: '', // Có thể cần xử lý tải lên file phức tạp hơn
    companyWebsite: '',
    companySize: '',
    industry: '',
    location: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get('/employer-profile/me');
        setProfileData(response.data || profileData); // Điền dữ liệu nếu có
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Hồ sơ chưa tồn tại, không cần báo lỗi
          setLoading(false);
        } else {
          setError('Không thể tải thông tin hồ sơ.');
          console.error('Lỗi tải hồ sơ:', error);
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      const response = await axiosInstance.post('/employer-profile', profileData); // Hoặc put nếu đã có
      console.log('Lưu hồ sơ thành công:', response.data);
      setSuccessMessage('Hồ sơ công ty đã được lưu thành công!');
      setLoading(false);
      // Có thể chuyển hướng hoặc hiển thị thông báo
    } catch (error) {
      setError(error.response?.data?.message || 'Đã xảy ra lỗi khi lưu hồ sơ.');
      console.error('Lỗi lưu hồ sơ:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Đang tải thông tin hồ sơ...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <div>
      <h2>Hồ Sơ Công Ty</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="companyName">Tên công ty:</label>
          <input type="text" id="companyName" name="companyName" value={profileData.companyName} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="companyLogo">Logo công ty (URL):</label>
          <input type="text" id="companyLogo" name="companyLogo" value={profileData.companyLogo} onChange={handleChange} />
          {/* Chức năng tải lên file logo sẽ phức tạp hơn */}
        </div>
        <div>
          <label htmlFor="companyWebsite">Website công ty:</label>
          <input type="url" id="companyWebsite" name="companyWebsite" value={profileData.companyWebsite} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="companySize">Quy mô công ty:</label>
          <input type="text" id="companySize" name="companySize" value={profileData.companySize} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="industry">Lĩnh vực:</label>
          <input type="text" id="industry" name="industry" value={profileData.industry} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="location">Địa điểm:</label>
          <input type="text" id="location" name="location" value={profileData.location} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="description">Mô tả công ty:</label>
          <textarea id="description" name="description" value={profileData.description} onChange={handleChange} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu Hồ Sơ'}
        </button>
      </form>
    </div>
  );
}

export default EmployerProfileForm;