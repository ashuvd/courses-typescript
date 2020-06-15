import passport from 'passport';
import express from 'express';

export default function (passport: passport.PassportStatic) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    return passport.authenticate('jwt', (err, user) => {
      if (err) {
        res.status(500).json({ message: 'Ошибка на сервере' });
        return;
      }
      if (!user) {
        res.status(401).json({ message: 'Ошибка авторизации' });
        return;
      }
      req.user = user;
      next();
    })(req, res, next);
  };
}
