import { InvalidDataFormatException } from '@/core/application';
import { validateSync, ValidationError } from 'class-validator';

export abstract class AutoValidator {
  constructor(props: any) {
    Object.assign(this, props);
    this.validate();
  }

  validate(): void {
    const errors = validateSync(this, {
      forbidNonWhitelisted: true,
      whitelist: true,
    });

    if (errors.length) {
      throw new InvalidDataFormatException(
        errors.map((err: ValidationError) => JSON.stringify(err.constraints)),
      );
    }
  }
}
