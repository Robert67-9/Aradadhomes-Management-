"""
HavenStay Luxury Residences - Persistent Database Engine
Stores and retrieves apartments, bookings, reviews, and profiles.
Persists cleanly to disk (backend/data/havenstay_db.json).
"""

import json
import os
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional

DB_FILE_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "havenstay_db.json")

# Initial seed data
INITIAL_APARTMENTS = [
  {
    "id": "apt-cantonments-accra",
    "title": "The Cantonments Presidential Sky Villa",
    "subtitle": "Private plunge pool, 24/7 solar standby power, and lush tropical rooftop terrace",
    "description": "An oasis of contemporary West African luxury in prestigious Cantonments, Accra. Features open-plan Italian marble living spaces, floor-to-ceiling tinted UV glass, private rooftop lap plunge pool, backup solar inverter with 24/7 silent power, and bespoke handcrafted teak furniture by local Ghanaian artisans.",
    "city": "Accra",
    "country": "Ghana",
    "neighborhood": "Cantonments",
    "coordinates": { "lat": 5.5840, "lng": -0.1770 },
    "pricePerNight": 340,
    "currency": "GHS",
    "rating": 4.99,
    "reviewCount": 36,
    "bedrooms": 3,
    "bathrooms": 3.5,
    "maxGuests": 6,
    "sqft": 2400,
    "featured": True,
    "propertyType": "Villa",
    "images": [
      "/src/assets/images/hero_luxury_apartment_1790378080480.jpg",
      "/src/assets/images/apt_coastal_villa_1790378103266.jpg",
      "/src/assets/images/apt_garden_duplex_1790378124347.jpg"
    ],
    "amenities": [
      "24/7 Solar & Silent Generator Power Backup",
      "Private Rooftop Plunge Pool",
      "Private Rooftop Technogym & Fitness Studio",
      "24/7 Uniformed Security & Concierge",
      "High-Speed Fiber Internet (500 Mbps)",
      "Chef Kitchen with Quartz Island",
      "Gated Covered Executive Parking",
      "Air Conditioning in All Rooms",
      "Washer & Dryer In-Unit",
      "Smart Intercom & Keyless Entry",
      "Complimentary Airport Chauffeur"
    ],
    "houseRules": [
      "Respectful noise levels after 22:00",
      "Registered guests only unless prior concierge clearance",
      "Non-smoking inside residences"
    ],
    "checkInTime": "14:00",
    "checkOutTime": "11:00",
    "cleaningFee": 95,
    "serviceFeePercent": 8,
    "taxesPercent": 5,
    "host": {
      "name": "Kwame Mensah",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80",
      "superhost": True,
      "responseRate": "100% within 10 min",
      "joinedYear": 2021
    },
    "blockedDates": ["2026-10-15", "2026-10-16"]
  },
  {
    "id": "apt-penthouse-mayfair",
    "title": "The Skyview Penthouse & Terrace",
    "subtitle": "Private rooftop pavilion with panoramic city skyline views",
    "description": "An architectural triumph perched high above the prestigious Mayfair district. Featuring double-height floor-to-ceiling glass, bookmatched Italian marble accents, bespoke walnut cabinetry, and a private 600 sqft wraparound garden terrace with open-air fireplace.",
    "city": "London",
    "country": "United Kingdom",
    "neighborhood": "Mayfair",
    "coordinates": { "lat": 51.5098, "lng": -0.1505 },
    "pricePerNight": 580,
    "currency": "USD",
    "rating": 4.98,
    "reviewCount": 38,
    "bedrooms": 3,
    "bathrooms": 3.5,
    "maxGuests": 6,
    "sqft": 2200,
    "featured": True,
    "propertyType": "Penthouse",
    "images": [
      "/src/assets/images/hero_luxury_apartment_1790378080480.jpg",
      "/src/assets/images/apt_scandi_loft_1790378092782.jpg",
      "/src/assets/images/apt_garden_duplex_1790378124347.jpg"
    ],
    "amenities": [
      "High-Speed Wi-Fi (1 Gbps)",
      "Private Keyless Elevator",
      "Wraparound Terrace",
      "Private Technogym Fitness Suite",
      "Chef Kitchen with Miele Appliances",
      "EV Car Charging Station",
      "24/7 Concierge Service",
      "Acoustic Soundproofing",
      "Air Conditioning & Climate Control",
      "Nespresso Vertuo Bar"
    ],
    "houseRules": [
      "Strictly non-smoking interior",
      "Quiet hours observed 22:00 – 08:00",
      "Events allowed only with prior written host approval",
      "Well-mannered small pets welcomed upon request"
    ],
    "checkInTime": "15:00",
    "checkOutTime": "11:00",
    "cleaningFee": 120,
    "serviceFeePercent": 8,
    "taxesPercent": 6,
    "host": {
      "name": "Eleanor Vance",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80",
      "superhost": True,
      "responseRate": "100% within 1 hour",
      "joinedYear": 2021
    },
    "blockedDates": ["2026-10-02", "2026-10-03", "2026-10-04", "2026-10-18", "2026-10-19"]
  },
  {
    "id": "apt-scandi-loft",
    "title": "The Industrial Artisan Loft",
    "subtitle": "Warm brick arches, curated mid-century pieces, and open sunroom",
    "description": "Designed for creative minds and tranquil city retreats. This heritage warehouse loft combines exposed historic brickwork with minimalist Nordic woodwork, custom linen upholstery, and a lush indoor green conservatory.",
    "city": "Stockholm",
    "country": "Sweden",
    "neighborhood": "Södermalm",
    "coordinates": { "lat": 59.3149, "lng": 18.0713 },
    "pricePerNight": 290,
    "currency": "USD",
    "rating": 4.95,
    "reviewCount": 52,
    "bedrooms": 2,
    "bathrooms": 2,
    "maxGuests": 4,
    "sqft": 1350,
    "featured": True,
    "propertyType": "Loft",
    "images": [
      "/src/assets/images/apt_scandi_loft_1790378092782.jpg",
      "/src/assets/images/hero_luxury_apartment_1790378080480.jpg"
    ],
    "amenities": [
      "Ergonomic Dual-Monitor Workspace",
      "Bespoke Cast Iron Fireplace",
      "High-Speed Wi-Fi (500 Mbps)",
      "Sonos Multi-Room Audio",
      "Rainfall Shower & Soaking Tub",
      "Full Induction Kitchen",
      "Washer & Dryer In-Unit"
    ],
    "houseRules": [
      "Shoes-off interior policy",
      "No commercial photo shoots without permit",
      "Self check-in via smart keypad lock"
    ],
    "checkInTime": "15:00",
    "checkOutTime": "11:00",
    "cleaningFee": 85,
    "serviceFeePercent": 8,
    "taxesPercent": 5,
    "host": {
      "name": "Lars Lindqvist",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80",
      "superhost": True,
      "responseRate": "98% within 2 hours",
      "joinedYear": 2020
    },
    "blockedDates": ["2026-10-10", "2026-10-11", "2026-10-12"]
  },
  {
    "id": "apt-coastal-villa",
    "title": "Villa Azure Cliffside Suite",
    "subtitle": "Dramatic Mediterranean ocean vistas with infinity plunge pool",
    "description": "Carved seamlessly into the cliffs with direct sightlines over crystalline azure waters. Enjoy sun-drenched private stone pergolas, teak sun loungers, handcrafted terracotta tiling, and unforgettable twilight sea breezes.",
    "city": "Nice",
    "country": "France",
    "neighborhood": "Mont Boron",
    "coordinates": { "lat": 43.6961, "lng": 7.2917 },
    "pricePerNight": 495,
    "currency": "USD",
    "rating": 4.99,
    "reviewCount": 44,
    "bedrooms": 2,
    "bathrooms": 2,
    "maxGuests": 4,
    "sqft": 1600,
    "featured": True,
    "propertyType": "Villa",
    "images": [
      "/src/assets/images/apt_coastal_villa_1790378103266.jpg",
      "/src/assets/images/apt_garden_duplex_1790378124347.jpg"
    ],
    "amenities": [
      "Private Heated Plunge Pool",
      "Panoramic Oceanfront Balcony",
      "Cliffside Fitness & Pilates Deck",
      "Gourmet Outdoor Grill",
      "Private Covered Parking",
      "High-Speed Wi-Fi",
      "Beachside Towels & Umbrellas Included",
      "Wine Cooler Pre-stocked"
    ],
    "houseRules": [
      "No glassware directly around pool rim",
      "Children must be supervised near ledge rail",
      "Quiet terrace hours after 23:00"
    ],
    "checkInTime": "16:00",
    "checkOutTime": "10:00",
    "cleaningFee": 110,
    "serviceFeePercent": 8,
    "taxesPercent": 7,
    "host": {
      "name": "Camille Delacroix",
      "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&h=160&q=80",
      "superhost": True,
      "responseRate": "100% within 30 min",
      "joinedYear": 2019
    },
    "blockedDates": ["2026-10-05", "2026-10-06", "2026-10-07"]
  },
  {
    "id": "apt-urban-studio",
    "title": "The Haussmann Parquet Atelier",
    "subtitle": "Classic French molding, marble mantle, and Juliette balcony",
    "description": "A romantic, sunlit haven in the literary quarter of Saint-Germain-des-Prés. Features original 19th-century chevron parquet flooring, brass casement windows opening to the tree-lined boulevard, and carefully curated vintage art.",
    "city": "Paris",
    "country": "France",
    "neighborhood": "Saint-Germain",
    "coordinates": { "lat": 48.8540, "lng": 2.3338 },
    "pricePerNight": 260,
    "currency": "USD",
    "rating": 4.92,
    "reviewCount": 68,
    "bedrooms": 1,
    "bathrooms": 1,
    "maxGuests": 2,
    "sqft": 750,
    "featured": False,
    "propertyType": "Studio",
    "images": [
      "/src/assets/images/apt_urban_studio_1790378114329.jpg",
      "/src/assets/images/hero_luxury_apartment_1790378080480.jpg"
    ],
    "amenities": [
      "Juliette Balcony with Boulevard View",
      "Curated Library of Art & Literature",
      "Espresso Machine with Local Roasts",
      "Ultra-quiet Acoustic Windows",
      "Designer Bouclé Armchairs",
      "High-Speed Wi-Fi",
      "Luxury Organic Linens"
    ],
    "houseRules": [
      "Strictly single or couple occupancy (max 2)",
      "No parties or excessive foot traffic in hall",
      "Keys must be returned to secure keybox"
    ],
    "checkInTime": "14:00",
    "checkOutTime": "11:00",
    "cleaningFee": 65,
    "serviceFeePercent": 8,
    "taxesPercent": 5,
    "host": {
      "name": "Henri Marchand",
      "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80",
      "superhost": True,
      "responseRate": "95% within 1 hour",
      "joinedYear": 2022
    },
    "blockedDates": ["2026-10-14", "2026-10-15", "2026-10-16"]
  },
  {
    "id": "apt-garden-duplex",
    "title": "The Botanica Zen Duplex",
    "subtitle": "Secluded courtyard garden with Japanese maple and polished concrete",
    "description": "An architectural oasis in the bustling heart of Shibuya. Sliding glass panels dissolve the boundary between an expansive concrete-floored living salon and an intimate courtyard garden featuring stone lanterns and trickling bamboo fountain.",
    "city": "Tokyo",
    "country": "Japan",
    "neighborhood": "Daikanyama",
    "coordinates": { "lat": 35.6506, "lng": 139.7040 },
    "pricePerNight": 390,
    "currency": "USD",
    "rating": 4.97,
    "reviewCount": 41,
    "bedrooms": 2,
    "bathrooms": 2,
    "maxGuests": 4,
    "sqft": 1400,
    "featured": False,
    "propertyType": "Duplex",
    "images": [
      "/src/assets/images/apt_garden_duplex_1790378124347.jpg",
      "/src/assets/images/apt_scandi_loft_1790378092782.jpg"
    ],
    "amenities": [
      "Private Landscaped Zen Garden",
      "Deep Hinoki Cedar Soaking Tub",
      "Heated Tatami Meditation Room",
      "Smart Home Lighting & Climate Controls",
      "High-Speed Wi-Fi (1 Gbps)",
      "Tea Ceremony Set & Matcha Bar",
      "Secure Smart Intercom"
    ],
    "houseRules": [
      "Please remove shoes in Genkan entryway",
      "Keep garden gate securely latched",
      "No smoking anywhere on premises including garden"
    ],
    "checkInTime": "15:00",
    "checkOutTime": "10:00",
    "cleaningFee": 90,
    "serviceFeePercent": 8,
    "taxesPercent": 6,
    "host": {
      "name": "Kenji Takahashi",
      "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=160&h=160&q=80",
      "superhost": True,
      "responseRate": "100% within 15 min",
      "joinedYear": 2020
    },
    "blockedDates": ["2026-10-21", "2026-10-22", "2026-10-23"]
  }
]

