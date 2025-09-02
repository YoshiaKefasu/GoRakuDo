// ========== ANALYTICS INTEGRATION ==========
// Simple, focused analytics integration (KISS principle)

import type { AnalyticsConfig } from '../../types/new-seo-system';

export class AnalyticsIntegration {
  // シンプルで理解しやすいアナリティクスタグ生成（KISS原則）
  generateTags(analytics: AnalyticsConfig): string[] {
    const tags: string[] = [];
    
    // Google Analytics
    if (analytics.googleAnalytics) {
      tags.push(...this.generateGoogleAnalyticsTags(analytics.googleAnalytics));
    }
    
    // Google Tag Manager
    if (analytics.googleTagManager) {
      tags.push(...this.generateGoogleTagManagerTags(analytics.googleTagManager));
    }
    
    // Facebook Pixel
    if (analytics.facebookPixel) {
      tags.push(...this.generateFacebookPixelTags(analytics.facebookPixel));
    }
    
    // Custom scripts
    if (analytics.customScripts) {
      analytics.customScripts.forEach((script: string) => {
        tags.push(this.generateCustomScriptTag(script));
      });
    }
    
    return tags;
  }
  
  // 共通のタグ生成ロジック（DRY原則）
  private generateGoogleAnalyticsTags(gaId: string): string[] {
    return [
      `<script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>`,
      `<script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}');
      </script>`
    ];
  }
  
  private generateGoogleTagManagerTags(gtmId: string): string[] {
    return [
      `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');</script>`,
      `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
      height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`
    ];
  }
  
  private generateFacebookPixelTags(pixelId: string): string[] {
    return [
      `<script>
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelId}');
        fbq('track', 'PageView');
      </script>`,
      `<noscript><img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"
      /></noscript>`
    ];
  }
  
  private generateCustomScriptTag(script: string): string {
    return `<script>${script}</script>`;
  }
}
