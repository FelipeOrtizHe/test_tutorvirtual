import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';

const app = express();

// Quick start: run `npm install && npm run dev` from /backend to start the API
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
