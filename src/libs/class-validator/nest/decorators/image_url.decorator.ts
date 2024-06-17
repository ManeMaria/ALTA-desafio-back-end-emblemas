import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsImagUrl(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsImageUrl',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          const regex = /https:\/\/cidadealtarp\.com\/.*\.(png|jpeg|jpg|svg)/;
          return regex.test(value);
        },
      },
    });
  };
}
