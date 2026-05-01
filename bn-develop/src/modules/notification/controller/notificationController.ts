// src/modules/notification/controller/notificationController.ts
import { Request, Response, RequestHandler } from 'express';
import { 
    getNotificationsByUserId, 
    updateNotificationStatus, 
    deleteNotification, 
    getNotificationById,
    updateAllNotificationsStatus 
} from '../repository/notificationRepo';

interface ExtendedRequest extends Request {
    user: {
        id: string;
        role: string;
    };
}

export const getNotificationsByUserIdController = async (req: ExtendedRequest, res: Response) => {
    try {
        const notifications = await getNotificationsByUserId(req.user.id);
        if (!notifications || notifications.length === 0) {
            res.status(404).json({ message: 'No notifications found' });
            return;
        }
        res.status(200).json(notifications);
    } catch (error:any) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" ,error: error.message });
      }
};

export const getNotificationByIdController = async (req: ExtendedRequest, res: Response) => {
    try {
        const notification = await getNotificationById(req.user.id, req.params.id as string);
        if (!notification) {
            res.status(404).json({ message: 'Notification not found' });
            return;
        }
        res.status(200).json(notification);
    } catch (error:any) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" ,error: error.message });
      }
};

const updateNotificationStatusController = async (req: ExtendedRequest, res: Response) => {
    try {
        const updatedNotification = await updateNotificationStatus(req.params.id as string);
        if (!updatedNotification) {
            res.status(404).json({ message: 'Notification not found' });
            return;
        }
        res.status(200).json({message: "Notification updated successfully"});
    } catch (error:any) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" ,error: error.message });
      }
};

const updateAllNotificationsStatusController = async (req: ExtendedRequest, res: Response) => {
    try {
        const updatedNotifications = await updateAllNotificationsStatus(req.user.id);
        if (!updatedNotifications || updatedNotifications.modifiedCount === 0) {
            res.status(404).json({ message: 'No notifications found' });
            return;
        }
        res.status(200).json({message: "All notifications updated successfully"});
    } catch (error:any) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" ,error: error.message });
      }
};

const deleteNotificationController = async (req: ExtendedRequest, res: Response) => {
    try {
        const deletedNotification = await deleteNotification(req.params.id as string);
        if (!deletedNotification) {
            res.status(404).json({ message: 'Notification not found' });
            return;
        }
        res.status(200).json({message: "Notification deleted successfully"});
    } catch (error:any) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" ,error: error.message });
      }
};

export default {
    getNotificationsByUserIdController,
    getNotificationByIdController,
    updateNotificationStatusController,
    updateAllNotificationsStatusController,
    deleteNotificationController
}
