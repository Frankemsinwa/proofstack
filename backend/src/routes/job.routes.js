import express from 'express';
import { createJob, getAllJobs, getJobById, updateJobStatus, releaseEscrow } from '../controllers/job.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a new job with escrow
 *     description: Allows a client to post a new job with escrow funding. Only users with the 'client' role can use this endpoint.
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - budgetNaira
 *               - locationPreference
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               budgetNaira:
 *                 type: number
 *                 description: Budget amount in Naira (will be converted to kobo for escrow)
 *               locationPreference:
 *                 type: string
 *     responses:
 *       201:
 *         description: Job created successfully with escrow.
 *       400:
 *         description: Could not create job or insufficient funds.
 *       403:
 *         description: Forbidden. Only clients can post jobs.
 */
router.post('/', createJob);

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all open jobs
 *     description: Retrieves a list of all open jobs for talent to view. Includes client information.
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of open jobs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
 *       500:
 *         description: Could not retrieve jobs.
 */
router.get('/', getAllJobs);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Get a single job by ID
 *     description: Retrieves detailed information about a specific job, including client and proposal information.
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The job ID.
 *     responses:
 *       200:
 *         description: Job details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found.
 *       500:
 *         description: Could not retrieve job.
 */
router.get('/:id', getJobById);

/**
 * @swagger
 * /jobs/{id}/status:
 *   patch:
 *     summary: Update job status
 *     description: Allows a client to update the status of their job posting.
 *     tags: [Jobs]
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
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [open, in_progress, closed]
 *     responses:
 *       200:
 *         description: Job status updated successfully.
 *       400:
 *         description: Could not update job status.
 *       404:
 *         description: Job not found or not authorized.
 */
router.patch('/:id/status', updateJobStatus);

/**
 * @swagger
 * /jobs/{id}/release:
 *   post:
 *     summary: Release escrow to a talent
 *     description: Allows a client or admin to release escrowed funds to a talent for a specific job.
 *     tags: [Jobs]
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
 *               - talentId
 *             properties:
 *               talentId:
 *                 type: string
 *                 description: The ID of the talent to receive the funds.
 *               amountNaira:
 *                 type: number
 *                 description: The amount in Naira to release. If not provided, the full escrow balance is released.
 *     responses:
 *       200:
 *         description: Escrow released successfully.
 *       400:
 *         description: Insufficient escrow balance.
 *       403:
 *         description: Forbidden. Not authorized to release escrow.
 *       404:
 *         description: Job or talent not found.
 */
router.post('/:id/release', releaseEscrow);

export default router;
