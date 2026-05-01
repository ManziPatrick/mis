// procurement controller
import { Request, Response } from "express";
import {
  createSupplier,
  deleteSupplier,
  getSupplier,
  getSupplierById,
  handleDeleteRequest,
  requestDeleteSupplier,
  updateSupplier,
} from "../repositories/procurementRepositories";
import { uploadFile } from "../../../utils";
import { IRequestUser } from "../../../utils/types";
import { eventEmitter } from '../../notification/services/notificationService';
import { NotificationService } from '../../notification/services/notificationService';
import { UserService } from '../../user/services/userService';

interface ExtendedRequest extends Request {
  user: {
      id: string;
      role: string;
      firstName?: string;
      lastName?: string;
  };
}

export class ProcurementController {
    private notificationService: NotificationService;
    private userService: UserService;
    private static isInitialized = false;

    constructor() {
        this.notificationService = new NotificationService();
        this.userService = new UserService();

        if (!ProcurementController.isInitialized) {
          this.setupNotificationListeners();
          ProcurementController.isInitialized = true;
      }
    }

        private async setupNotificationListeners() {
        // Listen for supplier creation events
        eventEmitter.on('supplier-created', async (data: {
            supplierName: string;
            commodity: string;
            createdBy: string;
        }) => {
            try {
                // Get admin users
                const adminUsers = await this.userService.getUsersByRole('admin');

                if (adminUsers.length === 0) {
                    console.log('No admin users found for notification');
                    return;
                }

                await this.notificationService.notifySupplierCreation({
                    supplierName: data.supplierName,
                    commodity: data.commodity,
                    createdBy: data.createdBy,
                    adminIds: adminUsers.map(user => user._id.toString())
                });

                // Send email notifications to admin users
                const adminEmails = adminUsers.map(user => user.email).filter(Boolean);
                
                if (adminEmails.length > 0) {
                    await this.notificationService.sendSupplierCreationEmail({
                        name: data.supplierName,
                        commodity: data.commodity,
                        requestedBy: data.createdBy,
                        adminEmails
                    });
                }
            } catch (error) {
                console.error('Error in supplier-created listener:', error);
            }
        });

        // Listen for supplier approval events
        eventEmitter.on('supplier-approved', async (data: {
            supplierName: string;
            approvedBy: string;
        }) => {
            try {
                // Get procurement users
                const procurementUsers = await this.userService.getUsersByRole('procurement');

                if (procurementUsers.length === 0) {
                    console.log('No procurement users found for notification');
                    return;
                }

                await this.notificationService.notifySupplierApproval({
                    supplierName: data.supplierName,
                    approvedBy: data.approvedBy,
                    procurementIds: procurementUsers.map(user => user._id.toString())
                });

                // Send email notifications to procurement users
                const procurementEmails = procurementUsers.map(user => user.email).filter(Boolean);
                
                if (procurementEmails.length > 0) {
                    await this.notificationService.sendSupplierApprovalEmail({
                        name: data.supplierName,
                        approvedBy: data.approvedBy,
                        procurementEmails
                    });
                }
            } catch (error) {
                console.error('Error in supplier-approved listener:', error);
            }
        });

        // Listen for supplier rejection events
        eventEmitter.on('supplier-rejected', async (data: {
            supplierName: string;
            rejectedBy: string;
        }) => {
            try {
                // Get procurement users
                const procurementUsers = await this.userService.getUsersByRole('procurement');

                if (procurementUsers.length === 0) {
                    console.log('No procurement users found for notification');
                    return;
                }

                await this.notificationService.notifySupplierRejection({
                    supplierName: data.supplierName,
                    rejectedBy: data.rejectedBy,
                    procurementIds: procurementUsers.map(user => user._id.toString())
                });

                // Send email notifications to procurement users
                const procurementEmails = procurementUsers.map(user => user.email).filter(Boolean);
                
                if (procurementEmails.length > 0) {
                    await this.notificationService.sendSupplierRejectionEmail({
                        name: data.supplierName,
                        rejectedBy: data.rejectedBy,
                        procurementEmails
                    });
                }
            } catch (error) {
                console.error('Error in supplier-rejected listener:', error);
            }
        });
      }
}

