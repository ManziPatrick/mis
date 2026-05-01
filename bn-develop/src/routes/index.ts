// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import financeRoutes from './financeRoutes';
import notificationRoutes from './notificationRoutes';
import libraryRoutes from './libraryRoutes';
import stockRoutes from './stockRoutes';
import procurementRoutes from './procurementRoutes';
import hrRoutes from './hrRoutes';
import reportRoutes from './reportRoutes';
import studentRouter from './studentRoutes';
const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/finance', financeRoutes);
router.use('/notification', notificationRoutes);
router.use('/library', libraryRoutes);
router.use('/stock', stockRoutes);
router.use('/procurement', procurementRoutes);
router.use('/hr', hrRoutes);
router.use('/student', studentRouter)
router.use('/report',reportRoutes);

export default router;