import express from 'express';
import { submitProposal, getProposalsForJob, updateProposalStatus } from '../controllers/proposal.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// POST /api/proposals - Submit a new proposal (TALENT only)
router.post('/', submitProposal);

// GET /api/proposals/job/:jobId - Get all proposals for a job (CLIENT only)
router.get('/job/:jobId', getProposalsForJob);

// PATCH /api/proposals/:proposalId/status - Update proposal status (CLIENT only)
router.patch('/:proposalId/status', updateProposalStatus);

export default router;
