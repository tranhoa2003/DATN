// frontend/src/components/CVForm/Education.jsx
import React, { useState } from 'react';

function Education({ education, onChange }) {
  const [educations, setEducations] = useState(education);

  const handleInputChange = (index, event) => {
    const newEducations = [...educations];
    newEducations[index][event.target.name] = event.target.value;
    setEducations(newEducations);
    onChange({ target: { name: 'education', value: newEducations } });
  };

  const handleAddEducation = () => {
    setEducations([...educations, {
      school: '',
      degree: '',
      startDate: '',
      endDate: '',
      major: '',
    }]);
    onChange({ target: { name: 'education', value: [...educations, {
      school: '',
      degree: '',
      startDate: '',
      endDate: '',
      major: '',
    }]} });
  };

  const handleRemoveEducation = (index) => {
    const newEducations = [...educations];
    newEducations.splice(index, 1);
    setEducations(newEducations);
    onChange({ target: { name: 'education', value: newEducations } });
  };

  return (
    <div>
      <h3>Học vấn</h3>
      {educations.map((edu, index) => (
        <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <div>
            <label htmlFor={`school-${index}`}>Trường:</label>
            <input
              type="text"
              name="school"
              id={`school-${index}`}
              value={edu.school}
              onChange={(event) => handleInputChange(index, event)}
            />
          </div>
          <div>
            <label htmlFor={`degree-${index}`}>Bằng cấp:</label>
            <input
              type="text"
              name="degree"
              id={`degree-${index}`}
              value={edu.degree}
              onChange={(event) => handleInputChange(index, event)}
            />
          </div>
          <div>
            <label htmlFor={`startDate-${index}`}>Ngày bắt đầu:</label>
            <input
              type="date"
              name="startDate"
              id={`startDate-${index}`}
              value={edu.startDate}
              onChange={(event) => handleInputChange(index, event)}
            />
          </div>
          <div>
            <label htmlFor={`endDate-${index}`}>Ngày kết thúc:</label>
            <input
              type="date"
              name="endDate"
              id={`endDate-${index}`}
              value={edu.endDate}
              onChange={(event) => handleInputChange(index, event)}
            />
          </div>
          <div>
            <label htmlFor={`major-${index}`}>Chuyên ngành:</label>
            <input
              type="text"
              name="major"
              id={`major-${index}`}
              value={edu.major}
              onChange={(event) => handleInputChange(index, event)}
            />
          </div>
          <button type="button" onClick={() => handleRemoveEducation(index)}>Xóa</button>
        </div>
      ))}
      <button type="button" onClick={handleAddEducation}>Thêm Học vấn</button>
    </div>
  );
}

export default Education;