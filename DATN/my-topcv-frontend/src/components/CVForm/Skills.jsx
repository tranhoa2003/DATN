// frontend/src/components/CVForm/Skills.jsx
import React, { useState } from 'react';

function Skills({ skills, onChange }) {
  const [currentSkill, setCurrentSkill] = useState('');
  const [skillList, setSkillList] = useState(skills);

  const handleInputChange = (event) => {
    setCurrentSkill(event.target.value);
  };

  const handleAddSkill = () => {
    if (currentSkill.trim() !== '' && !skillList.includes(currentSkill.trim())) {
      const newSkillList = [...skillList, currentSkill.trim()];
      setSkillList(newSkillList);
      onChange({ target: { name: 'skills', value: newSkillList } });
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const newSkillList = skillList.filter(skill => skill !== skillToRemove);
    setSkillList(newSkillList);
    onChange({ target: { name: 'skills', value: newSkillList } });
  };

  return (
    <div>
      <h3>Kỹ năng</h3>
      <div>
        <input
          type="text"
          value={currentSkill}
          onChange={handleInputChange}
          placeholder="Nhập kỹ năng"
        />
        <button type="button" onClick={handleAddSkill}>Thêm</button>
      </div>
      <div>
        {skillList.map((skill, index) => (
          <span key={index} style={{
            display: 'inline-block',
            backgroundColor: '#f0f0f0',
            padding: '5px 10px',
            marginRight: '5px',
            marginBottom: '5px',
            borderRadius: '5px',
            fontSize: '0.9em',
          }}>
            {skill}
            <button type="button" onClick={() => handleRemoveSkill(skill)} style={{ marginLeft: '5px', border: 'none', backgroundColor: 'transparent', color: 'red', cursor: 'pointer' }}>x</button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default Skills;