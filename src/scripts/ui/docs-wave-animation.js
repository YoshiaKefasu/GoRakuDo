// Docs Wave Animation - Optimized External Module
// Extracted from docs.astro for better maintainability and performance
// Performance-optimized wave animation for docs page

/**
 * DocsWaveAnimation - Enhanced Wave Animation System
 */
class DocsWaveAnimation {
  constructor() {
    this.animationId = null;
    this.time = 0;
    this.canvas = null;
    this.ctx = null;
    this.isInitialized = false;
    this.isAnimating = false;

    // Wave configuration
    this.waves = [
      {
        amplitude: 35,
        frequency: 0.008,
        speed: 0.015,
        offset: 0,
        color: 'rgba(139, 93, 255, 0.06)',
        y: 0.75,
        yPos: 0,
      },
      {
        amplitude: 45,
        frequency: 0.006,
        speed: -0.012,
        offset: Math.PI / 3,
        color: 'rgba(139, 93, 255, 0.04)',
        y: 0.8,
        yPos: 0,
      },
      {
        amplitude: 30,
        frequency: 0.01,
        speed: 0.018,
        offset: Math.PI / 2,
        color: 'rgba(139, 93, 255, 0.03)',
        y: 0.85,
        yPos: 0,
      },
    ];

    this.initialize();
  }

  /**
   * Initialize wave animation
   */
  initialize() {
    try {
      this.canvas = document.getElementById('waveCanvas');
      if (!this.canvas) {
        console.warn('Wave canvas not found for docs page');
        return;
      }

      this.ctx = this.canvas?.getContext('2d');
      if (!this.ctx) {
        console.warn('Canvas context not available for docs page');
        return;
      }

      this.resizeCanvas();
      this.setupEventListeners();
      this.isInitialized = true;

      console.log('🌊 Docs wave animation initialized successfully');
    } catch (error) {
      console.error('Error initializing docs wave animation:', error);
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });

    // Intersection Observer for performance optimization
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.startAnimation();
            } else {
              this.stopAnimation();
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '50px 0px',
        }
      );

      if (this.canvas) {
        observer.observe(this.canvas);
      }
    } else {
      // Fallback for older browsers
      this.startAnimation();
    }
  }

  /**
   * Resize canvas
   */
  resizeCanvas() {
    if (!this.canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.canvas.width = width;
    this.canvas.height = height;

    // Update wave y positions based on new height
    this.waves.forEach(wave => {
      wave.yPos = height * wave.y;
    });
  }

  /**
   * Start animation
   */
  startAnimation() {
    if (this.isAnimating || !this.isInitialized) return;

    this.isAnimating = true;
    this.animate();
  }

  /**
   * Stop animation
   */
  stopAnimation() {
    this.isAnimating = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Main animation loop
   */
  animate() {
    if (!this.isAnimating || !this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Create gradient background
    this.createBackgroundGradient();

    // Draw waves
    this.drawWaves();

    // Update time
    this.time += 0.016; // ~60fps

    // Continue animation
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  /**
   * Create background gradient
   */
  createBackgroundGradient() {
    if (!this.ctx || !this.canvas) return;

    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, 'rgba(10, 10, 10, 1)');
    gradient.addColorStop(0.6, 'rgba(10, 10, 10, 0.98)');
    gradient.addColorStop(1, 'rgba(139, 93, 255, 0.015)');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draw waves
   */
  drawWaves() {
    if (!this.ctx || !this.canvas) return;

    const width = this.canvas.width;
    const height = this.canvas.height;

    this.waves.forEach(wave => {
      this.ctx.beginPath();
      this.ctx.moveTo(0, height);

      // Draw wave path
      for (let x = 0; x <= width; x += 2) {
        const y =
          wave.yPos +
          Math.sin(x * wave.frequency + this.time * wave.speed + wave.offset) *
            wave.amplitude;
        this.ctx.lineTo(x, y);
      }

      this.ctx.lineTo(width, height);
      this.ctx.closePath();

      // Create wave gradient
      const waveGradient = this.ctx.createLinearGradient(0, 0, 0, height);
      waveGradient.addColorStop(0, wave.color);
      waveGradient.addColorStop(1, 'transparent');

      this.ctx.fillStyle = waveGradient;
      this.ctx.fill();
    });
  }

  /**
   * Update wave parameters
   */
  updateWaveParameters(newWaves) {
    if (newWaves && Array.isArray(newWaves)) {
      this.waves = newWaves;
      this.resizeCanvas();
    }
  }

  /**
   * Get current wave parameters
   */
  getWaveParameters() {
    return [...this.waves];
  }

  /**
   * Set animation speed
   */
  setAnimationSpeed(speed) {
    this.waves.forEach(wave => {
      wave.speed = wave.speed * (speed / 1.0);
    });
  }

  /**
   * Pause animation
   */
  pause() {
    this.stopAnimation();
  }

  /**
   * Resume animation
   */
  resume() {
    this.startAnimation();
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    this.stopAnimation();
    this.isInitialized = false;
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DocsWaveAnimation };
}

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initializeDocsWaveAnimation();
    });
  } else {
    initializeDocsWaveAnimation();
  }

  function initializeDocsWaveAnimation() {
    console.log('🌊 Initializing Docs Wave Animation...');

    try {
      window.docsWaveAnimation = new DocsWaveAnimation();
      console.log('✁EWave animation loaded successfully');
    } catch (error) {
      console.error('Error initializing docs wave animation:', error);
    }
  }
}
