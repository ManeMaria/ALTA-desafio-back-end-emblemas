export enum ExceptionTypes {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SYSTEM = 'SYSTEM',
  SECURITY = 'SECURITY',
  FORBIDDEN = 'FORBIDDEN',
  UNAUTHORIZED = 'UNAUTHORIZED',
  UNKNOWN = 'UNKNOWN',
  CONFLICT = 'CONFLICT',
}

export interface Exception {
  type: ExceptionTypes;
  code: string;
  data?: any;
  message?: string;
}

export class DefaultException extends Error implements Exception {
  type: ExceptionTypes;
  code: string;
  data?: any;

  constructor(exception: Exception) {
    super(exception.message);
    this.code = exception.code;
    this.type = exception.type;
    this.data = exception.data;
  }

  isUserError(): boolean {
    return [
      ExceptionTypes.USER,
      ExceptionTypes.ADMIN,
      ExceptionTypes.FORBIDDEN,
      ExceptionTypes.UNAUTHORIZED,
      ExceptionTypes.CONFLICT,
    ].includes(this.type);
  }
}
