import { AuthUser } from './auth_user.entity';

export interface RefreshTokenCache {
  user: AuthUser;
  refreshToken: RefreshToken;
}

export interface RefreshToken {
  id: string;
  eat: Date;
}

export interface AccessToken {
  version: number;
  id: string;
  email: string;
  refresh_token: RefreshToken;
}
