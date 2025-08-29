# Local Development Setup Guide

## 🔒 Secure API Key Management

This guide ensures your API keys are stored locally and never exposed to GitHub.

## 📋 Prerequisites

- Node.js 18+ installed
- Git configured
- Google GenAI API key from Google AI Studio

## 🚀 Quick Setup

### Step 1: Clone Repository
```bash
git clone <your-repository-url>
cd GoRakuDo
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Environment Variables

**IMPORTANT**: Never commit your `.env` file to Git!

1. **Copy the template file**:
   ```bash
   cp env.example .env
   ```

2. **Edit `.env` file** with your actual API key:
   ```bash
   # Open .env in your preferred editor
   code .env
   # or
   nano .env
   # or
   notepad .env
   ```

3. **Replace the placeholder** with your real API key:
   ```bash
   # Change this line:
   GOOGLE_API_KEY=your_actual_api_key_here
   
   # To your actual API key:
   GOOGLE_API_KEY=AIzaSyYourActualAPIKeyHere
   ```

### Step 4: Verify Setup
```bash
npm run dev
```

You should see:
```
✅ Local development environment - AI processing enabled
```

## 🔐 Security Best Practices

### ✅ Do's
- ✅ Store API key in `.env` file locally
- ✅ Use `.env.example` as template only
- ✅ Keep `.env` file in `.gitignore`
- ✅ Test locally before pushing
- ✅ Rotate API keys regularly

### ❌ Don'ts
- ❌ Never commit `.env` file to Git
- ❌ Never share API keys in code
- ❌ Never log API keys to console
- ❌ Never use API keys in GitHub Actions

## 🛡️ Security Verification

### Check Git Status
```bash
git status
```

You should **NOT** see `.env` in the output. If you do:
```bash
git reset .env
git checkout .env
```

### Verify .gitignore
```bash
cat .gitignore | grep -E "\.env|api|key|secret"
```

Should show environment variable protections.

## 🔧 Troubleshooting

### API Key Not Working
1. Check `.env` file exists: `ls -la .env`
2. Verify API key format: `cat .env | grep GOOGLE_API_KEY`
3. Test API key validity in Google AI Studio
4. Check environment detection: `npm run dev`

### Build Errors
1. Ensure `.env` file is in project root
2. Verify API key is not empty
3. Check Node.js version: `node --version`
4. Clear cache: `npm cache clean --force`

### Git Issues
1. If `.env` is tracked: `git rm --cached .env`
2. If API key is in history: Create new API key
3. Check `.gitignore`: `cat .gitignore`

## 📁 File Structure

```
GoRakuDo/
├── .env                    # 🔒 Your local API key (never commit)
├── env.example            # 📋 Template file (safe to commit)
├── .gitignore             # 🛡️ Protects sensitive files
├── src/
│   └── utils/ai/          # 🤖 AI processing system
└── package.json
```

## 🔄 API Key Rotation

If you need to rotate your API key:

1. **Generate new key** in Google AI Studio
2. **Update local `.env`** file
3. **Test locally**: `npm run dev`
4. **Delete old key** from Google AI Studio
5. **Update team members** (if applicable)

## 📞 Support

If you encounter issues:

1. Check this guide first
2. Verify `.env` file setup
3. Test API key in Google AI Studio
4. Check environment detection logs

---

**Security Level**: 🔒🔒🔒🔒🔒 (Maximum Protection)  
**Last Updated**: 2025-08-21
