import prisma from '../config/prismaClient.js';
import PaystackService from '../services/paystack.service.js';
import { z } from 'zod';

// Zod schema for creating a transfer recipient
const createTransferRecipientSchema = z.object({
  name: z.string().min(1, 'Recipient name is required'),
  account_number: z.string().min(10).max(10, 'Account number must be 10 digits'),
  bank_code: z.string().min(3, 'Bank code is required'),
  currency: z.enum(['NGN', 'USD']).default('NGN'),
});

// Zod schema for initiating a withdrawal
const initiateWithdrawalSchema = z.object({
  amountNaira: z.number().positive('Withdrawal amount must be a positive number'),
});

export const createTransferRecipient = async (req, res) => {
  const userId = req.user.id;

  try {
    const { name, account_number, bank_code, currency } = createTransferRecipientSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      console.warn(`User ${userId} not found when creating transfer recipient.`);
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.paystackRecipientCode) {
      console.log(`User ${userId} already has a Paystack recipient code. Skipping creation.`);
      return res.status(200).json({ message: 'Transfer recipient already exists', recipientCode: user.paystackRecipientCode });
    }

    const recipient = await PaystackService.createTransferRecipient({
      name,
      account_number,
      bank_code,
      currency,
    });

    await prisma.user.update({
      where: { id: userId },
      data: { paystackRecipientCode: recipient.data.recipient_code },
    });

    console.log(`Transfer recipient created for user ${userId}: ${recipient.data.recipient_code}`);
    res.status(201).json({ message: 'Transfer recipient created successfully', recipientCode: recipient.data.recipient_code });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error creating transfer recipient:', error.errors);
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Error creating transfer recipient:', error);
    res.status(500).json({ error: 'Could not create transfer recipient', details: error.message });
  }
};

export const initiateWithdrawal = async (req, res) => {
  const userId = req.user.id;

  try {
    const { amountNaira } = initiateWithdrawalSchema.parse(req.body);
    const amountKobo = Math.round(amountNaira * 100);

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      console.warn(`User ${userId} not found when initiating withdrawal.`);
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.paystackRecipientCode) {
      console.warn(`User ${userId} attempted withdrawal without a Paystack recipient code.`);
      return res.status(400).json({ error: 'No transfer recipient found. Please create one first.' });
    }

    if (user.walletBalance < amountKobo) {
      console.warn(`User ${userId} has insufficient wallet balance for withdrawal. Requested: ${amountKobo}, Available: ${user.walletBalance}`);
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    const reference = `wd_${userId}_${Date.now()}`;

    const result = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          walletBalance: {
            decrement: amountKobo,
          },
        },
      });

      const withdrawalRequest = await tx.withdrawalRequest.create({
        data: {
          userId,
          amount: amountKobo,
          currency: 'NGN',
          status: 'PENDING',
          recipientId: user.paystackRecipientCode,
          reference,
        },
      });
      console.log(`Withdrawal request ${withdrawalRequest.id} created for user ${userId} for ${amountKobo} kobo.`);
      return withdrawalRequest;
    });

    try {
      await PaystackService.initiateTransfer({
        amount: amountKobo,
        recipient: user.paystackRecipientCode,
        reason: 'ProofStack payout',
        reference,
      });
      console.log(`Paystack transfer initiated for withdrawal request ${result.id} with reference ${reference}.`);
    } catch (apiError) {
      console.error(`Paystack API call failed for withdrawal request ${result.id}:`, apiError.message);
      await prisma.withdrawalRequest.update({
        where: { id: result.id },
        data: { status: 'FAILED', meta: { error: apiError.message } },
      });
      // In a real-world scenario, consider a more robust refund mechanism or admin alert.
      return res.status(500).json({ error: 'Failed to initiate transfer with Paystack.', details: apiError.message });
    }

    res.status(201).json({ message: 'Withdrawal initiated successfully. Awaiting confirmation.', request: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error initiating withdrawal:', error.errors);
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Error initiating withdrawal:', error);
    res.status(500).json({ error: 'Could not initiate withdrawal', details: error.message });
  }
};
