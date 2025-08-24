import express from 'express';
import { getFinanceSummary, getTransactions, exportTransactionsCsv } from '../controllers/admin.controller.js';
import protect from '../middleware/auth.middleware.js';
import admin from '../middleware/admin.middleware.js';

const router = express.Router();

// All admin routes require authentication and admin privileges
router.use(protect);
router.use(admin);

/**
 * @swagger
 * /admin/finance/summary:
 *   get:
 *     summary: Get financial summary
 *     description: Retrieves a summary of financial totals (funded, released, fees, payouts, refunds) within a specified date range. Admin only.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for the summary (ISO 8601 format).
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for the summary (ISO 8601 format).
 *     responses:
 *       200:
 *         description: Financial summary retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 funded:
 *                   type: object
 *                   properties:
 *                     kobo: { type: number }
 *                     naira: { type: number }
 *                 released:
 *                   type: object
 *                   properties:
 *                     kobo: { type: number }
 *                     naira: { type: number }
 *                 fees:
 *                   type: object
 *                   properties:
 *                     kobo: { type: number }
 *                     naira: { type: number }
 *                 payouts:
 *                   type: object
 *                   properties:
 *                     kobo: { type: number }
 *                     naira: { type: number }
 *                 refunds:
 *                   type: object
 *                   properties:
 *                     kobo: { type: number }
 *                     naira: { type: number }
 *                 netRevenue:
 *                   type: object
 *                   properties:
 *                     kobo: { type: number }
 *                     naira: { type: number }
 *       400:
 *         description: Validation failed for date range.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden (not an admin).
 *       500:
 *         description: Internal server error.
 */
router.get('/finance/summary', getFinanceSummary);

/**
 * @swagger
 * /admin/transactions:
 *   get:
 *     summary: Get paginated transactions with filters
 *     description: Retrieves a paginated list of transactions with various filtering options. Admin only.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [FUNDING, HOLD, RELEASE, PAYOUT, REFUND, FEE]
 *         description: Filter by transaction type.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, SUCCESS, FAILED]
 *         description: Filter by transaction status.
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by user ID.
 *       - in: query
 *         name: jobId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by job ID.
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for transactions (ISO 8601 format).
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for transactions (ISO 8601 format).
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Number of items per page.
 *     responses:
 *       200:
 *         description: Paginated list of transactions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page: { type: integer }
 *                 pageSize: { type: integer }
 *                 totalPages: { type: integer }
 *                 totalTransactions: { type: integer }
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction' # Assuming Transaction schema exists
 *       400:
 *         description: Validation failed for filters or pagination.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden (not an admin).
 *       500:
 *         description: Internal server error.
 */
router.get('/transactions', getTransactions);

/**
 * @swagger
 * /admin/transactions/export/csv:
 *   get:
 *     summary: Export transactions to CSV
 *     description: Exports filtered transactions to a CSV file. Admin only.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [FUNDING, HOLD, RELEASE, PAYOUT, REFUND, FEE]
 *         description: Filter by transaction type.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, SUCCESS, FAILED]
 *         description: Filter by transaction status.
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by user ID.
 *       - in: query
 *         name: jobId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by job ID.
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for transactions (ISO 8601 format).
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for transactions (ISO 8601 format).
 *     responses:
 *       200:
 *         description: CSV file of transactions.
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       400:
 *         description: Validation failed for filters.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden (not an admin).
 *       500:
 *         description: Internal server error.
 */
router.get('/transactions/export/csv', exportTransactionsCsv);

export default router;
