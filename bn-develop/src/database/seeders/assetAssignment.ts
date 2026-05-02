import { AssetAssignment } from "../model/assetAssignment";
import { Assets } from "../model/assets";
import { Transaction } from "../model/transaction";

export const seedAssetAssignment = async () => {
  const assets = await Assets.find();
  if (assets.length === 0) {
    console.log("No assets found for assignment seeding.");
    return;
  }

  const students = ["STU001", "STU002", "STU003", "STU004", "STU005"];

  for (let i = 0; i < 10; i++) {
    const asset = assets[Math.floor(Math.random() * assets.length)];
    const studentId = students[Math.floor(Math.random() * students.length)];
    const isReturned = Math.random() > 0.5;

    const assignedDate = new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000);

    const assignment = await AssetAssignment.create({
      assetId: asset._id,
      studentId,
      assignedDate,
      status: isReturned ? "returned" : "assigned",
      conditionOnAssignment: "Good",
      conditionOnReturn: isReturned ? "Good" : undefined,
      returnDate: isReturned ? new Date(assignedDate.getTime() + 30 * 24 * 60 * 60 * 1000) : undefined
    });

    // Log OUT transaction
    await Transaction.create({
      assetId: asset._id,
      transactionType: "OUT",
      quantity: 1,
      previousQuantity: asset.totalNumber,
      newQuantity: asset.totalNumber - 1,
      takenBy: studentId,
      transactionSource: "asset assignment",
      date: assignedDate
    });

    if (isReturned) {
      // Log IN transaction
      await Transaction.create({
        assetId: asset._id,
        transactionType: "IN",
        quantity: 1,
        previousQuantity: asset.totalNumber - 1,
        newQuantity: asset.totalNumber,
        takenBy: studentId,
        transactionSource: "asset assignment",
        date: assignment.returnDate
      });
    } else {
        // Update asset quantity
        asset.totalNumber -= 1;
        asset.totalNumberInGoodCondition -= 1;
        await asset.save();
    }
  }
  console.log("Asset assignments seeded");
};
