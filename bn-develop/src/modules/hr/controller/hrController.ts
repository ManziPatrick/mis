// hr controller
import { Request, Response } from "express";
import { IEmployee } from "../../../utils/types";
import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployees,
  updateEmployee,
  sendEmployeeDeleteRequest,
  handleDeleteRequest,
  getEmployeeDeleteRequests,
  getEmployeeDeleteRequestById,
} from "../repository/hrRepository";
import { uploadFile } from "../../../utils";
import { eventEmitter } from "../../notification/services/notificationService";
import { NotificationService } from "../../notification/services/notificationService";
import { UserService } from "../../user/services/userService";

interface ExtendedRequest extends Request {
  user: {
      id: string;
      role: string;
      firstName?: string;
      lastName?: string;
  };
}

export class hrController {
  private notificationService: NotificationService;
  private userService: UserService;
  private static isInitialized = false;

  constructor() {
      this.notificationService = new NotificationService();
      this.userService = new UserService();

      if (!hrController.isInitialized) {
        this.setupNotificationListeners();
        hrController.isInitialized = true;
    }
  }

      private async setupNotificationListeners() {
      // Listen for supplier creation events
      eventEmitter.on('employee-created', async (data: {
        name: string;
        department: string;
        occupation: string;
        nationality: string;
        netSalary: number;
        requestedBy: string;
      }) => {
          try {
              // Get admin users
              const adminUsers = await this.userService.getUsersByRole('admin');

              if (adminUsers.length === 0) {
                  console.log('No admin users found for notification');
                  return;
              }

              await this.notificationService.notifyEmployeeCreation({
                  name: data.name,
                  department: data.department,
                  occupation: data.occupation,
                  nationality: data.nationality,
                  netSalary: data.netSalary,
                  requestedBy: data.requestedBy,
                  adminIds: adminUsers.map(user => user._id.toString())
              });

              // Send email notifications to admin users
              const adminEmails = adminUsers.map(user => user.email).filter(Boolean);
              
              if (adminEmails.length > 0) {
                  await this.notificationService.sendEmployeeCreationEmail({
                      name: data.name,
                      department: data.department,
                      occupation: data.occupation,
                      nationality: data.nationality,
                      netSalary: data.netSalary,
                      requestedBy: data.requestedBy,
                      adminEmails
                  });
              }
          } catch (error) {
              console.error('Error in employee-created listener:', error);
          }
      });

      // Listen for supplier approval events
      eventEmitter.on('employee-approved', async (data: {
          name: string;
          approvedBy: string;
      }) => {
          try {
              // Get hr users
              const hrUsers = await this.userService.getUsersByRole('hr');

              if (hrUsers.length === 0) {
                  console.log('No hr users found for notification');
                  return;
              }

              await this.notificationService.notifyEmployeeApproval({
                  name: data.name,
                  approvedBy: data.approvedBy,
                  hrIds: hrUsers.map(user => user._id.toString())
              });

              // Send email notifications to hr users
              const hrEmails = hrUsers.map(user => user.email).filter(Boolean);
              
              if (hrEmails.length > 0) {
                  await this.notificationService.sendEmployeeApprovalEmail({
                      name: data.name,
                      approvedBy: data.approvedBy,
                      hrEmails
                  });
              }
          } catch (error) {
              console.error('Error in employee-approved listener:', error.message);
          }
      });

      // Listen for employee rejection events
      eventEmitter.on('employee-rejected', async (data: {
          name: string;
          rejectedBy: string;
      }) => {
          try {
              // Get hr users
              const hrUsers = await this.userService.getUsersByRole('hr');

              if (hrUsers.length === 0) {
                  console.log('No hr users found for notification');
                  return;
              }

              await this.notificationService.notifyEmployeeRejection({
                  name: data.name,
                  rejectedBy: data.rejectedBy,
                  hrIds: hrUsers.map(user => user._id.toString())
              });

              // Send email notifications to hr users
              const hrEmails = hrUsers.map(user => user.email).filter(Boolean);
              
              if (hrEmails.length > 0) {
                  await this.notificationService.sendEmployeeRejectionEmail({
                      name: data.name,
                      rejectedBy: data.rejectedBy,
                      hrEmails
                  });
              }
          } catch (error) {
              console.error('Error in employee-rejected listener:', error.message);
          }
      });

      // Listen for employee deletion request events
      eventEmitter.on('employee-deletion-requested', async (data: {
        name: string;
        requestedBy: string;
        reason: string;
        }) => {
        try {
            // Get admin users
            const adminUsers = await this.userService.getUsersByRole('admin');
            
            if (adminUsers.length === 0) {
                console.log('No admin users found for notification');
                return;
            }

            await this.notificationService.notifyEmployeeDeletionRequest({
                name: data.name,
                requestedBy: data.requestedBy,
                reason: data.reason,
                adminIds: adminUsers.map(user => user._id.toString())
            });

            // Send email notifications to admins
            const adminEmails = adminUsers.map(user => user.email).filter(Boolean);
            
            if (adminEmails.length > 0) {
                await this.notificationService.sendEmployeeDeletionRequestEmail({
                    name: data.name,
                    requestedBy: data.requestedBy,
                    reason: data.reason,
                    adminEmails
                });
            }
        } catch (error) {
            console.error('Error in employee-deletion-requested listener:', error);
        }
      });

        // Listen for empployee deletion approvals
        eventEmitter.on('employee-deletion-approved', async (data: {
            name: string;
            approvedBy: string;
        }) => {
            try {
                // Get hr users
                const hrUsers = await this.userService.getUsersByRole('hr');

                if (hrUsers.length === 0) {
                    console.log('No hr users found for notification');
                    return;
                }

                await this.notificationService.notifyEmployeeDeletionApproval({
                    name: data.name,
                    approvedBy: data.approvedBy,
                    hrIds: hrUsers.map(user => user._id.toString())
                });
                // Send email notifications to hr users
                const hrEmails = hrUsers.map(user => user.email).filter(Boolean);
                
                if (hrEmails.length > 0) {
                    await this.notificationService.sendEmployeeDeletionApprovalEmail({
                        name: data.name,
                        approvedBy: data.approvedBy,
                        hrEmails
                    });
                }

            } catch (error) {
                console.error('Error in employee-deletion-approved listener:', error);
            }
        });

        // Listen for employee deletion rejections
        eventEmitter.on('employee-deletion-rejected', async (data: {
          name: string;
          rejectedBy: string;
        }) => {
          try {
              // Get hr users
              const hrUsers = await this.userService.getUsersByRole('hr');

              if (hrUsers.length === 0) {
                  console.log('No hr users found for notification');
                  return;
              }

              await this.notificationService.notifyEmployeeDeletionRejection({
                  name: data.name,
                  rejectedBy: data.rejectedBy,
                  hrIds: hrUsers.map(user => user._id.toString())
              });

              // Send email notifications to hr users
              const hrEmails = hrUsers.map(user => user.email).filter(Boolean);
              
              if (hrEmails.length > 0) {
                  await this.notificationService.sendEmployeeDeletionRejectionEmail({
                      name: data.name,
                      rejectedBy: data.rejectedBy,
                      hrEmails
                  });
              }
          } catch (error) {
              console.error('Error in employee-deletion-rejected listener:', error);
          }
      });
    }
}

