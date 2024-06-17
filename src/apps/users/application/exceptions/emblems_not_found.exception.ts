import { DefaultException, ExceptionTypes } from '@/core/application';
import { Emblems } from '@/emblems/domain/entities/emblems';

export class EmblemsNotFoundException extends DefaultException {
  constructor(emblems: Partial<Emblems>) {
    super({
      type: ExceptionTypes.USER,
      code: 'EMBLEMS_NOT_FOUND',
      data: emblems,
    });
  }
}
