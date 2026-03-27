import mongoose from 'mongoose';

// Extend the NodeJS global type to include our mongoose cache
declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global cache to hold the MongoDB connection.
 * This prevents creating multiple connections during development
 * when Next.js hot-reloads the application.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Establishes a connection to MongoDB using Mongoose.
 * Reuses existing connections to prevent multiple connection instances.
 * 
 * @returns {Promise<mongoose.Connection>} The MongoDB connection instance
 */
async function connectDB(): Promise<mongoose.Connection> {
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  // Return cached connection if it exists
  if (cached.conn) {
    return cached.conn;
  }

  // If there's no active promise to connect, create one
  if (!cached.promise) {
    const options: mongoose.ConnectOptions = {
      bufferCommands: false, // Disable mongoose buffering
    };

    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongooseInstance) => {
      return mongooseInstance.connection;
    });
  }

  try {
    // Await the connection promise and cache the result
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset the promise if connection fails
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
