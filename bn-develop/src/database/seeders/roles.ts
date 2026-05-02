// src/database/seeders/roles.ts
import { Role } from '../model/roles';

export const seedRoles = async () => {
  const roles = await Role.find();
//  if (roles.length > 0) return;

  const newRoles = [
    { roleName: 'superadmin', description: 'Superadmin role' },
    { roleName: 'admin', description: 'Admin role' },
    { roleName: 'finance', description: 'Finance role' },
    { roleName: 'procurement', description: 'Procurement role' },
    { roleName: 'stock', description: 'Stock role' },
    { roleName: 'librarian', description: 'Librarian role' },
    { roleName: 'hr', description: 'HR role' },
    { roleName: 'headteacher', description: 'Head Teacher role' },
    { roleName: 'dht', description: 'DHT / Head of Dept role' },
    { roleName: 'logistics', description: 'Logistics role' },
    { roleName: 'md', description: 'Managing Director role' },
    { roleName: 'teacher', description: 'Teacher role' },
    { roleName: 'workshopassistant', description: 'Workshop Assistant role' },
  ];

  for (const role of newRoles) {
    const existingRole = await Role.findOne({ roleName: role.roleName });
    if (existingRole) {
      continue;
    }
    const newRole = new Role(role);
    await Role.create(newRole);
  }
};