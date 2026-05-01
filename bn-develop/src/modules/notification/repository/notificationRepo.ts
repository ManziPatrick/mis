// src/modules/notification/repository/notificationRepo.ts
import { Notification } from '../../../database/model/notifications';
import { NotificationType } from '../../../utils/notificationTypes';

export class NotificationRepo {
  async create(notificationData: {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    status: string;
  }) {
    return await Notification.create(notificationData);
  }
}

interface NotificationData {
  user: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
}

export const createNotification = async (data: NotificationData) => {
  return await Notification.create(data);
};

export const getNotificationsByUserId = async (id: string) => {
    return await Notification.find({ user: id })
        .sort({ createdAt: -1 });
};

export const updateNotificationStatus = async (id: string) => {
    return await Notification.findByIdAndUpdate(
        id, 
        { isRead: true }, 
        { new: true }
    );
};

export const deleteNotification = async (id: string) => {
    return await Notification.findByIdAndDelete(id);
};

export const getNotificationById = async (userId: string, id: string) => {
    return await Notification.findOne({ 
        user: userId,
        _id: id
    });
};

export const updateAllNotificationsStatus = async (userId: string) => {
    return await Notification.updateMany(
        { user: userId }, 
        { isRead: true }
    );
};

