import prisma from '../config/prismaClient.js';
import { isFridayNow, getEndOfFriday } from '../utils/date.js';

// Note: Timezone for all date operations is Africa/Lagos.

export const createBFChallenge = async (req, res) => {
  // Ensure that challenges are only created on a Friday in UTC.
  if (!isFridayNow()) {
    return res.status(403).json({ error: 'Black Friday challenges can only be created on a Friday.' });
  }

  const { title, description, requirements } = req.body;
  const clientId = req.user.id;

  // The event date is the current Friday.
  const eventDate = new Date();
  eventDate.setUTCHours(0, 0, 0, 0);

  // The deadline is the end of the current Friday.
  const deadline = getEndOfFriday();

  try {
    const alreadyPosted = await prisma.proofChallenge.findFirst({
      where: { createdById: clientId, isBlackFriday: true, eventDate },
    });
    if (alreadyPosted) {
      return res.status(400).json({ error: 'You have already submitted a challenge this Friday.' });
    }
    const newChallenge = await prisma.proofChallenge.create({
      data: {
        title,
        brief: description, // The schema has 'brief' not 'description'
        createdById: clientId,
        isBlackFriday: true,
        eventDate,
        deadline,
        approved: false,
      },
    });
    res.status(201).json(newChallenge);
  } catch (error) {
    // Log any errors that occur during challenge creation.
    console.error('Error creating Black Friday challenge:', error);
    res.status(500).json({ error: 'An error occurred while creating the challenge.' });
  }
};

export const approveBFChallenge = async (req, res) => {
  const { challengeId } = req.params;
  const adminId = req.user.id;

  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'You are not authorized to perform this action.' });
  }

  try {
    const challenge = await prisma.proofChallenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found.' });
    }

    if (challenge.approved) {
      return res.status(400).json({ error: 'Challenge is already approved.' });
    }

    const startOfDay = new Date(challenge.eventDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(challenge.eventDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // A maximum of 10 Black Friday challenges can be approved for a single day.
    // This limit is enforced at the time of approval, not creation.
    const approvedCount = await prisma.proofChallenge.count({
      where: {
        isBlackFriday: true,
        approved: true,
        eventDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (approvedCount >= 10) {
      return res.status(400).json({ error: 'The maximum number of approved Black Friday challenges for this day has been reached.' });
    }

    const updatedChallenge = await prisma.proofChallenge.update({
      where: { id: challengeId },
      data: {
        approved: true,
        approvedById: adminId,
        approvedAt: new Date(),
      },
    });

    res.status(200).json(updatedChallenge);
  } catch (error) {
    console.error('Error approving Black Friday challenge:', error);
    res.status(500).json({ error: 'An error occurred while approving the challenge.' });
  }
};

export const setBFWinners = async (req, res) => {
  const { challengeId } = req.params;
  const { winnerIds } = req.body;

  const uniqueWinners = [...new Set(winnerIds)];
  if (uniqueWinners.length !== winnerIds.length) {
    return res.status(400).json({ error: 'Duplicate winners not allowed.' });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'You are not authorized to perform this action.' });
  }

  try {
    const challenge = await prisma.proofChallenge.findUnique({
      where: { id: challengeId },
      include: { submissions: true },
    });

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found.' });
    }

    // Ensure that all winner IDs provided have actually submitted work for the challenge.
    // This prevents the client from setting fake winners.
    const submittedUserIds = challenge.submissions.map(sub => sub.userId);
    const allWinnersSubmitted = winnerIds.every(id => submittedUserIds.includes(id));

    if (!allWinnersSubmitted) {
      return res.status(400).json({ error: 'One or more winners have not submitted work for this challenge.' });
    }

    await prisma.$transaction(async (tx) => {
      await tx.proofChallenge.update({
        where: { id: challengeId },
        data: { winnerIds: { set: winnerIds } },
      });

      for (const winnerId of winnerIds) {
        await tx.user.update({
          where: { id: winnerId },
          data: { trustScore: { increment: 10 } },
        });

        await tx.trustEvent.create({
          data: {
            userId: winnerId,
            delta: 10,
            reason: `Won Black Friday challenge: ${challenge.title}`,
          },
        });
      }
    });

    res.status(200).json({ message: 'Winners have been set successfully.' });
  } catch (error) {
    console.error('Error setting Black Friday winners:', error);
    res.status(500).json({ error: 'An error occurred while setting the winners.' });
  }
};

export const listTodayBFChallenges = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const challenges = await prisma.proofChallenge.findMany({
      where: {
        isBlackFriday: true,
        approved: true,
        eventDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        createdBy: {
          select: {
            fullName: true,
            profileImageUrl: true,
          },
        },
      },
    });

    res.status(200).json(challenges);
  } catch (error) {
    console.error('Error listing today\'s Black Friday challenges:', error);
    res.status(500).json({ error: 'An error occurred while retrieving the challenges.' });
  }
};

