import express from 'express';
const router = express.Router();
import {
  createBFChallenge,
  approveBFChallenge,
  setBFWinners,
  listTodayBFChallenges,
  submitBFWork,
  convertBFToJob,
  getBFChallengeConversionAnalytics,
} from '../controllers/bf.controller.js';
import protect from '../middleware/auth.middleware.js';
import admin from '../middleware/admin.middleware.js';

// Client Routes

/**
 * @swagger
 * /challenges:
 *   post:
 *     summary: Create a new Black Friday challenge.
 *     description: Allows a client to create a new Black Friday challenge. This can only be done on a Friday.
 *     tags: [Black Friday]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               requirements:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Challenge created successfully.
 *       '403':
 *         description: Forbidden. Challenges can only be created on a Friday.
 */
router.post('/challenges', protect, createBFChallenge);

/**
 * @swagger
 * /challenges/{challengeId}/convert:
 *   post:
 *     summary: Convert a Black Friday challenge to a job post.
 *     description: Allows the client who created the challenge to convert it into a job post.
 *     tags: [Black Friday]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '201':
 *         description: Challenge converted successfully.
 *       '404':
 *         description: Challenge not found or user is not the owner.
 */
router.post('/challenges/:challengeId/convert', protect, convertBFToJob);

// Admin Routes

/**
 * @swagger
 * /challenges/{challengeId}/approve:
 *   patch:
 *     summary: Approve a Black Friday challenge.
 *     description: Allows an admin to approve a Black Friday challenge.
 *     tags: [Black Friday]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Challenge approved successfully.
 *       '400':
 *         description: Challenge is already approved or the maximum number of challenges for the day has been reached.
 *       '404':
 *         description: Challenge not found.
 */
router.patch('/challenges/:challengeId/approve', protect, admin, approveBFChallenge);

/**
 * @swagger
 * /challenges/{challengeId}/winners:
 *   post:
 *     summary: Set the winners for a Black Friday challenge.
 *     description: Allows an admin to set the winners for a Black Friday challenge.
 *     tags: [Black Friday]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               winnerIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: Winners set successfully.
 *       '400':
 *         description: One or more winners have not submitted work for this challenge.
 *       '404':
 *         description: Challenge not found.
 */
router.post('/challenges/:challengeId/winners', protect, admin, setBFWinners);

/**
 * @swagger
 * /challenges/analytics:
 *   get:
 *     summary: Get analytics for Black Friday challenges.
 *     description: Retrieves analytics on the conversion of Black Friday challenges to paid jobs. Admin only.
 *     tags: [Black Friday]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Analytics retrieved successfully.
 */
router.get('/challenges/analytics', protect, admin, getBFChallengeConversionAnalytics);

// Talent Routes

/**
 * @swagger
 * /challenges/today:
 *   get:
 *     summary: List today's Black Friday challenges.
 *     description: Retrieves a list of approved Black Friday challenges for the current day.
 *     tags: [Black Friday]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of today's challenges.
 */
router.get('/challenges/today', protect, listTodayBFChallenges);

/**
 * @swagger
 * /challenges/{challengeId}/submit:
 *   post:
 *     summary: Submit work for a Black Friday challenge.
 *     description: Allows a talent to submit their work for a Black Friday challenge.
 *     tags: [Black Friday]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectUrl:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Work submitted successfully.
 *       '400':
 *         description: You have already submitted work for this challenge.
 *       '404':
 *         description: Active Black Friday challenge not found.
 */
router.post('/challenges/:challengeId/submit', protect, submitBFWork);

export default router;
