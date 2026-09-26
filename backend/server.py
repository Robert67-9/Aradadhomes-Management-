#!/usr/bin/env python3
"""
HavenStay - Universal Python Backend Server
Supports running directly via Uvicorn/FastAPI if available,
or with the built-in Python standard library HTTP REST server fallback.
Port: 8000 (standard for Python backends, reverse-proxied by Nginx to /api)
"""

import sys
import os
import json
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler

# Add current directory to path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app.database import db

PORT = int(os.environ.get("PORT", 8000))
HOST = os.environ.get("HOST", "0.0.0.0")

class HavenStayRESTHandler(BaseHTTPRequestHandler):
    def _send_json(self, status_code: int, data: any):
        payload = json.dumps(data, indent=2).encode('utf-8')
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
        self.end_headers()
        self.wfile.write(payload)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # Health check
        if path == "/api/health" or path == "/health":
            self._send_json(200, {
                "status": "healthy",
                "service": "HavenStay Python Backend",
                "apartments": len(db.get_apartments()),
                "bookings": len(db.get_bookings())
            })
            return

        # Currency rates
        if path == "/api/currency-rates":
            self._send_json(200, {
                "USD": {"rate": 1.0, "symbol": "$", "label": "US Dollar"},
                "EUR": {"rate": 0.92, "symbol": "€", "label": "Euro"},
                "GBP": {"rate": 0.78, "symbol": "£", "label": "British Pound"},
                "JPY": {"rate": 152.0, "symbol": "¥", "label": "Japanese Yen"},
                "GHS": {"rate": 15.5, "symbol": "GH₵ ", "label": "Ghana Cedi"},
            })
            return

        # Apartments list
        if path == "/api/apartments":
            city = query.get("city", [None])[0]
            apts = db.get_apartments()
            if city:
                apts = [a for a in apts if a.get("city", "").lower() == city.lower()]
            self._send_json(200, apts)
            return

        # Single apartment: /api/apartments/{id}
        if path.startswith("/api/apartments/"):
            apt_id = path.replace("/api/apartments/", "")
            apt = db.get_apartment_by_id(apt_id)
            if apt:
                self._send_json(200, apt)
            else:
                self._send_json(404, {"error": "Residence not found"})
            return

        # Bookings list
        if path == "/api/bookings":
            status_filter = query.get("status", [None])[0]
            bookings = db.get_bookings()
            if status_filter:
                bookings = [b for b in bookings if b.get("status") == status_filter]
            self._send_json(200, bookings)
            return

        # Reviews
        if path == "/api/reviews":
            apt_id = query.get("apartmentId", [None])[0]
            reviews = db.get_reviews(apt_id)
            self._send_json(200, reviews)
            return

        # Profile
        if path == "/api/profile":
            self._send_json(200, db.get_profile())
            return

        self._send_json(404, {"error": f"Endpoint {path} not found"})

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length).decode('utf-8')
        try:
            data = json.loads(body) if body else {}
        except Exception:
            self._send_json(400, {"error": "Invalid JSON payload"})
            return

        if path == "/api/apartments":
            saved = db.save_apartment(data)
            self._send_json(201, saved)
            return

        if path == "/api/bookings":
            saved = db.create_booking(data)
            self._send_json(201, saved)
            return

        if path == "/api/reviews":
            saved = db.add_review(data)
            self._send_json(201, saved)
            return

        if path.endswith("/block-dates"):
            apt_id = path.replace("/api/apartments/", "").replace("/block-dates", "")
            date_str = data.get("date")
            block = data.get("block", True)
            updated = db.toggle_block_date(apt_id, date_str, block)
            self._send_json(200, {"apartmentId": apt_id, "blockedDates": updated})
            return

        self._send_json(404, {"error": f"POST endpoint {path} not found"})

    def do_PUT(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length).decode('utf-8')
        try:
            data = json.loads(body) if body else {}
        except Exception:
            self._send_json(400, {"error": "Invalid JSON payload"})
            return

        if path.startswith("/api/apartments/"):
            apt_id = path.replace("/api/apartments/", "")
            data["id"] = apt_id
            saved = db.save_apartment(data)
            self._send_json(200, saved)
            return

        if path.startswith("/api/bookings/") and path.endswith("/status"):
            booking_id = path.replace("/api/bookings/", "").replace("/status", "")
            status_val = data.get("status", "confirmed")
            updated = db.update_booking_status(booking_id, status_val)
            if updated:
                self._send_json(200, updated)
            else:
                self._send_json(404, {"error": "Booking not found"})
            return

        if path == "/api/profile":
            updated = db.update_profile(data)
            self._send_json(200, updated)
            return

        self._send_json(404, {"error": f"PUT endpoint {path} not found"})

    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        if path.startswith("/api/apartments/"):
            apt_id = path.replace("/api/apartments/", "")
            success = db.delete_apartment(apt_id)
            if success:
                self._send_json(200, {"success": True, "deleted": apt_id})
            else:
                self._send_json(404, {"error": "Residence not found"})
            return

        self._send_json(404, {"error": f"DELETE endpoint {path} not found"})

def run_uvicorn():
    try:
        import uvicorn
        from app.main import app
        print(f"[*] Starting HavenStay FastAPI Backend on http://{HOST}:{PORT} ...")
        uvicorn.run(app, host=HOST, port=PORT, log_level="info")
        return True
    except ImportError:
        return False

def run_http_server():
    server = HTTPServer((HOST, PORT), HavenStayRESTHandler)
    print(f"[*] Starting HavenStay Python REST Server on http://{HOST}:{PORT} ...")
    print(f"[*] Ready for Contabo VPS deployment and frontend requests.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[*] Server stopped.")
        server.server_close()

if __name__ == "__main__":
    if not run_uvicorn():
        print("[!] FastAPI/Uvicorn not found in this environment. Falling back to built-in HTTP server...")
        run_http_server()
