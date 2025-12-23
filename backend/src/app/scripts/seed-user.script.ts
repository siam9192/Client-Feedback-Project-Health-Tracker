import mongoose from 'mongoose';
import {
  ClientType,
  EmploymentType,
  Gender,
} from '../modules/user/user.interface';
import envConfig from '../config/env.config';
import userService from '../modules/user/user.service';

const admin = {
  name: 'Siam Hasan',
  profilePicture: 'https://example.com/images/admin1.png',
  gender: Gender.MALE,
  email: 'siam.admin@example.com',
  password: 'Admin@1234',
};

const employees = [
  {
    name: 'Rahim Ahmed',
    gender: Gender.MALE,
    profilePicture: 'https://example.com/images/emp1.png',
    position: 'Frontend Developer',
    employmentType: EmploymentType.FULLTIME,
    address: {
      street: '12/A Road',
      city: 'Dhaka',
      country: 'Bangladesh',
      postcode: '1207',
    },
    contactInfo: {
      email: 'rahim.ahmed@company.com',
      phone: '01710000001',
    },
    email: 'rahim.employee@company.com',
    password: 'Employee@123',
  },
  {
    name: 'Nusrat Jahan',
    gender: Gender.FEMALE,
    profilePicture: 'https://example.com/images/emp2.png',
    position: 'Backend Developer',
    employmentType: EmploymentType.INTERN,
    address: {
      city: 'Chittagong',
      country: 'Bangladesh',
    },
    contactInfo: {
      phone: '01710000002',
    },
    email: 'nusrat.employee@company.com',
    password: 'Employee@123',
  },
  {
    name: 'Tanvir Hasan',
    gender: Gender.MALE,
    profilePicture: 'https://example.com/images/emp3.png',
    position: 'DevOps Engineer',
    employmentType: EmploymentType.FULLTIME,
    email: 'tanvir.employee@company.com',
    password: 'Employee@123',
  },

  {
    name: 'Sabbir Rahman',
    gender: Gender.MALE,
    profilePicture: 'https://example.com/images/emp9.png',
    position: 'Mobile App Developer',
    employmentType: EmploymentType.FULLTIME,
    address: {
      city: 'Khulna',
      country: 'Bangladesh',
    },
    contactInfo: {
      email: 'sabbir.mobile@company.com',
      phone: '01710000009',
    },
    email: 'sabbir.employee@company.com',
    password: 'Employee@123',
  },
  {
    name: 'Jannatul Ferdous',
    gender: Gender.FEMALE,
    profilePicture: 'https://example.com/images/emp10.png',
    position: 'Business Analyst',
    employmentType: EmploymentType.PARTTIME,
    email: 'jannatul.employee@company.com',
    password: 'Employee@123',
  },
];

const clients = [
  {
    name: 'Arif Hossain',
    gender: Gender.MALE,
    profilePicture: 'https://example.com/images/client1.png',
    clientType: ClientType.INDIVIDUAL,
    address: {
      street: '22/B Lake Road',
      city: 'Dhaka',
      country: 'Bangladesh',
      postcode: '1205',
    },
    contactInfo: {
      phone: '01810000001',
    },
    email: 'arif.client@example.com',
    password: 'Client@123',
  },
  {
    name: 'TechNova Ltd',
    profilePicture: 'https://example.com/images/client2.png',
    clientType: ClientType.COMPANY,
    address: {
      city: 'Chittagong',
      country: 'Bangladesh',
    },
    contactInfo: {
      email: 'contact@technova.com',
      phone: '01810000002',
    },
    email: 'technova.admin@example.com',
    password: 'Client@123',
  },
  {
    name: 'Nabila Rahman',
    gender: Gender.FEMALE,
    clientType: ClientType.INDIVIDUAL,
    email: 'nabila.client@example.com',
    password: 'Client@123',
  },
];

async function main() {
  try {
    // 1️⃣ Connect to DB (awaited)
    await mongoose.connect(envConfig.url.database as string);
    console.log('✅ Database connected');

    // 2️⃣ Create admin
    // await userService.createAdmin(admin);
    console.log('✅ Admin created');

    // 3️⃣ Create employees (SAFE)
    for (const employee of employees) {
      await userService.createEmployee(employee);
    }
    console.log('✅ Employees created');

    // 4️⃣ Create clients (SAFE)
    for (const client of clients) {
      await userService.createClient(client);
    }
    console.log('✅ Clients created');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    // 5️⃣ Always close connection
    await mongoose.disconnect();
    console.log('🔌 Database disconnected');
    process.exit(0);
  }
}

main();
