// frontend/src/components/CVForm/Projects.jsx
import React, { useState } from 'react';

function Projects({ projects, onChange }) {
  const [projectList, setProjectList] = useState(projects);

  const handleInputChange = (index, event) => {
    const newProjectList = [...projectList];
    newProjectList[index][event.target.name] = event.target.value;
    setProjectList(newProjectList);
    onChange({ target: { name: 'projects', value: newProjectList } });
  };

  const handleAddProject = () => {
    setProjectList([...projectList, {
      name: '',
      description: '',
      technologies: '',
      startDate: '',
      endDate: '',
    }]);
    onChange({ target: { name: 'projects', value: [...projectList, {
      name: '',
      description: '',
      technologies: '',
      startDate: '',
      endDate: '',
    }]} });
  };

  const handleRemoveProject = (index) => {
    const newProjectList = [...projectList];
    newProjectList.splice(index, 1);
    setProjectList(newProjectList);
    onChange({ target: { name: 'projects', value: newProjectList } });
  };

  return (
    <div>
      <h3>Dự án</h3>
      {projectList.map((project, index) => (
        <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <div>
            <label htmlFor={`name-${index}`}>Tên dự án:</label>
            <input
              type="text"
              name="name"
              id={`name-${index}`}
              value={project.name}
              onChange={(event) => handleInputChange(index, event)}
            />
          </div>
          <div>
            <label htmlFor={`description-${index}`}>Mô tả:</label>
            <textarea
              name="description"
              id={`description-${index}`}
              value={project.description}
              onChange={(event) => handleInputChange(index, event)}
            />
          </div>
          <div>
            <label htmlFor={`technologies-${index}`}>Công nghệ:</label>
            <input
              type="text"
              name="technologies"
              id={`technologies-${index}`}
              value={project.technologies}
              onChange={(event) => handleInputChange(index, event)}
            />
          </div>
          <div>
            <label htmlFor={`startDate-${index}`}>Ngày bắt đầu:</label>
            <input
              type="date"
              name="startDate"
              id={`startDate-${index}`}
              value={project.startDate}
              onChange={(event) => handleInputChange(index, event)}
            />
          </div>
          <div>
            <label htmlFor={`endDate-${index}`}>Ngày kết thúc:</label>
            <input
              type="date"
              name="endDate"
              id={`endDate-${index}`}
              value={project.endDate}
              onChange={(event) => handleInputChange(index, event)}
            />
          </div>
          <button type="button" onClick={() => handleRemoveProject(index)}>Xóa</button>
        </div>
      ))}
      <button type="button" onClick={handleAddProject}>Thêm Dự án</button>
    </div>
  );
}

export default Projects;