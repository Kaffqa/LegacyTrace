import app from '../server/src/index';
// @ts-ignore
import serverless from 'serverless-http';

export default serverless(app);
