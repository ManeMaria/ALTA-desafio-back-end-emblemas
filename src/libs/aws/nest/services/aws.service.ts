import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import AWS from 'aws-sdk';
import { AwsConfig } from '@/libs/aws';
import { MissingEnvVarException } from '@/core/application';

@Injectable()
export class AwsService {
  region: string;
  accessKey: string;
  secretKey: string;
  injectAccess: boolean;
  bucketName: string;
  urlKey: string;

  constructor(private readonly configService: ConfigService<AwsConfig>) {
    this.region = this.configService.get<string>('AWS_REGION');

    if (!this.region) {
      throw new MissingEnvVarException('AWS_REGION');
    }

    const injectAccess = this.configService.get<string>('AWS_INJECT_ACCESS');

    if (!injectAccess) {
      throw new MissingEnvVarException('AWS_INJECT_ACCESS');
    }

    this.injectAccess = injectAccess === 'true' ? true : false;

    if (this.injectAccess) {
      this.accessKey = this.configService.get<string>('AWS_ACCESS_KEY');

      if (!this.accessKey) {
        throw new MissingEnvVarException('AWS_ACCES_KEY');
      }

      this.secretKey = this.configService.get<string>('AWS_ACCESS_SECRET_KEY');

      if (!this.secretKey) {
        throw new MissingEnvVarException('AWS_ACCESS_SECRET_KEY');
      }
    }

    this.bucketName = this.configService.get<string>('AWS_BUCKET_NAME');

    if (!this.bucketName) {
      throw new MissingEnvVarException('AWS_BUCKET_NAME');
    }

    this.urlKey = this.configService.get<string>('AWS_URL_KEY');

    if (!this.urlKey) {
      this.urlKey = `https://${this.bucketName}.s3.amazonaws.com`;
    }
  }

  getConfig(): AWS.Config {
    return new AWS.Config({
      region: this.region,
      ...(this.injectAccess
        ? {
            credentials: {
              accessKeyId: this.accessKey,
              secretAccessKey: this.secretKey,
            },
          }
        : {}),
    });
  }

  getBucketName(): string {
    return this.bucketName;
  }

  getUrlKey(): string {
    return this.urlKey;
  }
}
