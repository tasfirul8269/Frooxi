const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
console.log('Connecting to MongoDB...');
console.log('Connection string:', process.env.MONGO_URI ? 'Found' : 'Missing');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  family: 4 // Use IPv4, skip trying IPv6
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  console.log('Database name:', mongoose.connection.name);
  console.log('Database host:', mongoose.connection.host);
  console.log('Database port:', mongoose.connection.port);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.error('Error stack:', err.stack);
  process.exit(1); // Exit process with failure
});

// Handle MongoDB connection events
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

// API Routes
app.use('/api/users', require('./routes/userRoutes.cjs'));
app.use('/api/portfolio', require('./routes/portfolioRoutes.cjs'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes.cjs'));
app.use('/api/team', require('./routes/teamMemberRoutes.cjs'));
app.use('/api/dashboard', require('./routes/dashboardRoutes.cjs'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});