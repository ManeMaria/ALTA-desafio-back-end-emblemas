import {
  registerDecorator,
  ValidationOptions,
  isStrongPassword,
} from 'class-validator';

export function IsPassword(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsPassword',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return isStrongPassword(value, {
            minLength: 8,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            minUppercase: 1,
          });
        },
      },
    });
  };
}
