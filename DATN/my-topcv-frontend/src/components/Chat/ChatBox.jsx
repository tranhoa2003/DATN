import React, { useState, useEffect, useRef, useContext } from "react";
import { ChatContext } from "../../contexts/ChatContext";
import { socket } from "../../socket";
import axiosInstance from "../../utils/axios";

const ChatBox = ({ currentUserId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const {
    receiverId,
    setReceiverId,
    isChatBoxOpen,
    setIsChatBoxOpen,
    receiverName,
    conversationId,
  } = useContext(ChatContext);

  // ✅ Auto scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ✅ Join conversation + lắng nghe realtime
  useEffect(() => {
    if (!conversationId) return;

    socket.emit("join_conversation", conversationId);
    console.log("👉 Joined conversation:", conversationId);

    const handleReceiveMessage = (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => {
          // tránh thêm trùng tin nhắn
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [conversationId]);

  // ✅ Load lịch sử khi mở chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (conversationId) {
        try {
          const res = await axiosInstance.get(
            `/messages/conversation/${conversationId}`
          );
          setMessages(res.data);
        } catch (err) {
          console.error("❌ Lỗi khi tải tin nhắn:", err);
        }
      }
    };

    if (isChatBoxOpen && conversationId) {
      fetchMessages();
    } else if (!isChatBoxOpen) {
      setMessages([]);
    }
  }, [isChatBoxOpen, conversationId]);

  // ✅ Gửi tin nhắn
  const sendMessage = async () => {
    if (!message.trim() || !conversationId || !receiverId) return;

    const msgData = {
      senderId: currentUserId,
      receiverId,
      conversationId,
      text: message,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await axiosInstance.post("/messages", msgData);
      const savedMessage = res.data;

      // 👉 Chỉ emit, không push vào state ở đây
      socket.emit("send_message", savedMessage);
      setMessage("");
    } catch (err) {
      console.error("❌ Không gửi được tin nhắn:", err);
    }
  };

  const toggleChat = () => {
    setIsChatBoxOpen(!isChatBoxOpen);
    if (!isChatBoxOpen) return;
    setReceiverId(null);
    setMessages([]);
  };

  return (
    <div className="chatbox-container">
      <button className="chatbox-toggle" onClick={toggleChat}>
        💬
      </button>

      {isChatBoxOpen && (
        <div className="chatbox-panel">
          <div className="chatbox-header">
            <span>Nhắn tin với {receiverName}</span>
            <button onClick={toggleChat}>✖</button>
          </div>

          <div className="chatbox-messages">
            {messages.map((msg) => (
              <div
                key={msg._id} // luôn dùng _id để tránh trùng
                className={`chat-message ${
                  msg.senderId === currentUserId ? "sent" : "received"
                }`}
              >
                <p>{msg.text}</p>
                <span className="timestamp">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbox-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Gửi</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
