import express from 'express';
const router = express.Router();
import {
  createBFChallenge,
  approveBFChallenge,
  setBFWinners,
  listTodayBFChallenges,
  submitBFWork,
  convertBFToJob,
} from '../controllers/bf.controller.js';
import protect from '../middleware/auth.middleware.js';
import admin from '../middleware/admin.middleware.js';

// Client Routes
router.post('/challenges', protect, createBFChallenge);
router.post('/challenges/:challengeId/convert', protect, convertBFToJob);

// Admin Routes
router.patch('/challenges/:challengeId/approve', protect, admin, approveBFChallenge);
router.post('/challenges/:challengeId/winners', protect, admin, setBFWinners);

// Talent Routes
router.get('/challenges/today', protect, listTodayBFChallenges);
router.post('/challenges/:challengeId/submit', protect, submitBFWork);

export default router;
