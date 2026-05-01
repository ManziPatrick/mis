// hr routes
import { Router } from "express";
import {
  createEmployeeController,
  getEmployeesController,
  getEmployeeByIdController,
  updateEmployeeController,
  deleteEmployeeController,
  sendEmployeeDeleteRequests,
  handleEmployeeDeleteRequest,
  getEmployeeDeleteRequestsController,
  getEmployeeDeleteRequestByIdController,
} from "../modules/hr/controller/hrController";
import { userAuthorization } from "../middlewares/auth";
import upload from '../utils/multer';
import { isEmployeeExist } from "../middlewares";
const router = Router();

router.post(
    "/employee",
    userAuthorization(["hr","admin"]),
    upload.fields([
        { name: "nationalIdPdf", maxCount: 1 },
        { name: "visaPdf", maxCount: 1 },
        { name: "passportPdf", maxCount: 1 },
        { name: "contractPdf", maxCount: 1 },
      ]),
    isEmployeeExist,
    createEmployeeController
);
router.get("/employee",userAuthorization(["procurement","admin","stock","finance","librarian","hr","superadmin"]), getEmployeesController);
router.get("/employee/:id",userAuthorization(["procurement","admin","stock","finance","librarian","hr","superadmin"]),isEmployeeExist, getEmployeeByIdController);
router.put("/employee/:id",userAuthorization(["hr","admin"]),isEmployeeExist, updateEmployeeController);
router.delete("/employee/:id",userAuthorization(["hr","admin"]),isEmployeeExist, deleteEmployeeController);
router.post("/employee/:id/delete-request",userAuthorization(["hr","admin"]),isEmployeeExist, sendEmployeeDeleteRequests);
router.put("/employee/:id/delete-request",userAuthorization(["admin"]),isEmployeeExist, handleEmployeeDeleteRequest);
router.get("/employee-delete-requests",userAuthorization(["admin","hr"]), getEmployeeDeleteRequestsController);
router.get("/employee-delete-requests/:id",userAuthorization(["admin","hr"]), getEmployeeDeleteRequestByIdController);

export default router;
