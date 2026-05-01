// src/modules/notification/services/notificationSocket.ts
import { Server } from 'socket.io';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const setupNotificationSocket = (io: Server) => {
    io.on('connection', (socket) => {
        socket.on("join", (token) => {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
                const userId = decoded.id;
                socket.join(userId);
                console.log(`User ${userId} connected`);
            } catch (error) {
                console.error("invalid token");
            }
        });
        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });
};
