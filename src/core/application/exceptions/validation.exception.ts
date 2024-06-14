import { ExceptionTypes } from '@/core/application';

import { DefaultException } from './default_error.exception';

export class ValidationException extends DefaultException {
  constructor(validation: any) {
    super({
      type: ExceptionTypes.USER,
      code: 'VALIDATION',
      data: validation,
    });
  }
}
