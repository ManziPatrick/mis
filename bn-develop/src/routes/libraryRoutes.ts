// src/routes/libraryRoutes.ts
import { Router } from 'express';
import { userAuthorization } from '../middlewares/auth';
import {
    createBookController,
    getBooksController,
    getBookByIdController,
    updateBookController,
    deleteBookController,
    requestBookDeletion,
    getDeletionRequestsController,
    handleDeletionRequestController,
    getDeletionRequestByIdController
} from '../modules/library/controller/libraryController';

const router = Router();

router.post('/books', userAuthorization(["librarian"]), createBookController);
router.get('/books', userAuthorization(["admin","librarian", "superadmin"]), getBooksController);
router.get('/books/:id', userAuthorization(["admin","librarian", "superadmin"]), getBookByIdController);
router.put('/books/:id', userAuthorization(["librarian"]), updateBookController);
router.delete('/books/:id', userAuthorization(["librarian"]), deleteBookController);

router.post('/books/:id/deletion-request', userAuthorization(["librarian"]), requestBookDeletion);
router.get('/deletion-requests', userAuthorization(["admin"]), getDeletionRequestsController);
router.get('/deletion-requests/:id', userAuthorization(["admin"]), getDeletionRequestByIdController);
router.put('/books/:id/deletion-request', userAuthorization(["admin"]), handleDeletionRequestController);


export default router;
