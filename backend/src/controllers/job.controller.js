import prisma from '../config/prismaClient.js';
import { z } from 'zod';

// Zod schema for createJob
const createJobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  budgetNaira: z.number().positive('Budget must be a positive number'),
  locationPreference: z.string().min(1, 'Location preference is required'),
});

// Zod schema for releaseEscrow
const releaseEscrowSchema = z.object({
  talentId: z.string().uuid('Invalid talent ID format'),
  amountNaira: z.number().positive('Amount to release must be a positive number').optional(),
});

// Create a new job (only for CLIENTs)
export const createJob = async (req, res) => {
  const userId = req.user.id;

  if (req.user.role !== 'client') {
    console.warn(`User ${userId} attempted to create job without client role.`);
    return res.status(403).json({ error: 'Forbidden: Only clients can post jobs' });
  }

  try {
    const { title, description, category, budgetNaira, locationPreference } = createJobSchema.parse(req.body);

    const budgetKobo = Math.round(budgetNaira * 100); // Ensure rounding for kobo

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { walletBalance: true },
    });

    if (!user || user.walletBalance < budgetKobo) {
      console.warn(`User ${userId} has insufficient funds for job creation. Required: ${budgetKobo}, Available: ${user?.walletBalance}`);
      return res.status(400).json({ error: 'Insufficient funds in wallet' });
    }

    const result = await prisma.$transaction(async (tx) => {
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

      await tx.user.update({
        where: { id: userId },
        data: {
          walletBalance: {
            decrement: budgetKobo,
          },
        },
      });

      await tx.transaction.create({
        data: {
          userId,
          jobId: job.id,
          type: 'HOLD',
          status: 'SUCCESS',
          amount: budgetKobo,
          currency: 'NGN',
          reference: `hold_${job.id}_${Date.now()}`, // Unique reference
          meta: { 
            jobTitle: job.title,
            budgetNaira: budgetNaira,
            action: 'Job creation escrow hold',
          },
        },
      });
      console.log(`Job ${job.id} created and ${budgetKobo} kobo held in escrow for client ${userId}.`);
      return job;
    });

    const jobWithEscrow = await prisma.jobPost.findUnique({
      where: { id: result.id },
      include: { client: true },
    });

    res.status(201).json(jobWithEscrow);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error creating job:', error.errors);
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Error creating job with escrow:', error);
    res.status(500).json({ error: 'Could not create job', details: error.message });
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
    console.error('Error retrieving all jobs:', error);
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
      console.warn(`Job ${id} not found.`);
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error(`Error retrieving job ${id}:`, error);
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
      console.warn(`User ${userId} attempted to update status for job ${id} without authorization.`);
      return res.status(404).json({ error: 'Job not found or not authorized' });
    }

    const updatedJob = await prisma.jobPost.update({
      where: { id: id },
      data: { status },
    });
    console.log(`Job ${id} status updated to ${status} by client ${userId}.`);
    res.json(updatedJob);
  } catch (error) {
    console.error(`Error updating job ${id} status:`, error);
    res.status(400).json({ error: 'Could not update job status' });
  }
};

// Release escrow to a talent
export const releaseEscrow = async (req, res) => {
  const { id } = req.params;
  const requesterId = req.user.id;
  const isAdmin = req.user.isAdmin;

  try {
    const { talentId, amountNaira } = releaseEscrowSchema.parse(req.body);

    const job = await prisma.jobPost.findUnique({ where: { id } });

    if (!job) {
      console.warn(`Job ${id} not found for escrow release.`);
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.status === 'DISPUTED') {
      console.warn(`Attempted to release escrow for disputed job ${id}.`);
      return res.status(403).json({ error: 'Cannot release escrow for a disputed job' });
    }

    // Authorization: only job owner or admin can release escrow
    if (job.clientId !== requesterId && !isAdmin) {
      console.warn(`User ${requesterId} attempted unauthorized escrow release for job ${id}.`);
      return res.status(403).json({ error: 'Forbidden: Not authorized to release escrow for this job' });
    }

    const talent = await prisma.user.findUnique({ where: { id: talentId } });
    if (!talent) {
      console.warn(`Talent ${talentId} not found for escrow release on job ${id}.`);
      return res.status(404).json({ error: 'Talent not found' });
    }

    const amountKobo = amountNaira ? Math.round(amountNaira * 100) : job.escrowBalance;

    if (job.escrowBalance < amountKobo) {
      console.warn(`Insufficient escrow balance for job ${id}. Requested: ${amountKobo}, Available: ${job.escrowBalance}`);
      return res.status(400).json({ error: 'Insufficient escrow balance' });
    }

    const commission = Math.round(amountKobo * 0.05);
    const payout = amountKobo - commission;

    const result = await prisma.$transaction(async (tx) => {
      // Decrement job escrow balance
      const updatedJob = await tx.jobPost.update({
        where: { id },
        data: {
          escrowBalance: {
            decrement: amountKobo,
          },
        },
      });

      // Increment talent wallet balance
      await tx.user.update({
        where: { id: talentId },
        data: {
          walletBalance: {
            increment: payout,
          },
        },
      });

      // Create transaction for the fee
      await tx.transaction.create({
        data: {
          userId: talentId, // Associated with the talent receiving the payout
          jobId: id,
          type: 'FEE',
          status: 'SUCCESS',
          amount: commission,
          currency: 'NGN',
          reference: `fee_${id}_${Date.now()}`,
          meta: {
            jobId: id,
            talentId,
            commission,
            action: 'Platform fee from escrow release',
          },
        },
      });

      // Create transaction for the release
      const releaseTransaction = await tx.transaction.create({
        data: {
          userId: requesterId,
          jobId: id,
          type: 'RELEASE',
          status: 'SUCCESS',
          amount: amountKobo,
          currency: 'NGN',
          reference: `release_${id}_${Date.now()}`,
          meta: {
            talentId,
            payout,
            commission,
            action: 'Escrow release to talent',
          },
        },
      });

      // If escrow is now zero, mark job as completed
      if (updatedJob.escrowBalance === 0) {
        await tx.jobPost.update({
          where: { id },
          data: { status: 'closed' },
        });
        console.log(`Job ${id} completed as escrow balance reached zero.`);
      }
      console.log(`Escrow of ${amountKobo} kobo released from job ${id}. Payout: ${payout}, Commission: ${commission}.`);
      return releaseTransaction;
    });

    res.status(200).json({ message: 'Escrow released successfully', transaction: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error releasing escrow:', error.errors);
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Error releasing escrow:', error);
    res.status(500).json({ error: 'Could not release escrow', details: error.message });
  }
};
