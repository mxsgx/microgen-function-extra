import bcrypt from 'bcrypt';
import { Buffer } from 'buffer';
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import Joi, { ValidationError } from 'joi';
import * as jose from 'jose';
import ejs from 'ejs';

import Auth from '../../models/Auth';
import PasswordReset, {
  PasswordResetDocument,
} from '../../models/PasswordReset';
import User, { UserDocument } from '../../models/User';
import { transporter } from '../../utils/mailer';
import UnprocessableEntityError from '../../errors/UnprocessableEntityError';

interface RegisterRequest {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
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

      await Joi.object({
        email: Joi.any().external(async (value) => {
          if (await User.findOne({ email: value }).exec()) {
            throw new ValidationError(
              '"email" already taken',
              [
                {
                  message: '"email" already taken',
                  path: ['email'],
                  context: { label: 'email', key: 'email' },
                },
              ],
              { email: value }
            );
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

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const validator = Joi.object<ForgotPasswordRequest>({
        email: Joi.string().email().required().trim(),
      });

      const body: ForgotPasswordRequest = await validator.validateAsync(
        req.body
      );

      await Joi.object({
        email: Joi.any().external(async (value) => {
          if (!(await User.findOne({ email: value }).exec())) {
            throw new ValidationError(
              "We couldn't find account with this email",
              [
                {
                  message: "We couldn't find account with this email",
                  path: ['email'],
                  context: { label: 'email', key: 'email' },
                },
              ],
              { email: value }
            );
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

      const user: UserDocument = await User.findOne({
        email: body.email,
      }).exec();

      const passwordReset = await PasswordReset.create({
        user: user._id,
      });

      const secretKey = crypto.createSecretKey(
        Buffer.from(process.env.JWT_SECRET, 'utf-8')
      );

      const jwt = await new jose.SignJWT({
        token: passwordReset.token,
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h')
        .sign(secretKey);

      const hash = crypto.createHash('sha256').update(jwt).digest('hex');

      await passwordReset.updateOne({
        hash,
      });

      transporter
        .sendMail({
          from: 'masga@carakan.id',
          to: user.email,
          subject: 'Reset Password',
          html: await ejs.renderFile(
            process.cwd() + '/src/resources/template/reset-password.ejs',
            { link: ejs.render(process.env.RESET_PASSWORD_URL, { token: jwt }) }
          ),
        })
        .catch((err) => {
          console.error(
            `[Mailer] Cannot send password reset link email to ${user.email}.`
          );
        });

      return res.status(200).json({
        status: 'success',
        data: {
          message: 'Password reset link email is sent.',
        },
      });
    } catch (e) {
      return next(e);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const validator = Joi.object<ResetPasswordRequest>({
        token: Joi.string().required().trim(),
        password: Joi.string().required(),
        passwordConfirmation: Joi.ref('password'),
      }).with('password', 'passwordConfirmation');

      const body = await validator.validateAsync(req.body);

      const secretKey = crypto.createSecretKey(
        Buffer.from(process.env.JWT_SECRET, 'utf-8')
      );

      try {
        const { payload } = await jose.jwtVerify(body.token, secretKey);

        const passwordReset: PasswordResetDocument =
          await PasswordReset.findOne({
            token: payload.token as string,
          })
            .populate('user')
            .exec();

        if (!passwordReset) {
          return next(new UnprocessableEntityError('Token is invalid'));
        }

        const hash = crypto
          .createHash('sha256')
          .update(body.token)
          .digest('hex');

        if (hash != passwordReset.hash) {
          throw new UnprocessableEntityError("Token hash doesn't match");
        }

        await User.updateOne(
          { _id: (passwordReset.user as User)._id },
          { password: await bcrypt.hashSync(body.password, 10) }
        );

        await passwordReset.deleteOne();

        return res.status(200).json({
          status: 'success',
          data: {
            message: 'Password changed successfully.',
          },
        });
      } catch (e) {
        if (e instanceof jose.errors.JWTExpired) {
          return next(new UnprocessableEntityError('Token is expired'));
        }

        if (e instanceof jose.errors.JOSEError) {
          return next(new UnprocessableEntityError('Token is invalid'));
        }

        return next(e);
      }
    } catch (e) {
      return next(e);
    }
  }

  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json({
        status: 'success',
        data: req.auth?.user,
      });
    } catch (e) {
      return next(e);
    }
  }
}
