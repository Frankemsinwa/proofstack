import express from 'express';
import { createReferral } from '../controllers/referral.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, createReferral);

export default router;
