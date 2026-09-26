import React, { useState } from 'react';
import { Star, Heart, ChevronLeft, ChevronRight, Check, Play } from 'lucide-react';
import { Apartment, Currency, Language } from '../types';
import { formatPrice } from '../services/storage';
import { TRANSLATIONS } from '../data/translations';

interface ApartmentCardProps {
  apartment: Apartment;
  currentCurrency: Currency;
  currentLang: Language;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectApartment: (apartment: Apartment) => void;
  onQuickBook: (apartment: Apartment) => void;
}

export const ApartmentCard: React.FC<ApartmentCardProps> = ({
  apartment,
  currentCurrency,
  currentLang,
  isFavorite,
  onToggleFavorite,
  onSelectApartment,
  onQuickBook,
}) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % apartment.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + apartment.images.length) % apartment.images.length);
  };

  return (
    <article
      onClick={() => onSelectApartment(apartment)}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200/80 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
    >
      {/* Visual Asset Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
        <img
          src={apartment.images[currentImgIndex] || apartment.images[0]}
          alt={apartment.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Favorite Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(apartment.id);
          }}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute right-3 top-3 rounded-full bg-white/80 p-2 text-zinc-700 backdrop-blur-sm transition-colors hover:bg-white hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-zinc-900"
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* Video Tour Badge */}
        {(apartment.videoUrl || (apartment.videos && apartment.videos.length > 0)) && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-md bg-zinc-950/80 backdrop-blur-xs px-2 py-1 text-[10px] font-bold text-white shadow-xs">
            <Play className="h-2.5 w-2.5 fill-white" />
            <span>Video Tour</span>
          </div>
        )}

        {/* Image slider arrows */}
        {apartment.images.length > 1 && (
          <div className="absolute inset-x-2 top-1/2 flex -translate-y-1/2 items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={prevImage}
              aria-label="Previous image"
              className="rounded-full bg-white/90 p-1 text-zinc-800 shadow-sm hover:bg-white focus-visible:outline-2 focus-visible:outline-zinc-900"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next image"
              className="rounded-full bg-white/90 p-1 text-zinc-800 shadow-sm hover:bg-white focus-visible:outline-2 focus-visible:outline-zinc-900"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Image pagination dots */}
        {apartment.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
            {apartment.images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentImgIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Unboxed Metadata Header (NO PILLS) */}
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="font-semibold text-zinc-900">{apartment.propertyType || 'Residence'}</span>
            <span aria-hidden="true">·</span>
            <span>{apartment.city}</span>
            <span aria-hidden="true">·</span>
            <span>{apartment.neighborhood}</span>
          </div>

          <div className="flex items-center gap-1 font-semibold text-zinc-900">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="tabular-nums">{apartment.rating.toFixed(2)}</span>
            <span className="text-zinc-400">({apartment.reviewCount})</span>
          </div>
        </div>

        {/* Residence Title */}
        <h2 className="mt-2 font-serif text-lg font-bold tracking-tight text-zinc-900 line-clamp-1">
          {apartment.title}
        </h2>

        {/* Subtitle / Architectural note */}
        <p className="mt-1 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
          {apartment.subtitle}
        </p>

        {/* Architectural Specs (Unboxed with typographic separators) */}
        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
          <span>{apartment.bedrooms} {t.apartmentBeds}</span>
          <span aria-hidden="true">·</span>
          <span>{apartment.bathrooms} {t.apartmentBaths}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{apartment.sqft.toLocaleString()} {t.apartmentSqft}</span>
          {apartment.host.superhost && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-amber-700">Superhost</span>
            </>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="mt-5 flex items-baseline justify-between border-t border-zinc-100 pt-3">
          <div>
            <span className="text-lg font-bold tracking-tight tabular-nums text-zinc-950">
              {formatPrice(apartment.pricePerNight, currentCurrency)}
            </span>
            <span className="text-xs text-zinc-500 ml-1">/ {t.apartmentPerNight}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickBook(apartment);
              }}
              className="rounded-lg bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-zinc-900"
            >
              {t.bookNow}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
