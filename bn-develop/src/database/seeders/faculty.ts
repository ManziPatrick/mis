import { Faculty } from '../model/faculty';

export const seedFaculty = async () => {
  const faculties = [
    { name: 'Software Engineering', description: 'Department of software development and engineering' },
    { name: 'Hospitality Management', description: 'Department of tourism and hotel management' },
    { name: 'Business Administration', description: 'Department of business and finance' },
  ];

  for (const fac of faculties) {
    const existing = await Faculty.findOne({ name: fac.name });
    if (!existing) {
      await Faculty.create(fac);
      console.log(`Faculty ${fac.name} seeded`);
    }
  }
};
