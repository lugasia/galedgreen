import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://amir:5OPBfitlnpv4zx6h@cluster0.w5zcbbu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'greendb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
let isConnecting = false;
let connectionPromise: Promise<{ client: MongoClient; db: Db }> | null = null;

export async function connectToDatabase() {
  // If we have a valid cached connection, return it
  if (cachedClient && cachedDb) {
    try {
      // Test the connection
      await cachedClient.db().admin().ping();
      return { client: cachedClient, db: cachedDb };
    } catch (error) {
      // If ping fails, clear the cache and reconnect
      console.error('MongoDB connection test failed:', error);
      await closeConnection();
    }
  }

  // If we're already connecting, return the existing promise
  if (isConnecting && connectionPromise) {
    return connectionPromise;
  }

  // Start a new connection
  isConnecting = true;
  connectionPromise = new Promise(async (resolve, reject) => {
    try {
      const client = await MongoClient.connect(MONGODB_URI, {
        maxPoolSize: 10,
        minPoolSize: 5,
        maxIdleTimeMS: 60000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });

      const db = client.db(DB_NAME);

      // Test the connection
      await db.admin().ping();

      cachedClient = client;
      cachedDb = db;

      resolve({ client, db });
    } catch (error) {
      console.error('MongoDB connection error:', error);
      cachedClient = null;
      cachedDb = null;
      reject(error);
    } finally {
      isConnecting = false;
      connectionPromise = null;
    }
  });

  return connectionPromise;
}

export async function getCollection(collectionName: string) {
  try {
    const { db } = await connectToDatabase();
    return db.collection(collectionName);
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error);
    throw new Error(`Failed to connect to MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function closeConnection() {
  if (cachedClient) {
    try {
      await cachedClient.close();
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
    } finally {
      cachedClient = null;
      cachedDb = null;
    }
  }
} 