INITIAL_BOOKINGS = [
  {
    "id": "bk-hs-883192",
    "apartmentId": "apt-cantonments-accra",
    "apartmentTitle": "The Cantonments Presidential Sky Villa",
    "apartmentImage": "/src/assets/images/hero_luxury_apartment_1790378080480.jpg",
    "apartmentCity": "Accra",
    "apartmentAddress": "Cantonments, Accra, Ghana",
    "checkInDate": "2026-10-08",
    "checkOutDate": "2026-10-12",
    "guests": 2,
    "totalNights": 4,
    "pricePerNight": 340,
    "subtotal": 1360,
    "cleaningFee": 95,
    "serviceFee": 108.8,
    "taxes": 68,
    "totalAmount": 1631.8,
    "currency": "GHS",
    "guestName": "Robert Vander",
    "guestEmail": "robert.vander@example.com",
    "guestPhone": "+1 (555) 382-9104",
    "specialRequests": "Early check-in around 13:00 if possible. Airport pickup requested.",
    "status": "confirmed",
    "paymentMethod": "momo",
    "paymentLast4": "8291",
    "createdAt": "2026-09-24T14:30:00.000Z",
    "invoiceNumber": "INV-HS-2026-883192",
    "accessCode": "HS-5912",
    "isSyncedOffline": False
  },
  {
    "id": "bk-hs-741203",
    "apartmentId": "apt-penthouse-mayfair",
    "apartmentTitle": "The Skyview Penthouse & Terrace",
    "apartmentImage": "/src/assets/images/hero_luxury_apartment_1790378080480.jpg",
    "apartmentCity": "London",
    "apartmentAddress": "Mayfair, London, United Kingdom",
    "checkInDate": "2026-11-04",
    "checkOutDate": "2026-11-08",
    "guests": 4,
    "totalNights": 4,
    "pricePerNight": 580,
    "subtotal": 2320,
    "cleaningFee": 120,
    "serviceFee": 185.6,
    "taxes": 139.2,
    "totalAmount": 2764.8,
    "currency": "USD",
    "guestName": "Robert Vander",
    "guestEmail": "robert.vander@example.com",
    "guestPhone": "+1 (555) 382-9104",
    "specialRequests": "Stocking of sparkling water and fresh fruits in refrigerator.",
    "status": "confirmed",
    "paymentMethod": "card",
    "paymentLast4": "4242",
    "createdAt": "2026-09-25T09:15:00.000Z",
    "invoiceNumber": "INV-HS-2026-741203",
    "accessCode": "HS-9341",
    "isSyncedOffline": False
  }
]

