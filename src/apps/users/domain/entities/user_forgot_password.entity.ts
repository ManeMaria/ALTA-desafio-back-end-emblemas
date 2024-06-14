import { Domain, DomainEntity } from '@/core/domain';
import { User } from '@/users/domain';

export enum UserForgotPasswordState {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED',
}

export interface UserForgotPassword extends Domain {
  state: UserForgotPasswordState;
  code: string;
  attempts: number;
  email: string;
  user: User;
  confirmedAt?: Date;
  expiredAt?: Date;
  declinedAt?: Date;

  isDeclined(): boolean;
  isExpired(): boolean;
  isConfirmed(): boolean;
}

export class UserForgotPasswordEntity
  extends DomainEntity
  implements UserForgotPassword
{
  state: UserForgotPasswordState;
  code: string;
  attempts: number;
  email: string;
  user: User;
  confirmedAt?: Date;
  expiredAt?: Date;
  declinedAt?: Date;

  constructor(props: Partial<UserForgotPassword>) {
    super(props);

    this.state = props.state;
    this.code = props.code;
    this.attempts = props.attempts;
    this.email = props.email;
    this.user = props.user;
    this.confirmedAt = props.confirmedAt;
    this.expiredAt = props.expiredAt;
    this.declinedAt = props.declinedAt;
  }

  isDeclined(): boolean {
    return this.state === UserForgotPasswordState.DECLINED;
  }

  isExpired(): boolean {
    return this.state === UserForgotPasswordState.EXPIRED;
  }

  isConfirmed(): boolean {
    return this.state === UserForgotPasswordState.CONFIRMED;
  }
}
