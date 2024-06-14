import { Domain, DomainEntity } from '@/core/domain';
import { User } from '@/users/domain';

export enum UserConfirmationState {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED',
}

export interface UserConfirmation extends Domain {
  state: UserConfirmationState;
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

export class UserConfirmationEntity
  extends DomainEntity
  implements UserConfirmation
{
  state: UserConfirmationState;
  code: string;
  attempts: number;
  email: string;
  user: User;
  confirmedAt?: Date;
  expiredAt?: Date;
  declinedAt?: Date;

  constructor(props: Partial<UserConfirmation>) {
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
    return this.state === UserConfirmationState.DECLINED;
  }

  isExpired(): boolean {
    return this.state === UserConfirmationState.EXPIRED;
  }

  isConfirmed(): boolean {
    return this.state === UserConfirmationState.CONFIRMED;
  }
}
