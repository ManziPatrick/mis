import { Router } from "express";
import { userAuthorization } from "../middlewares/auth";
import { addStudent, getAllStudent } from "../modules/students/controller/studentController";

const studentRouter:Router =  Router();

// Student routes
studentRouter.post('/',userAuthorization(["finance", "admin", "superadmin"]), addStudent);
studentRouter.get('/',userAuthorization(["finance", "admin", "superadmin","stock"]), getAllStudent);

export default studentRouter;