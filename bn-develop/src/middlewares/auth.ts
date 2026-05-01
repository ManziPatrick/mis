// src/middlewares/auth.ts
import { Request, Response, NextFunction } from 'express';
import { decodeToken } from '../helper';
import { getUserById } from '../modules/user/repository';
import { IUser } from '../modules/user/repository';
import { SessionModel } from '../database/model/session';

interface ExtendendRequest extends Request {
    user?: any;
    session?: any;
}

export const userAuthorization = function (roles: string[]) {
    return async (req: ExtendendRequest, res: Response, next: NextFunction) => {
        try {
            const token = req.headers["authorization"]?.split(" ")[1];
            if (!token) {
                res.status(400).json({message: 'Token is required'});
                return;
            }

            let decoded: any;
            try {
                decoded = await decodeToken(token);
            } catch (error) {
                res.status(401).json({message: 'Invalid or expired token'});
                return;
            }

            // Check for session
            const session = await SessionModel.findOne({
                userId: decoded.id
            });

            if (!session) {
                res.status(401).json({message: 'No active session found. Please login again'});
                return;
            }

            // Check if OTP verification is needed
            if (session.otp) {
                if (session.otpExpire && session.otpExpire > new Date()) {
                    res.status(401).json({
                        message: 'OTP verification required',
                        requiresOTP: true
                    });
                    return;
                } else {
                    // OTP expired
                    await SessionModel.findByIdAndUpdate(session._id, {
                        $unset: { otp: 1, otpExpire: 1 }
                    });
                }
            }

            const userResult = await getUserById(decoded.id);
            if (!userResult) {
                res.status(400).json({message: 'User not found'});
                return;
            }

            const user: any = await userResult.populate({ 
                path: 'role', 
                select: '-createdAt -updatedAt -__v' 
            });

            if (!roles.includes(user.role.roleName)) {
                res.status(403).json({ message: 'Unauthorized' });
                return;
            }

            req.user = user;
            req.session = session;
            next();
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    };
};