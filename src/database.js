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
let cached = global.mongo
if (!cached) {
  cached = global.mongo = { conn: null, promise: null }
}

export async function connectToDatabase(selectedDb) {
  const dbName = databases[selectedDb];
  if (!dbName) {
    throw new Error('Database does not exist');
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology : true
    }

    cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
      return {
        client,
        db: client.db(dbName),
      }
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}