export const createEmployeeController = async (req: ExtendedRequest, res: Response) => {
  try {
    const {
      name,
      department,
      occupation,
      type,
      nationality,
      dateOfJoining,
      netSalary,
      email,
      phone,
      transportAllowence
    } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let nationalIdPdf, visaPdf, passportPdf, contractPdf;
  
    if(transportAllowence > netSalary){
      res.status(400).json({ message: "Transport allowance cannot exceed net salary" });
      return;
    }
    if (nationality === "rwandan") {
      if (!req.body.nationalId || !files?.nationalIdPdf) {
        res
          .status(400)
          .json({ message: "National ID and PDF are required for Rwandans" });
        return;
      }
      nationalIdPdf = await uploadFile(files.nationalIdPdf[0]);
    }
    if (nationality === "foreigner") {
      if (!files?.visaPdf || !files?.passportPdf) {
        res
          .status(400)
          .json({
            message: "Visa and Passport PDFs are required for Foreigners",
          });
        return;
      }
      visaPdf = await uploadFile(files.visaPdf[0]);
      passportPdf = await uploadFile(files.passportPdf[0]);
    }
    if (!files?.contractPdf) {
      res.status(400).json({ message: "Contract PDF is required" });
      return;
    }
    contractPdf = await uploadFile(files.contractPdf[0]);
    let employee: IEmployee;
    if (nationality === "rwandan") {
      employee = {
          name,
          department,
          occupation,
          type,
          nationality,
          nationalId: req.body.nationalId || null,
          nationalIdPdf: nationalIdPdf?.file.url || null,
          dateOfJoining,
          contractPdf: contractPdf?.file.url || null,
          netSalary,
          email,
          phone,
          transportAllowence,
        };
    }else{
      employee = {
        name,
        department,
        occupation,
        type,
        nationality,
        visaPdf: visaPdf?.file.url || null,
        passportPdf: passportPdf?.file.url || null,
        dateOfJoining,
        contractPdf: contractPdf?.file.url || null,
        netSalary,
        email,
        phone,
        transportAllowence
      };
    }
    const newEmployee = await createEmployee(employee);
    // Emit event for employee creation
    eventEmitter.emit('employee-created', {
      name: newEmployee.name,
      department: newEmployee.department,
      occupation: newEmployee.occupation,
      nationality: newEmployee.nationality,
      netSalary: newEmployee.netSalary,
      requestedBy: `${req.user.firstName} ${req.user.lastName}`,
    });
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEmployeesController = async (req: Request, res: Response) => {
  try {
    const employees = await getEmployees();
    if (!employees || employees.length === 0) {
      res.status(404).json({ message: "No employees found" });
      return;
    }
    res.status(200).json(employees);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
};

export const getEmployeeByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const employee = await getEmployeeById(req.params.id as string);
    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }
  res.status(200).json(employee);
  } catch (error:any) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" ,error: error.message });
  }
};

