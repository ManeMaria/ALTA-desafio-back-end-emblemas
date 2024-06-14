import aws, { S3 } from 'aws-sdk';
import { AwsService } from '@/libs/aws';
import { AwsS3Exception } from '@/libs/aws';
import {
  IUploadService,
  UpdateFileParams,
  UploadParams,
  UrlParam,
} from '@/core/application';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsS3Service implements IUploadService {
  private readonly s3Instance: S3;
  private readonly bucketName: string;
  private readonly urlKey: string;

  constructor(private readonly awsService: AwsService) {
    this.s3Instance = new aws.S3(this.awsService.getConfig());
    this.bucketName = this.awsService.getBucketName();
    this.urlKey = this.awsService.getUrlKey();
  }

  async upload(params: UploadParams): Promise<string> {
    const { file, folder } = params;

    const mimeTypes = file.mimetype.split('/');
    const fileExtension = mimeTypes[mimeTypes.length - 1].toLowerCase();

    const fileNameWithoutSlashes = file.originalname.replace(/\//gi, '-');
    const lastDotIndex = fileNameWithoutSlashes.lastIndexOf('.');
    const filenameFormatted = fileNameWithoutSlashes.slice(
      0,
      lastDotIndex >= 0 ? lastDotIndex : fileNameWithoutSlashes.length + 1,
    );
    const fileName = `${Date.now()}-${filenameFormatted}.${fileExtension}`;

    const uploadParams: S3.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: `${folder}/${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentEncoding: file.encoding,
    };

    return new Promise((resolve, _) => {
      this.s3Instance.putObject(uploadParams, (err, _) => {
        if (err) {
          throw new AwsS3Exception(err, 'Upload Error');
        }

        resolve(
          `${this.urlKey}/${folder}/${encodeURIComponent(`${fileName}`)}`,
        );
      });
    });
  }

  async delete(param: UrlParam): Promise<void> {
    const { url } = param;

    const urlWithoutLink = url.replace(`${this.urlKey}/`, '');

    const deleteParams: S3.DeleteObjectRequest = {
      Bucket: this.bucketName,
      Key: urlWithoutLink,
    };

    return new Promise((resolve, _) => {
      this.s3Instance.deleteObject(deleteParams, (err, _) => {
        if (err) {
          throw new AwsS3Exception(err, 'Delete Error');
        }

        resolve();
      });
    });
  }

  async update(params: UpdateFileParams): Promise<string> {
    const { newFile, previousFileURL, folder } = params;

    const newFileUrl = await this.upload({
      file: newFile,
      folder,
    });

    if (previousFileURL) {
      try {
        await this.delete({ url: previousFileURL });

        return newFileUrl;
      } catch (error) {
        await this.delete({ url: newFileUrl });
        throw new AwsS3Exception(error, 'Delete Error');
      }
    }

    return newFileUrl;
  }
}
