import { DefaultException, ExceptionTypes } from '@/core/application';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(DefaultException)
export class DefaultExceptionFilter
  implements ExceptionFilter<DefaultException>
{
  catch(exception: DefaultException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (
      [ExceptionTypes.SYSTEM, ExceptionTypes.UNKNOWN].includes(exception.type)
    ) {
      console.log('INTERNAL ERROR', exception);
    } else {
      console.log('USER ERROR', exception);
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    switch (exception.type) {
      case ExceptionTypes.USER:
      case ExceptionTypes.ADMIN:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        break;
      case ExceptionTypes.FORBIDDEN:
        status = HttpStatus.FORBIDDEN;
        break;
      case ExceptionTypes.UNAUTHORIZED:
        status = HttpStatus.UNAUTHORIZED;
        break;
      case ExceptionTypes.CONFLICT:
        status = HttpStatus.CONFLICT;
        break;
    }

    logException(request, status);

    response.status(status).json({
      type: exception.type,
      code: exception.code,
      data: exception.data,
      message: 'Mensagem traduzida',
    });
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    logException(request, status);

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      console.log('INTERNAL ERROR', { exception });
    } else {
      console.log('USER ERROR.', { exception });
    }

    response.status(status).json({
      type:
        status < HttpStatus.INTERNAL_SERVER_ERROR
          ? ExceptionTypes.USER
          : ExceptionTypes.SYSTEM,
      code: exception.name,
      data: exception.message,
      message: 'Mensagem traduzida',
    });
  }
}

function logException(request: any, status: number) {
  const { ip, originalUrl, method } = request;

  if (request.user) {
    request.userId =
      request.user.uuid ?? request.user.id ?? request.user.phoneNumber;
  }

  const userAgent: string = request.get('user-agent') || 'NO_AGENT';
  const userId: string = request.userId ?? '-';
  const clientIp: string = request.headers['cf-connecting-ip'] ?? ip;

  console.log(
    `RES: <| ${userId} |> | ${method} ${originalUrl} ${status} | ${userAgent} ${clientIp}`,
  );
}
