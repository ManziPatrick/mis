// procurement routes
import { Router } from "express";
import { createSupplierController, getSupplierController, getSupplierByIdController, updateSupplierController, deleteSupplierController, requestDeleteSupplierController, approveDeleteSupplierController } from "../modules/procurement/Controller/procurementController";
import { userAuthorization } from "../middlewares/auth";
import { transformFilesToBody } from "../middlewares";
import upload from '../utils/multer';

const router = Router();

router.post("/supplier",userAuthorization(["procurement","admin"]),upload.single('contract'), createSupplierController);
router.get("/supplier",userAuthorization(["procurement","admin","stock","finance","librarian","hr","superadmin"]), getSupplierController);
router.get("/supplier/:id",userAuthorization(["procurement","admin","stock","finance","librarian","hr","superadmin"]), getSupplierByIdController);
router.put("/supplier/:id",userAuthorization(["procurement","admin"]),upload.single('contract'), transformFilesToBody, updateSupplierController);
router.post("/supplier/:id/delete-request",userAuthorization(["procurement","admin"]), requestDeleteSupplierController);
router.put("/supplier/:id/delete-request",userAuthorization(["admin"]), approveDeleteSupplierController);
router.delete("/supplier/:id",userAuthorization(["procurement","admin"]), deleteSupplierController);

export default router;