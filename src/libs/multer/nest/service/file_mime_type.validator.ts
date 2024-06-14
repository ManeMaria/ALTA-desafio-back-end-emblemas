import { UnsupportedMediaTypeException } from '@nestjs/common';

export enum MimeTypesEnum {
  IMAGE = 'image',
  PDF = 'pdf',
}

export function fileMimetypeValidator(...mimeTypes: string[]) {
  return (
    _,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (mimeTypes.some((m) => file.mimetype.includes(m))) {
      callback(null, true);
    } else {
      callback(
        new UnsupportedMediaTypeException(
          `File type is not matching: ${mimeTypes.join(', ')}`,
        ),
        false,
      );
    }
  };
}
