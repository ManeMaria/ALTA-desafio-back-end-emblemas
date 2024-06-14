import { DefaultException, ExceptionTypes } from '@/core/application';

export class IORedisException extends DefaultException {
  constructor(error: any) {
    super({
      type: ExceptionTypes.SYSTEM,
      code: 'IOREDIS',
      data: error,
    });
  }
}
