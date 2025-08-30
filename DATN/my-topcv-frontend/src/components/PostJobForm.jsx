// frontend/src/components/PostJobForm.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';

function PostJobForm() {
  const { id: jobId } = useParams(); // Lấy jobId từ URL params (nếu có)
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    salary: '',
    jobType: 'Full-time',
    skills: [],
    deadline: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (jobId) {
      setLoading(true);
      axiosInstance.get(`/jobs/${jobId}`)
        .then(response => {
          const job = response.data;
          setJobData({
            title: job.title,
            description: job.description,
            company: job.company,
            location: job.location,
            salary: job.salary,
            jobType: job.jobType,
            skills: job.skills,
            deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '', // Định dạng ngày cho input type="date"
          });
          setLoading(false);
        })
        .catch(error => {
          setError('Không thể tải thông tin tin tuyển dụng để chỉnh sửa.');
          console.error('Lỗi tải thông tin tin tuyển dụng:', error);
          setLoading(false);
        });
    }
  }, [jobId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData({ ...jobData, [name]: value });
  };

  const handleSkillsChange = (e) => {
    setJobData({ ...jobData, skills: e.target.value.split(',').map(skill => skill.trim()) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const apiCall = jobId
        ? axiosInstance.put(`/jobs/${jobId}`, jobData)
        : axiosInstance.post('/jobs', jobData);

      const response = await apiCall;
      console.log(jobId ? 'Tin tuyển dụng đã được cập nhật thành công:' : 'Tin tuyển dụng đã được đăng thành công:', response.data);
      setLoading(false);
      navigate('/manage-jobs'); // Chuyển hướng về trang quản lý tin sau khi thành công
    } catch (error) {
      console.error(jobId ? 'Lỗi khi cập nhật tin tuyển dụng:' : 'Lỗi khi đăng tin tuyển dụng:', error);
      setError(error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Đang tải thông tin...</div>;
  }

  return (
    <div>
      <h2>{jobId ? 'Chỉnh Sửa Tin Tuyển Dụng' : 'Đăng Tin Tuyển Dụng Mới'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Tiêu đề:</label>
          <input type="text" id="title" name="title" value={jobData.title} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="description">Mô tả:</label>
          <textarea id="description" name="description" value={jobData.description} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="company">Công ty:</label>
          <input type="text" id="company" name="company" value={jobData.company} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="location">Địa điểm:</label>
          <input type="text" id="location" name="location" value={jobData.location} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="salary">Mức lương:</label>
          <input type="text" id="salary" name="salary" value={jobData.salary} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="jobType">Loại công việc:</label>
          <select id="jobType" name="jobType" value={jobData.jobType} onChange={handleChange}>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Temporary">Temporary</option>
          </select>
        </div>
        <div>
          <label htmlFor="skills">Kỹ năng yêu cầu (cách nhau bằng dấu phẩy):</label>
          <input type="text" id="skills" name="skills" value={jobData.skills ? jobData.skills.join(', ') : ''} onChange={handleSkillsChange} />
        </div>
        <div>
          <label htmlFor="deadline">Hạn nộp:</label>
          <input type="date" id="deadline" name="deadline" value={jobData.deadline} onChange={handleChange} />
        </div>
        <button type="submit">{jobId ? 'Lưu Thay Đổi' : 'Đăng Tin'}</button>
      </form>
    </div>
  );
}

export default PostJobForm;