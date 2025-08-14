import prisma from '../config/prismaClient.js';

// Submit a proposal for a job (only for TALENTs)
export const submitProposal = async (req, res) => {
  const { jobPostId, coverLetter, attachmentUrl } = req.body;
  const userId = req.user.id;

  if (req.user.role !== 'talent') {
    return res.status(403).json({ error: 'Forbidden: Only talents can submit proposals' });
  }

  try {
    const job = await prisma.jobPost.findUnique({ where: { id: jobPostId } });
    if (!job || job.status !== 'open') {
      return res.status(400).json({ error: 'Job is not open for proposals' });
    }

    const proposal = await prisma.proposal.create({
      data: {
        jobPostId,
        userId,
        coverLetter,
        attachmentUrl,
        status: 'sent',
      },
    });
    res.status(201).json(proposal);
  } catch (error) {
    res.status(400).json({ error: 'Could not submit proposal', details: error.message });
  }
};

// Get all proposals for a specific job (for the job's CLIENT)
export const getProposalsForJob = async (req, res) => {
  const { jobId } = req.params;
  const userId = req.user.id;

  try {
    const job = await prisma.jobPost.findUnique({ where: { id: jobId } });
    if (!job || job.clientId !== userId) {
      return res.status(404).json({ error: 'Job not found or not authorized' });
    }

    const proposals = await prisma.proposal.findMany({
      where: { jobPostId: jobId },
      include: { user: true },
    });
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve proposals' });
  }
};

// Update proposal status (for the job's CLIENT)
export const updateProposalStatus = async (req, res) => {
  const { proposalId } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { jobPost: true },
    });

    if (!proposal || proposal.jobPost.clientId !== userId) {
      return res.status(404).json({ error: 'Proposal not found or not authorized' });
    }

    const updatedProposal = await prisma.proposal.update({
      where: { id: proposalId },
      data: { status },
    });
    res.json(updatedProposal);
  } catch (error) {
    res.status(400).json({ error: 'Could not update proposal status' });
  }
};
