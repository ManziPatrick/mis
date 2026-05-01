// src/routes/authRoutes.ts
import express, { Router, Response } from 'express';
import authController, { forgetPassword, resendPasswordResetEmail, resetPassword, verifyOTP, resendOTP } from '../modules/auth/controller/authController';
import { passwordResetLimiter } from '../middlewares';

const router: Router = Router();

router.post('/login', authController.login);
router.post('/forgot-password',passwordResetLimiter, forgetPassword);
router.post('/resend-reset-link', passwordResetLimiter, resendPasswordResetEmail);
router.post('/reset-password/:token', resetPassword);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
export default router;