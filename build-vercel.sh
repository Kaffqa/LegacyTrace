#!/bin/bash
set -e

# 1. Install server deps & generate Prisma client inside server/
cd server && npm install && npx prisma generate && cd ..

# 2. Copy generated Prisma client to root node_modules (where Vercel resolves it at runtime)
cp -r server/node_modules/.prisma node_modules/

# 3. Bundle the API serverless function
cd server && npx esbuild src/vercel-entry.ts --bundle --platform=node --format=esm --packages=external --outfile=../api/index.js && cd ..

# 4. Build frontend
npm run build
