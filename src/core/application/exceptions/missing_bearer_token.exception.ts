import { ExceptionTypes } from '@/core/application';

import { DefaultException } from './default_error.exception';

export class MissingBearerTokenException extends DefaultException {
  constructor() {
    super({
      message: 'Missing Bearer Token',
      type: ExceptionTypes.USER,
      code: 'MISSING_BEARER_TOKEN',
    });
  }
}
