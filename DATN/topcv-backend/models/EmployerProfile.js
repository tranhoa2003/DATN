// topcv-backend/models/EmployerProfile.js
const mongoose = require('mongoose');

const EmployerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến model User của nhà tuyển dụng
    required: true,
    unique: true, // Mỗi nhà tuyển dụng chỉ có một hồ sơ
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  companyLogo: {
    type: String, // Có thể là URL hoặc path đến logo
    trim: true,
  },
  companyWebsite: {
    type: String,
    trim: true,
  },
  companySize: {
    type: String,
    trim: true,
  },
  industry: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  // Các trường khác có thể thêm: liên hệ, mạng xã hội, v.v.
}, { timestamps: true });

module.exports = mongoose.model('EmployerProfile', EmployerProfileSchema);