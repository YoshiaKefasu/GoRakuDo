// POST SCRIPT - Documentation and Posts Specific JavaScript

// Minimal Wave Animation for Posts (lighter version)
class PostWaveAnimation {
  constructor() {
    this.canvas = document.getElementById("waveCanvas");
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.animationId = null;
    this.time = 0;

    // Simpler waves for post pages
    this.waves = [
      {
        amplitude: 30,
        frequency: 0.008,
        speed: 0.015,
        offset: 0,
        color: "rgba(139, 93, 255, 0.04)",
        y: 0.8,
      },
      {
        amplitude: 25,
        frequency: 0.006,
        speed: -0.01,
        offset: Math.PI / 2,
        color: "rgba(139, 93, 255, 0.02)",
        y: 0.9,
      },
    ];

    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());
    this.animate();
  }

  resizeCanvas() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.waves.forEach((wave) => {
      wave.yPos = this.height * wave.y;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Simpler gradient for posts
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, "rgba(10, 10, 10, 1)");
    gradient.addColorStop(0.7, "rgba(10, 10, 10, 0.98)");
    gradient.addColorStop(1, "rgba(139, 93, 255, 0.01)");
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw simplified waves
    this.waves.forEach((wave) => {
      this.ctx.beginPath();

      for (let x = 0; x <= this.width + 10; x += 3) {
        const y =
          wave.yPos +
          Math.sin(x * wave.frequency + this.time * wave.speed + wave.offset) *
            wave.amplitude;

        if (x === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }

      this.ctx.lineTo(this.width, this.height);
      this.ctx.lineTo(0, this.height);
      this.ctx.closePath();

      this.ctx.fillStyle = wave.color;
      this.ctx.fill();
    });

    this.time += 0.5; // Slower animation for posts
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener("resize", () => this.resizeCanvas());
  }
}

// Navigation functions
function goHome() {
  window.location.href = "/index.html";
}

function goToPosts() {
  window.location.href = "/posts.html";
}

function goToInvitation() {
  window.location.href = "/discord/index.html";
}

function retryLoad() {
  window.location.reload();
}

