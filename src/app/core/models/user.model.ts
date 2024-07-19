export interface AuthUser {
  name: string;
  email: string;
  role: AuthUserRole;
}

export enum AuthUserRole {
  USER,
  ADMIN,
}
