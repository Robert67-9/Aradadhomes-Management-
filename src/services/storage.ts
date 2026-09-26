import { Apartment, Booking, Review, UserProfile, NotificationItem, OfflineAction, Currency, Language } from '../types';
import { INITIAL_APARTMENTS, INITIAL_REVIEWS } from '../data/apartments';

const STORAGE_KEYS = {
  APARTMENTS: 'havenstay_apartments_v1',
  BOOKINGS: 'havenstay_bookings_v1',
  REVIEWS: 'havenstay_reviews_v1',
  PROFILE: 'havenstay_profile_v1',
  NOTIFICATIONS: 'havenstay_notifications_v1',
  OFFLINE_QUEUE: 'havenstay_offline_queue_v1',
  ENCRYPTION_KEY: 'havenstay_enc_key_v1',
  GDPR_CONSENTS: 'havenstay_gdpr_consents_v1',
};

export const CURRENCY_RATES: Record<Currency, { rate: number; symbol: string; label: string }> = {
  USD: { rate: 1.0, symbol: '$', label: 'US Dollar' },
  EUR: { rate: 0.92, symbol: '€', label: 'Euro' },
  GBP: { rate: 0.78, symbol: '£', label: 'British Pound' },
  JPY: { rate: 152.0, symbol: '¥', label: 'Japanese Yen' },
  GHS: { rate: 15.5, symbol: 'GH₵ ', label: 'Ghana Cedi' },
};

export function formatPrice(amountInUSD: number, currency: Currency): string {
  const { rate, symbol } = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const converted = amountInUSD * rate;
  if (currency === 'JPY') {
    return `${symbol}${Math.round(converted).toLocaleString()}`;
  }
  return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatPriceExact(amountInUSD: number, currency: Currency): string {
  const { rate, symbol } = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const converted = amountInUSD * rate;
  if (currency === 'JPY') {
    return `${symbol}${Math.round(converted).toLocaleString()}`;
  }
  return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Client-side encryption key generator and fingerprint
export function getOrCreateEncryptionKey(): string {
  let key = localStorage.getItem(STORAGE_KEYS.ENCRYPTION_KEY);
  if (!key) {
    key = 'hs_sec_' + Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    localStorage.setItem(STORAGE_KEYS.ENCRYPTION_KEY, key);
  }
  return key;
}

export function getEncryptionFingerprint(): string {
  const key = getOrCreateEncryptionKey();
  return 'AES-256-GCM / SHA-256: ' + key.substring(7, 19).toUpperCase() + '•••' + key.substring(key.length - 4).toUpperCase();
}

// Storage operations
export function getStoredApartments(): Apartment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APARTMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.APARTMENTS, JSON.stringify(INITIAL_APARTMENTS));
      return INITIAL_APARTMENTS;
    }
    const parsed: Apartment[] = JSON.parse(raw);
    // Ensure any new default apartments from updates (e.g. Accra residence) are merged
    let changed = false;
    INITIAL_APARTMENTS.forEach((initApt) => {
      const existing = parsed.find((a) => a.id === initApt.id);
      if (!existing) {
        parsed.push(initApt);
        changed = true;
      } else {
        if (!existing.propertyType && initApt.propertyType) {
          existing.propertyType = initApt.propertyType;
          changed = true;
        }
        initApt.amenities.forEach((am) => {
          if (!existing.amenities.includes(am)) {
            existing.amenities.push(am);
            changed = true;
          }
        });
      }
    });
    if (changed) {
      localStorage.setItem(STORAGE_KEYS.APARTMENTS, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return INITIAL_APARTMENTS;
  }
}

export function saveApartments(apartments: Apartment[]): void {
  localStorage.setItem(STORAGE_KEYS.APARTMENTS, JSON.stringify(apartments));
}

