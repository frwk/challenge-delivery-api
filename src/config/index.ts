import { config } from 'dotenv';
config({ path: process.env.NODE_ENV !== 'development' ? `.env.${process.env.NODE_ENV}` : '.env' });
export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } = process.env;
export const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DATABASE, MONGO_URL } = process.env;
