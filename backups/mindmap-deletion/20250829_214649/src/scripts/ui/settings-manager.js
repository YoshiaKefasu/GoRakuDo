// Settings Management System
class SettingsManager {
  constructor() {
    this.settings = this.loadSettings();
    this.initializeForm();
    this.setupEventListeners();
  }

  // Load settings from localStorage
  loadSettings() {
    const defaultSettings = {
      themeMode: "auto",
      fontSize: 16,
      language: "auto",
      performance: "balanced",
      animations: "normal",
      highContrast: false,
      focusIndicator: false,
    };

    try {
      const saved = localStorage.getItem("gorakudo-settings");
      return saved
        ? { ...defaultSettings, ...JSON.parse(saved) }
        : defaultSettings;
    } catch (error) {
      console.error("Error loading settings:", error);
      return defaultSettings;
    }
  }

  // Save settings to localStorage
  saveSettings(settings) {
    try {
      localStorage.setItem("gorakudo-settings", JSON.stringify(settings));
      this.applySettings(settings);
      this.showStatus("Pengaturan berhasil disimpan!", "success");
    } catch (error) {
      console.error("Error saving settings:", error);
      this.showStatus("Gagal menyimpan pengaturan", "error");
    }
  }

  // Apply settings to the page
  applySettings(settings) {
    // Apply theme
    if (settings.themeMode !== "auto") {
      document.documentElement.setAttribute("data-theme", settings.themeMode);
    }

    // Apply font size
    document.documentElement.style.fontSize = `${settings.fontSize}px`;

    // Apply performance settings
    if (settings.performance === "battery") {
      document.documentElement.setAttribute("data-performance", "battery");
    }

    // Apply animation settings
    if (settings.animations === "reduced") {
      document.documentElement.setAttribute("data-animations", "reduced");
    } else if (settings.animations === "disabled") {
      document.documentElement.setAttribute("data-animations", "disabled");
    }

    // Apply accessibility settings
    if (settings.highContrast) {
      document.documentElement.setAttribute("data-contrast", "high");
    }

    if (settings.focusIndicator) {
      document.documentElement.setAttribute("data-focus", "enhanced");
    }
  }

  // Initialize form with current settings
  initializeForm() {
    const form = document.getElementById("settingsForm");
    if (!form) return;

    // Set form values
    Object.keys(this.settings).forEach((key) => {
      const element = form.elements[key];
      if (!element) return;

      if (element.type === "checkbox") {
        element.checked = this.settings[key];
      } else if (element.type === "range") {
        element.value = this.settings[key];
        const valueDisplay = document.getElementById(`${key}Value`);
        if (valueDisplay) {
          valueDisplay.textContent = `${this.settings[key]}px`;
        }
      } else {
        element.value = this.settings[key];
      }
    });

    // Apply current settings
    this.applySettings(this.settings);
  }

  // Setup event listeners
  setupEventListeners() {
    const form = document.getElementById("settingsForm");
    if (!form) return;

    // Form submission
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    // Real-time updates for range inputs
    const fontSizeInput = document.getElementById("fontSize");
    if (fontSizeInput) {
      fontSizeInput.addEventListener("input", (e) => {
        const target = e.target;
        if (target && target.value) {
          const valueDisplay = document.getElementById("fontSizeValue");
          if (valueDisplay) {
            valueDisplay.textContent = `${target.value}px`;
          }
        }
      });
    }
  }

  // Handle form submission
  handleFormSubmit() {
    const form = document.getElementById("settingsForm");
    if (!form) return;

    const formData = new FormData(form);
    const newSettings = {};

    // Collect form data
    for (const [key, value] of formData.entries()) {
      if (key === "fontSize") {
        newSettings[key] = parseInt(value.toString());
      } else if (key === "highContrast" || key === "focusIndicator") {
        const element = form.elements[key];
        newSettings[key] = element ? element.checked : false;
      } else {
        newSettings[key] = value;
      }
    }

    // Save settings
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings(this.settings);
  }

  // Show status message
  showStatus(message, type) {
    const statusElement = document.getElementById("statusMessage");
    if (!statusElement) return;

    statusElement.textContent = message;
    statusElement.className = `status-message status-${type}`;
    statusElement.style.display = "block";

    setTimeout(() => {
      statusElement.style.display = "none";
    }, 3000);
  }
}

// Initialize settings manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new SettingsManager();
});