// Posts page functionality
class PostsManager {
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
          description:
            "Panduan langkah demi langkah untuk memulai immersion bahasa Jepang dari nol.",
          icon: "📘",
          readTime: "10 min read",
        },
        {
          filename: "choosing-content.md",
          title: "Memilih Konten yang Tepat",
          description:
            "Cara memilih anime, manga, dan media Jepang yang sesuai dengan level Anda.",
          icon: "🎯",
          readTime: "8 min read",
        },
        {
          filename: "anki-guide.md",
          title: "Panduan Menggunakan Anki",
          description:
            "Setup dan strategi optimal untuk menggunakan Anki dalam pembelajaran bahasa Jepang.",
          icon: "💳",
          readTime: "12 min read",
        },
      ],
    };
  }

  generateGitHubUrl(filename) {
    return `https://raw.githubusercontent.com/${this.postsConfig.githubUser}/${this.postsConfig.repository}/${this.postsConfig.branch}/${this.postsConfig.docsFolder}/${filename}`;
  }

  generatePostUrl(filename, title) {
    const githubUrl = this.generateGitHubUrl(filename);
    return `/post.html?url=${encodeURIComponent(githubUrl)}&title=${encodeURIComponent(title)}`;
  }

  async checkFileExists(url) {
    try {
      const response = await fetch(url, { method: "HEAD" });
      return response.ok;
    } catch {
      return false;
    }
  }

  showLoading() {
    const loadingIndicator = document.getElementById("loadingIndicator");
    const postsGrid = document.getElementById("postsGrid");
    const errorMessage = document.getElementById("errorMessage");

    if (loadingIndicator) loadingIndicator.style.display = "block";
    if (postsGrid) postsGrid.style.display = "none";
    if (errorMessage) errorMessage.style.display = "none";
  }

  hideLoading() {
    const loadingIndicator = document.getElementById("loadingIndicator");
    const postsGrid = document.getElementById("postsGrid");

    if (loadingIndicator) loadingIndicator.style.display = "none";
    if (postsGrid) postsGrid.style.display = "grid";
  }

  showError() {
    const errorMessage = document.getElementById("errorMessage");
    if (errorMessage) errorMessage.style.display = "block";
  }

  renderPosts(posts) {
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

      // Check if file exists on GitHub with animation
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
      }, index * 200); // Staggered checking
    });
  }

  async initializePosts() {
    this.showLoading();

    try {
      this.renderPosts(this.postsConfig.posts);
      this.hideLoading();

      // Check if any files failed to load
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

// URL-Based GitHub Markdown Reader
class GitHubMarkdownLoader {
  constructor() {
    this.urlParams = new URLSearchParams(window.location.search);
    this.markdownUrl = this.urlParams.get("url");
    this.title = this.urlParams.get("title") || "Dokumentasi GoRakuDo";
  }

  async loadFromGitHubUrl(url) {
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

  isValidGitHubUrl(url) {
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

  extractTitleFromMarkdown(content) {
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : "Dokumentasi GoRakuDo";
  }

  getFileNameFromUrl(url) {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/");
      return pathParts[pathParts.length - 1].replace(".md", "");
    } catch {
      return "document";
    }
  }
}

// Post viewer functionality
class PostViewer {
  constructor() {
    this.loader = new GitHubMarkdownLoader();
    this.setupMarkedOptions();
  }

  setupMarkedOptions() {
    if (typeof marked !== "undefined") {
      marked.setOptions({
        highlight: function (code, lang) {
          if (typeof Prism !== "undefined" && Prism.languages[lang]) {
            return Prism.highlight(code, Prism.languages[lang], lang);
          }
          return code;
        },
        breaks: true,
        gfm: true,
      });
    }
  }

  showLoading() {
    const elements = {
      loading: document.getElementById("loadingIndicator"),
      content: document.getElementById("postContent"),
      error: document.getElementById("errorMessage"),
    };

    if (elements.loading) elements.loading.style.display = "block";
    if (elements.content) elements.content.style.display = "none";
    if (elements.error) elements.error.style.display = "none";
  }

  hideLoading() {
    const elements = {
      loading: document.getElementById("loadingIndicator"),
      content: document.getElementById("postContent"),
    };

    if (elements.loading) elements.loading.style.display = "none";
    if (elements.content) elements.content.style.display = "block";
  }

  showError(message) {
    const errorDetails = document.getElementById("errorDetails");
    const errorMessage = document.getElementById("errorMessage");
    const loadingIndicator = document.getElementById("loadingIndicator");
    const postContent = document.getElementById("postContent");

    if (errorDetails) errorDetails.textContent = message;
    if (errorMessage) errorMessage.style.display = "block";
    if (loadingIndicator) loadingIndicator.style.display = "none";
    if (postContent) postContent.style.display = "none";
  }

  renderPost(title, content, sourceUrl) {
    const postContent = document.getElementById("postContent");
    if (!postContent) return;

    document.title = `${title} | GoRakuDo Documentation`;

    const htmlContent = marked ? marked.parse(content) : content;
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

    if (typeof Prism !== "undefined") {
      Prism.highlightAll();
    }

    this.setupPostAnimations();
  }

  setupPostAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    const contentElements = document.querySelectorAll(
      ".post-content h1, .post-content h2, .post-content h3, .post-content p, .post-content ul, .post-content blockquote, .post-content pre",
    );
    contentElements.forEach((el, index) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
      observer.observe(el);
    });
  }

  async loadPost() {
    if (!this.loader.markdownUrl) {
      this.showError(
        "Parameter URL tidak ditemukan. Gunakan format: post.html?url=https://raw.githubusercontent.com/...",
      );
      return;
    }

    this.showLoading();

    try {
      const markdownContent = await this.loader.loadFromGitHubUrl(
        this.loader.markdownUrl,
      );
      const extractedTitle =
        this.loader.extractTitleFromMarkdown(markdownContent);
      const postTitle =
        this.loader.title !== "Dokumentasi GoRakuDo"
          ? this.loader.title
          : extractedTitle;

      this.renderPost(postTitle, markdownContent, this.loader.markdownUrl);
      this.hideLoading();
    } catch (error) {
      this.showError(`Gagal memuat konten: ${error.message}`);
    }
  }
}

// Utility functions
function copyPostUrl(url) {
  const fullUrl = window.location.origin + url;

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = "✅";
        button.style.color = "#4CAF50";

        setTimeout(() => {
          button.textContent = originalText;
          button.style.color = "#8B5DFF";
        }, 2000);
      })
      .catch(() => {
        fallbackCopyTextToClipboard(fullUrl);
      });
  } else {
    fallbackCopyTextToClipboard(fullUrl);
  }
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.top = "-9999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand("copy");
    alert("URL copied to clipboard!");
  } catch (err) {
    alert("Failed to copy URL");
  }

  document.body.removeChild(textArea);
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
}

// Enhanced scroll animations for post content
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Animate post cards
  const postCards = document.querySelectorAll(".post-card");
  postCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
  });
}

// Navbar scroll effect (simpler for posts)
function handleNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.style.background = "rgba(10, 10, 10, 0.95)";
    } else {
      navbar.style.background = "rgba(10, 10, 10, 0.9)";
    }
  }
}

// Initialize functionality based on page type
document.addEventListener("DOMContentLoaded", function () {
  console.log("📚 GoRakuDo Posts Loading...");

  // Initialize wave animation (lighter version)
  const waveAnimation = new PostWaveAnimation();

  // Check which page we're on and initialize accordingly
  const isPostsPage = window.location.pathname.includes("posts.html");
  const isPostPage = window.location.pathname.includes("post.html");

  if (isPostsPage) {
    console.log("📋 Initializing Posts Page...");
    const postsManager = new PostsManager();
    postsManager.initializePosts();
    setupScrollAnimations();
  } else if (isPostPage) {
    console.log("📖 Initializing Post Viewer...");
    const postViewer = new PostViewer();
    postViewer.loadPost();
  }

  // Universal scroll handling
  let scrollTimeout = null;
  window.addEventListener("scroll", function () {
    if (scrollTimeout) return;

    scrollTimeout = setTimeout(() => {
      handleNavbarScroll();
      scrollTimeout = null;
    }, 16);
  });

  // Cleanup on page unload
  window.addEventListener("beforeunload", function () {
    if (waveAnimation) {
      waveAnimation.destroy();
    }
  });

  console.log("✅ Posts System Loaded Successfully!");
});

// Global functions for HTML onclick handlers
window.goHome = goHome;
window.goToPosts = goToPosts;
window.goToInvitation = goToInvitation;
window.retryLoad = retryLoad;
window.copyPostUrl = copyPostUrl;
