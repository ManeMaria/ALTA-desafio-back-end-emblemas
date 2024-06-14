import { Readable } from 'node:stream';

export interface File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  stream: Readable;
  filename: string;
  buffer: Buffer;
}

export class FileEntity implements File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  stream: Readable;
  filename: string;
  buffer: Buffer;

  constructor(props: File) {
    Object.assign(this, props);
  }
}
