import prisma from '../config/prismaClient.js';

// Create a new job (only for CLIENTs)
export const createJob = async (req, res) => {
  const { title, description, category, budgetMin, budgetMax, locationPreference } = req.body;
  const  userId  = req.user.id;

  if (req.user.role !== 'client') {
    return res.status(403).json({ error: 'Forbidden: Only clients can post jobs' });
  }

  try {
    const job = await prisma.jobPost.create({
      data: {
        title,
        description,
        category,
        budgetMin,
        budgetMax,
        locationPreference,
        clientId: userId,
        status: 'open',
      },
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ error: 'Could not create job', details: error.message });
  }
};

// Get all jobs (for TALENTs to view)
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await prisma.jobPost.findMany({
      where: { status: 'open' },
      include: { client: true },
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve jobs' });
  }
};

// Get a single job by ID
export const getJobById = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await prisma.jobPost.findUnique({
      where: { id: id },
      include: { client: true, proposals: true },
    });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve job' });
  }
};

// Update job status (for CLIENTs)
export const updateJobStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  try {
    const job = await prisma.jobPost.findUnique({ where: { id: id } });
    if (!job || job.clientId !== userId) {
      return res.status(404).json({ error: 'Job not found or not authorized' });
    }

    const updatedJob = await prisma.jobPost.update({
      where: { id: id },
      data: { status },
    });
    res.json(updatedJob);
  } catch (error) {
    res.status(400).json({ error: 'Could not update job status' });
  }
};
