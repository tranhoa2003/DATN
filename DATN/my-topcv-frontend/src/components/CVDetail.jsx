// frontend/src/components/CVDetail.jsx
import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useParams } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import CVExport from './CVExport';


function CVDetail() {
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const componentRef = useRef();

  useEffect(() => {
    const fetchCVDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get(`/cv/${id}`);
        setCv(response.data);
      } catch (error) {
        console.error('Lỗi tải chi tiết CV:', error);
        setError(error.response?.status === 404 ? 'Không tìm thấy CV này.' : 'Không thể tải chi tiết CV.');
      } finally {
        setLoading(false);
      }
    };

    fetchCVDetails();
  }, [id]);

  const handleExportPdf = () => {
    if (componentRef.current) {
      const filename = `cv-${cv?.personalInfo?.name?.replace(/\s+/g, '-') || 'unnamed'}.pdf`;
      html2pdf().set({ filename }).from(componentRef.current).save();
    }
  };

  if (loading) return <div>Đang tải chi tiết CV...</div>;
  if (error) return <div>Lỗi: {error}</div>;
  if (!cv) return <div>Không có dữ liệu CV.</div>;

  return (
    <div>
      <h2>Chi tiết CV</h2>
      <CVExport
        targetRef={componentRef}
        fileName={`cv-${cv?.personalInfo?.name?.replace(/\s+/g, '-') || 'unnamed'}.pdf`}
        buttonLabel="Xuất ra PDF"
      />

      <div ref={componentRef} style={{ padding: '20px', background: '#fff' }}>
        {/* Thông tin CV giống như bạn đã viết */}
        {cv.personalInfo && (
          <div>
            <h3>Thông tin Cá nhân</h3>
            <p><strong>Họ và tên:</strong> {cv.personalInfo.name}</p>
            <p><strong>Email:</strong> {cv.personalInfo.email}</p>
            {cv.personalInfo.phone && <p><strong>SĐT:</strong> {cv.personalInfo.phone}</p>}
            {cv.personalInfo.address && <p><strong>Địa chỉ:</strong> {cv.personalInfo.address}</p>}
            {cv.personalInfo.linkedin && <p><strong>LinkedIn:</strong> <a href={cv.personalInfo.linkedin} target="_blank" rel="noreferrer">{cv.personalInfo.linkedin}</a></p>}
            {cv.personalInfo.portfolio && <p><strong>Portfolio:</strong> <a href={cv.personalInfo.portfolio} target="_blank" rel="noreferrer">{cv.personalInfo.portfolio}</a></p>}
          </div>
        )}

        {cv.experience?.length > 0 && (
          <div>
            <h3>Kinh nghiệm Làm việc</h3>
            {cv.experience.map((exp, index) => (
              <div key={index} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px' }}>
                <h4>{exp.position} tại {exp.company}</h4>
                <p><strong>Thời gian:</strong> {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Hiện tại'}</p>
                <p>{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {cv.education?.length > 0 && (
          <div>
            <h3>Học vấn</h3>
            {cv.education.map((edu, index) => (
              <div key={index} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px' }}>
                <h4>{edu.degree} - {edu.major} tại {edu.school}</h4>
                <p><strong>Thời gian:</strong> {new Date(edu.startDate).toLocaleDateString()} - {new Date(edu.endDate).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}

        {cv.skills?.length > 0 && (
          <div>
            <h3>Kỹ năng</h3>
            <p>{cv.skills.join(', ')}</p>
          </div>
        )}

        {cv.projects?.length > 0 && (
          <div>
            <h3>Dự án</h3>
            {cv.projects.map((project, index) => (
              <div key={index} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px' }}>
                <h4>{project.name}</h4>
                <p>{project.description}</p>
                {project.technologies && <p><strong>Công nghệ:</strong> {project.technologies}</p>}
                <p><strong>Thời gian:</strong> {new Date(project.startDate).toLocaleDateString()} - {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Hiện tại'}</p>
              </div>
            ))}
          </div>
        )}

        {cv.certifications?.length > 0 && (
          <div>
            <h3>Chứng chỉ</h3>
            {cv.certifications.map((cert, index) => (
              <div key={index} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px' }}>
                <h4>{cert.name} - {cert.organization}</h4>
                <p><strong>Ngày cấp:</strong> {new Date(cert.issueDate).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CVDetail;

