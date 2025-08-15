import express from 'express';
import { createReferral } from '../controllers/referral.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /referrals:
 *   post:
 *     summary: Create a new referral
 *     tags: [Referrals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - referredUserId
 *               - testimonialText
 *               - rating
 *               - type
 *             properties:
 *               referredUserId:
 *                 type: string
 *                 description: The ID of the user being referred.
 *               testimonialText:
 *                 type: string
 *                 description: The text of the testimonial.
 *               rating:
 *                 type: integer
 *                 description: The rating given in the referral (e.g., 1-5).
 *               type:
 *                 type: string
 *                 description: The type of referral (e.g., 'PEER', 'CLIENT').
 *     responses:
 *       '201':
 *         description: Referral created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Referral'
 *       '500':
 *         description: Error creating referral.
 */
router.post('/', authMiddleware, createReferral);

export default router;
