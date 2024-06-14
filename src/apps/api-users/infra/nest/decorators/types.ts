import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { MimeTypesEnum } from '@/libs/multer';

export type Fields = MulterField & { required?: boolean };

export type MultipleFilesType = {
  fields: Fields[];
  type: MimeTypesEnum;
};

export const enum SchemaType {
  OBJECT = 'object',
}
