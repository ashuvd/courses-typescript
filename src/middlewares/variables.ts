import express from 'express';

export default function(req: express.Request, res: express.Response, next: express.NextFunction) {
  res.locals.isAuth = req.session ? req.session.isAuth : false;
  res.locals.csrf = req.csrfToken();
  next();
}