export const updateEmployeeController = async (req: Request, res: Response) => {
  try {
    const employee = await updateEmployee(req.params.id as string, req.body);
    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }
    res.status(200).json(employee);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
};

export const sendEmployeeDeleteRequests = async (req: ExtendedRequest, res: Response) => {
  try {

    const employeeId = req.params.id;
    const employee = await getEmployeeById(employeeId as string);
    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }
    if (employee.delete_status === "pending") {
      res.status(400).json({ message: "Delete request already sent" });
      return;
    }
    const { delete_reason } = req.body;
    if (!delete_reason) {
      res.status(400).json({ message: "Delete reason is required" });
      return;
    }
    const deletionRequest = await sendEmployeeDeleteRequest(req.params.id as string, delete_reason);
    // Emit event for employee deletion request
    eventEmitter.emit('employee-deletion-requested', {
      name: employee.name,
      requestedBy: `${req.user.firstName} ${req.user.lastName}`,
      reason: delete_reason,
    });
    res.status(201).json(deletionRequest);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
}

export const AdminApprovalEmployee = async (req: ExtendedRequest, res: Response) => {
  try {
    const { status, rejectedReason } = req.body;
    const result = await updateEmployee(req.params.employeeId as string, { status, rejected_reason: rejectedReason });

    if (status === 'rejected' && !rejectedReason) {
      res.status(400).json({ message: "Rejected reason is required" });
      return;
    }

    // Emit event for employee approval/rejection
    if (status === 'approved') {
      eventEmitter.emit('employee-approved', {
        name: result.name,
        approvedBy: `${req.user.firstName} ${req.user.lastName}`,
      });
    } else if (status === 'rejected') {
      eventEmitter.emit('employee-rejected', {
        name: result.name,
        rejectedBy: `${req.user.firstName} ${req.user.lastName}`,
      });
    }
    res
      .status(200)
      .json({
        message: "Employee status updated successfully",
        employee: result,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleEmployeeDeleteRequest = async (req: ExtendedRequest, res: Response) => {
  try {
    const employee = await handleDeleteRequest(req.params.id as string, req.body.delete_status, req.body.rejectedReason);
    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    if(req.body.delete_status === "rejected" && !req.body.rejectedReason) {
      res.status(400).json({ message: "Rejected reason is required" });
      return;
    }

    // Emit event for employee deletion approval/rejection
    if (req.body.delete_status === 'approved') {
      eventEmitter.emit('employee-deletion-approved', {
        name: employee.name,
        approvedBy: `${req.user.firstName} ${req.user.lastName}`,
      });
    } else if (req.body.delete_status === 'rejected') {
      eventEmitter.emit('employee-deletion-rejected', {
        name: employee.name,
        rejectedBy: `${req.user.firstName} ${req.user.lastName}`,
      });
    }
    res.status(200).json({message: "Employee delete status updated successfully", employee: employee});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
}

export const getEmployeeDeleteRequestsController = async (req: Request, res: Response) => {
  try {
    const employees = await getEmployeeDeleteRequests();
    if (!employees || employees.length === 0) {
      res.status(404).json({ message: "No delete requests found" });
      return;
    }
    res.status(200).json(employees);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
}

export const getEmployeeDeleteRequestByIdController = async (req: Request, res: Response) => {
  try {
    const employee = await getEmployeeDeleteRequestById(req.params.id as string);
    if (!employee) {
      res.status(404).json({ message: "Delete request not found" });
      return;
    }
    res.status(200).json(employee);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
}

export const deleteEmployeeController = async (req: Request, res: Response) => {
  try {
    const employee = await getEmployeeById(req.params.id as string);
    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }
    if (employee.delete_status === "pending") {
      res.status(400).json({ message: "Waiting for admin approval to delete employee" });
      return;
    }
    if (employee.delete_status === "rejected") {
      res.status(400).json({ message: "Delete request rejected" });
      return;
    }
    await deleteEmployee(req.params.id as string);
    res.status(200).json(employee);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
};
