import app from '../server/dist/index.js';
// @ts-ignore
import serverless from 'serverless-http';

export default serverless(app);
