import { getUniformPayment } from './../modules/finance/repository/financeRepository';
// src/middlewares/index.ts
// middlewares for user validation if user exists
import express, { Request, Response, NextFunction } from 'express';
import { getUserByEmail, getUsers, getUserById } from '../modules/user/repository';
import { getAssetsByCategory, getAssetsById, getAssetsByItem, getReceivedStockBySupplier, getRemainingQuantity, updateAssets, updateStock } from '../modules/stock/repository/stockRepositories';
import { getSupplierById } from '../modules/procurement/repositories/procurementRepositories';
import { getEmployeeByEmail, getEmployeeById } from '../modules/hr/repository/hrRepository';
import rateLimit from "express-rate-limit";
import { UniformPayment } from '../database/model/uniform';
import { Uniform } from '../database/model/uniformStock';

interface ExtendedRequest extends Request {
    userData?: any;
}
export const userValidation = async (req: ExtendedRequest, res: Response, next: NextFunction):Promise<any| undefined> => {
    try {
        const { email } = req.body;
        const user = await getUserByEmail(email);
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const usersExist = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    try {
        const { id } = req.params;
        if (id) {
            // If ID is provided, check for specific user
            const user = await getUserById(id as string);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
        } else {
            // If no ID, check if any users exist
            const users = await getUsers();
            if (!users || users.length === 0) {
                res.status(404).json({ message: 'No users found' });
                return;
            }
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const transformFilesToBody = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
  
    if (req.file) {
        console.log(req.file);
      req.body.file = req.file.path;
    }
  
    if (req.files) {
      const files = req.files as Express.Multer.File[];
      req.body.files = files.map((file) => file.path);
    }
    if (!req.file && !req.files) {
        res
        .status(400)
        .json({
            status: 400,
            message: "File(s) are required",
        });
        return;
    }
    next();
};

export const passwordResetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limit each IP to 3 requests per windowMs
    message: {
      status: 429,
      message: "Too many password reset requests. Please try again later in 15 minutes.",
      timeout: 15 * 60 * 1000
    },
  });

export const assetsValidation = async (req: Request, res: Response, next: NextFunction):Promise<any| undefined> => {
    try {
        const { item } = req.body;
        const assets = await getAssetsByItem(item);
        if (assets) {
            const assetsId = assets._id;
            res.status(400).json({ message: 'Assets already recorded in this category. Please update the existing record.' , assetsId});
            return;
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const isSupplierApproved = async (req: Request, res: Response, next: NextFunction):Promise<any| undefined> => {
    try {
        const { supplierId } = req.body;
        const supplier = await getSupplierById(supplierId as string);

        if (!supplier) {
            res.status(400).json({ message: 'Supplier not found' });
            return;
        }
        if (supplier.status !== 'approved') {
            res.status(400).json({ message: 'Supplier is not allowed to supply commodities' });
            return;
        }
        // check if there are any remaining commodities quantity in stock, if so update the quantity in stock
        const receivedStock = await getReceivedStockBySupplier(supplierId);
        if (receivedStock && receivedStock.item === req.body.item){
            if(receivedStock.quantity > 0){
                const remainingQuantity = receivedStock.quantity + req.body.quantity;
                const updatedStock = await updateStock(receivedStock._id.toString(), {quantity: Number(remainingQuantity)});
                res.status(200).json({ message: 'there are remaining quantities of this commodity in stock, updated successfully', updatedStock });
                return;
            }
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const isSupplierExist = async (req: Request, res: Response, next: NextFunction):Promise<any| undefined> => {
    try {
        const { supplierId } = req.params;
        const supplier = await getSupplierById(supplierId as string);
        if (!supplier) {
            res.status(400).json({ message: 'Supplier not found' });
            return;
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const isAssetsExist = async (req: Request, res: Response, next: NextFunction):Promise<any| undefined> => {
    try {
        const { id } = req.params;
        const assets = await getAssetsById(id as string);
        if (!assets) {
            res.status(400).json({ message: 'Assets not found' });
            return;
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const isEmployeeExist = async (req: Request, res: Response, next: NextFunction):Promise<any| undefined> => {
    try {
        const { employeeId } = req.params;
        if(req.body.email){
            const employee = await getEmployeeByEmail(req.body.email);
            if (employee) {
                res.status(400).json({ message: 'Employee already exists' });
                return;
            }
        }
        if(employeeId){
            const employee = await getEmployeeById(employeeId as string);
            if (!employee) {
                res.status(400).json({ message: 'Employee not found' });
                return;
            }
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


export const checkUniformStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params; // Get uniform ID from params
  
      // Fetch the uniform by ID
      const uniform = await UniformPayment.findById(id as string);
      if (!uniform) {
          res.status(404).json({ message: "Uniform not found." });
        return 
      }

      const items = uniform.uniformType;

    for (const item of items) {
      const stockItem = await Uniform.findOne({ item: item.itemName });
      if (!stockItem || stockItem.quantity < item.quantity) {
        res.status(400).json({ message: `Item ${item.itemName} is out of stock or insufficient quantity.` });
        return;
      }
    }
       next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  