INITIAL_REVIEWS = [
  {
    "id": "rev-1",
    "apartmentId": "apt-cantonments-accra",
    "authorName": "Nadia Osei",
    "authorCountry": "Ghana",
    "authorAvatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
    "rating": 5.0,
    "categories": {
      "cleanliness": 5.0,
      "accuracy": 5.0,
      "communication": 5.0,
      "location": 5.0,
      "checkIn": 5.0,
      "value": 5.0
    },
    "date": "September 2026",
    "comment": "Exceptional stay in Cantonments. The rooftop plunge pool and uninterrupted solar power made our workation flawlessly relaxing. Truly 5-star hospitality.",
    "verifiedStay": True,
    "hostReply": {
      "author": "Kwame Mensah",
      "date": "September 2026",
      "text": "Medase Nadia! It was our utmost pleasure hosting you."
    }
  },
  {
    "id": "rev-2",
    "apartmentId": "apt-penthouse-mayfair",
    "authorName": "Charlotte Sterling",
    "authorCountry": "United States",
    "authorAvatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80",
    "rating": 5.0,
    "categories": {
      "cleanliness": 5.0,
      "accuracy": 5.0,
      "communication": 5.0,
      "location": 5.0,
      "checkIn": 5.0,
      "value": 5.0
    },
    "date": "September 2026",
    "comment": "The Mayfair Penthouse exceeded every possible expectation. Watching the sunset over Hyde Park from the terrace was pure magic.",
    "verifiedStay": True,
    "hostReply": {
      "author": "Eleanor Vance",
      "date": "September 2026",
      "text": "Thank you Charlotte! You and your family were exceptional guests."
    }
  }
]

