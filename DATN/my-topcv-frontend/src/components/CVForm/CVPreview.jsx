import React from 'react';

function CVPreview({ cvData }) {
  const { personalInfo, experience, education, skills, projects, certifications } = cvData;

  return (
    <div style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <h1>{personalInfo.name}</h1>
      <p><strong>Email:</strong> {personalInfo.email}</p>
      <p><strong>Phone:</strong> {personalInfo.phone}</p>
      <p><strong>Address:</strong> {personalInfo.address}</p>
      <p><strong>LinkedIn:</strong> {personalInfo.linkedin}</p>
      <p><strong>Portfolio:</strong> {personalInfo.portfolio}</p>

      <hr />
      <h2>Kinh nghiệm</h2>
      {experience.map((exp, index) => (
        <div key={index}>
          <p><strong>{exp.position}</strong> tại {exp.company}</p>
          <p>{exp.startDate} - {exp.endDate}</p>
          <p>{exp.description}</p>
        </div>
      ))}

      <hr />
      <h2>Học vấn</h2>
      {education.map((edu, index) => (
        <div key={index}>
          <p><strong>{edu.degree}</strong> tại {edu.school}</p>
          <p>{edu.startYear} - {edu.endYear}</p>
        </div>
      ))}

      <hr />
      <h2>Kỹ năng</h2>
      <ul>
        {skills.map((skill, index) => <li key={index}>{skill}</li>)}
      </ul>

      <hr />
      <h2>Dự án</h2>
      {projects.map((project, index) => (
        <div key={index}>
          <p><strong>{project.name}</strong></p>
          <p>{project.description}</p>
        </div>
      ))}

      <hr />
      <h2>Chứng chỉ</h2>
      {certifications.map((cert, index) => (
        <div key={index}>
          <p><strong>{cert.name}</strong> - {cert.organization}</p>
          <p>{cert.date}</p>
        </div>
      ))}
    </div>
  );
}

export default CVPreview;
