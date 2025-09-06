/**
 * 投稿管理機能 - docs.astro分離スクリプト
 * Astroネイティブ + Strict TypeScript + ES Modules
 * DRY・KISS原則に従った実装
 */

/**
 * 投稿設定の型定義
 */
export interface PostConfig {
  githubUser: string;
  repository: string;
  branch: string;
  docsFolder: string;
  posts: Array<{
    filename: string;
    title: string;
    description: string;
    icon: string;
    readTime: string;
  }>;
}

/**
 * 投稿管理クラス
 * KISS原則: シンプルで理解しやすい投稿管理実装
 */
export class PostsManager {
  private postsConfig: PostConfig;

  constructor() {
    this.postsConfig = {
      githubUser: "YoshiaKefasu",
      repository: "GoRakuDo",
      branch: "main",
      docsFolder: "docs",
      posts: [
        {
          filename: "getting-started.md",
          title: "Memulai Perjalanan Immersion",
          description: "Panduan langkah demi langkah untuk memulai immersion bahasa Jepang dari nol.",
          icon: "📘",
          readTime: "10 min read",
        },
        {
          filename: "choosing-content.md",
          title: "Memilih Konten yang Tepat",
          description: "Cara memilih anime, manga, dan media Jepang yang sesuai dengan level Anda.",
          icon: "🎯",
          readTime: "8 min read",
        },
        {
          filename: "anki-guide.md",
          title: "Panduan Menggunakan Anki",
          description: "Setup dan strategi optimal untuk menggunakan Anki dalam pembelajaran bahasa Jepang.",
          icon: "💳",
          readTime: "12 min read",
        },
      ],
    };
  }

  /**
   * GitHub URLの生成
   * DRY原則: URL生成の共通化
   */
  public generateGitHubUrl(filename: string): string {
    return `https://raw.githubusercontent.com/${this.postsConfig.githubUser}/${this.postsConfig.repository}/${this.postsConfig.branch}/${this.postsConfig.docsFolder}/${filename}`;
  }

  /**
   * 投稿URLの生成
   * KISS原則: URL生成処理を明確に分離
   */
  public generatePostUrl(filename: string, title: string): string {
    const githubUrl = this.generateGitHubUrl(filename);
    return `/post.html?url=${encodeURIComponent(githubUrl)}&title=${encodeURIComponent(title)}`;
  }

  /**
   * ファイル存在チェック
   * DRY原則: ファイルチェック処理の共通化
   */
  public async checkFileExists(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: "HEAD" });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * ローディング状態の表示
   * KISS原則: 状態管理を明確に分離
   */
  public showLoading(): void {
    const loadingIndicator = document.getElementById("loadingIndicator");
    const postsGrid = document.getElementById("postsGrid");
    const errorMessage = document.getElementById("errorMessage");

    if (loadingIndicator) loadingIndicator.style.display = "block";
    if (postsGrid) postsGrid.style.display = "none";
    if (errorMessage) errorMessage.style.display = "none";
  }

  /**
   * ローディング状態の非表示
   * KISS原則: 状態管理を明確に分離
   */
  public hideLoading(): void {
    const loadingIndicator = document.getElementById("loadingIndicator");
    const postsGrid = document.getElementById("postsGrid");

    if (loadingIndicator) loadingIndicator.style.display = "none";
    if (postsGrid) postsGrid.style.display = "grid";
  }

  /**
   * エラー状態の表示
   * DRY原則: エラー表示の共通化
   */
  public showError(): void {
    const errorMessage = document.getElementById("errorMessage");
    if (errorMessage) errorMessage.style.display = "block";
  }

  /**
   * 投稿のレンダリング
   * DRY原則: レンダリング処理の共通化
   */
  public renderPosts(posts: typeof this.postsConfig.posts): void {
    const postsGrid = document.getElementById("postsGrid");
    if (!postsGrid) return;

    postsGrid.innerHTML = "";

    posts.forEach((post, index) => {
      const postCard = document.createElement("div");
      postCard.className = "post-card";

      const postUrl = this.generatePostUrl(post.filename, post.title);

      postCard.innerHTML = `
        <div class="post-icon">${post.icon}</div>
        <h3>${post.title}</h3>
        <p>${post.description}</p>
        <div class="post-meta">
          <span class="post-readtime">${post.readTime}</span>
          <span class="post-status" id="status-${index}">🔄 Checking...</span>
        </div>
        <div class="post-actions">
          <a href="${postUrl}" class="post-link">Baca Panduan →</a>
          <button class="copy-url-btn" onclick="copyPostUrl('${postUrl}')" title="Copy URL">📋</button>
        </div>
      `;

      postsGrid.appendChild(postCard);

      // ファイル存在チェック（アニメーション付き）
      setTimeout(() => {
        this.checkFileExists(this.generateGitHubUrl(post.filename)).then(
          (exists) => {
            const statusElement = document.getElementById(`status-${index}`);
            if (statusElement) {
              if (exists) {
                statusElement.textContent = "✅ Available";
                statusElement.style.color = "#4CAF50";
              } else {
                statusElement.textContent = "❌ Not Found";
                statusElement.style.color = "#ff6b6b";
              }
              statusElement.style.transition = "all 0.3s ease";
            }
          },
        );
      }, index * 200); // 段階的チェック
    });
  }

  /**
   * 投稿の初期化
   * KISS原則: 初期化処理を明確に分離
   */
  public async initializePosts(): Promise<void> {
    this.showLoading();

    try {
      this.renderPosts(this.postsConfig.posts);
      this.hideLoading();

      // ファイル読み込みエラーのチェック
      const hasErrors = await Promise.all(
        this.postsConfig.posts.map((post) =>
          this.checkFileExists(this.generateGitHubUrl(post.filename)).then(
            (exists) => !exists,
          ),
        ),
      ).then((results) => results.some(Boolean));

      if (hasErrors) {
        this.showError();
      }
    } catch (error) {
      console.error("Failed to initialize posts:", error);
      this.renderPosts(this.postsConfig.posts);
      this.hideLoading();
      this.showError();
    }
  }
}
