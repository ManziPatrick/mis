import { Category } from "./../../../database/model/category";
// src/modules/stock/controller/stockController.ts

import { Request, Response } from "express";
//import {stemmer} from 'stemmer';
import { PorterStemmer } from "natural";

import {
  approveUniformPayment,
  createAssets,
  createCategory,
  createReceivedStock,
  deleteAssets,
  deleteStock,
  getAllTransactions,
  getAssets,
  getAssetsById,
  getCategory,
  getReceivedStock,
  getStock,
  getStockById,
  getStockByItem,
  getTransactionsByStockId,
  updateAssets,
  updateStock,
  getCategoryById,
  createSupply,
  getSupplies,
  getSupplyById,
  getSupplySupplierId,
  getUnpaidSuppliesBySupplierId,
  createFacultyUniform,
  getFacultyUniform,
  getFacultyUniformById,
  getStockByItemAndCategory,
  updateStockQuantity,
} from "../repository/stockRepositories";
import { Transaction } from "../../../database/model/transaction";
import { uploadFile } from "../../../utils";
import { IRequestUser, IStock } from "../../../utils/types";
import { Stock } from "../../../database/model/stock";
import { Uniform } from "../../../database/model/uniformStock";
import { AssetAssignment } from "../../../database/model/assetAssignment";

import {
  getUniformPayment,
  getUniformPaymentById,
} from "../../finance/repository/financeRepository";
import { getCategoryByName } from "../repository/stockRepositories";
import { getSupplierById } from "../../procurement/repositories/procurementRepositories";
import { PendingUpdate } from "../../../database/model/pendingRequest";

