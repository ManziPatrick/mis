// src/routes/notificationRoutes.ts
import express from 'express';
import { userAuthorization } from '../middlewares/auth';
import notificationController from '../modules/notification/controller/notificationController';

const router = express.Router();

router.get('/', 
    userAuthorization(["superadmin", "admin", "finance", "procurement", "stock", "librarian", "hr"]),
    notificationController.getNotificationsByUserIdController
);

router.get('/:id', 
    userAuthorization(["superadmin", "admin", "finance", "procurement", "stock", "librarian", "hr"]),
    notificationController.getNotificationByIdController
);

router.put('/:id/status', 
    userAuthorization(["superadmin", "admin", "finance", "procurement", "stock", "librarian", "hr"]),
    notificationController.updateNotificationStatusController
);

router.put('/status/all', 
    userAuthorization(["superadmin", "admin", "finance", "procurement", "stock", "librarian", "hr"]),
    notificationController.updateAllNotificationsStatusController
);

router.delete('/:id', 
    userAuthorization(["superadmin", "admin", "finance", "procurement", "stock", "librarian", "hr"]),
    notificationController.deleteNotificationController
);

export default router;