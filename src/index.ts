import express, { Application } from 'express';
import config from './infra/config';

const app: Application = express();

app.listen(config.PORT, () => {
  console.log("app running on port", config.PORT);
});