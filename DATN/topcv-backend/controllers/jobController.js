// topcv-backend/controllers/JobController.js
const mongoose = require('mongoose');
const Job = require('../models/Job');
const Application = require('../models/Application'); // Thêm dòng này ở đầu file nếu chưa có


// Hàm tạo tin tuyển dụng mới
exports.createJob = async (req, res) => {
  try {
    const newJob = new Job({
      employerId: req.user.id, // Lấy ID nhà tuyển dụng từ middleware xác thực
      ...req.body, // Chứa dữ liệu tin tuyển dụng từ frontend
    });
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    console.error('Lỗi khi tạo tin tuyển dụng:', error);
    res.status(500).json({ message: 'Không thể tạo tin tuyển dụng.' });
  }
};

// Hàm lấy danh sách tin tuyển dụng (có thể có phân trang, tìm kiếm, lọc)
exports.getAllJobs = async (req, res) => {
  try {
    const { searchTerm, location, jobType, page = 1, limit = 10 } = req.query; // Thêm page và limit (mặc định)
    const query = {};

    if (searchTerm) {
      query.title = { $regex: searchTerm, $options: 'i' };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    const totalJobs = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / limit);
    const skip = (page - 1) * limit;

    const jobs = await Job.find(query)
      .sort({ postedDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({ jobs, totalPages });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tin tuyển dụng:', error);
    res.status(500).json({ message: 'Không thể lấy danh sách tin tuyển dụng.' });
  }
};

// Hàm lấy chi tiết một tin tuyển dụng theo ID
exports.getJobById = async (req, res) => {
  const jobId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ message: 'ID không hợp lệ.' });
  }

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Không tìm thấy tin tuyển dụng.' });
    }

    // Đếm số đơn ứng tuyển cho job này
    const applicationCount = await Application.countDocuments({ jobId: job._id });

    res.status(200).json({ ...job.toObject(), applicationCount }); // ✅ Trả thêm applicationCount
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết tin tuyển dụng:', error);
    res.status(500).json({ message: 'Không thể lấy chi tiết tin tuyển dụng.' });
  }
};


// Hàm cập nhật tin tuyển dụng theo ID (chỉ dành cho nhà tuyển dụng đã đăng tin)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, employerId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!job) {
      return res.status(404).json({ message: 'Không tìm thấy tin tuyển dụng để cập nhật hoặc bạn không có quyền.' });
    }
    res.status(200).json(job);
  } catch (error) {
    console.error('Lỗi khi cập nhật tin tuyển dụng:', error);
    res.status(500).json({ message: 'Không thể cập nhật tin tuyển dụng.' });
  }
};

// Hàm xóa tin tuyển dụng theo ID (chỉ dành cho nhà tuyển dụng đã đăng tin)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, employerId: req.user._id });
    if (!job) {
      return res.status(404).json({ message: 'Không tìm thấy tin tuyển dụng để xóa hoặc bạn không có quyền.' });
    }
    res.status(200).json({ message: 'Tin tuyển dụng đã được xóa thành công.' });
  } catch (error) {
    console.error('Lỗi khi xóa tin tuyển dụng:', error);
    res.status(500).json({ message: 'Không thể xóa tin tuyển dụng.' });
  }
};

// Hàm lấy danh sách tin tuyển dụng của người dùng đã đăng nhập
exports.getMyJobs = async (req, res) => {
  try {
    // 1. Lấy tất cả các tin tuyển dụng của nhà tuyển dụng hiện tại
    const jobs = await Job.find({ employerId: req.user._id }).sort({ postedDate: -1 }).lean(); // Thêm .lean() để làm việc với đối tượng JS thuần

    // 2. Tạo một mảng Promise để đếm số lượng ứng tuyển cho mỗi tin tuyển dụng
    const jobsWithApplicationCountPromises = jobs.map(async (job) => {
      const applicationCount = await Application.countDocuments({ jobId: job._id });
      return { ...job, applicationCount }; // Trả về đối tượng job kèm theo applicationCount
    });

    // 3. Chờ tất cả các Promise hoàn thành
    const jobsWithApplicationCount = await Promise.all(jobsWithApplicationCountPromises);

    res.status(200).json(jobsWithApplicationCount);
  } catch (error) {
    console.error('Lỗi khi lấy tin tuyển dụng của người dùng kèm số lượng ứng tuyển:', error);
    res.status(500).json({ message: 'Không thể lấy tin tuyển dụng của bạn.' });
  }
};