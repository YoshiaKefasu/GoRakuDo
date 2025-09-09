// POST SCRIPT - Documentation and Posts Specific JavaScript (Refactored)

// Fluid Kanagawa Wave Animation (EXACTLY IDENTICAL TO HOMEPAGE)
class PostWaveAnimation {
  constructor() {
    this.canvas = document.getElementById("waveCanvas");
    if (!this.canvas) {
      console.warn("Wave canvas not found");
      return;
    }

    this.ctx = this.canvas.getContext("2d");
    this.animationId = null;
    this.time = 0;

    // EXACTLY IDENTICAL TO HOMEPAGE - 4 waves with same parameters
    this.waves = [
      {
        amplitude: 40,
        frequency: 0.01,
        speed: 0.02,
        offset: 0,
        color: "rgba(139, 93, 255, 0.08)",
        y: 0.875,
      },
      {
        amplitude: 60,
        frequency: 0.008,
        speed: -0.015,
        offset: Math.PI / 3,
        color: "rgba(139, 93, 255, 0.06)",
        y: 0.9375,
      },
      {
        amplitude: 35,
        frequency: 0.012,
        speed: 0.025,
        offset: Math.PI / 2,
        color: "rgba(139, 93, 255, 0.04)",
        y: 1,
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

    // EXACTLY IDENTICAL TO HOMEPAGE - Same gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, "rgba(10, 10, 10, 1)");
    gradient.addColorStop(0.5, "rgba(10, 10, 10, 0.95)");
    gradient.addColorStop(1, "rgba(139, 93, 255, 0.02)");
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw waves - EXACTLY IDENTICAL TO HOMEPAGE
    this.waves.forEach((wave, index) => {
      this.ctx.beginPath();

      // Create wave path - Same resolution as homepage
      for (let x = 0; x <= this.width + 10; x += 2) {
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

    this.time += 0.5; // Same animation speed as homepage
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener("resize", () => this.resizeCanvas());
  }
}

// Initialize functionality
document.addEventListener("DOMContentLoaded", function () {
  console.log("📚 GoRakuDo Post Loading...");

  // Initialize wave animation
  const waveAnimation = new PostWaveAnimation();

  // Cleanup on page unload
  window.addEventListener("beforeunload", function () {
    if (waveAnimation) {
      waveAnimation.destroy();
    }
  });

  console.log("✅ Post System Loaded Successfully!");
});