import mongoose from 'mongoose';
import app from './app';
import envConfig from './config/env.config';
import { initCrons } from './corn';


async function main() {
  try {
    app.listen(5000, async () => {
      await mongoose.connect(envConfig.url.database as string);
      initCrons()
    });
  } catch (error) {
    console.log(error);
  }
}

main();
