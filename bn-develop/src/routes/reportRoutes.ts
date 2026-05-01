import express from 'express';
import {
  stockSummaryReport,
  lowStockReport,
  stockMovementReport,
  totalStockValueReport,
  getApprovedRequestsReport,
  getPendingApprovalsReport,
  getPettyCashReport,
  getRejectedRequestsReport,
} from "../modules/report/controller/reportController";
import { userAuthorization } from '../middlewares/auth';

const router = express.Router();

// Routes for reports
router.get('/stock-summary',userAuthorization(["superadmin","admin","stock","finance"]), stockSummaryReport);
router.get('/low-stock',userAuthorization(["superadmin","stock","admin","finance"]), lowStockReport);
router.get('/stock-movement',userAuthorization(["superadmin","admin","stock","finance"]), stockMovementReport);
router.get('/total-stock-value',userAuthorization(["superadmin","stock","finance","admin"]), totalStockValueReport);
router.get('/pending-approvals',userAuthorization(["superadmin","finance","hr","stock","procurement","library","admin"]), getPendingApprovalsReport);
router.get('/approved-requests',userAuthorization(["superadmin","finance","hr","stock","procurement","library","admin"]), getApprovedRequestsReport);
router.get('/rejected-requests',userAuthorization(["superadmin","finance","hr","stock","procurement","library","admin"]), getRejectedRequestsReport);
router.get('/petty-cash',userAuthorization(["superadmin","finance","admin"]), getPettyCashReport);


export default router;