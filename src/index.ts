import { App } from './app';
import * as fs from 'fs';
import * as path from 'path';
import opts from './config/config';
import { HomeController } from './controllers/home';
import { AddController } from './controllers/add';
import { AccessController } from './controllers/access';
import { AuthController } from './controllers/auth';
import { CourseController } from './controllers/course';
import { LessonController } from './controllers/lesson';
import { AddressInfo } from 'net';

if (opts.sslKey || opts.sslCert) {
  if (opts.sslKey && opts.sslCert) {
    opts.ssl = {
      key: fs.readFileSync(path.resolve(opts.sslKey)),
      cert: fs.readFileSync(path.resolve(opts.sslCert)),
    };
    delete opts.sslKey;
    delete opts.sslCert;
  } else {
    console.error(
      'Error: Server will not run because either the key or the certificate has not been provided.'
    );
    process.exit(1);
  }
}

const app = new App(opts, [
  new AuthController(),
  new HomeController(),
  new CourseController(),
  new AddController(),
  new LessonController(),
  new AccessController(),
]);

app.init((server, protocol) => {
  const addressInfo: AddressInfo | string | null = server.address();
  const host = addressInfo && typeof addressInfo !== 'string' ? addressInfo.address : '';
  const port = addressInfo && typeof addressInfo !== 'string' ? addressInfo.port : '';
  console.log(`${protocol} Server started on ${host}, port: ${port}`);
});

process.on('uncaughtException', function (e) {
  console.error('Error: ' + e);
});
