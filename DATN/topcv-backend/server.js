// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer'); // Import multer
const path = require('path'); // Import path module
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cvRoutes = require('./routes/cvRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const employerProfileRoutes = require('./routes/employerProfileRoutes');
const adminRoutes = require('./routes/adminRoutes');
const messageRoutes = require('./routes/messageRoutes'); // ✅ THÊM

// Import Message model để sử dụng trong Socket.IO
const Message = require('./models/Message'); // ✅ THÊM
const conversationRoutes = require('./routes/conversationRoutes');
const Conversation = require("./models/Conversation"); // 👈 nhớ import model Conversation

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"], // ✅ Thêm domain frontend của bạn nếu có nhiều
    methods: ['GET', 'POST']
  }
});
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Đảm bảo frontend được phép CORS cho API
  credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Sử dụng routes API
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/employer-profile', employerProfileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes); // ✅ THÊM
app.use('/api/conversations', conversationRoutes);

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Route mặc định
app.get('/', (req, res) => {
  res.send('🚀 Backend TopCV đang chạy!');
});

// ✅ SOCKET.IO EVENTS (CẬP NHẬT)
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  // Join theo conversationId
  socket.on("join_conversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`📥 Socket ${socket.id} joined conversation ${conversationId}`);
  });

  // Gửi tin nhắn
  socket.on("send_message", async (data) => {
    try {
      // ✅ BỎ LOGIC LƯU DB Ở ĐÂY để tránh trùng lặp.
      // Tin nhắn đã được lưu vào DB bởi API HTTP POST.

      // cập nhật updatedAt của conversation
      // Dùng `data.conversationId` vì frontend đã gửi đúng
      await Conversation.findByIdAndUpdate(data.conversationId, { updatedAt: Date.now() });

      // Phát tin nhắn đã nhận được từ người gửi đến tất cả client trong room đó
      // bao gồm cả người gửi và người nhận.
      io.to(data.conversationId).emit("receive_message", data);
      console.log('Tin nhắn đã được emit:', data.text);
    } catch (error) {
      console.error("❌ Error broadcasting message:", error);
      socket.emit("message_error", { text: "Không thể gửi tin nhắn.", error: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});


server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});