// frontend/src/pages/applicant/ApplicantChatPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { ChatContext } from "../../contexts/ChatContext";
import ApplicantChatBox from "../../components/Chat/ApplicantChatBox";
import { AuthContext } from "../../contexts/AuthContext";
import axiosInstance from "../../utils/axios";

const ApplicantChatPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { 
    setConversationId, 
    setReceiverId, 
    setReceiverName, 
    setIsChatBoxOpen,
    conversationId, 
    receiverId,    
    receiverName,  
  } = useContext(ChatContext);

useEffect(() => {
  console.log('Current user:', currentUser);
  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/conversations?userId=${currentUser._id}`);
      console.log('Conversations:', res.data);
      setConversations(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách cuộc trò chuyện:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (currentUser?._id) {
    fetchConversations();
  }
}, [currentUser]);


  const handleSelectConversation = (conversationId, companyName, companyId) => {
    setConversationId(conversationId);
    setReceiverId(companyId);
    setReceiverName(companyName);
    setIsChatBoxOpen(true);
  };

  return (
    <div className="applicant-chat-page" style={{ display: "flex", height: "80vh" }}>
      <aside style={{ width: 250, borderRight: "1px solid #ccc", padding: 10 }}>
        <h3>Nhà tuyển dụng</h3>
        {conversations.length === 0 ? (
          <p>Chưa có cuộc trò chuyện nào.</p>
        ) : (
          conversations.map((conversation) => {
            const employer = conversation.participants.find(
              (p) => p._id !== currentUser._id
            );
            return (
              <div
                key={conversation._id}
                onClick={() =>
                  handleSelectConversation(
                    conversation._id,
                    employer?.companyName || employer?.name || "Không rõ",
                    employer?._id // 👈 thêm dòng này
                  )
                }
                style={{
                  cursor: "pointer",
                  padding: 8,
                  backgroundColor: conversationId === conversation._id ? "#f0f0f0" : "white",
                }}
                title={employer?.companyName || employer?.name || ""}
              >
                {employer?.companyName || employer?.name || "Không rõ"}
              </div>
            );
          })
        )}
      </aside>

      {/* Khung chat */}
      <main style={{ flex: 1, padding: 10 }}>
        {conversationId ? ( // ✅ Sửa từ selectedConversationId thành conversationId
          <>
            <h3>Đang trò chuyện với: {receiverName}</h3> // ✅ Sửa từ selectedCompanyName thành receiverName
            <ApplicantChatBox conversationId={conversationId} employerId={receiverId} />
          </>
        ) : (
          <p>Chọn một công ty để bắt đầu trò chuyện.</p>
        )}
      </main>
    </div>
  );
};

export default ApplicantChatPage;