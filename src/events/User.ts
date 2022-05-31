import ejs from 'ejs';
import Event from 'events';

import { UserDocument } from '../models/User';
import { transporter } from '../utils/mailer';
import { signature } from '../utils/url';

const UserEvent = new Event();

UserEvent.on('registered', async (user: UserDocument) => {
  const APP_ID = (process.env.APP_ID as string).split('_')[1];
  const suffixURL = '.microgen.id';
  let prefixURL = 'dev-';

  if (process.env.ENVIRONMENT === 'staging') {
    prefixURL = 'stg-';
  } else if (process.env.ENVIRONMENT === 'production') {
    prefixURL = '';
  }

  const URL = prefixURL + APP_ID + suffixURL;

  const link = signature.sign(
    `${URL}/api/v1/account/verify-email/${user._id}`,
    {
      method: 'POST',
      ttl: 3600,
    }
  );

  transporter
    .sendMail({
      subject: 'Verify Your Email',
      from: process.env.SMTP_USER,
      to: user.email,
      html: await ejs.renderFile(
        __dirname + '/../../template/email/verify-email.ejs',
        {
          link,
        }
      ),
    })
    .catch(() => {
      console.error(`[Mailer] Cannot send verification email to ${user.email}`);
    });
});

export default UserEvent;
