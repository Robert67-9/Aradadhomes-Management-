import React, { useState } from 'react';
import {
  X,
  Star,
  MapPin,
  Shield,
  Wifi,
  Users,
  Maximize2,
  Calendar as CalendarIcon,
  Check,
  Heart,
  ChevronLeft,
  ChevronRight,
  Share2,
  Film,
  Play,
  Image as ImageIcon
} from 'lucide-react';
import { Apartment, Review, Currency, Language } from '../types';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { ReviewsSection } from './ReviewsSection';
import { formatPrice } from '../services/storage';
import { TRANSLATIONS } from '../data/translations';

interface ApartmentDetailModalProps {
  apartment: Apartment;
  reviews: Review[];
  currentCurrency: Currency;
  currentLang: Language;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
  onBookNow: (apartment: Apartment, checkIn: string, checkOut: string) => void;
  onReviewAdded: (newReview: Review) => void;
}

export const ApartmentDetailModal: React.FC<ApartmentDetailModalProps> = ({
  apartment,
  reviews,
  currentCurrency,
  currentLang,
  isFavorite,
  onToggleFavorite,
  onClose,
  onBookNow,
  onReviewAdded,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [mediaMode, setMediaMode] = useState<'photos' | 'video'>('photos');
  const [checkInDate, setCheckInDate] = useState('2026-10-18');
  const [checkOutDate, setCheckOutDate] = useState('2026-10-21');
  const [shareToast, setShareToast] = useState(false);

  const hasVideo = Boolean(apartment.videoUrl || (apartment.videos && apartment.videos.length > 0));
  const activeVideoUrl = apartment.videoUrl || (apartment.videos && apartment.videos[0]);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="apartment-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative my-6 w-full max-w-5xl rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden">
        {/* Sticky Top Header Controls */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-200/80 bg-white/95 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
            <span>{apartment.city}</span>
            <span aria-hidden="true">·</span>
            <span>{apartment.neighborhood}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              aria-label="Share residence"
              className="flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </button>
            <button
              onClick={() => onToggleFavorite(apartment.id)}
              aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
              className="flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            >
              <Heart className={`h-3.5 w-3.5 ${isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>{isFavorite ? 'Saved' : 'Save'}</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {shareToast && (
          <div className="absolute top-16 right-6 z-30 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg animate-in fade-in">
            Residence link copied to clipboard!
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="max-h-[82vh] overflow-y-auto px-6 py-6 sm:px-8 space-y-10">
          {/* Title & Review Overview */}
          <div>
            <h1 id="apartment-detail-title" className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
              {apartment.title}
            </h1>
            <p className="mt-1 text-sm text-zinc-600">{apartment.subtitle}</p>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-600">
              <div className="flex items-center gap-1 font-semibold text-zinc-900">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="tabular-nums">{apartment.rating.toFixed(2)}</span>
                <span className="text-zinc-400">({apartment.reviewCount} {t.apartmentReviews})</span>
              </div>
              <span aria-hidden="true">·</span>
              <span>{apartment.bedrooms} {t.apartmentBeds}</span>
              <span aria-hidden="true">·</span>
              <span>{apartment.bathrooms} {t.apartmentBaths}</span>
              <span aria-hidden="true">·</span>
              <span>Up to {apartment.maxGuests} guests</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{apartment.sqft.toLocaleString()} {t.apartmentSqft}</span>
            </div>
          </div>

          {/* Photography & Video Tour Showcase Module */}
          <div className="space-y-3">
            {/* Header Switcher if Video exists */}
            {hasVideo && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Residence Media Showcase
                </span>
                <div className="flex items-center rounded-lg bg-zinc-100 p-0.5 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setMediaMode('photos')}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1 transition-all cursor-pointer ${
                      mediaMode === 'photos'
                        ? 'bg-white text-zinc-950 shadow-xs font-bold'
                        : 'text-zinc-600 hover:text-zinc-950'
                    }`}
                  >
                    <ImageIcon className="h-3.5 w-3.5" />
                    <span>Photos ({apartment.images.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaMode('video')}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1 transition-all cursor-pointer ${
                      mediaMode === 'video'
                        ? 'bg-zinc-950 text-white shadow-xs font-bold'
                        : 'text-zinc-600 hover:text-zinc-950'
                    }`}
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>Video Tour</span>
                  </button>
                </div>
              </div>
            )}

            {/* Media Player / Main View */}
            {mediaMode === 'video' && hasVideo ? (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-black shadow-md flex items-center justify-center border border-zinc-900">
                <video
                  src={activeVideoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <>
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-zinc-100">
                  <img
                    src={apartment.images[activeImageIndex] || apartment.images[0]}
                    alt={apartment.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-all duration-300"
                  />
                  {hasVideo && (
                    <button
                      type="button"
                      onClick={() => setMediaMode('video')}
                      className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-black/75 hover:bg-black text-white px-3 py-1.5 text-xs font-semibold backdrop-blur-xs shadow-md transition-all cursor-pointer"
                    >
                      <Play className="h-3 w-3 fill-white" />
                      <span>Watch Video Tour</span>
                    </button>
                  )}
                </div>

                {apartment.images.length > 1 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {apartment.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setActiveImageIndex(i);
                          setMediaMode('photos');
                        }}
                        className={`relative aspect-[4/3] overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
                          i === activeImageIndex && mediaMode === 'photos'
                            ? 'border-zinc-950 shadow-sm'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Main 2-Column Split: Details & Sticky Purchase Module */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Description, Amenities, Host (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Host Profile Strip */}
              <div className="flex items-center gap-4 rounded-xl border border-zinc-200/80 p-4">
                <img
                  src={apartment.host.avatar}
                  alt={apartment.host.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-serif font-bold text-sm text-zinc-950">
                    Hosted by {apartment.host.name}
                  </div>
                  <div className="text-xs text-zinc-500">
                    Superhost · {apartment.host.responseRate} · Member since {apartment.host.joinedYear}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="font-serif text-lg font-bold text-zinc-950">
                  Architectural Narrative & Design
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed sm:text-sm">
                  {apartment.description}
                </p>
              </div>

              {/* Amenities */}
              <div className="space-y-3 border-t border-zinc-100 pt-6">
                <h3 className="font-serif text-lg font-bold text-zinc-950">
                  Curated Amenities & Inclusions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-700">
                  {apartment.amenities.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* House Rules */}
              <div className="space-y-3 border-t border-zinc-100 pt-6">
                <h3 className="font-serif text-lg font-bold text-zinc-950">
                  House Rules & Policies
                </h3>
                <ul className="list-disc pl-4 text-xs text-zinc-600 space-y-1.5">
                  {apartment.houseRules.map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                  <li>Check-in: from {apartment.checkInTime} · Check-out: by {apartment.checkOutTime}</li>
                </ul>
              </div>
            </div>

            {/* Right Column: Interactive Real-Time Calendar & Purchase Module (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg">
                <div className="flex items-baseline justify-between border-b border-zinc-100 pb-4">
                  <div>
                    <span className="font-serif text-2xl font-bold tracking-tight tabular-nums text-zinc-950">
                      {formatPrice(apartment.pricePerNight, currentCurrency)}
                    </span>
                    <span className="text-xs text-zinc-500 ml-1">/ {t.apartmentPerNight}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-zinc-900">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{apartment.rating.toFixed(2)}</span>
                  </div>
                </div>

                {/* Calendar Component */}
                <div className="mt-4">
                  <AvailabilityCalendar
                    apartment={apartment}
                    checkInDate={checkInDate}
                    checkOutDate={checkOutDate}
                    onDatesChange={(inDate, outDate) => {
                      setCheckInDate(inDate);
                      setCheckOutDate(outDate);
                    }}
                    currentCurrency={currentCurrency}
                    currentLang={currentLang}
                  />
                </div>

                {/* Reserve Action Button */}
                <div className="mt-6">
                  <button
                    disabled={!checkInDate || !checkOutDate}
                    onClick={() => onBookNow(apartment, checkInDate, checkOutDate)}
                    className="w-full rounded-xl bg-zinc-950 py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-zinc-900"
                  >
                    {!checkInDate || !checkOutDate ? t.selectDatesPrompt : t.bookNow}
                  </button>

                  <div className="mt-2.5 text-center text-[11px] text-zinc-500">
                    {t.freeCancellation} · 256-bit AES Encrypted
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-zinc-200 pt-10">
            <ReviewsSection
              apartment={apartment}
              reviews={reviews}
              currentLang={currentLang}
              onReviewAdded={onReviewAdded}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
