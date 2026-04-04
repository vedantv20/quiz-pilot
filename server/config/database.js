const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('⚠️  MONGODB_URI not found in environment variables');
      console.log('📝 Server will start without database connection');
      console.log('💡 Add MONGODB_URI to .env file to enable database');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    console.log('📝 Server will continue without database connection');
    console.log('💡 Make sure MongoDB is running or check your MONGODB_URI');
    // Don't exit the process, let server start without DB for development
  }
};

module.exports = connectDB;