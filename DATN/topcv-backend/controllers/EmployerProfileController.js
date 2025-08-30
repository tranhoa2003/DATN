// topcv-backend/controllers/EmployerProfileController.js
const EmployerProfile = require('../models/EmployerProfile');

// Hàm tạo hoặc cập nhật hồ sơ nhà tuyển dụng
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profileData = req.body;

    // Kiểm tra xem hồ sơ đã tồn tại chưa
    let profile = await EmployerProfile.findOne({ userId });

    if (profile) {
      // Cập nhật hồ sơ hiện có
      profile = await EmployerProfile.findOneAndUpdate({ userId }, profileData, { new: true, runValidators: true });
      res.status(200).json(profile);
    } else {
      // Tạo hồ sơ mới
      const newProfile = new EmployerProfile({ ...profileData, userId });
      const savedProfile = await newProfile.save();
      res.status(201).json(savedProfile);
    }
  } catch (error) {
    console.error('Lỗi khi tạo hoặc cập nhật hồ sơ nhà tuyển dụng:', error);
    res.status(500).json({ message: 'Không thể tạo hoặc cập nhật hồ sơ.' });
  }
};

// Hàm lấy hồ sơ của nhà tuyển dụng đã đăng nhập
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await EmployerProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: 'Không tìm thấy hồ sơ của bạn.' });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Lỗi khi lấy hồ sơ nhà tuyển dụng:', error);
    res.status(500).json({ message: 'Không thể lấy hồ sơ của bạn.' });
  }
};

// Hàm lấy hồ sơ của một nhà tuyển dụng cụ thể (có thể dùng cho trang xem thông tin công ty công khai)
exports.getEmployerProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('Received request for employer profile with userId:', userId); // ✅ Thêm dòng này
    const profile = await EmployerProfile.findOne({ userId });

    if (!profile) {
      console.log('No employer profile found for userId:', userId);
      return res.status(404).json({ message: 'Không tìm thấy hồ sơ công ty này.' });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Lỗi khi lấy hồ sơ công ty:', error);
    res.status(500).json({ message: 'Không thể lấy hồ sơ công ty.' });
  }
};