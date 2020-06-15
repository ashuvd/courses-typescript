import { BaseController } from './base';
import Course, {ICourseSchema} from '../models/course';
import User, {IUserSchema} from '../models/user';
import Lesson from '../models/lesson';
import auth from '../middlewares/auth';
import passport from 'passport';

export class CourseController extends BaseController {
  public path = '/courses';

  public initRouter(passport: passport.PassportStatic) {
    this.router.get('/', async (req, res) => {
      try {
        let courses = await Course.find();
        res.render('courses', {
          isCourses: true,
          courses,
          user: req.user
        });
      } catch (error) {
        res.json({ message: error.message || error });
      }
    });

    this.router.get('/:id/edit', auth(passport), async (req, res) => {
      try {
        if (!req.query.allow) {
          return res.redirect('/');
        }
        const course = await Course.findById(req.params.id);
        if (!course) {
          return res.redirect('/');
        }
        if ((req.user as IUserSchema)._id.toString() !== course.userId) {
          res.json({ message: 'Вам запрещен доступ к этому курсу' });
          return;
        }
        const lessons = (await Lesson.find({ courseId: course._id })) || [];

        res.render('editCourse', {
          course,
          lessons,
          editError: req.flash('editError')
        });
      } catch (error) {
        res.json({ message: error.message || error });
      }
    });

    this.router.get('/:id', async (req, res) => {
      try {
        const course = await Course.findById(req.params.id);
        if (!course) {
          return res.redirect('/');
        }
        (course as any).lessons = await Lesson.find({ courseId: course._id }) || [];
        const user = await User.findById(course.userId);
        if (!user) {
          return res.redirect('/');
        }
        const access = user.access;

        res.render('course', {
          course,
          user: req.user,
          access
        });
      } catch (error) {
        res.json({ message: error.message || error });
      }
    });

    this.router.post('/edit', auth(passport), async (req, res) => {
      try {
        await (Course as any).update({
          ...req.body,
          userId: (req.user as IUserSchema)._id
        });
        res.redirect('/courses');
      } catch (error) {
        req.flash('editError', error.message || error);
        res.redirect(`/courses/${req.body.id}/edit?allow=true`);
      }
    });

    this.router.post('/remove', auth(passport), async (req, res) => {
      try {
        await Course.deleteOne({ _id: req.body.id });
        res.redirect('/courses');
      } catch (error) {
        req.flash('editError', error.message || error);
        res.redirect(`/courses/${req.body.id}/edit?allow=true`);
      }
    });
  }
}
