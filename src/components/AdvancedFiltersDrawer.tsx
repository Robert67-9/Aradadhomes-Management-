import React, { useEffect } from 'react';
import {
  X,
  RotateCcw,
  SlidersHorizontal,
  Wifi,
  Waves,
  Dumbbell,
  Wind,
  Utensils,
  Laptop,
  Sun,
  Car,
  ShieldCheck,
  Flame,
  Check,
  Building2,
  Home,
  Warehouse,
  Layers,
  Compass,
  Building,
  Sparkles,
  BedDouble,
  Bath,
} from 'lucide-react';
import { Currency } from '../types';
import { formatPrice } from '../services/storage';
import {
  AMENITY_FILTERS,
  PROPERTY_TYPES,
  AmenityDefinition,
  PropertyTypeDefinition,
} from '../utils/filterHelpers';

interface AdvancedFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  // Selected Amenities
  selectedAmenities: string[];
  onToggleAmenity: (amenityId: string) => void;
  // Selected Property Types
  selectedPropertyTypes: string[];
  onTogglePropertyType: (typeId: string) => void;
  // Rooms
  minBedrooms: number;
  onMinBedroomsChange: (beds: number) => void;
  minBathrooms: number;
  onMinBathroomsChange: (baths: number) => void;
  // Price
  maxPrice: number;
  onMaxPriceChange: (p: number) => void;
  currentCurrency: Currency;
  // Live results
  matchingCount: number;
  // Reset
  onResetFilters: () => void;
}

