import { Roles } from '@/enums/roles.enum';
import User from '@/models/users.model';
import { Request } from 'express';

export interface DataStoredInToken {
  id: number;
  role: keyof typeof Roles;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
