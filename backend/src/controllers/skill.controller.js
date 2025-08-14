// controllers/skill.controller.js
import getPrismaClient from '../utils/prisma.js';

// Create a new skill
export const createSkill = async (req, res) => {
  const prisma = getPrismaClient();
  const { name } = req.body;
  try {
    const skill = await prisma.skill.create({
      data: { name },
    });
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create skill', detail: error.message });
  }
};

// Get all skills
export const getSkills = async (req, res) => {
  const prisma = getPrismaClient();
  try {
    const skills = await prisma.skill.findMany();
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
};

// Assign skill(s) to a user
export const assignSkillsToUser = async (req, res) => {
  const prisma = getPrismaClient();
  const userId = req.user.id;
  const { skillIds } = req.body;

  try {
    const createdLinks = await Promise.all(
      skillIds.map(async (skillId) => {
        return prisma.userSkill.upsert({
          where: {
            userId_skillId: { userId, skillId },
          },
          update: {},
          create: { userId, skillId },
        });
      })
    );
    res.status(200).json({ message: 'Skills assigned', data: createdLinks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign skills', detail: error.message });
  }
};

// Get skills for a specific user
export const getSkillsByUser = async (req, res) => {
  const prisma = getPrismaClient();
  const { userId } = req.params;

  try {
    const userSkills = await prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true },
    });
    const skills = userSkills.map(us => us.skill);
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user skills' });
  }
};

// Remove a skill from a user
export const removeSkillFromUser = async (req, res) => {
  const prisma = getPrismaClient();
  const userId = req.user.id;
  const { skillId } = req.params;

  try {
    await prisma.userSkill.delete({
      where: {
        userId_skillId: { userId, skillId },
      },
    });
    res.status(200).json({ message: 'Skill removed from user' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove skill', detail: error.message });
  }
};

// Get users by skill
export const getUsersBySkill = async (req, res) => {
  const prisma = getPrismaClient();
  const { skillId } = req.params;

  try {
    const userSkills = await prisma.userSkill.findMany({
      where: { skillId },
      include: {
        user: true,
      },
    });
    const users = userSkills.map(us => us.user);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users for this skill' });
  }
};
