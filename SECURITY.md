# Security Documentation - API Key Protection

## Overview

This document outlines the security measures implemented to protect API keys and sensitive data during the build and deployment process.

## 🔒 API Key Security Measures

### 1. Environment-Based Processing Control

The system automatically detects the environment and controls AI processing accordingly:

- **Local Development**: AI processing enabled with API key from `.env` file
- **GitHub Actions**: AI processing completely disabled for security
- **Production Builds**: Uses pre-processed data files only

### 2. GitHub Actions Security

#### Environment Variables Protection
```yaml
env:
  # SECURITY: Ensure API keys are NEVER exposed in GitHub Actions
  NODE_ENV: production
  GITHUB_ACTIONS: true
  BUILD_ENVIRONMENT: github-actions
  ENABLE_AI_PROCESSING: false
  # SECURITY: Use empty API key to prevent any AI processing in GitHub Actions
  GEMINI_API_KEY: ""
  GEMINI_MODEL: ""
  GEMINI_RATE_LIMIT_RPD: 0
  GEMINI_RATE_LIMIT_RPM: 0
```

#### Security Features:
- ✅ **Empty API Key**: Prevents any AI API calls in GitHub Actions
- ✅ **Processing Disabled**: `ENABLE_AI_PROCESSING: false` ensures no AI processing
- ✅ **Environment Detection**: Automatic detection of GitHub Actions environment
- ✅ **Pre-processed Data**: Uses existing AI-generated data files only

### 3. Local Development Security

#### Environment File Protection
```bash
# env.example (template - no real API keys)
# SECURITY: Replace with your actual API key (never commit this file with real keys)
GEMINI_API_KEY=your_actual_api_key_here
GEMINI_MODEL=gemini-2.5-flash
GEMINI_RATE_LIMIT_RPD=500
GEMINI_RATE_LIMIT_RPM=15
NODE_ENV=development
GITHUB_ACTIONS=false
BUILD_ENVIRONMENT=localhost
ENABLE_AI_PROCESSING=true
```

#### Security Features:
- ✅ **Git Ignore**: `.env` files are excluded from Git tracking
- ✅ **Template File**: `.env.example` provides structure without real keys
- ✅ **Local Only**: API keys only exist in local development environment

### 4. File-Based Data Persistence

#### Pre-processed Data Storage
```
src/data/ai-generated/
├── .gitkeep
├── getting-started-ai-data.json
├── immersion-philosophy-ai-data.json
├── anki-guide-ai-data.json
├── choosing-content-ai-data.json
└── manifest.json
```

#### Security Features:
- ✅ **Persistent Data**: AI-generated data saved to files for production use
- ✅ **No API Calls**: Production builds use pre-processed data only
- ✅ **Version Control**: Data files are committed to repository safely

### 5. Environment Detection System

#### Automatic Environment Detection
```typescript
export class EnvironmentManager {
  private shouldEnableAIProcessing(isGitHubActions: boolean, isDevelopment: boolean): boolean {
    if (isGitHubActions) { 
      console.log('🔒 GitHub Actions detected - AI processing disabled'); 
      return false; 
    }
    if (!isDevelopment) { 
      console.log('🔒 Production environment detected - AI processing disabled'); 
      return false; 
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) { 
      console.warn('⚠️ No Gemini API key found - AI processing disabled'); 
      return false; 
    }
    console.log('✅ Local development environment - AI processing enabled'); 
    return true;
  }
}
```

## 🛡️ Security Checklist

### Before Deployment
- [ ] `.env` file is in `.gitignore`
- [ ] No API keys in committed files
- [ ] Pre-processed data files are committed
- [ ] Environment detection is working

### During Deployment
- [ ] GitHub Actions uses empty API key
- [ ] AI processing is disabled
- [ ] Only pre-processed data is used
- [ ] No sensitive data in build logs

### After Deployment
- [ ] No API keys exposed in public repository
- [ ] Site functions with pre-processed data
- [ ] No AI API calls from production

## 🔧 Setup Instructions

### For Local Development
1. Copy `env.example` to `.env`
2. Replace `your_actual_api_key_here` with your real Gemini API key in `.env`
3. Run `npm run dev` for local development
4. AI processing will be enabled locally

### For Production Deployment
1. Ensure `.env` is in `.gitignore`
2. Commit pre-processed data files
3. Push to main branch
4. GitHub Actions will deploy securely

## 🚨 Security Warnings

### Never Do:
- ❌ Commit `.env` files with real API keys
- ❌ Commit `env.example` with real API keys
- ❌ Add API keys to GitHub repository secrets
- ❌ Enable AI processing in GitHub Actions
- ❌ Log API keys in build output

### Always Do:
- ✅ Use `env.example` as template only
- ✅ Keep API keys local only in `.env` file
- ✅ Use pre-processed data in production
- ✅ Test security measures before deployment

## 📊 Security Monitoring

### Build Logs
The build process includes security logging:
```
🔒 Building in secure GitHub Actions environment...
🔒 AI processing disabled for security
🔒 Using pre-processed data files only
✅ Build completed securely
```

### Environment Detection
Automatic detection and logging:
```
🔒 GitHub Actions detected - AI processing disabled
✅ Local development environment - AI processing enabled
```

## 🔍 Troubleshooting

### If API Key is Exposed
1. Immediately rotate the API key
2. Check `.gitignore` includes `.env`
3. Remove any committed `.env` files
4. Update local `.env` with new key

### If AI Processing Fails
1. Check environment detection
2. Verify API key in local `.env`
3. Ensure pre-processed data exists
4. Check rate limits and quotas

---

**Last Updated**: 2025-08-21  
**Security Level**: 🔒🔒🔒🔒🔒 (Maximum Protection)
