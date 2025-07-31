// server.js
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import userRoutes from './routes/user.routes.js';
import skillRoutes from './routes/skill.routes.js';
import portfolioRoutes from './routes/portfolio.routes.js';
import cors from 'cors';


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/portfolio', portfolioRoutes);


// Root endpoint
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
