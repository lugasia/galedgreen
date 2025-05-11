import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://amir:5OPBfitlnpv4zx6h@cluster0.w5zcbbu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'greendb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(DB_NAME);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function getCollection(collectionName: string) {
  const { db } = await connectToDatabase();
  return db.collection(collectionName);
}

export async function closeConnection() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
} 