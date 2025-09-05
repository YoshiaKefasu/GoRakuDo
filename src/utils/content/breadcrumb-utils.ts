// ========== ASTRO-NATIVE BREADCRUMB UTILITIES ==========
/**
 * Astro-native breadcrumb utilities with strict TypeScript support
 * Story 2.10: Implement Breadcrumb Navigation
 * 
 * DRY Principle: Single source of truth for breadcrumb logic
 * KISS Principle: Simple, focused utility functions
 * Astro Native: Optimized for Astro's component system
 */

import { logger } from '../logging/console-logger';

// ========== STRICT TYPE DEFINITIONS ==========
export interface BreadcrumbItem {
  readonly title: string;
  readonly url: string;
  readonly isActive: boolean;
  readonly icon?: string;
}

export interface BreadcrumbData {
  readonly items: readonly BreadcrumbItem[];
  readonly ariaLabel: string;
}

export type ToolName = 'anki' | 'migaku' | 'yomitan';

export interface ToolBreadcrumbConfig {
  readonly toolName: ToolName;
  readonly articleTitle?: string;
  readonly articleSlug?: string;
  readonly showHome?: boolean;
}

// ========== ASTRO-NATIVE BREADCRUMB GENERATORS ==========

/**
 * Generate tool breadcrumb data (KISS principle - single function for all tool breadcrumbs)
 * @param config - Tool breadcrumb configuration
 * @returns BreadcrumbData with structured breadcrumb items
 */
export function generateToolBreadcrumb(config: ToolBreadcrumbConfig): BreadcrumbData {
  const { toolName, articleTitle, articleSlug, showHome = true } = config;
  
  try {
    const displayName = toolName.charAt(0).toUpperCase() + toolName.slice(1);
    const items: BreadcrumbItem[] = [];

    // Home item (if requested)
    if (showHome) {
      items.push({
        title: 'Home',
        url: '/',
        isActive: false,
        icon: '🏠',
      });
    }

    // Tools section
    items.push({
      title: 'Tools',
      url: '/tools',
      isActive: false,
      icon: '🔧',
    });

    // Tool-specific items
    if (articleTitle && articleSlug) {
      // Tool article breadcrumb
      const sanitizedTitle = sanitizeText(articleTitle);
      const sanitizedSlug = sanitizeText(articleSlug);
      
      items.push(
        {
          title: displayName,
          url: `/tools/${toolName}`,
          isActive: false,
          icon: '🔧',
        },
        {
          title: truncateText(sanitizedTitle, 30),
          url: `/tools/${toolName}/${sanitizedSlug}`,
          isActive: true,
          icon: '📄',
        }
      );
    } else {
      // Tool index breadcrumb
      items.push({
        title: displayName,
        url: `/tools/${toolName}`,
        isActive: true,
        icon: '🔧',
      });
    }

    return {
      items: Object.freeze(items),
      ariaLabel: `${displayName}${articleTitle ? ` ${truncateText(articleTitle, 20)}` : ''} navigation breadcrumb`,
    };
  } catch (error) {
    logger.log(`Error generating tool breadcrumb: ${error}`, 'error');
    return createFallbackBreadcrumb();
  }
}

// ========== ASTRO-NATIVE UTILITY FUNCTIONS ==========

/**
 * Sanitize text for security (DRY principle - single sanitization function)
 * @param text - Text to sanitize
 * @returns Sanitized text
 */
export function sanitizeText(text: string): string {
  return text.replace(/[<>"'&]/g, '');
}

/**
 * Truncate text with ellipsis (KISS principle - simple utility)
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

/**
 * Create fallback breadcrumb (DRY principle - single fallback)
 * @returns Fallback breadcrumb data
 */
export function createFallbackBreadcrumb(): BreadcrumbData {
  return {
    items: Object.freeze([{
      title: 'Home',
      url: '/',
      isActive: true,
      icon: '🏠',
    }]),
    ariaLabel: 'Navigation breadcrumb',
  };
}

// ========== ASTRO-NATIVE VALIDATION ==========

/**
 * Validate breadcrumb data structure (KISS principle - simple validation)
 * @param data - The breadcrumb data to validate
 * @returns true if valid, false otherwise
 */
export function validateBreadcrumbData(data: unknown): data is BreadcrumbData {
  if (!data || typeof data !== 'object') return false;
  
  const breadcrumbData = data as Record<string, unknown>;
  
  // Check required properties
  if (!Array.isArray(breadcrumbData.items) || typeof breadcrumbData.ariaLabel !== 'string') {
    return false;
  }

  // Check items structure
  const items = breadcrumbData.items as unknown[];
  if (items.length === 0) return false;

  // Check each item
  for (const item of items) {
    if (!isValidBreadcrumbItem(item)) return false;
  }

  // Check exactly one active item
  const activeItems = items.filter((item: unknown) => 
    isValidBreadcrumbItem(item) && (item as BreadcrumbItem).isActive
  );
  
  return activeItems.length === 1;
}

/**
 * Type guard for breadcrumb item validation
 * @param item - Item to validate
 * @returns true if valid breadcrumb item
 */
function isValidBreadcrumbItem(item: unknown): item is BreadcrumbItem {
  if (!item || typeof item !== 'object') return false;
  
  const breadcrumbItem = item as Record<string, unknown>;
  
  return (
    typeof breadcrumbItem.title === 'string' &&
    typeof breadcrumbItem.url === 'string' &&
    typeof breadcrumbItem.isActive === 'boolean' &&
    (breadcrumbItem.icon === undefined || typeof breadcrumbItem.icon === 'string')
  );
}

/**
 * Sanitize breadcrumb item (DRY principle - uses shared sanitization)
 * @param item - The breadcrumb item to sanitize
 * @returns Sanitized breadcrumb item
 */
export function sanitizeBreadcrumbItem(item: BreadcrumbItem): BreadcrumbItem {
  const sanitizedTitle = sanitizeText(item.title);
  const sanitizedUrl = sanitizeText(item.url);
  
  if (sanitizedTitle !== item.title || sanitizedUrl !== item.url) {
    logger.log('Breadcrumb item sanitized for security', 'warning');
  }
  
  return {
    title: sanitizedTitle,
    url: sanitizedUrl,
    isActive: item.isActive,
    icon: item.icon,
  };
}
