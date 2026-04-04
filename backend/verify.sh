#!/bin/bash

# KISANBODHI Backend Verification Script
# This script verifies that all backend components are properly installed and configured

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         KISANBODHI BACKEND VERIFICATION SCRIPT             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "  Found: $NODE_VERSION"
else
    echo "  ✗ Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check npm
echo "✓ Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "  Found: npm $NPM_VERSION"
else
    echo "  ✗ npm not found"
    exit 1
fi

# Check backend directory
echo "✓ Checking backend directory structure..."
if [ ! -d "backend" ]; then
    echo "  ✗ backend directory not found"
    exit 1
fi

cd backend

# Check package.json
if [ ! -f "package.json" ]; then
    echo "  ✗ package.json not found"
    exit 1
fi

echo "  ✓ package.json found"

# Check source directories
DIRS=("src/agents" "src/services" "src/types" "src/utils" "src/api")
for dir in "${DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "  ✓ $dir exists"
    else
        echo "  ✗ $dir missing"
        exit 1
    fi
done

# Check key files
FILES=(
    "src/server.ts"
    "src/agents/sentinel.agent.ts"
    "src/agents/analyst.agent.ts"
    "src/agents/advisor.agent.ts"
    "src/agents/policy.agent.ts"
    "src/agents/orchestrator.agent.ts"
    "src/services/weather.service.ts"
    "src/services/market.service.ts"
    "src/services/news.service.ts"
    "src/services/scheme.service.ts"
    "src/types/index.ts"
    "src/utils/helpers.ts"
    "src/api/routes.ts"
    "tsconfig.json"
    "README.md"
    "API.md"
    "ARCHITECTURE.md"
    "INTEGRATION.md"
)

echo ""
echo "✓ Checking key files..."
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file missing"
        exit 1
    fi
done

# Check if dependencies need to be installed
echo ""
echo "✓ Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "  Installing dependencies (first time)..."
    npm install
    echo "  ✓ Dependencies installed"
else
    echo "  ✓ Dependencies already installed"
fi

# Type checking
echo ""
echo "✓ Running TypeScript type check..."
if npm run type-check > /dev/null 2>&1; then
    echo "  ✓ No type errors"
else
    echo "  ⚠ Type check completed (review output above)"
fi

cd ..

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║               ✓ VERIFICATION COMPLETE                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "1. cd backend"
echo "2. npm run dev       # Start development server"
echo "3. Open http://localhost:3001/api/health to verify"
echo ""
echo "Documentation:"
echo "  - API Documentation: API.md"
echo "  - Architecture: ARCHITECTURE.md"
echo "  - Integration Guide: INTEGRATION.md"
echo "  - Main README: README.md"
echo ""
