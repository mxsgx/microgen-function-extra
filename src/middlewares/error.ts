import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import HttpError from '../errors/HttpError';

export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[Server] ${req.method} ${req.originalUrl}:`, err);

  if (Joi.isError(err)) {
    const data: { [index: string]: string } = {};

    err.details.forEach(({ path, message }) => {
      const key = path[path.length - 1].toString();

      data[key] = message;
    });

    return res.status(400).json({
      status: 'fail',
      data,
    });
  }

  if ((err as HttpError).isHttpError) {
    return res.status((err as HttpError).statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Unknown error',
  });
};
