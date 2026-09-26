import React, { useState, useRef } from 'react';
import {
  X,
  Building,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Users,
  Maximize2,
  Check,
  Sparkles,
  Plus,
  Image as ImageIcon,
  Shield,
  Clock,
  Sparkle,
  UploadCloud,
  Film,
  Trash2,
  Loader2,
  FileVideo,
} from 'lucide-react';
import { Apartment, Currency, Language } from '../types';
import { CURRENCY_RATES, formatPrice } from '../services/storage';
import { compressImageFile, readVideoFile, formatFileSize } from '../utils/mediaUpload';

interface AddRoomModalProps {
  currentCurrency: Currency;
  currentLang: Language;
  onClose: () => void;
  onAddApartment: (newApt: Apartment) => void;
}

const PRESET_ROOMS = [
  {
    title: 'The Labone Garden Penthouse',
    subtitle: 'Rooftop plunge pool with private canopy bar & lush tropical flora',
    description: 'An architectural statement residence located in the serene residential enclave of Labone, Accra. Features private dual-level elevator, custom bespoke mahogany woodwork, floor-to-ceiling panoramic glass, 24/7 solar power backup, and an expansive rooftop terrace overlooking the city.',
    city: 'Accra',
    country: 'Ghana',
    neighborhood: 'Labone',
    coordinates: { lat: 5.5684, lng: -0.1712 },
    pricePerNightUSD: 280,
    bedrooms: 2,
    bathrooms: 2.5,
    maxGuests: 4,
    sqft: 1850,
    cleaningFee: 80,
    imageIndex: 0,
    amenities: [
      '24/7 Solar & Standby Generator Power',
      'Private Rooftop Plunge Pool',
      '24/7 Uniformed Security',
      'High-Speed Fiber Wi-Fi (500 Mbps)',
      'Chef Kitchen with Breakfast Bar',
      'Air Conditioning & Climate Control',
      'Covered Executive Parking',
      'Washer & Dryer In-Unit'
    ]
  },
  {
    title: 'Airport Hills Executive Villa',
    subtitle: 'Gated private estate with private lap pool and landscaped courtyard',
    description: 'Premier diplomacy-grade estate in Airport Hills, Accra. Complete with double-volume ceilings, imported European sanitaryware, standby generator, private lap pool, chef kitchen, and private security post.',
    city: 'Accra',
    country: 'Ghana',
    neighborhood: 'Airport Hills',
    coordinates: { lat: 5.6120, lng: -0.1420 },
    pricePerNightUSD: 450,
    bedrooms: 4,
    bathrooms: 4.5,
    maxGuests: 8,
    sqft: 3500,
    cleaningFee: 120,
    imageIndex: 2,
    amenities: [
      '24/7 Dual Standby Generator & Inverter',
      'Private Full-Size Swimming Pool',
      'Armed Security & Controlled Guardhouse',
      'High-Speed Wi-Fi',
      'Full Gourmet Kitchen',
      'Air Conditioning in All En-Suites',
      'Double Automated Garage',
      'Dedicated Chauffeur Quarters'
    ]
  },
  {
    title: 'The Knightsbridge Private Residence',
    subtitle: 'Stately Victorian terrace opposite Hyde Park with private garden',
    description: 'A classic London townhouse with herringbone parquet, high corniced ceilings, marble fireplaces, and bespoke Bulthaup kitchen overlooking a private manicured garden.',
    city: 'London',
    country: 'United Kingdom',
    neighborhood: 'Knightsbridge',
    coordinates: { lat: 51.5014, lng: -0.1607 },
    pricePerNightUSD: 520,
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 6,
    sqft: 2100,
    cleaningFee: 110,
    imageIndex: 1,
    amenities: [
      'High-Speed Wi-Fi (1 Gbps)',
      'Private Landscaped Garden',
      '24/7 Concierge Service',
      'Bulthaup Kitchen',
      'Air Conditioning & Heating',
      'Dedicated Home Office',
      'Underground Private Parking'
    ]
  }
];

