const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  summary: String,
  education: [
    {
      school: String,
      degree: String,
      startYear: Number,
      endYear: Number,
    }
  ],
  experience: [
    {
      jobTitle: String,
      company: String,
      startDate: Date,
      endDate: Date,
      description: String,
    }
  ],
  skills: [String],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
