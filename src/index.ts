import express, { Application, Request, Response } from 'express';
import config from './infra/config';
import logger from './utils/logger';
import router from './routes';
import errorHandler from './utils/error';
import { responseError } from './utils/wrapper';

const app: Application = express();
app.use(express.json());

app.use(router);

app.use((req: Request, res: Response) => {
  responseError(res, 404, 'Route not found');
});
app.use("*", errorHandler);

app.listen(config.PORT, () => {
  logger.info(`app running on port ${config.PORT}`);
});