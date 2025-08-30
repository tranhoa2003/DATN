// frontend/src/components/CVForm/PersonalInfo.jsx
import React from 'react';

function PersonalInfo({ onChange, personalInfo }) {
  return (
    <div>
      <h3>Thông tin Cá nhân</h3>
      <div>
        <label htmlFor="name">Họ và tên:</label>
        <input
          type="text"
          id="name"
          value={personalInfo.name}
          onChange={onChange}
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={personalInfo.email}
          onChange={onChange}
        />
      </div>
      <div>
        <label htmlFor="phone">Số điện thoại:</label>
        <input
          type="tel"
          id="phone"
          value={personalInfo.phone}
          onChange={onChange}
        />
      </div>
      <div>
        <label htmlFor="address">Địa chỉ:</label>
        <input
          type="text"
          id="address"
          value={personalInfo.address}
          onChange={onChange}
        />
      </div>
      <div>
        <label htmlFor="linkedin">LinkedIn:</label>
        <input
          type="url"
          id="linkedin"
          value={personalInfo.linkedin}
          onChange={onChange}
        />
      </div>
      <div>
        <label htmlFor="portfolio">Portfolio:</label>
        <input
          type="url"
          id="portfolio"
          value={personalInfo.portfolio}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default PersonalInfo;