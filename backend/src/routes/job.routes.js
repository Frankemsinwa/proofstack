import express from 'express';
import { createJob, getAllJobs, getJobById, updateJobStatus } from '../controllers/job.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// POST /api/jobs - Create a new job (CLIENT only)
router.post('/', createJob);

// GET /api/jobs - Get all open jobs (TALENT can view)
router.get('/', getAllJobs);

// GET /api/jobs/:id - Get a single job by ID
router.get('/:id', getJobById);

// PATCH /api/jobs/:id/status - Update job status (CLIENT only)
router.patch('/:id/status', updateJobStatus);

export default router;
