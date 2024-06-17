import { User } from '@/users/domain';
import { DefaultException, ExceptionTypes } from '@/core/application';

export class UserMustCompleteOnboardingException extends DefaultException {
  constructor(user: User) {
    super({
      type: ExceptionTypes.USER,
      code: 'USER_MUST_COMPLETE_ONBOARDING',
      data: user,
      message: 'Usuário deve completar o onboarding',
    });
  }
}
