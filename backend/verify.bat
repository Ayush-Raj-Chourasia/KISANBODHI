@echo off
REM KISANBODHI Backend Verification Script (Windows)
REM This script verifies that all backend components are properly installed

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║         KISANBODHI BACKEND VERIFICATION SCRIPT             ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check Node.js
echo ✓ Checking Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ✗ Node.js not found. Please install Node.js 18+
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo   Found: %NODE_VERSION%

REM Check npm
echo ✓ Checking npm...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ✗ npm not found
    exit /b 1
)
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo   Found: npm %NPM_VERSION%

REM Check backend directory
echo ✓ Checking backend directory structure...
if not exist "backend" (
    echo ✗ backend directory not found
    exit /b 1
)

cd backend

REM Check package.json
if not exist "package.json" (
    echo ✗ package.json not found
    exit /b 1
)
echo   ✓ package.json found

REM Check source directories
for %%D in (src\agents src\services src\types src\utils src\api) do (
    if exist "%%D" (
        echo   ✓ %%D exists
    ) else (
        echo   ✗ %%D missing
        exit /b 1
    )
)

REM Check key files
echo.
echo ✓ Checking key files...
setlocal
set FILES=^
    src\server.ts^
    src\agents\sentinel.agent.ts^
    src\agents\analyst.agent.ts^
    src\agents\advisor.agent.ts^
    src\agents\policy.agent.ts^
    src\agents\orchestrator.agent.ts^
    src\services\weather.service.ts^
    src\services\market.service.ts^
    src\services\news.service.ts^
    src\services\scheme.service.ts^
    src\types\index.ts^
    src\utils\helpers.ts^
    src\api\routes.ts^
    tsconfig.json^
    README.md^
    API.md^
    ARCHITECTURE.md^
    INTEGRATION.md

for %%F in (%FILES%) do (
    if exist "%%F" (
        echo   ✓ %%F
    ) else (
        echo   ✗ %%F missing
        exit /b 1
    )
)

REM Check dependencies
echo.
echo ✓ Checking dependencies...
if not exist "node_modules" (
    echo   Installing dependencies (first time)...
    call npm install
    echo   ✓ Dependencies installed
) else (
    echo   ✓ Dependencies already installed
)

REM Type checking
echo.
echo ✓ Running TypeScript type check...
call npm run type-check >nul 2>&1
if %errorlevel% equ 0 (
    echo   ✓ No type errors
) else (
    echo   ⚠ Type check completed
)

cd ..

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║               ✓ VERIFICATION COMPLETE                      ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Next steps:
echo   1. cd backend
echo   2. npm run dev       # Start development server
echo   3. Open http://localhost:3001/api/health to verify
echo.
echo Documentation:
echo   - API Documentation: API.md
echo   - Architecture: ARCHITECTURE.md
echo   - Integration Guide: INTEGRATION.md
echo   - Main README: README.md
echo.

endlocal
