import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import teamMemberRoutes from './routes/teamMemberRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars - make sure this is called before any other code
dotenv.config({ path: path.join(__dirname, '.env') });

// Verify environment variables
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in environment variables');
  console.error('Please create a .env file in the backend directory with the following content:');
  console.error(`
PORT=5000
MONGO_URI=mongodb+srv://frooxi:frooxi123@cluster0.mongodb.net/frooxi?retryWrites=true&w=majority
JWT_SECRET=frooxi_web_glow_secret_key_2024
NODE_ENV=development
  `);
  process.exit(1);
}

// Connect to database
connectDB();

const app = express();

// Enable CORS with specific options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = ['http://localhost:8080', 'http://localhost:5173'];
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token']
};

app.use(cors(corsOptions));

// Body parser
app.use(express.json());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/users', userRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/team', teamMemberRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      msg: 'CORS error: Origin not allowed',
      error: err.message
    });
  }
  res.status(500).json({ 
    msg: 'Something broke!',
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('MongoDB URI:', process.env.MONGO_URI ? 'Configured' : 'Not configured');
  console.log('CORS enabled for:', ['http://localhost:8080', 'http://localhost:5173'].join(', '));
});