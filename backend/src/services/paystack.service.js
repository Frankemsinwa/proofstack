import { post, get } from 'axios';
import { createHmac } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class PaystackService {
  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY;
    this.publicKey = process.env.PAYSTACK_PUBLIC_KEY;
    this.baseUrl = process.env.PAYSTACK_BASE_URL;
    this.headers = {
      Authorization: `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json',
    };
  }

  // Initialize transaction
  async initializeTransaction({ email, amount, metadata, callback_url }) {
    try {
      const reference = this.generateReference();
      const response = await post(
        `${this.baseUrl}/transaction/initialize`,
        {
          email,
          amount,
          reference,
          metadata,
          callback_url,
        },
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error('Paystack initialization error:', error.response?.data || error.message);
      throw new Error('Failed to initialize transaction');
    }
  }

  // Verify transaction
  async verifyTransaction(reference) {
    try {
      const response = await get(
        `${this.baseUrl}/transaction/verify/${reference}`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error('Paystack verification error:', error.response?.data || error.message);
      throw new Error('Failed to verify transaction');
    }
  }

  // Create a transfer recipient
  async createTransferRecipient({ name, account_number, bank_code, currency }) {
    try {
      const response = await post(
        `${this.baseUrl}/transferrecipient`,
        {
          type: 'nuban',
          name,
          account_number,
          bank_code,
          currency: currency || 'NGN',
        },
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error('Paystack transfer recipient creation error:', error.response?.data || error.message);
      throw new Error('Failed to create transfer recipient');
    }
  }

  // Initiate transfer
  async initiateTransfer({ amount, recipient, reason, reference }) {
    try {
      const response = await post(
        `${this.baseUrl}/transfer`,
        {
          source: 'balance',
          amount,
          recipient,
          reference: reference || this.generateReference(),
          reason,
        },
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error('Paystack transfer initiation error:', error.response?.data || error.message);
      throw new Error('Failed to initiate transfer');
    }
  }

  // Finalize transfer
  async finalizeTransfer(transferCode, otp) {
    try {
      const response = await post(
        `${this.baseUrl}/transfer/finalize_transfer`,
        {
          transfer_code: transferCode,
          otp,
        },
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error('Paystack transfer finalization error:', error.response?.data || error.message);
      throw new Error('Failed to finalize transfer');
    }
  }

  // Get transfer status
  async getTransferStatus(reference) {
    try {
      const response = await get(
        `${this.baseUrl}/transfer/${reference}`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error('Paystack transfer status check error:', error.response?.data || error.message);
      throw new Error('Failed to check transfer status');
    }
  }

  // Generate a unique reference
  generateReference() {
    return `txn_${uuidv4()}`;
  }

  // Create withdrawal recipient for user
  async createWithdrawalRecipient(userId, accountNumber, bankCode, currency = 'NGN') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Check if recipient already exists
      if (user.paystackRecipientCode) {
        return { recipientCode: user.paystackRecipientCode };
      }

      const response = await this.createTransferRecipient({
        name: user.fullName,
        account_number: accountNumber,
        bank_code: bankCode,
        currency,
      });

      // Update user with recipient code
      await prisma.user.update({
        where: { id: userId },
        data: { paystackRecipientCode: response.data.recipient_code },
      });

      return { recipientCode: response.data.recipient_code };
    } catch (error) {
      console.error('Error creating withdrawal recipient:', error);
      throw error;
    }
  }

  // Verify webhook signature
  verifySignature(req) {
    try {
      const hash = createHmac('sha512', this.secretKey)
        .update(JSON.stringify(req.body))
        .digest('hex');
      
      const signature = req.headers['x-paystack-signature'];
      
      return hash === signature;
    } catch (error) {
      console.error('Error verifying signature:', error);
      return false;
    }
  }
}

export default new PaystackService();
