import mongoose, { Types } from 'mongoose';
import envConfig from '../config/env.config';
import userService from '../modules/user/user.service';
import projectService from '../modules/project/project.service';
import {
  sampleAdmin,
  sampleClients,
  sampleEmployees,
} from './data/user.seed.data';
import { sampleProjects } from './data/project.seed.data';

async function main() {
  try {
    console.log('---script started----');
    //  Connect to DB
    await mongoose.connect(envConfig.url.database as string);
    console.log('Database connected');
    const employeeIds: Types.ObjectId[] = [];
    const clientIds: Types.ObjectId[] = [];

    //  Create admin
    await userService.createAdmin(sampleAdmin);
    console.log('Admin created');

    // Create employees
    for (const employee of sampleEmployees) {
      const created = await userService.createEmployee(employee);
      if (created) employeeIds.push(created._id);
    }
    console.log('All Employees created');

    // Create clients
    for (const client of sampleClients) {
      const created = await userService.createClient(client);
      if (created) clientIds.push(created._id);
    }
    console.log('All Clients created');

    // Create projects
    await Promise.all(
      sampleProjects.map((project) => {
        return projectService.createProject({
          ...project,
          clientId: clientIds[0].toString(),
          employeeIds: employeeIds.slice(0, 5).map((_) => _.toString()),
        } as any);
      }),
    );

    console.log('All projects created');

    console.log('---Script run successfully---');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    // Always close connection
    await mongoose.disconnect();
    console.log('Database disconnected');
    process.exit(0);
  }
}

main();
