import { Pool } from 'pg';
import { ENV } from '../helper/env/env.config';
import Log from '../utils/logger';

export const pgPoolData = new Pool({
  host: ENV.PG_HOST_DATA,
  port: Number(ENV.PG_PORT_DATA),
  database: ENV.PG_DATABASE_DATA,
  user: ENV.PG_USER_DATA,
  password: ENV.PG_PASSWORD_DATA,
  ssl: ENV.PG_SSL_DATA === 'true' ? { rejectUnauthorized: false } : false
});

pgPoolData.on('connect', () => {
  Log.info('✅ Connected to PostgreSQL FOR DATA');
});

pgPoolData.on('error', (err) => {
  Log.error('❌ PostgreSQL pool error FOR DATA', err);
});
