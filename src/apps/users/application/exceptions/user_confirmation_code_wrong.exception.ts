import { DefaultException, ExceptionTypes } from '@/core/application';
import { UserConfirmation } from '@/users/domain';

export class UserConfirmationCodeWrongException extends DefaultException {
  constructor(user: Partial<UserConfirmation>) {
    super({
      type: ExceptionTypes.USER,
      code: 'USER_CONFIRMATION_CODE_WRONG',
      data: user,
    });
  }
}
