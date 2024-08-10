export interface AuthUser {
  name: string;
  email: string;
  role: AuthUserRole;
  avatar: string;
  coin: number;
}

export enum AuthUserRole {
  USER,
  ADMIN,
}
