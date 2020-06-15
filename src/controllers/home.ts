import { BaseController } from './base';

export class HomeController extends BaseController {
  public path = '/';

  public initRouter() {
    this.router.get('/', (req, res) => {
      res.render('index', {
        isHome: true,
        user: req.user,
      });
    });
  }
}
