const express = require('express');
const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');
const { findOrCreateConversation } = require('../controllers/conversationController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Lấy tất cả conversation của 1 user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const conversations = await Conversation.find({
      participants: { $in: [new mongoose.Types.ObjectId(userId)] }
    })
    .populate('participants', 'name companyName avatar email')
    .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (err) {
    console.error('Error fetching conversations:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/find/:otherUserId', auth, findOrCreateConversation);

module.exports = router;
