import { BaseController } from './base';
import User, { IUserSchema } from '../models/user';
import auth from '../middlewares/auth';
import passport from 'passport';

export class AccessController extends BaseController {
  public path = '/access';

  public initRouter(passport: passport.PassportStatic) {
    this.router.get('/', auth(passport), async (req, res) => {
      try {
        const users = await User.find();
        res.render('access', {
          isAccess: true,
          user: req.user,
          users,
          accessError: req.flash('accessError'),
        });
      } catch (error) {
        res.json({ message: error.message || error });
      }
    });

    this.router.post('/', auth(passport), async (req, res) => {
      try {
        const accessUsers = Object.keys(req.body).filter(
          (key) => key !== 'userId' && key !== '_csrf'
        );
        await (req.user as IUserSchema).update({ access: accessUsers });
        res.redirect('/access');
      } catch (error) {
        req.flash('accessError', error.message || error);
        res.redirect(`/access`);
      }
    });
  }
}
