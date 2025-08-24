import express from 'express';
import { fundWallet, getWalletBalance, getTransactionHistory } from '../controllers/wallet.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// All wallet routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /wallet/fund:
 *   post:
 *     summary: Fund wallet
 *     description: Funds the user's wallet.
 *     tags:
 *       - Wallet
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount to fund the wallet with.
 *     responses:
 *       200:
 *         description: Wallet funded successfully.
 *       400:
 *         description: Invalid request body.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
router.post('/fund', fundWallet);

/**
 * @swagger
 * /wallet/balance:
 *   get:
 *     summary: Get wallet balance
 *     description: Retrieves the current balance of the user's wallet.
 *     tags:
 *       - Wallet
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet balance retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *                   description: The current wallet balance.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
router.get('/balance', getWalletBalance);

/**
 * @swagger
 * /wallet/transactions:
 *   get:
 *     summary: Get transaction history
 *     description: Retrieves the transaction history for the user's wallet.
 *     tags:
 *       - Wallet
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transaction history retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   type:
 *                     type: string
 *                     description: Type of transaction (e.g., 'credit', 'debit').
 *                   amount:
 *                     type: number
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   description:
 *                     type: string
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
router.get('/transactions', getTransactionHistory);

export default router;
