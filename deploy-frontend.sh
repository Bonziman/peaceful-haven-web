#!/bin/bash
# peaceful-haven-web/deploy-frontend.sh
# Automated script to build the React frontend and deploy it to the Nginx root.

# --- Configuration ---
# Getting the absolute directory of the script to avoid relative path issues
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
BUILD_OUTPUT_DIR="$FRONTEND_DIR/dist"

# Target configuration
NGINX_ROOT_DIR="/var/www/peacefulhaven/html"
NGINX_CONFIG_FILE="/etc/nginx/conf.d/peaceful-haven.conf"

# --- Script Execution ---

echo "--- 1. Building React Frontend (Vite) ---"
cd "$FRONTEND_DIR"

# Ensure dependencies are clean
# npm install || { echo "ERROR: Dependency installation failed. Aborting."; exit 1; }

# Run the build process
npm run build || { echo "ERROR: Frontend build failed. Aborting deployment."; exit 1; }

echo "--- 2. Deploying to Nginx Root ($NGINX_ROOT_DIR) ---"

# Ensure the target directory exists with correct ownership
sudo mkdir -p "$NGINX_ROOT_DIR"

# Reliable sync using rsync
sudo rsync -av --delete "$BUILD_OUTPUT_DIR/" "$NGINX_ROOT_DIR/" || { echo "ERROR: Failed to copy files. Aborting."; exit 1; }

# Set permissions (using www-data or nginx depending on your system, sticking to standard here)
# We use $(whoami) to ensure the current user maintains access if needed, but allow the web server to read.
sudo chown -R $USER:www-data "$NGINX_ROOT_DIR"
sudo chmod -R 755 "$NGINX_ROOT_DIR"

echo "--- 3. Testing and Reloading Nginx ---"

# Check if nginx is actually installed/available before trying to reload
if command -v nginx >/dev/null 2>&1; then
    sudo nginx -t && sudo systemctl reload nginx || echo "WARNING: Nginx found but reload failed. Check logs."
else
    echo "NOTICE: Nginx not detected on this environment. Skipping reload."
    echo "Files have been updated in $NGINX_ROOT_DIR"
fi

echo "--- Deployment Complete ---"
echo "Web is live at https://peacefulhaven.lol"
