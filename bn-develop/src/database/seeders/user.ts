import { hashPassword } from "../../helper";
import { Role } from "../model/roles";
import { User } from "../model/user";

export const seedUsers = async () => {
  const superAdminRole = await Role.findOne({ roleName: 'superadmin' });
  const adminRole = await Role.findOne({ roleName: 'admin' });
  const financeRole = await Role.findOne({ roleName: 'finance' });
  const stockRole = await Role.findOne({ roleName: 'stock' });

  if (!superAdminRole || !adminRole || !financeRole || !stockRole) {
    throw new Error('Some roles not found. Please seed roles first.');
  }

  const users = [
    {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'genesistechnologies2024@gmail.com',
      password: await hashPassword('superadmin123'),
      role: superAdminRole._id,
      isActive: true,
      profilePicture: 'https://via.placeholder.com/150',
      gender: 'male',
      birthDate: '1990-01-01',
      address: 'Kigali, Rwanda',
      phoneNumber: '0780000000',
      iDNumber: '1199000000000000',
    },
    {
      firstName: 'System',
      lastName: 'Admin',
      email: 'admin@mis.com',
      password: await hashPassword('admin123'),
      role: adminRole._id,
      isActive: true,
      profilePicture: 'https://via.placeholder.com/150',
      gender: 'male',
      birthDate: '1992-01-01',
      address: 'Kigali, Rwanda',
      phoneNumber: '0780000001',
      iDNumber: '1199200000000000',
    },
    {
      firstName: 'Finance',
      lastName: 'Manager',
      email: 'finance@mis.com',
      password: await hashPassword('finance123'),
      role: financeRole._id,
      isActive: true,
      profilePicture: 'https://via.placeholder.com/150',
      gender: 'female',
      birthDate: '1993-01-01',
      address: 'Kigali, Rwanda',
      phoneNumber: '0780000002',
      iDNumber: '1199300000000000',
    },
    {
      firstName: 'Stock',
      lastName: 'Manager',
      email: 'stock@mis.com',
      password: await hashPassword('stock123'),
      role: stockRole._id,
      isActive: true,
      profilePicture: 'https://via.placeholder.com/150',
      gender: 'male',
      birthDate: '1994-01-01',
      address: 'Kigali, Rwanda',
      phoneNumber: '0780000003',
      iDNumber: '1199400000000000',
    }
  ];

  for (const user of users) {
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      continue;
    }
    const newUser = new User(user);
    await User.create(newUser);
    console.log(`User ${user.email} seeded`);
  }
};
