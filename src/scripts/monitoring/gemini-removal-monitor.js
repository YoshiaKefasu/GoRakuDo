/**
 * Gemini API Removal Monitor
 * GoRakuDo Project - Continuous Monitoring System
 * Target: Monitor for any resurgence of Gemini API dependencies
 */

import fs from 'fs';
import path from 'path';

class GeminiRemovalMonitor {
  constructor() {
    this.monitoringInterval = 300000; // 5 minutes
    this.logFile = 'gemini-removal-monitor.log';
    this.alertThreshold = 1; // Alert if any Gemini references found
    this.monitoringActive = false;
    this.monitoringTimer = null;
    
    this.init();
  }

  init() {
    console.log("🔍 Gemini API Removal Monitor initialized");
    this.startMonitoring();
  }

  startMonitoring() {
    if (this.monitoringActive) {
      console.log("⚠️  Monitoring is already active");
      return;
    }

    this.monitoringActive = true;
    console.log("🚀 Starting continuous monitoring...");
    
    // Initial check
    this.performMonitoringCheck();
    
    // Set up periodic monitoring
    this.monitoringTimer = setInterval(() => {
      this.performMonitoringCheck();
    }, this.monitoringInterval);
  }

  stopMonitoring() {
    if (this.monitoringTimer) {
      clearInterval(this.monitoringTimer);
      this.monitoringTimer = null;
    }
    
    this.monitoringActive = false;
    console.log("⏹️  Monitoring stopped");
  }

