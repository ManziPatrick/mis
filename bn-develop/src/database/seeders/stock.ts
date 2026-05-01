// src/database/seeders/stock.ts
import { Assets } from "../model/assets";
import { Category } from "../model/category";

export const seedStock = async () => {
  const electronics = await Category.findOne({ name: 'Electronics' });
  const clothing = await Category.findOne({ name: 'Clothing' });

  if (!electronics || !clothing) {
    throw new Error('Categories not found. Please seed categories first.');
  }

  const stock = [
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
      item: "Uniform",
      purchaseDate: new Date(),
      category: clothing._id,
      description: "High-performance uniform",
      location: "Warehouse A",
      totalNumber: 10,
      totalNumberInGoodCondition: 10,
      totalNumberInCriticalCondition: 0,
      values: 1000,
      totalValues: 10000,
    },
  ];

  for (const item of stock) {
    if (await Assets.findOne({ item: item.item })) {
      continue;
    }
    await Assets.create(item);
    console.log(`Stock item ${item.item} seeded`);
  }
};