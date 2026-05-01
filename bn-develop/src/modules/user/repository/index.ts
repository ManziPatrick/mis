// src/modules/user/repository/index.ts
import { Role } from '../../../database/model/roles';
import { User } from '../../../database/model/user';
import { Document } from 'mongoose';
import { PersonalRequest } from '../../../database/model/personalRequest';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  profilePicture?: string;
  gender?: string;
  birthDate?: string;
  address?: string;
  phoneNumber?: string;
  iDNumber?: string;
}

interface IPersonalRequest {
  reason: string;
  request_description: string;
  amount: number;
  prepared_by: string;
}

export interface IRole {
  _id: string;
  roleName: string;
}

export const createUser = async (user: IUser) => {
  const newUser = await User.create(user);
  return newUser.depopulate('__v').populate('role');
};

export const updateUserById = async (id: string, user: Partial<IUser>) => {
  const { password, ...updateData } = user;
  // Remove empty/null/undefined values
  const cleanedData = Object.fromEntries(
    Object.entries(updateData).filter(([_, value]) => value !== undefined && value !== null && value !== '')
  );
  const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    cleanedData,
    { new: true }
  ).select('-__v -password').populate({
    path: 'role',
    select: '-createdAt -updatedAt -__v',
  });
  return updatedUser;
};

export const restPassword = async (id: string, password: string) => {
  const updatedUser = await User.findByIdAndUpdate({_id: id}, {password: password}, {new: true}).select('password');
  return updatedUser;
}


export const getUserById  = async (id: string) => {
  const user = await User.findOne({ _id: id }).select('-__v -password').populate({
    path: 'role',
    select: '-createdAt -updatedAt -__v',
});;
  return user;
};

export const deleteUserById = async (id: string) => {
  const user = await User.findOneAndDelete({ _id: id }).select('-__v');
  return user;
};
export const getUserPassword = async (id: string) => {
  const user = await User.findOne({ _id: id }).select('password');
  return user;
};
export const getUsers = async () => {
  try { 
    const users = await User.find().select('-__v -password').populate({
        path: 'role',
        select: '-createdAt -updatedAt -__v',
    });
    return users;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserByEmail = async (email: string) => {
  const user = await User.findOne({ email }).select('-__v').populate({
    path: 'role',
    select: '-createdAt -updatedAt -__v',
  });
  return user;
};

export const getRoleByRoleId = async (role_id: string) => {
  const role = await Role.findOne({ _id: role_id }).select('-__v');
  return role;
};

export const getAllRoles = async () => {
  const roles = await Role.find();
  return roles;
};

interface PopulatedUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  role: IRole;
}

export const getUsersByRole = async (role: string) => {
  try {
    const users = await getUsers() as unknown as PopulatedUser[];
    // console.log('All users with roles:', users.map(u => ({ 
    //   email: u.email, 
    //   role: u.role?.roleName
    // })));
    
    const filteredUsers = users.filter(user => 
      user.role && user.role.roleName === role
    );
    //console.log(`Filtered users for role ${role}:`, filteredUsers.map(u => u.email));
    return filteredUsers;
  } catch (error) {
    console.error('Error in getUsersByRole:', error);
    return [];
  }
};

export const findUserByEmail = (email: string) => {
  return User.findOne({ email });
}

export const createPersonalRequest = async (request: IPersonalRequest) => {
  const newRequest = await PersonalRequest.create(request);
  return newRequest;
};

export const getPersonalRequests = async () => {
  return await PersonalRequest.find().populate({
    path: 'prepared_by approved_by rejected_by',
    select:'firstName lastName email',
  });
};

export const getPersonalRequestById = async (id: string) => {
  return await PersonalRequest.findById(id).populate({
    path: 'prepared_by approved_by rejected_by',
    select:'firstName lastName email',
  });
};

export const updatePersonalRequest = async (id: string, status: 'Approved' | 'Rejected', adminId: string, rejectionReason: string) => {
  const update: any = {
    status,
    rejection_reason: rejectionReason
  };

  if (status === 'Approved') {
    update.approved_by = adminId;
  }
  if (status === 'Rejected') {
    update.rejected_by = adminId;
  }

  return await PersonalRequest.findByIdAndUpdate(id, update, { new: true }).populate({
    path: 'prepared_by approved_by rejected_by',
    select:'firstName lastName email',
  });
};