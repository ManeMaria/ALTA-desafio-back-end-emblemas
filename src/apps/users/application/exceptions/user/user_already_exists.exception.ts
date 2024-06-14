import { DefaultException, ExceptionTypes } from '@/core/application';
import { User } from '@/users/domain';

export class UserAlreadyExistsException extends DefaultException {
  constructor(user: Partial<User>) {
    super({
      type: ExceptionTypes.USER,
      code: 'USER_ALREADY_EXISTS',
      data: user,
    });
  }
}
