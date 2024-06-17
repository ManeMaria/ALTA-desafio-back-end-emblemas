import { Domain, DomainEntity, Roles } from '@/core/domain';
import { Emblems } from '@/users/domain';

export enum UserState {
  CONFIRMED = 'CONFIRMED',
  PENDING_CONFIRMATION = 'PENDING_CONFIRMATION',
}

export interface User extends Domain {
  state: UserState;
  name: string;
  email: string;
  password: string;

  emblems?: Emblems[];
  roles: Roles;
  isConfirmed(): boolean;
}

export class UserEntity extends DomainEntity implements User {
  state: UserState;
  name: string;
  email: string;
  password: string;
  roles: Roles;

  emblems?: Emblems[];

  constructor(props: Partial<User>) {
    super(props);

    this.state = props.state;
    this.name = props.name;
    this.email = props.email;
    this.roles = props.roles;
    this.emblems = props.emblems;
    this.password = props.password;
  }

  isConfirmed(): boolean {
    return this.state === UserState.CONFIRMED;
  }
}
