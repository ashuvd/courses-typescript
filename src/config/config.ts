import * as dotenv from 'dotenv';
import { TDefaultConfig } from './types';
dotenv.config();

const defaultConfig: TDefaultConfig = {
  port: process.env.SERVER_PORT ? +process.env.SERVER_PORT : 0,
  host: process.env.SERVER_HOST || '0.0.0.0',
  mongoUri: process.env.MONGO_URI || '',
  sslKey: process.env.SSL_KEY || '',
  sslCert: process.env.SSL_CERT || '',
  keys: {
    secret: process.env.KEY_SECRET || 'secret',
    expiresIn: process.env.TOKEN_EXPIRES_IN ? +process.env.TOKEN_EXPIRES_IN : 0
  }
};

export default defaultConfig;
