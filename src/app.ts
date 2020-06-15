import express, { Application } from 'express';
import multer from 'multer';
import https, {Server as ServerHttps} from 'https';
import http, {Server as ServerHttp} from 'http';
import session from 'express-session';
import passport from 'passport';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import flash from 'connect-flash';
import path from 'path';
import hookJWTStrategy from './services/passportStrategy';

import varMiddleware from './middlewares/variables';

import { TDefaultConfig } from './config/types';
import db from "./db";
import {BaseController} from "./controllers/base";

export class App {
  public app: Application;
  public server: ServerHttps | ServerHttp;
  public protocol: string;
  private db: () => Promise<any>;

  constructor(public opts: TDefaultConfig, public controllers: any) {
    this.app = express();

    const upload = multer({ dest: path.join(__dirname, '..', 'public', 'upload') });
    // parse application/x-www-form-urlencoded
    this.app.use(bodyParser.urlencoded({ extended: false }));
    // parse application/json
    this.app.use(bodyParser.json());
    this.app.use(upload.any());

    this.app.use(passport.initialize());
    hookJWTStrategy(passport);

    this.app.use(express.static(path.join(__dirname, '..', 'public')));

    this.app.set('views', path.join(__dirname, '..', 'views'));
    this.app.set('view engine', 'pug');

    this.app.use(
      session({
        secret: 'some secret',
        resave: false,
        saveUninitialized: false,
      })
    );
    this.app.use(cookieParser());
    this.app.use(flash());
    this.app.use(csrf());
    this.app.use(varMiddleware);

    controllers.forEach((controller: BaseController) => {
      controller.init(passport);
      this.app.use(controller.path, controller.router);
    })

    if (opts.ssl && opts.ssl.key && opts.ssl.cert) {
      this.protocol = 'HTTPS';
      this.server = https.createServer(opts.ssl, this.app);
    } else {
      this.protocol = 'HTTP';
      this.server = http.createServer(this.app);
    }
    this.db = db;
  }

  public init(cb: (server: ServerHttp | ServerHttps, protocol: string) => void) {
    this.db().then((message: string) => {
      console.log(message);
      this.server.listen(this.opts.port, this.opts.host, () => {
        cb(this.server, this.protocol);
      });
    }).catch((error: Error) => {
      console.log(error);
    })
  }
}
