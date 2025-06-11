import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    console.log('Attempting to connect to MongoDB Atlas...');
    console.log('Connection string:', mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//<credentials>@')); // Hide credentials in logs
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log('Database:', conn.connection.name);
  } catch (error) {
    console.error('\nMongoDB connection error:', error.message);
    console.error('\nTroubleshooting steps:');
    console.error('1. Check if your MongoDB Atlas connection string is correct');
    console.error('2. Verify that your IP address is whitelisted in MongoDB Atlas');
    console.error('3. Ensure your database user credentials are correct');
    console.error('4. Check your internet connection');
    console.error('\nCurrent MONGO_URI:', process.env.MONGO_URI ? 'Present but invalid' : 'Missing');
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

export default connectDB; 