// Create a single instance
const procurementController = new ProcurementController();


export const createSupplierController = async (req: ExtendedRequest, res: Response) => {
  try {
    const uploadingImage = await uploadFile(req.file);
    req.body.contract = uploadingImage.file.url;
    // Check if supplier with phone number already exists
    const existingSuppliers = await getSupplier();
    const existingSupplier = existingSuppliers.find(supplier => supplier.phone === req.body.phone);
    if (existingSupplier) {
      res.status(400).json({ message: 'A supplier with this phone number already exists' });
      return;
    }
    const supplier = await createSupplier(req.body);
    // Emit supplier creation event for notifications
    eventEmitter.emit('supplier-created', {
        supplierName: supplier.name,
        commodity: supplier.commodity,
        createdBy: `${req.user.firstName} ${req.user.lastName}`
    });
    res
      .status(201)
      .json({ message: "Supplier created successfully", supplier });
  } catch (error:any) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" ,error: error.message });
  }
};

export const getSupplierController = async (req: Request, res: Response) => {
  try {
    const supplier = await getSupplier();
    if(!supplier) {
      res.status(404).json({ message: "Supplier not found" });
      return;
    }
    res.status(200).json({supplier});
  } catch (error:any) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" ,error: error.message });
  }
};

export const getSupplierByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const supplier = await getSupplierById(req.params.id as string);
    if(!supplier) {
      res.status(404).json({ message: "Supplier not found" });
      return;
    }
    res.status(200).json(supplier);
  }catch (error:any) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" ,error: error.message });
  }
};

export const updateSupplierController = async (req: ExtendedRequest, res: Response) => {
    try {
      const result = await updateSupplier(req.params.id as string, req.body);
      const { changes } = result;

      if (Object.keys(changes).length === 0) {
        res.status(403).json({ message: "No changes made to the supplier" });
        return;
      }
  
      if (changes.status) {
        res.status(200).json({
          message: `Supplier status updated from ${changes.status.from} to ${changes.status.to} successfully`,
          supplier: result.supplier,
        });
        return;
      }

      res.status(200).json({ 
        message: "Supplier updated successfully", 
        supplier: result.supplier 
      });
    }catch (error:any) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" ,error: error.message });
    }
};

export const requestDeleteSupplierController = async (req: IRequestUser, res: Response) => {
  try {
    const supplierId = req.params.id
    const userId = req.user.id
    const supplier = await getSupplierById(supplierId as string);
    if(!supplier) {
      res.status(404).json({ message: "Supplier not found" });
      return;
    }

    if(supplier.status === "pending") {
      res.status(400).json({ message: "Supplier request is already pending"});
      return;
    }

    const deleteRequest = await requestDeleteSupplier(supplierId as string,req.body.reason,userId as string)
    res.status(200).json({ message: "Supplier deletion request sent successfully", deleteRequest });
  } catch (error:any) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" ,error: error.message });
  }
};

export const deleteSupplierController = async (req: Request, res: Response) => {
  try {
    const supplier = await getSupplierById(req.params.id as string);
    if(!supplier) {
      res.status(404).json({ message: "Supplier not found" });
      return;
    }
      if(supplier.status !== "approved") {
        res.status(400).json({ message: "Supplier deletion request is not approved" });
      return;
    }
    await deleteSupplier(req.params.id as string);
    res
      .status(200)
      .json({ message: "Supplier deleted successfully" });
  } catch (error:any) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" ,error: error.message });
  }
};

export const approveDeleteSupplierController = async (req: IRequestUser, res: Response) => {
  try {
    const supplier = await getSupplierById(req.params.id as string);
    if(!supplier) {
      res.status(404).json({ message: "Supplier not found" });
      return;
    }
    const deletedSupplier = await handleDeleteRequest(req.params.id as string,req.body.status,req.user.id as string, req.body.rejectedReason);
    if(req.body.status === "rejected" && !req.body.rejectedReason) {
      res.status(400).json({ message: "Rejected reason is required" });
      return;
    }
    res.status(200).json({ message: "Supplier deletion request approved successfully", deletedSupplier });
  } catch (error:any) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" ,error: error.message });
  }
};

