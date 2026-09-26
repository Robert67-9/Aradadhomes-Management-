import React, { useState, useEffect } from 'react';
import {
  Apartment,
  Booking,
  Review,
  UserProfile,
  NotificationItem,
  Currency,
  Language
} from './types';
import {
  getStoredApartments,
  saveApartments,
  getStoredBookings,
  getStoredReviews,
  getStoredProfile,
  saveProfile,
  toggleWishlist,
  getStoredNotifications,
  syncOfflineQueue
} from './services/storage';
import { TRANSLATIONS } from './data/translations';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { ApartmentCard } from './components/ApartmentCard';
import { InteractiveMap } from './components/InteractiveMap';
import { ApartmentDetailModal } from './components/ApartmentDetailModal';
import { PaymentModal } from './components/PaymentModal';
import { BookingEmailModal } from './components/BookingEmailModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { NotificationCenter } from './components/NotificationCenter';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { OfflineBanner } from './components/OfflineBanner';
import { AdvancedFiltersDrawer } from './components/AdvancedFiltersDrawer';
import { VerifiedTestimonials } from './components/VerifiedTestimonials';
import { filterApartments } from './utils/filterHelpers';
import {
  Calendar,
  ShieldCheck,
  Globe,
  SlidersHorizontal,
  Mail,
  CheckCircle2,
  Sparkles,
  Heart,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function App() {
  // Global State
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [profile, setProfile] = useState<UserProfile>(getStoredProfile());
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Navigation & View
  const [activeView, setActiveView] = useState<'residences' | 'map' | 'bookings' | 'admin'>('residences');
  const [currentLang, setCurrentLang] = useState<Language>(profile.language || 'en');
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(profile.preferredCurrency || 'USD');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guestsCount, setGuestsCount] = useState(2);
  const [maxPrice, setMaxPrice] = useState(700);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [minBedrooms, setMinBedrooms] = useState<number>(0);
  const [minBathrooms, setMinBathrooms] = useState<number>(0);
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);

  // Modals & Panels
  const [detailModalApartment, setDetailModalApartment] = useState<Apartment | null>(null);
  const [paymentModalData, setPaymentModalData] = useState<{
    apartment: Apartment;
    checkIn: string;
    checkOut: string;
  } | null>(null);
  const [emailModalBooking, setEmailModalBooking] = useState<Booking | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('havenstay_admin_auth') !== null;
    } catch {
      return false;
    }
  });

  // Offline Simulation
  const [simulatedOffline, setSimulatedOffline] = useState(false);

  // Toast alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize data on mount
  useEffect(() => {
    setApartments(getStoredApartments());
    setBookings(getStoredBookings());
    setReviews(getStoredReviews());
    setNotifications(getStoredNotifications());
  }, []);

  // Update HTML document direction and lang when language changes
  useEffect(() => {
    document.documentElement.lang = currentLang;
    if (currentLang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [currentLang]);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Extract unique neighborhoods for filtering
  const neighborhoods = Array.from(new Set(apartments.map((a) => a.neighborhood)));

  // Advanced filters handlers
  const handleToggleAmenity = (amenityId: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId) ? prev.filter((id) => id !== amenityId) : [...prev, amenityId]
    );
  };

  const handleTogglePropertyType = (typeId: string) => {
    setSelectedPropertyTypes((prev) =>
      prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId]
    );
  };

  const handleResetAdvancedFilters = () => {
    setSelectedAmenities([]);
    setSelectedPropertyTypes([]);
    setMinBedrooms(0);
    setMinBathrooms(0);
    setMaxPrice(700);
  };

  const activeFiltersCount =
    selectedAmenities.length +
    selectedPropertyTypes.length +
    (minBedrooms > 0 ? 1 : 0) +
    (minBathrooms > 0 ? 1 : 0) +
    (maxPrice < 700 ? 1 : 0);

  // Filter apartments using advanced criteria (Amenities, Property Type, Rooms, Price, Dates, Location)
  const filteredApartments = filterApartments(apartments, {
    searchQuery,
    checkInDate,
    checkOutDate,
    guestsCount,
    maxPrice,
    selectedNeighborhood,
    selectedPropertyTypes,
    selectedAmenities,
    minBedrooms,
    minBathrooms,
  });

  // Handler: Toggle Favorite / Wishlist
  const handleToggleFavorite = (apartmentId: string) => {
    const isNowFavorite = toggleWishlist(apartmentId);
    setProfile(getStoredProfile());
    showToast(isNowFavorite ? 'Added to your curated wishlist' : 'Removed from wishlist');
  };

  // Handler: Open Quick Reservation
  const handleQuickBook = (apt: Apartment) => {
    const inDate = checkInDate || '2026-10-18';
    const outDate = checkOutDate || '2026-10-21';
    setPaymentModalData({
      apartment: apt,
      checkIn: inDate,
      checkOut: outDate,
    });
  };

  // Handler: Payment Complete
  const handlePaymentSuccess = (newBooking: Booking) => {
    setPaymentModalData(null);
    setDetailModalApartment(null);
    setBookings(getStoredBookings());
    setApartments(getStoredApartments());
    setNotifications(getStoredNotifications());
    // Immediately display the automated confirmation email voucher modal!
    setEmailModalBooking(newBooking);
    showToast(`Reservation #${newBooking.id} confirmed and encrypted.`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAdminLogin = () => {
    setIsAdminLoginModalOpen(true);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setActiveView('admin');
    showToast('Admin session authenticated. Welcome back, Host Administrator.');
  };

  const handleAdminLogout = () => {
    try {
      localStorage.removeItem('havenstay_admin_auth');
    } catch {}
    setIsAdminAuthenticated(false);
    if (activeView === 'admin') {
      setActiveView('residences');
    }
    showToast('Signed out of Admin Portal.');
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;
  const activeBookingsCount = bookings.filter((b) => b.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 selection:bg-amber-100 selection:text-amber-900 pb-16 md:pb-0">
      {/* Offline Status & Sync Resilience Alert */}
      <OfflineBanner
        simulatedOffline={simulatedOffline}
        onToggleSimulatedOffline={setSimulatedOffline}
        onSyncComplete={() => {
          setBookings(getStoredBookings());
          setReviews(getStoredReviews());
          setApartments(getStoredApartments());
          setNotifications(getStoredNotifications());
          showToast('Offline queue synced with zero data loss.');
        }}
      />

      {/* Top Bar Navigation (Strict 3-Zone Contract) */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={(lang) => {
          setCurrentLang(lang);
          const p = { ...profile, language: lang };
          saveProfile(p);
          setProfile(p);
        }}
        currentCurrency={currentCurrency}
        onCurrencyChange={(curr) => {
          setCurrentCurrency(curr);
          const p = { ...profile, preferredCurrency: curr };
          saveProfile(p);
          setProfile(p);
        }}
        activeView={activeView}
        onNavigate={setActiveView}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
        unreadNotificationsCount={unreadNotifsCount}
        activeBookingsCount={activeBookingsCount}
        simulatedOffline={simulatedOffline}
        onToggleSimulatedOffline={setSimulatedOffline}
        isAdminAuthenticated={isAdminAuthenticated}
        onOpenAdminLogin={handleOpenAdminLogin}
        onAdminLogout={handleAdminLogout}
      />

      {/* Main Content Area Based on Active View */}
      <main id="main-content">
        {/* VIEW 1: RESIDENCES CATALOG */}
        {activeView === 'residences' && (
          <div>
            {/* Architectural Hero Banner & Search Filter Bar */}
            <HeroSearch
              currentLang={currentLang}
              currentCurrency={currentCurrency}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              checkInDate={checkInDate}
              onCheckInDateChange={setCheckInDate}
              checkOutDate={checkOutDate}
              onCheckOutDateChange={setCheckOutDate}
              guestsCount={guestsCount}
              onGuestsCountChange={setGuestsCount}
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
              selectedNeighborhood={selectedNeighborhood}
              onSelectNeighborhood={setSelectedNeighborhood}
              neighborhoods={neighborhoods}
              totalResultsCount={filteredApartments.length}
              onOpenAdvancedFilters={() => setIsAdvancedFiltersOpen(true)}
              activeFiltersCount={activeFiltersCount}
              selectedAmenities={selectedAmenities}
              onRemoveAmenity={(id) => setSelectedAmenities((prev) => prev.filter((a) => a !== id))}
              selectedPropertyTypes={selectedPropertyTypes}
              onRemovePropertyType={(type) => setSelectedPropertyTypes((prev) => prev.filter((t) => t !== type))}
              minBedrooms={minBedrooms}
              onClearMinBedrooms={() => setMinBedrooms(0)}
              onClearAllFilters={handleResetAdvancedFilters}
            />

            {/* Residences Grid Section */}
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 border-b border-zinc-200/80 pb-6">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
                    Curated Residences
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    Hand-inspected apartments with real-time verified calendar availability.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setIsAdvancedFiltersOpen(true)}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-zinc-900 cursor-pointer ${
                      activeFiltersCount > 0
                        ? 'border-zinc-950 bg-zinc-950 text-white'
                        : 'border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50'
                    }`}
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span>Filters</span>
                    {activeFiltersCount > 0 && (
                      <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-zinc-950">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveView('map')}
                    className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-zinc-900 cursor-pointer"
                  >
                    <span>Switch to Map View</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Apartment Cards Grid */}
              {filteredApartments.length === 0 ? (
                <div className="my-16 rounded-2xl border border-dashed border-zinc-300 p-12 text-center bg-white shadow-2xs">
                  <h3 className="font-serif text-lg font-semibold text-zinc-800">
                    No residences match your current filters
                  </h3>
                  <p className="mt-2 text-xs text-zinc-500 max-w-md mx-auto">
                    Try removing specific amenities, broadening your property type criteria, or relaxing your dates.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => setIsAdvancedFiltersOpen(true)}
                      className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 cursor-pointer"
                    >
                      Adjust Advanced Filters
                    </button>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setCheckInDate('');
                        setCheckOutDate('');
                        setMaxPrice(700);
                        setSelectedNeighborhood('all');
                        handleResetAdvancedFilters();
                      }}
                      className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 cursor-pointer"
                    >
                      Clear All Search Criteria
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredApartments.map((apartment) => (
                    <ApartmentCard
                      key={apartment.id}
                      apartment={apartment}
                      currentCurrency={currentCurrency}
                      currentLang={currentLang}
                      isFavorite={profile.savedApartmentIds.includes(apartment.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelectApartment={(apt) => setDetailModalApartment(apt)}
                      onQuickBook={handleQuickBook}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Verified Guest Testimonials Section (High-Trust Conversion Driver) */}
            <VerifiedTestimonials
              reviews={reviews}
              apartments={apartments}
              currentCurrency={currentCurrency}
              currentLang={currentLang}
              onSelectApartment={(apt) => setDetailModalApartment(apt)}
              onQuickBook={handleQuickBook}
            />

            {/* Architectural Trust & Verification Strip */}
            <section className="border-t border-zinc-200/80 bg-white py-16">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-600">
                      01. Verified Availability
                    </div>
                    <h3 className="font-serif text-lg font-bold text-zinc-900">
                      Real-Time Calendar Sync
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Every night’s availability is authoritatively managed in our distributed engine. Zero double-booking, guaranteed.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-600">
                      02. Financial Security
                    </div>
                    <h3 className="font-serif text-lg font-bold text-zinc-900">
                      PCI-DSS Level 1 & 3D Secure
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Transactions use client-side AES-256 tokenization with 3D Secure biometrics. Card credentials never touch unencrypted storage.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-600">
                      03. Offline Resilience
                    </div>
                    <h3 className="font-serif text-lg font-bold text-zinc-900">
                      Uninterrupted Data Entry
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Browse, select dates, and draft reservations even on erratic mobile networks. Auto-sync ensures zero data loss.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: INTERACTIVE LOCATION MAP */}
        {activeView === 'map' && (
          <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
                  {t.navMap}
                </h1>
                <p className="text-xs text-zinc-500">
                  Explore residences across iconic historic and urban districts. Click pins for immediate availability and rates.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsAdvancedFiltersOpen(true)}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-zinc-900 cursor-pointer ${
                    activeFiltersCount > 0
                      ? 'border-zinc-950 bg-zinc-950 text-white'
                      : 'border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50'
                  }`}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-zinc-950">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveView('residences')}
                  className="rounded-lg border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 shadow-sm cursor-pointer"
                >
                  Back to Grid View
                </button>
              </div>
            </div>

            <InteractiveMap
              apartments={filteredApartments}
              selectedApartment={detailModalApartment}
              onSelectApartment={(apt) => setDetailModalApartment(apt)}
              onBookApartment={handleQuickBook}
              currentCurrency={currentCurrency}
              currentLang={currentLang}
            />
          </section>
        )}

        {/* VIEW 3: MY BOOKINGS & RESERVATIONS */}
        {activeView === 'bookings' && (
          <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
              <div>
                <h1 className="font-serif text-3xl font-bold tracking-tight text-zinc-950">
                  {t.myBookings}
                </h1>
                <p className="text-xs text-zinc-500">
                  Access digital smart key access PINs, confirmation email receipts, and calendar synchronization.
                </p>
              </div>

              <button
                onClick={() => setActiveView('residences')}
                className="rounded-lg bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
              >
                Discover More Stays
              </button>
            </div>

            {bookings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 py-16 text-center">
                <Calendar className="mx-auto h-8 w-8 text-zinc-400" />
                <h3 className="mt-3 font-serif text-lg font-semibold text-zinc-800">
                  {t.noBookingsYet}
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Reserve a penthouse or architectural loft to see your access codes and automated receipts here.
                </p>
                <button
                  onClick={() => setActiveView('residences')}
                  className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
                >
                  Explore Residences
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-all hover:shadow"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={booking.apartmentImage}
                        alt={booking.apartmentTitle}
                        className="h-20 w-24 rounded-lg object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif text-base font-bold text-zinc-950">
                            {booking.apartmentTitle}
                          </h3>
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                              booking.status === 'confirmed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : booking.status === 'completed'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {booking.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">
                          {booking.checkInDate} → {booking.checkOutDate} · {booking.totalNights} nights · Ref #{booking.id}
                        </div>
                        <div className="text-xs font-semibold text-zinc-900 mt-1">
                          Digital Key Code: <strong className="font-mono text-zinc-950">{booking.accessCode}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <button
                        onClick={() => setEmailModalBooking(booking)}
                        className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-1.5 font-medium text-zinc-800 hover:bg-zinc-100"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        <span>{t.viewReceipt}</span>
                      </button>
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => {
                            if (window.confirm('Cancel this reservation? Full refund will be automatically credited.')) {
                              setBookings((prev) =>
                                prev.map((b) => (b.id === booking.id ? { ...b, status: 'cancelled' } : b))
                              );
                              showToast('Reservation cancelled.');
                            }
                          }}
                          className="rounded-lg border border-rose-200 px-3 py-1.5 font-medium text-rose-700 hover:bg-rose-50"
                        >
                          Cancel Stay
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* VIEW 4: ADMIN & HOST DASHBOARD */}
        {activeView === 'admin' && (
          isAdminAuthenticated ? (
            <AdminDashboard
              apartments={apartments}
              bookings={bookings}
              currentCurrency={currentCurrency}
              currentLang={currentLang}
              onUpdateApartments={(updated) => setApartments(updated)}
              onUpdateBookings={(updated) => setBookings(updated)}
              onOpenBookingEmail={(b) => setEmailModalBooking(b)}
              onAdminLogout={handleAdminLogout}
            />
          ) : (
            <div className="mx-auto max-w-xl px-4 py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-amber-400 shadow-md">
                <Lock className="h-7 w-7" />
              </div>
              <h2 className="mt-4 font-serif text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
                Host & Operations Portal Restricted
              </h2>
              <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
                Authentication required to access real-time calendar date blocking, pricing surge management, and guest reservation oversight.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setIsAdminLoginModalOpen(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-6 py-3 text-xs font-semibold text-white shadow-lg hover:bg-zinc-800 transition-colors"
                >
                  <Lock className="h-4 w-4 text-amber-400" />
                  <span>Sign In as Host Administrator</span>
                </button>
                <button
                  onClick={() => setActiveView('residences')}
                  className="w-full sm:w-auto rounded-xl border border-zinc-200 bg-white px-5 py-3 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  Return to Residences
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Global Interactive Modals */}
      {detailModalApartment && (
        <ApartmentDetailModal
          apartment={detailModalApartment}
          reviews={reviews}
          currentCurrency={currentCurrency}
          currentLang={currentLang}
          isFavorite={profile.savedApartmentIds.includes(detailModalApartment.id)}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => setDetailModalApartment(null)}
          onBookNow={(apt, checkIn, checkOut) => {
            setDetailModalApartment(null);
            setPaymentModalData({
              apartment: apt,
              checkIn,
              checkOut,
            });
          }}
          onReviewAdded={(newRev) => {
            setReviews(getStoredReviews());
            setApartments(getStoredApartments());
            showToast('Review submitted and verified.');
          }}
        />
      )}

      {paymentModalData && (
        <PaymentModal
          apartment={paymentModalData.apartment}
          checkInDate={paymentModalData.checkIn}
          checkOutDate={paymentModalData.checkOut}
          guestsCount={guestsCount}
          currentCurrency={currentCurrency}
          currentLang={currentLang}
          simulatedOffline={simulatedOffline}
          onClose={() => setPaymentModalData(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {emailModalBooking && (
        <BookingEmailModal
          booking={emailModalBooking}
          currentCurrency={currentCurrency}
          currentLang={currentLang}
          onClose={() => setEmailModalBooking(null)}
        />
      )}

      {isProfileModalOpen && (
        <UserProfileModal
          profile={profile}
          bookings={bookings}
          apartments={apartments}
          currentCurrency={currentCurrency}
          currentLang={currentLang}
          onClose={() => setIsProfileModalOpen(false)}
          onProfileUpdated={(updated) => setProfile(updated)}
          onBookingsUpdated={() => setBookings(getStoredBookings())}
          onOpenBookingEmail={(b) => setEmailModalBooking(b)}
        />
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Notification Center Drawer */}
      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        currentLang={currentLang}
        onNotificationsRead={() => setNotifications(getStoredNotifications())}
        onSelectBookingNotification={(bId) => {
          const found = bookings.find((b) => b.id === bId);
          if (found) {
            setIsNotificationsOpen(false);
            setEmailModalBooking(found);
          }
        }}
      />

      {/* Accessibility Toolbar */}
      <AccessibilityToolbar
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
      />

      {/* Advanced Filters Drawer */}
      <AdvancedFiltersDrawer
        isOpen={isAdvancedFiltersOpen}
        onClose={() => setIsAdvancedFiltersOpen(false)}
        selectedAmenities={selectedAmenities}
        onToggleAmenity={handleToggleAmenity}
        selectedPropertyTypes={selectedPropertyTypes}
        onTogglePropertyType={handleTogglePropertyType}
        minBedrooms={minBedrooms}
        onMinBedroomsChange={setMinBedrooms}
        minBathrooms={minBathrooms}
        onMinBathroomsChange={setMinBathrooms}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        currentCurrency={currentCurrency}
        matchingCount={filteredApartments.length}
        onResetFilters={handleResetAdvancedFilters}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-xs font-semibold text-white shadow-2xl animate-in fade-in"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Quiet Footer */}
      <footer className="border-t border-zinc-200 bg-white py-12 text-zinc-500 text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-serif font-bold text-zinc-900 text-base">
            HavenStay Residences
          </div>
          <div className="flex items-center gap-6 text-zinc-500">
            <button onClick={() => setIsProfileModalOpen(true)} className="hover:text-zinc-900">
              Privacy & GDPR
            </button>
            <button onClick={() => setIsAccessibilityOpen(true)} className="hover:text-zinc-900">
              WCAG 2.1 Statement
            </button>
            <button onClick={() => setActiveView('admin')} className="hover:text-zinc-900">
              Host Portal
            </button>
          </div>
          <div>
            © 2026 HavenStay International Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
