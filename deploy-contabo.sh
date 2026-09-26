#!/bin/bash
# ==============================================================================
# HavenStay Luxury Residences - Contabo VPS Automated Deployment Script
# Supports: Ubuntu 20.04 / 22.04 / 24.04 LTS & Debian 11 / 12
# Stack: Python FastAPI Backend + React 19 / Vite Frontend + Nginx + SSL
# ==============================================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}====================================================${NC}"
echo -e "${GREEN}   HavenStay - Contabo VPS Deployment Manager       ${NC}"
echo -e "${BLUE}====================================================${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}[ERROR] Please run this script with sudo or as root: sudo bash deploy-contabo.sh${NC}"
  exit 1
fi

echo -e "\n${YELLOW}[Step 1/5] Updating system packages...${NC}"
apt-get update -y && apt-get upgrade -y
apt-get install -y curl git ufw ca-certificates gnupg lsb-release

echo -e "\n${YELLOW}[Step 2/5] Configuring UFW Firewall for Contabo VPS...${NC}"
ufw allow OpenSSH || ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
echo -e "${GREEN}[OK] Firewall configured (Ports 22, 80, 443 allowed).${NC}"

echo -e "\n${YELLOW}[Step 3/5] Installing Docker & Docker Compose if needed...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "Installing official Docker engine..."
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update -y
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    systemctl enable docker
    systemctl start docker
    echo -e "${GREEN}[OK] Docker installed successfully.${NC}"
else
    echo -e "${GREEN}[OK] Docker is already installed.${NC}"
fi

echo -e "\n${YELLOW}[Step 4/5] Building & Launching HavenStay Containers...${NC}"
# Stop any old instances
docker compose down --remove-orphans || true

# Build and start services in background
docker compose up -d --build

echo -e "\n${YELLOW}[Step 5/5] Checking Container Health Status...${NC}"
sleep 5
docker compose ps

echo -e "\n${BLUE}====================================================${NC}"
echo -e "${GREEN}  ✓ HavenStay Deployment Complete on Contabo VPS!    ${NC}"
echo -e "${BLUE}====================================================${NC}"
SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')
echo -e "🌐 Access your app at: http://${SERVER_IP}"
echo -e "🔌 Python API Backend: http://${SERVER_IP}/api/health"
echo -e "📖 API Interactive Docs: http://${SERVER_IP}/api/docs"
echo ""
echo -e "${YELLOW}To attach your custom domain & setup free SSL:${NC}"
echo -e "1. Point your domain DNS (A record) to ${SERVER_IP}"
echo -e "2. Run: apt install certbot -y"
echo -e "3. Run: certbot certonly --standalone -d yourdomain.com"
echo ""
