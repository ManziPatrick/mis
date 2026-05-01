// src/modules/user/controller/index.ts
import { Request, Response } from "express";
import {
  createUser,
  deleteUserById,
  getUsers,
  updateUserById,
  getUserById,
  getRoleByRoleId,
  restPassword,
  getUserByEmail,
  getUserPassword,
  createPersonalRequest,
  getPersonalRequests,
  getPersonalRequestById,
  updatePersonalRequest,
} from "../repository";
import { comparePassword, generatePassword, hashPassword } from "../../../helper/index";
import { uploadFile } from "../../../utils";
import { NotificationService } from "../../notification/services/notificationService";
import { getAllRoles } from "../repository";
import { updateSupplier } from "../../procurement/repositories/procurementRepositories";
import { updateEmployee } from "../../hr/repository/hrRepository";
import { eventEmitter } from "../../notification/services/notificationService";
import Crypto from "crypto";
import { SessionModel } from "../../../database/model/session";
import { User } from "../../../database/model/user";
import { PendingUpdate } from "../../../database/model/pendingRequest";
import { Uniform } from "../../../database/model/uniformStock";
interface ExtendedRequest extends Request {
  user: {
    id: string;
    role: string;
    firstName?: string;
    lastName?: string;
  };
  userData?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };

}

const notificationService = new NotificationService();

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, role_id, firstName, lastName, phoneNumber } = req.body;

    const password = await generatePassword();
    const hashedPassword = await hashPassword(password);
    const allowedRoles = [
      "stock",
      "finance",
      "librarian",
      "hr",
      "procurement",
      "admin",
    ];

    const role = await getRoleByRoleId(role_id);

    if (!role || !allowedRoles.includes(role?.roleName)) {
      res.status(400).json({ message: "Invalid role" });
      return;
    }

    const user = await createUser({
      email,
      password: hashedPassword,
      role: role_id,
      firstName,
      lastName,
      phoneNumber,
    });

    // Send welcome email
    await notificationService.sendUserWelcomeNotification({
      email: user.email,
      password: password,
      role: role.roleName,
      name: `${user.firstName} ${user.lastName}`,
      userId: user.id,
    });

    await notificationService.sendWelcomemessageViaSMS(
      user.phoneNumber,
      user.email,
      password,
      role.roleName,
      `${user.firstName} ${user.lastName}`
    );

    const responseUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      password: password,
    };

    res
      .status(201)
      .json({ message: "User created successfully", user: responseUser });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.params.id as string);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      const uploadingImage = await uploadFile(req.file);
      updateData.profilePicture = uploadingImage.file.url;
    }
    delete updateData.password;
    const user = await updateUserById(req.params.id as string, updateData);
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const userUpdatePassword = async (req: ExtendedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await getUserPassword(req.user.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const isPasswordMatch = await comparePassword(currentPassword, user.password);
    if (!isPasswordMatch) {
      res.status(400).json({ message: "Incorrect password" });
      return;
    }
    const hashedPassword = await hashPassword(newPassword);
    await restPassword(user.id, hashedPassword );
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await deleteUserById(req.params.id as string);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRoleByRoleNames = async (req: Request, res: Response) => {
  try {
    const roles = await getAllRoles();
    const allowedRoles = ["stock", "finance", "librarian", "hr", "procurement", "superadmin", "admin"];
    const filteredRoles = roles.filter((role) =>
      allowedRoles.includes(role.roleName)
    );
    if (filteredRoles.length === 0) {
      res.status(400).json({ message: "No roles found" });
      return;
    }
    res.status(200).json({ roles: filteredRoles });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRoleByRoleIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const role = await getRoleByRoleId(req.params.id as string);
    res.status(200).json({ role });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message});
  }
};

