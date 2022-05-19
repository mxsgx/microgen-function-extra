import { Router } from 'express';
import UsersController from 'src/controllers/v1/users';
import auth from 'src/middlewares/auth';

const APIRouter = Router();

const V1 = Router();

APIRouter.use('/v1', V1);

const UsersRouter = Router();

V1.use('/users', UsersRouter);

UsersRouter.get('/me', auth, UsersController.getMe);

export default APIRouter;
