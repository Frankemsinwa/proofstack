// server.js
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import userRoutes from './routes/user.routes.js';
import skillRoutes from './routes/skill.routes.js';
import portfolioRoutes from './routes/portfolio.routes.js';
import referralRoutes from './routes/referral.routes.js';
import jobRoutes from './routes/job.routes.js';
import proposalRoutes from './routes/proposal.routes.js';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swaggerConfig.js';


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/proposals', proposalRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Root endpoint
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
