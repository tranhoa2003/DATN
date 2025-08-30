const Message = require('../models/Message');

const getMessagesByConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId })
      .sort('timestamp')
      .populate('senderId', 'name avatar')
      .populate('receiverId', 'name avatar');

    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createMessage = async (req, res) => {
    try {
        const { conversationId, senderId, receiverId, text } = req.body;
        const message = new Message({
            conversationId,
            senderId,
            receiverId,
            text,
            timestamp: new Date()
        });
        await message.save();
        res.status(201).json(message);
    } catch (err) {
        console.error('Error creating message:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
module.exports = { getMessagesByConversation, createMessage };
