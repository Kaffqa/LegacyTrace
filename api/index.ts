import app from '../server/src/index.js';
// @ts-ignore
import serverless from 'serverless-http';

export default serverless(app);
