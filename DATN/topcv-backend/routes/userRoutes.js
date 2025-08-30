const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware'); // ✅ sửa lại dòng này
const User = require('../models/User');
const isAdmin = require('../middleware/isAdmin');
const { getUserProfile, updateUserProfile } = require('../controllers/userProfileController');

// 📌 Lấy thông tin hồ sơ người dùng
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy hồ sơ' });
  }
});

// 📌 Cập nhật thông tin hồ sơ người dùng
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    }).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi cập nhật hồ sơ' });
  }
});


router.get('/admin/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách người dùng' });
  }
});
module.exports = router;
