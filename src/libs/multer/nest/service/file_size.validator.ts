import { File } from '@/core/domain';
import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterConfig } from '@/libs/multer';

@Injectable()
export class FileSizeValidator implements PipeTransform {
  maxSize: number;
  configService: ConfigService<MulterConfig>;

  constructor() {
    this.configService = new ConfigService<MulterConfig>();
    this.maxSize = this.configService.get<number>('MAX_SIZE') ?? 3000000;
  }

  transform(file: File, _: ArgumentMetadata): File {
    if (!file) {
      throw new BadRequestException('Validation failed (file expected)');
    }

    if (file.size > this.maxSize) {
      throw new BadRequestException(`Max file size exceeded`);
    }

    return file;
  }
}
