import express from 'express';
import {
  createPortfolioProject,
  getPortfolioProjectsByUserId,
  getPortfolioProjectById,
  updatePortfolioProject,
  deletePortfolioProject
} from '../controllers/portfolio.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, createPortfolioProject);
router.get('/user/:userId', getPortfolioProjectsByUserId);
router.get('/:id', getPortfolioProjectById);
router.put('/:id', authMiddleware, updatePortfolioProject);
router.delete('/:id', authMiddleware, deletePortfolioProject);

export default router;