export const submitBFWork = async (req, res) => {
  const { challengeId } = req.params;
  const { projectUrl, description } = req.body;
  const userId = req.user.id;

  try {
    const challenge = await prisma.proofChallenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge || !challenge.approved || !challenge.isBlackFriday) {
      return res.status(404).json({ error: 'Active Black Friday challenge not found.' });
    }

    const existingSubmission = await prisma.challengeSubmission.findFirst({
      where: {
        challengeId,
        userId,
      },
    });

    if (existingSubmission) {
      return res.status(400).json({ error: 'You have already submitted work for this challenge.' });
    }

    await prisma.$transaction(async (tx) => {
      await tx.challengeSubmission.create({
        data: {
          challengeId,
          userId,
          projectUrl,
          description,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { trustScore: { increment: 1 } },
      });

      await tx.trustEvent.create({
        data: {
          userId,
          delta: 1,
          reason: `Participated in Black Friday challenge: ${challenge.title}`,
        },
      });
    });

    res.status(201).json({ message: 'Your work has been submitted successfully.' });
  } catch (error) {
    console.error('Error submitting Black Friday work:', error);
    res.status(500).json({ error: 'An error occurred while submitting your work.' });
  }
};

export const convertBFToJob = async (req, res) => {
  const { challengeId } = req.params;
  const clientId = req.user.id;

  try {
    const challenge = await prisma.proofChallenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge || challenge.createdById !== clientId) {
      return res.status(404).json({ error: 'Challenge not found or you are not the owner.' });
    }

    if (challenge.jobPostId) {
      return res.status(400).json({ error: 'This challenge has already been converted to a job.' });
    }

    const newJob = await prisma.jobPost.create({
      data: {
        clientId,
        title: challenge.title,
        description: challenge.brief,
        category: 'Black Friday Challenge', // Or some other default
        budgetMin: 0, // Or some other default
        budgetMax: 0, // Or some other default
        locationPreference: 'remote', // Or some other default
        status: 'open',
      },
    });

    await prisma.proofChallenge.update({
      where: { id: challengeId },
      data: { jobPostId: newJob.id },
    });

    res.status(201).json(newJob);
  } catch (error) {
    console.error('Error converting Black Friday challenge to job:', error);
    res.status(500).json({ error: 'An error occurred while converting the challenge.' });
  }
};

/**
 * Provides analytics on the conversion of Black Friday challenges to paid jobs.
 * This is an admin-only endpoint.
 */
export const getBFChallengeConversionAnalytics = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'You are not authorized to perform this action.' });
  }

  try {
    const totalBFChallenges = await prisma.proofChallenge.count({
      where: { isBlackFriday: true },
    });

    const convertedChallenges = await prisma.proofChallenge.count({
      where: {
        isBlackFriday: true,
        jobPostId: { not: null },
      },
    });

    const conversionRate = totalBFChallenges > 0 ? (convertedChallenges / totalBFChallenges) * 100 : 0;

    const submissions = await prisma.challengeSubmission.findMany({
      where: {
        challenge: {
          isBlackFriday: true,
        },
      },
    });

    const totalSubmissions = submissions.length;

    const averageSubmissionsPerChallenge = totalBFChallenges > 0 ? totalSubmissions / totalBFChallenges : 0;

    const allWinners = await prisma.proofChallenge.findMany({
      where: {
        isBlackFriday: true,
        winnerIds: {
          isEmpty: false,
        },
      },
      select: {
        winnerIds: true,
      },
    });

    const winnerCounts = allWinners.flatMap(c => c.winnerIds).reduce((acc, winnerId) => {
      acc[winnerId] = (acc[winnerId] || 0) + 1;
      return acc;
    }, {});

    const topWinner = Object.keys(winnerCounts).reduce((a, b) => (winnerCounts[a] > winnerCounts[b] ? a : b), null);

    const totalTrustScoreAwarded = await prisma.trustEvent.aggregate({
      _sum: {
        delta: true,
      },
      where: {
        reason: {
          contains: 'Black Friday',
        },
      },
    });

    res.status(200).json({
      totalBFChallenges,
      convertedChallenges,
      conversionRate: `${conversionRate.toFixed(2)}%`,
      averageSubmissionsPerChallenge: averageSubmissionsPerChallenge.toFixed(2),
      topWinner,
      totalTrustScoreAwarded: totalTrustScoreAwarded._sum.delta || 0,
    });
  } catch (error) {
    console.error('Error fetching BF challenge conversion analytics:', error);
    res.status(500).json({ error: 'An error occurred while fetching analytics.' });
  }
};
