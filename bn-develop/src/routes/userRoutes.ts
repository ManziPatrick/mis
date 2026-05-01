// src/routes/userRoutes.ts
import express, { Router } from 'express';
import {
  registerUser,
  getUser,
  updateUser,
  deleteUser,
  getAllUser,
  adminApprovalSupplier,
  userUpdatePassword,
  disableUser,
  reviewUpdateRequestForUniformStock,
  createPersonalRequestController,
  getPersonalRequestsController,
  getPersonalRequestByIdController,
  updatePersonalRequestController,
} from "../modules/user/controller/userController";
import { AdminApprovalEmployee } from '../modules/hr/controller/hrController';
import { isEmployeeExist, isSupplierExist, transformFilesToBody, usersExist, userValidation } from '../middlewares';
import { userAuthorization } from '../middlewares/auth';
import upload from '../utils/multer';
import { getRoleByRoleNames } from '../modules/user/controller/userController';
import { getRoleByRoleIdController } from '../modules/user/controller/userController';

const router: Router = Router();

router.post('/personal-request',userAuthorization(["admin","finance","stock","hr","library"]), createPersonalRequestController);
router.get('/personal-requests',userAuthorization(["admin","finance","stock","hr","library"]), getPersonalRequestsController);
router.get('/personal-request/:id',userAuthorization(["admin","finance","stock","hr","library"]), getPersonalRequestByIdController);
router.put('/personal-request/:id',userAuthorization(["admin"]), updatePersonalRequestController);
router.post('/',userAuthorization(["admin","superadmin"]), userValidation, registerUser);
router.get('/',userAuthorization(["admin","superadmin"]), usersExist, getAllUser);
router.put('/update-password',userAuthorization(["admin","superadmin","finance","hr","stock","procurement","library"]), userUpdatePassword);
router.get('/roles',userAuthorization(["admin","superadmin"]), getRoleByRoleNames);
router.get('/roles/:id',userAuthorization(["admin","superadmin"]), getRoleByRoleIdController);
router.get('/:id',userAuthorization(["admin","finance","stock","hr","library", "superadmin"]), usersExist, getUser);
router.put('/:id',userAuthorization(["admin","superadmin","finance","hr","stock","procurement","librarian"]),upload.single('profilePicture'), usersExist, updateUser);
router.put('/supplier/:supplierId',userAuthorization(["admin"]), isSupplierExist, adminApprovalSupplier);
router.put('/employee/:employeeId',userAuthorization(["admin"]), isEmployeeExist, AdminApprovalEmployee);
router.put('/disable-user/:id',userAuthorization(["superadmin","admin"]), usersExist, disableUser)
router.put('/pending-updates/:requestId/review',userAuthorization(["admin"]), reviewUpdateRequestForUniformStock)
export default router;
