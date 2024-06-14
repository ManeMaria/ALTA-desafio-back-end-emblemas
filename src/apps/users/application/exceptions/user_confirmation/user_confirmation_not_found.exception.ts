import { DefaultException, ExceptionTypes } from '@/core/application';
import { UserConfirmation } from '@/users/domain';

export class UserConfirmationNotFoundException extends DefaultException {
  constructor(user: Partial<UserConfirmation>) {
    super({
      type: ExceptionTypes.USER,
      code: 'USER_CONFIRMATION_NOT_FOUND',
      data: user,
    });
  }
}
