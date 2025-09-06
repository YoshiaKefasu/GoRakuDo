/**
 * コンテンツレンダリング機能 - [slug].astro分離スクリプト
 * Astroネイティブ + Strict TypeScript + ES Modules
 * DRY・KISS原則に従った実装
 */

import type { 
  PostData, 
  ContentRenderConfig
} from './types.js';

/**
 * スケルトンローディングの実装
 * KISS原則: シンプルなローディング状態管理
 */
export function showPostSkeleton(_container: HTMLElement): void {
  // スケルトン機能は無効化されている
  console.log("🚫 Post skeleton disabled");
}

export function hidePostSkeleton(_container: HTMLElement): void {
  // スケルトン機能は無効化されている
  console.log("🚫 Post skeleton hiding disabled");
}

/**
 * Markdownレンダリング設定の取得
 * DRY原則: 設定の一元管理
 */
export function getMarkdownConfig(): ContentRenderConfig {
  return {
    highlight: function (code: string, lang: string): string {
      return `<pre><code class="language-${lang}">${code}</code></pre>`;
    },
    breaks: true,
    gfm: true,
  };
}

/**
 * コンテンツレンダリングの実装
 * KISS原則: シンプルなレンダリング処理
 */
export function renderPostContent(
  postData: PostData, 
  enhancedContent?: string
): void {
  if (!postData) {
    console.error("Post data is required for rendering");
    return;
  }

  const content = enhancedContent || postData.body;
  const postContent = document.getElementById("postContent");

  if (!postContent) {
    console.error("Post content container not found");
    return;
  }

  // スケルトンローディングを表示
  showPostSkeleton(postContent);

  // markedライブラリの設定
  if (window.marked) {
    const config = getMarkdownConfig();
    window.marked.setOptions(config);
  } else {
    console.error("Marked library not loaded");
    return;
  }

  // コンテンツをレンダリング（最小遅延）
  setTimeout(() => {
    try {
      if (window.marked) {
        const renderedHTML = window.marked.parse(content);
        postContent.innerHTML = renderedHTML;
        hidePostSkeleton(postContent);
        
        console.log("✅ Post content rendered successfully");
      } else {
        console.error("Marked library not available");
        // フォールバック: プレーンテキストを表示
        postContent.innerHTML = `<pre>${content}</pre>`;
      }
    } catch (error) {
      console.error("Failed to render post content:", error);
      // フォールバック: プレーンテキストを表示
      postContent.innerHTML = `<pre>${content}</pre>`;
    }
  }, 100);
}

/**
 * エンハンスドコンテンツの初期化
 * DRY原則: コンテンツ管理の一元化
 */
export function initializeEnhancedContent(enhancedContent?: string): void {
  if (enhancedContent) {
    window.enhancedContent = enhancedContent;
    console.log("🤖 Enhanced content with internal links loaded");
  }
}

/**
 * コンテンツレンダリングの完全な初期化
 * KISS原則: シンプルな初期化処理
 */
export function initializeContentRendering(
  postData: PostData, 
  enhancedContent?: string
): void {
  // エンハンスドコンテンツを初期化
  initializeEnhancedContent(enhancedContent);
  
  // コンテンツをレンダリング
  renderPostContent(postData, enhancedContent);
}
