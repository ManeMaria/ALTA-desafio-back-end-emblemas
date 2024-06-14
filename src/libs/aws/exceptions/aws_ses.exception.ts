import aws from 'aws-sdk';
import { DefaultException, ExceptionTypes } from '@/core/application';

export class AwsSesException extends DefaultException {
  constructor(error: aws.AWSError) {
    super({
      type: ExceptionTypes.SYSTEM,
      code: 'AWS_SES',
      data: error,
    });
  }
}
