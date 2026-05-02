import { Assets } from "../model/assets";
import { Category } from "../model/category";
import { Stock } from "../model/stock";
import { Supplier } from "../model/supplier";

export const seedStock = async () => {
  const electronics = await Category.findOne({ name: 'Electronics' });
  const clothing = await Category.findOne({ name: 'Clothing' });
  const stationery = await Category.findOne({ name: 'Stationery' });
  
  const supplier = await Supplier.findOne();

  if (!electronics || !clothing || !supplier) {
    throw new Error('Categories or Suppliers not found. Please seed categories and suppliers first.');
  }

  // Seed Assets (Fixed Assets)
  const assetsData = [
    {
      item: "Laptop",
      purchaseDate: new Date(),
      category: electronics._id,
      description: "High-performance laptop",
      location: "Warehouse A",
      totalNumber: 10,
      totalNumberInGoodCondition: 10,
      totalNumberInCriticalCondition: 0,
      values: 1000,
      totalValues: 10000,
    },
    {
      item: "Office Chair",
      purchaseDate: new Date(),
      category: electronics._id, // Just as example
      description: "Ergonomic chair",
      location: "Warehouse B",
      totalNumber: 20,
      totalNumberInGoodCondition: 20,
      totalNumberInCriticalCondition: 0,
      values: 200,
      totalValues: 4000,
    },
  ];

  for (const item of assetsData) {
    if (await Assets.findOne({ item: item.item })) {
      continue;
    }
    await Assets.create(item);
    console.log(`Asset ${item.item} seeded`);
  }

  // Seed Consumable Stock
  const stockData = [
    {
      item: "Printing Paper",
      category: stationery?._id || electronics._id,
      description: "A4 White Paper",
      unity: "Box",
      unityPrice: 50,
      quantity: 100,
      totalPrice: 5000,
      minimumThreshold: 10,
      supplierId: supplier._id,
      proofOfDelivery: "pod-123.pdf"
    },
    {
      item: "Pen",
      category: stationery?._id || electronics._id,
      description: "Blue Ballpoint Pen",
      unity: "Pack",
      unityPrice: 10,
      quantity: 50,
      totalPrice: 500,
      minimumThreshold: 5,
      supplierId: supplier._id,
      proofOfDelivery: "pod-456.pdf"
    }
  ];

  for (const item of stockData) {
    if (await Stock.findOne({ item: item.item })) {
      continue;
    }
    await Stock.create(item);
    console.log(`Stock item ${item.item} seeded`);
  }
};