import { NextFunction, Request, Response, Router } from 'express';

import AccountController from '../controllers/v1/AccountController';
import AuthController from '../controllers/v1/AuthController';
import NotFoundError from '../errors/NotFoundError';
import auth from '../middlewares/auth';
import error from '../middlewares/error';

const APIRouter = Router();

const AuthRouter = Router();

AuthRouter.post('/login', AuthController.login);
AuthRouter.post('/logout', auth, AuthController.logout);

APIRouter.use('/auth', AuthRouter);

const AccountRouter = Router();

AccountRouter.post('/register', AccountController.register);
AccountRouter.post('/forgot-password', AccountController.forgotPassword);
AccountRouter.post('/reset-password', AccountController.resetPassword);
AccountRouter.get('/profile', auth, AccountController.getProfile);

APIRouter.use('/account', AccountRouter);

APIRouter.all('*', (req: Request, res: Response, next: NextFunction) => {
  return next(new NotFoundError());
});

APIRouter.use(error);

export default APIRouter;
