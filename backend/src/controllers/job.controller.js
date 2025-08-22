import prisma from '../config/prismaClient.js';

// Create a new job (only for CLIENTs)
export const createJob = async (req, res) => {
  const { title, description, category, budgetNaira, locationPreference } = req.body;
  const userId = req.user.id;

  if (req.user.role !== 'client') {
    return res.status(403).json({ error: 'Forbidden: Only clients can post jobs' });
  }

  if (!budgetNaira || budgetNaira <= 0) {
    return res.status(400).json({ error: 'Invalid budget amount' });
  }

  try {
    // Convert budgetNaira to budgetKobo
    const budgetKobo = budgetNaira * 100;

    // Check if user has sufficient balance
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { walletBalance: true },
    });

    if (!user || user.walletBalance < budgetKobo) {
      return res.status(400).json({ error: 'Insufficient funds in wallet' });
    }

    // Create job with escrow in a database transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create JobPost (status=open, escrowBalance=budgetKobo)
      const job = await tx.jobPost.create({
        data: {
          title,
          description,
          category,
          budgetMin: budgetNaira,
          budgetMax: budgetNaira,
          locationPreference,
          clientId: userId,
          status: 'open',
          escrowBalance: budgetKobo,
        },
      });

      // Decrement User.walletBalance by budgetKobo
      await tx.user.update({
        where: { id: userId },
        data: {
          walletBalance: {
            decrement: budgetKobo,
          },
        },
      });

      // Create Transaction type=HOLD, status=SUCCESS, amount=budgetKobo, jobId set
      await tx.transaction.create({
        data: {
          userId,
          jobId: job.id,
          type: 'HOLD',
          status: 'SUCCESS',
          amount: budgetKobo,
          currency: 'NGN',
          reference: `hold_${job.id}`,
          meta: { 
            jobTitle: job.title,
            budgetNaira: budgetNaira,
          },
        },
      });

      return job;
    });

    // Return the JobPost with escrow info
    const jobWithEscrow = await prisma.jobPost.findUnique({
      where: { id: result.id },
      include: { client: true },
    });

    res.status(201).json(jobWithEscrow);
  } catch (error) {
    console.error('Error creating job with escrow:', error);
    res.status(400).json({ error: 'Could not create job', details: error.message });
  }
};

// Get all jobs (for TALENTs to view)
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await prisma.jobPost.findMany({
      where: { status: 'open' },
      include: { client: true },
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve jobs' });
  }
};

// Get a single job by ID
export const getJobById = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await prisma.jobPost.findUnique({
      where: { id: id },
      include: { client: true, proposals: true },
    });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve job' });
  }
};

// Update job status (for CLIENTs)
export const updateJobStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  try {
    const job = await prisma.jobPost.findUnique({ where: { id: id } });
    if (!job || job.clientId !== userId) {
      return res.status(404).json({ error: 'Job not found or not authorized' });
    }

    const updatedJob = await prisma.jobPost.update({
      where: { id: id },
      data: { status },
    });
    res.json(updatedJob);
  } catch (error) {
    res.status(400).json({ error: 'Could not update job status' });
  }
};
