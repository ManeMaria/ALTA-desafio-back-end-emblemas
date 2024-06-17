import { Domain, DomainEntity, Roles } from '@/core/domain';

export enum UserState {
  CONFIRMED = 'CONFIRMED',
  PENDING_CONFIRMATION = 'PENDING_CONFIRMATION',
}

export interface User extends Domain {
  state: UserState;
  name: string;
  email: string;
  password: string;

  roles: Roles;
  isConfirmed(): boolean;
}

export class UserEntity extends DomainEntity implements User {
  state: UserState;
  name: string;
  email: string;
  password: string;
  roles: Roles;

  constructor(props: Partial<User>) {
    super(props);

    this.state = props.state;
    this.name = props.name;
    this.email = props.email;
    this.roles = props.roles;
    this.password = props.password;
  }

  isConfirmed(): boolean {
    return this.state === UserState.CONFIRMED;
  }
}
