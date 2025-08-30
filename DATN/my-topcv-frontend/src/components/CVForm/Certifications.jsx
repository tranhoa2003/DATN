// frontend/src/components/CVForm/Certifications.jsx
import React, { useState } from 'react';

function Certifications({ certifications, onChange }) {
  const [certificationList, setCertificationList] = useState(certifications);

  const handleInputChange = (index, event) => {
    const newCertificationList = [...certificationList];
    newCertificationList[index][event.target.name] = event.target.value;
    setCertificationList(newCertificationList);
    onChange({ target: { name: 'certifications', value: newCertificationList } });
  };

  const handleAddCertification = () => {
    setCertificationList([...certificationList, {
      name: '',
      organization: '',
      issueDate: '',
    }]);
    onChange({ target: { name: 'certifications', value: [...certificationList, {
      name: '',
      organization: '',
      issueDate: '',
    }]} });
  };

  const handleRemoveCertification = (index) => {
    const newCertificationList = [...certificationList];
    newCertificationList.splice(index, 1);
    setCertificationList(newCertificationList);
    onChange({ target: { name: 'certifications', value: newCertificationList } });
  };

  return (
    <div>
      <h3>Chứng chỉ</h3>
      {certificationList.map((cert, index) => (
        <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <div>
            <label htmlFor={`name-${index}`}>Tên chứng chỉ:</label>
            <input
              type="text"
              name="name"
              id={`name-${index}`}
              value={cert.name}
              onChange={(event) => handleInputChange(index, event)}
            />
          </div>
          <div>
            <label htmlFor={`organization-${index}`}>Tổ chức cấp:</label>
            <input
              type="text"
              name="organization"
              id={`organization-${index}`}
              value={cert.organization}
              onChange={(event) => handleInputChange(index, event)}
            />
          </div>
          <div>
            <label htmlFor={`issueDate-${index}`}>Ngày cấp:</label>
            <input
              type="date"
              name="issueDate"
              id={`issueDate-${index}`}
              value={cert.issueDate}
              onChange={(event) => handleInputChange(index, event)}
            />
          </div>
          <button type="button" onClick={() => handleRemoveCertification(index)}>Xóa</button>
        </div>
      ))}
      <button type="button" onClick={handleAddCertification}>Thêm Chứng chỉ</button>
    </div>
  );
}

export default Certifications;