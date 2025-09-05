/**
 * Content Security Policy Configuration
 * Google Engineering Team 2025 Standards
 *
 * Purpose: Implement comprehensive security headers and CSP policies
 * Benefits: Enhanced security, XSS protection, resource integrity
 */

export interface CSPConfig {
  defaultSrc: string[];
  scriptSrc: string[];
  styleSrc: string[];
  imgSrc: string[];
  fontSrc: string[];
  connectSrc: string[];
  mediaSrc: string[];
  objectSrc: string[];
  baseUri: string[];
  formAction: string[];
  frameAncestors: string[];
  upgradeInsecureRequests: boolean;
}

/**
 * Production CSP Configuration
 * Strict security policies for production environment
 */
export const productionCSP: CSPConfig = {
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'",
    "'unsafe-inline'", // Required for Astro's inline scripts
    "'unsafe-eval'", // Required for Vue's reactivity system
    'https://www.googletagmanager.com', // Google Analytics
    'https://www.google-analytics.com', // Google Analytics
  ],
  styleSrc: [
    "'self'",
    "'unsafe-inline'", // Required for Tailwind CSS
    'https://fonts.googleapis.com', // Google Fonts
  ],
  imgSrc: [
    "'self'",
    'data:',
    'https:',
    'https://www.google-analytics.com', // Google Analytics
    'https://stats.g.doubleclick.net', // Google Analytics
  ],
  fontSrc: [
    "'self'",
    'data:',
    'https://fonts.gstatic.com', // Google Fonts
  ],
  connectSrc: [
    "'self'",
    'https:',
    'https://www.google-analytics.com', // Google Analytics
    'https://analytics.google.com', // Google Analytics
    'https://discord.gg', // Discord integration
  ],
  mediaSrc: ["'self'"],
  objectSrc: ["'none'"], // Block all plugins
  baseUri: ["'self'"],
  formAction: ["'self'"],
  frameAncestors: ["'none'"], // Prevent clickjacking
  upgradeInsecureRequests: true,
};

/**
 * Development CSP Configuration
 * Relaxed policies for development environment
 */
export const developmentCSP: CSPConfig = {
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    'http://localhost:*', // Development server
  ],
  styleSrc: [
    "'self'",
    "'unsafe-inline'",
    'http://localhost:*', // Development server
  ],
  imgSrc: [
    "'self'",
    'data:',
    'https:',
    'http://localhost:*', // Development server
  ],
  fontSrc: [
    "'self'",
    'data:',
    'https:',
    'http://localhost:*', // Development server
  ],
  connectSrc: [
    "'self'",
    'https:',
    'http://localhost:*', // Development server
    'ws://localhost:*', // WebSocket for HMR
  ],
  mediaSrc: ["'self'", 'http://localhost:*'],
  objectSrc: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
  frameAncestors: ["'none'"],
  upgradeInsecureRequests: false, // Disabled for development
};

/**
 * Generate CSP header string from configuration
 * @param config CSP configuration object
 * @returns Formatted CSP header string
 */
export function generateCSPHeader(config: CSPConfig): string {
  const directives = [
    `default-src ${config.defaultSrc.join(' ')}`,
    `script-src ${config.scriptSrc.join(' ')}`,
    `style-src ${config.styleSrc.join(' ')}`,
    `img-src ${config.imgSrc.join(' ')}`,
    `font-src ${config.fontSrc.join(' ')}`,
    `connect-src ${config.connectSrc.join(' ')}`,
    `media-src ${config.mediaSrc.join(' ')}`,
    `object-src ${config.objectSrc.join(' ')}`,
    `base-uri ${config.baseUri.join(' ')}`,
    `form-action ${config.formAction.join(' ')}`,
    `frame-ancestors ${config.frameAncestors.join(' ')}`,
  ];

  if (config.upgradeInsecureRequests) {
    directives.push('upgrade-insecure-requests');
  }

  return directives.join('; ');
}

/**
 * Get CSP configuration based on environment
 * @param isProduction Whether running in production mode
 * @returns Appropriate CSP configuration
 */
export function getCSPConfig(isProduction = false): CSPConfig {
  return isProduction ? productionCSP : developmentCSP;
}

/**
 * Generate security headers object
 * @param isProduction Whether running in production mode
 * @returns Object with security headers
 */
export function generateSecurityHeaders(isProduction = false) {
  const cspConfig = getCSPConfig(isProduction);

  return {
    'Content-Security-Policy': generateCSPHeader(cspConfig),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()',
    ].join(', '),
    'Strict-Transport-Security': isProduction
      ? 'max-age=31536000; includeSubDomains; preload'
      : undefined,
  };
}

/**
 * Validate CSP configuration
 * @param config CSP configuration to validate
 * @returns Validation result with errors if any
 */
export function validateCSPConfig(config: CSPConfig): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate required directives
  if (!config.defaultSrc.length) {
    errors.push('default-src directive is required');
  }

  if (!config.scriptSrc.length) {
    errors.push('script-src directive is required');
  }

  if (!config.styleSrc.length) {
    errors.push('style-src directive is required');
  }

  // Validate security best practices
  if (config.objectSrc.includes("'self'") || config.objectSrc.includes('*')) {
    errors.push("object-src should be set to 'none' for security");
  }

  if (
    config.frameAncestors.includes("'self'") ||
    config.frameAncestors.includes('*')
  ) {
    errors.push(
      "frame-ancestors should be set to 'none' to prevent clickjacking"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * CSP Nonce Generator
 * Generates cryptographically secure nonces for inline scripts
 */
export class CSPNonceGenerator {
  private static instance: CSPNonceGenerator;
  private nonces: Map<string, string> = new Map();

  private constructor() {}

  static getInstance(): CSPNonceGenerator {
    if (!CSPNonceGenerator.instance) {
      CSPNonceGenerator.instance = new CSPNonceGenerator();
    }
    return CSPNonceGenerator.instance;
  }

  /**
   * Generate a new nonce for a specific script
   * @param scriptId Unique identifier for the script
   * @returns Generated nonce
   */
  generateNonce(scriptId: string): string {
    const nonce = this.generateSecureNonce();
    this.nonces.set(scriptId, nonce);
    return nonce;
  }

  /**
   * Get existing nonce for a script
   * @param scriptId Unique identifier for the script
   * @returns Existing nonce or undefined
   */
  getNonce(scriptId: string): string | undefined {
    return this.nonces.get(scriptId);
  }

  /**
   * Generate cryptographically secure nonce
   * @returns Base64 encoded nonce
   */
  private generateSecureNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  }

  /**
   * Clear all nonces (useful for testing)
   */
  clearNonces(): void {
    this.nonces.clear();
  }
}

export default {
  productionCSP,
  developmentCSP,
  generateCSPHeader,
  getCSPConfig,
  generateSecurityHeaders,
  validateCSPConfig,
  CSPNonceGenerator,
};
