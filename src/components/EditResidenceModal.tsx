import React, { useState, useRef } from 'react';
import {
  X,
  Building,
  MapPin,
  Coins,
  Bed,
  Bath,
  Users,
  Maximize2,
  Image as ImageIcon,
  Film,
  UploadCloud,
  Trash2,
  Check,
  Plus,
  Save,
  Star,
  Sparkles,
  Loader2,
  FileVideo,
  ShieldCheck,
  Clock,
  Eye,
} from 'lucide-react';
import { Apartment, Currency, Language } from '../types';
import { CURRENCY_RATES, formatPrice } from '../services/storage';
import { compressImageFile, readVideoFile, formatFileSize } from '../utils/mediaUpload';

interface EditResidenceModalProps {
  apartment: Apartment;
  currentCurrency: Currency;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedApartment: Apartment) => void;
}

const POPULAR_AMENITIES = [
  '24/7 Solar & Standby Generator Power',
  'High-Speed Fiber Wi-Fi (500 Mbps)',
  'Private Swimming Pool / Plunge Pool',
  'Air Conditioning & Climate Control',
  '24/7 Uniformed Security & Concierge',
  'Chef Kitchen with Modern Appliances',
  'Private Balcony or Rooftop Terrace',
  'Dedicated Workspace / Desk',
  'Gated Secure Parking',
  'In-Unit Washer & Dryer',
  'Smart TV & Sound System',
  'Keyless Smart Lock Entry',
  'Hinoki Soaking Tub',
  'Private Elevator Access',
  'EV Vehicle Charger',
];

const PRESET_STOCK_IMAGES = [
  '/src/assets/images/hero_luxury_apartment_1790378080480.jpg',
  '/src/assets/images/apt_scandi_loft_1790378092782.jpg',
  '/src/assets/images/apt_coastal_villa_1790378103266.jpg',
  '/src/assets/images/apt_urban_studio_1790378114329.jpg',
  '/src/assets/images/apt_garden_duplex_1790378124347.jpg',
];

