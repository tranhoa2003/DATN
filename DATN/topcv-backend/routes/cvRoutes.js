// topcv-backend/routes/cvRoutes.js
const express = require('express');
const CVController = require('../controllers/CVController');
const authMiddleware = require('../middleware/authMiddleware');
const isApplicant = require('../middleware/isApplicant'); // Thêm middleware này nếu bạn muốn giới hạn chỉ ứng viên

const router = express.Router();

// Các route cần xác thực người dùng (đặt ở đây nếu tất cả các route trong file này đều cần xác thực)
// router.use(authMiddleware); // Tạm thời bỏ comment này để áp dụng từng route

// Route để lấy tất cả CV của người dùng (Thay đổi từ /user/cvs thành /my)
router.get('/my', authMiddleware, isApplicant, CVController.getUserCVs); // ✅ Đổi đường dẫn
// Route để tạo CV mới
router.post('/', authMiddleware, isApplicant, CVController.createCV); // Thêm middleware isApplicant

// Route để lấy một CV theo ID
router.get('/:id', authMiddleware, CVController.getCV);

// Route để cập nhật CV theo ID
router.put('/:id', authMiddleware, CVController.updateCV);

// Route để xóa CV theo ID
router.delete('/:id', authMiddleware, CVController.deleteCV);

// Đảm bảo bạn đã import isApplicant ở đầu file và thêm vào route này

module.exports = router;