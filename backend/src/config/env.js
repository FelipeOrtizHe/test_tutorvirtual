import dotenv from 'dotenv';

// Load environment variables early so all modules can use them
// Quick start: copy .env.example to .env and run `npm install && npm run dev` from /backend
dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  appName: process.env.APP_NAME || 'TutorVirtual API'
};