export const EditResidenceModal: React.FC<EditResidenceModalProps> = ({
  apartment,
  currentCurrency,
  isOpen,
  onClose,
  onSave,
}) => {
  // Navigation tabs within edit modal
  const [activeTab, setActiveTab] = useState<'details' | 'pricing' | 'specs' | 'media' | 'amenities'>('details');

  // Form states initialized with existing apartment data
  const [title, setTitle] = useState(apartment.title);
  const [subtitle, setSubtitle] = useState(apartment.subtitle);
  const [description, setDescription] = useState(apartment.description);
  const [city, setCity] = useState(apartment.city);
  const [country, setCountry] = useState(apartment.country);
  const [neighborhood, setNeighborhood] = useState(apartment.neighborhood);
  const [propertyType, setPropertyType] = useState(apartment.propertyType || 'Apartment');
  const [lat, setLat] = useState(String(apartment.coordinates.lat));
  const [lng, setLng] = useState(String(apartment.coordinates.lng));

  const currInfo = CURRENCY_RATES[currentCurrency] || CURRENCY_RATES.USD;
  const currRate = currInfo.rate;
  const currSymbol = currInfo.symbol.trim();

  // Pricing & Financials
  const [priceUSD, setPriceUSD] = useState(String(apartment.pricePerNight));
  const [activePrice, setActivePrice] = useState(
    String(Math.round(apartment.pricePerNight * currRate))
  );
  const [cleaningFee, setCleaningFee] = useState(apartment.cleaningFee || 80);
  const [cleaningFeeActive, setCleaningFeeActive] = useState(
    String(Math.round((apartment.cleaningFee || 80) * currRate))
  );
  const [serviceFeePercent, setServiceFeePercent] = useState(apartment.serviceFeePercent || 8);
  const [taxesPercent, setTaxesPercent] = useState(apartment.taxesPercent || 5);

  const handleActivePriceChange = (val: string) => {
    setActivePrice(val);
    const num = parseFloat(val) || 0;
    const usd = Math.round(num / currRate);
    setPriceUSD(String(usd));
  };

  const handleCleaningFeeChange = (val: string) => {
    setCleaningFeeActive(val);
    const num = parseFloat(val) || 0;
    const usd = Math.round(num / currRate);
    setCleaningFee(usd);
  };

  // Layout & Specs
  const [bedrooms, setBedrooms] = useState(apartment.bedrooms);
  const [bathrooms, setBathrooms] = useState(apartment.bathrooms);
  const [maxGuests, setMaxGuests] = useState(apartment.maxGuests);
  const [sqft, setSqft] = useState(apartment.sqft);
  const [checkInTime, setCheckInTime] = useState(apartment.checkInTime || '15:00');
  const [checkOutTime, setCheckOutTime] = useState(apartment.checkOutTime || '11:00');

  // Status & Visibility
  const [featured, setFeatured] = useState(apartment.featured);

  // Media (Images & Videos)
  const [images, setImages] = useState<string[]>(apartment.images || []);
  const [videoUrl, setVideoUrl] = useState<string>(
    apartment.videoUrl || (apartment.videos && apartment.videos[0]) || ''
  );
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isProcessingMedia, setIsProcessingMedia] = useState(false);
  const [mediaNotice, setMediaNotice] = useState<string | null>(null);

  // Amenities & Rules
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(apartment.amenities || []);
  const [customAmenity, setCustomAmenity] = useState('');
  const [houseRules, setHouseRules] = useState<string[]>(
    apartment.houseRules || ['Strictly respectful noise hours 22:00 - 08:00', 'No unauthorized parties or commercial shoots', 'No smoking indoors']
  );
  const [customRule, setCustomRule] = useState('');

  // Host Details
  const [hostName, setHostName] = useState(apartment.host?.name || 'Eleanor Vance');
  const [isSuperhost, setIsSuperhost] = useState(apartment.host?.superhost ?? true);
  const [responseRate, setResponseRate] = useState(apartment.host?.responseRate || '100%');

  // Error & Status
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Active rate preview in current currency
  const convertedRate = () => {
    const rate = CURRENCY_RATES[currentCurrency]?.rate || 1;
    const usd = parseFloat(priceUSD) || 0;
    return Math.round(usd * rate);
  };

  // Handle uploading photos
  const handlePhotoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessingMedia(true);
    setMediaNotice('Compressing and optimizing photos...');

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        const compressed = await compressImageFile(file);
        newUrls.push(compressed);
      }

      if (newUrls.length > 0) {
        setImages((prev) => [...prev, ...newUrls]);
        setMediaNotice(`Added ${newUrls.length} photo${newUrls.length > 1 ? 's' : ''} to residence gallery.`);
      }
    } catch (err) {
      console.error(err);
      setMediaNotice('Error uploading image.');
    } finally {
      setIsProcessingMedia(false);
      setTimeout(() => setMediaNotice(null), 3500);
    }
  };

  // Handle uploading video
  const handleVideoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('video/')) {
      setMediaNotice('Please select a valid video file (MP4, WebM, MOV).');
      return;
    }

    setIsProcessingMedia(true);
    setMediaNotice('Reading and preparing video tour...');

    try {
      const vidDataUrl = await readVideoFile(file);
      setVideoUrl(vidDataUrl);
      setMediaNotice(`Video walkthrough "${file.name}" loaded successfully.`);
    } catch (err) {
      console.error(err);
      setMediaNotice('Failed to process video file.');
    } finally {
      setIsProcessingMedia(false);
      setTimeout(() => setMediaNotice(null), 3500);
    }
  };

  // Add custom photo URL
  const handleAddCustomImageUrl = () => {
    if (!customImageUrl.trim()) return;
    setImages((prev) => [...prev, customImageUrl.trim()]);
    setCustomImageUrl('');
    setMediaNotice('Custom photo URL added to residence gallery.');
    setTimeout(() => setMediaNotice(null), 2500);
  };

  // Make a photo the primary cover (move to index 0)
  const handleSetPrimaryCover = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const target = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [target, ...rest];
    });
    setMediaNotice('Primary cover photo updated.');
    setTimeout(() => setMediaNotice(null), 2000);
  };

  // Remove a photo
  const handleRemovePhoto = (index: number) => {
    if (images.length <= 1) {
      setMediaNotice('A residence must have at least one cover image.');
      setTimeout(() => setMediaNotice(null), 3000);
      return;
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Toggle amenity
  const handleToggleAmenity = (item: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  // Add custom amenity
  const handleAddCustomAmenity = () => {
    if (!customAmenity.trim()) return;
    if (!selectedAmenities.includes(customAmenity.trim())) {
      setSelectedAmenities((prev) => [...prev, customAmenity.trim()]);
    }
    setCustomAmenity('');
  };

  // Add custom rule
  const handleAddCustomRule = () => {
    if (!customRule.trim()) return;
    setHouseRules((prev) => [...prev, customRule.trim()]);
    setCustomRule('');
  };

  // Remove rule
  const handleRemoveRule = (index: number) => {
    setHouseRules((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit & Save Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please provide a title for the residence.');
      setActiveTab('details');
      return;
    }
    const parsedPrice = parseFloat(priceUSD);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setErrorMessage('Please enter a valid nightly rate greater than 0.');
      setActiveTab('pricing');
      return;
    }
    if (images.length === 0) {
      setErrorMessage('Please ensure at least one photo is in the residence gallery.');
      setActiveTab('media');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    const updatedApartment: Apartment = {
      ...apartment,
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      propertyType: propertyType.trim(),
      city: city.trim(),
      country: country.trim(),
      neighborhood: neighborhood.trim(),
      coordinates: {
        lat: parseFloat(lat) || apartment.coordinates.lat,
        lng: parseFloat(lng) || apartment.coordinates.lng,
      },
      pricePerNight: Math.round(parsedPrice),
      cleaningFee: Number(cleaningFee) || 0,
      serviceFeePercent: Number(serviceFeePercent) || 8,
      taxesPercent: Number(taxesPercent) || 5,
      bedrooms: Number(bedrooms) || 1,
      bathrooms: Number(bathrooms) || 1,
      maxGuests: Number(maxGuests) || 1,
      sqft: Number(sqft) || 500,
      checkInTime: checkInTime.trim(),
      checkOutTime: checkOutTime.trim(),
      featured,
      images,
      videoUrl: videoUrl.trim() ? videoUrl.trim() : undefined,
      videos: videoUrl.trim() ? [videoUrl.trim()] : undefined,
      amenities: selectedAmenities,
      houseRules,
      host: {
        ...apartment.host,
        name: hostName.trim() || apartment.host.name,
        superhost: isSuperhost,
        responseRate: responseRate.trim() || '100%',
      },
    };

    onSave(updatedApartment);
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200/80 px-6 py-4 bg-zinc-50/70">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-xs">
              <Building className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-zinc-950">
                  Edit Residence & Room Inventory
                </h2>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-900 border border-amber-200">
                  ID: {apartment.id}
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Update nightly rates, room capacity, photography, video walkthroughs, and calendar policies.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors cursor-pointer"
            aria-label="Close edit modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-200 bg-white px-6 overflow-x-auto scrollbar-none gap-2 sm:gap-6 text-xs font-semibold">
          {[
            { id: 'details', label: '1. Basic Info & Location', icon: Building },
            { id: 'pricing', label: '2. Nightly Rates & Fees', icon: Coins },
            { id: 'specs', label: '3. Layout & Capacity', icon: Bed },
            { id: 'media', label: `4. Media (${images.length} photos${videoUrl ? ', 1 video' : ''})`, icon: ImageIcon },
            { id: 'amenities', label: '5. Amenities & Rules', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 py-3 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-zinc-950 text-zinc-950 font-bold'
                    : 'border-transparent text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-amber-600' : 'text-zinc-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Notification / Error Banner */}
        {errorMessage && (
          <div className="mx-6 mt-4 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 font-medium">
            {errorMessage}
          </div>
        )}

        {mediaNotice && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-xs text-amber-900">
            {isProcessingMedia ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-700 shrink-0" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 text-amber-700 shrink-0" />
            )}
            <span>{mediaNotice}</span>
          </div>
        )}

        {/* Form Body */}
        <form id="edit-residence-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: BASIC INFO & LOCATION */}
          {activeTab === 'details' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-800 mb-1">
                    Residence Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. The Skyview Penthouse & Terrace"
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-900 focus:border-zinc-950 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1">
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-zinc-900 focus:border-zinc-950 focus:outline-none"
                  >
                    <option value="Penthouse">Penthouse</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Suite">Suite</option>
                    <option value="Villa">Villa</option>
                    <option value="Loft">Loft</option>
                    <option value="Duplex">Duplex</option>
                    <option value="Studio">Studio</option>
                    <option value="Historic Maison">Historic Maison</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Subtitle / Architectural Hook
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Private rooftop pavilion with panoramic London skyline vistas"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Editorial Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe architectural highlights, interior materials, neighborhood context..."
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Geographic Details */}
              <div className="pt-2 border-t border-zinc-100">
                <h4 className="text-xs font-bold text-zinc-900 mb-3 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Geographic Location & Neighborhood</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-700 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 px-3 py-1.5 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-zinc-700 mb-1">Country</label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 px-3 py-1.5 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-zinc-700 mb-1">Neighborhood</label>
                    <input
                      type="text"
                      required
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 px-3 py-1.5 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-700 mb-1">Latitude</label>
                    <input
                      type="text"
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      placeholder="e.g. 51.5074"
                      className="w-full rounded-lg border border-zinc-300 px-3 py-1.5 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-700 mb-1">Longitude</label>
                    <input
                      type="text"
                      value={lng}
                      onChange={(e) => setLng(e.target.value)}
                      placeholder="e.g. -0.1278"
                      className="w-full rounded-lg border border-zinc-300 px-3 py-1.5 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Status and Featured toggle */}
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-zinc-900">Featured Showcase Status</h4>
                  <p className="text-[11px] text-zinc-500">
                    Featured properties are highlighted with gold badges in the residences catalog.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: NIGHTLY RATES & FINANCIALS */}
          {activeTab === 'pricing' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="rounded-xl bg-amber-50/70 border border-amber-200/80 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-amber-900">
                      Nightly Rate ({currentCurrency === 'USD' ? 'USD Standard' : `${currInfo.label} · ${currentCurrency}`})
                    </span>
                    <p className="text-[11px] text-amber-700">
                      Set nightly rate in {currentCurrency} or USD. Active rates are automatically synchronized.
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-xs font-bold text-zinc-900">Active Rate Display:</span>
                    <div className="text-base font-serif font-bold text-amber-900">
                      {formatPrice(parseFloat(priceUSD) || 0, currentCurrency)} / night
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-800 mb-1">
                      Rate in {currentCurrency} ({currSymbol})
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs font-bold text-zinc-500">{currSymbol}</span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        required
                        value={activePrice}
                        onChange={(e) => handleActivePriceChange(e.target.value)}
                        className="w-full rounded-lg border border-zinc-300 bg-white pl-8 pr-3 py-2 text-sm font-bold text-zinc-900 focus:border-zinc-950 focus:outline-none tabular-nums"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-800 mb-1">
                      Base USD Equivalent ($)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs font-bold text-zinc-500">$</span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        required
                        value={priceUSD}
                        onChange={(e) => {
                          setPriceUSD(e.target.value);
                          const parsed = parseFloat(e.target.value) || 0;
                          setActivePrice(String(Math.round(parsed * currRate)));
                        }}
                        className="w-full rounded-lg border border-zinc-300 bg-zinc-50 pl-8 pr-3 py-2 text-sm font-bold text-zinc-900 focus:border-zinc-950 focus:outline-none tabular-nums"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cleaning & Additional Surcharges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1">
                    Cleaning Fee ({currSymbol})
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-bold text-zinc-500">{currSymbol}</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={cleaningFeeActive}
                      onChange={(e) => handleCleaningFeeChange(e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3 pl-8 py-2 text-xs font-medium text-zinc-900 focus:border-zinc-950 focus:outline-none tabular-nums"
                    />
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-1 block">
                    Equivalent: {formatPrice(cleaningFee, currentCurrency)}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1">
                    Service Fee (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    step="0.5"
                    value={serviceFeePercent}
                    onChange={(e) => setServiceFeePercent(Number(e.target.value))}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-900 focus:border-zinc-950 focus:outline-none tabular-nums"
                  />
                  <span className="text-[10px] text-zinc-400 mt-1 block">Platform concierge standard: 8%</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1">
                    Local Occupancy Tax (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    step="0.5"
                    value={taxesPercent}
                    onChange={(e) => setTaxesPercent(Number(e.target.value))}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-900 focus:border-zinc-950 focus:outline-none tabular-nums"
                  />
                  <span className="text-[10px] text-zinc-400 mt-1 block">Municipal / VAT tax: 5%</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LAYOUT & CAPACITY SPECS */}
          {activeTab === 'specs' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-zinc-200 p-3 bg-zinc-50/50">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800 mb-1.5">
                    <Bed className="h-4 w-4 text-zinc-600" />
                    <span>Bedrooms</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-bold text-zinc-900 focus:border-zinc-950 focus:outline-none"
                  />
                </div>

                <div className="rounded-xl border border-zinc-200 p-3 bg-zinc-50/50">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800 mb-1.5">
                    <Bath className="h-4 w-4 text-zinc-600" />
                    <span>Bathrooms</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    step="0.5"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-bold text-zinc-900 focus:border-zinc-950 focus:outline-none"
                  />
                </div>

                <div className="rounded-xl border border-zinc-200 p-3 bg-zinc-50/50">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800 mb-1.5">
                    <Users className="h-4 w-4 text-zinc-600" />
                    <span>Max Guests</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(Number(e.target.value))}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-bold text-zinc-900 focus:border-zinc-950 focus:outline-none"
                  />
                </div>

                <div className="rounded-xl border border-zinc-200 p-3 bg-zinc-50/50">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800 mb-1.5">
                    <Maximize2 className="h-4 w-4 text-zinc-600" />
                    <span>Area (sqft)</span>
                  </div>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    value={sqft}
                    onChange={(e) => setSqft(Number(e.target.value))}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-bold text-zinc-900 focus:border-zinc-950 focus:outline-none"
                  />
                </div>
              </div>

              {/* Check-in / Check-out timing */}
              <div className="pt-2 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-zinc-500" />
                    <span>Standard Check-in Time</span>
                  </label>
                  <input
                    type="text"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    placeholder="e.g. 15:00"
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-900 focus:border-zinc-950 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-zinc-500" />
                    <span>Standard Check-out Time</span>
                  </label>
                  <input
                    type="text"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                    placeholder="e.g. 11:00"
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-900 focus:border-zinc-950 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MEDIA (PHOTOS & VIDEO UPLOADS) */}
          {activeTab === 'media' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Image Upload Zone */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                      <ImageIcon className="h-4 w-4 text-zinc-700" />
                      <span>Photography Gallery ({images.length} photos)</span>
                    </h4>
                    <p className="text-[11px] text-zinc-500">
                      The first photo is the primary cover image shown on residence cards and search results.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => imageFileInputRef.current?.click()}
                    className="flex items-center gap-1 rounded-lg bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors shadow-2xs cursor-pointer"
                  >
                    <UploadCloud className="h-3.5 w-3.5" />
                    <span>Upload New Photos</span>
                  </button>
                </div>

                {/* Dropzone */}
                <div
                  onClick={() => imageFileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handlePhotoUpload(e.dataTransfer.files);
                  }}
                  className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 hover:border-zinc-950 bg-zinc-50/50 hover:bg-zinc-100/50 p-5 text-center transition-all cursor-pointer"
                >
                  <input
                    ref={imageFileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handlePhotoUpload(e.target.files)}
                  />
                  <UploadCloud className="h-6 w-6 text-zinc-600 mb-1" />
                  <div className="text-xs font-semibold text-zinc-900">
                    Click to browse or drag & drop high-resolution photos
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    Client-side compression automatically protects storage limits
                  </div>
                </div>

                {/* Photos Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className={`relative group rounded-xl overflow-hidden border-2 bg-zinc-100 shadow-2xs ${
                        idx === 0 ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-zinc-200'
                      }`}
                    >
                      <img src={imgUrl} alt={`Photo ${idx + 1}`} className="aspect-4/3 w-full object-cover" />
                      
                      {idx === 0 && (
                        <span className="absolute top-1.5 left-1.5 rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">
                          ★ Primary Cover
                        </span>
                      )}

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryCover(idx)}
                            className="rounded-lg bg-white/90 hover:bg-white px-2 py-1 text-[10px] font-bold text-zinc-950 shadow-sm cursor-pointer"
                          >
                            Set Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="rounded-lg bg-rose-600/90 hover:bg-rose-600 p-1.5 text-white shadow-sm cursor-pointer"
                          title="Delete photo"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Custom Image URL / Preset */}
                <div className="pt-2 flex gap-2">
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="Or paste external image URL (https://images.unsplash.com/...)"
                    className="flex-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomImageUrl}
                    className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 cursor-pointer"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* Video Walkthrough Section */}
              <div className="space-y-3 pt-4 border-t border-zinc-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                      <Film className="h-4 w-4 text-zinc-700" />
                      <span>Video Walkthrough Tour</span>
                    </h4>
                    <p className="text-[11px] text-zinc-500">
                      Showcase a high-resolution video tour or drone walkthrough of the residence.
                    </p>
                  </div>

                  {videoUrl && (
                    <button
                      type="button"
                      onClick={() => setVideoUrl('')}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Remove Video</span>
                    </button>
                  )}
                </div>

                {!videoUrl ? (
                  <div
                    onClick={() => videoFileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleVideoUpload(e.dataTransfer.files);
                    }}
                    className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 hover:border-zinc-950 bg-zinc-50/50 hover:bg-zinc-100/50 p-6 text-center transition-all cursor-pointer"
                  >
                    <input
                      ref={videoFileInputRef}
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime,video/*"
                      className="hidden"
                      onChange={(e) => handleVideoUpload(e.target.files)}
                    />
                    <Film className="h-6 w-6 text-zinc-600 mb-1" />
                    <div className="text-xs font-semibold text-zinc-900">
                      Upload Video Tour (MP4, WebM, MOV)
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      Walkthrough video will be displayed in the guest modal media player
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative aspect-video w-full max-w-lg rounded-xl overflow-hidden bg-black shadow-md border border-zinc-200">
                      <video
                        src={videoUrl}
                        controls
                        playsInline
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* Direct Video URL input */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Or enter direct video tour URL (https://.../tour.mp4)"
                    className="flex-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none"
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: AMENITIES & RULES */}
          {activeTab === 'amenities' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h4 className="text-xs font-bold text-zinc-900 mb-2">
                  Curated Amenities & Facilities ({selectedAmenities.length} selected)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1">
                  {POPULAR_AMENITIES.map((amenity) => {
                    const isSelected = selectedAmenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => handleToggleAmenity(amenity)}
                        className={`flex items-center justify-between rounded-lg border p-2 text-left text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-zinc-950 bg-zinc-950 text-white font-medium shadow-2xs'
                            : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
                        }`}
                      >
                        <span className="truncate pr-2">{amenity}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Amenity Adder */}
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={customAmenity}
                    onChange={(e) => setCustomAmenity(e.target.value)}
                    placeholder="Add custom amenity (e.g. Wine Cellar, Private Chef)"
                    className="flex-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomAmenity();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomAmenity}
                    className="rounded-lg bg-zinc-100 border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-200 cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* House Rules */}
              <div className="pt-3 border-t border-zinc-100">
                <h4 className="text-xs font-bold text-zinc-900 mb-2">
                  House Rules & Guest Standards
                </h4>
                <div className="space-y-1.5 mb-3">
                  {houseRules.map((rule, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-lg bg-zinc-50 border border-zinc-200 px-3 py-1.5 text-xs text-zinc-800">
                      <span>{rule}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRule(idx)}
                        className="text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customRule}
                    onChange={(e) => setCustomRule(e.target.value)}
                    placeholder="Add custom house rule..."
                    className="flex-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomRule();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomRule}
                    className="rounded-lg bg-zinc-100 border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-200 cursor-pointer"
                  >
                    + Add Rule
                  </button>
                </div>
              </div>
            </div>
          )}

        </form>

        {/* Footer with Actions */}
        <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50/80 px-6 py-4">
          <div className="text-xs text-zinc-500">
            Changes are immediately synced to local inventory and live catalog.
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="edit-residence-form"
              disabled={isSaving}
              className="flex items-center gap-1.5 rounded-lg bg-zinc-950 px-5 py-2 text-xs font-bold text-white hover:bg-zinc-800 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5 text-amber-400" />
                  <span>Save Residence Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
