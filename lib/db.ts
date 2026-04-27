import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Use a global to avoid multiple connections in development (HMR)
const globalWithMongoose = global as typeof globalThis & { mongooseCache?: MongooseCache }

if (!globalWithMongoose.mongooseCache) {
  globalWithMongoose.mongooseCache = { conn: null, promise: null }
}

const cache = globalWithMongoose.mongooseCache

export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable in .env.local')
  }

  if (cache.conn) return cache.conn

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false })
  }

  cache.conn = await cache.promise
  return cache.conn
}
