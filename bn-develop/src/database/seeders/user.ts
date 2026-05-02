import { hashPassword } from "../../helper";
import { Role } from "../model/roles";
import { User } from "../model/user";

export const seedUsers = async () => {
  const superAdminRole = await Role.findOne({ roleName: 'superadmin' });
  const adminRole = await Role.findOne({ roleName: 'admin' });
  const financeRole = await Role.findOne({ roleName: 'finance' });
  const stockRole = await Role.findOne({ roleName: 'stock' });
  const hrRole = await Role.findOne({ roleName: 'hr' });
  const procurementRole = await Role.findOne({ roleName: 'procurement' });
  const librarianRole = await Role.findOne({ roleName: 'librarian' });
  const headteacherRole = await Role.findOne({ roleName: 'headteacher' });
  const dhtRole = await Role.findOne({ roleName: 'dht' });
  const logisticsRole = await Role.findOne({ roleName: 'logistics' });
  const mdRole = await Role.findOne({ roleName: 'md' });
  const teacherRole = await Role.findOne({ roleName: 'teacher' });
  const workshopAssistantRole = await Role.findOne({ roleName: 'workshopassistant' });

  if (!superAdminRole || !adminRole || !financeRole || !stockRole || !hrRole || !procurementRole || !librarianRole || !headteacherRole || !dhtRole || !logisticsRole || !mdRole || !teacherRole || !workshopAssistantRole) {
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
    },
    {
      firstName: 'HR',
      lastName: 'Manager',
      email: 'hr@mis.com',
      password: await hashPassword('hr123'),
      role: hrRole._id,
      isActive: true,
      profilePicture: 'https://via.placeholder.com/150',
      gender: 'female',
      birthDate: '1995-01-01',
      address: 'Kigali, Rwanda',
      phoneNumber: '0780000004',
      iDNumber: '1199500000000000',
    },
    {
      firstName: 'Procurement',
      lastName: 'Officer',
      email: 'procurement@mis.com',
      password: await hashPassword('procurement123'),
      role: procurementRole._id,
      isActive: true,
      profilePicture: 'https://via.placeholder.com/150',
      gender: 'male',
      birthDate: '1996-01-01',
      address: 'Kigali, Rwanda',
      phoneNumber: '0780000005',
      iDNumber: '1199600000000000',
    },
    {
      firstName: 'Library',
      lastName: 'Librarian',
      email: 'librarian@mis.com',
      password: await hashPassword('librarian123'),
      role: librarianRole._id,
      isActive: true,
      profilePicture: 'https://via.placeholder.com/150',
      gender: 'female',
      birthDate: '1997-01-01',
      address: 'Kigali, Rwanda',
      phoneNumber: '0780000006',
      iDNumber: '1199700000000000',
    },
    {
      firstName: 'Head',
      lastName: 'Teacher',
      email: 'headteacher@mis.com',
      password: await hashPassword('headteacher123'),
      role: headteacherRole._id,
      isActive: true,
      profilePicture: 'https://via.placeholder.com/150',
      gender: 'male',
      birthDate: '1980-01-01',
      address: 'Kigali, Rwanda',
      phoneNumber: '0780000007',
      iDNumber: '1198000000000000',
    },
    {
      firstName: 'DHT',
      lastName: 'Academics',
      email: 'dht@mis.com',
      password: await hashPassword('dht123'),
      role: dhtRole._id,
      isActive: true,
      profilePicture: 'https://via.placeholder.com/150',
      gender: 'female',
      birthDate: '1985-01-01',
      address: 'Kigali, Rwanda',
      phoneNumber: '0780000008',
      iDNumber: '1198500000000000',
    },
    {
      firstName: 'Logistics',
      lastName: 'Officer',
      email: 'logistics@mis.com',
      password: await hashPassword('logistics123'),
      role: logisticsRole._id,
      isActive: true,
      profilePicture: 'https://via.placeholder.com/150',
      gender: 'male',
      birthDate: '1990-01-01',
      address: 'Kigali, Rwanda',
      phoneNumber: '0780000009',
      iDNumber: '1199000000000001',
    },
    {
      firstName: 'Managing',
      lastName: 'Director',
      email: 'md@mis.com',
      password: await hashPassword('md123'),
      role: mdRole._id,
      isActive: true,
      profilePicture: 'https://via.placeholder.com/150',
      gender: 'male',
      birthDate: '1975-01-01',
      address: 'Kigali, Rwanda',
      phoneNumber: '0780000010',
      iDNumber: '1197500000000000',
    },
    {
      firstName: 'Senior',
      lastName: 'Teacher',
      email: 'teacher@mis.com',
      password: await hashPassword('teacher123'),
      role: teacherRole._id,
      isActive: true,
      profilePicture: 'https://via.placeholder.com/150',
      gender: 'female',
      birthDate: '1992-01-01',
      address: 'Kigali, Rwanda',
      phoneNumber: '0780000011',
      iDNumber: '1199200000000001',
    },
    {
      firstName: 'Workshop',
      lastName: 'Assistant',
      email: 'workshop@mis.com',
      password: await hashPassword('workshop123'),
      role: workshopAssistantRole._id,
      isActive: true,
      profilePicture: 'https://via.placeholder.com/150',
      gender: 'male',
      birthDate: '1996-01-01',
      address: 'Kigali, Rwanda',
      phoneNumber: '0780000012',
      iDNumber: '1199600000000001',
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
