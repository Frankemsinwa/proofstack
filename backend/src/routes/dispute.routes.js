import express from 'express';
import { createDispute, resolveDispute } from '../controllers/dispute.controller.js';
import protect from '../middleware/auth.middleware.js';
import admin from '../middleware/admin.middleware.js';

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /jobs/{id}/disputes:
 *   post:
 *     summary: Create a dispute for a job
 *     description: Allows a user to open a dispute for a specific job.
 *     tags: [Disputes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The job ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Dispute created successfully.
 *       404:
 *         description: Job not found.
 *       500:
 *         description: Could not create dispute.
 */
router.post('/jobs/:id/disputes', createDispute);

/**
 * @swagger
 * /jobs/{id}/disputes/resolve:
 *   post:
 *     summary: Resolve a dispute (admin only)
 *     description: Allows an admin to resolve a dispute by refunding, releasing, or splitting the escrow.
 *     tags: [Disputes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The job ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [refund, release, split]
 *               refundAmountNaira:
 *                 type: number
 *               releaseAmountNaira:
 *                 type: number
 *               talentId:
 *                  type: string
 *     responses:
 *       200:
 *         description: Dispute resolved successfully.
 *       400:
 *         description: Invalid action or amounts.
 *       404:
 *         description: Disputed job not found.
 *       500:
 *         description: Could not resolve dispute.
 */
router.post('/jobs/:id/disputes/resolve', admin, resolveDispute);

export default router;
