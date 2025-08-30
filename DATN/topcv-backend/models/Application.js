const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
  resumeFileUrl: {
    type: String,
    trim: true,
  },
  onlineCvId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CV',
    trim: true,
    default: null,
  },
  coverLetter: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'inactive'],
    default: 'pending'
  },
}, { timestamps: true });

ApplicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
