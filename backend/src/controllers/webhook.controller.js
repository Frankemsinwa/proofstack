import paystackService from '../services/paystack.service';
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
    const { reference, amount, recipient } = event.data;

    // Find the withdrawal request associated with this transfer
    const withdrawalRequest = await prisma.withdrawalRequest.findFirst({
      where: { reference },
    });

    if (!withdrawalRequest) {
      console.error('No withdrawal request found for transfer reference:', reference);
      return;
    }

    // Update withdrawal request status
    await prisma.withdrawalRequest.update({
      where: { id: withdrawalRequest.id },
      data: {
        status: 'SUCCESS',
      },
    });

    // Create transaction record for the withdrawal
    await prisma.transaction.create({
      data: {
        userId: withdrawalRequest.userId,
        type: 'PAYOUT',
        status: 'SUCCESS',
        amount: withdrawalRequest.amount,
        currency: withdrawalRequest.currency,
        reference: `withdrawal_${reference}`,
        meta: { transferReference: reference, recipient },
      },
    });

    console.log(`Successfully processed transfer ${reference} for user ${withdrawalRequest.userId}`);
  } catch (error) {
    console.error('Error handling successful transfer:', error);
  }
};

// Handle failed transfer
const handleFailedTransfer = async (event) => {
  try {
    const { reference, amount, recipient } = event.data;

    // Find the withdrawal request associated with this transfer
    const withdrawalRequest = await prisma.withdrawalRequest.findFirst({
      where: { reference },
    });

    if (!withdrawalRequest) {
      console.error('No withdrawal request found for failed transfer reference:', reference);
      return;
    }

    // Update withdrawal request status
    await prisma.withdrawalRequest.update({
      where: { id: withdrawalRequest.id },
      data: {
        status: 'FAILED',
      },
    });

    // Create transaction record for the failed withdrawal
    await prisma.transaction.create({
      data: {
        userId: withdrawalRequest.userId,
        type: 'PAYOUT',
        status: 'FAILED',
        amount: withdrawalRequest.amount,
        currency: withdrawalRequest.currency,
        reference: `withdrawal_${reference}`,
        meta: { transferReference: reference, recipient, error: event.data.message },
      },
    });

    console.log(`Failed transfer ${reference} for user ${withdrawalRequest.userId}`);
  } catch (error) {
    console.error('Error handling failed transfer:', error);
  }
};

export default {
  paystackWebhookHandler,
};