const AVAILABLE_IMAGES = [
  '/src/assets/images/hero_luxury_apartment_1790378080480.jpg',
  '/src/assets/images/apt_scandi_loft_1790378092782.jpg',
  '/src/assets/images/apt_coastal_villa_1790378103266.jpg',
  '/src/assets/images/apt_urban_studio_1790378114329.jpg',
  '/src/assets/images/apt_garden_duplex_1790378124347.jpg'
];

const POPULAR_AMENITIES = [
  '24/7 Solar & Standby Generator Power',
  'High-Speed Fiber Wi-Fi',
  'Private Swimming Pool / Plunge Pool',
  'Air Conditioning & Climate Control',
  '24/7 Uniformed Security & Concierge',
  'Chef Kitchen with Modern Appliances',
  'Private Balcony or Rooftop Terrace',
  'Dedicated Workspace / Desk',
  'Gated Secure Parking',
  'In-Unit Washer & Dryer',
  'Smart TV & Sound System',
  'Keyless Smart Lock Entry'
];

export const AddRoomModal: React.FC<AddRoomModalProps> = ({
  currentCurrency,
  onClose,
  onAddApartment
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('Accra');
  const [country, setCountry] = useState('Ghana');
  const [neighborhood, setNeighborhood] = useState('Cantonments');
  const [lat, setLat] = useState('5.5840');
  const [lng, setLng] = useState('-0.1770');
  const [priceUSD, setPriceUSD] = useState('280');
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [maxGuests, setMaxGuests] = useState(4);
  const [sqft, setSqft] = useState(1600);
  const [cleaningFee, setCleaningFee] = useState(80);
  const [selectedImage, setSelectedImage] = useState(AVAILABLE_IMAGES[0]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    '24/7 Solar & Standby Generator Power',
    'High-Speed Fiber Wi-Fi',
    'Air Conditioning & Climate Control',
    '24/7 Uniformed Security & Concierge',
    'Gated Secure Parking'
  ]);
  const [hostName, setHostName] = useState('Kwame Mensah');
  const [isSuperhost, setIsSuperhost] = useState(true);
  const [featured, setFeatured] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Media Upload State (Images & Videos)
  const [activeMediaTab, setActiveMediaTab] = useState<'upload_images' | 'upload_video' | 'presets'>('upload_images');
  const [uploadedImages, setUploadedImages] = useState<
    { id: string; url: string; name: string; sizeFormatted: string; isCover: boolean }[]
  >([]);
  const [uploadedVideos, setUploadedVideos] = useState<
    { id: string; url: string; name: string; sizeFormatted: string }[]
  >([]);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [isProcessingMedia, setIsProcessingMedia] = useState(false);
  const [mediaUploadNotice, setMediaUploadNotice] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Image Upload Handler
  const handleImageFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessingMedia(true);
    setMediaUploadNotice('Compressing and optimizing images...');

    try {
      const newItems: { id: string; url: string; name: string; sizeFormatted: string; isCover: boolean }[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        const compressedUrl = await compressImageFile(file);
        newItems.push({
          id: `img-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 5)}`,
          url: compressedUrl,
          name: file.name,
          sizeFormatted: formatFileSize(file.size),
          isCover: uploadedImages.length === 0 && i === 0,
        });
      }

      if (newItems.length > 0) {
        setUploadedImages((prev) => {
          const hadCover = prev.some((p) => p.isCover);
          if (!hadCover && newItems.length > 0) {
            newItems[0].isCover = true;
          }
          return [...prev, ...newItems];
        });
        setMediaUploadNotice(`Added ${newItems.length} photo${newItems.length > 1 ? 's' : ''} successfully.`);
      }
    } catch (err) {
      console.error(err);
      setMediaUploadNotice('Error processing images. Please try again.');
    } finally {
      setIsProcessingMedia(false);
      setTimeout(() => setMediaUploadNotice(null), 4000);
    }
  };

  // Video Upload Handler
  const handleVideoFile = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('video/')) {
      setMediaUploadNotice('Please select a valid video file (MP4, WebM, MOV).');
      return;
    }

    setIsProcessingMedia(true);
    setMediaUploadNotice('Processing video tour preview...');

    try {
      const videoDataUrl = await readVideoFile(file);
      setUploadedVideos([
        {
          id: `vid-${Date.now()}`,
          url: videoDataUrl,
          name: file.name,
          sizeFormatted: formatFileSize(file.size),
        },
      ]);
      setMediaUploadNotice(`Video tour "${file.name}" loaded successfully.`);
    } catch (err) {
      console.error(err);
      setMediaUploadNotice('Error reading video file.');
    } finally {
      setIsProcessingMedia(false);
      setTimeout(() => setMediaUploadNotice(null), 4000);
    }
  };

  // Set Cover Image
  const setCoverImage = (id: string) => {
    setUploadedImages((prev) =>
      prev.map((img) => ({
        ...img,
        isCover: img.id === id,
      }))
    );
  };

  // Remove Uploaded Image
  const removeUploadedImage = (id: string) => {
    setUploadedImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      if (filtered.length > 0 && !filtered.some((img) => img.isCover)) {
        filtered[0].isCover = true;
      }
      return filtered;
    });
  };

  // Remove Video
  const removeUploadedVideo = () => {
    setUploadedVideos([]);
    setVideoUrlInput('');
  };

  // Quick Preset Loader
  const loadPreset = (presetIndex: number) => {
    const p = PRESET_ROOMS[presetIndex];
    if (!p) return;
    setTitle(p.title);
    setSubtitle(p.subtitle);
    setDescription(p.description);
    setCity(p.city);
    setCountry(p.country);
    setNeighborhood(p.neighborhood);
    setLat(p.coordinates.lat.toString());
    setLng(p.coordinates.lng.toString());
    setPriceUSD(p.pricePerNightUSD.toString());
    setBedrooms(p.bedrooms);
    setBathrooms(p.bathrooms);
    setMaxGuests(p.maxGuests);
    setSqft(p.sqft);
    setCleaningFee(p.cleaningFee);
    setSelectedImage(AVAILABLE_IMAGES[p.imageIndex] || AVAILABLE_IMAGES[0]);
    setSelectedAmenities(p.amenities);
    setValidationError(null);
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError('Please enter a residence title.');
      return;
    }
    if (!city.trim() || !country.trim()) {
      setValidationError('Please specify the city and country.');
      return;
    }

    const priceNum = parseFloat(priceUSD) || 100;
    
    // Determine final photos
    let finalImages: string[] = [];
    if (uploadedImages.length > 0) {
      const cover = uploadedImages.find((img) => img.isCover) || uploadedImages[0];
      const others = uploadedImages.filter((img) => img.id !== cover.id);
      finalImages = [cover.url, ...others.map((o) => o.url)];
      if (finalImages.length === 1) {
        finalImages.push(AVAILABLE_IMAGES[1], AVAILABLE_IMAGES[2]);
      } else if (finalImages.length === 2) {
        finalImages.push(AVAILABLE_IMAGES[2]);
      }
    } else if (customImageUrl.trim()) {
      finalImages = [customImageUrl.trim(), AVAILABLE_IMAGES[1], AVAILABLE_IMAGES[2]];
    } else {
      finalImages = [selectedImage, AVAILABLE_IMAGES[1], AVAILABLE_IMAGES[2]];
    }

    // Determine final video
    const finalVideos: string[] = uploadedVideos.map((v) => v.url);
    if (videoUrlInput.trim() && !finalVideos.includes(videoUrlInput.trim())) {
      finalVideos.push(videoUrlInput.trim());
    }
    const finalVideoUrl = finalVideos[0] || (videoUrlInput.trim() ? videoUrlInput.trim() : undefined);

    const newApartment: Apartment = {
      id: `apt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      subtitle: subtitle.trim() || `${bedrooms} Bedroom Architectural Suite in ${city}`,
      description: description.trim() || 'Exquisite luxury residence crafted for discerning guests.',
      city: city.trim(),
      country: country.trim(),
      neighborhood: neighborhood.trim() || city.trim(),
      coordinates: {
        lat: parseFloat(lat) || 5.584,
        lng: parseFloat(lng) || -0.177
      },
      pricePerNight: priceNum,
      currency: country.toLowerCase().includes('ghana') ? 'GHS' : 'USD',
      rating: 5.0,
      reviewCount: 0,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      maxGuests: Number(maxGuests),
      sqft: Number(sqft),
      featured: featured,
      images: finalImages,
      videos: finalVideos.length > 0 ? finalVideos : undefined,
      videoUrl: finalVideoUrl,
      amenities: selectedAmenities.length > 0 ? selectedAmenities : ['High-Speed Wi-Fi', 'Air Conditioning'],
      houseRules: [
        'Strictly respectful noise hours 22:00 - 08:00',
        'Registered guests only unless cleared by concierge',
        'Non-smoking interior'
      ],
      checkInTime: '15:00',
      checkOutTime: '11:00',
      cleaningFee: Number(cleaningFee),
      serviceFeePercent: 8,
      taxesPercent: country.toLowerCase().includes('ghana') ? 5 : 6,
      host: {
        name: hostName.trim() || 'Residence Host',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80',
        superhost: isSuperhost,
        responseRate: '100% within 15 min',
        joinedYear: 2024
      },
      blockedDates: []
    };

    onAddApartment(newApartment);
    onClose();
  };

  const parsedPrice = parseFloat(priceUSD) || 0;
  const ghsEquivalent = Math.round(parsedPrice * (CURRENCY_RATES.GHS?.rate || 15.5));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-room-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-zinc-950/70 p-4 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-zinc-200">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white/95 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-zinc-900 p-2 text-white">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h2 id="add-room-title" className="font-serif text-xl font-bold text-zinc-950">
                Add New Room / Residence
              </h2>
              <p className="text-xs text-zinc-500">
                Publish a new luxury apartment or suite with real-time calendar availability.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs text-zinc-700">
          {/* Quick Presets Bar */}
          <div className="rounded-xl bg-amber-50/70 border border-amber-200/80 p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-amber-900 text-xs">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <span>1-Click Presets for Fast Testing</span>
            </div>
            <p className="text-[11px] text-amber-800">
              Click any preset to prefill realistic luxury property details (including Ghana and UK properties):
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {PRESET_ROOMS.map((preset, idx) => (
                <button
                  key={preset.title}
                  type="button"
                  onClick={() => loadPreset(idx)}
                  className="rounded-lg bg-white border border-amber-300 px-3 py-1.5 font-medium text-amber-950 hover:bg-amber-100/60 shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>{preset.country === 'Ghana' ? '🇬🇭' : '🇬🇧'}</span>
                  <span>{preset.title}</span>
                  <span className="text-[10px] text-zinc-500">(${preset.pricePerNightUSD}/nt)</span>
                </button>
              ))}
            </div>
          </div>

          {validationError && (
            <div className="rounded-lg bg-rose-50 p-3 text-rose-700 border border-rose-200 font-medium">
              {validationError}
            </div>
          )}

          {/* Section 1: Title & Tagline */}
          <div className="space-y-4">
            <h3 className="font-semibold text-zinc-950 text-sm flex items-center gap-1.5">
              <span>1. Residence Details</span>
            </h3>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">
                Residence / Room Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Cantonments Executive Sky Villa"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-950 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">
                Subtitle / Architectural Tagline
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Private plunge pool with panoramic city views and 24/7 standby power"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-950 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 mb-1">
                Full Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the architectural design, luxury finishes, living spaces, and comfort..."
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-950 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: Location & Neighborhood */}
          <div className="space-y-4 border-t border-zinc-100 pt-4">
            <h3 className="font-semibold text-zinc-950 text-sm flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-zinc-600" />
              <span>2. Location & Geographic Positioning</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-zinc-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Accra"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">Country *</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Ghana"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">Neighborhood</label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="e.g. Cantonments / Labone"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-950 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px] text-zinc-500">
              <div>
                <label className="block font-medium text-zinc-700 mb-1">Map Latitude</label>
                <input
                  type="text"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder="5.5840"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-1.5 text-zinc-900 font-mono focus:border-zinc-950 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-zinc-700 mb-1">Map Longitude</label>
                <input
                  type="text"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  placeholder="-0.1770"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-1.5 text-zinc-900 font-mono focus:border-zinc-950 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Pricing & Ghana Cedis Converter */}
          <div className="space-y-4 border-t border-zinc-100 pt-4">
            <h3 className="font-semibold text-zinc-950 text-sm flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              <span>3. Pricing & Currency Conversion</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-zinc-700 mb-1">
                  Base Nightly Rate (USD Equivalent) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-zinc-500 font-semibold">$</span>
                  <input
                    type="number"
                    min="20"
                    step="5"
                    required
                    value={priceUSD}
                    onChange={(e) => setPriceUSD(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 pl-8 pr-3 py-2 text-zinc-900 font-semibold focus:border-zinc-950 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">
                  Cleaning Fee (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-zinc-500 font-semibold">$</span>
                  <input
                    type="number"
                    min="0"
                    value={cleaningFee}
                    onChange={(e) => setCleaningFee(Number(e.target.value))}
                    className="w-full rounded-lg border border-zinc-300 pl-8 pr-3 py-2 text-zinc-900 focus:border-zinc-950 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Live Ghana Cedis & Active Currency Conversion Card */}
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
                  Live Converted Rates for Guests
                </span>
                <div className="font-serif text-lg font-bold text-emerald-950 mt-0.5">
                  GH₵ {ghsEquivalent.toLocaleString()} <span className="text-xs font-normal text-emerald-800">Ghana Cedis / night</span>
                </div>
                <div className="text-[11px] text-emerald-700">
                  Current active site currency: <span className="font-semibold">{formatPrice(parsedPrice, currentCurrency)}</span> / night
                </div>
              </div>
              <span className="self-start sm:self-center rounded-md bg-white px-2.5 py-1 text-[11px] font-semibold text-emerald-800 border border-emerald-200">
                Rate: 1 USD = 15.5 GHS
              </span>
            </div>
          </div>

          {/* Section 4: Specifications & Capacity */}
          <div className="space-y-4 border-t border-zinc-100 pt-4">
            <h3 className="font-semibold text-zinc-950 text-sm flex items-center gap-1.5">
              <span>4. Layout & Capacity Specs</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-medium text-zinc-700 mb-1 flex items-center gap-1">
                  <Bed className="h-3.5 w-3.5 text-zinc-500" /> Bedrooms
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-1.5 text-zinc-900 focus:border-zinc-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1 flex items-center gap-1">
                  <Bath className="h-3.5 w-3.5 text-zinc-500" /> Bathrooms
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  max="12"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-1.5 text-zinc-900 focus:border-zinc-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1 flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-zinc-500" /> Max Guests
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-1.5 text-zinc-900 focus:border-zinc-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1 flex items-center gap-1">
                  <Maximize2 className="h-3.5 w-3.5 text-zinc-500" /> Area (sqft)
                </label>
                <input
                  type="number"
                  min="200"
                  step="50"
                  value={sqft}
                  onChange={(e) => setSqft(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-1.5 text-zinc-900 focus:border-zinc-950 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Photography & Video Showcase */}
          <div className="space-y-4 border-t border-zinc-100 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="font-semibold text-zinc-950 text-sm flex items-center gap-1.5">
                  <UploadCloud className="h-4 w-4 text-zinc-900" />
                  <span>5. Media: Photography & Video Showcase</span>
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Upload high-res photos and video walkthrough tours directly from your device
                </p>
              </div>

              {/* Media Sub-tabs */}
              <div className="flex items-center rounded-lg bg-zinc-100 p-0.5 text-xs font-medium self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('upload_images')}
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition-all cursor-pointer ${
                    activeMediaTab === 'upload_images'
                      ? 'bg-white text-zinc-950 font-bold shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  <span>Photos ({uploadedImages.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMediaTab('upload_video')}
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition-all cursor-pointer ${
                    activeMediaTab === 'upload_video'
                      ? 'bg-white text-zinc-950 font-bold shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <Film className="h-3.5 w-3.5" />
                  <span>Video Tour {uploadedVideos.length > 0 || videoUrlInput ? '✓' : ''}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMediaTab('presets')}
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition-all cursor-pointer ${
                    activeMediaTab === 'presets'
                      ? 'bg-white text-zinc-950 font-bold shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  <span>Presets / URL</span>
                </button>
              </div>
            </div>

            {/* Notification / Processing Banner */}
            {mediaUploadNotice && (
              <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-xs text-amber-900">
                {isProcessingMedia ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-700 shrink-0" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                )}
                <span>{mediaUploadNotice}</span>
              </div>
            )}

            {/* TAB 1: UPLOAD PHOTOS */}
            {activeMediaTab === 'upload_images' && (
              <div className="space-y-4">
                {/* Drag and Drop Zone */}
                <div
                  onClick={() => imageInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleImageFiles(e.dataTransfer.files);
                  }}
                  className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 hover:border-zinc-950 bg-zinc-50/60 hover:bg-zinc-100/60 p-6 text-center transition-all cursor-pointer"
                >
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleImageFiles(e.target.files)}
                  />
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-xs border border-zinc-200 group-hover:scale-105 transition-transform">
                    <UploadCloud className="h-5 w-5 text-zinc-700" />
                  </div>
                  <div className="mt-2.5 text-xs font-semibold text-zinc-900">
                    Click to browse or drag & drop high-resolution photos
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    Supports JPG, PNG, WEBP · Automatic client-side compression · Multiple files allowed
                  </div>
                </div>

                {/* Uploaded Images Preview Grid */}
                {uploadedImages.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-xs font-medium text-zinc-700 mb-2">
                      <span>Uploaded Photos ({uploadedImages.length}) — Click star to set primary cover:</span>
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="text-amber-700 hover:text-amber-900 font-semibold cursor-pointer"
                      >
                        + Add More Photos
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {uploadedImages.map((img) => (
                        <div
                          key={img.id}
                          className={`relative group rounded-xl overflow-hidden border-2 bg-zinc-100 shadow-2xs transition-all ${
                            img.isCover ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-zinc-200'
                          }`}
                        >
                          <img src={img.url} alt={img.name} className="aspect-4/3 w-full object-cover" />
                          
                          {/* Cover badge */}
                          {img.isCover && (
                            <span className="absolute top-1.5 left-1.5 rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-bold text-white shadow-sm flex items-center gap-1">
                              <span>★ Cover</span>
                            </span>
                          )}

                          {/* Hover action bar */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                            {!img.isCover && (
                              <button
                                type="button"
                                onClick={() => setCoverImage(img.id)}
                                className="rounded-lg bg-white/90 hover:bg-white px-2 py-1 text-[10px] font-bold text-zinc-950 shadow-sm cursor-pointer"
                              >
                                Set Cover
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeUploadedImage(img.id)}
                              className="rounded-lg bg-rose-600/90 hover:bg-rose-600 p-1.5 text-white shadow-sm cursor-pointer"
                              title="Delete photo"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="p-1.5 bg-white text-[10px] text-zinc-600 truncate border-t border-zinc-100 flex items-center justify-between">
                            <span className="truncate max-w-[90px]">{img.name}</span>
                            <span className="text-zinc-400 font-mono">{img.sizeFormatted}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: UPLOAD VIDEO TOUR */}
            {activeMediaTab === 'upload_video' && (
              <div className="space-y-4">
                {uploadedVideos.length === 0 && !videoUrlInput ? (
                  <div
                    onClick={() => videoInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleVideoFile(e.dataTransfer.files);
                    }}
                    className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 hover:border-zinc-950 bg-zinc-50/60 hover:bg-zinc-100/60 p-6 text-center transition-all cursor-pointer"
                  >
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime,video/*"
                      className="hidden"
                      onChange={(e) => handleVideoFile(e.target.files)}
                    />
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-xs border border-zinc-200 group-hover:scale-105 transition-transform">
                      <Film className="h-5 w-5 text-zinc-700" />
                    </div>
                    <div className="mt-2.5 text-xs font-semibold text-zinc-900">
                      Upload Video Walkthrough Tour
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      Supports MP4, WebM, MOV · Architectural walkthrough or drone tour
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5">
                        <FileVideo className="h-4 w-4 text-emerald-600" />
                        <span>Active Video Tour Preview</span>
                      </span>
                      <button
                        type="button"
                        onClick={removeUploadedVideo}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Remove Video</span>
                      </button>
                    </div>

                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-md border border-zinc-200">
                      <video
                        src={uploadedVideos[0]?.url || videoUrlInput}
                        controls
                        playsInline
                        className="h-full w-full object-contain"
                      />
                    </div>
                    {uploadedVideos[0] && (
                      <div className="flex items-center justify-between text-[11px] text-zinc-500">
                        <span>File: <strong>{uploadedVideos[0].name}</strong></span>
                        <span>Size: <strong>{uploadedVideos[0].sizeFormatted}</strong></span>
                      </div>
                    )}
                  </div>
                )}

                {/* Video URL Alternative */}
                <div className="pt-2 border-t border-zinc-100">
                  <label className="block font-medium text-zinc-700 text-xs mb-1">
                    Or Enter Direct Video Tour URL (MP4, YouTube, Vimeo)
                  </label>
                  <div className="relative">
                    <Film className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                    <input
                      type="url"
                      value={videoUrlInput}
                      onChange={(e) => setVideoUrlInput(e.target.value)}
                      placeholder="https://assets.example.com/tours/suite-walkthrough.mp4"
                      className="w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PRESETS & CUSTOM URL */}
            {activeMediaTab === 'presets' && (
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-zinc-700 mb-2 text-xs">
                    Select from Curated Architectural Photography Presets:
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {AVAILABLE_IMAGES.map((img, idx) => (
                      <button
                        key={img}
                        type="button"
                        onClick={() => {
                          setSelectedImage(img);
                          setCustomImageUrl('');
                        }}
                        className={`relative aspect-4/3 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          selectedImage === img && !customImageUrl
                            ? 'border-zinc-950 ring-2 ring-zinc-950/20'
                            : 'border-zinc-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                        {selectedImage === img && !customImageUrl && (
                          <span className="absolute bottom-1 right-1 rounded-full bg-zinc-950 text-white p-0.5">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 mb-1 text-xs">
                    Or Provide Custom Image URL
                  </label>
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs text-zinc-900 focus:border-zinc-950 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 6: Key Amenities Checklist */}
          <div className="space-y-3 border-t border-zinc-100 pt-4">
            <h3 className="font-semibold text-zinc-950 text-sm">
              6. Amenities & Standout Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {POPULAR_AMENITIES.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-2 rounded-lg border p-2 text-left transition-all ${
                      isSelected
                        ? 'border-zinc-900 bg-zinc-900 text-white'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded flex items-center justify-center border ${
                        isSelected ? 'border-white bg-white text-zinc-900' : 'border-zinc-300'
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-medium">{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 7: Host & Featured Settings */}
          <div className="space-y-4 border-t border-zinc-100 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-zinc-700 mb-1">Host Name</label>
                <input
                  type="text"
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  placeholder="e.g. Kwame Mensah"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-950 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSuperhost}
                    onChange={(e) => setIsSuperhost(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                  />
                  <span className="font-medium text-zinc-900">Superhost Status</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                  />
                  <span className="font-medium text-zinc-900">Feature on Homepage</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 z-10 -mx-6 -mb-6 flex items-center justify-end gap-3 border-t border-zinc-200 bg-white/95 px-6 py-4 backdrop-blur-md">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-200 px-4 py-2 font-medium text-zinc-700 hover:bg-zinc-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-zinc-950 px-6 py-2 font-semibold text-white hover:bg-zinc-800 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Publish Residence to Inventory</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
