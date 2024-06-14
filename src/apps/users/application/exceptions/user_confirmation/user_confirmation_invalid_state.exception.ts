import { DefaultException, ExceptionTypes } from '@/core/application';
import { UserConfirmation } from '@/users/domain';

export class UserConfirmationInvalidStateException extends DefaultException {
  constructor(user: Partial<UserConfirmation>) {
    super({
      type: ExceptionTypes.USER,
      code: 'USER_CONFIRMATION_INVALID_STATE',
      data: user,
    });
  }
}
