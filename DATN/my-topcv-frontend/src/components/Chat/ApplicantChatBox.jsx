// frontend/src/components/Chat/ApplicantChatBox.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { socket } from "../../socket";
import axiosInstance from "../../utils/axios";
import "./ChatBox.css";

const ApplicantChatBox = ({ employerId, conversationId }) => {
  const { currentUser } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  // ✅ Auto scroll khi có tin nhắn mới
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ✅ Join conversation khi mở
  useEffect(() => {
    if (conversationId) {
      socket.emit("join_conversation", conversationId);
      console.log("👉 Joined conversation:", conversationId);
    }
  }, [conversationId]);

  // ✅ Load lịch sử tin nhắn
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) return;
      try {
        const res = await axiosInstance.get(`/messages/conversation/${conversationId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Lỗi khi tải tin nhắn:", err);
      }
    };
    if (conversationId) fetchMessages();
  }, [conversationId]);

  // ✅ Nhận tin nhắn realtime
  useEffect(() => {
    const handleReceiveMessage = (newMessage) => {
      if (newMessage.conversationId === conversationId) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };
    socket.on("receive_message", handleReceiveMessage);
    return () => socket.off("receive_message", handleReceiveMessage);
  }, [conversationId]);

  // ✅ Gửi tin nhắn
  const sendMessage = async () => {
    if (!message.trim() || !conversationId) return;

    const msgData = {
      senderId: currentUser._id,
      receiverId: employerId,
      conversationId,
      text: message,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await axiosInstance.post("/messages", msgData);
      const savedMessage = res.data;

      // Gửi qua socket
      socket.emit("send_message", savedMessage);

      // Thêm vào UI ngay cho người gửi
      setMessages((prev) => [...prev, savedMessage]);
      setMessage("");
    } catch (err) {
      console.error("❌ Lỗi khi gửi tin nhắn:", err.response?.data || err.message);
    }
  };

  return (
    <div className="chat-box">
      <h3>Chat với nhà tuyển dụng</h3>
      <div className="messages">
        {messages.map((msg, i) => (
          <p
            key={msg._id || i}
            className={msg.senderId === currentUser._id ? "message sent" : "message received"}
          >
            {msg.text}
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Nhập tin nhắn..."
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Gửi</button>
    </div>
  );
};

export default ApplicantChatBox;
