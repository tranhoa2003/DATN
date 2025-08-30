// src/contexts/ChatContext.js
import React, { createContext, useState } from 'react';
import axiosInstance from '../api/axiosInstance'; // Cần import axiosInstance
import { useAuth } from './AuthContext'; // ✅ BẠN CẦN IMPORT useAuth Ở ĐÂY

export const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [receiverId, setReceiverId] = useState(null);
  const [receiverName, setReceiverName] = useState('');
  const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);
  const [conversationId, setConversationId] = useState(null); // ✅ Thêm state này
  const { currentUser } = useAuth();

  // Hàm để tìm hoặc tạo cuộc hội thoại
  const findOrCreateConversation = async (otherUserId) => {
    if (!currentUser || !currentUser._id) {
      console.error("Người dùng hiện tại chưa được xác thực.");
      return null;
    }
    try {
      // ✅ Gọi API backend với tham số otherUserId
      const response = await axiosInstance.get(`/conversations/find/${otherUserId}`);
      const foundConversationId = response.data._id;
      setConversationId(foundConversationId);
      return foundConversationId; 
    } catch (err) {
      console.error('Lỗi khi tìm/tạo cuộc hội thoại:', err);
      return null;
    }
  };

  const value = {
    receiverId, 
    setReceiverId, 
    receiverName, 
    setReceiverName, 
    isChatBoxOpen, 
    setIsChatBoxOpen,
    conversationId, // ✅ Cung cấp conversationId
    setConversationId, // ✅ Cung cấp setter
    findOrCreateConversation, // ✅ Cung cấp hàm
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}