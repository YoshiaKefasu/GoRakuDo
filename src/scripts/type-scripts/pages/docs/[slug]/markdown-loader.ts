/**
 * GitHub Markdown読み込み機能 - [slug].astro分離スクリプト
 * Astroネイティブ + Strict TypeScript + ES Modules
 * DRY・KISS原則に従った実装
 */

/**
 * GitHub Markdown読み込みクラス
 * KISS原則: シンプルで理解しやすいMarkdown読み込み実装
 */
export class GitHubMarkdownLoader {
  private urlParams: URLSearchParams;
  private markdownUrl: string | null;
  private title: string;

  constructor() {
    this.urlParams = new URLSearchParams(window.location.search);
    this.markdownUrl = this.urlParams.get("url");
    this.title = this.urlParams.get("title") || "Dokumentasi GoRakuDo";
  }

  /**
   * GitHub URLからMarkdownを読み込み
   * DRY原則: データ取得の共通化
   */
  public async loadFromGitHubUrl(url: string): Promise<string> {
    try {
      console.log(`📖 Loading markdown from: ${url}`);

      if (!this.isValidGitHubUrl(url)) {
        throw new Error("URL harus berupa raw GitHub URL yang valid");
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const markdownContent = await response.text();

      if (!markdownContent.trim()) {
        throw new Error("File markdown kosong");
      }

      return markdownContent;
    } catch (error) {
      console.error("❌ Error loading markdown:", error);
      throw error;
    }
  }

  /**
   * GitHub URLの妥当性チェック
   * KISS原則: バリデーション処理を明確に分離
   */
  private isValidGitHubUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return (
        urlObj.hostname === "raw.githubusercontent.com" &&
        urlObj.pathname.endsWith(".md")
      );
    } catch {
      return false;
    }
  }

  /**
   * Markdownからタイトルを抽出
   * DRY原則: テキスト処理の共通化
   */
  public extractTitleFromMarkdown(content: string): string {
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : "Dokumentasi GoRakuDo";
  }

  /**
   * URLからファイル名を取得
   * KISS原則: ファイル名取得処理を明確に分離
   */
  public getFileNameFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/");
      return pathParts[pathParts.length - 1].replace(".md", "");
    } catch {
      return "document";
    }
  }

  /**
   * 現在のMarkdown URLを取得
   */
  public getMarkdownUrl(): string | null {
    return this.markdownUrl;
  }

  /**
   * 現在のタイトルを取得
   */
  public getTitle(): string {
    return this.title;
  }
}
