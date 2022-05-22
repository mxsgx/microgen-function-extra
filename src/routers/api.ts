import { NextFunction, Request, Response, Router } from 'express';

import AccountController from '../controllers/v1/AccountController';
import AuthController from '../controllers/v1/AuthController';
import NotFoundError from '../errors/NotFoundError';
import auth from '../middlewares/auth';
import error from '../middlewares/error';

const APIRouter = Router();

const V1 = Router();

APIRouter.use('/v1', V1);

const AuthRouter = Router();

AuthRouter.post('/login', AuthController.login);
AuthRouter.post('/logout', auth, AuthController.logout);

V1.use('/auth', AuthRouter);

const AccountRouter = Router();

AccountRouter.post('/register', AccountController.register);
AccountRouter.post('/forgot-password', AccountController.forgotPassword);
AccountRouter.post('/reset-password', AccountController.resetPassword);
AccountRouter.get('/profile', auth, AccountController.getProfile);

V1.use('/account', AccountRouter);

APIRouter.all('*', (req: Request, res: Response, next: NextFunction) => {
  return next(new NotFoundError());
});
APIRouter.use(error);

export default APIRouter;
