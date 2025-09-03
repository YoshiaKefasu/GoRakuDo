// ========== COMMON HELPERS TESTS ==========
// Tests for common utility functions

import {
  generateMetaTag,
  generateLinkTag,
  generatePreloadTag,
  generateFaviconTags,
  generateResourceHintTags,
} from '../common-helpers';

describe('Common Helpers', () => {
  describe('generateMetaTag', () => {
    it('should generate meta tag with proper escaping', () => {
      const result = generateMetaTag('description', 'Test "quoted" content');
      expect(result).toBe(
        '<meta name="description" content="Test &quot;quoted&quot; content" />'
      );
    });

    it('should generate meta tag with simple content', () => {
      const result = generateMetaTag('keywords', 'test, keywords');
      expect(result).toBe('<meta name="keywords" content="test, keywords" />');
    });
  });

  describe('generateLinkTag', () => {
    it('should generate link tag without type', () => {
      const result = generateLinkTag('canonical', 'https://example.com');
      expect(result).toBe(
        '<link rel="canonical" href="https://example.com" />'
      );
    });

    it('should generate link tag with type', () => {
      const result = generateLinkTag('icon', '/favicon.svg', 'image/svg+xml');
      expect(result).toBe(
        '<link rel="icon" href="/favicon.svg" type="image/svg+xml" />'
      );
    });
  });

  describe('generatePreloadTag', () => {
    it('should generate preload tag', () => {
      const result = generatePreloadTag('/styles.css', 'style');
      expect(result).toBe(
        '<link rel="preload" href="/styles.css" as="style" />'
      );
    });
  });

  describe('generateFaviconTags', () => {
    it('should generate favicon tags for SVG', () => {
      const result = generateFaviconTags('/favicon.svg');
      expect(result).toHaveLength(2);
      expect(result[0]).toContain('image/svg+xml');
      expect(result[1]).toContain('image/x-icon');
    });
  });

  describe('generateResourceHintTags', () => {
    it('should generate preload resource hints', () => {
      const hints = {
        preload: ['/styles.css', '/scripts.js'],
      };
      const result = generateResourceHintTags(hints);
      expect(result).toHaveLength(2);
      expect(result[0]).toContain('preload');
      expect(result[1]).toContain('preload');
    });

    it('should generate DNS prefetch hints', () => {
      const hints = {
        dnsPrefetch: ['https://fonts.googleapis.com'],
      };
      const result = generateResourceHintTags(hints);
      expect(result).toHaveLength(1);
      expect(result[0]).toContain('dns-prefetch');
    });

    it('should generate preconnect hints', () => {
      const hints = {
        preconnect: ['https://fonts.googleapis.com'],
      };
      const result = generateResourceHintTags(hints);
      expect(result).toHaveLength(1);
      expect(result[0]).toContain('preconnect');
    });

    it('should handle empty hints', () => {
      const result = generateResourceHintTags({});
      expect(result).toHaveLength(0);
    });
  });
});
