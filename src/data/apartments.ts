import { Apartment, Review } from '../types';

export const INITIAL_APARTMENTS: Apartment[] = [
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
    reviewCount: 48,
    bedrooms: 3,
    bathrooms: 3.5,
    maxGuests: 6,
    sqft: 2400,
    featured: true,
    propertyType: 'Villa',
    images: [
      '/src/assets/images/apt_accra_luxury_1790379220032.jpg',
      '/src/assets/images/hero_luxury_apartment_1790378080480.jpg',
      '/src/assets/images/apt_coastal_villa_1790378103266.jpg'
    ],
    amenities: [
      '24/7 Solar & Silent Generator Power Backup',
      'Private Rooftop Plunge Pool',
      'Private Technogym Fitness Suite',
      '24/7 Uniformed Security & Concierge',
      'High-Speed Fiber Internet (500 Mbps)',
      'Chef Kitchen with Quartz Island',
      'Gated Covered Executive Parking',
      'Air Conditioning in All Rooms',
      'Washer & Dryer In-Unit',
      'Smart Intercom & Keyless Entry',
      'Complimentary Airport Chauffeur (Kotoka ACC)'
    ],
    houseRules: [
      'Respectful noise levels after 22:00',
      'Registered guests only unless prior concierge clearance',
      'Strictly non-smoking inside residences'
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
  },
  {
    id: 'apt-airport-residential',
    title: 'The Airport Residential Executive Suite',
    subtitle: '5 minutes from Kotoka Airport with private pool, garden terrace & full generator backup',
    description: 'Premier executive sanctuary nestled in the tranquil, tree-lined Airport Residential Area. Designed for diplomats, executives, and discerning families. Includes dedicated chauffeur pickup from Kotoka International Airport (ACC), private lap pool, high-speed fiber Wi-Fi, and 24/7 uninterrupted solar/generator power.',
    city: 'Accra',
    country: 'Ghana',
    neighborhood: 'Airport Residential',
    coordinates: { lat: 5.6045, lng: -0.1870 },
    pricePerNight: 290,
    currency: 'GHS',
    rating: 4.97,
    reviewCount: 39,
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    sqft: 1650,
    featured: true,
    propertyType: 'Penthouse',
    images: [
      '/src/assets/images/hero_luxury_apartment_1790378080480.jpg',
      '/src/assets/images/apt_accra_luxury_1790379220032.jpg',
      '/src/assets/images/apt_scandi_loft_1790378092782.jpg'
    ],
    amenities: [
      '5 Minutes from Kotoka International Airport',
      '24/7 Standby Generator & Solar Inverter',
      'Swimming Pool & Sun Deck',
      'Executive Home Office with Ergonomic Seating',
      'High-Speed Wi-Fi (1 Gbps)',
      '24/7 Gated Security & Electric Fencing',
      'Fully Equipped Kitchen & Dishwasher',
      'Borehole & Treated Water Reservoir',
      'Air Conditioning & Ceiling Fans in All Rooms'
    ],
    houseRules: [
      'Quiet hours after 22:30',
      'No commercial events without prior host clearance',
      'Self check-in via smart keypad lock'
    ],
    checkInTime: '14:00',
    checkOutTime: '11:00',
    cleaningFee: 80,
    serviceFeePercent: 8,
    taxesPercent: 5,
    host: {
      name: 'Akosua Darko',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&h=160&q=80',
      superhost: true,
      responseRate: '100% within 15 min',
      joinedYear: 2020
    },
    blockedDates: ['2026-10-10', '2026-10-11', '2026-10-12']
  },
  {
    id: 'apt-east-legon-loft',
    title: 'The East Legon Designer Penthouse',
    subtitle: 'Contemporary loft architecture, sunset views, and curated Ghanaian art collection',
    description: 'Located in the vibrant, cosmopolitan heart of East Legon near Lagos Avenue and A&C Mall. Features double-height ceilings, floor-to-ceiling glass framing sunset vistas, bespoke hand-carved Ghanaian wooden art pieces, private rooftop cocktail lounge, and seamless fiber connectivity.',
    city: 'Accra',
    country: 'Ghana',
    neighborhood: 'East Legon',
    coordinates: { lat: 5.6350, lng: -0.1550 },
    pricePerNight: 260,
    currency: 'GHS',
    rating: 4.95,
    reviewCount: 42,
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    sqft: 1400,
    featured: true,
    propertyType: 'Loft',
    images: [
      '/src/assets/images/apt_urban_studio_1790378114329.jpg',
      '/src/assets/images/apt_accra_luxury_1790379220032.jpg',
      '/src/assets/images/hero_luxury_apartment_1790378080480.jpg'
    ],
    amenities: [
      'Private Rooftop Lounge with Sunset View',
      '24/7 Solar & Generator Silent Backup',
      'High-Speed Fiber Wi-Fi (500 Mbps)',
      'Smart TV with Netflix & International Channels',
      'Walk to Premier Restaurants on Lagos Ave',
      'Covered Parking Bay',
      'Modern Induction Kitchen & Espresso Bar',
      'In-Unit Laundry Station'
    ],
    houseRules: [
      'Shoes-off interior policy preferred',
      'Respectful neighbor policy',
      'Maximum 4 registered overnight guests'
    ],
    checkInTime: '15:00',
    checkOutTime: '11:00',
    cleaningFee: 70,
    serviceFeePercent: 8,
    taxesPercent: 5,
    host: {
      name: 'Kofi Annan Jr.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80',
      superhost: true,
      responseRate: '98% within 30 min',
      joinedYear: 2022
    },
    blockedDates: ['2026-10-05', '2026-10-06']
  },
  {
    id: 'apt-labone-sanctuary',
    title: 'The Labone Artisan Garden Residence',
    subtitle: 'Secluded courtyard garden, teak wood pavilion, and walk to bistro enclaves',
    description: 'A serene tropical retreat in the artisanal enclave of Labone, moments from Osu and South Ridge. Features lush landscaped gardens with royal palms, outdoor rainfall shower, handcrafted Ghanaian teak dining pavilions, and quiet acoustic insulation for restful nights.',
    city: 'Accra',
    country: 'Ghana',
    neighborhood: 'Labone',
    coordinates: { lat: 5.5680, lng: -0.1720 },
    pricePerNight: 280,
    currency: 'GHS',
    rating: 4.96,
    reviewCount: 34,
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    sqft: 1500,
    featured: false,
    propertyType: 'Duplex',
    images: [
      '/src/assets/images/apt_garden_duplex_1790378124347.jpg',
      '/src/assets/images/apt_accra_luxury_1790379220032.jpg'
    ],
    amenities: [
      'Private Landscaped Tropical Courtyard',
      '24/7 Uninterrupted Standby Power',
      'Outdoor Teak Dining Pavilion',
      'Deep Soaking Bathtub & Rainfall Shower',
      'High-Speed Wi-Fi (500 Mbps)',
      'Walking Distance to Labone Cafes & Art Galleries',
      'Gated Community with 24/7 Guard'
    ],
    houseRules: [
      'Please secure garden gate when leaving',
      'Non-smoking inside residences',
      'No loud music in courtyard after 22:00'
    ],
    checkInTime: '14:00',
    checkOutTime: '11:00',
    cleaningFee: 75,
    serviceFeePercent: 8,
    taxesPercent: 5,
    host: {
      name: 'Efua Sutherland',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80',
      superhost: true,
      responseRate: '100% within 1 hour',
      joinedYear: 2021
    },
    blockedDates: ['2026-10-18', '2026-10-19']
  },
  {
    id: 'apt-ridge-horizon',
    title: 'The Ridge Diplomatic Horizon Suite',
    subtitle: 'Panoramic skyline vistas, infinity lap pool, and 24/7 executive concierge',
    description: 'Perched in the prestigious diplomatic district of Ridge, Accra, near major embassies, ministries, and banking headquarters. Boasts floor-to-ceiling glass with sweeping vistas toward the Atlantic Gulf of Guinea, private infinity pool access, and bespoke hospitality services.',
    city: 'Accra',
    country: 'Ghana',
    neighborhood: 'Ridge',
    coordinates: { lat: 5.5610, lng: -0.1980 },
    pricePerNight: 360,
    currency: 'GHS',
    rating: 4.99,
    reviewCount: 51,
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 6,
    sqft: 2100,
    featured: true,
    propertyType: 'Penthouse',
    images: [
      '/src/assets/images/apt_coastal_villa_1790378103266.jpg',
      '/src/assets/images/hero_luxury_apartment_1790378080480.jpg',
      '/src/assets/images/apt_accra_luxury_1790379220032.jpg'
    ],
    amenities: [
      'Breathtaking City & Atlantic Horizon Views',
      'Infinity Pool & Sky Sundeck',
      '24/7 Concierge & Diplomatic-Grade Security',
      'Full Standby Generator & Solar System',
      'Fiber Internet (1 Gbps) & Boardroom Access',
      'Chef Kitchen with Premium Miele Appliances',
      'Underground Private Parking'
    ],
    houseRules: [
      'Concierge check-in with valid passport or Ghana Card',
      'Non-smoking interior',
      'Respectful condominium guidelines'
    ],
    checkInTime: '15:00',
    checkOutTime: '12:00',
    cleaningFee: 90,
    serviceFeePercent: 8,
    taxesPercent: 5,
    host: {
      name: 'Kwesi Appiah',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=160&h=160&q=80',
      superhost: true,
      responseRate: '100% within 10 min',
      joinedYear: 2020
    },
    blockedDates: ['2026-10-24', '2026-10-25']
  },
  {
    id: 'apt-aburi-retreat',
    title: 'The Aburi Mountain Eco-Villa',
    subtitle: 'Crisp mountain breezes, botanical valley views, and private infinity deck',
    description: 'An idyllic escape perched along the lush ridges of Aburi Hills, only 35 minutes scenic drive from Accra. Enjoy cool mountain temperatures, panoramic vistas across the Akwapim valley, private infinity deck, organic fruit trees, and peaceful nights under starlit skies.',
    city: 'Aburi',
    country: 'Ghana',
    neighborhood: 'Aburi Hills',
    coordinates: { lat: 5.8490, lng: -0.1760 },
    pricePerNight: 250,
    currency: 'GHS',
    rating: 4.98,
    reviewCount: 31,
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    sqft: 1800,
    featured: false,
    propertyType: 'Villa',
    images: [
      '/src/assets/images/apt_coastal_villa_1790378103266.jpg',
      '/src/assets/images/apt_garden_duplex_1790378124347.jpg'
    ],
    amenities: [
      'Panoramic Mountain & Valley Panorama',
      'Private Heated Plunge Pool & Sun Deck',
      'Cool Mountain Climate (Naturally Refreshing)',
      '24/7 Solar Standby Power',
      'High-Speed Starlink Satellite Internet',
      'Open-Air Fireplace & BBQ Grill',
      'Gated Private Mountain Compound'
    ],
    houseRules: [
      'Preserve the natural mountain peace and wildlife',
      'Quiet terrace hours after 22:00',
      'Supervised children near edge railing'
    ],
    checkInTime: '14:00',
    checkOutTime: '11:00',
    cleaningFee: 65,
    serviceFeePercent: 8,
    taxesPercent: 5,
    host: {
      name: 'Yaa Asantewaa',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&h=160&q=80',
      superhost: true,
      responseRate: '100% within 20 min',
      joinedYear: 2021
    },
    blockedDates: ['2026-10-08', '2026-10-09']
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
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
    id: 'rev-2',
    apartmentId: 'apt-airport-residential',
    authorName: 'Marcus Sterling',
    authorCountry: 'United Kingdom',
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
    date: 'September 2026',
    comment: 'Being just 5 minutes from Kotoka Airport was a game changer for my business trip. The apartment is quiet, luxurious, and the chauffeur pickup was seamless. The high-speed fiber internet handled all my video calls flawlessly.',
    verifiedStay: true,
    hostReply: {
      author: 'Akosua Darko',
      date: 'September 2026',
      text: 'Thank you Marcus! We look forward to hosting you on your next trip to Accra.'
    }
  },
  {
    id: 'rev-3',
    apartmentId: 'apt-east-legon-loft',
    authorName: 'Amina Bello',
    authorCountry: 'Nigeria',
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
    date: 'August 2026',
    comment: 'East Legon is full of life and fantastic food, and this penthouse was the perfect base. The sunset views from the terrace with a cold drink were unforgettable. 10/10 stay.',
    verifiedStay: true
  },
  {
    id: 'rev-4',
    apartmentId: 'apt-labone-sanctuary',
    authorName: 'David & Jennifer Cole',
    authorCountry: 'United States',
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
    comment: 'Labone is so peaceful and walkable. The courtyard garden is a slice of heaven, and the handcrafted woodwork gives the apartment so much warmth. Efua is a wonderful host.',
    verifiedStay: true
  },
  {
    id: 'rev-5',
    apartmentId: 'apt-ridge-horizon',
    authorName: 'Dr. Kwabena Frimpong',
    authorCountry: 'Ghana',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80',
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
    comment: 'Flawless standards in Ridge. Security is top notch, the infinity pool is stunning, and the concierge staff are extremely attentive and professional.',
    verifiedStay: true
  }
];
