# Contabo VPS Deployment Guide: HavenStay

This guide walks you through deploying **HavenStay** (Python FastAPI Backend + React 19 Frontend + Nginx) onto your **Contabo VPS**.

---

## Architecture Overview

* **Backend**: Python 3.10+ (FastAPI + Uvicorn) running on port `8000`
* **Frontend**: React 19 + TypeScript + Tailwind CSS (Vite SPA)
* **Reverse Proxy**: Nginx routing `/api/*` to the Python backend and `/` to the React single page app
* **Database**: Persistent storage at `/app/data/havenstay_db.json` (auto-synced)

---

## Option 1: One-Click Automated Deployment (Recommended)

When you receive your Contabo VPS credentials (IP address and root password):

### 1. Connect to your Contabo VPS via SSH
From your computer terminal or PuTTY:
```bash
ssh root@<YOUR_CONTABO_IP>
```

### 2. Upload or Clone the HavenStay Project
```bash
mkdir -p /var/www/havenstay
cd /var/www/havenstay

# Clone your git repo or copy the files over:
# git clone <YOUR_REPO_URL> .
```

### 3. Run the Deployment Script
```bash
chmod +x deploy-contabo.sh
./deploy-contabo.sh
```

The script will automatically:
1. Update system packages
2. Set up the Contabo UFW firewall (Ports 22, 80, 443)
3. Install Docker & Docker Compose
4. Build both the Python backend and React frontend
5. Start all containers with auto-restart on VPS reboot

### 4. Verification
* Frontend: `http://<YOUR_CONTABO_IP>`
* Python API Status: `http://<YOUR_CONTABO_IP>/api/health`
* Interactive API Docs (Swagger): `http://<YOUR_CONTABO_IP>/api/docs`

---

## Option 2: Running Without Docker (Native Python + Nginx)

If you prefer running Python directly on the VPS:

### 1. Install Python & Build Tools
```bash
apt update && apt install -y python3 python3-pip python3-venv nginx
```

### 2. Set Up Python Virtual Environment
```bash
cd /var/www/havenstay/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Enable Systemd Background Service
```bash
cp /var/www/havenstay/systemd/havenstay-backend.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable havenstay-backend
systemctl start havenstay-backend
systemctl status havenstay-backend
```

### 4. Build and Deploy Frontend
```bash
cd /var/www/havenstay
npm install
npm run build

# Copy build to Nginx
mkdir -p /var/www/havenstay-dist
cp -r dist/* /var/www/havenstay-dist/
```

### 5. Configure Nginx
```bash
cp /var/www/havenstay/nginx/nginx.conf /etc/nginx/sites-available/havenstay
ln -s /etc/nginx/sites-available/havenstay /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
systemctl reload nginx
```

---

## Free SSL Certificate (HTTPS) Setup

To configure `https://yourdomain.com`:

1. Point your domain's DNS **A Record** to your Contabo VPS IP address.
2. Install Certbot on your VPS:
```bash
apt install certbot python3-certbot-nginx -y
```
3. Issue and install the SSL certificate:
```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
Certbot will configure Nginx and set up automatic 90-day renewals.

---

## Useful Maintenance Commands

* **Check Python Backend Logs**:
  ```bash
  docker compose logs -f backend
  # or if using systemd:
  journalctl -u havenstay-backend -f
  ```
* **Restart Services**:
  ```bash
  docker compose restart
  ```
* **Backup Database**:
  ```bash
  # Back up current database
  cp backend/data/havenstay_db.json /var/backups/havenstay_db_$(date +%F).json
  ```
