import mongoose from 'mongoose';
import app from './app';
import envConfig from './config/env.config';
import { initCrons } from './corn';
import { ActivityModel } from './modules/activity/activity.model';

async function main() {
  try {
    app.listen(5000, async () => {
      console.log('Server is running on port:5000');

      await mongoose.connect(envConfig.url.database as string);
      console.log('--Database connected successfully');
      // console.log(await ActivityModel.aggregate([
      //    {
      //     $lookup: {
      //       from: 'employees',
      //       localField: 'performedBy',
      //       foreignField: '_id',
      //       as: 'emp',
      //     },
      //   },
      // ]))
      initCrons();
    });
  } catch (error) {
    console.log(error);
  }
}

main();
