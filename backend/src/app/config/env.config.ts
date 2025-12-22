import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

const envConfig = {
  environment: process.env.ENVIRONMENT,
  url: {
    database: process.env.DATABASE_URL,
    client_origin: process.env.CLIENT_ORIGIN,
  },

  jwt: {
    access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    access_token_expire: process.env.JWT_ACCESS_TOKEN_EXPIRE,
    refresh_token_expire: process.env.JWT_REFRESH_TOKEN_EXPIRE,
  },
};

export default envConfig;
