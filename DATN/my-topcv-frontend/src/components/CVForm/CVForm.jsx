// frontend/src/components/CVForm/CVForm.jsx
import React, { useState, useEffect } from 'react'; // Import useEffect
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '../ui/tabs/tabs'; // lưu ý đường dẫn đúng

import PersonalInfo from './PersonalInfo';
import Experience from './Experience';
import Education from './Education';
import Skills from './Skills';
import Projects from './Projects';
import Certifications from './Certifications';
import CVPreview from './CVPreview';

import axiosInstance from '../../api/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams

function CVForm() {
  const [cvData, setCvData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      portfolio: '',
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    // ... các trường khác của CV
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id: cvId } = useParams(); // Lấy ID CV từ URL params (nếu có)
  const isEditMode = !!cvId; // Xác định xem có phải chế độ chỉnh sửa hay không
  const [activeTab, setActiveTab] = useState('personal');

  
  useEffect(() => {
    if (isEditMode) {
      const fetchCVData = async () => {
        setLoading(true);
        setError('');
        try {
          const response = await axiosInstance.get(`/cv/${cvId}`);
          setCvData(response.data);
          setLoading(false);
        } catch (error) {
          setError('Không thể tải dữ liệu CV để chỉnh sửa.');
          console.error('Lỗi tải dữ liệu CV:', error);
          setLoading(false);
          if (error.response && error.response.status === 404) {
            // Xử lý trường hợp CV không tồn tại
            navigate('/cvs'); // Chuyển hướng về trang danh sách CV
          }
        }
      };

      fetchCVData();
    } else {
      setLoading(false); // Nếu không phải chế độ chỉnh sửa, không cần tải
    }
  }, [cvId, navigate, isEditMode]);

  const handlePersonalInfoChange = (event) => {
    const { id, value } = event.target;
    setCvData({
      ...cvData,
      personalInfo: {
        ...cvData.personalInfo,
        [id]: value,
      },
    });
  };

  const handleExperienceChange = (event) => {
    setCvData({ ...cvData, experience: event.target.value });
  };

  const handleEducationChange = (event) => {
    setCvData({ ...cvData, education: event.target.value });
  };

  const handleSkillsChange = (event) => {
    setCvData({ ...cvData, skills: event.target.value });
  };

  const handleProjectsChange = (event) => {
    setCvData({ ...cvData, projects: event.target.value });
  };

  const handleCertificationsChange = (event) => {
    setCvData({ ...cvData, certifications: event.target.value });
  };

  const handleSaveCV = async () => {
    try {
      const apiCall = isEditMode
        ? axiosInstance.put(`/cv/${cvId}`, cvData)
        : axiosInstance.post('/cv', cvData);

      const response = await apiCall;
      console.log(`CV đã được ${isEditMode ? 'cập nhật' : 'lưu'} thành công:`, response.data);
      navigate('/view-cv/' + response.data._id); // Chuyển hướng đến trang xem CV sau khi lưu/cập nhật
    } catch (error) {
      console.error(`Lỗi khi ${isEditMode ? 'cập nhật' : 'lưu'} CV:`, error);
      // Hiển thị thông báo lỗi cho người dùng
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Lỗi ${isEditMode ? 'cập nhật' : 'lưu'} CV: ${error.response.data.message}`);
      } else {
        alert(`Đã xảy ra lỗi khi ${isEditMode ? 'cập nhật' : 'lưu'} CV. Vui lòng thử lại.`);
      }
    }
  };

  if (loading) {
    return <div>Đang tải dữ liệu CV...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <div>
      <h2>{isEditMode ? 'Chỉnh sửa Hồ sơ CV' : 'Tạo Hồ sơ CV'}</h2>
      <Tabs>
        <TabsList>
          <TabsTrigger label="Thông tin cá nhân" onClick={() => setActiveTab('personal')} isActive={activeTab === 'personal'} />
          <TabsTrigger label="Kinh nghiệm" onClick={() => setActiveTab('experience')} isActive={activeTab === 'experience'} />
          <TabsTrigger label="Học vấn" onClick={() => setActiveTab('education')} isActive={activeTab === 'education'} />
          <TabsTrigger label="Kỹ năng" onClick={() => setActiveTab('skills')} isActive={activeTab === 'skills'} />
          <TabsTrigger label="Dự án" onClick={() => setActiveTab('projects')} isActive={activeTab === 'projects'} />
          <TabsTrigger label="Chứng chỉ" onClick={() => setActiveTab('certifications')} isActive={activeTab === 'certifications'} />
           <TabsTrigger label="Xem trước" onClick={() => setActiveTab('preview')} isActive={activeTab === 'preview'} />
        </TabsList>

        <TabsContent isActive={activeTab === 'personal'}>
          <PersonalInfo onChange={handlePersonalInfoChange} personalInfo={cvData.personalInfo} />
        </TabsContent>

        <TabsContent isActive={activeTab === 'experience'}>
          <Experience experience={cvData.experience} onChange={handleExperienceChange} />
        </TabsContent>

        <TabsContent isActive={activeTab === 'education'}>
          <Education education={cvData.education} onChange={handleEducationChange} />
        </TabsContent>

        <TabsContent isActive={activeTab === 'skills'}>
          <Skills skills={cvData.skills} onChange={handleSkillsChange} />
        </TabsContent>

        <TabsContent isActive={activeTab === 'projects'}>
          <Projects projects={cvData.projects} onChange={handleProjectsChange} />
        </TabsContent>

        <TabsContent isActive={activeTab === 'certifications'}>
          <Certifications certifications={cvData.certifications} onChange={handleCertificationsChange} />
        </TabsContent>

        <TabsContent isActive={activeTab === 'preview'}>
          <CVPreview cvData={cvData} />
        </TabsContent>
      </Tabs>


      <button onClick={handleSaveCV}>{isEditMode ? 'Cập nhật CV' : 'Lưu CV'}</button>
    </div>
  );
}

export default CVForm;