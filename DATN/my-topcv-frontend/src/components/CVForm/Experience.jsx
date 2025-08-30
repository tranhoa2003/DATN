// frontend/src/components/CVForm/Experience.jsx
import React, { useState } from 'react';

function Experience({ experience, onChange }) {
  const [experiences, setExperiences] = useState(experience);

  const handleInputChange = (index, event) => {
    const newExperiences = [...experiences];
    newExperiences[index][event.target.name] = event.target.value;
    setExperiences(newExperiences);
    onChange({ target: { name: 'experience', value: newExperiences } });
  };

  const handleAddExperience = () => {
    setExperiences([...experiences, {
      position: '',
      company: '',
      startDate: '',
      endDate: '',
      description: '',
    }]);
    onChange({ target: { name: 'experience', value: [...experiences, {
      position: '',
      company: '',
      startDate: '',
      endDate: '',
      description: '',
    }]} });
  };

  const handleRemoveExperience = (index) => {
    const newExperiences = [...experiences];
    newExperiences.splice(index, 1);
    setExperiences(newExperiences);
    onChange({ target: { name: 'experience', value: newExperiences } });
  };

  return (
    <div>
      <h3>Kinh nghiệm Làm việc</h3>
      {experiences.map((exp, index) => (
        <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <div>
            <label htmlFor={`position-${index}`}>Vị trí:</label>
            <input
              type="text"
              name="position"
              id={`position-${index}`}
              value={exp.position}
              onChange={(event) => handleInputChange(index, event)}
            />
          </div>
          <div>
            <label htmlFor={`company-${index}`}>Công ty:</label>
            <input
              type="text"
              name="company"
              id={`company-${index}`}
              value={exp.company}
              onChange={(event) => handleInputChange(index, event)}
            />
          </div>
          <div>
            <label htmlFor={`startDate-${index}`}>Ngày bắt đầu:</label>
            <input
              type="date"
              name="startDate"
              id={`startDate-${index}`}
              value={exp.startDate}
              onChange={(event) => handleInputChange(index, event)}
            />
          </div>
          <div>
            <label htmlFor={`endDate-${index}`}>Ngày kết thúc:</label>
            <input
              type="date"
              name="endDate"
              id={`endDate-${index}`}
              value={exp.endDate}
              onChange={(event) => handleInputChange(index, event)}
            />
          </div>
          <div>
            <label htmlFor={`description-${index}`}>Mô tả:</label>
            <textarea
              name="description"
              id={`description-${index}`}
              value={exp.description}
              onChange={(event) => handleInputChange(index, event)}
            />
          </div>
          <button type="button" onClick={() => handleRemoveExperience(index)}>Xóa</button>
        </div>
      ))}
      <button type="button" onClick={handleAddExperience}>Thêm Kinh nghiệm</button>
    </div>
  );
}

export default Experience;