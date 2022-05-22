import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

import Auth from '../../models/Auth';
import User from '../../models/User';

interface RegisterRequest {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export default class AccountController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validator = Joi.object<RegisterRequest>({
        firstName: Joi.string().required().trim(),
        lastName: Joi.string().optional().trim(),
        email: Joi.string().email().required().trim(),
        password: Joi.string().min(8).required(),
        passwordConfirmation: Joi.ref('password'),
      }).with('password', 'passwordConfirmation');

      const body: RegisterRequest = await validator.validateAsync(req.body);

      Joi.object({
        email: Joi.any().external(async (value) => {
          if (await User.findOne({ email: value }).exec()) {
            throw new Error('"email" already taken.');
          }
        }),
      }).validateAsync(
        { email: body.email },
        {
          errors: {
            label: false,
          },
        }
      );

      const user = await User.create({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: await bcrypt.hashSync(body.password, 10),
      });

      const auth = await Auth.create({
        user: user._id,
        expiresIn: Date.now() + 518_400_000,
      });

      const userObj = user.toObject();

      delete userObj.password;

      return res.status(200).json({
        status: 'success',
        data: {
          token: auth.token,
          user: userObj,
        },
      });
    } catch (e) {
      return next(e);
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    return res.json({});
  }

  static async resetPassword(req: Request, res: Response) {
    return res.json({});
  }

  static async getProfile(req: Request, res: Response) {
    return res.json({});
  }
}