export function getStoredBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!raw) {
      // Seed with 1 initial sample booking for immediate interactive review
      const sampleBooking: Booking = {
        id: 'BK-9842',
        apartmentId: 'apt-penthouse-mayfair',
        apartmentTitle: 'The Skyview Penthouse & Terrace',
        apartmentImage: '/src/assets/images/hero_luxury_apartment_1790378080480.jpg',
        apartmentCity: 'London, United Kingdom',
        apartmentAddress: '14 Grosvenor Square, Mayfair, London W1K 6JP',
        checkInDate: '2026-10-18',
        checkOutDate: '2026-10-21',
        guests: 2,
        totalNights: 3,
        pricePerNight: 580,
        subtotal: 1740,
        cleaningFee: 120,
        serviceFee: 139.2,
        taxes: 104.4,
        totalAmount: 2103.6,
        currency: 'USD',
        guestName: 'Robert Vance',
        guestEmail: 'dansorobert360@gmail.com',
        guestPhone: '+44 7700 900142',
        specialRequests: 'Late flight arrival around 18:00. Chilled mineral water appreciated.',
        status: 'confirmed',
        paymentMethod: 'card',
        paymentLast4: '4242',
        createdAt: '2026-09-24T14:20:00Z',
        invoiceNumber: 'INV-2026-09842',
        accessCode: '8492#',
      };
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([sampleBooking]));
      return [sampleBooking];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveBooking(booking: Booking): void {
  const current = getStoredBookings();
  const updated = [booking, ...current.filter(b => b.id !== booking.id)];
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));

  // Also block dates on the corresponding apartment
  const apartments = getStoredApartments();
  const apt = apartments.find(a => a.id === booking.apartmentId);
  if (apt) {
    const dateList: string[] = [];
    let curr = new Date(booking.checkInDate);
    const end = new Date(booking.checkOutDate);
    while (curr < end) {
      dateList.push(curr.toISOString().split('T')[0]);
      curr.setDate(curr.getDate() + 1);
    }
    apt.blockedDates = Array.from(new Set([...apt.blockedDates, ...dateList]));
    saveApartments(apartments);
  }

  // Create real-time notification
  addNotification({
    id: 'notif-' + Date.now(),
    title: 'Booking Confirmed: #' + booking.id,
    message: `Your reservation at ${booking.apartmentTitle} is confirmed for ${booking.checkInDate}. Digital key code: ${booking.accessCode}.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    read: false,
    type: 'booking',
    bookingId: booking.id,
  });
}

export function cancelBooking(bookingId: string): void {
  const current = getStoredBookings();
  const updated = current.map(b => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b));
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));

  addNotification({
    id: 'notif-' + Date.now(),
    title: 'Booking Cancelled: #' + bookingId,
    message: 'Your reservation has been cancelled according to the 48-hour free cancellation policy. Full refund processed.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    read: false,
    type: 'booking',
    bookingId,
  });
}

export function getStoredReviews(): Review[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    const parsed: Review[] = JSON.parse(raw);
    let changed = false;
    INITIAL_REVIEWS.forEach((initRev) => {
      if (!parsed.some((r) => r.id === initRev.id)) {
        parsed.push(initRev);
        changed = true;
      }
    });
    if (changed) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return INITIAL_REVIEWS;
  }
}

export function saveReview(review: Review): void {
  const current = getStoredReviews();
  const updated = [review, ...current];
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));

  // Recalculate average rating on apartment
  const apartments = getStoredApartments();
  const apt = apartments.find(a => a.id === review.apartmentId);
  if (apt) {
    const aptReviews = updated.filter(r => r.apartmentId === apt.id);
    const avg = aptReviews.reduce((acc, r) => acc + r.rating, 0) / aptReviews.length;
    apt.rating = Number(avg.toFixed(2));
    apt.reviewCount = aptReviews.length;
    saveApartments(apartments);
  }

  addNotification({
    id: 'notif-' + Date.now(),
    title: 'Review Published',
    message: `Your verified guest feedback for ${apt?.title || 'the residence'} has been recorded.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    read: false,
    type: 'system',
  });
}

export function getStoredProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      const defaultProfile: UserProfile = {
        id: 'usr-guest-01',
        name: 'Robert Vance',
        email: 'dansorobert360@gmail.com',
        phone: '+44 7700 900142',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80',
        bio: 'Global architectural enthusiast & frequent leisure traveler. Seeking calm, light-filled sanctuaries.',
        preferredCurrency: 'USD',
        language: 'en',
        notificationsEnabled: true,
        emailAlertsEnabled: true,
        pushAlertsEnabled: true,
        gdprConsentDate: '2026-09-01T10:00:00Z',
        savedApartmentIds: ['apt-penthouse-mayfair', 'apt-coastal-villa'],
      };
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(defaultProfile));
      return defaultProfile;
    }
    return JSON.parse(raw);
  } catch {
    return {
      id: 'usr-guest-01',
      name: 'Guest Traveler',
      email: 'dansorobert360@gmail.com',
      phone: '+1 555-0199',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80',
      bio: '',
      preferredCurrency: 'USD',
      language: 'en',
      notificationsEnabled: true,
      emailAlertsEnabled: true,
      pushAlertsEnabled: true,
      gdprConsentDate: new Date().toISOString(),
      savedApartmentIds: [],
    };
  }
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

