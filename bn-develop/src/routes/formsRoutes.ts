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
// Roles that can READ and CREATE forms (teachers & workshop assistants included)
const creatorRoles = ["admin", "stock", "superadmin", "finance", "headteacher", "dht", "logistics", "md", "teacher", "workshopassistant"];
// Roles that can APPROVE / REJECT forms (managers only)
const approverRoles = ["admin", "stock", "superadmin", "headteacher", "dht", "logistics", "md", "finance"];

// ─── School Settings ───────────────────────────────────────────────────────────
formsRouter.get("/settings", userAuthorization(allRoles), getSchoolSettings);
formsRouter.put("/settings", userAuthorization(["admin", "superadmin"]), upload.single("logo"), updateSchoolSettings);

// ─── Generic Proof Upload ──────────────────────────────────────────────────────
formsRouter.put("/:formType/:id/proof", userAuthorization(allRoles), upload.single("proof"), uploadFormProof);

// ─── Purchase Orders (Annex I) ─────────────────────────────────────────────────
formsRouter.get("/purchase-orders", userAuthorization(creatorRoles), getAllPurchaseOrders);
formsRouter.get("/purchase-orders/:id", userAuthorization(creatorRoles), getPurchaseOrderById);
formsRouter.post("/purchase-orders", userAuthorization(creatorRoles), createPurchaseOrder);
formsRouter.put("/purchase-orders/:id/approve", userAuthorization(approverRoles), approvePurchaseOrder);
formsRouter.delete("/purchase-orders/:id", userAuthorization(["admin", "superadmin"]), deletePurchaseOrder);

// ─── Delivery Notes (Annex II) ─────────────────────────────────────────────────
formsRouter.get("/delivery-notes", userAuthorization(creatorRoles), getAllDeliveryNotes);
formsRouter.get("/delivery-notes/:id", userAuthorization(creatorRoles), getDeliveryNoteById);
formsRouter.post("/delivery-notes", userAuthorization(creatorRoles), createDeliveryNote);
formsRouter.put("/delivery-notes/:id/approve", userAuthorization(approverRoles), approveDeliveryNote);
formsRouter.delete("/delivery-notes/:id", userAuthorization(["admin", "superadmin"]), deleteDeliveryNote);

// ─── Goods Received Notes (Annex III) ──────────────────────────────────────────
formsRouter.get("/received-notes", userAuthorization(creatorRoles), getAllReceivedNotes);
formsRouter.get("/received-notes/:id", userAuthorization(creatorRoles), getReceivedNoteById);
formsRouter.post("/received-notes", userAuthorization(creatorRoles), createReceivedNote);
formsRouter.put("/received-notes/:id/approve", userAuthorization(approverRoles), approveReceivedNote);
formsRouter.delete("/received-notes/:id", userAuthorization(["admin", "superadmin"]), deleteReceivedNote);

// ─── Store Cards (Annex IV) ─────────────────────────────────────────────────────
formsRouter.get("/store-cards", userAuthorization(creatorRoles), getAllStoreCards);
formsRouter.get("/store-cards/:id", userAuthorization(creatorRoles), getStoreCardById);
formsRouter.post("/store-cards", userAuthorization(creatorRoles), createStoreCard);
formsRouter.put("/store-cards/:id/approve", userAuthorization(approverRoles), approveStoreCard);
formsRouter.delete("/store-cards/:id", userAuthorization(["admin", "superadmin"]), deleteStoreCard);

// ─── Consumables Requisitions (Annex V) ────────────────────────────────────────
formsRouter.get("/requisitions", userAuthorization(creatorRoles), getAllRequisitions);
formsRouter.get("/requisitions/:id", userAuthorization(creatorRoles), getRequisitionById);
formsRouter.post("/requisitions", userAuthorization(creatorRoles), createRequisition);
formsRouter.put("/requisitions/:id/approve", userAuthorization(approverRoles), approveRequisition);
formsRouter.delete("/requisitions/:id", userAuthorization(["admin", "superadmin"]), deleteRequisition);

// ─── Mini Requisitions (Annex VI) ──────────────────────────────────────────────
formsRouter.get("/mini-requisitions", userAuthorization(creatorRoles), getAllMiniRequisitions);
formsRouter.get("/mini-requisitions/:id", userAuthorization(creatorRoles), getMiniRequisitionById);
formsRouter.post("/mini-requisitions", userAuthorization(creatorRoles), createMiniRequisition);
formsRouter.put("/mini-requisitions/:id/approve", userAuthorization(approverRoles), approveMiniRequisition);
formsRouter.delete("/mini-requisitions/:id", userAuthorization(["admin", "superadmin"]), deleteMiniRequisition);

// ─── Monthly Inventory Reports (Annex VII) ─────────────────────────────────────
formsRouter.get("/monthly-inventories", userAuthorization(creatorRoles), getAllMonthlyInventories);
formsRouter.get("/monthly-inventories/:id", userAuthorization(creatorRoles), getMonthlyInventoryById);
formsRouter.post("/monthly-inventories", userAuthorization(creatorRoles), createMonthlyInventory);
formsRouter.put("/monthly-inventories/:id/approve", userAuthorization(approverRoles), approveMonthlyInventory);
formsRouter.delete("/monthly-inventories/:id", userAuthorization(["admin", "superadmin"]), deleteMonthlyInventory);

// ─── Utilization Reports (Annex VIII) ──────────────────────────────────────────
formsRouter.get("/utilization-reports", userAuthorization(creatorRoles), getAllUtilizationReports);
formsRouter.get("/utilization-reports/:id", userAuthorization(creatorRoles), getUtilizationReportById);
formsRouter.post("/utilization-reports", userAuthorization(creatorRoles), createUtilizationReport);
formsRouter.put("/utilization-reports/:id/approve", userAuthorization(approverRoles), approveUtilizationReport);
formsRouter.delete("/utilization-reports/:id", userAuthorization(["admin", "superadmin"]), deleteUtilizationReport);

export default formsRouter;
