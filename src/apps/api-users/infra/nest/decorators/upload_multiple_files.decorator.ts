import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import {
  SchemaObject,
  ReferenceObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { applyDecorators, UseInterceptors } from '@nestjs/common';

import {
  Fields,
  SchemaType,
  MultipleFilesType,
} from '@/api-users/infra/nest/decorators/types';
import { fileMimetypeValidator } from '@/libs/multer';

export function MultipleFiles(params: MultipleFilesType) {
  const { fields, type } = params;

  const bodyProperties: Record<string, SchemaObject | ReferenceObject> =
    fields.reduce(reduceFieldsToBodyProperties, {});

  const apiBody = ApiBody({
    schema: {
      type: SchemaType.OBJECT,
      properties: bodyProperties,
      required: fields.reduce(reduceFieldsRequired, []),
    },
  });

  return applyDecorators(
    UseInterceptors(
      FileFieldsInterceptor(fields, {
        fileFilter: fileMimetypeValidator(type),
      }),
    ),
    ApiConsumes('multipart/form-data'),
    apiBody,
  );
}

function reduceFieldsToBodyProperties(fieldsAcc: object, currentField: Fields) {
  return {
    ...fieldsAcc,
    [currentField.name]: { type: 'string', format: 'binary' },
  };
}

function reduceFieldsRequired(fieldsAcc: string[], currentField: Fields) {
  return currentField.required ? [...fieldsAcc, currentField.name] : fieldsAcc;
}
