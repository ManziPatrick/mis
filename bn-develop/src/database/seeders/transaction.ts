// src/database/seeders/transaction.ts
import { Transaction } from "../model/transaction";
import { Stock } from "../model/stock";

export const seedTransactions = async () => {
  const stockItems = await Stock.find();

  if (stockItems.length === 0) {
    throw new Error('Stock items not found. Please seed stock first.');
  }

  const transactions = [];

  for (const stock of stockItems) {
    // Initial Stock In
    transactions.push({
      stockId: stock._id,
      transactionType: "IN",
      quantity: stock.quantity,
      pricePerItem: stock.unityPrice,
      totalPrice: stock.quantity * stock.unityPrice,
      previousQuantity: 0,
      newQuantity: stock.quantity,
      transactionSource: "general stock",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    });

    // Some Stock Out
    const outQty = Math.floor(stock.quantity * 0.2);
    transactions.push({
      stockId: stock._id,
      transactionType: "OUT",
      quantity: outQty,
      pricePerItem: stock.unityPrice,
      totalPrice: outQty * stock.unityPrice,
      previousQuantity: stock.quantity,
      newQuantity: stock.quantity - outQty,
      takenBy: "Staff Member",
      transactionSource: "general stock",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    });
  }

  // Seed Uniform Transactions
  const uniformStock = await Stock.findOne({ item: "Uniform" }); // Try to find an asset called uniform if it exists
  const uniforms = await Stock.find({ item: /Uniform/i });

  // Add uniform stock out transactions
  const uniformPayments = await Stock.find(); // Placeholder, I'll use hardcoded for now to avoid complexity if models differ
  
  // Actually, I'll just add some hardcoded uniform transactions to show them in the dashboard
  const uniformTxs = [
    {
      stockId: stockItems[0]._id, // Use first stock as fallback
      transactionType: "OUT",
      quantity: 1,
      pricePerItem: 25000,
      totalPrice: 25000,
      previousQuantity: 100,
      newQuantity: 99,
      takenBy: "John Smith (STU001)",
      transactionSource: "full uniform",
      date: new Date()
    },
    {
      stockId: stockItems[1]._id,
      transactionType: "OUT",
      quantity: 2,
      pricePerItem: 5000,
      totalPrice: 10000,
      previousQuantity: 50,
      newQuantity: 48,
      takenBy: "Alice Brown (STU002)",
      transactionSource: "partial uniform",
      date: new Date()
    }
  ];

  for (const tx of [...transactions, ...uniformTxs]) {
    const existingTx = await Transaction.findOne({ 
      stockId: tx.stockId, 
      transactionType: tx.transactionType,
      date: tx.date,
      takenBy: tx.takenBy
    });
    if (existingTx) {
      continue;
    }
    await Transaction.create(tx);
    console.log(`Transaction ${tx.transactionType} (${tx.transactionSource}) seeded`);
  }
};
