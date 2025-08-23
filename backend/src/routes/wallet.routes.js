import express from 'express';
import { fundWallet, getWalletBalance, getTransactionHistory } from '../controllers/wallet.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// All wallet routes require authentication
router.use(authMiddleware);

// POST /api/wallet/fund - Fund wallet
router.post('/fund', fundWallet);

// GET /api/wallet/balance - Get wallet balance
router.get('/balance', getWalletBalance);

// GET /api/wallet/transactions - Get transaction history
router.get('/transactions', getTransactionHistory);

export default router;
