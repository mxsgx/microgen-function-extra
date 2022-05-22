import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import NotFoundError from '../../errors/NotFoundError';
import UnprocessableEntityError from '../../errors/UnprocessableEntityError';
import Auth from '../../models/Auth';
import User, { UserDocument } from '../../models/User';

interface LoginRequest {
  email: string;
  password: string;
}

export default class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validator = Joi.object<LoginRequest>({
        email: Joi.string().email().required().trim(),
        password: Joi.string().min(8).required(),
      });

      const body: LoginRequest = await validator.validateAsync(req.body);

      const user: UserDocument = await User.findOne({
        email: body.email,
      })
        .select('+password')
        .exec();

      if (!user) {
        throw new NotFoundError('User not found.');
      }

      if (!bcrypt.compareSync(body.password, user.password!)) {
        throw new UnprocessableEntityError(
          "Credentials doesn't match in our records."
        );
      }

      const auth = await Auth.create({
        user: user._id,
        expiresIn: Date.now() + 518_400_000, // 1 year
      });

      const userObj = user.toObject();

      delete userObj.password;

      const response: LoginResponse = {
        status: 'success',
        data: {
          token: auth.token,
          user: userObj,
        },
      };

      return res.status(201).json(response);
    } catch (e) {
      return next(e);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await Auth.deleteOne({ token: req.auth?.token }).exec();

      return res.status(200).json({
        status: 'success',
        data: null,
      });
    } catch (e) {
      return next(e);
    }
  }
}
