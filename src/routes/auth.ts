import * as util from 'util';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as pbkdf2 from '@phc/pbkdf2';
import db from '../db/connection';
import { User } from '../db/models/user';

const router: Router = new Router();

router.post('/register', async (ctx: Koa.Context, next) => {
  // Validation
  const errors = await validateUser(ctx);

  if (errors) {
    ctx.body = {
      success: false,
      validator: errors,
    };
  } else {
    await db.sequelize.sync().then(async () => {
      const passHash = await pbkdf2.hash(ctx.sanitizeBody('password').trim());

      const user = new User({
        username: ctx.sanitizeBody('username').trim(),
        email: ctx
          .sanitizeBody('email')
          .trim()
          .toLowerCase(),
        password: passHash,
        role: ctx
          .sanitizeBody('role')
          .trim()
          .toLowerCase(),
      });

      return user.save();
    });

    ctx.body = {
      success: true,
    };
  }

  await next();
});

async function validateUser(ctx: Koa.Context) {
  ctx
    .checkBody('username', "Username can't be empty")
    .notEmpty()
    .isAlphanumeric()
    .withMessage('Username is not valid')
    .len(3, 25)
    .withMessage('Username must be between 3-25 characters long');
  ctx
    .checkBody('email', 'Email address is not valid.')
    .isEmail()
    .len(4, 80)
    .withMessage('Email address must be between 4-80 characters long');
  ctx
    .checkBody('password', 'Password must be between 5-50 characters long')
    .len(5, 50);
  ctx.checkBody('role', 'Role is not valid').isIn('member', 'admin');

  const errors = await ctx.validationErrors();

  return errors;
}

export default router;
