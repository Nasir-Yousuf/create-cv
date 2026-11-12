import mongoose from 'mongoose';

let connectPromise = null;

export const isDBConnected = () => mongoose.connection.readyState === 1;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ MONGODB_URI is not set in environment variables. Database features will be unavailable.');
    return null;
  }

  if (connectPromise) {
    return connectPromise;
  }

  connectPromise = mongoose
    .connect(uri, {
      serverSelectionTimeoutMS: 8000,
    })
    .then((conn) => {
      console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host} (Database: ${conn.connection.name})`);
      return conn.connection;
    })
    .catch((error) => {
      console.error(`❌ MongoDB Connection Error: ${error.message}`);
      console.warn('⚠️ Tip: Make sure your current IP address is whitelisted in MongoDB Atlas Network Access (0.0.0.0/0).');
      console.warn('⚠️ Server will continue running so the API and preview engine remain accessible.');
      return null;
    })
    .finally(() => {
      connectPromise = null;
    });

  return connectPromise;
};

mongoose.connection.on('disconnected', () => {
  connectPromise = null;
  console.log('MongoDB disconnected.');
});

export default connectDB;
