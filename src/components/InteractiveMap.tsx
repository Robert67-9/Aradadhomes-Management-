import React, { useState } from 'react';
import { MapPin, Navigation, ZoomIn, ZoomOut, RotateCcw, Star, X, ArrowRight } from 'lucide-react';
import { Apartment, Currency, Language } from '../types';
import { formatPrice } from '../services/storage';
import { TRANSLATIONS } from '../data/translations';

interface InteractiveMapProps {
  apartments: Apartment[];
  selectedApartment: Apartment | null;
  onSelectApartment: (apt: Apartment) => void;
  onBookApartment: (apt: Apartment) => void;
  currentCurrency: Currency;
  currentLang: Language;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  apartments,
  selectedApartment,
  onSelectApartment,
  onBookApartment,
  currentCurrency,
  currentLang,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [searchRadiusKm, setSearchRadiusKm] = useState(15);
  const [activeHoverPin, setActiveHoverPin] = useState<Apartment | null>(null);
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Coordinate normalizer for the map canvas
  // We place the apartments across an intuitive stylized metropolitan grid with parks, river, and transit corridors
  const getCoordinatesForApt = (apt: Apartment) => {
    // Map id to calibrated svg coordinates
    const mapCoords: Record<string, { x: number; y: number }> = {
      'apt-penthouse-mayfair': { x: 380, y: 220 },
      'apt-scandi-loft': { x: 620, y: 160 },
      'apt-coastal-villa': { x: 740, y: 410 },
      'apt-urban-studio': { x: 260, y: 340 },
      'apt-garden-duplex': { x: 500, y: 390 },
      'apt-accra-villa': { x: 440, y: 270 },
    };
    if (mapCoords[apt.id]) return mapCoords[apt.id];
    // Deterministic placement within map view bounds for newly created rooms
    let hash = 0;
    for (let i = 0; i < apt.id.length; i++) {
      hash = (hash << 5) - hash + apt.id.charCodeAt(i);
      hash |= 0;
    }
    const x = 200 + Math.abs(hash % 580);
    const y = 140 + Math.abs((hash >> 4) % 320);
    return { x, y };
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(2.0, Math.max(0.7, prev + delta)));
  };

  const handleReset = () => {
    setZoomLevel(1);
  };

  return (
    <div className="relative flex h-[620px] w-full flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-950 text-white shadow-xl">
      {/* Top Map Controls Bar */}
      <div className="absolute left-4 top-4 z-20 flex flex-wrap items-center gap-2 rounded-xl bg-zinc-900/90 p-2 text-xs backdrop-blur-md border border-white/10 shadow-lg">
        <div className="flex items-center gap-1.5 px-2 text-zinc-300 font-medium">
          <Navigation className="h-3.5 w-3.5 text-amber-400" />
          <span>Interactive Location Search</span>
        </div>
        <div className="h-4 w-px bg-zinc-700" />
        <div className="flex items-center gap-2 px-2">
          <span className="text-zinc-400">Radius:</span>
          <input
            type="range"
            min={3}
            max={30}
            value={searchRadiusKm}
            onChange={(e) => setSearchRadiusKm(Number(e.target.value))}
            className="h-1.5 w-20 cursor-pointer accent-amber-400"
          />
          <span className="tabular-nums font-semibold text-zinc-200">{searchRadiusKm} km</span>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute right-4 top-4 z-20 flex flex-col gap-1 rounded-xl bg-zinc-900/90 p-1 text-xs backdrop-blur-md border border-white/10 shadow-lg">
        <button
          onClick={() => handleZoom(0.2)}
          aria-label="Zoom in"
          className="rounded-lg p-2 text-zinc-300 hover:bg-white/10 hover:text-white"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleZoom(-0.2)}
          aria-label="Zoom out"
          className="rounded-lg p-2 text-zinc-300 hover:bg-white/10 hover:text-white"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={handleReset}
          aria-label="Reset zoom"
          className="rounded-lg p-2 text-zinc-300 hover:bg-white/10 hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative h-full w-full overflow-hidden bg-[#12151b]">
        <svg
          viewBox="0 0 1000 600"
          className="h-full w-full select-none transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          {/* Defs: Gradients and Patterns */}
          <defs>
            <linearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1a2e3b" />
              <stop offset="100%" stopColor="#0f1d27" />
            </linearGradient>
            <linearGradient id="parkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#182c22" />
              <stop offset="100%" stopColor="#112019" />
            </linearGradient>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Grid Background */}
          <rect width="1000" height="600" fill="url(#grid)" />

          {/* Waterway / River Arc */}
          <path
            d="M 0,280 C 250,220 380,360 620,300 C 800,250 900,420 1000,380 L 1000,440 C 900,480 800,310 620,360 C 380,420 250,280 0,340 Z"
            fill="url(#waterGrad)"
            opacity="0.85"
          />

          {/* Public Parks / Sanctuaries */}
          <path
            d="M 140,80 Q 240,60 220,170 Q 120,180 140,80 Z"
            fill="url(#parkGrad)"
            stroke="rgba(52, 211, 153, 0.2)"
            strokeWidth="1"
          />
          <text x="165" y="130" fill="#34d399" fontSize="10" opacity="0.6" letterSpacing="2">
            ROYAL PARK
          </text>

          <path
            d="M 680,80 Q 820,90 790,200 Q 640,190 680,80 Z"
            fill="url(#parkGrad)"
            stroke="rgba(52, 211, 153, 0.2)"
            strokeWidth="1"
          />
          <text x="710" y="145" fill="#34d399" fontSize="10" opacity="0.6" letterSpacing="2">
            BOTANICAL RESERVE
          </text>

          {/* Urban Road Networks */}
          <path d="M 0,160 L 1000,160" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeDasharray="6,6" />
          <path d="M 0,480 L 1000,480" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeDasharray="6,6" />
          <path d="M 320,0 L 320,600" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeDasharray="6,6" />
          <path d="M 700,0 L 700,600" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeDasharray="6,6" />

          {/* Primary Highway Arterial */}
          <path
            d="M 80,0 C 180,180 440,320 880,600"
            fill="none"
            stroke="rgba(245, 158, 11, 0.25)"
            strokeWidth="3"
          />

          {/* Search Radius Ring centered around downtown core */}
          <circle
            cx="480"
            cy="300"
            r={searchRadiusKm * 14}
            fill="rgba(245, 158, 11, 0.03)"
            stroke="rgba(245, 158, 11, 0.35)"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />

          {/* Neighborhood Labels */}
          <text x="350" y="195" fill="#a1a1aa" fontSize="11" fontWeight="600" letterSpacing="1">
            MAYFAIR HISTORIC QUARTER
          </text>
          <text x="560" y="130" fill="#a1a1aa" fontSize="11" fontWeight="600" letterSpacing="1">
            SÖDERMALM ARTS DISTRICT
          </text>
          <text x="180" y="320" fill="#a1a1aa" fontSize="11" fontWeight="600" letterSpacing="1">
            SAINT-GERMAIN BOULEVARD
          </text>
          <text x="730" y="380" fill="#a1a1aa" fontSize="11" fontWeight="600" letterSpacing="1">
            MONT BORON CLIFFSIDE
          </text>
          <text x="440" y="440" fill="#a1a1aa" fontSize="11" fontWeight="600" letterSpacing="1">
            DAIKANYAMA ZEN ENCLAVE
          </text>

          {/* Apartment Price Markers */}
          {apartments.map((apt) => {
            const { x, y } = getCoordinatesForApt(apt);
            const isSelected = selectedApartment?.id === apt.id;
            const isHovered = activeHoverPin?.id === apt.id;
            const priceText = formatPrice(apt.pricePerNight, currentCurrency);

            return (
              <g
                key={apt.id}
                className="cursor-pointer transition-transform duration-200"
                style={{
                  transform: isSelected || isHovered ? 'scale(1.15)' : 'scale(1)',
                  transformOrigin: `${x}px ${y}px`,
                }}
                onClick={() => onSelectApartment(apt)}
                onMouseEnter={() => setActiveHoverPin(apt)}
                onMouseLeave={() => setActiveHoverPin(null)}
              >
                {/* Pin shadow and pulse */}
                {(isSelected || isHovered) && (
                  <circle cx={x} cy={y} r="26" fill="rgba(245, 158, 11, 0.25)" className="animate-ping" />
                )}

                {/* Price Marker Pill (Interactive control button) */}
                <rect
                  x={x - 42}
                  y={y - 18}
                  width="84"
                  height="34"
                  rx="17"
                  fill={isSelected ? '#f59e0b' : isHovered ? '#ffffff' : '#18181b'}
                  stroke={isSelected ? '#fbbf24' : '#3f3f46'}
                  strokeWidth="1.5"
                  className="filter drop-shadow-md"
                />

                <text
                  x={x}
                  y={y + 3}
                  textAnchor="middle"
                  fill={isSelected ? '#18181b' : isHovered ? '#18181b' : '#ffffff'}
                  fontSize="12"
                  fontWeight="700"
                  fontFamily="sans-serif"
                >
                  {priceText}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Preview Card on Marker Select/Hover */}
      {(selectedApartment || activeHoverPin) && (
        <div className="absolute bottom-4 left-4 right-4 z-30 mx-auto max-w-md rounded-xl border border-zinc-700/80 bg-zinc-900/95 p-4 shadow-2xl backdrop-blur-xl">
          {(() => {
            const target = selectedApartment || activeHoverPin!;
            return (
              <div className="flex items-center gap-4">
                <img
                  src={target.images[0]}
                  alt={target.title}
                  className="h-20 w-24 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">
                      {target.city} · {target.neighborhood}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
                      <Star className="h-3 w-3 fill-amber-400" />
                      <span>{target.rating.toFixed(2)}</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-white truncate font-serif">{target.title}</h3>
                  <div className="mt-1 text-xs text-zinc-300">
                    <span className="font-bold text-amber-300 tabular-nums">
                      {formatPrice(target.pricePerNight, currentCurrency)}
                    </span>
                    <span className="text-zinc-400"> / night</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => onBookApartment(target)}
                      className="rounded bg-amber-400 px-3 py-1 text-xs font-semibold text-zinc-950 hover:bg-amber-300"
                    >
                      {t.bookNow}
                    </button>
                    <button
                      onClick={() => onSelectApartment(target)}
                      className="text-xs font-medium text-zinc-300 hover:text-white"
                    >
                      View Specs & Availability
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
