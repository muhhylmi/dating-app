import express, { Application } from 'express';
import config from './infra/config';
import logger from './utils/logger';

const app: Application = express();

app.listen(config.PORT, () => {
  logger.info(`app running on port ${config.PORT}`);
});