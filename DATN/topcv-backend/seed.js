const mongoose = require('mongoose');
const Job = require('./models/Job');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Kết nối MongoDB thành công');

    await Job.deleteMany(); // Xóa toàn bộ dữ liệu cũ

    await Job.insertMany([
      {
        title: 'Lập trình viên Frontend',
        company: 'Phenikaa Software',
        location: 'Hà Nội',
        salary: { min: 1000, max: 2000 },
        description: 'Tham gia phát triển giao diện React cho hệ thống tuyển dụng.'
      },
      {
        title: 'Backend Developer (Node.js)',
        company: 'TopDev',
        location: 'TP.HCM',
        salary: { min: 1200, max: 2200 },
        description: 'Xây dựng RESTful API, tích hợp AI cho hệ thống tuyển dụng.'
      },
      {
        title: 'Thực tập sinh lập trình',
        company: 'Techkids Vietnam',
        location: 'Remote',
        salary: { min: 0, max: 300 },
        description: 'Học việc và tham gia các dự án thực tế với mentor.'
      }
    ]);

    console.log('✅ Seed dữ liệu mẫu thành công');
    process.exit();
  })
  .catch(err => {
    console.error('❌ Lỗi khi kết nối MongoDB:', err);
    process.exit(1);
  });
