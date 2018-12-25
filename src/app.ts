import * as Koa from 'koa';
import * as qs from 'koa-qs';
import * as koaValidator from 'koa-async-validator';
import * as cors from '@koa/cors';
import * as logger from 'koa-morgan';
import * as bodyParser from 'koa-bodyparser';
import indexRoutes from './routes';
import authRoutes from './routes/auth';

const app: Koa = new Koa();
qs(app);

// Set middlewares
app.use(
  bodyParser({
    enableTypes: ['json', 'form'],
    formLimit: '10mb',
    jsonLimit: '10mb',
  })
);

app.use(koaValidator());

// Logger
app.use(
  logger('dev', {
    skip: () => app.env === 'test',
  })
);

// Enable CORS
app.use(cors());

// Default error handler middleware
app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
  try {
    await next();
    if (ctx.status === 404) {
      ctx.throw(404);
    }
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      statusCode: ctx.status,
      message: err.message,
    };
    ctx.app.emit('error', err, ctx);
  }
});

// Routes
app.use(indexRoutes.routes());
app.use(authRoutes.routes());

export default app;
