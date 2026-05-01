import { Employee } from '../model/employee';

export const seedEmployees = async () => {
  const employees = [
    {
      name: 'John Doe',
      email: 'john.doe@mis.com',
      phone: '0780000200',
      department: 'Academic',
      occupation: 'Teacher',
      type: 'staff',
      nationality: 'rwandan',
      nationalId: '1199012345678901',
      nationalIdPdf: 'http://example.com/id.pdf',
      dateOfJoining: new Date(),
      contractPdf: 'http://example.com/contract.pdf',
      netSalary: 500000,
      status: 'approved',
      transportAllowence: 50000
    },
    {
      name: 'Sarah Smith',
      email: 'sarah.smith@mis.com',
      phone: '0780000201',
      department: 'Finance',
      occupation: 'Accountant',
      type: 'staff',
      nationality: 'foreigner',
      visaPdf: 'http://example.com/visa.pdf',
      passportPdf: 'http://example.com/passport.pdf',
      dateOfJoining: new Date(),
      contractPdf: 'http://example.com/contract2.pdf',
      netSalary: 600000,
      status: 'approved',
      transportAllowence: 50000
    }
  ];

  for (const emp of employees) {
    const existing = await Employee.findOne({ email: emp.email });
    if (!existing) {
      await Employee.create(emp);
      console.log(`Employee ${emp.name} seeded`);
    }
  }
};
