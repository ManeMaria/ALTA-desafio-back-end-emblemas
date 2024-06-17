import { DefaultException, ExceptionTypes } from '@/core/application';
import { Emblems } from '@/emblems/domain/entities/emblems';

export class EmblemsAlreadyExistsException extends DefaultException {
  constructor(emblems: Partial<Emblems>) {
    super({
      type: ExceptionTypes.USER,
      code: 'EMBLEMS_ALREADY_EXISTS',
      data: emblems,
    });
  }
}
