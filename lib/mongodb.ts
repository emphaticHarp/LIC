import { MongoClient } from 'mongodb';
import { attachDatabasePool } from '@vercel/functions';

if (!process.env.amarlic_db_MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "amarlic_db_MONGODB_URI"');
}

const uri = process.env.amarlic_db_MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof global & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    attachDatabasePool(client);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  attachDatabasePool(client);
  clientPromise = client.connect();
}

export default clientPromise;
