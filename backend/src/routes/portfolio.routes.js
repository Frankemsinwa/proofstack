import express from 'express';
import {
  createPortfolioProject,
  getPortfolioProjectsByUserId,
  getPortfolioProjectById,
  updatePortfolioProject,
  deletePortfolioProject
} from '../controllers/portfolio.controller.js';

const router = express.Router();

router.post('/', createPortfolioProject);
router.get('/user/:userId', getPortfolioProjectsByUserId);
router.get('/:id', getPortfolioProjectById);
router.put('/:id', updatePortfolioProject);
router.delete('/:id', deletePortfolioProject);

export default router;
