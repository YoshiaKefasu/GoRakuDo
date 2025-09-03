// ========== PERFORMANCE OPTIMIZER ==========
// Simple, focused performance optimization (KISS principle)

import type {
  PerformanceConfig,
  ResourceConfig,
} from '../../types/new-seo-system';

export class PerformanceOptimizer {
  // シンプルで理解しやすいメソッド（KISS原則）
  generateTags(optimization: PerformanceConfig): string[] {
    const tags: string[] = [];

    // Preload tags
    if (optimization.preload) {
      optimization.preload.forEach((resource: ResourceConfig) => {
        tags.push(this.generatePreloadTag(resource));
      });
    }

    // Prefetch tags
    if (optimization.prefetch) {
      optimization.prefetch.forEach((resource: ResourceConfig) => {
        tags.push(this.generatePrefetchTag(resource));
      });
    }

    // DNS prefetch
    if (optimization.dnsPrefetch) {
      optimization.dnsPrefetch.forEach((domain: string) => {
        tags.push(this.generateDNSPrefetchTag(domain));
      });
    }

    // Preconnect
    if (optimization.preconnect) {
      optimization.preconnect.forEach((domain: string) => {
        tags.push(this.generatePreconnectTag(domain));
      });
    }

    return tags;
  }

  // 共通のタグ生成ロジック（DRY原則）
  private generatePreloadTag(resource: ResourceConfig): string {
    const { href, as, crossorigin, type } = resource;
    const crossoriginAttr = crossorigin ? ` crossorigin="${crossorigin}"` : '';
    const typeAttr = type ? ` type="${type}"` : '';

    return `<link rel="preload" href="${href}" as="${as}"${crossoriginAttr}${typeAttr} />`;
  }

  private generatePrefetchTag(resource: ResourceConfig): string {
    const { href, crossorigin, type } = resource;
    const crossoriginAttr = crossorigin ? ` crossorigin="${crossorigin}"` : '';
    const typeAttr = type ? ` type="${type}"` : '';

    return `<link rel="prefetch" href="${href}"${crossoriginAttr}${typeAttr} />`;
  }

  private generateDNSPrefetchTag(domain: string): string {
    return `<link rel="dns-prefetch" href="${domain}" />`;
  }

  private generatePreconnectTag(domain: string): string {
    return `<link rel="preconnect" href="${domain}" />`;
  }
}
