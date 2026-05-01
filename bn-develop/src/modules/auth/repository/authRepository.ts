// src/modules/auth/repository/authRepository.ts
import { User } from '../../../database/model/user';

export const getUserByEmail = async (email: string) => {
  const user = await User.findOne({ email }).populate({
    path: 'role',
    select: '-__v -_id -createdAt -updatedAt -description'
  });
  return user;
};

