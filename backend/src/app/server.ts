import mongoose from 'mongoose';
import app from './app';
import envConfig from './config/env.config';
import { initCrons } from './corn';

async function main() {
  try {
    app.listen(5000, async () => {
      console.log('Server is running on port:5000');
      await mongoose.connect(envConfig.url.database as string);
      console.log('--Database connected successfully');
      initCrons();
    });
  } catch (error) {
    console.log(error);
  }
}

main();
