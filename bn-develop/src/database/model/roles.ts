// src/database/model/roles.ts
import mongoose, { Document } from 'mongoose';
interface IRole extends Document {
  roleName: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
const roleSchema: mongoose.Schema<IRole> = new mongoose.Schema({
  roleName: {
    type: String,
    required: true,
    unique: true,
  },

  description: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export const Role = mongoose.model<IRole>('Role', roleSchema);
