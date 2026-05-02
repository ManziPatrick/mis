import { Request, Response } from "express";
import { SchoolSettings } from "../../../database/model/schoolSettings";
import { PurchaseOrder } from "../../../database/model/purchaseOrder";
import { DeliveryNote } from "../../../database/model/deliveryNote";
import { ReceivedNote } from "../../../database/model/receivedNote";
import { StoreCard } from "../../../database/model/storeCard";
import { Requisition } from "../../../database/model/requisition";
import { MiniRequisition } from "../../../database/model/miniRequisition";
import { MonthlyInventory } from "../../../database/model/monthlyInventory";
import { UtilizationReport } from "../../../database/model/utilizationReport";
import { uploadFile, uploadBase64 } from "../../../utils";

// ─── SCHOOL SETTINGS ─────────────────────────────────────────────────────────

export const getSchoolSettings = async (req: Request, res: Response) => {
  try {
    let settings = await SchoolSettings.findOne();
    if (!settings) {
      settings = await SchoolSettings.create({ schoolName: "My School", address: "School Address" });
    }
    res.status(200).json(settings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSchoolSettings = async (req: Request, res: Response) => {
  try {
    const { schoolName, address, tradePrefix } = req.body;
    let logoUrl: string | undefined;

    if (req.file) {
      const uploaded = await uploadFile(req.file);
      logoUrl = uploaded.file.url;
    }

    const updateData: any = { schoolName, address, tradePrefix };
    if (logoUrl) updateData.logoUrl = logoUrl;

    let settings = await SchoolSettings.findOne();
    if (!settings) {
      settings = await SchoolSettings.create(updateData);
    } else {
      settings = await SchoolSettings.findByIdAndUpdate(settings._id, updateData, { new: true });
    }
    res.status(200).json({ message: "Settings updated successfully", settings });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


// ─── PURCHASE ORDER (ANNEX I) ─────────────────────────────────────────────────

export const getAllPurchaseOrders = async (req: Request, res: Response) => {
  try {
    const orders = await PurchaseOrder.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPurchaseOrderById = async (req: Request, res: Response) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Purchase order not found" });
    res.status(200).json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createPurchaseOrder = async (req: Request, res: Response) => {
  try {
    const { tradeNumber, date, supplierName, items, preparedBy, preparedBySignatureData } = req.body;
    let preparedBySignature: string | undefined;
    if (preparedBySignatureData) {
      preparedBySignature = await uploadBase64(preparedBySignatureData);
    }
    const totalAmount = items.reduce((sum: number, i: any) => sum + i.totalPrice, 0);
    const count = await PurchaseOrder.countDocuments();
    const poNumber = `PO-${String(count + 1).padStart(4, "0")}`;
    const order = await PurchaseOrder.create({ poNumber, tradeNumber, date, supplierName, items, totalAmount, preparedBy, preparedBySignature });
    res.status(201).json({ message: "Purchase order created", order });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const approvePurchaseOrder = async (req: Request, res: Response) => {
  try {
    const { action, approvedBy, rejectionReason, signatureData } = req.body;
    let approvedBySignature: string | undefined;
    if (signatureData) {
      approvedBySignature = await uploadBase64(signatureData);
    }
    const order = await PurchaseOrder.findByIdAndUpdate(
      req.params.id,
      { status: action, approvedBy, approvedBySignature, rejectionReason },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Purchase order not found" });
    res.status(200).json({ message: `Purchase order ${action}`, order });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePurchaseOrder = async (req: Request, res: Response) => {
  try {
    await PurchaseOrder.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── DELIVERY NOTE (ANNEX II) ──────────────────────────────────────────────────

export const getAllDeliveryNotes = async (req: Request, res: Response) => {
  try {
    const notes = await DeliveryNote.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getDeliveryNoteById = async (req: Request, res: Response) => {
  try {
    const note = await DeliveryNote.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Delivery note not found" });
    res.status(200).json(note);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createDeliveryNote = async (req: Request, res: Response) => {
  try {
    const { poNumber, tradeNumber, date, items, deliveredBy, receivingCommittee } = req.body;
    const count = await DeliveryNote.countDocuments();
    const dnNumber = `DN-${String(count + 1).padStart(4, "0")}`;
    const note = await DeliveryNote.create({ dnNumber, poNumber, tradeNumber, date, items, deliveredBy, receivingCommittee });
    res.status(201).json({ message: "Delivery note created", note });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const approveDeliveryNote = async (req: Request, res: Response) => {
  try {
    const { action, approvedBy, rejectionReason, signatureData } = req.body;
    let approvedBySignature: string | undefined;
    if (signatureData) {
      approvedBySignature = await uploadBase64(signatureData);
    }
    const note = await DeliveryNote.findByIdAndUpdate(
      req.params.id,
      { status: action, approvedBy, approvedBySignature, rejectionReason },
      { new: true }
    );
    if (!note) return res.status(404).json({ message: "Delivery note not found" });
    res.status(200).json({ message: `Delivery note ${action}`, note });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDeliveryNote = async (req: Request, res: Response) => {
  try {
    await DeliveryNote.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── GOODS RECEIVED NOTE (ANNEX III) ──────────────────────────────────────────

export const getAllReceivedNotes = async (req: Request, res: Response) => {
  try {
    const notes = await ReceivedNote.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getReceivedNoteById = async (req: Request, res: Response) => {
  try {
    const note = await ReceivedNote.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Goods received note not found" });
    res.status(200).json(note);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createReceivedNote = async (req: Request, res: Response) => {
  try {
    const { poNumber, tradeNumber, date, supplierName, items, committeeMembers } = req.body;
    const count = await ReceivedNote.countDocuments();
    const grnNumber = `GRN-${String(count + 1).padStart(4, "0")}`;
    const note = await ReceivedNote.create({ grnNumber, poNumber, tradeNumber, date, supplierName, items, committeeMembers });
    res.status(201).json({ message: "Goods received note created", note });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const approveReceivedNote = async (req: Request, res: Response) => {
  try {
    const { action, approvedBy, rejectionReason, signatureData } = req.body;
    let approvedBySignature: string | undefined;
    if (signatureData) {
      approvedBySignature = await uploadBase64(signatureData);
    }
    const note = await ReceivedNote.findByIdAndUpdate(
      req.params.id,
      { status: action, approvedBy, approvedBySignature, rejectionReason },
      { new: true }
    );
    if (!note) return res.status(404).json({ message: "Goods received note not found" });
    res.status(200).json({ message: `Received note ${action}`, note });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteReceivedNote = async (req: Request, res: Response) => {
  try {
    await ReceivedNote.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── STORE CARD (ANNEX IV) ─────────────────────────────────────────────────────

export const getAllStoreCards = async (req: Request, res: Response) => {
  try {
    const cards = await StoreCard.find().sort({ createdAt: -1 });
    res.status(200).json(cards);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getStoreCardById = async (req: Request, res: Response) => {
  try {
    const card = await StoreCard.findById(req.params.id);
    if (!card) return res.status(404).json({ message: "Store card not found" });
    res.status(200).json(card);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createStoreCard = async (req: Request, res: Response) => {
  try {
    const { tradeNumber, schoolYear, itemDescription, entries, preparedBy, verifiedBy } = req.body;
    const card = await StoreCard.create({ tradeNumber, schoolYear, itemDescription, entries, preparedBy, verifiedBy });
    res.status(201).json({ message: "Store card created", card });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const approveStoreCard = async (req: Request, res: Response) => {
  try {
    const { action, verifiedBy, rejectionReason, signatureData } = req.body;
    let verifiedBySignature: string | undefined;
    if (signatureData) {
      verifiedBySignature = await uploadBase64(signatureData);
    }
    const card = await StoreCard.findByIdAndUpdate(
      req.params.id,
      { status: action, verifiedBy, verifiedBySignature, rejectionReason },
      { new: true }
    );
    if (!card) return res.status(404).json({ message: "Store card not found" });
    res.status(200).json({ message: `Store card ${action}`, card });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteStoreCard = async (req: Request, res: Response) => {
  try {
    await StoreCard.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── CONSUMABLES REQUISITION (ANNEX V) ────────────────────────────────────────

export const getAllRequisitions = async (req: Request, res: Response) => {
  try {
    const reqs = await Requisition.find().sort({ createdAt: -1 });
    res.status(200).json(reqs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getRequisitionById = async (req: Request, res: Response) => {
  try {
    const req2 = await Requisition.findById(req.params.id);
    if (!req2) return res.status(404).json({ message: "Requisition not found" });
    res.status(200).json(req2);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createRequisition = async (req: Request, res: Response) => {
  try {
    const { tradeNumber, date, items, requestedBy, verifiedByDept, verifiedByLogistics, checkedByDHT } = req.body;
    const count = await Requisition.countDocuments();
    const year = new Date().getFullYear();
    const voucherNumber = `RQ-${String(count + 1).padStart(4, "0")}/${year}`;
    const requisition = await Requisition.create({ voucherNumber, tradeNumber, date, items, requestedBy, verifiedByDept, verifiedByLogistics, checkedByDHT });
    res.status(201).json({ message: "Requisition created", requisition });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const approveRequisition = async (req: Request, res: Response) => {
  try {
    const { action, approvedByHT, rejectionReason, signatureData } = req.body;
    let approvedByHTSignature: string | undefined;
    if (signatureData) {
      approvedByHTSignature = await uploadBase64(signatureData);
    }
    const requisition = await Requisition.findByIdAndUpdate(
      req.params.id,
      { status: action, approvedByHT, approvedByHTSignature, rejectionReason },
      { new: true }
    );
    if (!requisition) return res.status(404).json({ message: "Requisition not found" });
    res.status(200).json({ message: `Requisition ${action}`, requisition });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRequisition = async (req: Request, res: Response) => {
  try {
    await Requisition.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── MINI REQUISITION (ANNEX VI) ──────────────────────────────────────────────

export const getAllMiniRequisitions = async (req: Request, res: Response) => {
  try {
    const reqs = await MiniRequisition.find().sort({ createdAt: -1 });
    res.status(200).json(reqs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMiniRequisitionById = async (req: Request, res: Response) => {
  try {
    const req2 = await MiniRequisition.findById(req.params.id);
    if (!req2) return res.status(404).json({ message: "Mini requisition not found" });
    res.status(200).json(req2);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createMiniRequisition = async (req: Request, res: Response) => {
  try {
    const { tradeNumber, date, items, requestedBy, verifiedByAssistant } = req.body;
    const count = await MiniRequisition.countDocuments();
    const year = new Date().getFullYear();
    const voucherNumber = `MRQ-${String(count + 1).padStart(4, "0")}/${year}`;
    const requisition = await MiniRequisition.create({ voucherNumber, tradeNumber, date, items, requestedBy, verifiedByAssistant });
    res.status(201).json({ message: "Mini requisition created", requisition });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const approveMiniRequisition = async (req: Request, res: Response) => {
  try {
    const { action, approvedByDHT, rejectionReason, signatureData } = req.body;
    let approvedByDHTSignature: string | undefined;
    if (signatureData) {
      approvedByDHTSignature = await uploadBase64(signatureData);
    }
    const requisition = await MiniRequisition.findByIdAndUpdate(
      req.params.id,
      { status: action, approvedByDHT, approvedByDHTSignature, rejectionReason },
      { new: true }
    );
    if (!requisition) return res.status(404).json({ message: "Mini requisition not found" });
    res.status(200).json({ message: `Mini requisition ${action}`, requisition });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMiniRequisition = async (req: Request, res: Response) => {
  try {
    await MiniRequisition.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── MONTHLY INVENTORY REPORT (ANNEX VII) ─────────────────────────────────────

export const getAllMonthlyInventories = async (req: Request, res: Response) => {
  try {
    const invs = await MonthlyInventory.find().sort({ createdAt: -1 });
    res.status(200).json(invs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMonthlyInventoryById = async (req: Request, res: Response) => {
  try {
    const inv = await MonthlyInventory.findById(req.params.id);
    if (!inv) return res.status(404).json({ message: "Monthly inventory not found" });
    res.status(200).json(inv);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createMonthlyInventory = async (req: Request, res: Response) => {
  try {
    const { tradeNumber, schoolYear, month, items, preparedBy, checkedBy, verifiedBy } = req.body;
    const inv = await MonthlyInventory.create({ tradeNumber, schoolYear, month, items, preparedBy, checkedBy, verifiedBy });
    res.status(201).json({ message: "Monthly inventory created", inv });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const approveMonthlyInventory = async (req: Request, res: Response) => {
  try {
    const { action, approvedBy, rejectionReason, signatureData } = req.body;
    let approvedBySignature: string | undefined;
    if (signatureData) {
      approvedBySignature = await uploadBase64(signatureData);
    }
    const inv = await MonthlyInventory.findByIdAndUpdate(
      req.params.id,
      { status: action, approvedBy, approvedBySignature, rejectionReason },
      { new: true }
    );
    if (!inv) return res.status(404).json({ message: "Monthly inventory not found" });
    res.status(200).json({ message: `Monthly inventory ${action}`, inv });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMonthlyInventory = async (req: Request, res: Response) => {
  try {
    await MonthlyInventory.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── UTILIZATION REPORT (ANNEX VIII) ──────────────────────────────────────────

export const getAllUtilizationReports = async (req: Request, res: Response) => {
  try {
    const reports = await UtilizationReport.find().sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUtilizationReportById = async (req: Request, res: Response) => {
  try {
    const rep = await UtilizationReport.findById(req.params.id);
    if (!rep) return res.status(404).json({ message: "Utilization report not found" });
    res.status(200).json(rep);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createUtilizationReport = async (req: Request, res: Response) => {
  try {
    const { tradeNumber, rqfLevel, titleOfModule, schoolYear, dateOfSubmission, items, preparedBy, checkedBy } = req.body;
    const rep = await UtilizationReport.create({ tradeNumber, rqfLevel, titleOfModule, schoolYear, dateOfSubmission, items, preparedBy, checkedBy });
    res.status(201).json({ message: "Utilization report created", rep });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const approveUtilizationReport = async (req: Request, res: Response) => {
  try {
    const { action, approvedBy, rejectionReason, signatureData } = req.body;
    let approvedBySignature: string | undefined;
    if (signatureData) {
      approvedBySignature = await uploadBase64(signatureData);
    }
    const rep = await UtilizationReport.findByIdAndUpdate(
      req.params.id,
      { status: action, approvedBy, approvedBySignature, rejectionReason },
      { new: true }
    );
    if (!rep) return res.status(404).json({ message: "Utilization report not found" });
    res.status(200).json({ message: `Utilization report ${action}`, rep });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUtilizationReport = async (req: Request, res: Response) => {
  try {
    await UtilizationReport.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ─── UPLOAD PROOF (GENERIC) ──────────────────────────────────────────────────

export const uploadFormProof = async (req: Request, res: Response) => {
  try {
    const { formType, id } = req.params as { formType: string; id: string };
    if (!req.file) return res.status(400).json({ message: "No proof file uploaded" });

    // 1. Upload to Cloudinary
    const uploaded = await uploadFile(req.file);
    const proofUrl = uploaded.file.url;

    // 2. Map formType to Mongoose Model
    const modelMap: Record<string, any> = {
      'purchase-orders': PurchaseOrder,
      'delivery-notes': DeliveryNote,
      'received-notes': ReceivedNote,
      'store-cards': StoreCard,
      'requisitions': Requisition,
      'mini-requisitions': MiniRequisition,
      'monthly-inventories': MonthlyInventory,
      'utilization-reports': UtilizationReport,
    };

    const Model = modelMap[formType];
    if (!Model) return res.status(400).json({ message: "Invalid form type" });

    // 3. Update the specific document
    const updated = await Model.findByIdAndUpdate(
      id,
      { proofUrl },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Form not found" });

    res.status(200).json({ message: "Proof uploaded successfully", proofUrl, data: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
