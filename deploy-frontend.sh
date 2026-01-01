#!/bin/bash
# minecraft-web/deploy-frontend.sh
# Automated script to build the React frontend and deploy it to the Nginx root.

# --- Configuration ---
FRONTEND_DIR="./frontend"
BUILD_OUTPUT_DIR="$FRONTEND_DIR/dist"
NGINX_ROOT_DIR="/var/www/peacefulhaven/html"
NGINX_CONFIG_FILE="/etc/nginx/conf.d/peaceful-haven.conf"

# --- Script Execution ---

echo "--- 1. Building React Frontend (Vite) ---"
cd $FRONTEND_DIR

# Run the build process
npm run build || { echo "ERROR: Frontend build failed. Aborting deployment."; exit 1; }

echo "--- 2. Deploying to Nginx Root ($NGINX_ROOT_DIR) ---"
cd .. # Back to project root

# Ensure the target directory exists
sudo mkdir -p $NGINX_ROOT_DIR

# Remove old files and copy new build (using rsync is safer for large deployments)
# We use rsync for an efficient, reliable copy that deletes old files at the destination.
sudo rsync -av --delete $BUILD_OUTPUT_DIR/ $NGINX_ROOT_DIR/ || { echo "ERROR: Failed to copy files. Aborting."; exit 1; }

# Set correct permissions (often needed for Nginx to read the files)
sudo chown -R opc:nginx $NGINX_ROOT_DIR
sudo chmod -R 755 $NGINX_ROOT_DIR

echo "--- 3. Testing and Reloading Nginx ---"

# Test Nginx config
sudo nginx -t || { echo "ERROR: Nginx configuration test failed. Not reloading."; exit 1; }

# Reload Nginx to serve the new files
sudo systemctl reload nginx

echo "--- Deployment Complete ---"
echo "Web is live at https://web.peacefulhaven.lol"
