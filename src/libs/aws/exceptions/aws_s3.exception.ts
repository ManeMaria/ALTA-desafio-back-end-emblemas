import aws from 'aws-sdk';
import { DefaultException, ExceptionTypes } from '@/core/application';

export class AwsS3Exception extends DefaultException {
  constructor(error: aws.AWSError, message: 'Upload Error' | 'Delete Error') {
    super({
      type: ExceptionTypes.SYSTEM,
      code: 'AWS_S3',
      data: error,
      message,
    });
  }
}
