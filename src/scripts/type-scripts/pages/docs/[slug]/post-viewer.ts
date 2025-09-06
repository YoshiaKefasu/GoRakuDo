/**
 * 投稿表示機能 - [slug].astro分離スクリプト
 * Astroネイティブ + Strict TypeScript + ES Modules
 * DRY・KISS原則に従った実装
 */

// PostData型は現在使用されていませんが、将来の拡張のために保持
import { GitHubMarkdownLoader } from './markdown-loader.js';

/**
 * 投稿表示クラス
 * KISS原則: シンプルで理解しやすい投稿表示実装
 */
export class PostViewer {
  private loader: GitHubMarkdownLoader;

  constructor() {
    this.loader = new GitHubMarkdownLoader();
    this.setupMarkedOptions();
  }

  /**
   * Marked.jsの設定
   * DRY原則: 設定の一元管理
   */
  private setupMarkedOptions(): void {
    if (typeof window !== "undefined" && window.marked) {
      window.marked.setOptions({
        highlight: function (code: string, lang: string): string {
          if (typeof window !== "undefined" && (window as unknown as { Prism: { languages: Record<string, unknown>; highlight: (code: string, lang: unknown, language: string) => string } }).Prism && (window as unknown as { Prism: { languages: Record<string, unknown>; highlight: (code: string, lang: unknown, language: string) => string } }).Prism.languages[lang]) {
            return (window as unknown as { Prism: { languages: Record<string, unknown>; highlight: (code: string, lang: unknown, language: string) => string } }).Prism.highlight(code, (window as unknown as { Prism: { languages: Record<string, unknown>; highlight: (code: string, lang: unknown, language: string) => string } }).Prism.languages[lang], lang);
          }
          return code;
        },
        breaks: true,
        gfm: true,
      });
    }
  }

  /**
   * ローディング状態の表示
   * KISS原則: 状態管理を明確に分離
   */
  public showLoading(): void {
    const elements = {
      loading: document.getElementById("loadingIndicator"),
      content: document.getElementById("postContent"),
      error: document.getElementById("errorMessage"),
    };

    if (elements.loading) elements.loading.style.display = "block";
    if (elements.content) elements.content.style.display = "none";
    if (elements.error) elements.error.style.display = "none";
  }

  /**
   * ローディング状態の非表示
   * KISS原則: 状態管理を明確に分離
   */
  public hideLoading(): void {
    const elements = {
      loading: document.getElementById("loadingIndicator"),
      content: document.getElementById("postContent"),
    };

    if (elements.loading) elements.loading.style.display = "none";
    if (elements.content) elements.content.style.display = "block";
  }

  /**
   * エラー状態の表示
   * DRY原則: エラー表示の共通化
   */
  public showError(message: string): void {
    const errorDetails = document.getElementById("errorDetails");
    const errorMessage = document.getElementById("errorMessage");
    const loadingIndicator = document.getElementById("loadingIndicator");
    const postContent = document.getElementById("postContent");

    if (errorDetails) errorDetails.textContent = message;
    if (errorMessage) errorMessage.style.display = "block";
    if (loadingIndicator) loadingIndicator.style.display = "none";
    if (postContent) postContent.style.display = "none";
  }

  /**
   * 投稿のレンダリング
   * DRY原則: レンダリング処理の共通化
   */
  public renderPost(title: string, content: string, sourceUrl: string): void {
    const postContent = document.getElementById("postContent");
    if (!postContent) return;

    document.title = `${title} | GoRakuDo Documentation`;

    const htmlContent = window.marked ? window.marked.parse(content) : content;
    const fileName = this.loader.getFileNameFromUrl(sourceUrl);

    postContent.innerHTML = `
      <div class="post-header" style="margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid rgba(139, 93, 255, 0.1);">
        <h1 style="margin-bottom: 15px;">${title}</h1>
        <div style="display: flex; gap: 20px; color: #999; font-size: 14px; flex-wrap: wrap;">
          <span>📄 ${fileName}</span>
          <span>🔗 <a href="${sourceUrl}" target="_blank" style="color: #8B5DFF; text-decoration: none;">Lihat di GitHub</a></span>
          <span>📅 ${new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}</span>
        </div>
      </div>
      <div class="markdown-content">
        ${htmlContent}
      </div>
    `;

    if (typeof window !== "undefined" && (window as unknown as { Prism: { highlightAll: () => void } }).Prism) {
      (window as unknown as { Prism: { highlightAll: () => void } }).Prism.highlightAll();
    }

    this.setupPostAnimations();
  }

  /**
   * 投稿アニメーションの設定
   * DRY原則: アニメーション処理の共通化
   */
  private setupPostAnimations(): void {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = "1";
          (entry.target as HTMLElement).style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    const contentElements = document.querySelectorAll(
      ".post-content h1, .post-content h2, .post-content h3, .post-content p, .post-content ul, .post-content blockquote, .post-content pre",
    );
    contentElements.forEach((el, index) => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "translateY(20px)";
      (el as HTMLElement).style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
      observer.observe(el);
    });
  }

  /**
   * 投稿の読み込み
   * KISS原則: 読み込み処理を明確に分離
   */
  public async loadPost(): Promise<void> {
    if (!this.loader.getMarkdownUrl()) {
      this.showError(
        "Parameter URL tidak ditemukan. Gunakan format: post.html?url=https://raw.githubusercontent.com/...",
      );
      return;
    }

    this.showLoading();

    try {
      const markdownContent = await this.loader.loadFromGitHubUrl(
        this.loader.getMarkdownUrl()!,
      );
      const extractedTitle = this.loader.extractTitleFromMarkdown(markdownContent);
      const postTitle =
        this.loader.getTitle() !== "Dokumentasi GoRakuDo"
          ? this.loader.getTitle()
          : extractedTitle;

      this.renderPost(postTitle, markdownContent, this.loader.getMarkdownUrl()!);
      this.hideLoading();
    } catch (error) {
      this.showError(`Gagal memuat konten: ${(error as Error).message}`);
    }
  }
}
