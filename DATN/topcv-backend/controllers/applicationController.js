// topcv-backend/controllers/applicationController.js
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User'); // Hoặc EmployerProfile nếu bạn có model riêng cho Employer
const CV = require('../models/CV'); // Import model CV để lấy thông tin CV online
//const cloudinary = require('../config/cloudinary'); // Import Cloudinary (Nếu bạn sử dụng)
const fs = require('fs'); // Dùng để xóa file tạm sau khi upload lên Cloudinary

// Hàm ứng tuyển công việc
// Hàm ứng tuyển công việc
exports.applyToJob = async (req, res) => {
  try {
    const { jobId, coverLetter, cvId } = req.body; // ✅ Lấy cvId từ req.body
    const userId = req.user?._id;

    console.log('ApplyToJob - jobId:', jobId, 'userId:', userId, 'cvId:', cvId);
    console.log('req.body:', req.body);
    console.log('req.file:', req.file); // Để kiểm tra file tải lên

    if (!jobId || !userId) {
      return res.status(400).json({ message: 'Thiếu jobId hoặc userId.' });
    }

    // Kiểm tra đã ứng tuyển chưa
    const existingApplication = await Application.findOne({ jobId, userId });
    if (existingApplication) {
      return res.status(400).json({ message: 'Bạn đã ứng tuyển công việc này rồi.' });
    }

    let resumeFileUrl = '';
    let onlineCvId = null;

    if (req.file && req.file.path) {
      // Nếu có file CV được tải lên
      resumeFileUrl = req.file.path; // Giả sử req.file.path là URL sau khi upload (ví dụ: Cloudinary)
    } else if (cvId) {
      // Nếu người dùng chọn CV từ danh sách có sẵn
      const existingCv = await CV.findById(cvId);
      if (!existingCv || existingCv.userId.toString() !== userId.toString()) {
        return res.status(400).json({ message: 'CV được chọn không hợp lệ hoặc không thuộc về bạn.' });
      }
      onlineCvId = cvId;
    } else {
      // Nếu không có cả file và CV ID
      return res.status(400).json({ message: 'Vui lòng cung cấp CV (tải lên file hoặc chọn CV có sẵn).' });
    }

    const newApplication = new Application({
      jobId,
      userId,
      resumeFileUrl: resumeFileUrl, // Lưu URL của file CV
      onlineCvId: onlineCvId,     // Lưu ID của CV online
      coverLetter: coverLetter,
    });

    await newApplication.save();

    return res.status(201).json({ message: 'Ứng tuyển thành công', application: newApplication });
  } catch (error) {
    console.error('Lỗi khi ứng tuyển công việc:', error);
    // Xử lý lỗi từ Cloudinary nếu có (ví dụ: xóa file tạm)
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ message: 'Lỗi server khi ứng tuyển.' });
  }
};

// Hàm lấy tất cả đơn ứng tuyển cho một tin tuyển dụng cụ thể (dành cho Nhà tuyển dụng)
// Hàm lấy tất cả đơn ứng tuyển cho một tin tuyển dụng cụ thể (dành cho Nhà tuyển dụng)
exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const employerId = req.user._id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Tin tuyển dụng không tồn tại.' });
    }
    if (job.employerId.toString() !== employerId.toString()) {
      return res.status(403).json({ message: 'Bạn không có quyền xem các đơn ứng tuyển của tin này.' });
    }

    const applications = await Application.find({ jobId: jobId })
      .populate('userId', 'name email phone') // Populate thông tin người dùng
      .populate('onlineCvId', 'personalInfo.email personalInfo.phone') // ✅ Populate thông tin CV online nếu có (chỉ lấy những trường cần thiết)
      .sort({ appliedDate: -1 });

    // Định dạng lại dữ liệu để gửi về frontend
    const formattedApplications = applications.map(app => {
      const applicantEmail = app.userId ? app.userId.email : 'N/A';
      const applicantName = app.userId ? app.userId.name : 'N/A';
      const applicantPhone = app.userId ? app.userId.phone : 'N/A';

      let cvInfo = '';
      let cvLink = '';

       if (app.onlineCvId) {
        // Nếu có CV online
        cvInfo = `CV online (${app.onlineCvId.personalInfo?.email || 'không có email'})`; // Thêm ?. để an toàn hơn
        cvLink = `/view-cv/${app.onlineCvId._id}`; // ✅ Dùng route của frontend để xem CV online
      } else if (app.resumeFileUrl) {
        // Nếu có CV tải lên (URL)
        cvInfo = 'CV đã tải lên';
        cvLink = app.resumeFileUrl; // Link trực tiếp đến file (Cloudinary, /uploads/...)
      } else {
        cvInfo = 'Không có CV';
      }

      return {
        _id: app._id,
        applicantId: app.userId ? app.userId._id : null,
        applicantName: applicantName,
        applicantEmail: applicantEmail,
        applicantPhone: applicantPhone,
        cvInfo: cvInfo, // Mô tả CV
        cvLink: cvLink, // Link CV
        appliedDate: app.appliedDate,
        coverLetter: app.coverLetter,
        status: app.status || 'pending', // Giả sử có trường status
        // Thêm các trường khác nếu cần
      };
    });

    res.status(200).json(formattedApplications);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách ứng viên cho tin tuyển dụng:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách ứng viên.' });
  }
};


