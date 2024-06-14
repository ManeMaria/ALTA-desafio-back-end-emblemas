import * as crypto from 'node:crypto';

export class RandomCode {
  static generate(length: number): string {
    return crypto
      .randomBytes(length)
      .toJSON()
      .data.map((x) => `${x % 10}`)
      .join('');
  }
}
