import { DefaultException, ExceptionTypes } from '@/core/application';
import { User } from '@/users/domain';

export class UserNotFoundException extends DefaultException {
  constructor(user: Partial<User>) {
    super({
      type: ExceptionTypes.USER,
      code: 'USER_NOT_FOUND',
      data: user,
    });
  }
}
