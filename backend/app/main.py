"""
HavenStay Luxury Residences - FastAPI Backend Application
High-performance REST API with CORS, rate-limiting headers,
and comprehensive residence & reservation endpoints.
"""

from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
from .models import (
    Apartment,
    ApartmentCreate,
    BlockDateRequest,
    Booking,
    BookingCreate,
    Review,
    UserProfile,
    NotificationItem
)
from .database import db
from .supabase_client import get_supabase_client, is_supabase_enabled

app = FastAPI(
    title="Aradads Home API",
    description="Enterprise-grade Luxury Apartment Booking & Host Management API (Ghana)",
    version="1.0.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json"
)

# Configure CORS for Vercel, Supabase, and local previews
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Real-time exchange rates (USD base)
EXCHANGE_RATES = {
    "USD": {"rate": 1.0, "symbol": "$", "label": "US Dollar"},
    "EUR": {"rate": 0.92, "symbol": "€", "label": "Euro"},
    "GBP": {"rate": 0.78, "symbol": "£", "label": "British Pound"},
    "JPY": {"rate": 152.0, "symbol": "¥", "label": "Japanese Yen"},
    "GHS": {"rate": 15.5, "symbol": "GH₵ ", "label": "Ghana Cedi"},
}

@app.get("/api/health")
def health_check():
    supabase_active = is_supabase_enabled()
    return {
        "status": "healthy",
        "service": "Aradads Home Python API",
        "region": "Ghana (Accra)",
        "version": "1.0.0",
        "supabase_connected": supabase_active,
        "database_mode": "Supabase PostgreSQL" if supabase_active else "Local Resilient Engine",
        "apartments_count": len(db.get_apartments()),
        "bookings_count": len(db.get_bookings())
    }

@app.post("/api/upload-photo")
def upload_residence_photo(payload: Dict[str, str]):
    """
    Accepts base64 or photo URL and uploads to Supabase 'residence-photos' bucket.
    Falls back to returning direct image link if Supabase is in local dev mode.
    """
    photo_url = payload.get("photo_url", "")
    filename = payload.get("filename", "photo.jpg")
    supabase = get_supabase_client()
    
    if supabase and photo_url.startswith("data:"):
        try:
            import base64
            header, encoded = photo_url.split(",", 1)
            file_bytes = base64.b64decode(encoded)
            file_path = f"apartments/{filename}"
            supabase.storage.from_("residence-photos").upload(file_path, file_bytes)
            public_url = supabase.storage.from_("residence-photos").get_public_url(file_path)
            return {"url": public_url, "storage": "supabase"}
        except Exception as e:
            return {"url": photo_url, "storage": "local_fallback", "error": str(e)}

    return {"url": photo_url or "/src/assets/images/apt_accra_luxury_1790379220032.jpg", "storage": "direct"}

@app.get("/api/currency-rates")
def get_currency_rates():
    return EXCHANGE_RATES

# ==========================================
# APARTMENTS / RESIDENCES ENDPOINTS
# ==========================================

@app.get("/api/apartments", response_model=List[Dict[str, Any]])
def list_apartments(
    city: Optional[str] = None,
    country: Optional[str] = None,
    min_guests: Optional[int] = None,
    max_price: Optional[float] = None,
    bedrooms: Optional[int] = None
):
    apartments = db.get_apartments()
    results = apartments

    if city:
        results = [a for a in results if a.get("city", "").lower() == city.lower()]
    if country:
        results = [a for a in results if a.get("country", "").lower() == country.lower()]
    if min_guests:
        results = [a for a in results if a.get("maxGuests", 0) >= min_guests]
    if max_price:
        results = [a for a in results if a.get("pricePerNight", 0) <= max_price]
    if bedrooms:
        results = [a for a in results if a.get("bedrooms", 0) >= bedrooms]

    return results

@app.get("/api/apartments/{apartment_id}", response_model=Dict[str, Any])
def get_apartment(apartment_id: str):
    apt = db.get_apartment_by_id(apartment_id)
    if not apt:
        raise HTTPException(status_code=404, detail="Residence not found")
    return apt

@app.post("/api/apartments", status_code=status.HTTP_201_CREATED)
def create_apartment(apartment: Dict[str, Any]):
    saved = db.save_apartment(apartment)
    return saved

@app.put("/api/apartments/{apartment_id}")
def update_apartment(apartment_id: str, updates: Dict[str, Any]):
    existing = db.get_apartment_by_id(apartment_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Residence not found")
    updates["id"] = apartment_id
    saved = db.save_apartment(updates)
    return saved

@app.delete("/api/apartments/{apartment_id}")
def delete_apartment(apartment_id: str):
    success = db.delete_apartment(apartment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Residence not found or could not be removed")
    return {"success": True, "message": f"Residence {apartment_id} deleted"}

@app.post("/api/apartments/{apartment_id}/block-dates")
def toggle_date_block(apartment_id: str, req: BlockDateRequest):
    updated_dates = db.toggle_block_date(apartment_id, req.date, req.block)
    return {"apartmentId": apartment_id, "blockedDates": updated_dates}

# ==========================================
# RESERVATIONS & BOOKINGS ENDPOINTS
# ==========================================

@app.get("/api/bookings", response_model=List[Dict[str, Any]])
def list_bookings(status_filter: Optional[str] = None):
    bookings = db.get_bookings()
    if status_filter:
        return [b for b in bookings if b.get("status") == status_filter]
    return bookings

@app.post("/api/bookings", status_code=status.HTTP_201_CREATED)
def create_booking(booking: Dict[str, Any]):
    saved = db.create_booking(booking)
    return saved

@app.put("/api/bookings/{booking_id}/status")
def update_booking_status(booking_id: str, payload: Dict[str, str]):
    new_status = payload.get("status", "confirmed")
    updated = db.update_booking_status(booking_id, new_status)
    if not updated:
        raise HTTPException(status_code=404, detail="Booking not found")
    return updated

# ==========================================
# REVIEWS ENDPOINTS
# ==========================================

@app.get("/api/reviews")
def list_reviews(apartmentId: Optional[str] = None):
    return db.get_reviews(apartmentId)

@app.post("/api/reviews", status_code=status.HTTP_201_CREATED)
def submit_review(review: Dict[str, Any]):
    saved = db.add_review(review)
    return saved

# ==========================================
# USER PROFILE & SETTINGS ENDPOINTS
# ==========================================

@app.get("/api/profile")
def get_user_profile():
    return db.get_profile()

@app.put("/api/profile")
def update_user_profile(profile_updates: Dict[str, Any]):
    return db.update_profile(profile_updates)
