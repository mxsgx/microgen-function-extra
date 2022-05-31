import signed from 'express-signed-url';

export const signature = signed({
  secret: process.env.JWT_SECRET,
});
