import cron from 'node-cron';
import prisma from '../config/prismaClient.js';

// Schedule a job to run every 24 hours to clean up unverified accounts
const cleanupUnverifiedAccounts = cron.schedule('0 0 * * *', async () => {
  console.log('Running scheduled job: Deleting stale unverified accounts...');

  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const result = await prisma.user.deleteMany({
      where: {
        isVerified: false,
        createdAt: {
          lt: twentyFourHoursAgo,
        },
      },
    });

    if (result.count > 0) {
      console.log(`Successfully deleted ${result.count} stale unverified accounts.`);
    } else {
      console.log('No stale unverified accounts to delete.');
    }
  } catch (error) {
    console.error('Error during stale unverified account cleanup:', error);
  }
});

export default cleanupUnverifiedAccounts;
