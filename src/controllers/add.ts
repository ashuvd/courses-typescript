import { BaseController } from './base';
import auth from '../middlewares/auth';
import Course from '../models/course';
import passport from 'passport';
import { IUserSchema } from '../models/user';

export class AddController extends BaseController {
  public path = '/add';

  public initRouter(passport: passport.PassportStatic) {
    this.router.get('/', auth(passport), (req, res) => {
      res.render('addCourse', {
        isAdd: true,
        user: req.user,
        addError: req.flash('addError'),
      });
    });
    this.router.post('/', auth(passport), async (req, res) => {
      try {
        if (isNaN(req.body.price)) {
          req.flash('addError', 'Цена должна быть числом');
          res.redirect(`/add`);
          return;
        }
        if (
          req.body.img.indexOf('http://') === -1 &&
          req.body.img.indexOf('https://') === -1
        ) {
          req.flash('addError', 'Вы передали не корректный URL');
          res.redirect(`/add`);
          return;
        }
        const course = new Course({
          ...req.body,
          userId: (req.user as IUserSchema)._id,
        });
        await course.save();
        res.redirect('/courses');
      } catch (error) {
        req.flash('addError', error.message || error);
        res.redirect(`/add`);
      }
    });
  }
}
