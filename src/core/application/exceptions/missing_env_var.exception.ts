import { ExceptionTypes } from '@/core/application';

import { DefaultException } from './default_error.exception';

export class MissingEnvVarException extends DefaultException {
  constructor(missing: string | number | string[]) {
    super({
      message: 'Missing env var: ' + missing,
      type: ExceptionTypes.SYSTEM,
      code: 'MISSING_ENV_VAR',
      data: missing,
    });
  }
}
