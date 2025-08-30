const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');

const generateOTP = () => {
  return otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false
  });
};

const sendEmail = async (email, otp) => {
  console.log('OTP sẽ gửi là:', otp);

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Xác thực email của bạn',
    html: `<p>Mã xác thực OTP của bạn là: <b>${otp}</b>. Vui lòng nhập mã này để hoàn tất quá trình đăng ký.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email OTP đã được gửi');
  } catch (error) {
    console.error('Lỗi khi gửi email OTP:', error);
    throw new Error('Không thể gửi email xác thực.');
  }
};

const register = async (req, res) => {
  try {
    const { role, name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateOTP();
    console.log('OTP tạo ra:', otp);

    const otpExpires = Date.now() + 5 * 60 * 1000; // 5 phút

    const newUser = new User({
      role,
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
    });


    await newUser.save();
    await sendEmail(email, otp);

    res.status(201).json({ message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực.' });
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({ message: 'Đã có lỗi xảy ra khi đăng ký.' });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Thiếu email hoặc OTP.' });
    }

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP không hợp lệ hoặc đã hết hạn.' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Xác thực email thành công. Bạn có thể đăng nhập.' });
  } catch (error) {
    console.error('Lỗi xác thực OTP:', error);
    res.status(500).json({ message: 'Đã có lỗi xảy ra khi xác thực OTP.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Tài khoản chưa được xác thực. Vui lòng kiểm tra email của bạn.' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Đăng nhập thành công.',
      token,
      role: user.role,
      userId: user._id
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ message: 'Đã có lỗi xảy ra khi đăng nhập.' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin hồ sơ:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin hồ sơ.' });
  }
};

// ✅ Export tất cả các hàm cùng lúc
module.exports = {
  register,
  verifyOTP,
  login,
  getUserProfile,
};
