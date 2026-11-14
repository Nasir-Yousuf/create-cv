import mongoose from 'mongoose';

export const isDBConnected = () => mongoose.connection.readyState === 1;

/**
 * Connect to MongoDB with connection caching across serverless invocations.
 * Caches the connection promise on global._mongoClientPromise so warm serverless
 * containers reuse the connection in 0ms without redundant handshakes or pool exhaustion.
 */
export const connectDB = async () => {
  // If connection is already open and ready, return immediately (0ms)
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ MONGODB_URI is not set in environment variables. Database features will be unavailable.');
    return null;
  }

  // Reuse existing promise if already connecting or cached on global
  if (global._mongoClientPromise) {
    try {
      const conn = await global._mongoClientPromise;
      if (mongoose.connection.readyState === 1) {
        return conn;
      }
    } catch (_) {
      // Clear poisoned or rejected promise so reconnect can be attempted
      global._mongoClientPromise = null;
    }
  }

  global._mongoClientPromise = mongoose
    .connect(uri, {
      serverSelectionTimeoutMS: 8000,
      maxPoolSize: 10,
    })
    .then((conn) => {
      console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host} (Database: ${conn.connection.name})`);
      return conn.connection;
    })
    .catch((error) => {
      console.error(`❌ MongoDB Connection Error: ${error.message}`);
      console.warn('⚠️ Tip: Make sure your current IP address is whitelisted in MongoDB Atlas Network Access (0.0.0.0/0).');
      console.warn('⚠️ Server will continue running so the API and preview engine remain accessible.');
      global._mongoClientPromise = null;
      return null;
    });

  return global._mongoClientPromise;
};

mongoose.connection.on('disconnected', () => {
  global._mongoClientPromise = null;
  console.log('MongoDB disconnected.');
});

export default connectDB;
