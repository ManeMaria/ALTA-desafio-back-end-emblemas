import { DefaultException, ExceptionTypes } from '@/core/application';
import { UserForgotPassword } from '@/users/domain';

export class UserForgotPasswordMaxAttemptsException extends DefaultException {
  constructor(userForgotPassword: Partial<UserForgotPassword>) {
    super({
      type: ExceptionTypes.USER,
      code: 'USER_FORGOT_PASSWORD_MAX_ATTEMPTS',
      data: userForgotPassword,
    });
  }
}
