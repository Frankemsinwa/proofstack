// routes/skill.routes.js
import express from 'express';
import {
  createSkill,
  getSkills,
  assignSkillsToUser,
  getSkillsByUser,
  removeSkillFromUser,
  getUsersBySkill,
} from '../controllers/skill.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /skills:
 *   post:
 *     summary: Create a new skill
 *     description: Creates a new skill in the system.
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Skill created successfully.
 *       500:
 *         description: Failed to create skill.
 */
router.post('/', authMiddleware, createSkill);

/**
 * @swagger
 * /skills:
 *   get:
 *     summary: Get all skills
 *     description: Retrieves a list of all skills in the system.
 *     tags: [Skills]
 *     responses:
 *       200:
 *         description: A list of skills.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Skill'
 *       500:
 *         description: Failed to fetch skills.
 */
router.get('/', getSkills);

/**
 * @swagger
 * /skills/assign:
 *   post:
 *     summary: Assign skill(s) to a user
 *     description: Assigns one or more skills to the authenticated user.
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - skillIds
 *             properties:
 *               skillIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Skills assigned successfully.
 *       500:
 *         description: Failed to assign skills.
 */
router.post('/assign', authMiddleware, assignSkillsToUser);

/**
 * @swagger
 * /skills/user/{userId}:
 *   get:
 *     summary: Get skills for a specific user
 *     description: Retrieves all skills for a given user.
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID.
 *     responses:
 *       200:
 *         description: A list of skills for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Skill'
 *       500:
 *         description: Failed to get user skills.
 */
router.get('/user/:userId', getSkillsByUser);

/**
 * @swagger
 * /skills/user/{skillId}:
 *   delete:
 *     summary: Remove a skill from a user
 *     description: Removes a skill from the authenticated user.
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: skillId
 *         required: true
 *         schema:
 *           type: string
 *         description: The skill ID to remove.
 *     responses:
 *       200:
 *         description: Skill removed from user.
 *       500:
 *         description: Failed to remove skill.
 */
router.delete('/user/:skillId', authMiddleware, removeSkillFromUser);

/**
 * @swagger
 * /skills/{skillId}/users:
 *   get:
 *     summary: Get users by skill
 *     description: Retrieves all users who have a specific skill.
 *     tags: [Skills]
 *     parameters:
 *       - in: path
 *         name: skillId
 *         required: true
 *         schema:
 *           type: string
 *         description: The skill ID.
 *     responses:
 *       200:
 *         description: A list of users with the skill.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Failed to fetch users for this skill.
 */
router.get('/:skillId/users', getUsersBySkill);

export default router;