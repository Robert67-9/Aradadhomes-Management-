import React from 'react';
import { Search, Calendar, Users, SlidersHorizontal, MapPin, X, Check, Sparkles } from 'lucide-react';
import { Language, Currency } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { formatPrice } from '../services/storage';
import { AMENITY_FILTERS, PROPERTY_TYPES } from '../utils/filterHelpers';

interface HeroSearchProps {
  currentLang: Language;
  currentCurrency: Currency;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  checkInDate: string;
  onCheckInDateChange: (d: string) => void;
  checkOutDate: string;
  onCheckOutDateChange: (d: string) => void;
  guestsCount: number;
  onGuestsCountChange: (g: number) => void;
  maxPrice: number;
  onMaxPriceChange: (p: number) => void;
  selectedNeighborhood: string;
  onSelectNeighborhood: (n: string) => void;
  neighborhoods: string[];
  totalResultsCount: number;
  // Advanced filters controls
  onOpenAdvancedFilters: () => void;
  activeFiltersCount: number;
  selectedAmenities: string[];
  onRemoveAmenity: (amenityId: string) => void;
  selectedPropertyTypes: string[];
  onRemovePropertyType: (typeId: string) => void;
  minBedrooms: number;
  onClearMinBedrooms: () => void;
  onClearAllFilters: () => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  currentLang,
  currentCurrency,
  searchQuery,
  onSearchQueryChange,
  checkInDate,
  onCheckInDateChange,
  checkOutDate,
  onCheckOutDateChange,
  guestsCount,
  onGuestsCountChange,
  maxPrice,
  onMaxPriceChange,
  selectedNeighborhood,
  onSelectNeighborhood,
  neighborhoods,
  totalResultsCount,
  onOpenAdvancedFilters,
  activeFiltersCount,
  selectedAmenities,
  onRemoveAmenity,
  selectedPropertyTypes,
  onRemovePropertyType,
  minBedrooms,
  onClearMinBedrooms,
  onClearAllFilters,
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const hasActiveAdvancedFilters =
    selectedAmenities.length > 0 || selectedPropertyTypes.length > 0 || minBedrooms > 0;

  return (
    <section className="relative overflow-hidden border-b border-zinc-200/60 bg-zinc-900 text-white">
      {/* Background imagery with measured dark contrast scrim */}
      <div className="absolute inset-0">
        <img
          src="/src/assets/images/hero_luxury_apartment_1790378080480.jpg"
          alt="Sunlit architectural luxury penthouse apartment"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-900/40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <div className="text-xs font-semibold tracking-wider text-amber-300 uppercase flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Curated Living · Verified Availability · Encrypted Transactions</span>
          </div>

          <h1 className="font-serif text-3xl font-normal tracking-tight text-white sm:text-5xl lg:text-6xl text-balance">
            {t.heroHeadline}
          </h1>

          <p className="max-w-2xl text-base text-zinc-300 leading-relaxed sm:text-lg">
            {t.heroSubheadline}
          </p>
        </div>

        {/* Master Search & Filter Surface */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/95 p-4 text-zinc-900 shadow-2xl backdrop-blur-xl sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* 1. Destination / Neighborhood Search */}
            <div className="space-y-1.5">
              <label htmlFor="search-destination" className="block text-xs font-semibold text-zinc-700">
                {t.searchDestination}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-zinc-400" aria-hidden="true" />
                <input
                  id="search-destination"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchQueryChange(e.target.value)}
                  placeholder={t.searchDestinationPlaceholder}
                  className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>

