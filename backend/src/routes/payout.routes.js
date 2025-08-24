import express from 'express';
import { createTransferRecipient, initiateWithdrawal } from '../controllers/payout.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /payout/recipient:
 *   post:
 *     summary: Create a Paystack transfer recipient
 *     description: Creates and saves a Paystack transfer recipient for the authenticated user.
 *     tags: [Payout]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - account_number
 *               - bank_code
 *             properties:
 *               name:
 *                 type: string
 *               account_number:
 *                 type: string
 *               bank_code:
 *                 type: string
 *               currency:
 *                 type: string
 *                 default: "NGN"
 *     responses:
 *       201:
 *         description: Transfer recipient created successfully.
 *       500:
 *         description: Could not create transfer recipient.
 */
router.post('/recipient', createTransferRecipient);

/**
 * @swagger
 * /payout/withdraw:
 *   post:
 *     summary: Initiate a withdrawal from wallet
 *     description: Initiates a withdrawal from the user's wallet to their saved bank account.
 *     tags: [Payout]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amountNaira
 *             properties:
 *               amountNaira:
 *                 type: number
 *     responses:
 *       201:
 *         description: Withdrawal initiated successfully.
 *       400:
 *         description: Invalid amount, insufficient balance, or no recipient found.
 *       500:
 *         description: Could not initiate withdrawal.
 */
router.post('/withdraw', initiateWithdrawal);

export default router;
