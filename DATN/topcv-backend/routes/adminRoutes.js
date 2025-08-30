const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware'); // ✅ ĐÚNG
const isAdmin = require('../middleware/isAdmin');
const User = require('../models/User');

router.get('/users', authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng' });
  }
});

// 📌 Xóa người dùng
router.delete('/users/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa người dùng' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa người dùng' });
  }
});

// 📌 Cập nhật quyền (role)
router.put('/users/:id/role', authMiddleware, isAdmin, async (req, res) => {
  const { role } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi cập nhật quyền' });
  }
});

module.exports = router;
