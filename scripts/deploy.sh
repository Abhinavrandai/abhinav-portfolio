#!/usr/bin/env bash
# ─── Deploy to Cloudflare Pages ─────────────────────────────────────────────
# Usage:
#   ./scripts/deploy.sh
#
# Requirements:
#   - CLOUDFLARE_API_TOKEN env var (Edit-permission Pages token)
#   - CLOUDFLARE_ACCOUNT_ID env var (your account ID)
#
# Get token from: https://dash.cloudflare.com/profile/api-tokens
# Create custom token with: Cloudflare Pages → Edit

set -euo pipefail

cd "$(dirname "$0")/.."

# Check env vars
if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
  echo "❌ CLOUDFLARE_API_TOKEN env var not set"
  echo "   Create token at: https://dash.cloudflare.com/profile/api-tokens"
  echo "   Required permission: Cloudflare Pages → Edit"
  echo "   Then run: export CLOUDFLARE_API_TOKEN=cfut_xxxxxxxx"
  exit 1
fi

if [ -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]; then
  echo "❌ CLOUDFLARE_ACCOUNT_ID env var not set"
  echo "   Find account ID at: https://dash.cloudflare.com/ (right sidebar)"
  echo "   Then run: export CLOUDFLARE_ACCOUNT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  exit 1
fi

PROJECT_NAME="abhinav-portfolio"

echo "────────────────────────────────────────────────────────────────"
echo "  Deploying to Cloudflare Pages"
echo "  Project: $PROJECT_NAME"
echo "  Account: $CLOUDFLARE_ACCOUNT_ID"
echo "────────────────────────────────────────────────────────────────"
echo ""

# Step 1: Build
echo "📦 [1/3] Building with @cloudflare/next-on-pages..."
npx @cloudflare/next-on-pages

if [ ! -d ".vercel/output/static" ]; then
  echo "❌ Build output directory .vercel/output/static does not exist"
  exit 1
fi

echo ""
echo "📤 [2/3] Uploading to Cloudflare Pages..."
npx wrangler pages deploy .vercel/output/static \
  --project-name="$PROJECT_NAME" \
  --branch=main \
  --commit-dirty=true

echo ""
echo "────────────────────────────────────────────────────────────────"
echo "✅ Deploy complete!"
echo ""
echo "🌐 Production URL: https://$PROJECT_NAME-221.pages.dev"
echo "────────────────────────────────────────────────────────────────"
