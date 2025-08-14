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

// Skill CRUD
router.post('/', authMiddleware, createSkill);
router.get('/', getSkills);

// User ↔ Skill
router.post('/assign', authMiddleware, assignSkillsToUser); // expects { skillIds: [] }
router.get('/user/:userId', getSkillsByUser);
router.delete('/user/:skillId', authMiddleware, removeSkillFromUser);

// Get all users who have a specific skill
router.get('/:skillId/users', getUsersBySkill);

export default router;
