import { DefaultException, ExceptionTypes } from '@/core/application';
import { UserConfirmation } from '@/users/domain';

export class UserConfirmationMaxAttemptsException extends DefaultException {
  constructor(userConfirmation: Partial<UserConfirmation>) {
    super({
      type: ExceptionTypes.USER,
      code: 'USER_CONFIRMATION_MAX_ATTEMPTS',
      data: userConfirmation,
    });
  }
}
