import paystackService from '../services/paystack.service.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const paystackWebhookHandler = async (req, res) => {
  try {
    const event = req.body;
    const signature = req.headers['x-paystack-signature'];

    // Verify webhook signature
    if (!paystackService.verifySignature(req)) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    console.log('Received Paystack webhook:', event);

    switch (event.event) {
      case 'charge.success':
        await handleSuccessfulPayment(event);
        break;
      case 'transfer.success':
        await handleSuccessfulTransfer(event);
        break;
      case 'transfer.failed':
        await handleFailedTransfer(event);
        break;
      default:
        console.log('Unhandled event type:', event.event);
    }

    res.status(200).json({ message: 'Webhook received successfully' });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

// Handle successful payment (wallet funding)
const handleSuccessfulPayment = async (event) => {
  try {
    const { reference, amount, metadata } = event.data;

    // Extract user ID from metadata
    const userId = metadata?.userId;
    const transactionId = metadata?.transactionId;

    if (!userId || !transactionId) {
      console.error('Payment metadata missing userId or transactionId for reference:', reference);
      return;
    }

    // Check if transaction is already completed (idempotency)
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        reference,
        status: 'SUCCESS',
      },
    });

    if (existingTransaction) {
      console.log(`Transaction ${reference} already processed, skipping...`);
      return;
    }

    // Verify the payment again to ensure it's legitimate
    const verification = await paystackService.verifyTransaction(reference);
    
    if (verification.data.status !== 'success') {
      console.error('Payment verification failed for reference:', reference);
      return;
    }

    // Update transaction in a database transaction
    await prisma.$transaction(async (tx) => {
      // Mark the Transaction as SUCCESS and store event data in meta
      await tx.transaction.update({
        where: { id: transactionId },
        data: {
          status: 'SUCCESS',
          meta: { ...event.data },
        },
      });

      // Increment User.walletBalance by amount (in kobo)
      await tx.user.update({
        where: { id: userId },
        data: {
          walletBalance: {
            increment: parseInt(amount),
          },
        },
      });
    });

    console.log(`Successfully processed payment ${reference} for user ${userId}`);
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
};

// Handle successful transfer
const handleSuccessfulTransfer = async (event) => {
  try {
    const { reference } = event.data;

    const withdrawalRequest = await prisma.withdrawalRequest.findUnique({
      where: { reference },
    });

    if (!withdrawalRequest) {
      console.error(`No withdrawal request found for reference: ${reference}`);
      return;
    }

    if (withdrawalRequest.status === 'SUCCESS') {
      console.log(`Withdrawal ${reference} already processed, skipping.`);
      return;
    }

    await prisma.withdrawalRequest.update({
      where: { id: withdrawalRequest.id },
      data: {
        status: 'SUCCESS',
        meta: event.data,
      },
    });

    console.log(`Successfully processed transfer ${reference}`);
  } catch (error) {
    console.error('Error handling successful transfer:', error);
  }
};

// Handle failed transfer
const handleFailedTransfer = async (event) => {
  try {
    const { reference } = event.data;

    const withdrawalRequest = await prisma.withdrawalRequest.findUnique({
      where: { reference },
    });

    if (!withdrawalRequest) {
      console.error(`No withdrawal request found for reference: ${reference}`);
      return;
    }

    if (withdrawalRequest.status === 'FAILED') {
      console.log(`Withdrawal ${reference} already marked as failed, skipping.`);
      return;
    }

    await prisma.$transaction(async (tx) => {
      await tx.withdrawalRequest.update({
        where: { id: withdrawalRequest.id },
        data: {
          status: 'FAILED',
          meta: event.data,
        },
      });

      await tx.user.update({
        where: { id: withdrawalRequest.userId },
        data: {
          walletBalance: {
            increment: withdrawalRequest.amount,
          },
        },
      });
    });

    console.log(`Processed failed transfer ${reference} and refunded user.`);
  } catch (error) {
    console.error('Error handling failed transfer:', error);
  }
};

export default {
  paystackWebhookHandler,
};
