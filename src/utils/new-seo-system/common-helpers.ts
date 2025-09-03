// ========== COMMON HELPER FUNCTIONS ==========
// Centralized utility functions to avoid duplication (DRY principle)

/**
 * Generate meta tag with proper escaping
 * @param name - Meta tag name
 * @param content - Meta tag content
 * @returns HTML string for meta tag
 */
export const generateMetaTag = (name: string, content: string): string => {
  const escapedContent = content.replace(/"/g, '&quot;');
  return `<meta name="${name}" content="${escapedContent}" />`;
};

/**
 * Generate link tag with optional type
 * @param rel - Link relationship
 * @param href - Link URL
 * @param type - Optional MIME type
 * @returns HTML string for link tag
 */
export const generateLinkTag = (
  rel: string,
  href: string,
  type?: string
): string => {
  const typeAttr = type ? ` type="${type}"` : '';
  return `<link rel="${rel}" href="${href}"${typeAttr} />`;
};

/**
 * Generate preload tag for performance optimization
 * @param href - Resource URL
 * @param as - Resource type
 * @returns HTML string for preload tag
 */
export const generatePreloadTag = (href: string, as: string): string => {
  return `<link rel="preload" href="${href}" as="${as}" />`;
};

/**
 * Generate favicon tags with multiple formats
 * @param faviconPath - Path to favicon
 * @returns Array of HTML strings for favicon tags
 */
export const generateFaviconTags = (faviconPath: string): string[] => {
  const tags: string[] = [];

  // SVG favicon (primary)
  tags.push(generateLinkTag('icon', faviconPath, 'image/svg+xml'));

  // ICO favicon (fallback)
  const icoPath = faviconPath.replace('.svg', '.ico');
  tags.push(generateLinkTag('icon', icoPath, 'image/x-icon'));

  return tags;
};

/**
 * Generate resource hint tags for performance optimization
 * @param hints - Resource hints configuration
 * @returns Array of HTML strings for resource hint tags
 */
export const generateResourceHintTags = (
  hints: Record<string, any>
): string[] => {
  const tags: string[] = [];

  if (hints.preload) {
    hints.preload.forEach((resource: string) => {
      tags.push(generatePreloadTag(resource, 'style'));
    });
  }

  if (hints.dnsPrefetch) {
    hints.dnsPrefetch.forEach((domain: string) => {
      tags.push(`<link rel="dns-prefetch" href="${domain}" />`);
    });
  }

  if (hints.preconnect) {
    hints.preconnect.forEach((url: string) => {
      tags.push(`<link rel="preconnect" href="${url}" />`);
    });
  }

  return tags;
};
