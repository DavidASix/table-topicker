import { MongoClient } from 'mongodb';
const { MONGODB_URI, MONGODB_DB_DATA, MONGODB_DB_USER } = process.env
const databases = {
  data: MONGODB_DB_DATA,
  users: MONGODB_DB_USER,
}
/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo;
if (!cached) {
  cached = global.mongo = { connections: new Map(), promises: new Map() };
}

export async function connectToDatabase(selectedDb) {
  const dbName = databases[selectedDb];
  console.log(`Called DB for db ${selectedDb} : ${dbName}`)
  if (!dbName) {
    throw new Error('Database does not exist');
  }

  if (cached.connections.has(selectedDb)) {
    console.log('using cached DB')
    return cached.connections.get(selectedDb);
  }

  if (!cached.promises.has(selectedDb)) {
    const opts = { useUnifiedTopology : true }

    cached.promises.set(selectedDb, MongoClient.connect(MONGODB_URI, opts).then((client) => {
      return {
        client,
        db: client.db(dbName),
      }
    }));
  }

  const conn = await cached.promises[selectedDb];
  cached.connections.set(selectedDb, conn);
  return conn
}