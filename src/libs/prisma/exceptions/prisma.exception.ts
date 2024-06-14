import { DefaultException, ExceptionTypes } from '@/core/application';

export class PrismaException extends DefaultException {
  constructor(error: any) {
    super({
      type: ExceptionTypes.SYSTEM,
      code: 'PRISMA',
      data: error,
    });
  }
}
