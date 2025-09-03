// ========== NEW SEO META MANAGER ==========
// Advanced metadata management with DRY and KISS principles

import type { 
  AdvancedMetaConfig,
  IntegratedMetaResult 
} from '../../types/new-seo-system';

export class NewSEOMetaManager {
  // 高度なメタデータの生成（DRY原則）
  generateAdvancedMeta(config: AdvancedMetaConfig): string[] {
    const tags: string[] = [];
    
    // Robots meta tag
    if (config.robots) {
      tags.push(this.generateMetaTag('robots', config.robots));
    }
    
    // Theme color
    if (config.themeColor) {
      tags.push(this.generateMetaTag('theme-color', config.themeColor));
    }
    
    // Color scheme
    if (config.colorScheme) {
      tags.push(this.generateMetaTag('color-scheme', config.colorScheme));
    }
    
    // Viewport configuration
    if (config.viewport) {
      tags.push(this.generateViewportTag(config.viewport));
    }
    
    return tags;
  }
  
  // 統合メタデータの生成（KISS原則）
  integrateAll(metaData: {
    advanced: string[];
    performance: string[];
    security: string[];
    analytics: string[];
  }): IntegratedMetaResult {
    return {
      advanced: metaData.advanced,
      performance: metaData.performance,
      security: metaData.security,
      analytics: metaData.analytics
    };
  }
  
  // 共通のメタタグ生成ロジック（DRY原則）
  private generateMetaTag(name: string, content: string): string {
    const escapedContent = this.escapeContent(content);
    return `<meta name="${name}" content="${escapedContent}" />`;
  }
  
  // Viewportタグの生成
  private generateViewportTag(config: any): string {
    const viewportContent = [
      config.width && `width=${config.width}`,
      config.initialScale && `initial-scale=${config.initialScale}`,
      config.minimumScale && `minimum-scale=${config.minimumScale}`,
      config.maximumScale && `maximum-scale=${config.maximumScale}`,
      config.userScalable !== undefined && `user-scalable=${config.userScalable ? 'yes' : 'no'}`
    ].filter(Boolean).join(', ');
    
    return `<meta name="viewport" content="${viewportContent}" />`;
  }
  
  // 共通のエスケープ処理（DRY原則）
  private escapeContent(content: string): string {
    return content.replace(/"/g, '&quot;');
  }
}
