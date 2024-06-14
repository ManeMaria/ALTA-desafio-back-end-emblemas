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
export class MultipleFilesSizeValidator implements PipeTransform {
  maxSize: number;
  configService: ConfigService<MulterConfig>;

  constructor() {
    this.configService = new ConfigService<MulterConfig>();
    this.maxSize = this.configService.get<number>('MAX_SIZE') ?? 3000000;
  }

  transform(files: File[], _: ArgumentMetadata): File[] {
    if (!Array.isArray(files) || !files.length) {
      throw new BadRequestException('Validation failed (file expected)');
    }

    for (const file of files) {
      if (file.size > this.maxSize) {
        throw new BadRequestException(`Max file size exceeded`);
      }
    }

    return files;
  }
}
