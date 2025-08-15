import express from 'express';
import { submitProposal, getProposalsForJob, updateProposalStatus } from '../controllers/proposal.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

/**
 * @swagger
 * /proposals:
 *   post:
 *     summary: Submit a new proposal
 *     description: Allows a talent to submit a proposal for a job. Only users with the 'talent' role can use this endpoint.
 *     tags: [Proposals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobPostId
 *               - coverLetter
 *             properties:
 *               jobPostId:
 *                 type: string
 *               coverLetter:
 *                 type: string
 *               attachmentUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Proposal submitted successfully.
 *       400:
 *         description: Could not submit proposal.
 *       403:
 *         description: Forbidden. Only talents can submit proposals.
 */
router.post('/', submitProposal);

/**
 * @swagger
 * /proposals/job/{jobId}:
 *   get:
 *     summary: Get all proposals for a job
 *     description: Retrieves all proposals for a specific job. Only the client who posted the job can use this endpoint.
 *     tags: [Proposals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: The job ID.
 *     responses:
 *       200:
 *         description: A list of proposals for the job.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Proposal'
 *       404:
 *         description: Job not found or not authorized.
 *       500:
 *         description: Could not retrieve proposals.
 */
router.get('/job/:jobId', getProposalsForJob);

/**
 * @swagger
 * /proposals/{proposalId}/status:
 *   patch:
 *     summary: Update proposal status
 *     description: Allows a client to update the status of a proposal for their job.
 *     tags: [Proposals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: proposalId
 *         required: true
 *         schema:
 *           type: string
 *         description: The proposal ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [sent, viewed, accepted, rejected]
 *     responses:
 *       200:
 *         description: Proposal status updated successfully.
 *       400:
 *         description: Could not update proposal status.
 *       404:
 *         description: Proposal not found or not authorized.
 */
router.patch('/:proposalId/status', updateProposalStatus);

export default router;