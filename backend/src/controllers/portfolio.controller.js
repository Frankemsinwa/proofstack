import getPrismaClient from '../utils/prisma.js';

// Create a new portfolio project
export const createPortfolioProject = async (req, res) => {
  const prisma = getPrismaClient();
  try {
    const { title, description, url, media } = req.body;
    const userId = req.user.id;

    if (!title || !description || !url) {
      return res.status(400).json({ error: 'Title, description, and URL are required.' });
    }

    const project = await prisma.portfolioProject.create({
      data: { userId, title, description, url, media },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Create Portfolio Project Error:', error);
    res.status(500).json({ error: 'Could not create portfolio project.' });
  }
};

// Get all portfolio projects for a user
export const getPortfolioProjectsByUserId = async (req, res) => {
  const prisma = getPrismaClient();
  try {
    const { userId } = req.params;
    const projects = await prisma.portfolioProject.findMany({
      where: { userId },
    });
    res.json(projects);
  } catch (error) {
    console.error('Get Portfolio Projects Error:', error);
    res.status(500).json({ error: 'Could not fetch portfolio projects.' });
  }
};

// Get a single portfolio project by ID
export const getPortfolioProjectById = async (req, res) => {
  const prisma = getPrismaClient();
  try {
    const { id } = req.params;
    const project = await prisma.portfolioProject.findUnique({
      where: { id },
    });

    if (!project) {
      return res.status(404).json({ error: 'Portfolio project not found.' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get Portfolio Project Error:', error);
    res.status(500).json({ error: 'Could not fetch portfolio project.' });
  }
};

// Update a portfolio project
export const updatePortfolioProject = async (req, res) => {
  const prisma = getPrismaClient();
  try {
    const { id } = req.params;
    const { title, description, url, media } = req.body;
    const userId = req.user.id;

    const existingProject = await prisma.portfolioProject.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return res.status(404).json({ error: 'Portfolio project not found.' });
    }

    if (existingProject.userId !== userId) {
      return res.status(403).json({ error: 'You are not authorized to update this project.' });
    }

    const project = await prisma.portfolioProject.update({
      where: { id },
      data: { title, description, url, media },
    });

    res.json(project);
  } catch (error) {
    console.error('Update Portfolio Project Error:', error);
    res.status(500).json({ error: 'Could not update portfolio project.' });
  }
};

// Delete a portfolio project
export const deletePortfolioProject = async (req, res) => {
  const prisma = getPrismaClient();
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingProject = await prisma.portfolioProject.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return res.status(404).json({ error: 'Portfolio project not found.' });
    }

    if (existingProject.userId !== userId) {
      return res.status(403).json({ error: 'You are not authorized to delete this project.' });
    }

    await prisma.portfolioProject.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete Portfolio Project Error:', error);
    res.status(500).json({ error: 'Could not delete portfolio project.' });
  }
};
