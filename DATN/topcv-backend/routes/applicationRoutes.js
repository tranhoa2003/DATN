// topcv-backend/routes/applicationRoutes.js
const express = require('express');
const ApplicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer'); // Import multer
const upload = require('../middleware/uploadMiddleware');
const { updateApplicationStatus } = require('../controllers/applicationController');


// Định nghĩa cấu hình storage cho multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  },
});

// Tạo middleware upload
// const upload = multer({ storage: storage });

const router = express.Router();

// Middleware xác thực cho tất cả các route bên dưới
router.use(authMiddleware);

// Route để ứng tuyển vào một công việc (yêu cầu xác thực ứng viên và middleware upload)
router.post('/', upload.single('resume'), ApplicationController.applyToJob);

// Route để lấy danh sách ứng viên cho một tin tuyển dụng (yêu cầu xác thực nhà tuyển dụng)
router.get('/jobs/:jobId', ApplicationController.getJobApplications);

// Route để lấy lịch sử ứng tuyển của người dùng đã đăng nhập (yêu cầu xác thực ứng viên)
router.get('/me', ApplicationController.getMyApplications);
router.put('/:id/status', (req, res, next) => {
  console.log('✅ Đã nhận request PUT /:id/status', req.params.id);
  next();
}, updateApplicationStatus);

router.get('/job/:jobId/applicants', authMiddleware, ApplicationController.getApplicantsByJob);

module.exports = router;