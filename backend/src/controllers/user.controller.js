import getPrismaClient from '../utils/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

// Register a new user
export const registerUser = async (req, res) => {
  const prisma = getPrismaClient();
  try {
    const { email, name, fullName, role, password } = req.body;

    if (!email || !name || !fullName || !role || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username: name,
        fullName,
        role,
        passwordHash: hashedPassword,
      },
    });
    

    const token = generateToken(user.id);

    // Return user info and token
    const { passwordHash, ...userWithoutPassword } = user;
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ error: 'Could not register user.' });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const prisma = getPrismaClient();
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user.id);

    // Return user info and token
    const { passwordHash, ...userWithoutPassword } = user;
    res.status(200).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Could not login user.' });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  const prisma = getPrismaClient();
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        joinedAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({ error: 'Could not fetch users.' });
  }
};

// Get a single user by ID
export const getUserById = async (req, res) => {
  const prisma = getPrismaClient();
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        joinedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({ error: 'Could not fetch user.' });
  }
};

// Update user (excluding password for now)
export const updateUser = async (req, res) => {
  const prisma = getPrismaClient();
  try {
    const { id } = req.params;
    const { username, role } = req.body;

    if (req.user.id !== id) {
      return res.status(403).json({ error: 'You are not authorized to update this user.' });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { username, role },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        joinedAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ error: 'Could not update user.' });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  const prisma = getPrismaClient();
  try {
    const { id } = req.params;

    if (req.user.id !== id) {
      return res.status(403).json({ error: 'You are not authorized to delete this user.' });
    }

    await prisma.user.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ error: 'Could not delete user.' });
  }
};
