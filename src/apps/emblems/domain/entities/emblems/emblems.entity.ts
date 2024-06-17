import { randomUUID as uuid } from 'node:crypto';

export interface Emblems {
  refId?: string;
  id?: number;
  name: string;
  slug: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class EmblemsEntity implements Emblems {
  refId: string;
  id: number;
  name: string;
  slug: string;
  image: string;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  constructor(props: Partial<Emblems>) {
    this.name = props.name;
    this.id = props.id;
    this.slug = props.slug;
    this.image = props.image;
    this.refId = props.refId ?? uuid();
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }
}
