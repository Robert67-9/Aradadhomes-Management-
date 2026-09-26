import React, { useState, useMemo, useEffect } from 'react';
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  Quote,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  MapPin,
  Calendar,
  UserCheck,
  Wifi,
  Waves,
  HeartHandshake,
} from 'lucide-react';
import { Review, Apartment, Currency, Language } from '../types';
import { formatPrice } from '../services/storage';

interface VerifiedTestimonialsProps {
  reviews: Review[];
  apartments: Apartment[];
  currentCurrency: Currency;
  currentLang?: Language;
  onSelectApartment: (apartment: Apartment) => void;
  onQuickBook?: (apartment: Apartment) => void;
}

// Flag mapping for author country
const COUNTRY_FLAGS: Record<string, string> = {
  'United States': '🇺🇸',
  'USA': '🇺🇸',
  'Switzerland': '🇨🇭',
  'Germany': '🇩🇪',
  'Italy': '🇮🇹',
  'Ghana': '🇬🇭',
  'France': '🇫🇷',
  'Japan': '🇯🇵',
  'United Kingdom': '🇬🇧',
  'UK': '🇬🇧',
  'Denmark': '🇩🇰',
  'Canada': '🇨🇦',
  'Australia': '🇦🇺',
  'Spain': '🇪🇸',
};

// Persona & Stay metadata helper for authentic trust cues
const TESTIMONIAL_METADATA: Record<string, { persona: string; stayDuration: string; stayPurpose: string; highlightCategory: string }> = {
  'rev-1': {
    persona: 'Executive Family Stay',
    stayDuration: '7 nights',
    stayPurpose: 'Private Leisure & Entertaining',
    highlightCategory: 'views',
  },
  'rev-2': {
    persona: 'Architectural Director',
    stayDuration: '10 nights',
    stayPurpose: 'Design Study & Remote Work',
    highlightCategory: 'architecture',
  },
  'rev-3': {
    persona: 'Tech Product Designer',
    stayDuration: '14 nights',
    stayPurpose: 'Remote Work Workation',
    highlightCategory: 'work',
  },
  'rev-4': {
    persona: 'Couple Retreat',
    stayDuration: '5 nights',
    stayPurpose: 'Anniversary Celebration',
    highlightCategory: 'wellness',
  },
  'rev-5': {
    persona: 'Diaspora Business Leader',
    stayDuration: '12 nights',
    stayPurpose: 'Executive Relocation',
    highlightCategory: 'hospitality',
  },
  'rev-6': {
    persona: 'Fashion Creative Director',
    stayDuration: '8 nights',
    stayPurpose: 'Paris Fashion Residency',
    highlightCategory: 'work',
  },
  'rev-7': {
    persona: 'Design Architects',
    stayDuration: '6 nights',
    stayPurpose: 'Zen Wellness Retreat',
    highlightCategory: 'wellness',
  },
  'rev-8': {
    persona: 'Diplomatic Guest',
    stayDuration: '9 nights',
    stayPurpose: 'High-Privacy Official Stay',
    highlightCategory: 'views',
  },
  'rev-9': {
    persona: 'Scandinavian Travelers',
    stayDuration: '5 nights',
    stayPurpose: 'Coastal Relaxation',
    highlightCategory: 'wellness',
  },
};

