import getPrismaClient from '../config/prismaClient.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const user = await prisma.user.create({
      data: {
        email,
        username: name,
        fullName,
        role,
        passwordHash: hashedPassword,
        otp,
        otpExpiresAt,
        isVerified: false,
      },
    });

    // Send OTP email
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Your ProofStack Verification Code',
        html: `<p>Your OTP is: <strong>${otp}</strong>. It will expire in 15 minutes.</p>`,
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Silently fail for now, but in a real app, this should be handled
    }

    res.status(201).json({ message: 'User registered successfully. Please check your email for the OTP.' });

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

    if (!user.isVerified) {
      return res.status(403).json({ error: 'Please verify your email before logging in.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user.id);

    // Return user info and token, excluding sensitive fields
    const { passwordHash, otp, otpExpiresAt, ...userWithoutPassword } = user;
    res.status(200).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Could not login user.' });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  const prisma = getPrismaClient();
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.otp !== otp || new Date() > user.otpExpiresAt) {
      return res.status(400).json({ error: 'Invalid or expired OTP.' });
    }

    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        otp: null,
        otpExpiresAt: null,
      },
    });

    res.status(200).json({ message: 'Account verified successfully.' });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({ error: 'Could not verify OTP.' });
  }
};

// Resend OTP
export const resendOtp = async (req, res) => {
  const prisma = getPrismaClient();
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'This account is already verified.' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.user.update({
      where: { email },
      data: {
        otp,
        otpExpiresAt,
      },
    });

    // Send OTP email
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Your New ProofStack Verification Code',
        html: `<p>Your new OTP is: <strong>${otp}</strong>. It will expire in 15 minutes.</p>`,
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Silently fail for now, but in a real app, this should be handled
    }

    res.status(200).json({ message: 'A new OTP has been sent to your email.' });

  } catch (error) {
    console.error('Resend OTP Error:', error);
    res.status(500).json({ error: 'Could not resend OTP.' });
  }
};

// Get all users (for admin purposes)
export const getAllUsers = async (req, res) => {
  const prisma = getPrismaClient();
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
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
        createdAt: true,
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
        createdAt: true,
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
