const signed = require('express-signed-url').default;

export const signature = signed({
  secret: process.env.JWT_SECRET,
});
