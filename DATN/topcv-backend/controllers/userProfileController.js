// controllers/userProfileController.js
const User = require('../models/User'); // hoặc models/User.js nếu tên khác

// Lấy thông tin hồ sơ người dùng
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password'); // bỏ password
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }
    res.json(user);
  } catch (err) {
    console.error('Lỗi khi lấy hồ sơ người dùng:', err);
    res.status(500).json({ message: 'Lỗi server.' });
  }
};

// Cập nhật hồ sơ người dùng
exports.updateUserProfile = async (req, res) => {
  try {
    const updates = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    res.json(user);
  } catch (err) {
    console.error('Lỗi khi cập nhật hồ sơ người dùng:', err);
    res.status(500).json({ message: 'Lỗi server.' });
  }
};
