import prisma from '../config/prismaClient.js';

export const createReferral = async (req, res) => {
  const { referredUserId, testimonialText, rating, type } = req.body;
  const referrerId = req.user.id;

  try {
    const newReferral = await prisma.referral.create({
      data: {
        referredUserId,
        referrerId,
        testimonialText,
        rating,
        type,
      },
    });
    res.status(201).json(newReferral);
  } catch (error) {
    res.status(500).json({ message: 'Error creating referral', error: error.message });
  }
};
