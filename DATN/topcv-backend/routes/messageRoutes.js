const express = require('express');
const router = express.Router();
const { getMessagesByConversation, createMessage } = require('../controllers/messageController');
const auth = require('../middleware/authMiddleware');

router.get('/conversation/:conversationId', auth, getMessagesByConversation);
router.post('/', auth, createMessage);

module.exports = router;
