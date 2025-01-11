import express from 'express';
import { register, login, searchUser } from '../controller/UserController.js';
import { validateRegistration } from '../middleware/validation.js';
import { auth } from '../middleware/auth.js';
import { getMyChats, sendMessage, getChatMessages } from '../controller/ChatController.js';

const router = express.Router();

// Auth routes
router.post('/signup', validateRegistration, register);
router.post('/login', login);
router.post('/search-user',auth, searchUser);
router.post('/send-message', auth, sendMessage);
router.get('/get-my-chats', auth, getMyChats);
router.post('/get-chat-messages', auth, getChatMessages);
router.get('/verify', auth, (req, res)=>{
    if(req.user){
        res.status(200).json();
    }
})
export default router;
