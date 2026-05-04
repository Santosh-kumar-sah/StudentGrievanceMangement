import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { chat } from '../controllers/chatController.js';

const router = express.Router();

router.post('/', authMiddleware, chat);

export default router;
