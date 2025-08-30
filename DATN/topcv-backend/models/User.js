const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['applicant', 'employer', 'admin'],
      default: 'applicant',
    },
    otp: String,
    otpExpires: Date,
    isVerified: {
      type: Boolean,
      default: false,
    },
    avatar: { type: String, trim: true },
    // Có thể thêm các trường khác ở đây nếu bạn muốn
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
