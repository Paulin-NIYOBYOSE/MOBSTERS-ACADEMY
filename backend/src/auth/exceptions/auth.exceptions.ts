import { HttpException, HttpStatus } from '@nestjs/common';

export enum AuthErrorCode {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  INVALID_EMAIL_FORMAT = 'INVALID_EMAIL_FORMAT',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_DISABLED = 'ACCOUNT_DISABLED',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  INVALID_REFRESH_TOKEN = 'INVALID_REFRESH_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOO_MANY_ATTEMPTS = 'TOO_MANY_ATTEMPTS',
  SERVER_ERROR = 'SERVER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export interface AuthErrorResponse {
  error: {
    code: AuthErrorCode;
    message: string;
    details?: any;
    timestamp: string;
    path?: string;
  };
}

export class AuthException extends HttpException {
  constructor(
    code: AuthErrorCode,
    message: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    details?: any
  ) {
    const errorResponse: AuthErrorResponse = {
      error: {
        code,
        message,
        details,
        timestamp: new Date().toISOString(),
      },
    };
    super(errorResponse, status);
  }
}

export class UserNotFoundException extends AuthException {
  constructor(email?: string) {
    super(
      AuthErrorCode.USER_NOT_FOUND,
      'No account found with this email address',
      HttpStatus.NOT_FOUND,
      { email }
    );
  }
}

export class InvalidPasswordException extends AuthException {
  constructor() {
    super(
      AuthErrorCode.INVALID_PASSWORD,
      'The password you entered is incorrect',
      HttpStatus.UNAUTHORIZED
    );
  }
}

export class EmailAlreadyExistsException extends AuthException {
  constructor(email: string) {
    super(
      AuthErrorCode.EMAIL_ALREADY_EXISTS,
      'An account with this email address already exists',
      HttpStatus.CONFLICT,
      { email }
    );
  }
}

export class WeakPasswordException extends AuthException {
  constructor(requirements: string[]) {
    super(
      AuthErrorCode.WEAK_PASSWORD,
      'Password does not meet security requirements',
      HttpStatus.BAD_REQUEST,
      { requirements }
    );
  }
}

export class AccountLockedException extends AuthException {
  constructor(unlockTime?: Date) {
    super(
      AuthErrorCode.ACCOUNT_LOCKED,
      'Account is temporarily locked due to multiple failed login attempts',
      HttpStatus.TOO_MANY_REQUESTS, // Use TOO_MANY_REQUESTS instead of LOCKED
      { unlockTime }
    );
  }
}

export class AccountDisabledException extends AuthException {
  constructor() {
    super(
      AuthErrorCode.ACCOUNT_DISABLED,
      'This account has been disabled. Please contact support',
      HttpStatus.FORBIDDEN
    );
  }
}

export class EmailNotVerifiedException extends AuthException {
  constructor() {
    super(
      AuthErrorCode.EMAIL_NOT_VERIFIED,
      'Please verify your email address before logging in',
      HttpStatus.FORBIDDEN
    );
  }
}

export class InvalidRefreshTokenException extends AuthException {
  constructor() {
    super(
      AuthErrorCode.INVALID_REFRESH_TOKEN,
      'Invalid or expired refresh token',
      HttpStatus.UNAUTHORIZED
    );
  }
}

export class TokenExpiredException extends AuthException {
  constructor() {
    super(
      AuthErrorCode.TOKEN_EXPIRED,
      'Your session has expired. Please log in again',
      HttpStatus.UNAUTHORIZED
    );
  }
}

export class TooManyAttemptsException extends AuthException {
  constructor(retryAfter: number) {
    super(
      AuthErrorCode.TOO_MANY_ATTEMPTS,
      'Too many login attempts. Please try again later',
      HttpStatus.TOO_MANY_REQUESTS,
      { retryAfter }
    );
  }
}

export class AuthValidationException extends AuthException {
  constructor(validationErrors: any[]) {
    super(
      AuthErrorCode.VALIDATION_ERROR,
      'Validation failed',
      HttpStatus.BAD_REQUEST,
      { validationErrors }
    );
  }
}

export class AuthServerException extends AuthException {
  constructor(originalError?: any) {
    super(
      AuthErrorCode.SERVER_ERROR,
      'An internal server error occurred. Please try again later',
      HttpStatus.INTERNAL_SERVER_ERROR,
      { originalError: originalError?.message }
    );
  }
}
