"""
HavenStay Luxury Residences - Pydantic Data Models
Compatible with Python 3.10+, FastAPI, and Pydantic v2
"""

from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field

LanguageType = Literal['en', 'es', 'fr', 'de', 'ja', 'ar']
CurrencyType = Literal['USD', 'EUR', 'GBP', 'JPY', 'GHS']
BookingStatusType = Literal['confirmed', 'completed', 'cancelled']
PaymentMethodType = Literal['card', 'apple_pay', 'google_pay', 'momo']

class Coordinates(BaseModel):
    lat: float
    lng: float

class HostInfo(BaseModel):
    name: str
    avatar: str
    superhost: bool = True
    responseRate: str = "100% within 1 hour"
    joinedYear: int = 2022

class HostReply(BaseModel):
    author: str
    date: str
    text: str

class ReviewCategoryRatings(BaseModel):
    cleanliness: float = 5.0
    accuracy: float = 5.0
    communication: float = 5.0
    location: float = 5.0
    checkIn: float = 5.0
    value: float = 5.0

class Review(BaseModel):
    id: str
    apartmentId: str
    authorName: str
    authorCountry: str
    authorAvatar: Optional[str] = None
    rating: float
    categories: ReviewCategoryRatings
    date: str
    comment: str
    verifiedStay: bool = True
    hostReply: Optional[HostReply] = None

class Apartment(BaseModel):
    id: str
    title: str
    subtitle: str
    description: str
    city: str
    country: str
    neighborhood: str
    coordinates: Coordinates
    pricePerNight: float
    currency: CurrencyType = "USD"
    rating: float = 5.0
    reviewCount: int = 0
    bedrooms: int = 1
    bathrooms: float = 1.0
    maxGuests: int = 2
    sqft: int = 800
    featured: bool = False
    propertyType: Optional[str] = "Residence"
    images: List[str] = Field(default_factory=list)
    videos: Optional[List[str]] = Field(default_factory=list)
    videoUrl: Optional[str] = None
    amenities: List[str] = Field(default_factory=list)
    houseRules: List[str] = Field(default_factory=list)
    checkInTime: str = "15:00"
    checkOutTime: str = "11:00"
    cleaningFee: float = 80.0
    serviceFeePercent: float = 8.0
    taxesPercent: float = 5.0
    host: HostInfo
    blockedDates: List[str] = Field(default_factory=list)

class ApartmentCreate(BaseModel):
    title: str
    subtitle: str
    description: str
    city: str
    country: str
    neighborhood: str
    coordinates: Coordinates
    pricePerNight: float
    currency: CurrencyType = "USD"
    bedrooms: int = 1
    bathrooms: float = 1.0
    maxGuests: int = 2
    sqft: int = 800
    featured: bool = False
    propertyType: Optional[str] = "Apartment"
    images: List[str] = Field(default_factory=list)
    videoUrl: Optional[str] = None
    amenities: List[str] = Field(default_factory=list)
    houseRules: List[str] = Field(default_factory=list)
    checkInTime: str = "15:00"
    checkOutTime: str = "11:00"
    cleaningFee: float = 80.0
    serviceFeePercent: float = 8.0
    taxesPercent: float = 5.0
    hostName: Optional[str] = "HavenStay Host"

class BlockDateRequest(BaseModel):
    date: str # YYYY-MM-DD
    block: bool = True

class Booking(BaseModel):
    id: str
    apartmentId: str
    apartmentTitle: str
    apartmentImage: str
    apartmentCity: str
    apartmentAddress: str
    checkInDate: str
    checkOutDate: str
    guests: int
    totalNights: int
    pricePerNight: float
    subtotal: float
    cleaningFee: float
    serviceFee: float
    taxes: float
    totalAmount: float
    currency: CurrencyType
    guestName: str
    guestEmail: str
    guestPhone: str
    specialRequests: Optional[str] = None
    status: BookingStatusType = "confirmed"
    paymentMethod: PaymentMethodType = "card"
    paymentLast4: str = "4242"
    createdAt: str
    invoiceNumber: str
    accessCode: str
    isSyncedOffline: Optional[bool] = False

class BookingCreate(BaseModel):
    apartmentId: str
    checkInDate: str
    checkOutDate: str
    guests: int
    currency: CurrencyType = "USD"
    guestName: str
    guestEmail: str
    guestPhone: str
    paymentMethod: PaymentMethodType = "card"
    paymentLast4: Optional[str] = "4242"
    specialRequests: Optional[str] = None

class UserProfile(BaseModel):
    id: str = "usr_default"
    name: str = "Robert Vander"
    email: str = "robert.vander@example.com"
    phone: str = "+1 (555) 382-9104"
    avatar: str = ""
    bio: str = "Architectural designer & frequent traveler specializing in contemporary European design."
    preferredCurrency: CurrencyType = "GHS"
    language: LanguageType = "en"
    notificationsEnabled: bool = True
    emailAlertsEnabled: bool = True
    pushAlertsEnabled: bool = True
    gdprConsentDate: str = "2026-09-01T00:00:00.000Z"
    savedApartmentIds: List[str] = Field(default_factory=list)

class NotificationItem(BaseModel):
    id: str
    title: str
    message: str
    timestamp: str
    read: bool = False
    type: Literal['booking', 'reminder', 'security', 'system'] = "booking"
    bookingId: Optional[str] = None
