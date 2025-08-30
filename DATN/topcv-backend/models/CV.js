// topcv-backend/models/CV.js
const mongoose = require('mongoose');

const CVSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến model User
    required: true,
  },
  personalInfo: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    // Thêm các trường thông tin cá nhân khác nếu cần
  },
  experience: [{
    position: { type: String, default: '' },
    company: { type: String, default: '' },
    startDate: { type: Date },
    endDate: { type: Date },
    description: { type: String, default: '' },
  }],
  education: [{
    school: { type: String, default: '' },
    degree: { type: String, default: '' },
    startDate: { type: Date },
    endDate: { type: Date },
    major: { type: String, default: '' },
  }],
  skills: [{ type: String }], // Mảng các kỹ năng
  projects: [{
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    technologies: { type: String, default: '' },
    startDate: { type: Date },
    endDate: { type: Date },
  }],
  certifications: [{
    name: { type: String, default: '' },
    organization: { type: String, default: '' },
    issueDate: { type: Date },
  }],
  // Thêm các trường khác của CV nếu cần (ví dụ: summary, interests, templateId, createdAt, updatedAt)
}, { timestamps: true }); // Tự động tạo trường createdAt và updatedAt

module.exports = mongoose.model('CV', CVSchema);