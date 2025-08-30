const express = require('express');
const EmployerProfileController = require('../controllers/EmployerProfileController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Route public: xem hồ sơ theo userId (không cần đăng nhập)
router.get('/public/:userId', EmployerProfileController.getEmployerProfile);

// ✅ Các route dưới đây yêu cầu đăng nhập và role = employer
router.use(authMiddleware);
router.use((req, res, next) => {
  if (req.user && req.user.role === 'employer') {
    next();
  } else {
    return res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này.' });
  }
});

// Chỉ employer mới được tạo/cập nhật/xem hồ sơ của mình
router.post('/', EmployerProfileController.createOrUpdateProfile);
router.put('/', EmployerProfileController.createOrUpdateProfile);
router.get('/me', EmployerProfileController.getMyProfile);

module.exports = router;
