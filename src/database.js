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
  cached = global.mongo = { conn: null };
}

export async function connectToDatabase(selectedDb) {
  const dbName = databases[selectedDb];
  console.log(`Called DB for db ${selectedDb} : ${dbName}`)

  if (!dbName) {
    throw new Error('Database does not exist');
  }

  cached.conn = cached.conn || await MongoClient.connect(MONGODB_URI);

  return {
    conn: cached.conn,
    db: cached.conn.db(dbName),
  };
}

export async function disconnectFromDatabase(conn) {
  console.log('Disconnected from DB')
  await conn.close();
  cached.conn = null;
}