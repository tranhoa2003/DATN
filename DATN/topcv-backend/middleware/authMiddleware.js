const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Không có token.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // ✅ Cập nhật: lấy đúng id
    const user = await User.findById(decoded.id || decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Người dùng không tồn tại.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Lỗi xác thực token:', error);
    return res.status(401).json({ message: 'Token không hợp lệ.' });
  }
};

module.exports = authMiddleware;
