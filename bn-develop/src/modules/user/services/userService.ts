import { getUsersByRole } from '../repository';

export class UserService {
  async getUsersByRole(role: string) {
    return await getUsersByRole(role);
  }
} 