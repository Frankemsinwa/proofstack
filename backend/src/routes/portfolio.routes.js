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

/**
 * @swagger
 * tags:
 *   name: Portfolio
 *   description: Portfolio management
 */

/**
 * @swagger
 * /portfolio:
 *   post:
 *     summary: Create a new portfolio project
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               url:
 *                 type: string
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: The created portfolio project
 *       400:
 *         description: Bad request
 *       500:
 *         description: Could not create portfolio project
 */
router.post('/', authMiddleware, createPortfolioProject);

/**
 * @swagger
 * /portfolio/user/{userId}:
 *   get:
 *     summary: Get all portfolio projects for a user
 *     tags: [Portfolio]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A list of portfolio projects
 *       500:
 *         description: Could not fetch portfolio projects
 */
router.get('/user/:userId', getPortfolioProjectsByUserId);

/**
 * @swagger
 * /portfolio/{id}:
 *   get:
 *     summary: Get a single portfolio project by ID
 *     tags: [Portfolio]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The project ID
 *     responses:
 *       200:
 *         description: The portfolio project
 *       404:
 *         description: Portfolio project not found
 *       500:
 *         description: Could not fetch portfolio project
 */
router.get('/:id', getPortfolioProjectById);

/**
 * @swagger
 * /portfolio/{id}:
 *   put:
 *     summary: Update a portfolio project
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               url:
 *                 type: string
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: The updated portfolio project
 *       403:
 *         description: You are not authorized to update this project
 *       404:
 *         description: Portfolio project not found
 *       500:
 *         description: Could not update portfolio project
 */
router.put('/:id', authMiddleware, updatePortfolioProject);

/**
 * @swagger
 * /portfolio/{id}:
 *   delete:
 *     summary: Delete a portfolio project
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The project ID
 *     responses:
 *       204:
 *         description: No content
 *       403:
 *         description: You are not authorized to delete this project
 *       404:
 *         description: Portfolio project not found
 *       500:
 *         description: Could not delete portfolio project
 */
router.delete('/:id', authMiddleware, deletePortfolioProject);

export default router;

