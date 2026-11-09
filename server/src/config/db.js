import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️ MONGODB_URI is not set in environment variables. Database features will be unavailable.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host} (Database: ${conn.connection.name})`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ Tip: Make sure your current IP address is whitelisted in MongoDB Atlas Network Access (0.0.0.0/0).');
    console.warn('⚠️ Server will continue running so the API and preview engine remain accessible.');
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected.');
});

export default connectDB;

