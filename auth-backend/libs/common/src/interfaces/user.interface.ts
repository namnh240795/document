export interface User {
  id: string;
  email?: string | null;
  phone?: string | null;
  name: string;
  passwordHash: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  status: 'active' | 'inactive' | 'banned';
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface Verification {
  id: string;
  userId: string;
  code: string;
  type: 'email' | 'phone' | 'password_reset';
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  createdAt: Date;
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  assignedAt: Date;
  assignedBy?: string;
}
