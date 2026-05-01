// src/utils/types.ts

import { Request } from "express";
import { Document } from "mongoose";
import mongoose from "mongoose";

export interface CloudinaryResponse {
  url: string;
  publicId: string;
}

export interface ICategory {
  name: string;
}

export interface IAssets {
  item: string;
  purchaseDate: Date;
  category: ICategory;
  description: string;
  location: string;
  totalNumber: number;
  totalNumberInGoodCondition: number;
  totalNumberInCriticalCondition: number;
  values: number;
  totalValues: number;
  criticalCondition: string;
}

export interface IStock {
  item: string;
  category: ICategory;
  description: string;
  quantity: number;
  unityPrice: number;
  supplierId: ISupplier;
  proofOfDelivery: string;
  date: Date;
  uniformTakenBy: string;
  totalAmount: number;
  amountPaid?: number;
  remainingBalance?: number;
  paymentStatus?: string;
  minimumThreshold: number;
  unity: string;
  totalPrice?: number;
}

export interface ISupplier extends Document {
  name: string;
  tin: string;
  phone: string;
  email: string;
  commodity: string;
  address: string;
  status: string;
  rejected_reason: string;
}

export interface IOutOfStock {
  quantity: number;
  takenBy: string;
  date: Date;
  item: string;
}
export interface ITransaction {
  stockId: IStock;
  transactionType: "IN" | "OUT";
  quantity: number;
  date: Date;
  previousQuantity: number;
  totalPrice: number;
  transactionSource: "uniform stock"| "general stock"| "full uniform"| "partial uniform";
  pricePerItem:number, // Can define any other types of transactions
  newQuantity: number;
  takenBy: string;
  itemPrices: { itemName: string; price: number; quantity: number }[];
}

export interface IEmployee {
  name: string;
  department: string;
  occupation: string;
  type: "staff" | "non-staff";
  nationality: "rwandan" | "foreigner";
  dateOfJoining: Date;
  netSalary: number;
  status?: string;
  delete_status?: string;
  delete_reason?: string;
  email: string;
  phone: string;
  nationalId?: string;
  nationalIdPdf?: string;
  visaPdf?: string;
  passportPdf?: string;
  contractPdf: string;
  rejected_reason?: string;
  transportAllowence: number;
}

export interface IUniformPayment {
  studentId: string;
  name: string;
  faculty: string;
  level: string;
  amountPaid: number;
  modeOfPayment: "Bank" | "Petty Cash";
  proofOfPaymentUrl: string;
  uniformType?: { itemName: string; quantity: number }[];
  fullUniform?: "yes" | "no";
}

export interface IRequestUser extends Request {
  user: {
    id: string;
    role: string;
  };
}

export interface IUniform extends Document {
  item: string;
  category: ICategory;
  description: string;
  quantity: number;
  supplierId: ISupplier;
  proofOfDelivery: string;
  date: Date;
  fullUniform: string;
  uniformTakenBy: string;
  fullUniformPrice: number;
  itemPrices: { itemName: string; price: number }[];
  totalPrice: number;
}

export interface ISupply extends Document{
  supplierId: string;
  item: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  deliveryDate: Date;
  remainingBalance: number;
  status: "Unpaid" | "paid";
}

export interface IFaculty extends Document {
  name:string;
  description:string;
}

export interface IStudent extends Document {
  name: string;
  studentId: string;
  faculty: IFaculty;
}

export interface IPaperBlade extends Document {
  studentId:string;
  quantityBrought:number;
  dateBrought:Date;
}