import { NextRequest, NextResponse } from 'next/server';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Security headers middleware
export function securityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
  };
}

// Rate limiting configuration
const rateLimitConfig = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    success: false,
    error: 'Too many requests, please try again later',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
};

// Input sanitization
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
    .substring(0, 1000); // Limit length
}

// SQL injection prevention
export function validateSqlInput(input: string): boolean {
  const sqlPatterns = [
    /('|(\-\-)|(;)|(\||\|)|(\*|\*))/i,
    /(union|select|insert|delete|update|drop|create|alter|exec|execute)/i,
    /(script|javascript|vbscript|onload|onerror|onclick)/i
  ];
  
  return !sqlPatterns.some(pattern => pattern.test(input));
}

// CSRF token validation
export function validateCSRFToken(request: NextRequest): boolean {
  const token = request.headers.get('X-CSRF-Token');
  const cookie = request.cookies.get('csrf-token')?.value;
  
  if (!token || !cookie) {
    return false;
  }
  
  return token === cookie;
}

// IP whitelist/blacklist
const BLOCKED_IPS = new Set([
  // Add blocked IPs here
]);

const ALLOWED_IPS = new Set([
  '127.0.0.1',
  '::1',
  // Add allowed IPs for admin endpoints
]);

export function validateIP(request: NextRequest, requireWhitelist = false): boolean {
  const ip = request.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');
  
  if (!ip) return false;
  
  if (BLOCKED_IPS.has(ip)) {
    return false;
  }
  
  if (requireWhitelist && !ALLOWED_IPS.has(ip)) {
    return false;
  }
  
  return true;
}

// Request size validation
export function validateRequestSize(request: NextRequest, maxSize = 1024 * 1024): boolean {
  const contentLength = request.headers.get('content-length');
  
  if (!contentLength) return true; // Let it through, will be caught later
  
  return parseInt(contentLength) <= maxSize;
}

// User agent validation
export function validateUserAgent(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent');
  
  if (!userAgent) return false;
  
  // Block known bad user agents
  const blockedAgents = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    // Add more patterns as needed
  ];
  
  return !blockedAgents.some(pattern => pattern.test(userAgent));
}

// Comprehensive security middleware
export function securityMiddleware(options: {
  requireAuth?: boolean;
  requireCSRF?: boolean;
  requireWhitelist?: boolean;
  maxRequestSize?: number;
} = {}) {
  return async (request: NextRequest) => {
    try {
      // Basic security checks
      if (!validateIP(request, options.requireWhitelist)) {
        return NextResponse.json(
          { success: false, error: 'Access denied', code: 'IP_BLOCKED' },
          { status: 403 }
        );
      }
      
      if (!validateUserAgent(request)) {
        return NextResponse.json(
          { success: false, error: 'Invalid user agent', code: 'INVALID_USER_AGENT' },
          { status: 403 }
        );
      }
      
      if (!validateRequestSize(request, options.maxRequestSize)) {
        return NextResponse.json(
          { success: false, error: 'Request too large', code: 'REQUEST_TOO_LARGE' },
          { status: 413 }
        );
      }
      
      // CSRF validation for state-changing operations
      if (options.requireCSRF && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
        if (!validateCSRFToken(request)) {
          return NextResponse.json(
            { success: false, error: 'Invalid CSRF token', code: 'CSRF_INVALID' },
            { status: 403 }
          );
        }
      }
      
      return null; // Continue to next middleware
    } catch (error) {
      console.error('Security middleware error:', error);
      return NextResponse.json(
        { success: false, error: 'Security check failed', code: 'SECURITY_ERROR' },
        { status: 500 }
      );
    }
  };
}

// Audit logging
export function auditLog(request: NextRequest, action: string, details?: any) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ip: request.ip || request.headers.get('x-forwarded-for'),
    userAgent: request.headers.get('user-agent'),
    method: request.method,
    url: request.url,
    action,
    details: details || {},
  };
  
  // In production, send to logging service
  console.log('AUDIT:', JSON.stringify(logEntry));
}

// Error response helper
export function createErrorResponse(
  error: string,
  code: string,
  status: number = 400,
  details?: any
) {
  return NextResponse.json(
    {
      success: false,
      error,
      code,
      details,
      timestamp: new Date().toISOString()
    },
    { 
      status,
      headers: securityHeaders()
    }
  );
}

// Success response helper
export function createSuccessResponse(
  data: any,
  message?: string,
  status: number = 200
) {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString()
    },
    {
      status,
      headers: securityHeaders()
    }
  );
}