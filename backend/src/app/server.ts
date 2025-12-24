import mongoose from 'mongoose';
import app from './app';
import envConfig from './config/env.config';
import projectService from './modules/project/project.service';

async function main() {
  try {
    app.listen(5000, async () => {
      await mongoose.connect(envConfig.url.database as string);
      console.log('Server in running on port', 5000);
      await projectService.getAllGroupProjectsByHealthStatus();
    });
  } catch (error) {
    console.log(error);
  }
}

main();
