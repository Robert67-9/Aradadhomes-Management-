export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'ar';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'GHS';

export interface ReviewCategoryRatings {
  cleanliness: number;
  accuracy: number;
  communication: number;
  location: number;
  checkIn: number;
  value: number;
}

export interface Review {
  id: string;
  apartmentId: string;
  authorName: string;
  authorCountry: string;
  authorAvatar?: string;
  rating: number;
  categories: ReviewCategoryRatings;
  date: string;
  comment: string;
  verifiedStay: boolean;
  hostReply?: {
    author: string;
    date: string;
    text: string;
  };
}

export interface Apartment {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  city: string;
  country: string;
  neighborhood: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  pricePerNight: number;
  currency: Currency;
  rating: number;
  reviewCount: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  sqft: number;
  featured: boolean;
  propertyType?: string;
  images: string[];
  videos?: string[];
  videoUrl?: string;
  amenities: string[];
  houseRules: string[];
  checkInTime: string;
  checkOutTime: string;
  cleaningFee: number;
  serviceFeePercent: number;
  taxesPercent: number;
  host: {
    name: string;
    avatar: string;
    superhost: boolean;
    responseRate: string;
    joinedYear: number;
  };
  blockedDates: string[]; // YYYY-MM-DD
}

export interface Booking {
  id: string;
  apartmentId: string;
  apartmentTitle: string;
  apartmentImage: string;
  apartmentCity: string;
  apartmentAddress: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  guests: number;
  totalNights: number;
  pricePerNight: number;
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  taxes: number;
  totalAmount: number;
  currency: Currency;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  paymentMethod: 'card' | 'apple_pay' | 'google_pay' | 'momo';
  paymentLast4: string;
  createdAt: string;
  invoiceNumber: string;
  accessCode: string;
  isSyncedOffline?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  preferredCurrency: Currency;
  language: Language;
  notificationsEnabled: boolean;
  emailAlertsEnabled: boolean;
  pushAlertsEnabled: boolean;
  gdprConsentDate: string;
  savedApartmentIds: string[];
  dataExportedAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'booking' | 'reminder' | 'security' | 'system';
  bookingId?: string;
}

export interface OfflineAction {
  id: string;
  type: 'CREATE_BOOKING' | 'ADD_REVIEW' | 'UPDATE_PROFILE' | 'BLOCK_DATE';
  payload: any;
  timestamp: string;
}
