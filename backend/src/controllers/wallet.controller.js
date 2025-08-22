import { PrismaClient } from '@prisma/client';
import paystackService from '../services/paystack.service';

const prisma = new PrismaClient();

// Fund wallet endpoint
export const fundWallet = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming auth middleware adds user to req
    const { amount, email } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Convert to kobo (naira to kobo)
    const amountInKobo = amount * 100;

    // Generate reference for the transaction
    const reference = paystackService.generateReference();

    // Create pending transaction record
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type: 'FUNDING',
        status: 'PENDING',
        amount: amountInKobo,
        currency: 'NGN',
        reference,
        meta: { initialAmount: amount },
      },
    });

    // Initialize Paystack transaction
    const callbackUrl = `${process.env.APP_URL}/paystack/callback`;
    const initializeResponse = await paystackService.initializeTransaction({
      email: email || req.user.email,
      amount: amountInKobo,
      metadata: { userId, transactionId: transaction.id },
      callback_url: callbackUrl,
    });

    // Update transaction with Paystack reference
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { reference: initializeResponse.data.reference },
    });

    res.json({
      authorization_url: initializeResponse.data.authorization_url,
      reference: initializeResponse.data.reference,
    });
  } catch (error) {
    console.error('Error funding wallet:', error);
    res.status(500).json({ error: 'Failed to fund wallet' });
  }
};

// Get wallet balance endpoint
export const getWalletBalance = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        walletBalance: true,
        currency: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Convert kobo to naira for display
    const balanceInNaira = user.walletBalance / 100;

    res.json({
      balance: balanceInNaira,
      currency: user.currency,
    });
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    res.status(500).json({ error: 'Failed to get wallet balance' });
  }
};

// Get transaction history endpoint
export const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, type } = req.query;

    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(type && { type }),
    };

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit),
      }),
      prisma.transaction.count({ where }),
    ]);

    // Convert kobo to naira for display
    const transactionsInNaira = transactions.map(txn => ({
      ...txn,
      amountInNaira: txn.amount / 100,
    }));

    res.json({
      transactions: transactionsInNaira,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error getting transaction history:', error);
    res.status(500).json({ error: 'Failed to get transaction history' });
  }
};
