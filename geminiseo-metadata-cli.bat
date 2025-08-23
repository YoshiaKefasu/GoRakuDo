@echo off
REM Simple AI CLI for Windows Command Prompt
REM Usage: simple-ai-cli.bat [command]

if "%1"=="" goto help
if "%1"=="help" goto help
if "%1"=="test" goto test
if "%1"=="build" goto build
if "%1"=="env" goto env
goto unknown

:help
echo.
echo 🤖 Simple AI CLI for Windows
echo ============================
echo.
echo COMMANDS:
echo   test     - Test the build process (includes AI system)
echo   build    - Run full build with AI processing
echo   env      - Check environment variables
echo   help     - Show this help
echo.
echo EXAMPLES:
echo   simple-ai-cli.bat test
echo   simple-ai-cli.bat build
echo   simple-ai-cli.bat env
echo.
echo DIRECT COMMANDS:
echo   npm run build         - Full build with AI processing
echo   npm run dev          - Start development server
echo.
goto end

:test
echo 🧪 Testing Build Process (includes AI system)
echo ============================================
echo.
npm run build
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Build test completed successfully!
    echo 💡 This confirms your AI system is working during build process.
) else (
    echo.
    echo ❌ Build test failed!
    echo 💡 Check your .env file and API key configuration.
)
goto end

:build
echo 🏗️ Running Full Build with AI Processing
echo ========================================
echo.
npm run build
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Build completed successfully!
    echo 📁 Output directory: dist/
    echo 🌐 Ready for GitHub Pages deployment
) else (
    echo.
    echo ❌ Build failed!
    echo 💡 Check console output for errors.
)
goto end

:env
echo 📋 Checking Environment Configuration
echo ====================================
echo.
if exist .env (
    echo ✅ .env file found
    findstr "GOOGLE_API_KEY" .env >nul
    if %ERRORLEVEL% EQU 0 (
        echo ✅ GOOGLE_API_KEY found in .env
    ) else (
        echo ❌ GOOGLE_API_KEY not found in .env
        echo 💡 Add your API key: GOOGLE_API_KEY=your_key_here
    )
) else (
    echo ❌ .env file not found
    echo 💡 Create .env file: copy env.example .env
)
echo.
if exist "src\utils\ai\gemini-api-new.ts" (
    echo ✅ AI system files found
) else (
    echo ❌ AI system files not found
)
echo.
echo 🔗 Get API key from: https://makersuite.google.com/app/apikey
goto end

:unknown
echo ❌ Unknown command: %1
echo Run 'simple-ai-cli.bat help' for usage information
goto end

:end
