// topcv-backend/controllers/CVController.js
const CV = require('../models/CV');

// Hàm tạo CV mới
exports.createCV = async (req, res) => {
  try {
    const newCV = new CV({
      userId: req.user._id, // Lấy ID người dùng từ middleware xác thực
      ...req.body, // Chứa dữ liệu CV từ frontend
    });
    const savedCV = await newCV.save();
    res.status(201).json(savedCV);
  } catch (error) {
    console.error('Lỗi khi tạo CV:', error);
    res.status(500).json({ message: 'Không thể tạo CV.' });
  }
};

// Hàm lấy CV của người dùng (có thể theo ID hoặc lấy CV mới nhất)
exports.getCV = async (req, res) => {
  try {
    const cvId = req.params.id;
    const cv = await CV.findOne({ _id: cvId, userId: req.user._id });
    if (!cv) {
      return res.status(404).json({ message: 'Không tìm thấy CV.' });
    }
    res.status(200).json(cv);
  } catch (error) {
    console.error('Lỗi khi lấy CV:', error);
    res.status(500).json({ message: 'Không thể lấy CV.' });
  }
};

// Hàm cập nhật CV
exports.updateCV = async (req, res) => {
  try {
    const cvId = req.params.id;
    const updatedCV = await CV.findOneAndUpdate(
      { _id: cvId, userId: req.user._id },
      req.body,
      { new: true, runValidators: true } // Trả về CV đã cập nhật và chạy validators
    );
    if (!updatedCV) {
      return res.status(404).json({ message: 'Không tìm thấy CV để cập nhật.' });
    }
    res.status(200).json(updatedCV);
  } catch (error) {
    console.error('Lỗi khi cập nhật CV:', error);
    res.status(500).json({ message: 'Không thể cập nhật CV.' });
  }
};

// Hàm xóa CV
exports.deleteCV = async (req, res) => {
  try {
    const cvId = req.params.id;
    const deletedCV = await CV.findOneAndDelete({ _id: cvId, userId: req.user._id });
    if (!deletedCV) {
      return res.status(404).json({ message: 'Không tìm thấy CV để xóa.' });
    }
    res.status(200).json({ message: 'CV đã được xóa thành công.' });
  } catch (error) {
    console.error('Lỗi khi xóa CV:', error);
    res.status(500).json({ message: 'Không thể xóa CV.' });
  }
};

// Hàm lấy tất cả CV của một người dùng
exports.getUserCVs = async (req, res) => {
  try {
    console.log("🧠 User info from token:", req.user);

    const userId = req.user._id;
    const cvs = await CV.find({ userId: userId });


    res.status(200).json(cvs);
  } catch (error) {
    console.error("❌ Lỗi khi lấy CV người dùng:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách CV" });
  }
};