DEFAULT_PROFILE = {
  "id": "usr_default",
  "name": "Robert Vander",
  "email": "robert.vander@example.com",
  "phone": "+1 (555) 382-9104",
  "avatar": "",
  "bio": "Architectural designer & frequent traveler specializing in contemporary European design.",
  "preferredCurrency": "GHS",
  "language": "en",
  "notificationsEnabled": True,
  "emailAlertsEnabled": True,
  "pushAlertsEnabled": True,
  "gdprConsentDate": "2026-09-01T00:00:00.000Z",
  "savedApartmentIds": ["apt-cantonments-accra", "apt-penthouse-mayfair"]
}

class DatabaseManager:
    def __init__(self, db_path: str = DB_FILE_PATH):
        self.db_path = db_path
        self._ensure_db()

    def _ensure_db(self):
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        if not os.path.exists(self.db_path):
            initial_data = {
                "apartments": INITIAL_APARTMENTS,
                "bookings": INITIAL_BOOKINGS,
                "reviews": INITIAL_REVIEWS,
                "profile": DEFAULT_PROFILE,
                "notifications": []
            }
            with open(self.db_path, "w", encoding="utf-8") as f:
                json.dump(initial_data, f, indent=2, ensure_ascii=False)

    def _read_data(self) -> Dict[str, Any]:
        self._ensure_db()
        try:
            with open(self.db_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {
                "apartments": INITIAL_APARTMENTS,
                "bookings": INITIAL_BOOKINGS,
                "reviews": INITIAL_REVIEWS,
                "profile": DEFAULT_PROFILE,
                "notifications": []
            }

    def _write_data(self, data: Dict[str, Any]):
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        with open(self.db_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    # Apartment operations
    def get_apartments(self) -> List[Dict[str, Any]]:
        return self._read_data().get("apartments", [])

    def get_apartment_by_id(self, apt_id: str) -> Optional[Dict[str, Any]]:
        apartments = self.get_apartments()
        for apt in apartments:
            if apt.get("id") == apt_id:
                return apt
        return None

    def save_apartment(self, apartment_data: Dict[str, Any]) -> Dict[str, Any]:
        data = self._read_data()
        apartments = data.get("apartments", [])
        apt_id = apartment_data.get("id")

        if not apt_id:
            apt_id = "apt-" + str(uuid.uuid4())[:8]
            apartment_data["id"] = apt_id

        # Update or append
        found = False
        for i, apt in enumerate(apartments):
            if apt.get("id") == apt_id:
                apartments[i] = {**apt, **apartment_data}
                found = True
                break
        if not found:
            apartments.insert(0, apartment_data)

        data["apartments"] = apartments
        self._write_data(data)
        return apartment_data

    def delete_apartment(self, apt_id: str) -> bool:
        data = self._read_data()
        apartments = data.get("apartments", [])
        new_apartments = [a for a in apartments if a.get("id") != apt_id]
        if len(new_apartments) != len(apartments):
            data["apartments"] = new_apartments
            self._write_data(data)
            return True
        return False

    def toggle_block_date(self, apt_id: str, date_str: str, block: bool) -> List[str]:
        data = self._read_data()
        apartments = data.get("apartments", [])
        for apt in apartments:
            if apt.get("id") == apt_id:
                blocked = apt.get("blockedDates", [])
                if block and date_str not in blocked:
                    blocked.append(date_str)
                    blocked.sort()
                elif not block and date_str in blocked:
                    blocked.remove(date_str)
                apt["blockedDates"] = blocked
                data["apartments"] = apartments
                self._write_data(data)
                return blocked
        return []

    # Bookings operations
    def get_bookings(self) -> List[Dict[str, Any]]:
        return self._read_data().get("bookings", [])

    def create_booking(self, booking_data: Dict[str, Any]) -> Dict[str, Any]:
        data = self._read_data()
        bookings = data.get("bookings", [])
        
        if not booking_data.get("id"):
            booking_data["id"] = "bk-hs-" + str(uuid.uuid4().hex[:6]).upper()
        if not booking_data.get("createdAt"):
            booking_data["createdAt"] = datetime.utcnow().isoformat() + "Z"
        if not booking_data.get("invoiceNumber"):
            booking_data["invoiceNumber"] = "INV-HS-2026-" + booking_data["id"][-6:]
        if not booking_data.get("accessCode"):
            booking_data["accessCode"] = "HS-" + str(uuid.uuid4().hex[:4]).upper()

        bookings.insert(0, booking_data)
        data["bookings"] = bookings
        self._write_data(data)
        return booking_data

    def update_booking_status(self, booking_id: str, status: str) -> Optional[Dict[str, Any]]:
        data = self._read_data()
        bookings = data.get("bookings", [])
        for b in bookings:
            if b.get("id") == booking_id:
                b["status"] = status
                data["bookings"] = bookings
                self._write_data(data)
                return b
        return None

    # Reviews operations
    def get_reviews(self, apartment_id: Optional[str] = None) -> List[Dict[str, Any]]:
        reviews = self._read_data().get("reviews", [])
        if apartment_id:
            return [r for r in reviews if r.get("apartmentId") == apartment_id]
        return reviews

    def add_review(self, review_data: Dict[str, Any]) -> Dict[str, Any]:
        data = self._read_data()
        reviews = data.get("reviews", [])
        if not review_data.get("id"):
            review_data["id"] = "rev-" + str(uuid.uuid4())[:8]
        reviews.insert(0, review_data)
        data["reviews"] = reviews
        self._write_data(data)
        return review_data

    # Profile operations
    def get_profile(self) -> Dict[str, Any]:
        return self._read_data().get("profile", DEFAULT_PROFILE)

    def update_profile(self, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        data = self._read_data()
        current = data.get("profile", DEFAULT_PROFILE)
        updated = {**current, **profile_data}
        data["profile"] = updated
        self._write_data(data)
        return updated

db = DatabaseManager()
