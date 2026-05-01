// src/modules/stock/repository/stockRepositories.ts

import { Assets } from "../../../database/model/assets";
import { IAssets, IFaculty, IStock, ISupply } from "../../../utils/types";
import { Category } from "../../../database/model/category";
import { Stock } from "../../../database/model/stock";
import { Transaction } from "../../../database/model/transaction";
import { UniformPayment } from "../../../database/model/uniform";
import { Uniform } from "../../../database/model/uniformStock";
import { Supply } from "../../../database/model/supply";
import { Faculty } from "../../../database/model/faculty";

export const getStock = async () => {
  return await Stock.find()
    .sort({ createdAt: -1 })
    .populate([
      {
        path: "supplierId",
        select:
          "-__v -status -_id -address -phone -email -description -tin -contract -category",
      },
      { path: "category" },
    ]);
};

export const getStockById = async (id: string) => {
  return (await Stock.findById({ _id: id }).select("-__v")).populate({
    path: "category",
    select: "-__v",
  });
};

export const findLowStockItems = async () => {
  const lowStockItems = await Stock.find({
    $expr: { $lte: ["$quantity", "$minimumThreshold"] },
  });

  const lowUniforStockItems = await Uniform.find({
    $expr: { $lte: ["$quantity", "$minimumThreshold"] },
  });

  return [...lowStockItems, ...lowUniforStockItems];
};

export const updateStock = async (id: string, updateData: Partial<IStock>) => {
  // Remove quantity from updateData if present
  const { quantity, ...dataToUpdate } = updateData;

  return await Stock.findByIdAndUpdate({ _id: id }, dataToUpdate, {
    new: true,
  }).select("-__v");
};

export const updateStockQuantity = async (id: string, updateDate: Partial<IStock>) => {
  return await Stock.findByIdAndUpdate(
    { _id: id },
    { $inc: updateDate },
    { new: true }
  ).select("-__v");
};

export const createSupply = async (supplies: Partial<ISupply>) => {
  return (await Supply.create(supplies)).populate({
    path: "supplierId",
    select: "-__v",
  });
};

export const getSupplies = async () => {
  return await Supply.find()
    .populate({
      path: "supplierId",
      select: "-__v",
    })
    .sort({ createdAt: -1 });
};

export const getSupplyById = async (id: string) => {
  return (await Supply.findById({ _id: id })).populate({
    path: "supplierId",
    select: "-__v",
  });
};

export const getSupplySupplierId = async (supplierId: string) => {
  return await Supply.find({ supplierId: supplierId }).populate({
    path: "supplierId",
    select: "-__v",
  });
};

export const deleteStock = async (id: string) => {
  return await Stock.findByIdAndDelete({ _id: id }).select("-__v");
};

export const getStockByItem = async (item: string) => {
  return await Stock.findOne({ item: item }).select("-__v");
};

// export const getUniformByItem = async (item: string) => {
//   return await U
// }

export const createReceivedStock = async (receivedStock: Partial<IStock>) => {
  const newReceivedStock = await Stock.create(receivedStock);
  return newReceivedStock
    .depopulate("__v")
    .populate([{ path: "supplierId" }, { path: "category" }]);
};

export const getStockByItemAndCategory = async (item: string, category: string) =>{
  try {
    const stock = await Stock.findOne({ item, category });
    return stock;
  } catch (error) {
    console.error("Error fetching stock by item and category:", error);
    throw new Error("Error fetching stock by item and category");
  }
}

export const createAssets = async (assets: IAssets) => {
  return await Assets.create(assets);
};

export const getAssets = async () => {
  return await Assets.find()
    .select("-__v")
    .populate({ path: "category" })
    .sort({ createdAt: -1 });
};

export const getAssetsById = async (id: string) => {
  return await Assets.findById({ _id: id }).select("-__v");
};

export const getAssetsByCategory = async (category: string) => {
  return await Assets.findOne({ category: category }).select("-__v");
};

export const updateAssets = async (id: string, assets: IAssets) => {
  return await Assets.findByIdAndUpdate({ _id: id }, assets, {
    new: true,
  }).select("-__v");
};

export const deleteAssets = async (id: string) => {
  return await Assets.findByIdAndDelete({ _id: id }).select("-__v");
};

export const createCategory = async ({
  name,
  description,
}: {
  name: string;
  description: string;
}) => {
  return await Category.create({
    name,
    description,
  });
};

export const getCategoryByName = async (name: string) => {
  return await Category.findOne({ name });
};

export const getCategory = async () => {
  return await Category.find().select("-__v");
};

export const getCategoryById = async (id: string) => {
  return await Category.findById({ _id: id }).select("-__v");
};

export const getAssetsByItem = async (item: string) => {
  return await Assets.findOne({ item: item }).select("-__v");
};

export const getReceivedStock = async () => {
  return await Stock.find().select("-__v").populate({
    path: "supplierId",
    select: "-__v",
  });
};

export const getReceivedStockBySupplier = async (supplierId: string) => {
  return await Stock.findOne({ supplierId }).select("-__v");
};

export const getRemainingQuantity = async (item: string) => {
  return await Stock.findOne({ item: item }).select("-__v");
};

export const getTransactionsByStockId = async (stockId: string) => {
  return await Transaction.find({ stockId }).sort({ date: -1 }).populate({
    path: "stockId",
    select: "-__v",
  });
};

export const getAllTransactions = async () => {
  return await Transaction.find().sort({ date: -1 }).populate({
    path: "stockId",
    select: "-__v",
  });
};

export const approveUniformPayment = async (
  id: string,
  userId: string,
  approval: boolean
) => {
  return await UniformPayment.findByIdAndUpdate(
    { _id: id },
    { paymentStatus: approval ? "approved" : "rejected", approvedBy: userId },
    { new: true }
  ).populate({
    path: "approvedBy",
    select:
      "-__v -role -_id -password -isActive -createdAt -updatedAt -dataOfJoining",
  });
};

export const createFacultyUniform = async (faculty: Partial<IFaculty>) => {
  return await Faculty.create(faculty);
};

export const getFacultyUniform = async () => {
  return await Faculty.find().select("-__v");
};

export const getFacultyUniformById = async (id: string) => {
  return await Faculty.findById({ _id: id }).select("-__v");
};

export const getUnpaidSuppliesBySupplierId = async (supplierId: string) => {
  return await Supply.find({
    supplierId: supplierId,
    status: { $in: ["Unpaid", "advance-payment"] },
  })
    .populate({
      path: "supplierId",
      select: "-__v",
    })
    .sort({ createdAt: -1 });
};
