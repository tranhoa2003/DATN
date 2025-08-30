// topcv-backend/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path'); // Để xử lý đường dẫn file

// Cấu hình lưu trữ cho multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Đảm bảo thư mục 'uploads/' tồn tại. Bạn có thể tạo thủ công hoặc dùng fs.mkdirSync
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Tạo tên file duy nhất: fieldname-timestamp-random.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Cấu hình filter cho phép loại file
const fileFilter = (req, file, cb) => {
  // Chỉ chấp nhận các file PDF, DOC, DOCX
  if (file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    cb(null, true); // Chấp nhận file
  } else {
    cb(new Error('Chỉ cho phép tải lên file PDF, DOC, DOCX.'), false); // Từ chối file
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // Giới hạn kích thước file 5MB
  }
});

module.exports = upload; // Export instance multer đã cấu hình