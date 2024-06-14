import { randomUUID as uuid } from 'node:crypto';

export type ID = string;
export type Serial = number;

export interface Domain {
  id: ID;
  serial?: Serial;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class DomainEntity implements Domain {
  id: ID;
  serial?: Serial;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  constructor(props: Partial<Domain>) {
    this.id = props.id ?? uuid();
    this.serial = props.serial;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }
}
