import prisma from '../config/prismaClient.js';
import { z } from 'zod';

// Zod schema for creating a dispute
const createDisputeSchema = z.object({
  reason: z.string().min(10, 'Reason for dispute must be at least 10 characters long'),
});

// Zod schema for resolving a dispute
const resolveDisputeSchema = z.object({
  action: z.enum(['refund', 'release', 'split'], { message: 'Invalid resolution action' }),
  refundAmountNaira: z.number().min(0, 'Refund amount cannot be negative').optional(),
  releaseAmountNaira: z.number().min(0, 'Release amount cannot be negative').optional(),
  talentId: z.string().uuid('Invalid talent ID format').optional(),
});

export const createDispute = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const { reason } = createDisputeSchema.parse(req.body);

    const job = await prisma.jobPost.findUnique({ where: { id } });

    if (!job) {
      console.warn(`Job ${id} not found when creating dispute.`);
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if a dispute already exists for this job
    const existingDispute = await prisma.dispute.findFirst({
      where: { jobId: id, status: 'OPEN' },
    });

    if (existingDispute) {
      console.warn(`Dispute already exists for job ${id}.`);
      return res.status(409).json({ error: 'A dispute for this job is already open.' });
    }

    // For now, we'll assume either party can open a dispute.
    // In a real-world scenario, we'd check if the user is the client or an accepted talent.

    const dispute = await prisma.dispute.create({
      data: {
        jobId: id,
        reason,
      },
    });

    await prisma.jobPost.update({
      where: { id },
      data: { status: 'DISPUTED' },
    });
    console.log(`Dispute ${dispute.id} created for job ${id} by user ${userId}. Job status set to DISPUTED.`);
    res.status(201).json({ message: 'Dispute created successfully', dispute });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error creating dispute:', error.errors);
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Error creating dispute:', error);
    res.status(500).json({ error: 'Could not create dispute', details: error.message });
  }
};

export const resolveDispute = async (req, res) => {
  const { id } = req.params;
  const adminId = req.user.id; // Assuming req.user is populated by auth middleware

  if (!req.user.isAdmin) {
    console.warn(`User ${adminId} attempted to resolve dispute without admin privileges.`);
    return res.status(403).json({ error: 'Forbidden: Only administrators can resolve disputes' });
  }

  try {
    const { action, refundAmountNaira, releaseAmountNaira, talentId } = resolveDisputeSchema.parse(req.body);

    const job = await prisma.jobPost.findUnique({ where: { id } });

    if (!job || job.status !== 'DISPUTED') {
      console.warn(`Disputed job ${id} not found or not in DISPUTED status for resolution.`);
      return res.status(404).json({ error: 'Disputed job not found or not in disputed status' });
    }

    const refundAmountKobo = Math.round(refundAmountNaira ? refundAmountNaira * 100 : 0);
    const releaseAmountKobo = Math.round(releaseAmountNaira ? releaseAmountNaira * 100 : 0);

    if (refundAmountKobo + releaseAmountKobo > job.escrowBalance) {
      console.warn(`Resolution amounts exceed escrow balance for job ${id}. Refund: ${refundAmountKobo}, Release: ${releaseAmountKobo}, Escrow: ${job.escrowBalance}`);
      return res.status(400).json({ error: 'Resolution amounts exceed escrow balance' });
    }

    if ((action === 'release' || action === 'split') && !talentId) {
      console.warn(`Talent ID missing for release/split action on job ${id}.`);
      return res.status(400).json({ error: 'Talent ID is required for release or split actions' });
    }

    await prisma.$transaction(async (tx) => {
      if (action === 'refund' || action === 'split') {
        await tx.user.update({
          where: { id: job.clientId },
          data: { walletBalance: { increment: refundAmountKobo } },
        });
        await tx.transaction.create({
          data: {
            userId: job.clientId,
            jobId: id,
            type: 'REFUND',
            status: 'SUCCESS',
            amount: refundAmountKobo,
            currency: 'NGN',
            reference: `refund_${id}_${Date.now()}`,
            meta: {
              action: 'Dispute resolution refund to client',
              resolvedBy: adminId,
            },
          },
        });
        console.log(`Refunded ${refundAmountKobo} kobo to client ${job.clientId} for job ${id} as part of dispute resolution.`);
      }

      if (action === 'release' || action === 'split') {
        await tx.user.update({
          where: { id: talentId },
          data: { walletBalance: { increment: releaseAmountKobo } },
        });
        await tx.transaction.create({
          data: {
            userId: talentId,
            jobId: id,
            type: 'RELEASE',
            status: 'SUCCESS',
            amount: releaseAmountKobo,
            currency: 'NGN',
            reference: `release_${id}_${Date.now()}`,
            meta: {
              action: 'Dispute resolution release to talent',
              resolvedBy: adminId,
            },
          },
        });
        console.log(`Released ${releaseAmountKobo} kobo to talent ${talentId} for job ${id} as part of dispute resolution.`);
      }

      const remainingEscrow = job.escrowBalance - refundAmountKobo - releaseAmountKobo;

      await tx.jobPost.update({
        where: { id },
        data: {
          status: remainingEscrow > 0 ? 'open' : 'closed', // Revert to open or close if fully depleted
          escrowBalance: remainingEscrow,
        },
      });

      const dispute = await tx.dispute.findFirst({ where: { jobId: id, status: 'OPEN' } });
      if (dispute) {
        await tx.dispute.update({
          where: { id: dispute.id },
          data: { status: 'RESOLVED' },
        });
        console.log(`Dispute ${dispute.id} for job ${id} marked as RESOLVED.`);
      }
    });

    res.status(200).json({ message: 'Dispute resolved successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error resolving dispute:', error.errors);
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Error resolving dispute:', error);
    res.status(500).json({ error: 'Could not resolve dispute', details: error.message });
  }
};