export const getStockController = async (req: Request, res: Response) => {
  try {
    const stock = await getStock();
    if (!stock.length) {
      res.status(404).json({ message: "No stock items found" });
      return;
    }
    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStockByIdController = async (req: Request, res: Response) => {
  try {
    const { stockId } = req.params;
    const stock = await getStockById(stockId as string);
    if (!stock) {
      res.status(404).json({ message: "Stock item not found" });
      return;
    }
    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCategoryController = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    // Normalize the name
    const normalizedItemName = PorterStemmer.stem(name.toLowerCase());

    // Check for existing categories with similar names
    const existingCategories = await getCategory();
    const similarCategories = existingCategories.filter(category => 
      PorterStemmer.stem(category.name.toLowerCase()) === normalizedItemName
    );

    if (similarCategories.length > 0) {
      res.status(400).json({
        message: `Similar category names found: ${similarCategories.map(cat => cat.name).join(", ")}.`,
      });
      return;
    }

    // Create the category
    const category = await createCategory({ name, description });
    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    console.error("Error creating category:", error.stack);
    res.status(500).json({ error: error.message });
  }
};

export const getCategoryController = async (req: Request, res: Response) => {
  try {
    const category = await getCategory();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createAssetsController = async (req: Request, res: Response) => {
  try {
    const {
      item,
      purchaseDate,
      category,
      description,
      location,
      totalNumber,
      totalNumberInGoodCondition,
      totalNumberInCriticalCondition,
      values,
      criticalCondition,
    } = req.body;

    let imageUrl: string | undefined;
    if (req.file) {
      const uploaded = await uploadFile(req.file);
      imageUrl = uploaded.file.url;
    }
    // check if the category exist
    const categoryExist = await getCategoryById(category as string);
    if (!categoryExist) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    if (
      totalNumber !==
      totalNumberInGoodCondition + totalNumberInCriticalCondition
    ) {
      res
        .status(400)
        .json({
          message:
            "Total number must be equal to the sum of total number in good condition and total number in critical condition",
        });
      return;
    }
    if (
      !totalNumber &&
      !totalNumberInGoodCondition &&
      !totalNumberInCriticalCondition
    ) {
      res
        .status(400)
        .json({
          message:
            "Total number, total number in good condition and total number in critical condition are required",
        });
      return;
    }

    if (!purchaseDate || !values || !item || !description || !location) {
      res
        .status(400)
        .json({
          message:
            "Item, purchase date, values, description and location are required",
        });
      return;
    }

    if (totalNumberInCriticalCondition > 0 && !criticalCondition) {
      res
        .status(400)
        .json({
          message: "Critical condition must be specified when total number in critical condition is greater than 0",
        });
      return;
    }
    // calculate the total values
    const totalValues = totalNumber * values;
    const assets = await createAssets({
      item,
      purchaseDate,
      category,
      description,
      location,
      totalNumber,
      totalNumberInGoodCondition,
      totalNumberInCriticalCondition,
      values,
      totalValues,
      criticalCondition,
      imageUrl
    } as any);
    res.status(201).json({
      message: "Assets created successfully",
      assets,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAssetsController = async (req: Request, res: Response) => {
  try {
    const assets = await getAssets();
    // calculate the total assets values
    const totalAssetsValues = assets.reduce(
      (acc, asset) => acc + asset.totalValues,
      0
    );
    res.status(200).json({ assets, totalAssetsValues });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAssetsByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const assets = await getAssetsById(id as string);
    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAssetsController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (req.file) {
      const uploaded = await uploadFile(req.file);
      updateData.imageUrl = uploaded.file.url;
    }
    const assets = await updateAssets(id as string, updateData);
    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAssetsController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteAssets(id as string);
    res.status(200).json({ message: "Assets deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStockController = async (req: Request, res: Response) => {
  try {
    const { stockId } = req.params;
    const { proofOfDelivery, ...updateData } = req.body;

    // Handle file upload for proof of delivery
    if (req.file) {
      const proof = await uploadFile(req.file);
      updateData.proofOfDelivery = proof.file.url;
    }

    const stock = await updateStock(stockId as string, updateData);
    res.status(200).json(stock);
  } catch (error) {
    console.error("Error updating stock:", error.stack);
    res.status(500).json({ error: error.message });
  }
};

export const deleteStockController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteStock(id as string);
    res.status(200).json({ message: "Stock deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createStockController = async (req: Request, res: Response) => {
  try {
    const {
      item,
      category,
      description,
      quantity,
      supplierId,
      date,
      unityPrice,
      unity,
    } = req.body;

    // Validate required fields
    if (!item || !quantity || !supplierId || !unityPrice || !category) {
       res.status(400).json({
        message: "Item, quantity, supplierId, unityPrice, and category are required",
      });
      return;
    }

    // Validate quantity and unityPrice
    if (isNaN(quantity) || isNaN(unityPrice) || quantity <= 0 || unityPrice <= 0) {
       res.status(400).json({
        message: "Quantity and unity price must be positive numbers",
      });
      return;
    }

    // Handle file upload for proof of delivery
    const proof = await uploadFile(req.file);
    if (!proof || !proof.file || !proof.file.url) {
       res.status(500).json({ message: "Failed to upload proof of delivery" });
       return;
    }
    const proofOfDelivery = proof.file.url;

    // Fetch category and supplier in parallel for performance
    const [Category, supplier] = await Promise.all([
      getCategoryById(category),
      getSupplierById(supplierId),
    ]);

    if (!Category) {
       res.status(400).json({ message: "Category not found" });
       return
    }

    if (!supplier) {
       res.status(404).json({ message: "Supplier not found" });
       return;
    }

    if (supplier.status !== "approved") {
       res.status(400).json({
        message: "Supplier is not allowed to supply commodities",
      });
      return
    }

    // Calculate total price
    const totalPrice = quantity * unityPrice;

    // Create supply for the supplier
    const supplies = await createSupply({
      supplierId,
      item,
      quantity,
      deliveryDate: date,
      unitPrice: unityPrice,
      totalCost: totalPrice,
      status: "Unpaid",
    });

    // Check if stock already exists to update quantity
    const existingStock = await getStockByItemAndCategory(item.toLowerCase(), category);
    let previousQuantity = existingStock ? existingStock.quantity : 0;
    const newQuantity = previousQuantity + Number(quantity);

    // Create or update stock entry
    let receivedStock;
    if (existingStock) {
      receivedStock = await Stock.findOneAndUpdate(
        { _id: existingStock._id },
        { 
          $inc: { quantity: Number(quantity) },
          $set: {
            proofOfDelivery,
            unityPrice,
            totalPrice: newQuantity * unityPrice
          }
        },
        { new: true }
      );
    } else {
      receivedStock = await createReceivedStock({
        item: item.toLowerCase(),
        category,
        description,
        quantity,
        supplierId,
        proofOfDelivery,
        date,
        unityPrice,
        unity,
        totalPrice,
      });
    }
    
    if (!receivedStock || !receivedStock._id) {
      res.status(500).json({ message: "Failed to create or retrieve stock." });
      return;
    }

    // Create transaction
    const transaction = new Transaction({
      stockId: receivedStock._id,
      transactionType: "IN",
      quantity,
      pricePerItem: unityPrice,
      totalPrice,
      previousQuantity,
      newQuantity,
      transactionSource: "general stock",
    });

    // Save transaction to DB
    await transaction.save();

    // Respond to client
    res.status(201).json({
      message: "Item added successfully",
      data: {
        receivedStock,
        transaction,
        supplies,
      },
    });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ error: error.message });
  }
};


export const outOfStockController = async (req: Request, res: Response) => {
  try {
    const { quantity, takenBy } = req.body;
    const { stockId } = req.params;

    const stock = await getStockById(stockId as string);
    if (!stock) {
      res.status(404).json({ message: "Stock item not found" });
      return;
    }

    if (stock.quantity < quantity) {
      res.status(400).json({ message: "Insufficient quantity in stock" });
      return;
    }

    // Update the total quantity
    stock.quantity -= quantity;
    await stock.save();

    // Log the transaction
    const transaction = new Transaction({
      stockId: stock._id,
      transactionType: "OUT",
      previousQuantity: stock.quantity + quantity,
      newQuantity: stock.quantity,
      quantity,
      pricePerItem: stock.unityPrice,
      takenBy,
      transactionSource: "general stock",
    });

    await transaction.save();
    if (stock.quantity <= stock.minimumThreshold) {
      console.warn(
        `Low stock alert: ${stock.item} is running low. Remaining quantity: ${stock.quantity}`
      );
    }
    res.status(200).json({
      message: `Action completed: ${quantity} ${stock.item} removed from stock. Remaining stock: ${stock.quantity}.`,
      stock,
      transaction,
    });
  } catch (error) {
    console.error("Error removing stock:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getTransactionsByStock = async (req: Request, res: Response) => {
  try {
    const { stockId } = req.params;

    const transactions = await getTransactionsByStockId(stockId as string);
    if (!transactions.length) {
      res
        .status(404)
        .json({ message: "No transactions found for this stock item" });
      return;
    }

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllTransactionsController = async (
  req: Request,
  res: Response
) => {
  try {
    const transactions = await getAllTransactions();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const approveUniformPaymentController = async (
  req: IRequestUser,
  res: Response
) => {
  try {
    const userId = req.user.id;

    // Approve the uniform payment
    const uniformPayment = await approveUniformPayment(
      req.params.id as string,
      userId,
      req.body.approval
    );

    if (!uniformPayment) {
      res.status(404).json({ message: "Uniform payment not found" });
      return;
    }

    if (uniformPayment.paymentStatus === "approved") {
      const updatedStockRecords = [];

      if (uniformPayment.fullUniform) {
        // Handle full uniform payment
        const fullUniformItems = await Uniform.find({ item: "full uniform" });

        if (!fullUniformItems || fullUniformItems.length === 0) {
          res
            .status(404)
            .json({ message: "Required full uniform components not found" });
          return;
        }

        const numberOfFullUniform = uniformPayment.numberOfFullUniforms;

        for (const item of fullUniformItems) {
          const stockItem = item.itemPrices.find(
            (stockItem) =>
              stockItem.itemName.toLowerCase() === item.item.toLowerCase()
          );

          if (!stockItem) {
            res.status(404).json({
              message: `Item '${item.item}' not found in stock for full uniform`,
            });
            return;
          }

          const requiredQuantity = uniformPayment.uniformType.find(
            (u) => u.itemName === item.item
          )?.quantity;

          if (stockItem.quantity < requiredQuantity * numberOfFullUniform) {
            res.status(400).json({
              message: `Not enough stock for ${item.item}. Required: ${
                requiredQuantity * numberOfFullUniform
              }, Available: ${stockItem.quantity}`,
            });
            return;
          }

          // Deduct the total quantity required for all full uniforms
          stockItem.quantity -= requiredQuantity * numberOfFullUniform;

          // Record the transaction for this item
          const transaction = new Transaction({
            stockId: item._id,
            transactionType: "OUT",
            quantity: requiredQuantity * numberOfFullUniform,
            totalPrice:
              stockItem.price * requiredQuantity * numberOfFullUniform, // Total price
            previousQuantity:
              stockItem.quantity + requiredQuantity * numberOfFullUniform,
            newQuantity: stockItem.quantity,
            takenBy: uniformPayment.name,
            itemPrices: [
              {
                itemName: item.item,
                price: stockItem.price,
                quantity: requiredQuantity * numberOfFullUniform,
              },
            ],
            transactionSource: "full uniform",
          });
          await transaction.save();

          // Save the updated stock
          await item.save();

          // Add the updated stock to the response list
          updatedStockRecords.push(item);
        }
      } else {
        // Handle partial uniform
        for (const item of uniformPayment.uniformType) {
          const stock = await Uniform.findOne({
            item: "partial uniform",
            "itemPrices.itemName": item.itemName.toLowerCase(),
          });

          if (!stock) {
            res
              .status(404)
              .json({ message: `Stock for '${item.itemName}' not found` });
            return;
          }

          const stockItem = stock.itemPrices.find(
            (stockItem) =>
              stockItem.itemName.toLowerCase() === item.itemName.toLowerCase()
          );

          if (!stockItem) {
            res.status(404).json({
              message: `Item '${item.itemName}' not found in stock '${stock.item}'`,
            });
            return;
          }

          if (stockItem.quantity < item.quantity) {
            res.status(400).json({
              message: `Not enough stock for ${item.itemName}. Required: ${item.quantity}, Available: ${stockItem.quantity}`,
            });
            return;
          }

          // Deduct the quantity
          stockItem.quantity -= item.quantity;

          // Record the transaction
          const transaction = new Transaction({
            stockId: stock._id,
            transactionType: "OUT",
            quantity: item.quantity,
            totalPrice: stockItem.price * item.quantity,
            previousQuantity: stockItem.quantity + item.quantity,
            newQuantity: stockItem.quantity,
            takenBy: uniformPayment.name,
            itemPrices: [
              {
                itemName: item.itemName,
                price: stockItem.price,
                quantity: item.quantity,
              },
            ],
            transactionSource: "partial uniform",
          });
          await transaction.save();

          // Save the updated stock
          await stock.save();

          // Add the updated stock record to the response list
          const updatedStock = await Uniform.findById(stock._id).select(
            "-__v -description -category -supplierId -proofOfDelivery -date"
          );
          updatedStockRecords.push(updatedStock);
        }
      }

      res.status(200).json({
        message:
          "Uniform payment approved, stock updated, and transaction recorded.",
        updatedStockRecords,
      });
    } else {
      res
        .status(400)
        .json({
          message: "Payment must be in 'paid' status to approve stock.",
        });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUniformPaymentController = async (
  req: Request,
  res: Response
) => {
  try {
    const uniformPayment = await getUniformPayment();
    res.status(200).json(uniformPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUniformPaymentByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const uniformPayment = await getUniformPaymentById(id as string);
    if (!uniformPayment) {
      res.status(404).json({ message: "Uniform payment not found" });
      return;
    }
    res.status(200).json(uniformPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategoryByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const category = await getCategoryById(id as string);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const filterStockByCategoryWithPaginationController = async (
  req: Request,
  res: Response
) => {
  try {
    const { categoryId } = req.params;
    const page = parseInt(req.query.page as string) || 1; // Default to page 1
    const limit = parseInt(req.query.limit as string) || 10; // Default to 10 items per page

    // Skip calculation for pagination
    const skip = (page - 1) * limit;

    // Find all stock items that belong to the given category
    const filteredStock = await Stock.find({ category: categoryId })
      .skip(skip)
      .limit(limit);

    if (filteredStock.length === 0) {
      res
        .status(404)
        .json({ message: "No stock items found for this category." });
      return;
    }

    // Get total count for pagination info
    const totalCount = await Stock.countDocuments({ category: categoryId });

    res.status(200).json({
      filteredStock,
      pagination: {
        totalItems: totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Error filtering stock by category with pagination:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const filterStockByCategoryNameController = async (
  req: Request,
  res: Response
) => {
  try {
    const { name } = req.params; // The category name to filter by

    // Find category ObjectId by name
    const category = await getCategoryByName(name as string);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    // Find all stock items that belong to the category
    const filteredStock = await Stock.find({ category: category._id as any });

    if (filteredStock.length === 0) {
      res
        .status(404)
        .json({ message: "No stock items found for this category." });
      return;
    }

    res.status(200).json(filteredStock);
  } catch (error) {
    console.error("Error filtering stock by category name:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const createFacultyController = async (req: Request, res:Response)=>{
  try{
    const {name, description} = req.body;
    const faculty = await createFacultyUniform({name, description});
    res.status(201).json({message: "Faculty created successfully", faculty});
  }catch(error){
    res.status(500).json({error: error.message});
  }
}

export const createUniformController = async (req: Request, res: Response) => {
  try {
    const { item, category, description, supplierId, fullUniformPrice, faculty } = req.body;

    const proof = await uploadFile(req.file);
    if (!proof || !proof.file || !proof.file.url) {
      res.status(500).json({ message: "Failed to upload proof of delivery" });
      return;
    }
    const proofOfDelivery = proof.file.url;

    // Validate input fields
    if (!item || !category || !supplierId || !faculty) {
      res.status(400).json({ message: "item, category, supplierId and faculty are required" });
      return;
    }

    // Normalize item names by stemming them
    const itemNames = Array.isArray(req.body.itemName) ? req.body.itemName : [req.body.itemName];
    const prices = Array.isArray(req.body.itemPrice) ? req.body.itemPrice : [req.body.itemPrice];
    const itemQuantities = Array.isArray(req.body.itemQuantity) ? req.body.itemQuantity : [req.body.itemQuantity];

    const normalizedItemNames = itemNames.map((name: string) => PorterStemmer.stem(name.toLowerCase()));

    // Find duplicates
    const duplicates = normalizedItemNames.reduce((acc, item, index, array) => {
      if (array.indexOf(item) !== index && !acc.includes(item)) {
        acc.push(item);
      }
      return acc;
    }, [] as string[]);

    if (duplicates.length > 0) {
      const duplicateNames = duplicates
        .map((dup) => itemNames.filter((name) => PorterStemmer.stem(name.toLowerCase()) === dup))
        .flat();

      res.status(400).json({
        message: `Duplicate item names found: ${duplicateNames.join(", ")}. Please use distinct names.`,
      });
      return;
    }

    const supplier = await getSupplierById(supplierId);
    if (!supplier) {
      res.status(404).json({ message: "Supplier not found" });
      return;
    }
    if (supplier.status !== "approved") {
      res.status(400).json({ message: "Supplier is not allowed to supply commodity" });
      return;
    }

    if (item === "full uniform" && !fullUniformPrice) {
      res.status(400).json({ message: "Full uniform price is required for full uniforms" });
      return;
    }

    const formattedItemPrices = itemNames.map((itemName: string, index: number) => ({
      itemName: itemName.toLowerCase(),
      price: prices[index],
      quantity: itemQuantities[index],
    }));

    if (item === "partial uniform" && formattedItemPrices.some((item) => item.price <= 0)) {
      res.status(400).json({ message: "All individual item prices must be greater than zero" });
      return;
    }

    if (formattedItemPrices.some((item) => item.quantity <= 0)) {
      res.status(400).json({ message: "Item quantity must be greater than zero" });
      return;
    }

    const facultyExist = await getFacultyUniformById(faculty);
    if (!facultyExist) {
      res.status(404).json({ message: "Faculty not found" });
      return;
    }

    const existingUniform = await Uniform.findOne({
      item: item.toLowerCase(),
      category,
      supplierId,
      faculty,
      "itemPrices.itemName": { $all: itemNames.map((name) => name.toLowerCase()) },
    });

    if (existingUniform) {
      // Add new quantities to existing uniform
      existingUniform.itemPrices.forEach((existingItem, index) => {
        const newItem = formattedItemPrices.find((item) => item.itemName === existingItem.itemName);
        if (newItem) {
          existingItem.quantity += newItem.quantity;
        }
      });

      existingUniform.fullUniformPrice = fullUniformPrice || existingUniform.fullUniformPrice;
      await existingUniform.save();

      res.status(200).json({
        message: "Uniform quantities updated successfully",
        updatedUniform: existingUniform,
      });
      return;
    }

    const receivedUniform = await Uniform.create({
      item: item.toLowerCase(),
      category,
      description,
      supplierId,
      faculty,
      proofOfDelivery,
      fullUniformPrice,
      itemPrices: formattedItemPrices,
    });

    const transaction = new Transaction({
      stockId: receivedUniform._id,
      transactionType: "IN",
      quantity: formattedItemPrices.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice:
        item === "full uniform"
          ? fullUniformPrice * itemQuantities.reduce((sum, quantity) => sum + quantity, 0)
          : formattedItemPrices.reduce((sum, item) => sum + item.price * item.quantity, 0),
      itemPrices: formattedItemPrices.map((item) => ({
        itemName: item.itemName,
        price: item.price,
        quantity: item.quantity,
      })),
      transactionSource: item === "full uniform" ? "full uniform" : "partial uniform",
    });

    await transaction.save();

    res.status(201).json({
      message: "Uniform added successfully",
      receivedUniform,
      transaction,
    });
  } catch (error) {
    console.error("Error adding uniform:", error);
    res.status(500).json({ error: error.message });
  }
};


export const updateUniformsController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Extract uniform ID from request params
    delete req.body.itemName;
    delete req.body.itemPrice;
    delete req.body.itemQuantity;
    const updateData = req.body; // Get update data from request body
    if (!updateData) {
      res.status(400).json({ message: "No update data provided" });
      return;
    }

    // Find the uniform by ID
    const uniform = await Uniform.findById(id);
    if (!uniform) {
      res.status(404).json({ message: "Uniform not found" });
      return;
    }

    // Check if `fullUniform` is being updated
    if (updateData.fullUniform !== undefined) {
      updateData.fullUniformPrice = updateData.fullUniform
        ? updateData.fullUniformPrice
        : undefined; // Ensure `fullUniformPrice` is set only when `fullUniform` is true
    }

    // Apply discount if provided
    if (updateData.discount) {
      updateData.totalPrice =
        updateData.totalPrice -
        (updateData.totalPrice * updateData.discount) / 100;
    }

    // Update the uniform document
    const updatedUniform = await Uniform.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    });

    res
      .status(200)
      .json({ message: "Uniform updated successfully", updatedUniform });
  } catch (error) {
    console.error("Error updating uniform:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export const updateUniformsItemsController = async (
  req: IRequestUser,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { itemName, quantity, price } = req.body;

    if (!itemName || !quantity) {
      res.status(400).json({ message: "itemName and quantity are required" });
      return;
    }

    // Find the uniform by ID
    const uniform = await Uniform.findById(id);
    if (!uniform) {
      res.status(404).json({ message: "Uniform not found" });
      return;
    }

    if (uniform.quantity >= quantity) {
      res
        .status(400)
        .json({
          message: "You are not allowed to reduce the quantity of the item",
        });
      return;
    }

    // Upload proof of delivery
    const proof = await uploadFile(req.file);
    if (!proof || !proof.file || !proof.file.url) {
      res.status(500).json({ message: "Failed to upload proof of delivery" });
      return;
    }
    const proofOfDelivery = proof.file.url;

    // Create a pending update request
    const pendingUpdate = {
      stockId: id,
      itemName,
      quantity,
      price,
      proofOfDelivery,
      requestedBy: req.user.id, // Assuming `req.user` contains authenticated user details
      status: "Pending", // Default status
      createdAt: new Date(),
    };

    // Save the pending update request (e.g., in a separate collection)
    const newRequest = await PendingUpdate.create(pendingUpdate);

    res.status(200).json({
      message: "Update request submitted successfully. Pending admin approval.",
      pendingUpdate: newRequest,
    });
  } catch (error) {
    console.error("Error submitting update request:", error);
    res.status(500).json({ message: error.message });
  }
};
export const getAllUniformStockController = async (
  req: Request,
  res: Response
) => {
  try {
    const uniformStock = await Uniform.find()
      .populate({ path: "category", select: "-__v" }) // Ensure these are valid reference fields
      .populate({ path: "supplierId", select: "-__v" }); // Ensure these are valid reference field
    if (uniformStock.length === 0) {
      res.status(404).json({ message: "No uniform stock found" });
      return;
    }

    res.status(200).json(uniformStock);
  } catch (error) {
    console.error("Error getting uniform stock:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllSuppliesController = async (req: Request, res: Response) => {
  try {
    const supplies = await getSupplies();
    if (supplies.length === 0) {
      res.status(404).json({ message: "No supplies found" });
      return;
    }
    res.status(200).json(supplies);
  } catch (error) {
    console.error("Error getting supplies:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getSupplyBySupplierIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const supply = await getSupplySupplierId(id as string);
    if (!supply) {
      res.status(404).json({ message: "Supply not found" });
      return;
    }
    res.status(200).json(supply);
  } catch (error) {
    console.error("Error getting supply:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getUnpaidSuppliesBySupplierIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const supllierId = req.params.id;
    const supplies = await getUnpaidSuppliesBySupplierId(supllierId as string);
    if (supplies.length === 0) {
      res.status(404).json({ message: "No unpaid supplies found" });
      return;
    }
    res.status(200).json(supplies);
  } catch (error) {
    console.error("Error getting unpaid supplies:", error);
    res.status(500).json({ error: error.message });
  }
};
export const getAssetAssignmentsController = async (req: Request, res: Response) => {
    try {
        const assignments = await AssetAssignment.find().populate('assetId');
        res.status(200).json(assignments);
    } catch (error: any) {
        console.error("Error in getAssetAssignmentsController:", error);
        res.status(500).json({ error: error.message });
    }
};

export const assignAssetController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // assetId
        const { studentId, conditionOnAssignment } = req.body;

        const asset = await getAssetsById(id as string);
        if (!asset) {
            res.status(404).json({ message: "Asset not found" });
            return;
        }

        if (asset.totalNumberInGoodCondition <= 0) {
            res.status(400).json({ message: "No assets in good condition available" });
            return;
        }

        const assignment = await AssetAssignment.create({
            assetId: id,
            studentId,
            assignedDate: new Date(),
            status: 'assigned',
            conditionOnAssignment
        });

        // Update asset quantity
        asset.totalNumberInGoodCondition -= 1;
        asset.totalNumber -= 1; // It's "removed" from general stock as requested
        await asset.save();

        // Log transaction
        const transaction = new Transaction({
            assetId: id,
            transactionType: "OUT",
            quantity: 1,
            previousQuantity: asset.totalNumber + 1,
            newQuantity: asset.totalNumber,
            takenBy: studentId,
            transactionSource: "asset assignment",
        });
        await transaction.save();

        res.status(201).json({ message: "Asset assigned successfully", assignment, transaction });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const returnAssetController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // assignmentId
        const { conditionOnReturn } = req.body;

        const assignment = await AssetAssignment.findById(id);
        if (!assignment) {
            res.status(404).json({ message: "Assignment record not found" });
            return;
        }

        if (assignment.status === 'returned') {
            res.status(400).json({ message: "Asset already returned" });
            return;
        }

        const asset = await getAssetsById(assignment.assetId.toString());
        if (!asset) {
            res.status(404).json({ message: "Asset not found" });
            return;
        }

        assignment.status = 'returned';
        assignment.returnDate = new Date();
        assignment.conditionOnReturn = conditionOnReturn;
        await assignment.save();

        // Update asset quantity
        asset.totalNumber += 1;
        if (conditionOnReturn === 'Good') {
            asset.totalNumberInGoodCondition += 1;
        } else {
            asset.totalNumberInCriticalCondition += 1;
        }
        await asset.save();

        // Log transaction
        const transaction = new Transaction({
            assetId: asset._id,
            transactionType: "IN",
            quantity: 1,
            previousQuantity: asset.totalNumber - 1,
            newQuantity: asset.totalNumber,
            takenBy: assignment.studentId,
            transactionSource: "asset assignment",
        });
        await transaction.save();

        res.status(200).json({ message: "Asset returned successfully", assignment, transaction });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