export const adminApprovalSupplier = async (
  req: ExtendedRequest,
  res: Response
) => {
  try {
    const { status, rejectedReason } = req.body;
    const result = await updateSupplier(req.params.supplierId as string, { status, rejected_reason: rejectedReason });
    const { changes } = result;

    if (Object.keys(changes).length === 0) {
      res.status(403).json({ message: "No changes made to the supplier" });
      return;
    }

    if(status === "rejected" && !rejectedReason) {
      res.status(400).json({ message: "Rejected reason is required" });
      return;
    }  

    if (status === "approved") {
      eventEmitter.emit("supplier-approved", {
        supplierName: result.supplier.name,
        approvedBy: `${req.user.firstName} ${req.user.lastName}`,
      });
    } else if (status === "rejected") {
      eventEmitter.emit("supplier-rejected", {
        supplierName: result.supplier.name,
        rejectedBy: `${req.user.firstName} ${req.user.lastName}`,
      });
    }

    res.status(200).json({
      message: `Supplier status updated from ${changes.status.from} to ${changes.status.to} successfully`,
      supplier: result.supplier,
    });
  } catch (error) {
    console.error("Error updating supplier:", error);
    res.status(500).json({ error: error.message });
  }
};


export const disableUser = async (req: ExtendedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Toggle the isActive status
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isActive: !user.isActive },
      { new: true } // Return the updated document
    );
    const statusMessage = updatedUser?.isActive
      ? "User is now active."
      : "User is now inactive.";
    res.status(200).json({ message: statusMessage });
  } catch (error) {
    console.error("Error toggling user status:", error);
    res.status(500).json({ error: "An error occurred while updating user status." });
  }
};

export const reviewUpdateRequestForUniformStock = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const { action } = req.body; // "Approve" or "Reject"

    const pendingUpdate = await PendingUpdate.findById(requestId);
    if (!pendingUpdate) {
      res.status(404).json({ message: "Update request not found" });
      return;
    }

    if (action === "Approve") {
      // Apply the update to the uniform
      const uniform = await Uniform.findById(pendingUpdate.stockId);
      if (!uniform) {
        res.status(404).json({ message: "Uniform not found" });
        return;
      }

      const existingItem = uniform.itemPrices.find(
        (item) => item.itemName === pendingUpdate.itemName
      );

      if (existingItem) {
        existingItem.quantity += pendingUpdate.quantity;
      } else {
        uniform.itemPrices.push({
          itemName: pendingUpdate.itemName,
          price: pendingUpdate.price,
          quantity: pendingUpdate.quantity,
        });
      }

      // Recalculate total quantity and price
      uniform.quantity = uniform.itemPrices.reduce((sum, item) => sum + item.quantity, 0);
      uniform.totalPrice = uniform.itemPrices.reduce((sum, item) => sum + item.price * item.quantity, 0);

      await uniform.save();
      pendingUpdate.status = "Approved";
    } else if (action === "Reject") {
      pendingUpdate.status = "Rejected";
    } else {
      res.status(400).json({ message: "Invalid action" });
      return;
    }

    pendingUpdate.updatedAt = new Date();
    await pendingUpdate.save();

    res.status(200).json({ message: `Update request ${pendingUpdate.status}` });
  } catch (error) {
    console.error("Error reviewing update request:", error);
    res.status(500).json({ message: error.message });
  }
};

export const createPersonalRequestController = async (req: ExtendedRequest, res: Response) => {
  try {
    const {
      reason,
      request_description,
      amount,
    } = req.body;

    if (!reason || !request_description || !amount) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const personalRequest = await createPersonalRequest({
      reason,
      request_description,
      prepared_by: req.user.id,
      amount
    });

    res.status(201).json({ message: "Personal request created successfully", personalRequest });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPersonalRequestsController = async (req: ExtendedRequest, res: Response) => {
  try {
    const personalRequests = await getPersonalRequests();
    if (personalRequests.length === 0) {
      res.status(404).json({ message: "No personal requests found" });
      return;
    }
    res.status(200).json({ personalRequests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPersonalRequestByIdController = async (req: ExtendedRequest, res: Response) => {
  try {
    const personalRequest = await getPersonalRequestById(req.params.id as string);
    if (!personalRequest) {
      res.status(404).json({ message: "Personal request not found" });
      return;
    }
    res.status(200).json({ personalRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePersonalRequestController = async (req: ExtendedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;
    const personalRequest = await getPersonalRequestById(id as string);
    if (!personalRequest) {
      res.status(404).json({ message: "Personal request not found" });
      return;
    }
    if (!status || !["Approved", "Rejected"].includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return 
    }
    if (status === "Rejected" && !rejectionReason) {
      res.status(400).json({ message: "Rejection reason is required" });
      return;
    }
    const updateRequest = await updatePersonalRequest(id as string, status, req.user.id as string, rejectionReason);
    res.status(200).json({ message: "Personal request updated successfully", updateRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};