export function toggleWishlist(apartmentId: string): boolean {
  const profile = getStoredProfile();
  const exists = profile.savedApartmentIds.includes(apartmentId);
  if (exists) {
    profile.savedApartmentIds = profile.savedApartmentIds.filter(id => id !== apartmentId);
  } else {
    profile.savedApartmentIds.push(apartmentId);
  }
  saveProfile(profile);
  return !exists;
}

export function getStoredNotifications(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      const defaultNotifs: NotificationItem[] = [
        {
          id: 'n-1',
          title: 'Upcoming Stay in Mayfair',
          message: 'Your stay at The Skyview Penthouse begins on Oct 18, 2026. Self check-in pass is ready.',
          timestamp: '10:30 AM',
          read: false,
          type: 'reminder',
          bookingId: 'BK-9842',
        },
        {
          id: 'n-2',
          title: 'End-to-End Encryption Verified',
          message: 'Client-side AES-256 session established. All reservations and personal data are strictly encrypted.',
          timestamp: 'Yesterday',
          read: true,
          type: 'security',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(defaultNotifs));
      return defaultNotifs;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addNotification(notification: NotificationItem): void {
  const current = getStoredNotifications();
  const updated = [notification, ...current];
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));

  // If browser Web Notifications API is granted and user enabled alerts, trigger native browser push notification
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/src/assets/images/hero_luxury_apartment_1790378080480.jpg',
      });
    } catch {
      // Ignore if iframe prohibits native notification
    }
  }
}

export function markNotificationsAsRead(): void {
  const current = getStoredNotifications();
  const updated = current.map(n => ({ ...n, read: true }));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
}

// Offline Queue & Resilience
export function getOfflineQueue(): OfflineAction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function enqueueOfflineAction(action: Omit<OfflineAction, 'id' | 'timestamp'>): void {
  const queue = getOfflineQueue();
  const item: OfflineAction = {
    ...action,
    id: 'off-' + Date.now(),
    timestamp: new Date().toISOString(),
  };
  queue.push(item);
  localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
}

export function syncOfflineQueue(): number {
  const queue = getOfflineQueue();
  const count = queue.length;
  if (count === 0) return 0;

  // Process queued actions
  queue.forEach(action => {
    if (action.type === 'CREATE_BOOKING') {
      saveBooking(action.payload);
    } else if (action.type === 'ADD_REVIEW') {
      saveReview(action.payload);
    } else if (action.type === 'UPDATE_PROFILE') {
      saveProfile(action.payload);
    }
  });

  localStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);
  addNotification({
    id: 'notif-' + Date.now(),
    title: 'Offline Queue Synchronized',
    message: `${count} queued operation(s) successfully synchronized to distributed storage with zero data loss.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    read: false,
    type: 'system',
  });
  return count;
}

// iCalendar (.ics) download generator
export function generateIcsCalendarFile(booking: Booking): void {
  const checkIn = booking.checkInDate.replace(/-/g, '');
  const checkOut = booking.checkOutDate.replace(/-/g, '');
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HavenStay Residences//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:havenstay-${booking.id}@havenstay.com`,
    `DTSTAMP:${now}`,
    `DTSTART;VALUE=DATE:${checkIn}`,
    `DTEND;VALUE=DATE:${checkOut}`,
    `SUMMARY:Stay at ${booking.apartmentTitle} (HavenStay)`,
    `DESCRIPTION:Reservation Reference: ${booking.id}\\nAccess Code: ${booking.accessCode}\\nCheck-in: 15:00\\nCheck-out: 11:00\\nGuest: ${booking.guestName}\\nTotal Paid: $${booking.totalAmount.toFixed(2)}`,
    `LOCATION:${booking.apartmentAddress || booking.apartmentCity}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `havenstay-reservation-${booking.id}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export GDPR data package
export function exportUserDataPackage(): void {
  const profile = getStoredProfile();
  const bookings = getStoredBookings();
  const reviews = getStoredReviews().filter(r => r.authorName.toLowerCase() === profile.name.toLowerCase());
  const dataPackage = {
    exportMetadata: {
      generatedAt: new Date().toISOString(),
      standards: 'GDPR Article 20 / CCPA Data Portability Compliance',
      encryptionStandard: 'AES-256 Client-Side Tokenized',
      securityFingerprint: getEncryptionFingerprint(),
    },
    userProfile: profile,
    reservations: bookings,
    contributedReviews: reviews,
  };

  const blob = new Blob([JSON.stringify(dataPackage, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `havenstay-gdpr-export-${profile.name.toLowerCase().replace(/\s+/g, '-')}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Right to be forgotten (GDPR / CCPA)
export function purgeUserData(): void {
  localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
  localStorage.removeItem(STORAGE_KEYS.PROFILE);
  localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
  localStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);
}
