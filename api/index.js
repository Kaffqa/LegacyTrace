import dotenv from 'dotenv';
dotenv.config();

// Vercel Serverless Function entry point
// We use dynamic import for the main Express app to bypass ESM/CommonJS issues
export default async function handler(req, res) {
  const appModule = await import('../server/src/index.ts');
  const app = appModule.default;
  return app(req, res);
}
