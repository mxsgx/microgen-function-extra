import { NextFunction, Request, Response } from 'express';

import UnauthorizedError from '../errors/UnauthorizedError';
import Auth, { AuthDocument } from '../models/Auth';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization = req.get('authorization');

    if (!authorization) {
      throw new UnauthorizedError('Unauthenticated');
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('Unauthenticated');
    }

    const auth: AuthDocument = await Auth.findOne({ token })
      .populate('user')
      .exec();

    if (!auth) {
      throw new UnauthorizedError('Invalid token');
    }

    if (Date.now() >= auth.expiresIn) {
      throw new UnauthorizedError('Token is expired');
    }

    req.auth = {
      token,
      user: auth.user as User,
    };

    return next();
  } catch (e) {
    return next(e);
  }
};
