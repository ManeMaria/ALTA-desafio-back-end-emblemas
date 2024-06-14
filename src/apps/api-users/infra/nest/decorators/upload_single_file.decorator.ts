import { MimeTypesEnum, fileMimetypeValidator } from '@/libs/multer';
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { SchemaType } from '@/api-users/infra/nest/decorators/types';

type SingleFileType = {
  fieldName: string;
  required: boolean;
  type: MimeTypesEnum;
};

export function SingleFile(params: SingleFileType) {
  const { fieldName, required, type } = params;

  const bodyProperties: Record<string, SchemaObject | ReferenceObject> = {
    [fieldName]: {
      type: 'string',
      format: 'binary',
    },
  };

  const apiBody = ApiBody({
    schema: {
      type: SchemaType.OBJECT,
      required: required ? [fieldName] : [],
      properties: bodyProperties,
    },
  });

  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, { fileFilter: fileMimetypeValidator(type) }),
    ),
    ApiConsumes('multipart/form-data'),
    apiBody,
  );
}
