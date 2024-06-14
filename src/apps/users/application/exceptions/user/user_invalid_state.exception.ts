import { DefaultException, ExceptionTypes } from '@/core/application';
import { User } from '@/users/domain';

export class UserInvalidStateException extends DefaultException {
  constructor(user: Partial<User>) {
    super({
      type: ExceptionTypes.USER,
      code: 'USER_INVALID_STATE',
      data: user,
    });
  }
}
