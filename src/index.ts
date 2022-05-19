import { Application } from 'express';
import APIRouter from './routers/api';

module.exports = (app: Application) => {
  app.use('/api', APIRouter);
};
