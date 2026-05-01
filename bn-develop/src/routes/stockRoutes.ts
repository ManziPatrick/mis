// stock routes
import { Router } from "express";
import {
  createAssetsController,
  getAssetsController,
  getAssetsByIdController,
  updateAssetsController,
  createCategoryController,
  getCategoryController,
  getStockController,
  createStockController,
  getTransactionsByStock,
  getAllTransactionsController,
  outOfStockController,
  getStockByIdController,
  updateStockController,
  deleteAssetsController,
  approveUniformPaymentController,
  getUniformPaymentByIdController,
  getUniformPaymentController,
  getCategoryByIdController,
  filterStockByCategoryNameController,
  filterStockByCategoryWithPaginationController,
  createUniformController,
  updateUniformsController,
  updateUniformsItemsController,
  getAllUniformStockController,
  getAllSuppliesController,
  getSupplyBySupplierIdController,
  getUnpaidSuppliesBySupplierIdController,
  createFacultyController
} from "../modules/stock/controller/stockController";
import { userAuthorization } from "../middlewares/auth";
import {
  assetsValidation,
  checkUniformStock,
  isAssetsExist,
  isSupplierApproved,
} from "../middlewares";
import upload from "../utils/multer";
import { addPaperBlades, getAllPaperBlades, usagePaperBlade } from "../modules/paperBlade/controller/paperBladeController";
const stockRoutes = Router();

stockRoutes.post(
  "/assets",
  userAuthorization(["stock"]),
  assetsValidation,
  createAssetsController
);

stockRoutes.post(
  "/category",
  userAuthorization(["stock"]),
  createCategoryController
);
stockRoutes.get(
  "/category",
  userAuthorization(["stock"]),
  getCategoryController
);
stockRoutes.post(
  "/",
  userAuthorization(["stock"]),
  upload.single("proofOfDelivery"),
  isSupplierApproved,
  createStockController
);
stockRoutes.post('/paper-blade', userAuthorization(["admin","stock"]), addPaperBlades);
stockRoutes.post('/create-faculty',userAuthorization(["stock"]),createFacultyController);
stockRoutes.post('/uniform',userAuthorization(["stock"]), upload.single("proofOfDelivery"), createUniformController);
stockRoutes.get('/get-paper-blades',userAuthorization(["stock"]), getAllPaperBlades)
stockRoutes.post('/usage-paper-blades',userAuthorization(["stock"]),usagePaperBlade)
stockRoutes.get('/all-uniforms',userAuthorization(["stock","finance"]),getAllUniformStockController)
stockRoutes.get('/get-supplies',userAuthorization(["stock","procurement","finance","admin"]),getAllSuppliesController)
stockRoutes.get(
  "/transactions",
  userAuthorization(["stock"]),
  getAllTransactionsController
);

stockRoutes.get("/assets", userAuthorization(["stock"]), getAssetsController);

stockRoutes.get(
  "/uniform-payment",
  userAuthorization(["stock", "finance"]),
  getUniformPaymentController
);

stockRoutes.get('/category/:categoryId/paginated', filterStockByCategoryWithPaginationController);

stockRoutes.get('/get-supply/:id', userAuthorization(["stock","procurement","finance","admin"]),getSupplyBySupplierIdController)
stockRoutes.get('/get-unpaid-supplies/:id', userAuthorization(["stock","procurement","finance","admin"]),getUnpaidSuppliesBySupplierIdController)
stockRoutes.get(
  "/category/:id",
  userAuthorization(["stock"]),
  getCategoryByIdController
);

stockRoutes.get(
  "/category/name/:categoryName",
  filterStockByCategoryNameController
);

stockRoutes.put(
  "/:stockId",
  userAuthorization(["stock"]),
  upload.single("proofOfDelivery"),
  updateStockController
);

stockRoutes.get(
  "/assets/:id",
  userAuthorization(["stock"]),
  isAssetsExist,
  getAssetsByIdController
);
stockRoutes.put(
  "/assets/:id",
  userAuthorization(["stock"]),
  isAssetsExist,
  updateAssetsController
);
stockRoutes.delete(
  "/assets/:id",
  userAuthorization(["stock"]),
  isAssetsExist,
  deleteAssetsController
);

stockRoutes.post(
  "/:stockId/stockout",
  userAuthorization(["stock"]),
  outOfStockController
);
stockRoutes.get("/", userAuthorization(["stock"]), getStockController);
stockRoutes.get(
  "/:stockId/transactions",
  userAuthorization(["stock"]),
  getTransactionsByStock
);

stockRoutes.put(
  "/uniform-payment/:id/approve",
  userAuthorization(["stock"]),
  checkUniformStock,
  approveUniformPaymentController
);

stockRoutes.get(
  "/uniform-payment/:id",
  userAuthorization(["stock", "finance"]),
  getUniformPaymentByIdController
);
stockRoutes.get(
  "/:stockId",
  userAuthorization(["stock"]),
  getStockByIdController
);

stockRoutes.put('/update-uniform-stock/:id', userAuthorization(["stock"]),updateUniformsController)
stockRoutes.put('/update-uniform-items/:id', userAuthorization(["stock"]),
updateUniformsItemsController)
export default stockRoutes;
