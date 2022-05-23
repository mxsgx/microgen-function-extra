import { Application } from 'express';
import mongoose from 'mongoose';

const mongoUrlParser = require('mongo-url-parser');

import APIRouter from './routers/api';
import { mongoUrlBuilder } from './utils/helper';
import { transporter } from './utils/mailer';

module.exports = (app: Application) => {
  const parsedMongoUrl = mongoUrlParser(process.env.MAIN_SERVICE_MONGODB);
  const mongoUrl = mongoUrlBuilder({
    auth: parsedMongoUrl.auth,
    database:
      app.env.ENVIRONMENT === 'production'
        ? app.env.MONGODB_DATABASE_PROD
        : app.env.MONGODB_DATABASE_DEV,
    servers: parsedMongoUrl.servers,
    options: {
      authSource: 'admin',
    },
  });

  mongoose
    .connect(mongoUrl, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.info('[Database] Connected to MongoDB server.');
    })
    .catch((err) => {
      console.error('[Database] Cannot connect to MongoDB server.');
      console.error('[Database]', err || err.message);
    });

  transporter.verify((error, success) => {
    if (error) {
      return console.error('[Mailer] Server is not ready.');
    }

    console.info('[Mailer] Server is ready to take our messages.');
  });

  console.info(`[Info] Running server in ${app.env.ENVIRONMENT} environment`);

  app.use('/api', APIRouter);
};
