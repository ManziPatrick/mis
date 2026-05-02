// src/database/seeders/uniform.ts
import { Uniform } from "../model/uniformStock";
import { UniformPayment } from "../model/uniform";
import { Category } from "../model/category";
import { Supplier } from "../model/supplier";

export const seedUniform = async () => {
  const clothing = await Category.findOne({ name: 'Clothing' });
  const supplier = await Supplier.findOne();

  if (!clothing || !supplier) {
    console.log('Category "Clothing" or Supplier not found. Skipping uniform seeding.');
    return;
  }

  // Seed Uniform Stock
  const uniformStocks = [
    {
      item: 'full uniform',
      category: clothing._id,
      description: 'Complete student uniform set',
      supplierId: supplier._id,
      proofOfDelivery: 'pod-uniform-1.pdf',
      fullUniformPrice: 25000,
      itemPrices: [
        { itemName: 'Shirt', price: 5000, quantity: 100 },
        { itemName: 'Trousers', price: 8000, quantity: 100 },
        { itemName: 'Tie', price: 2000, quantity: 100 },
        { itemName: 'Sweater', price: 10000, quantity: 100 }
      ],
      quantity: 400
    },
    {
      item: 'partial uniform',
      category: clothing._id,
      description: 'Individual uniform items',
      supplierId: supplier._id,
      proofOfDelivery: 'pod-uniform-2.pdf',
      itemPrices: [
        { itemName: 'T-Shirt', price: 6000, quantity: 50 },
        { itemName: 'Skirt', price: 7000, quantity: 50 }
      ],
      quantity: 100
    }
  ];

  for (const stock of uniformStocks) {
    const existing = await Uniform.findOne({ description: stock.description });
    if (!existing) {
      await Uniform.create(stock);
      console.log(`Uniform stock ${stock.item} seeded`);
    }
  }

  // Seed Uniform Payments (Stock Out requests)
  const payments = [
    {
      studentId: 'STU001',
      name: 'John Smith',
      faculty: 'Computing',
      level: 'L1',
      fullUniform: true,
      numberOfFullUniforms: 1,
      amountPaid: 25000,
      modeOfPayment: 'Bank',
      proofOfPaymentUrl: 'pop-1.jpg',
      status: 'approved',
      paymentStatus: 'approved'
    },
    {
      studentId: 'STU002',
      name: 'Alice Brown',
      faculty: 'Engineering',
      level: 'L2',
      fullUniform: false,
      uniformType: [
        { itemName: 'Shirt', quantity: 2 },
        { itemName: 'Tie', quantity: 1 }
      ],
      amountPaid: 12000,
      modeOfPayment: 'Petty Cash',
      proofOfPaymentUrl: 'pop-2.jpg',
      status: 'approved',
      paymentStatus: 'approved'
    }
  ];

  for (const pay of payments) {
    const existing = await UniformPayment.findOne({ studentId: pay.studentId });
    if (!existing) {
      await UniformPayment.create(pay);
      console.log(`Uniform payment for ${pay.name} seeded`);
    }
  }
};
