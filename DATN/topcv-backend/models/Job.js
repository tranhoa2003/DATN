// topcv-backend/models/Job.js
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến model User của nhà tuyển dụng
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  salary: {
    type: String,
    trim: true,
    default: 'Thỏa thuận',
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'],
    default: 'Full-time',
  },
  skills: [{
    type: String,
    trim: true,
  }],
  deadline: {
    type: Date,
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
  // Các trường khác có thể có: experienceLevel, educationLevel, benefits, v.v.
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);