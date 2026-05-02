import { Request, Response, RequestHandler } from 'express';
import { getUserByEmail } from '../repository/authRepository';
import { comparePassword, decodeToken, generateToken, hashPassword } from '../../../helper/index';
import { eventEmitter } from "../../notification/services/notificationService";
import { NotificationService } from "../../notification/services/notificationService";
import Crypto from "crypto";
import { SessionModel } from "../../../database/model/session";
import { findUserByEmail, getUserById, restPassword } from '../../user/repository';
import { generateOTP } from '../../../helper/index';
const notificationService = new NotificationService();
const login = async (req: Request, res: Response): Promise<void> => {     
    try {
        const { email, password } = req.body;
        const user = await getUserByEmail(email);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        if(!user.isActive){
          res.status(403).json({ message: "Account is no longer in system."})
          return;
        }
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid password' });
            return;
        }

        const token = await generateToken(user._id.toString());

        // Create or update session in database
        await SessionModel.findOneAndUpdate(
            { userId: user._id },
            { userId: user._id },
            { upsert: true, new: true }
        );

        const userData = {
            firstName: user.firstName,
            lastName: user.lastName,
            role: (user.role as any).roleName || user.role, // Handle populated or unpopulated role
        }

        res.status(200).json({ 
            message: 'Login successful',
            token,
            user: userData
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


export const forgetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);

    // Check if user exists
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(403).json({ message: "Account is no longer in the system" });
      return;
    }

    // Check for an existing session
    const existingSession = await SessionModel.findOne({
      userId: user.id,
    });


    if (existingSession) {
      // Check if the existing token is still valid
      if ((existingSession as any).resetPasswordExpire > new Date()) {
        res.status(429).json({
          message:
            "A password reset link has already been sent. Please check your email.",
        });
        return;
      }

      // If token is expired, remove it
      await SessionModel.deleteOne({ _id: existingSession._id });
    }

    // Generate new token and set expiration
    const resetTokenExpiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    const hashToken = await generateToken(user.id);

    // Save new session in the database
    const sessionModel = new SessionModel({
      userId: user.id,
      resetPasswordToken: hashToken,
      resetPasswordExpire: resetTokenExpiration,
    });
    await sessionModel.save();

    // Send password reset email
    await notificationService.sendPasswordResetEmail({
      email,
      resetToken: hashToken,
      names: `${user.firstName} ${user.lastName}`,
    });

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

  
  export const resetPassword = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;
      if(!newPassword || newPassword.length < 8){
        res.status(400).json({ message: "Password must be at least 8 characters" });
        return;
      }
      const session = await SessionModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: new Date() },
      });
      if (!session) {
          res.status(400).json({ message: "Invalid or expired token" });
          return;
        }
        const decode:any = await decodeToken(token as string);
        const user = await getUserById(decode.id)
        if (!user) {
          res.status(404).json({ message: "Account not found" });
          return;
        }

        if(!user.isActive){
          res.status(403).json({ message: "Acount is no longer in system"})
          return;
        }
  
      const hashedPassword = await hashPassword(newPassword);
      await restPassword(session.userId.toString(), hashedPassword);
  
      await SessionModel.deleteOne({ userId: session.userId });
      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  };
  
  export const resendPasswordResetEmail = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
  
      // Validate email format
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.status(400).json({ message: "Invalid email format" });
        return ;
      }
  
      // Check if user exists
      const user = await findUserByEmail(email);
      if(!user.isActive){
        res.status(403).json({ message: "Acount is no longer in system"})
        return;
      }
      if (!user) {
        res.status(200).json({
          message: "If the email exists, we have resent the password reset link.",
        });
        return;
      }
  
      // Check for an active reset session
      const existingSession = await SessionModel.findOne({
        userId: user.id,
        resetPasswordExpire: { $gt: new Date() }, // Check for valid token
      });
  
      if (!existingSession) {
        res.status(404).json({
          message: "No valid password reset request found. Please initiate a new request.",
        });
        return;
      }
  
      // Resend password reset email
      await notificationService.sendPasswordResetEmail({
        email,
        resetToken: existingSession.resetPasswordToken, // Use existing token
        names: `${user.firstName} ${user.lastName}`,
      });
  
      res.status(200).json({
        message: "Password reset email resent successfully. Please check your inbox.",
      });
    } catch (error) {
      console.error("Error in resendPasswordResetEmail:", error);
      res.status(500).json({ error: error.message });
    }
  };

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, otp } = req.body;

        const session = await SessionModel.findOne({
            userId,
            otp,
            otpExpire: { $gt: new Date() }
        });

        if (!session) {
            res.status(400).json({ message: 'Invalid or expired OTP' });
            return;
        }

        const user = await getUserById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const userData = {
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        }
        const token = await generateToken(user._id.toString());
        
        // Clear OTP after successful verification
        await SessionModel.findOneAndUpdate(
            { userId },
            { $unset: { otp: 1, otpExpire: 1 } }
        );

        res.status(200).json({ token, user: userData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const resendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
      const { userId } = req.body;

      const user = await getUserById(userId);
      if (!user) {
          res.status(404).json({ message: 'User not found' });
          return;
      }

      if (!user.isActive) {
          res.status(403).json({ message: "Account is no longer in system" });
          return;
      }

      // Generate new OTP
      const { otp, otpExpire } = generateOTP();

      // Update session with new OTP
      await SessionModel.findOneAndUpdate(
          { userId: user._id },
          { otp, otpExpire },
          { upsert: true }
      );

      // Send OTP via email
      await notificationService.sendOTPEmail({
          email: user.email,
          otp,
          firstName: user.firstName
      });

      // Send OTP via SMS if phone number exists
      const phoneNumber = user?.phoneNumber;
      await notificationService.sendOTPviaSMS(phoneNumber, otp);

      res.status(200).json({
          message: 'New OTP sent successfully',
          userId: user._id
      });

  } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?._id;
        if (userId) {
            await SessionModel.deleteOne({ userId });
        }
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export default { login };
