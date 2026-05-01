import { Supplier } from '../model/supplier';

export const seedSuppliers = async () => {
  const suppliers = [
    { 
      name: 'Vision Tech Ltd', 
      tin: '123456789', 
      phone: '0780000100', 
      email: 'info@visiontech.com', 
      commodity: 'Electronics', 
      address: 'Kigali, Rwanda',
      status: 'approved'
    },
    { 
      name: 'Modern Office Supplies', 
      tin: '987654321', 
      phone: '0780000101', 
      email: 'sales@modernoffice.com', 
      commodity: 'Stationery', 
      address: 'Kigali, Rwanda',
      status: 'approved'
    }
  ];

  for (const sup of suppliers) {
    const existing = await Supplier.findOne({ tin: sup.tin });
    if (!existing) {
      await Supplier.create(sup);
      console.log(`Supplier ${sup.name} seeded`);
    }
  }
};
