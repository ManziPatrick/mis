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