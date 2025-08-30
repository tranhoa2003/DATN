const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

const getConversations = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const conversations = await Conversation.find({
      participants: { $in: [mongoose.Types.ObjectId(currentUserId)] }
    })
    .populate('participants', 'name companyName avatar email')
    .sort({ updatedAt: -1 });

    res.json(conversations); // trả nguyên dữ liệu để frontend .find() được
  } catch (err) {
    console.error('Error getting conversations:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const findOrCreateConversation = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.otherUserId;

    let conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, otherUserId] }
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [currentUserId, otherUserId]
      });
      await conversation.save();
    }

    res.json(conversation);
  } catch (err) {
    console.error('Error finding/creating conversation:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
const getConversationsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversations = await Conversation.find({ participants: userId })
                                          .populate("participants", "companyName name"); 
    res.status(200).json(conversations);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách cuộc trò chuyện:', error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getConversations, findOrCreateConversation, getConversationsByUserId };
