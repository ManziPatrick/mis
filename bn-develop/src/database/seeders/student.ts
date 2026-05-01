import { Student } from '../model/students';

export const seedStudents = async () => {
  const students = [
    { name: 'Alice Mutoni', studentId: 'STU001', faculty: 'Software Engineering' },
    { name: 'Bob Mugisha', studentId: 'STU002', faculty: 'Business Administration' },
    { name: 'Charlie Keza', studentId: 'STU003', faculty: 'Hospitality Management' },
    { name: 'Diana Uwase', studentId: 'STU004', faculty: 'Software Engineering' },
  ];

  for (const stu of students) {
    const existing = await Student.findOne({ studentId: stu.studentId });
    if (!existing) {
      await Student.create(stu);
      console.log(`Student ${stu.name} seeded`);
    }
  }
};
