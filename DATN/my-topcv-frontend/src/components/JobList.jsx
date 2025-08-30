// frontend/src/components/JobList.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Link } from 'react-router-dom';

function JobList() {
  const [jobList, setJobList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const jobsPerPage = 5; // Số lượng tin tuyển dụng trên mỗi trang

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get('/jobs', {
          params: {
            searchTerm: searchTerm,
            ...filters,
            page: currentPage,
            limit: jobsPerPage,
          },
        });
        setJobList(response.data.jobs); // Giả sử backend trả về { jobs: [], totalPages: number }
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        setError('Không thể tải danh sách tin tuyển dụng.');
        console.error('Lỗi tải danh sách tin tuyển dụng:', error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchTerm, filters, currentPage, jobsPerPage]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm mới
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setCurrentPage(1); // Reset về trang đầu tiên khi lọc mới
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? 'active' : ''}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div>
      <h2>Danh sách Tin Tuyển Dụng</h2>

      <div>
        <input
          type="text"
          placeholder="Tìm kiếm theo tiêu đề"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <select name="location" value={filters.location} onChange={handleFilterChange}>
          <option value="">Tất cả địa điểm</option>
          {[...new Set(jobList.map(job => job.location))].map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
        <select name="jobType" value={filters.jobType} onChange={handleFilterChange}>
          <option value="">Tất cả loại hình</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
          <option value="Temporary">Temporary</option>
        </select>
      </div>

      {loading ? (
        <div>Đang tải danh sách tin tuyển dụng...</div>
      ) : error ? (
        <div>Lỗi: {error}</div>
      ) : jobList.length > 0 ? (
        <>
          <ul>
            {jobList.map(job => (
              <li key={job._id}>
                <Link to={`/jobs/${job._id}`}>
                  <strong>{job.title}</strong> - {job.company} ({job.location})
                </Link>
                <p>Ngày đăng: {new Date(job.postedDate).toLocaleDateString()}</p>
                {job.deadline && <p>Hạn nộp: {new Date(job.deadline).toLocaleDateString()}</p>}
                <p>Loại công việc: {job.jobType}</p>
                {job.skills && job.skills.length > 0 && <p>Kỹ năng: {job.skills.join(', ')}</p>}
              </li>
            ))}
          </ul>
          <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Trước
            </button>
            {renderPageNumbers()}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Sau
            </button>
          </div>
        </>
      ) : (
        <p>Không có tin tuyển dụng phù hợp.</p>
      )}
    </div>
  );
}

export default JobList;