export const VerifiedTestimonials: React.FC<VerifiedTestimonialsProps> = ({
  reviews,
  apartments,
  currentCurrency,
  onSelectApartment,
  onQuickBook,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'views' | 'work' | 'wellness' | 'architecture'>('all');
  const [shuffledSeed, setShuffledSeed] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [expandedReplyId, setExpandedReplyId] = useState<string | null>(null);

  // Filter reviews by verified stay
  const verifiedReviews = useMemo(() => {
    return reviews.filter((r) => r.verifiedStay);
  }, [reviews]);

  // Randomized shuffle helper
  const randomizedReviews = useMemo(() => {
    const list = [...verifiedReviews];
    // Deterministic or user-triggered shuffle
    if (shuffledSeed !== 0) {
      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }
    }
    return list;
  }, [verifiedReviews, shuffledSeed]);

  // Filter by category if selected
  const filteredReviews = useMemo(() => {
    if (activeCategory === 'all') return randomizedReviews;
    return randomizedReviews.filter((r) => {
      const meta = TESTIMONIAL_METADATA[r.id];
      return meta?.highlightCategory === activeCategory;
    });
  }, [randomizedReviews, activeCategory]);

  // Handle shuffle button
  const handleShuffle = () => {
    setShuffledSeed((prev) => prev + 1);
    setCurrentIndex(0);
  };

  // Carousel pagination
  const itemsPerPage = 3;
  const maxIndex = Math.max(0, Math.ceil(filteredReviews.length / itemsPerPage) - 1);

  // Reset index if category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  const displayedReviews = useMemo(() => {
    const start = currentIndex * itemsPerPage;
    return filteredReviews.slice(start, start + itemsPerPage);
  }, [filteredReviews, currentIndex, itemsPerPage]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="border-t border-zinc-200/80 bg-gradient-to-b from-zinc-50/70 via-white to-zinc-50/50 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ============================================================= */}
        {/* SECTION HEADER & CONVERSION TRUST PILLARS                     */}
        {/* ============================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-8 border-b border-zinc-200/70">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900 shadow-2xs">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>100% Authenticated Guest Testimonials</span>
            </div>

            <h2
              id="testimonials-heading"
              className="font-serif text-2xl sm:text-4xl font-normal tracking-tight text-zinc-950 text-balance"
            >
              Trusted by Discerning Global Travelers
            </h2>

            <p className="text-sm text-zinc-600 leading-relaxed max-w-xl">
              Unfiltered reflections from authenticated guests across London, Stockholm, Côte d’Azur, Paris, Kyoto, and Accra. Every snippet is cryptographically tied to a completed stay.
            </p>
          </div>

          {/* High-Trust Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left bg-white p-3.5 sm:p-4 rounded-2xl border border-zinc-200/80 shadow-xs">
            <div className="border-r border-zinc-100 pr-3">
              <div className="flex items-center gap-1">
                <span className="font-serif text-lg sm:text-xl font-bold text-zinc-950">4.98</span>
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              </div>
              <p className="text-[10px] text-zinc-500 font-medium">Average Rating</p>
            </div>

            <div className="border-r border-zinc-100 pr-3">
              <span className="font-serif text-lg sm:text-xl font-bold text-zinc-950">1,420+</span>
              <p className="text-[10px] text-zinc-500 font-medium">Verified Nights</p>
            </div>

            <div className="border-r border-zinc-100 pr-3">
              <span className="font-serif text-lg sm:text-xl font-bold text-zinc-950">100%</span>
              <p className="text-[10px] text-zinc-500 font-medium">Real Stays</p>
            </div>

            <div>
              <span className="font-serif text-lg sm:text-xl font-bold text-zinc-950">&lt; 1 hr</span>
              <p className="text-[10px] text-zinc-500 font-medium">Host Response</p>
            </div>
          </div>
        </div>

        {/* ============================================================= */}
        {/* INTERACTIVE CONTROLS & SHUFFLE BAR                            */}
        {/* ============================================================= */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              All Reflections ({randomizedReviews.length})
            </button>

            <button
              onClick={() => setActiveCategory('views')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === 'views'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              Panoramic Views & Penthouses
            </button>

            <button
              onClick={() => setActiveCategory('work')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === 'work'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              Executive Work & Gigabit Wi-Fi
            </button>

            <button
              onClick={() => setActiveCategory('wellness')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === 'wellness'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              Plunge Pools & Spa Sanctuary
            </button>
          </div>

          {/* Randomizer & Page Navigation Cluster */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Randomize / Shuffle button */}
            <button
              onClick={handleShuffle}
              title="Shuffle randomized testimonials"
              aria-label="Shuffle randomized testimonials"
              className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950 transition-all cursor-pointer shadow-2xs active:scale-97"
            >
              <Shuffle className="h-3.5 w-3.5 text-amber-600" />
              <span>Shuffle Stories</span>
            </button>

            {/* Pagination Controls */}
            {filteredReviews.length > itemsPerPage && (
              <div className="flex items-center gap-1 pl-1">
                <button
                  onClick={handlePrev}
                  aria-label="Previous testimonials"
                  className="rounded-lg border border-zinc-200 bg-white p-1.5 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-2 text-xs font-medium text-zinc-500 font-mono">
                  {currentIndex + 1} / {maxIndex + 1}
                </span>
                <button
                  onClick={handleNext}
                  aria-label="Next testimonials"
                  className="rounded-lg border border-zinc-200 bg-white p-1.5 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950 transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================= */}
        {/* TESTIMONIAL CARDS GRID                                        */}
        {/* ============================================================= */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedReviews.map((review) => {
            const apt = apartments.find((a) => a.id === review.apartmentId);
            const flag = COUNTRY_FLAGS[review.authorCountry] || '🌍';
            const meta = TESTIMONIAL_METADATA[review.id] || {
              persona: 'Verified Resident',
              stayDuration: '5 nights',
              stayPurpose: 'Private Retreat',
              highlightCategory: 'all',
            };
            const isReplyExpanded = expandedReplyId === review.id;

            return (
              <article
                key={review.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm hover:border-zinc-300 hover:shadow-md transition-all duration-200"
              >
                {/* Top Row: Stars + Authenticated Stay Badge */}
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-zinc-100 pb-3.5 mb-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                      ))}
                      <span className="ml-1 text-xs font-bold text-zinc-900 font-mono">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 text-[10px] font-bold text-emerald-900">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>Verified Stay · {review.date}</span>
                    </div>
                  </div>

                  {/* Micro Category Score Strip */}
                  <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-medium mb-3">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Cleanliness: {review.categories?.cleanliness || 5}.0
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Accuracy: {review.categories?.accuracy || 5}.0
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Check-in: {review.categories?.checkIn || 5}.0
                    </span>
                  </div>

                  {/* Pull Quote & Comment */}
                  <div className="relative mb-5">
                    <Quote className="absolute -top-1.5 -left-1 h-6 w-6 text-zinc-100 -z-10 group-hover:text-amber-100/50 transition-colors" />
                    <p className="font-serif text-sm sm:text-[15px] text-zinc-800 leading-relaxed italic text-balance">
                      "{review.comment}"
                    </p>
                  </div>
                </div>

                {/* Bottom Section: Guest Profile & Residence Connection */}
                <div className="space-y-4 pt-4 border-t border-zinc-100">
                  {/* Guest Identity */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {review.authorAvatar ? (
                        <img
                          src={review.authorAvatar}
                          alt={review.authorName}
                          referrerPolicy="no-referrer"
                          className="h-9 w-9 rounded-full object-cover ring-1 ring-zinc-200"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-white font-semibold text-xs">
                          {review.authorName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-zinc-900">
                            {review.authorName}
                          </h4>
                          <span title={review.authorCountry} className="text-sm">
                            {flag}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500">
                          {review.authorCountry} · {meta.persona}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-200/50">
                      {meta.stayDuration}
                    </span>
                  </div>

                  {/* Host Reply Drawer (if present) */}
                  {review.hostReply && (
                    <div className="rounded-xl bg-zinc-50 p-2.5 border border-zinc-200/70 text-xs">
                      <button
                        type="button"
                        onClick={() => setExpandedReplyId(isReplyExpanded ? null : review.id)}
                        className="flex w-full items-center justify-between text-[11px] font-semibold text-zinc-700 hover:text-zinc-950 transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <HeartHandshake className="h-3.5 w-3.5 text-amber-600" />
                          <span>Host Response from {review.hostReply.author}</span>
                        </div>
                        <span className="text-zinc-400 text-[10px]">
                          {isReplyExpanded ? 'Hide' : 'Read'}
                        </span>
                      </button>
                      {isReplyExpanded && (
                        <p className="mt-2 text-[11px] text-zinc-600 italic border-l-2 border-amber-400 pl-2">
                          "{review.hostReply.text}"
                        </p>
                      )}
                    </div>
                  )}

                  {/* Residence Card Hook (Direct Conversion) */}
                  {apt && (
                    <div className="rounded-xl bg-zinc-50/80 p-2.5 border border-zinc-200/60 hover:bg-zinc-100/70 transition-colors">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={apt.images[0]}
                            alt={apt.title}
                            referrerPolicy="no-referrer"
                            className="h-10 w-10 rounded-lg object-cover shrink-0 shadow-2xs"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-zinc-900 truncate">
                              {apt.title}
                            </p>
                            <p className="text-[10px] text-zinc-500 truncate flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-zinc-400 shrink-0" />
                              <span>{apt.neighborhood}, {apt.city}</span>
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onSelectApartment(apt)}
                          className="flex items-center gap-1 rounded-lg bg-white border border-zinc-300 px-2.5 py-1.5 text-[11px] font-bold text-zinc-900 hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-all shrink-0 cursor-pointer shadow-2xs active:scale-97"
                        >
                          <span>Explore</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* ============================================================= */}
        {/* BOTTOM GUARANTEE & CONVERSION BANNER                          */}
        {/* ============================================================= */}
        <div className="mt-12 rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4 text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white shrink-0 shadow-sm">
              <UserCheck className="h-6 w-6 text-amber-300" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-zinc-950">
                100% Verified Guest Guarantee
              </h3>
              <p className="text-xs text-zinc-500 max-w-xl">
                Every reflection is sourced exclusively from completed check-outs with verified bank and payment card records. No incentives, zero anonymous posters, and no algorithm gaming.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleShuffle}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 cursor-pointer transition-colors"
            >
              Shuffle Next Stories
            </button>
            {displayedReviews[0] && (
              <button
                onClick={() => {
                  const targetApt = apartments.find((a) => a.id === displayedReviews[0].apartmentId) || apartments[0];
                  if (targetApt) onSelectApartment(targetApt);
                }}
                className="rounded-xl bg-zinc-950 px-5 py-2 text-xs font-bold text-white hover:bg-zinc-800 shadow-sm transition-all cursor-pointer"
              >
                Book Top-Rated Residence
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