export const AdvancedFiltersDrawer: React.FC<AdvancedFiltersDrawerProps> = ({
  isOpen,
  onClose,
  selectedAmenities,
  onToggleAmenity,
  selectedPropertyTypes,
  onTogglePropertyType,
  minBedrooms,
  onMinBedroomsChange,
  minBathrooms,
  onMinBathroomsChange,
  maxPrice,
  onMaxPriceChange,
  currentCurrency,
  matchingCount,
  onResetFilters,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const totalActiveFilters =
    selectedAmenities.length +
    selectedPropertyTypes.length +
    (minBedrooms > 0 ? 1 : 0) +
    (minBathrooms > 0 ? 1 : 0) +
    (maxPrice < 700 ? 1 : 0);

  // Icon mapping helper
  const renderAmenityIcon = (iconName: string) => {
    const props = { className: 'h-4 w-4 shrink-0' };
    switch (iconName) {
      case 'Wifi':
        return <Wifi {...props} />;
      case 'Waves':
        return <Waves {...props} />;
      case 'Dumbbell':
        return <Dumbbell {...props} />;
      case 'Wind':
        return <Wind {...props} />;
      case 'Utensils':
        return <Utensils {...props} />;
      case 'Laptop':
        return <Laptop {...props} />;
      case 'Sun':
        return <Sun {...props} />;
      case 'Car':
        return <Car {...props} />;
      case 'ShieldCheck':
        return <ShieldCheck {...props} />;
      case 'Flame':
        return <Flame {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  const renderPropertyTypeIcon = (iconName: string) => {
    const props = { className: 'h-5 w-5 shrink-0' };
    switch (iconName) {
      case 'Building2':
        return <Building2 {...props} />;
      case 'Home':
        return <Home {...props} />;
      case 'Warehouse':
        return <Warehouse {...props} />;
      case 'Layers':
        return <Layers {...props} />;
      case 'Compass':
        return <Compass {...props} />;
      case 'Building':
        return <Building {...props} />;
      default:
        return <Building2 {...props} />;
    }
  };

  // Group amenities by category
  const popularAmenities = AMENITY_FILTERS.filter((a) => a.category === 'Popular');
  const otherAmenities = AMENITY_FILTERS.filter((a) => a.category !== 'Popular');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
        <aside
          role="dialog"
          aria-modal="true"
          aria-labelledby="filters-drawer-title"
          className="w-screen max-w-md sm:max-w-xl bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        >
          {/* ============================================================= */}
          {/* DRAWER HEADER                                                 */}
          {/* ============================================================= */}
          <div className="flex items-center justify-between border-b border-zinc-200/80 px-6 py-4.5 bg-zinc-50/50">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-xs">
                <SlidersHorizontal className="h-4 w-4" />
              </div>
              <div>
                <h2 id="filters-drawer-title" className="text-base font-bold text-zinc-950 font-serif">
                  Advanced Filters
                </h2>
                <p className="text-[11px] text-zinc-500">
                  Refine by amenities, property types & architectural criteria
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {totalActiveFilters > 0 && (
                <button
                  onClick={onResetFilters}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              )}
              <button
                onClick={onClose}
                aria-label="Close filters drawer"
                className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* ============================================================= */}
          {/* SCROLLABLE FILTER CONTENT                                     */}
          {/* ============================================================= */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 divide-y divide-zinc-100">
            
            {/* ----------------------------------------------------------- */}
            {/* SECTION 1: PROPERTY TYPE                                    */}
            {/* ----------------------------------------------------------- */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                    Property Type
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Select one or more architectural styles
                  </p>
                </div>
                {selectedPropertyTypes.length > 0 && (
                  <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-bold text-white">
                    {selectedPropertyTypes.length} selected
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {PROPERTY_TYPES.map((pt) => {
                  const isSelected = selectedPropertyTypes.includes(pt.id);
                  return (
                    <button
                      key={pt.id}
                      type="button"
                      onClick={() => onTogglePropertyType(pt.id)}
                      className={`group relative flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-zinc-950 bg-zinc-950 text-white shadow-sm ring-1 ring-zinc-950'
                          : 'border-zinc-200/90 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50/80'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className={`rounded-lg p-2 transition-colors ${
                            isSelected
                              ? 'bg-zinc-800 text-white'
                              : 'bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200/70 group-hover:text-zinc-900'
                          }`}
                        >
                          {renderPropertyTypeIcon(pt.iconName)}
                        </div>
                        {isSelected && (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-zinc-950">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div className="mt-3">
                        <span className="block text-xs font-bold">
                          {pt.label}
                        </span>
                        <span
                          className={`block text-[10px] leading-tight mt-0.5 ${
                            isSelected ? 'text-zinc-300' : 'text-zinc-500'
                          }`}
                        >
                          {pt.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ----------------------------------------------------------- */}
            {/* SECTION 2: POPULAR AMENITIES (WiFi, Pool, Gym, etc.)       */}
            {/* ----------------------------------------------------------- */}
            <div className="pt-6 space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                    <span>Popular Amenities</span>
                    <span className="rounded bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 text-[9px] uppercase tracking-normal">
                      High Demand
                    </span>
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Filter by verified residence features (WiFi, Pool, Gym, etc.)
                  </p>
                </div>
                {selectedAmenities.length > 0 && (
                  <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-bold text-white">
                    {selectedAmenities.length} selected
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {popularAmenities.map((amenity) => {
                  const isChecked = selectedAmenities.includes(amenity.id);
                  return (
                    <button
                      key={amenity.id}
                      type="button"
                      onClick={() => onToggleAmenity(amenity.id)}
                      className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-all cursor-pointer ${
                        isChecked
                          ? 'border-zinc-900 bg-zinc-900 text-white shadow-xs'
                          : 'border-zinc-200/90 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50'
                      }`}
                    >
                      <div
                        className={`rounded-lg p-2 shrink-0 ${
                          isChecked ? 'bg-zinc-800 text-amber-300' : 'bg-zinc-100 text-zinc-600'
                        }`}
                      >
                        {renderAmenityIcon(amenity.iconName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold truncate">
                            {amenity.label}
                          </span>
                          {isChecked && (
                            <Check className="h-3.5 w-3.5 text-amber-400 shrink-0 ml-1 stroke-[3]" />
                          )}
                        </div>
                        <p
                          className={`text-[10px] mt-0.5 leading-snug line-clamp-2 ${
                            isChecked ? 'text-zinc-300' : 'text-zinc-500'
                          }`}
                        >
                          {amenity.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ----------------------------------------------------------- */}
            {/* SECTION 3: MORE LUXURY AMENITIES                            */}
            {/* ----------------------------------------------------------- */}
            <div className="pt-6 space-y-3.5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                  Comfort & Executive Services
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Additional amenities tailored for long stays and executive retreats
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {otherAmenities.map((amenity) => {
                  const isChecked = selectedAmenities.includes(amenity.id);
                  return (
                    <button
                      key={amenity.id}
                      type="button"
                      onClick={() => onToggleAmenity(amenity.id)}
                      className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-all cursor-pointer ${
                        isChecked
                          ? 'border-zinc-900 bg-zinc-900 text-white shadow-xs'
                          : 'border-zinc-200/90 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50'
                      }`}
                    >
                      <div
                        className={`rounded-lg p-2 shrink-0 ${
                          isChecked ? 'bg-zinc-800 text-amber-300' : 'bg-zinc-100 text-zinc-600'
                        }`}
                      >
                        {renderAmenityIcon(amenity.iconName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold truncate">
                            {amenity.label}
                          </span>
                          {isChecked && (
                            <Check className="h-3.5 w-3.5 text-amber-400 shrink-0 ml-1 stroke-[3]" />
                          )}
                        </div>
                        <p
                          className={`text-[10px] mt-0.5 leading-snug line-clamp-2 ${
                            isChecked ? 'text-zinc-300' : 'text-zinc-500'
                          }`}
                        >
                          {amenity.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ----------------------------------------------------------- */}
            {/* SECTION 4: ROOMS & CAPACITY                                 */}
            {/* ----------------------------------------------------------- */}
            <div className="pt-6 space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                  Rooms & Space
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Filter by minimum dedicated bedrooms and bathrooms
                </p>
              </div>

              {/* Bedrooms */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-700">
                  <BedDouble className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Bedrooms</span>
                </div>
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => onMinBedroomsChange(num)}
                      className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                        minBedrooms === num
                          ? 'bg-zinc-950 text-white shadow-xs'
                          : 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      {num === 0 ? 'Any' : `${num}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-700">
                  <Bath className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Bathrooms</span>
                </div>
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => onMinBathroomsChange(num)}
                      className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                        minBathrooms === num
                          ? 'bg-zinc-950 text-white shadow-xs'
                          : 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      {num === 0 ? 'Any' : `${num}+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ----------------------------------------------------------- */}
            {/* SECTION 5: PRICE CAP                                        */}
            {/* ----------------------------------------------------------- */}
            <div className="pt-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                    Maximum Nightly Rate
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Includes all verified cleaning & service fees
                  </p>
                </div>
                <span className="text-sm font-bold font-mono text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-lg">
                  {formatPrice(maxPrice, currentCurrency)}/nt
                </span>
              </div>

              <input
                type="range"
                min={200}
                max={700}
                step={25}
                value={maxPrice}
                onChange={(e) => onMaxPriceChange(Number(e.target.value))}
                className="w-full h-2 cursor-pointer accent-zinc-950 rounded-lg bg-zinc-200"
              />
              <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
                <span>{formatPrice(200, currentCurrency)}</span>
                <span>{formatPrice(450, currentCurrency)}</span>
                <span>{formatPrice(700, currentCurrency)}+</span>
              </div>
            </div>

          </div>

          {/* ============================================================= */}
          {/* STICKY FOOTER ACTION BAR                                      */}
          {/* ============================================================= */}
          <div className="border-t border-zinc-200 bg-white px-6 py-4 flex items-center justify-between gap-3 shadow-lg">
            <button
              type="button"
              onClick={onResetFilters}
              disabled={totalActiveFilters === 0}
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 disabled:opacity-40 disabled:hover:text-zinc-600 underline underline-offset-4 cursor-pointer"
            >
              Clear all
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-zinc-800 transition-all cursor-pointer active:scale-98"
            >
              <span>Show {matchingCount} {matchingCount === 1 ? 'Residence' : 'Residences'}</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
