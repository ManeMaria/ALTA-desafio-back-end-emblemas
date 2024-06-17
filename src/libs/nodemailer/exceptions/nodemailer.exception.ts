import { DefaultException, ExceptionTypes } from '@/core/application';

export class NodemailerException extends DefaultException {
  constructor(error: any) {
    super({
      type: ExceptionTypes.SYSTEM,
      code: 'NODEMAILER',
      data: error,
    });
  }
}
