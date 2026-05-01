import { Router } from 'express';
import { userAuthorization } from '../middlewares/auth';
import { 
    getExpenseRequestsController,
    createExpenseRequestController,
    getExpenseRequestByIdController,
    updateExpenseRequestController,
    getPaymentVouchersController,
    getPaymentVoucherByIdController,
    deletePaymentVoucherController,
    uploadSignedVoucherDocument,
    createReceivedMoneyController,
    getReceivedMoneyController,
    getReceivedMoneyByIdController,
    deleteReceivedMoneyController,
    getPettyCashEntriesController,
    getPettyCashEntryByIdController,
    getPayrollController,
    getPaymentByIdController,
    getAllPaymentsController,
    createPayUniformController,
    getUniformItemsController,
    generatePayrollManualy,
    getPayrollByMonthAndYearController,
    processApprovedPersonalRequestController,
} from '../modules/finance/controller/financeController';
import upload from '../utils/multer';

const router = Router();

router.post('/uniform-payment', userAuthorization(["finance","admin"]), upload.single('proofOfPayment'), createPayUniformController);
router.post('/expense-requests', userAuthorization(["finance"]), createExpenseRequestController);
router.get('/generate-payroll-manually',userAuthorization(["finance","superadmin","admin"]),generatePayrollManualy)
router.put('/expense-requests/:id', userAuthorization(["admin"]), updateExpenseRequestController);
router.get('/uniform',userAuthorization(["finance", "admin","stock"]),getUniformItemsController)
router.get('/payment-vouchers', userAuthorization(["finance", "admin"]), getPaymentVouchersController);
router.get('/expense-requests', userAuthorization(["finance", "admin"]) ,getExpenseRequestsController);
router.get('/get-payroll-by-month-year', userAuthorization(["finance", "admin"]),getPayrollByMonthAndYearController)
router.post('/vouchers/:voucherId/upload',userAuthorization(["finance", "admin"]),upload.single('signedDocument'),uploadSignedVoucherDocument
);
router.post('/received-money', userAuthorization(["finance","superadmin"]), upload.single('signed_document'), createReceivedMoneyController);
router.get('/received-money', userAuthorization(["finance", "admin","superadmin"]), getReceivedMoneyController);
router.get('/uniform-items', userAuthorization(["finance", "admin","superadmin"]), getUniformItemsController);
router.get('/petty-cash', userAuthorization(["finance", "admin","superadmin"]), getPettyCashEntriesController);
router.get('/payroll', userAuthorization(["finance", "hr","superadmin"]), getPayrollController);
router.get('/payments', userAuthorization(["finance", "admin","superadmin"]), getAllPaymentsController);
router.get('/received-money/:id', userAuthorization(["finance", "admin","superadmin"]), getReceivedMoneyByIdController);
router.get('/payment-vouchers/:id', userAuthorization(["finance", "admin"]), getPaymentVoucherByIdController);
router.get('/expense-requests/:id', userAuthorization(["finance", "admin"]), getExpenseRequestByIdController);
router.get('/petty-cash/:id', userAuthorization(["finance", "admin","superadmin"]), getPettyCashEntryByIdController);
router.get('/payments/:id', userAuthorization(["finance", "admin","superadmin"]), getPaymentByIdController);
router.delete('/payment-vouchers/:id', userAuthorization(["admin"]), deletePaymentVoucherController);
router.delete('/received-money/:id', userAuthorization(["admin"]), deleteReceivedMoneyController);
router.post('/process-personal-request/:id', userAuthorization(["finance", "admin"]), processApprovedPersonalRequestController);


export default router; 