  async performMonitoringCheck() {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 🔍 Performing monitoring check...`);
    
    try {
      const results = await this.comprehensiveCheck();
      this.logResults(timestamp, results);
      
      if (results.totalReferences > 0) {
        this.triggerAlert(results);
      } else {
        console.log("✅ No Gemini API references detected");
      }
      
    } catch (error) {
      const errorMessage = `Monitoring check failed: ${error.message}`;
      console.error(errorMessage);
      this.logError(timestamp, errorMessage);
    }
  }

  async comprehensiveCheck() {
    const results = {
      timestamp: new Date().toISOString(),
      packageJsonCheck: await this.checkPackageJson(),
      environmentCheck: await this.checkEnvironmentVariables(),
      sourceCodeCheck: await this.checkSourceCode(),
      configCheck: await this.checkConfigurationFiles(),
      totalReferences: 0
    };

    // Calculate total references
    results.totalReferences = 
      results.packageJsonCheck.references +
      results.environmentCheck.references +
      results.sourceCodeCheck.references +
      results.configCheck.references;

    return results;
  }

  async checkPackageJson() {
    try {
      if (!fs.existsSync('package.json')) {
        return { exists: false, references: 0, details: [] };
      }

      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const references = [];
      let count = 0;

      // Check dependencies
      if (packageJson.dependencies && packageJson.dependencies['@google/genai']) {
        references.push(`dependencies: @google/genai v${packageJson.dependencies['@google/genai']}`);
        count++;
      }

      // Check devDependencies
      if (packageJson.devDependencies && packageJson.devDependencies['@google/genai']) {
        references.push(`devDependencies: @google/genai v${packageJson.devDependencies['@google/genai']}`);
        count++;
      }

      return {
        exists: true,
        references: count,
        details: references
      };

    } catch (error) {
      return {
        exists: false,
        references: 0,
        details: [`Error reading package.json: ${error.message}`]
      };
    }
  }

  async checkEnvironmentVariables() {
    try {
      const references = [];
      let count = 0;

      // Check env.example
      if (fs.existsSync('env.example')) {
        const envExample = fs.readFileSync('env.example', 'utf8');
        
        if (envExample.includes('GOOGLE_API_KEY')) {
          references.push('env.example: GOOGLE_API_KEY');
          count++;
        }
        
        if (envExample.includes('GOOGLE_MODEL')) {
          references.push('env.example: GOOGLE_MODEL');
          count++;
        }
      }

      // Check actual environment variables
      if (process.env.GOOGLE_API_KEY) {
        references.push('process.env: GOOGLE_API_KEY');
        count++;
      }

      return {
        references: count,
        details: references
      };

    } catch (error) {
      return {
        references: 0,
        details: [`Error checking environment: ${error.message}`]
      };
    }
  }

  async checkSourceCode() {
    try {
      const searchPatterns = [
        /@google\/genai/,
        /GoogleGenAI/,
        /GeminiAIService/,
        /GeminiAIServiceNew/,
        /GOOGLE_API_KEY/,
        /GOOGLE_MODEL/
      ];
      
      const excludePatterns = [
        /\.git\//,
        /node_modules\//,
        /dist\//,
        /\.backup$/,
        /gemini-removal-monitor\.log$/
      ];
      
      const searchDirectories = [
        'src',
        'GenAI-PostMetadata-Gemini(Deprecated)',
        'scripts'
      ];
      
      const references = [];
      let totalCount = 0;
      
      for (const dir of searchDirectories) {
        if (!fs.existsSync(dir)) continue;
        
        const files = this.getAllFiles(dir);
        
        for (const file of files) {
          // Skip excluded patterns
          if (excludePatterns.some(pattern => pattern.test(file))) continue;
          
          try {
            const content = fs.readFileSync(file, 'utf8');
            
            for (const pattern of searchPatterns) {
              const matches = content.match(pattern);
              if (matches) {
                references.push(`${file}: ${pattern} (${matches.length} matches)`);
                totalCount += matches.length;
              }
            }
          } catch (error) {
            // Skip files that can't be read
            continue;
          }
        }
      }

      return {
        references: totalCount,
        details: references
      };

    } catch (error) {
      return {
        references: 0,
        details: [`Error checking source code: ${error.message}`]
      };
    }
  }

  async checkConfigurationFiles() {
    try {
      const configFiles = [
        'astro.config.mjs',
        'tailwind.config.mjs',
        'tsconfig.json',
        'jest.config.js'
      ];
      
      const references = [];
      let count = 0;
      
      for (const file of configFiles) {
        if (!fs.existsSync(file)) continue;
        
        try {
          const content = fs.readFileSync(file, 'utf8');
          
          if (content.includes('@google/genai') || content.includes('GOOGLE_API_KEY')) {
            references.push(`${file}: Gemini API references detected`);
            count++;
          }
        } catch (error) {
          references.push(`${file}: Error reading file`);
          count++;
        }
      }

      return {
        references: count,
        details: references
      };

    } catch (error) {
      return {
        references: 0,
        details: [`Error checking configuration files: ${error.message}`]
      };
    }
  }

  getAllFiles(dir) {
    const files = [];
    
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          files.push(...this.getAllFiles(fullPath));
        } else {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Skip directories that can't be read
    }
    
    return files;
  }

  logResults(timestamp, results) {
    const logEntry = {
      timestamp,
      results,
      summary: {
        totalReferences: results.totalReferences,
        status: results.totalReferences > 0 ? 'ALERT' : 'CLEAN'
      }
    };

    // Console output
    console.log(`[${timestamp}] 📊 Monitoring Results:`);
    console.log(`   Package.json: ${results.packageJsonCheck.references} references`);
    console.log(`   Environment: ${results.environmentCheck.references} references`);
    console.log(`   Source Code: ${results.sourceCodeCheck.references} references`);
    console.log(`   Config Files: ${results.configCheck.references} references`);
    console.log(`   Total: ${results.totalReferences} references`);
    console.log(`   Status: ${logEntry.summary.status}`);

    // File logging
    this.writeToLog(logEntry);
  }

  logError(timestamp, errorMessage) {
    const logEntry = {
      timestamp,
      type: 'ERROR',
      message: errorMessage
    };

    console.error(`[${timestamp}] ❌ ${errorMessage}`);
    this.writeToLog(logEntry);
  }

  writeToLog(logEntry) {
    try {
      const logLine = JSON.stringify(logEntry) + '\n';
      fs.appendFileSync(this.logFile, logLine);
    } catch (error) {
      console.error(`Failed to write to log file: ${error.message}`);
    }
  }

  triggerAlert(results) {
    const alertMessage = `🚨 ALERT: ${results.totalReferences} Gemini API references detected!`;
    console.error(alertMessage);
    
    // Log alert
    this.logError(new Date().toISOString(), alertMessage);
    
    // Here you could integrate with external notification systems
    // For now, we'll just log it
    console.log("📧 Alert would be sent to monitoring system");
    
    // Trigger immediate re-check
    setTimeout(() => {
      console.log("🔄 Triggering immediate re-check...");
      this.performMonitoringCheck();
    }, 10000); // 10 seconds later
  }

  getMonitoringStatus() {
    return {
      active: this.monitoringActive,
      interval: this.monitoringInterval,
      lastCheck: this.lastCheckTime,
      logFile: this.logFile
    };
  }

  cleanup() {
    this.stopMonitoring();
    console.log("🧹 Gemini Removal Monitor cleaned up");
  }
}

// Export for use in other modules
export default GeminiRemovalMonitor;

// Auto-initialize if running in Node.js
if (typeof window === 'undefined') {
  const monitor = new GeminiRemovalMonitor();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    monitor.cleanup();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    monitor.cleanup();
    process.exit(0);
  });
}