// Hàm lấy lịch sử ứng tuyển của người dùng đã đăng nhập (dành cho Ứng viên)
exports.getMyApplications = async (req, res) => {
  try {
    const applicantId = req.user._id;

    const applications = await Application.find({ userId: applicantId })
      .populate('jobId', 'title company location salary')
      .sort({ appliedDate: -1 });

    res.status(200).json(applications);
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử ứng tuyển của người dùng:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy lịch sử ứng tuyển của bạn.' });
  }
};




// Hàm cập nhật trạng thái đơn ứng tuyển (dành cho Nhà tuyển dụng)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { status } = req.body;

    // Thêm các trạng thái hợp lệ vào đây
    const validStatuses = ['pending', 'approved', 'rejected', 'inactive', 'viewed', 'interviewed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ.' });
    }

    const updatedApp = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    if (!updatedApp) {
      return res.status(404).json({ message: 'Không tìm thấy đơn ứng tuyển.' });
    }

    res.status(200).json({ message: 'Cập nhật trạng thái thành công.', application: updatedApp });
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật trạng thái.' });
  }
};


// Hàm lấy thông tin chi tiết một đơn ứng tuyển theo ID (dành cho Admin/Nhà tuyển dụng/Ứng viên liên quan)
exports.getApplicationById = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const userId = req.user._id; // ID của người dùng đang yêu cầu
        const userRole = req.user.role; // Vai trò của người dùng

        const application = await Application.findById(applicationId)
            .populate('job') // Populate toàn bộ thông tin công việc
            .populate('applicant', 'name email phone') // Populate thông tin ứng viên
            .populate('employer', 'companyName companyLogo') // Populate thông tin nhà tuyển dụng
            .populate('cv'); // Populate thông tin CV online nếu có

        if (!application) {
            return res.status(404).json({ message: 'Đơn ứng tuyển không tồn tại.' });
        }

        // Kiểm tra quyền truy cập:
        // - Người ứng tuyển của đơn này có thể xem
        // - Nhà tuyển dụng (người đăng tin) có thể xem đơn liên quan đến tin của họ
        // - Admin có thể xem tất cả
        const isApplicantOfThisApplication = application.applicant._id.toString() === userId.toString();
        const isEmployerOfThisJob = application.job.employerId.toString() === userId.toString();
        const isAdmin = userRole === 'admin';

        if (isApplicantOfThisApplication || isEmployerOfThisJob || isAdmin) {
            return res.status(200).json(application);
        } else {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập đơn ứng tuyển này.' });
        }

    } catch (error) {
        console.error('Lỗi khi lấy chi tiết đơn ứng tuyển:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy chi tiết đơn ứng tuyển.' });
    }
};


// Hàm mới để lấy danh sách ứng viên cho một công việc cụ thể
exports.getApplicantsByJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const employerId = req.user._id;

        // 1. Kiểm tra xem tin tuyển dụng có tồn tại và thuộc về nhà tuyển dụng hiện tại không
        const job = await Job.findById(jobId);
        if (!job || job.employerId.toString() !== employerId.toString()) {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập.' });
        }

        // 2. Tìm tất cả các đơn ứng tuyển cho jobId này
        const applications = await Application.find({ jobId: jobId }).populate('userId', 'name email _id');
        
        // 3. Trích xuất thông tin ứng viên từ các đơn ứng tuyển
        const applicants = applications.map(app => {
            if (app.userId) {
                return {
                    applicantId: app.userId._id,
                    applicantName: app.userId.name,
                    applicantEmail: app.userId.email
                };
            }
            return null;
        }).filter(Boolean); // Lọc bỏ các ứng viên không hợp lệ

        // 4. Trả về danh sách ứng viên
        res.status(200).json(applicants);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách ứng viên:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách ứng viên.' });
    }
};