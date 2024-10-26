import express, { Application, Request, Response } from 'express';
import config from './infra/config';
import logger from './utils/logger';
import router from './routes';

const app: Application = express();
app.use(express.json());

app.use(router);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(config.PORT, () => {
  logger.info(`app running on port ${config.PORT}`);
});