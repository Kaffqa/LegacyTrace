import dotenv from 'dotenv'
dotenv.config()

// Re-export Express app for Vercel Serverless Function
import app from '../server/src/index.js'
export default app
