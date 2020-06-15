import {default as JWT, StrategyOptions} from 'passport-jwt';
import passport from 'passport';
import express from 'express';

import User from '../models/user';
import config from '../config/config';

const cookieExtractor = function(req: express.Request) {
  let token = null;
  if (req && req.cookies)
  {
    token = req.cookies['jwt'];
  }
  return token;
};

// Hooks the JWT Strategy.
function hookJWTStrategy(passport: passport.PassportStatic) {
  const options: StrategyOptions = {
    secretOrKey: config.keys.secret,
    jwtFromRequest: JWT.ExtractJwt.fromExtractors([cookieExtractor]),
    ignoreExpiration: false
  };

  passport.use(
    new JWT.Strategy(options, async (JWTPayload, callback) => {
      try {
        const user = await User.findOne({ _id: JWTPayload.userId });
        if (!user) {
          callback(null, false);
          return;
        }
        callback(null, user);
      } catch (err) {
        callback(err, false);
      }
    })
  );
}

export default hookJWTStrategy;
