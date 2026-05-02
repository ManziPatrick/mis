import { Router } from "express";
import { userAuthorization } from "../middlewares/auth";
import upload from "../utils/multer";
import {
  getSchoolSettings,
  updateSchoolSettings,
  getAllPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder,
  approvePurchaseOrder,
  deletePurchaseOrder,
  getAllDeliveryNotes,
  getDeliveryNoteById,
  createDeliveryNote,
  approveDeliveryNote,
  deleteDeliveryNote,
  getAllReceivedNotes,
  getReceivedNoteById,
  createReceivedNote,
  approveReceivedNote,
  deleteReceivedNote,
  getAllStoreCards,
  getStoreCardById,
  createStoreCard,
  approveStoreCard,
  deleteStoreCard,
  getAllRequisitions,
  getRequisitionById,
  createRequisition,
  approveRequisition,
  deleteRequisition,
  getAllMiniRequisitions,
  getMiniRequisitionById,
  createMiniRequisition,
  approveMiniRequisition,
  deleteMiniRequisition,
  getAllMonthlyInventories,
  getMonthlyInventoryById,
  createMonthlyInventory,
  approveMonthlyInventory,
  deleteMonthlyInventory,
  getAllUtilizationReports,
  getUtilizationReportById,
  createUtilizationReport,
  approveUtilizationReport,
  deleteUtilizationReport,
  uploadFormProof,
} from "../modules/forms/controller/formsController";


const formsRouter = Router();

const allRoles = ["admin", "stock", "superadmin", "finance", "procurement", "librarian", "hr", "headteacher", "dht", "logistics", "md", "teacher", "workshopassistant"];
const managerRoles = ["admin", "stock", "superadmin", "headteacher", "dht", "logistics", "md", "finance"];

// ─── School Settings ───────────────────────────────────────────────────────────
formsRouter.get("/settings", userAuthorization(allRoles), getSchoolSettings);
formsRouter.put("/settings", userAuthorization(["admin", "superadmin"]), upload.single("logo"), updateSchoolSettings);

// ─── Generic Proof Upload ──────────────────────────────────────────────────────
formsRouter.put("/:formType/:id/proof", userAuthorization(allRoles), upload.single("proof"), uploadFormProof);

// ─── Purchase Orders (Annex I) ─────────────────────────────────────────────────
formsRouter.get("/purchase-orders", userAuthorization(managerRoles), getAllPurchaseOrders);
formsRouter.get("/purchase-orders/:id", userAuthorization(managerRoles), getPurchaseOrderById);
formsRouter.post("/purchase-orders", userAuthorization(managerRoles), createPurchaseOrder);
formsRouter.put("/purchase-orders/:id/approve", userAuthorization(managerRoles), approvePurchaseOrder);
formsRouter.delete("/purchase-orders/:id", userAuthorization(["admin", "superadmin"]), deletePurchaseOrder);

// ─── Delivery Notes (Annex II) ─────────────────────────────────────────────────
formsRouter.get("/delivery-notes", userAuthorization(managerRoles), getAllDeliveryNotes);
formsRouter.get("/delivery-notes/:id", userAuthorization(managerRoles), getDeliveryNoteById);
formsRouter.post("/delivery-notes", userAuthorization(managerRoles), createDeliveryNote);
formsRouter.put("/delivery-notes/:id/approve", userAuthorization(managerRoles), approveDeliveryNote);
formsRouter.delete("/delivery-notes/:id", userAuthorization(["admin", "superadmin"]), deleteDeliveryNote);

// ─── Goods Received Notes (Annex III) ──────────────────────────────────────────
formsRouter.get("/received-notes", userAuthorization(managerRoles), getAllReceivedNotes);
formsRouter.get("/received-notes/:id", userAuthorization(managerRoles), getReceivedNoteById);
formsRouter.post("/received-notes", userAuthorization(managerRoles), createReceivedNote);
formsRouter.put("/received-notes/:id/approve", userAuthorization(managerRoles), approveReceivedNote);
formsRouter.delete("/received-notes/:id", userAuthorization(["admin", "superadmin"]), deleteReceivedNote);

// ─── Store Cards (Annex IV) ─────────────────────────────────────────────────────
formsRouter.get("/store-cards", userAuthorization(managerRoles), getAllStoreCards);
formsRouter.get("/store-cards/:id", userAuthorization(managerRoles), getStoreCardById);
formsRouter.post("/store-cards", userAuthorization(managerRoles), createStoreCard);
formsRouter.put("/store-cards/:id/approve", userAuthorization(managerRoles), approveStoreCard);
formsRouter.delete("/store-cards/:id", userAuthorization(["admin", "superadmin"]), deleteStoreCard);

// ─── Consumables Requisitions (Annex V) ────────────────────────────────────────
formsRouter.get("/requisitions", userAuthorization(managerRoles), getAllRequisitions);
formsRouter.get("/requisitions/:id", userAuthorization(managerRoles), getRequisitionById);
formsRouter.post("/requisitions", userAuthorization(managerRoles), createRequisition);
formsRouter.put("/requisitions/:id/approve", userAuthorization(managerRoles), approveRequisition);
formsRouter.delete("/requisitions/:id", userAuthorization(["admin", "superadmin"]), deleteRequisition);

// ─── Mini Requisitions (Annex VI) ──────────────────────────────────────────────
formsRouter.get("/mini-requisitions", userAuthorization(managerRoles), getAllMiniRequisitions);
formsRouter.get("/mini-requisitions/:id", userAuthorization(managerRoles), getMiniRequisitionById);
formsRouter.post("/mini-requisitions", userAuthorization(managerRoles), createMiniRequisition);
formsRouter.put("/mini-requisitions/:id/approve", userAuthorization(managerRoles), approveMiniRequisition);
formsRouter.delete("/mini-requisitions/:id", userAuthorization(["admin", "superadmin"]), deleteMiniRequisition);

// ─── Monthly Inventory Reports (Annex VII) ─────────────────────────────────────
formsRouter.get("/monthly-inventories", userAuthorization(managerRoles), getAllMonthlyInventories);
formsRouter.get("/monthly-inventories/:id", userAuthorization(managerRoles), getMonthlyInventoryById);
formsRouter.post("/monthly-inventories", userAuthorization(managerRoles), createMonthlyInventory);
formsRouter.put("/monthly-inventories/:id/approve", userAuthorization(managerRoles), approveMonthlyInventory);
formsRouter.delete("/monthly-inventories/:id", userAuthorization(["admin", "superadmin"]), deleteMonthlyInventory);

// ─── Utilization Reports (Annex VIII) ──────────────────────────────────────────
formsRouter.get("/utilization-reports", userAuthorization(managerRoles), getAllUtilizationReports);
formsRouter.get("/utilization-reports/:id", userAuthorization(managerRoles), getUtilizationReportById);
formsRouter.post("/utilization-reports", userAuthorization(managerRoles), createUtilizationReport);
formsRouter.put("/utilization-reports/:id/approve", userAuthorization(managerRoles), approveUtilizationReport);
formsRouter.delete("/utilization-reports/:id", userAuthorization(["admin", "superadmin"]), deleteUtilizationReport);

export default formsRouter;
