import dotenv from 'dotenv';
import path from 'path';
import Log from '../../utils/logger';

// 🔥 LOAD ENV FIRST
export const loadEnv = dotenv.config({
  path: path.resolve(process.cwd(), '.env')
});

Log.info(`ENV loaded from ${path.resolve(process.cwd(), '.env')}`);

// 🔥 THEN READ VALUES
export const ENV = {
  BASE_API_URL: process.env.BASE_API_URL || '',
  LOGIN_CONTACT_NUMBER: process.env.LOGIN_CONTACT_NUMBER || '6001387380',
  SYS_ENV: process.env.SYS_ENV,
  PG_HOST:process.env.PG_HOST,
  PG_PORT:process.env.PG_PORT,
  PG_DATABASE:process.env.PG_DATABASE,
  PG_USER:process.env.PG_USER,
  PG_PASSWORD:process.env.PG_PASSWORD,
  PG_SSL:process.env.PG_SSL,
  PG_HOST_DATA:process.env.PG_HOST_DATA,
  PG_PORT_DATA:process.env.PG_PORT_DATA,
  PG_DATABASE_DATA:process.env.PG_DATABASE_DATA,
  PG_USER_DATA:process.env.PG_USER_DATA,
  PG_PASSWORD_DATA:process.env.PG_PASSWORD_DATA,
  PG_SSL_DATA:process.env.PG_SSL_DATA
};

// 🚨 HARD FAIL (recommended)
if (!ENV.BASE_API_URL) {
  throw new Error('❌ BASE_API_URL is not defined in .env');
}