            {/* 2. Check-in Date */}
            <div className="space-y-1.5">
              <label htmlFor="search-check-in" className="block text-xs font-semibold text-zinc-700">
                {t.searchCheckIn}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-zinc-400" aria-hidden="true" />
                <input
                  id="search-check-in"
                  type="date"
                  value={checkInDate}
                  onChange={(e) => onCheckInDateChange(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>

            {/* 3. Check-out Date */}
            <div className="space-y-1.5">
              <label htmlFor="search-check-out" className="block text-xs font-semibold text-zinc-700">
                {t.searchCheckOut}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-zinc-400" aria-hidden="true" />
                <input
                  id="search-check-out"
                  type="date"
                  value={checkOutDate}
                  min={checkInDate || undefined}
                  onChange={(e) => onCheckOutDateChange(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>

            {/* 4. Guests & Price Quick Controls */}
            <div className="space-y-1.5">
              <label htmlFor="search-guests" className="block text-xs font-semibold text-zinc-700">
                {t.searchGuests}
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-zinc-400" aria-hidden="true" />
                <select
                  id="search-guests"
                  value={guestsCount}
                  onChange={(e) => onGuestsCountChange(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 cursor-pointer"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                  <option value={6}>6+ Guests</option>
                </select>
              </div>
            </div>
          </div>

          {/* Secondary Filter Bar with Neighborhoods, Price Slider and Advanced Filters Drawer Button */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200/80 pt-4">
            {/* Neighborhood quick tabs */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-xs font-semibold text-zinc-500 mr-0.5">Area:</span>
              <button
                type="button"
                onClick={() => onSelectNeighborhood('all')}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                  selectedNeighborhood === 'all'
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                All Areas
              </button>
              {neighborhoods.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onSelectNeighborhood(n)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                    selectedNeighborhood === n
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            {/* Right cluster: Price Cap + Advanced Filters Trigger Button */}
            <div className="flex items-center gap-3 sm:gap-4 ml-auto">
              {/* Max Rate Slider */}
              <div className="hidden sm:flex items-center gap-2.5">
                <span className="text-xs font-medium text-zinc-500">Max:</span>
                <input
                  type="range"
                  min={200}
                  max={700}
                  step={25}
                  value={maxPrice}
                  onChange={(e) => onMaxPriceChange(Number(e.target.value))}
                  className="h-1.5 w-24 cursor-pointer accent-zinc-900"
                />
                <span className="text-xs font-bold tabular-nums text-zinc-900 font-mono">
                  {formatPrice(maxPrice, currentCurrency)}
                </span>
              </div>

              {/* Advanced Filters Button */}
              <button
                type="button"
                onClick={onOpenAdvancedFilters}
                aria-label="Open advanced filters drawer"
                className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold border transition-all cursor-pointer shadow-xs active:scale-97 ${
                  activeFiltersCount > 0
                    ? 'border-zinc-950 bg-zinc-950 text-white ring-2 ring-zinc-950/20'
                    : 'border-zinc-300 bg-white text-zinc-800 hover:border-zinc-400 hover:bg-zinc-50'
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Advanced Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-zinc-950">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active Applied Filters Pills */}
          {hasActiveAdvancedFilters && (
            <div className="mt-3.5 pt-3 border-t border-zinc-100 flex flex-wrap items-center gap-1.5 animate-in fade-in">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mr-1">
                Active:
              </span>

              {/* Property Types */}
              {selectedPropertyTypes.map((typeId) => {
                const label = PROPERTY_TYPES.find((p) => p.id === typeId)?.label || typeId;
                return (
                  <span
                    key={`pt-${typeId}`}
                    className="inline-flex items-center gap-1 rounded-full bg-zinc-100 border border-zinc-200/80 px-2.5 py-0.5 text-xs font-medium text-zinc-800 shadow-2xs"
                  >
                    <span>Type: {label}</span>
                    <button
                      type="button"
                      onClick={() => onRemovePropertyType(typeId)}
                      className="rounded-full p-0.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200 transition-colors"
                      aria-label={`Remove filter ${label}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}

              {/* Amenities */}
              {selectedAmenities.map((amenityId) => {
                const def = AMENITY_FILTERS.find((a) => a.id === amenityId);
                const label = def?.label || amenityId;
                return (
                  <span
                    key={`am-${amenityId}`}
                    className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 text-xs font-medium text-amber-950 shadow-2xs"
                  >
                    <span>{label}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveAmenity(amenityId)}
                      className="rounded-full p-0.5 text-amber-600 hover:text-amber-950 hover:bg-amber-100 transition-colors"
                      aria-label={`Remove amenity filter ${label}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}

              {/* Bedrooms */}
              {minBedrooms > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 border border-zinc-200/80 px-2.5 py-0.5 text-xs font-medium text-zinc-800 shadow-2xs">
                  <span>Bedrooms: {minBedrooms}+</span>
                  <button
                    type="button"
                    onClick={onClearMinBedrooms}
                    className="rounded-full p-0.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200 transition-colors"
                    aria-label="Remove bedroom filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {/* Clear All Link */}
              <button
                type="button"
                onClick={onClearAllFilters}
                className="text-xs font-semibold text-zinc-500 hover:text-zinc-950 ml-1 underline underline-offset-2 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Count & Free Cancellation Guarantee Trust Strip */}
        <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-2">
          <div>
            Showing <strong className="font-semibold text-zinc-200">{totalResultsCount}</strong>{' '}
            {totalResultsCount === 1 ? 'architectural residence' : 'architectural residences'} matching your criteria
          </div>
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span>· Free cancellation up to 48h before arrival</span>
            <span>· Instant check-in digital keys</span>
            <span>· 100% verified host standards</span>
          </div>
        </div>
      </div>
    </section>
  );
};
