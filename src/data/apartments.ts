import { Apartment } from '../types';

export const INITIAL_APARTMENTS: Apartment[] = [
  {
    id: 'apt-penthouse-mayfair',
    title: 'The Skyview Penthouse & Terrace',
    subtitle: 'Private rooftop pavilion with panoramic city skyline views',
    description: 'An architectural triumph perched high above the prestigious Mayfair district. Featuring double-height floor-to-ceiling glass, bookmatched Italian marble accents, bespoke walnut cabinetry, and a private 600 sqft wraparound garden terrace with open-air fireplace.',
    city: 'London',
    country: 'United Kingdom',
    neighborhood: 'Mayfair',
    coordinates: { lat: 51.5098, lng: -0.1505 },
    pricePerNight: 580,
    currency: 'USD',
    rating: 4.98,
    reviewCount: 38,
    bedrooms: 3,
    bathrooms: 3.5,
    maxGuests: 6,
    sqft: 2200,
    featured: true,
    propertyType: 'Penthouse',
    images: [
      '/src/assets/images/hero_luxury_apartment_1790378080480.jpg',
      '/src/assets/images/apt_scandi_loft_1790378092782.jpg',
      '/src/assets/images/apt_garden_duplex_1790378124347.jpg'
    ],
    amenities: [
      'High-Speed Wi-Fi (1 Gbps)',
      'Private Keyless Elevator',
      'Wraparound Terrace',
      'Private Technogym Fitness Suite',
      'Chef Kitchen with Miele Appliances',
      'EV Car Charging Station',
      '24/7 Concierge Service',
      'Acoustic Soundproofing',
      'Air Conditioning & Climate Control',
      'Nespresso Vertuo Bar'
    ],
    houseRules: [
      'Strictly non-smoking interior',
      'Quiet hours observed 22:00 – 08:00',
      'Events allowed only with prior written host approval',
      'Well-mannered small pets welcomed upon request'
    ],
    checkInTime: '15:00',
    checkOutTime: '11:00',
    cleaningFee: 120,
    serviceFeePercent: 8,
    taxesPercent: 6,
    host: {
      name: 'Eleanor Vance',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80',
      superhost: true,
      responseRate: '100% within 1 hour',
      joinedYear: 2021
    },
    blockedDates: ['2026-10-02', '2026-10-03', '2026-10-04', '2026-10-18', '2026-10-19']
  },
  {
    id: 'apt-scandi-loft',
    title: 'The Industrial Artisan Loft',
    subtitle: 'Warm brick arches, curated mid-century pieces, and open sunroom',
    description: 'Designed for creative minds and tranquil city retreats. This heritage warehouse loft combines exposed historic brickwork with minimalist Nordic woodwork, custom linen upholstery, and a lush indoor green conservatory.',
    city: 'Stockholm',
    country: 'Sweden',
    neighborhood: 'Södermalm',
    coordinates: { lat: 59.3149, lng: 18.0713 },
    pricePerNight: 290,
    currency: 'USD',
    rating: 4.95,
    reviewCount: 52,
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    sqft: 1350,
    featured: true,
    propertyType: 'Loft',
    images: [
      '/src/assets/images/apt_scandi_loft_1790378092782.jpg',
      '/src/assets/images/hero_luxury_apartment_1790378080480.jpg'
    ],
    amenities: [
      'Ergonomic Dual-Monitor Workspace',
      'Bespoke Cast Iron Fireplace',
      'High-Speed Wi-Fi (500 Mbps)',
      'Sonos Multi-Room Audio',
      'Rainfall Shower & Soaking Tub',
      'Full Induction Kitchen',
      'Washer & Dryer In-Unit'
    ],
    houseRules: [
      'Shoes-off interior policy',
      'No commercial photo shoots without permit',
      'Self check-in via smart keypad lock'
    ],
    checkInTime: '15:00',
    checkOutTime: '11:00',
    cleaningFee: 85,
    serviceFeePercent: 8,
    taxesPercent: 5,
    host: {
      name: 'Lars Lindqvist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80',
      superhost: true,
      responseRate: '98% within 2 hours',
      joinedYear: 2020
    },
    blockedDates: ['2026-10-10', '2026-10-11', '2026-10-12']
  },
  {
    id: 'apt-coastal-villa',
    title: 'Villa Azure Cliffside Suite',
    subtitle: 'Dramatic Mediterranean ocean vistas with infinity plunge pool',
    description: 'Carved seamlessly into the cliffs with direct sightlines over crystalline azure waters. Enjoy sun-drenched private stone pergolas, teak sun loungers, handcrafted terracotta tiling, and unforgettable twilight sea breezes.',
    city: 'Nice',
    country: 'France',
    neighborhood: 'Mont Boron',
    coordinates: { lat: 43.6961, lng: 7.2917 },
    pricePerNight: 495,
    currency: 'USD',
    rating: 4.99,
    reviewCount: 44,
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    sqft: 1600,
    featured: true,
    propertyType: 'Villa',
    images: [
      '/src/assets/images/apt_coastal_villa_1790378103266.jpg',
      '/src/assets/images/apt_garden_duplex_1790378124347.jpg'
    ],
    amenities: [
      'Private Heated Plunge Pool',
      'Panoramic Oceanfront Balcony',
      'Cliffside Fitness & Pilates Deck',
      'Gourmet Outdoor Grill',
      'Private Covered Parking',
      'High-Speed Wi-Fi',
      'Beachside Towels & Umbrellas Included',
      'Wine Cooler Pre-stocked'
    ],
    houseRules: [
      'No glassware directly around pool rim',
      'Children must be supervised near ledge rail',
      'Quiet terrace hours after 23:00'
    ],
    checkInTime: '16:00',
    checkOutTime: '10:00',
    cleaningFee: 110,
    serviceFeePercent: 8,
    taxesPercent: 7,
    host: {
      name: 'Camille Delacroix',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&h=160&q=80',
      superhost: true,
      responseRate: '100% within 30 min',
      joinedYear: 2019
    },
    blockedDates: ['2026-10-05', '2026-10-06', '2026-10-07']
  },
  {
    id: 'apt-urban-studio',
    title: 'The Haussmann Parquet Atelier',
    subtitle: 'Classic French molding, marble mantle, and Juliette balcony',
    description: 'A romantic, sunlit haven in the literary quarter of Saint-Germain-des-Prés. Features original 19th-century chevron parquet flooring, brass casement windows opening to the tree-lined boulevard, and carefully curated vintage art.',
    city: 'Paris',
    country: 'France',
    neighborhood: 'Saint-Germain',
    coordinates: { lat: 48.8540, lng: 2.3338 },
    pricePerNight: 260,
    currency: 'USD',
    rating: 4.92,
    reviewCount: 68,
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    sqft: 750,
    featured: false,
    propertyType: 'Studio',
    images: [
      '/src/assets/images/apt_urban_studio_1790378114329.jpg',
      '/src/assets/images/hero_luxury_apartment_1790378080480.jpg'
    ],
    amenities: [
      'Juliette Balcony with Boulevard View',
      'Curated Library of Art & Literature',
      'Espresso Machine with Local Roasts',
      'Ultra-quiet Acoustic Windows',
      'Designer Bouclé Armchairs',
      'High-Speed Wi-Fi',
      'Luxury Organic Linens'
    ],
    houseRules: [
      'Strictly single or couple occupancy (max 2)',
      'No parties or excessive foot traffic in hall',
      'Keys must be returned to secure keybox'
    ],
    checkInTime: '14:00',
    checkOutTime: '11:00',
    cleaningFee: 65,
    serviceFeePercent: 8,
    taxesPercent: 5,
    host: {
      name: 'Henri Marchand',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80',
      superhost: true,
      responseRate: '95% within 1 hour',
      joinedYear: 2022
    },
    blockedDates: ['2026-10-14', '2026-10-15', '2026-10-16']
  },
  {
    id: 'apt-garden-duplex',
    title: 'The Botanica Zen Duplex',
    subtitle: 'Secluded courtyard garden with Japanese maple and polished concrete',
    description: 'An architectural oasis in the bustling heart of Shibuya. Sliding glass panels dissolve the boundary between an expansive concrete-floored living salon and an intimate courtyard garden featuring stone lanterns and trickling bamboo fountain.',
    city: 'Tokyo',
    country: 'Japan',
    neighborhood: 'Daikanyama',
    coordinates: { lat: 35.6506, lng: 139.7040 },
    pricePerNight: 390,
    currency: 'USD',
    rating: 4.97,
    reviewCount: 41,
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    sqft: 1400,
    featured: false,
    propertyType: 'Duplex',
    images: [
      '/src/assets/images/apt_garden_duplex_1790378124347.jpg',
      '/src/assets/images/apt_scandi_loft_1790378092782.jpg'
    ],
    amenities: [
      'Private Landscaped Zen Garden',
      'Deep Hinoki Cedar Soaking Tub',
      'Heated Tatami Meditation Room',
      'Smart Home Lighting & Climate Controls',
      'High-Speed Wi-Fi (1 Gbps)',
      'Tea Ceremony Set & Matcha Bar',
      'Secure Smart Intercom'
    ],
    houseRules: [
      'Please remove shoes in Genkan entryway',
      'Keep garden gate securely latched',
      'No smoking anywhere on premises including garden'
    ],
    checkInTime: '15:00',
    checkOutTime: '10:00',
    cleaningFee: 90,
    serviceFeePercent: 8,
    taxesPercent: 6,
    host: {
      name: 'Kenji Takahashi',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=160&h=160&q=80',
      superhost: true,
      responseRate: '100% within 15 min',
      joinedYear: 2020
    },
    blockedDates: ['2026-10-21', '2026-10-22', '2026-10-23']
  },
  {
    id: 'apt-cantonments-accra',
    title: 'The Cantonments Presidential Sky Villa',
    subtitle: 'Private plunge pool, 24/7 solar standby power, and lush tropical rooftop terrace',
    description: 'An oasis of contemporary West African luxury in prestigious Cantonments, Accra. Features open-plan Italian marble living spaces, floor-to-ceiling tinted UV glass, private rooftop lap plunge pool, backup solar inverter with 24/7 silent power, and bespoke handcrafted teak furniture by local Ghanaian artisans.',
    city: 'Accra',
    country: 'Ghana',
    neighborhood: 'Cantonments',
    coordinates: { lat: 5.5840, lng: -0.1770 },
    pricePerNight: 340,
    currency: 'GHS',
    rating: 4.99,
    reviewCount: 36,
    bedrooms: 3,
    bathrooms: 3.5,
    maxGuests: 6,
    sqft: 2400,
    featured: true,
    propertyType: 'Villa',
    images: [
      '/src/assets/images/hero_luxury_apartment_1790378080480.jpg',
      '/src/assets/images/apt_coastal_villa_1790378103266.jpg',
      '/src/assets/images/apt_garden_duplex_1790378124347.jpg'
    ],
    amenities: [
      '24/7 Solar & Silent Generator Power Backup',
      'Private Rooftop Plunge Pool',
      'Private Rooftop Technogym & Fitness Studio',
      '24/7 Uniformed Security & Concierge',
      'High-Speed Fiber Internet (500 Mbps)',
      'Chef Kitchen with Quartz Island',
      'Gated Covered Executive Parking',
      'Air Conditioning in All Rooms',
      'Washer & Dryer In-Unit',
      'Smart Intercom & Keyless Entry',
      'Complimentary Airport Chauffeur'
    ],
    houseRules: [
      'Respectful noise levels after 22:00',
      'Registered guests only unless prior concierge clearance',
      'Non-smoking inside residences'
    ],
    checkInTime: '14:00',
    checkOutTime: '11:00',
    cleaningFee: 95,
    serviceFeePercent: 8,
    taxesPercent: 5,
    host: {
      name: 'Kwame Mensah',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80',
      superhost: true,
      responseRate: '100% within 10 min',
      joinedYear: 2021
    },
    blockedDates: ['2026-10-15', '2026-10-16']
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    apartmentId: 'apt-penthouse-mayfair',
    authorName: 'Charlotte Sterling',
    authorCountry: 'United States',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    categories: {
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      location: 5,
      checkIn: 5,
      value: 5
    },
    date: 'September 2026',
    comment: 'The Mayfair Penthouse exceeded every possible expectation. Watching the sunset over Hyde Park from the private terrace with a glass of champagne was the highlight of our London trip. Spotless, whisper-quiet, and Eleanor is a world-class host.',
    verifiedStay: true,
    hostReply: {
      author: 'Eleanor Vance',
      date: 'September 2026',
      text: 'Thank you Charlotte! You and your family were exceptional guests. We look forward to welcoming you back to London soon.'
    }
  },
  {
    id: 'rev-2',
    apartmentId: 'apt-penthouse-mayfair',
    authorName: 'Julian Moreau',
    authorCountry: 'Switzerland',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    categories: {
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      location: 5,
      checkIn: 5,
      value: 4.8
    },
    date: 'August 2026',
    comment: 'Exquisite architectural finish. As an architect, I rarely find rental properties where every junction, light fixture, and material is executed with such discipline. Flawless 10-day stay.',
    verifiedStay: true
  },
  {
    id: 'rev-3',
    apartmentId: 'apt-scandi-loft',
    authorName: 'Maja Lindgren',
    authorCountry: 'Germany',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    categories: {
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      location: 5,
      checkIn: 5,
      value: 5
    },
    date: 'September 2026',
    comment: 'Södermalm is the coolest neighborhood in Stockholm, and this loft was pure perfection. Super fast Wi-Fi for remote work, and the cast iron fireplace made chilly autumn evenings magical.',
    verifiedStay: true
  },
  {
    id: 'rev-4',
    apartmentId: 'apt-coastal-villa',
    authorName: 'David & Sofia Rossi',
    authorCountry: 'Italy',
    authorAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    categories: {
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      location: 5,
      checkIn: 5,
      value: 5
    },
    date: 'August 2026',
    comment: 'The pictures do not do justice to that plunge pool terrace. The Mediterranean sparkles right below your feet. Camille gave us the best local bistro recommendations away from the tourist crowd.',
    verifiedStay: true
  },
  {
    id: 'rev-5',
    apartmentId: 'apt-cantonments-accra',
    authorName: 'Nana Osei-Tutu',
    authorCountry: 'Ghana',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    categories: {
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      location: 5,
      checkIn: 5,
      value: 5
    },
    date: 'September 2026',
    comment: 'Superb residence in Cantonments. The 24/7 backup power was rock-solid, pool was crystal clear, and the views from the sky terrace were stunning. Kwame is a quintessential host. Highly recommended for anyone visiting Accra!',
    verifiedStay: true,
    hostReply: {
      author: 'Kwame Mensah',
      date: 'September 2026',
      text: 'Medaase pa ara Nana! It was our pleasure hosting you. You are always welcome back to your Accra home.'
    }
  },
  {
    id: 'rev-6',
    apartmentId: 'apt-urban-studio',
    authorName: 'Elena Rostova',
    authorCountry: 'France',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    categories: {
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      location: 5,
      checkIn: 5,
      value: 5
    },
    date: 'September 2026',
    comment: 'A true sanctuary in Montmartre. Floor-to-ceiling atelier light, completely silent courtyard at night, and lightning-fast fiber internet for uploading heavy Figma files. Jean-Luc prepared custom espresso beans and local patisserie on arrival. Will return every Paris fashion week.',
    verifiedStay: true,
    hostReply: {
      author: 'Jean-Luc Moreau',
      date: 'September 2026',
      text: 'Merci beaucoup Elena! You treated the studio with such grace. Our door is always open for your next creative residency.'
    }
  },
  {
    id: 'rev-7',
    apartmentId: 'apt-garden-duplex',
    authorName: 'Kenji & Sarah Takahashi',
    authorCountry: 'Japan',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    categories: {
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      location: 5,
      checkIn: 5,
      value: 5
    },
    date: 'August 2026',
    comment: 'The private bamboo courtyard garden and Hinoki cedar soaking tub after walking through Gion felt meditative. Immaculate woodwork, tatami fragrance, and modern Japanese luxury at its finest. Master craftsman level detail throughout.',
    verifiedStay: true,
    hostReply: {
      author: 'Kenzo & Aoi Sato',
      date: 'August 2026',
      text: 'Arigato gozaimasu Kenji and Sarah. We are honored that our family garden provided you peace and tranquility in Kyoto.'
    }
  },
  {
    id: 'rev-8',
    apartmentId: 'apt-penthouse-mayfair',
    authorName: 'Lord Alistair Sterling',
    authorCountry: 'United Kingdom',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    categories: {
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      location: 5,
      checkIn: 5,
      value: 4.9
    },
    date: 'August 2026',
    comment: 'Keyless private lift opening straight into the residence is unbeatable for privacy. The Miele appliances and wine refrigeration made private hosting effortless. 24/7 concierge took care of every theatre ticket and chauffeur request.',
    verifiedStay: true
  },
  {
    id: 'rev-9',
    apartmentId: 'apt-coastal-villa',
    authorName: 'Astrid & Freja Lind',
    authorCountry: 'Denmark',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    categories: {
      cleanliness: 5,
      accuracy: 5,
      communication: 5,
      location: 5,
      checkIn: 5,
      value: 5
    },
    date: 'July 2026',
    comment: 'Floating above the Mediterranean in the heated infinity plunge pool while the sun sets behind Cap Ferrat is an experience we will cherish forever. Silent, private, and breathtakingly curated.',
    verifiedStay: true
  }
];
