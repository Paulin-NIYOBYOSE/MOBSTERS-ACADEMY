import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthException, AuthErrorCode, AuthErrorResponse } from '../../auth/exceptions/auth.exceptions';

@Catch()
export class AuthExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AuthExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let errorResponse: AuthErrorResponse;

    if (exception instanceof AuthException) {
      // Handle custom auth exceptions
      status = exception.getStatus();
      errorResponse = exception.getResponse() as AuthErrorResponse;
      errorResponse.error.path = request.url;
    } else if (exception instanceof HttpException) {
      // Handle other HTTP exceptions
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
        const messages = Array.isArray((exceptionResponse as any).message) 
          ? (exceptionResponse as any).message 
          : [(exceptionResponse as any).message];
        
        errorResponse = {
          error: {
            code: status === HttpStatus.BAD_REQUEST ? AuthErrorCode.VALIDATION_ERROR : AuthErrorCode.SERVER_ERROR,
            message: messages.length === 1 ? messages[0] : 'Validation failed',
            details: messages.length > 1 ? { validationErrors: messages } : undefined,
            timestamp: new Date().toISOString(),
            path: request.url,
          },
        };
      } else {
        errorResponse = {
          error: {
            code: AuthErrorCode.SERVER_ERROR,
            message: typeof exceptionResponse === 'string' ? exceptionResponse : 'An error occurred',
            timestamp: new Date().toISOString(),
            path: request.url,
          },
        };
      }
    } else {
      // Handle unexpected errors
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorResponse = {
        error: {
          code: AuthErrorCode.SERVER_ERROR,
          message: 'An internal server error occurred',
          timestamp: new Date().toISOString(),
          path: request.url,
        },
      };

      // Log unexpected errors
      this.logger.error(
        `Unexpected error: ${exception instanceof Error ? exception.message : 'Unknown error'}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    // Log auth-related errors for monitoring
    if (request.url.includes('/auth/')) {
      this.logger.warn(
        `Auth error: ${errorResponse.error.code} - ${errorResponse.error.message} | ` +
        `Path: ${request.url} | Method: ${request.method} | IP: ${request.ip} | ` +
        `UserAgent: ${request.get('User-Agent') || 'unknown'}`
      );
    }

    response.status(status).json(errorResponse);
  }
}
