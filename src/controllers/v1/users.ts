import { Request, Response } from 'express';

export default class UsersController {
  static getMe(req: Request, res: Response) {
    res.json({
      data: {
        firstName: "Masga",
        lastName: "Satria Wirawan",
        email: "masga@carakan.id",
      }
    });
  }
}
