import prisma from '../config/prismaClient.js';
import { z } from 'zod';
import { parseISO, isValid } from 'date-fns';

// Schema for date range validation
const dateRangeSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

// Schema for transaction filters
const transactionFilterSchema = z.object({
  type: z.enum(['FUNDING', 'HOLD', 'RELEASE', 'PAYOUT', 'REFUND', 'FEE']).optional(),
  status: z.enum(['PENDING', 'SUCCESS', 'FAILED']).optional(),
  userId: z.string().uuid().optional(),
  jobId: z.string().uuid().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  page: z.preprocess(Number, z.number().int().positive().default(1)).optional(),
  pageSize: z.preprocess(Number, z.number().int().positive().max(100).default(10)).optional(),
});

export const getFinanceSummary = async (req, res) => {
  const { from, to } = req.query;

  try {
    const { from: fromDate, to: toDate } = dateRangeSchema.parse({ from, to });

    const whereClause = {};
    if (fromDate) whereClause.createdAt = { gte: parseISO(fromDate) };
    if (toDate) whereClause.createdAt = { ...whereClause.createdAt, lte: parseISO(toDate) };

    const transactions = await prisma.transaction.findMany({
      where: {
        ...whereClause,
        status: 'SUCCESS', // Only consider successful transactions for summary
      },
      select: {
        type: true,
        amount: true,
      },
    });

    let funded = 0;
    let released = 0;
    let fees = 0;
    let payouts = 0;
    let refunds = 0;

    transactions.forEach(txn => {
      switch (txn.type) {
        case 'FUNDING':
          funded += txn.amount;
          break;
        case 'RELEASE':
          released += txn.amount;
          break;
        case 'FEE':
          fees += txn.amount;
          break;
        case 'PAYOUT':
          payouts += txn.amount;
          break;
        case 'REFUND':
          refunds += txn.amount;
          break;
        default:
          break;
      }
    });

    const toNaira = (kobo) => kobo / 100;

    const summary = {
      funded: { kobo: funded, naira: toNaira(funded) },
      released: { kobo: released, naira: toNaira(released) },
      fees: { kobo: fees, naira: toNaira(fees) },
      payouts: { kobo: payouts, naira: toNaira(payouts) },
      refunds: { kobo: refunds, naira: toNaira(refunds) },
      netRevenue: { kobo: fees, naira: toNaira(fees) }, // Net revenue is primarily fees
    };

    console.log('Finance summary generated:', summary);
    res.status(200).json(summary);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error for finance summary:', error.errors);
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Error getting finance summary:', error);
    res.status(500).json({ error: 'Could not retrieve finance summary', details: error.message });
  }
};

export const getTransactions = async (req, res) => {
  const { type, status, userId, jobId, from, to, page = 1, pageSize = 10 } = req.query;

  try {
    const {
      type: filterType,
      status: filterStatus,
      userId: filterUserId,
      jobId: filterJobId,
      from: fromDate,
      to: toDate,
      page: currentPage,
      pageSize: currentpageSize,
    } = transactionFilterSchema.parse(req.query);

    const whereClause = {};
    if (filterType) whereClause.type = filterType;
    if (filterStatus) whereClause.status = filterStatus;
    if (filterUserId) whereClause.userId = filterUserId;
    if (filterJobId) whereClause.jobId = filterJobId;

    if (fromDate || toDate) {
      whereClause.createdAt = {};
      if (fromDate) whereClause.createdAt.gte = parseISO(fromDate);
      if (toDate) whereClause.createdAt.lte = parseISO(toDate);
    }

    const skip = (currentPage - 1) * currentpageSize;

    const [transactions, totalTransactions] = await prisma.$transaction([
      prisma.transaction.findMany({
        where: whereClause,
        skip,
        take: currentpageSize,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, fullName: true, email: true } } },
      }),
      prisma.transaction.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalTransactions / currentpageSize);

    console.log(`Retrieved ${transactions.length} transactions (page ${currentPage} of ${totalPages}).`);
    res.status(200).json({
      page: currentPage,
      pageSize: currentpageSize,
      totalPages,
      totalTransactions,
      transactions: transactions.map(txn => ({
        ...txn,
        amountNaira: txn.amount / 100,
      })),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error for transactions:', error.errors);
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Error getting transactions:', error);
    res.status(500).json({ error: 'Could not retrieve transactions', details: error.message });
  }
};

export const exportTransactionsCsv = async (req, res) => {
  const { type, status, userId, jobId, from, to } = req.query;

  try {
    const {
      type: filterType,
      status: filterStatus,
      userId: filterUserId,
      jobId: filterJobId,
      from: fromDate,
      to: toDate,
    } = transactionFilterSchema.omit({ page: true, pageSize: true }).parse(req.query);

    const whereClause = {};
    if (filterType) whereClause.type = filterType;
    if (filterStatus) whereClause.status = filterStatus;
    if (filterUserId) whereClause.userId = filterUserId;
    if (filterJobId) whereClause.jobId = filterJobId;

    if (fromDate || toDate) {
      whereClause.createdAt = {};
      if (fromDate) whereClause.createdAt.gte = parseISO(fromDate);
      if (toDate) whereClause.createdAt.lte = parseISO(toDate);
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { fullName: true, email: true } } },
    });

    const csvRows = [];
    csvRows.push('ID,User Name,User Email,Job ID,Type,Status,Amount (Naira),Currency,Reference,Created At,Updated At,Meta');

    transactions.forEach(txn => {
      const userName = txn.user?.fullName || 'N/A';
      const userEmail = txn.user?.email || 'N/A';
      const jobIdVal = txn.jobId || 'N/A';
      const amountNaira = (txn.amount / 100).toFixed(2);
      const meta = txn.meta ? JSON.stringify(txn.meta) : '';

      csvRows.push(
        `${txn.id},"${userName}","${userEmail}",${jobIdVal},${txn.type},${txn.status},${amountNaira},${txn.currency},${txn.reference},${txn.createdAt.toISOString()},${txn.updatedAt.toISOString()},"${meta}"`
      );
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('transactions.csv');
    res.status(200).send(csvRows.join('\n'));
    console.log(`Exported ${transactions.length} transactions to CSV.`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error for CSV export:', error.errors);
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Error exporting transactions to CSV:', error);
    res.status(500).json({ error: 'Could not export transactions', details: error.message });
  }
};
