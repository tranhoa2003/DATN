// topcv-backend/middleware/isApplicant.js
module.exports = (req, res, next) => {
    if (req.user && req.user.role === 'applicant') {
        next();
    } else {
        res.status(403).json({ message: 'Chỉ ứng viên mới có quyền truy cập chức năng này.' });
    }
};