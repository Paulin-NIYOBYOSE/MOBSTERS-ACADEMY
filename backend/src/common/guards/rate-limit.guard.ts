import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { TooManyAttemptsException } from '../../auth/exceptions/auth.exceptions';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxAttempts: number; // Maximum attempts per window
  skipSuccessfulRequests?: boolean;
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    
    // Get rate limit configuration from decorator or use defaults
    const config = this.reflector.get<RateLimitConfig>('rateLimit', context.getHandler()) || {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxAttempts: 5,
      skipSuccessfulRequests: false,
    };

    // Create a unique key for this client (IP + endpoint)
    const key = `${request.ip}:${request.route?.path || request.path}`;
    const now = Date.now();
    
    // Get or create rate limit entry
    let entry = rateLimitStore.get(key);
    
    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired entry
      entry = {
        count: 0,
        resetTime: now + config.windowMs,
      };
      rateLimitStore.set(key, entry);
    }

    // Check if limit exceeded
    if (entry.count >= config.maxAttempts) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      throw new TooManyAttemptsException(retryAfter);
    }

    // Increment counter
    entry.count++;
    rateLimitStore.set(key, entry);

    return true;
  }
}

// Decorator to configure rate limiting
export const RateLimit = (config: RateLimitConfig) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata('rateLimit', config, descriptor.value);
    return descriptor;
  };
};
