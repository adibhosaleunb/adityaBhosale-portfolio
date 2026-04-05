#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# One-time Azure provisioning script for split frontend/backend
# Run: PGPASSWORD=your_password ./scripts/azure-setup.sh
# ─────────────────────────────────────────────────────────────
set -euo pipefail

# ── Edit these ───────────────────────────────────────────────
RESOURCE_GROUP="portfolio-rg"
LOCATION="eastus2"
CONTAINER_ENV="portfolio-env"
GITHUB_OWNER="adibhosaleunb"   # <-- change this

BACKEND_APP="portfolio-backend"
FRONTEND_APP="portfolio-frontend"

BACKEND_IMAGE="ghcr.io/${GITHUB_OWNER}/portfolio-backend:latest"
FRONTEND_IMAGE="ghcr.io/${GITHUB_OWNER}/portfolio-frontend:latest"

# ── DB secrets ──────────────────────────────────────────────
PGHOST="ep-rough-night-a8b54te6-pooler.eastus2.azure.neon.tech"
PGUSER="adibhosale"
PGDATABASE="portfoliodb"
PGPASSWORD="npg_s2JrUSFQ3knP"
PGPORT="5432"

# ── 1. Resource group ────────────────────────────────────────
echo ">>> Creating resource group..."
az group create --name "$RESOURCE_GROUP" --location "$LOCATION"

# ── 2. Container Apps environment (shared) ───────────────────
echo ">>> Creating Container Apps environment..."
az containerapp env create \
  --name "$CONTAINER_ENV" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION"

# ── 3. Backend Container App ─────────────────────────────────
echo ">>> Creating backend Container App..."
az containerapp create \
  --name "$BACKEND_APP" \
  --resource-group "$RESOURCE_GROUP" \
  --environment "$CONTAINER_ENV" \
  --image "$BACKEND_IMAGE" \
  --target-port 4000 \
  --ingress internal \          # Backend only reachable inside the environment
  --min-replicas 0 \
  --max-replicas 2 \
  --cpu 0.5 --memory 1.0Gi \
  --secrets \
    pghost="$PGHOST" \
    pguser="$PGUSER" \
    pgdatabase="$PGDATABASE" \
    pgpassword="$PGPASSWORD" \
    pgport="$PGPORT" \
  --env-vars \
    NODE_ENV=production \
    PORT=4000 \
    PGSSLMODE=require \
    PGHOST=secretref:pghost \
    PGUSER=secretref:pguser \
    PGDATABASE=secretref:pgdatabase \
    PGPASSWORD=secretref:pgpassword \
    PGPORT=secretref:pgport

# Get the backend's internal FQDN so Nginx can proxy to it
BACKEND_FQDN=$(az containerapp show \
  --name "$BACKEND_APP" \
  --resource-group "$RESOURCE_GROUP" \
  --query "properties.configuration.ingress.fqdn" -o tsv)

echo "Backend internal URL: https://${BACKEND_FQDN}"

# ── 4. Frontend Container App ────────────────────────────────
echo ">>> Creating frontend Container App..."
az containerapp create \
  --name "$FRONTEND_APP" \
  --resource-group "$RESOURCE_GROUP" \
  --environment "$CONTAINER_ENV" \
  --image "$FRONTEND_IMAGE" \
  --target-port 80 \
  --ingress external \          # Frontend is publicly accessible
  --min-replicas 1 \
  --max-replicas 3 \
  --cpu 0.25 --memory 0.5Gi

# ── 5. Print public URL ──────────────────────────────────────
echo ""
echo "✅ Done!"
FRONTEND_URL=$(az containerapp show \
  --name "$FRONTEND_APP" \
  --resource-group "$RESOURCE_GROUP" \
  --query "properties.configuration.ingress.fqdn" -o tsv)
echo "🌐 Portfolio live at: https://${FRONTEND_URL}"

# ── 6. GitHub Actions service principal ─────────────────────
echo ""
echo ">>> Creating GitHub Actions service principal..."
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
az ad sp create-for-rbac \
  --name "portfolio-github-actions" \
  --role contributor \
  --scopes "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP" \
  --sdk-auth
echo ""
echo "👆 Save the JSON above as the AZURE_CREDENTIALS GitHub secret."
