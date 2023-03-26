import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Error } from 'mongoose';

interface MongoError {
  index: number;
  code: number;
  keyPattern: { [key: string]: any };
  keyValue: { [key: string]: any };
}

export interface IValidationError {
  [key: string]: {
    message: string;
    value?: any;
  };
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    // Estas son las propiedades que se van a enviar con cada execpción
    let errorType = 'Internal Server Error';
    let validationErrors: unknown;
    let errorMessage: string | undefined;
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      errorType = exception.name;
      errorMessage = exception.message;
      validationErrors = (exception as any)?.response?.validationErrors;

      if (validationErrors) {
        errorMessage = 'Error de validación en la petición';
      }
    } else if (exception instanceof Error.ValidationError) {
      // *For mongoose error validation
      httpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
      errorType = exception.name;
      errorMessage = 'Error de validación en la base de datos';
      validationErrors = exception.errors;
    } else if ((exception as MongoError).code === 11000) {
      const key = Object.keys((exception as MongoError).keyValue)[0];
      const value = (exception as MongoError).keyValue[key];

      const error: IValidationError = {};
      error[key] = {
        message: 'Ya existe en la base de datos',
        value,
      };

      validationErrors = error;
      httpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
      errorType = 'Duplicate key';
    } else {
      console.log(exception);
    }

    const responseBody = {
      statusCode: httpStatus,
      path: request.url,
      errorType,
      timestamp: new Date().toISOString(),
      errorMessage,
      errors: validationErrors,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
