// ========== SECURITY MANAGER ==========
// Simple, focused security management (KISS principle)

import type { SecurityConfig } from '../../types/new-seo-system';

export class SecurityManager {
  // シンプルで理解しやすいセキュリティヘッダー生成（KISS原則）
  generateHeaders(security: SecurityConfig): string[] {
    const headers: string[] = [];
    
    // Content Security Policy
    if (security.csp) {
      headers.push(this.generateCSPHeader(security.csp));
    }
    
    // HTTP Strict Transport Security
    if (security.hsts) {
      headers.push(this.generateHSTSHeader(security.hsts));
    }
    
    // Referrer Policy
    if (security.referrerPolicy) {
      headers.push(this.generateReferrerPolicyHeader(security.referrerPolicy));
    }
    
    // Permissions Policy
    if (security.permissionsPolicy) {
      headers.push(this.generatePermissionsPolicyHeader(security.permissionsPolicy));
    }
    
    return headers;
  }
  
  // 共通のヘッダー生成ロジック（DRY原則）
  private generateCSPHeader(content: string): string {
    return `<meta http-equiv="Content-Security-Policy" content="${this.escapeContent(content)}" />`;
  }
  
  private generateHSTSHeader(content: string): string {
    return `<meta http-equiv="Strict-Transport-Security" content="${this.escapeContent(content)}" />`;
  }
  
  private generateReferrerPolicyHeader(content: string): string {
    return `<meta name="referrer" content="${this.escapeContent(content)}" />`;
  }
  
  private generatePermissionsPolicyHeader(content: string): string {
    return `<meta http-equiv="Permissions-Policy" content="${this.escapeContent(content)}" />`;
  }
  
  // 共通のエスケープ処理（DRY原則）
  private escapeContent(content: string): string {
    return content.replace(/"/g, '&quot;');
  }
}
