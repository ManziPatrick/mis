// src/database/seeders/category.ts
import { Category } from '../model/category';

export const seedCategory = async () => {
  const categories = [
    { name: 'Electronics', description: 'Electronic devices and gadgets' },
    { name: 'Clothing', description: 'Apparel and uniforms' },
    { name: 'Furniture', description: 'Office furniture' },
  ];

  for (const cat of categories) {
    const existing = await Category.findOne({ name: cat.name });
    if (!existing) {
      await Category.create(cat);
      console.log(`Category ${cat.name} seeded`);
    }
  }
};
