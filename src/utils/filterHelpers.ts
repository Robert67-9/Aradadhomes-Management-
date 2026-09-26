import { Apartment } from '../types';

export interface AmenityDefinition {
  id: string;
  label: string;
  category: 'Popular' | 'Comfort' | 'Productivity & Wellness';
  description: string;
  iconName: string;
  matcher: (apt: Apartment) => boolean;
}

export interface PropertyTypeDefinition {
  id: string;
  label: string;
  description: string;
  iconName: string;
}

export const PROPERTY_TYPES: PropertyTypeDefinition[] = [
  {
    id: 'Penthouse',
    label: 'Penthouse',
    description: 'Top-tier floor with skyline views & private terraces',
    iconName: 'Building2',
  },
  {
    id: 'Villa',
    label: 'Villa',
    description: 'Freestanding estates with private plunge/lap pools',
    iconName: 'Home',
  },
  {
    id: 'Loft',
    label: 'Artisan Loft',
    description: 'Double-height ceilings, brickwork & open galleries',
    iconName: 'Warehouse',
  },
  {
    id: 'Duplex',
    label: 'Zen Duplex',
    description: 'Split-level living with courtyards & serene gardens',
    iconName: 'Layers',
  },
  {
    id: 'Studio',
    label: 'Atelier / Studio',
    description: 'Curated urban design studios in historic quarters',
    iconName: 'Compass',
  },
  {
    id: 'Townhouse',
    label: 'Townhouse',
    description: 'Stately multi-story classic heritage residences',
    iconName: 'Building',
  },
];

export const AMENITY_FILTERS: AmenityDefinition[] = [
  {
    id: 'wifi',
    label: 'High-Speed Wi-Fi',
    category: 'Popular',
    description: 'Fiber internet 500+ Mbps or gigabit connection',
    iconName: 'Wifi',
    matcher: (apt: Apartment) =>
      apt.amenities.some((a) => /wi-?fi|internet|fiber/i.test(a)) ||
      /wi-?fi|fiber internet/i.test(apt.description),
  },
  {
    id: 'pool',
    label: 'Swimming / Plunge Pool',
    category: 'Popular',
    description: 'Private heated plunge pool or lap pool',
    iconName: 'Waves',
    matcher: (apt: Apartment) =>
      apt.amenities.some((a) => /pool|plunge/i.test(a)) ||
      /pool|plunge/i.test(apt.title + ' ' + apt.subtitle + ' ' + apt.description),
  },
  {
    id: 'gym',
    label: 'Gym & Fitness Studio',
    category: 'Popular',
    description: 'Private Technogym suite, yoga deck, or fitness studio',
    iconName: 'Dumbbell',
    matcher: (apt: Apartment) =>
      apt.amenities.some((a) => /gym|fitness|wellness suite|workout|pilates/i.test(a)) ||
      /gym|fitness|technogym/i.test(apt.title + ' ' + apt.subtitle + ' ' + apt.description),
  },
  {
    id: 'air_conditioning',
    label: 'Air Conditioning',
    category: 'Comfort',
    description: 'Inverter climate control throughout all rooms',
    iconName: 'Wind',
    matcher: (apt: Apartment) =>
      apt.amenities.some((a) => /air conditioning|climate control|a\/c/i.test(a)) ||
      /climate control|air conditioning/i.test(apt.description),
  },
  {
    id: 'kitchen',
    label: 'Chef / Gourmet Kitchen',
    category: 'Comfort',
    description: 'Miele/Bulthaup appliances, induction cooktop & island',
    iconName: 'Utensils',
    matcher: (apt: Apartment) =>
      apt.amenities.some((a) => /kitchen|miele|induction|chef|island/i.test(a)) ||
      /kitchen|miele|bulthaup/i.test(apt.description),
  },
  {
    id: 'workspace',
    label: 'Dedicated Workspace',
    category: 'Productivity & Wellness',
    description: 'Ergonomic dual-monitor setup or home office library',
    iconName: 'Laptop',
    matcher: (apt: Apartment) =>
      apt.amenities.some((a) => /workspace|office|desk/i.test(a)) ||
      /workspace|home office/i.test(apt.description),
  },
  {
    id: 'balcony_terrace',
    label: 'Balcony or Terrace',
    category: 'Comfort',
    description: 'Wraparound deck, rooftop pavilion, or Juliette balcony',
    iconName: 'Sun',
    matcher: (apt: Apartment) =>
      apt.amenities.some((a) => /terrace|balcony|patio|pergola/i.test(a)) ||
      /terrace|balcony|pergola/i.test(apt.title + ' ' + apt.subtitle + ' ' + apt.description),
  },
  {
    id: 'parking',
    label: 'Parking / EV Charging',
    category: 'Comfort',
    description: 'Covered executive parking or private EV fast charger',
    iconName: 'Car',
    matcher: (apt: Apartment) =>
      apt.amenities.some((a) => /parking|ev |garage/i.test(a)) ||
      /parking|garage|ev charging/i.test(apt.description),
  },
  {
    id: 'security_concierge',
    label: '24/7 Concierge & Security',
    category: 'Comfort',
    description: 'Uniformed security, keyless elevator, or round-the-clock host',
    iconName: 'ShieldCheck',
    matcher: (apt: Apartment) =>
      apt.amenities.some((a) => /concierge|security|guard|intercom/i.test(a)) ||
      /concierge|security/i.test(apt.description),
  },
  {
    id: 'fireplace',
    label: 'Bespoke Fireplace',
    category: 'Popular',
    description: 'Cast iron hearth or outdoor open-air fireplace',
    iconName: 'Flame',
    matcher: (apt: Apartment) =>
      apt.amenities.some((a) => /fireplace/i.test(a)) ||
      /fireplace/i.test(apt.description),
  },
  {
    id: 'soaking_tub',
    label: 'Soaking Tub / Spa Bath',
    category: 'Productivity & Wellness',
    description: 'Deep Hinoki cedar bath, rainfall shower, or marble tub',
    iconName: 'Waves',
    matcher: (apt: Apartment) =>
      apt.amenities.some((a) => /tub|soaking|bath|rainfall shower/i.test(a)) ||
      /tub|soaking/i.test(apt.description),
  },
];

export function getApartmentPropertyType(apt: Apartment): string {
  if (apt.propertyType) return apt.propertyType;
  const text = (apt.title + ' ' + apt.subtitle + ' ' + apt.description).toLowerCase();
  if (text.includes('penthouse')) return 'Penthouse';
  if (text.includes('villa')) return 'Villa';
  if (text.includes('loft')) return 'Loft';
  if (text.includes('duplex')) return 'Duplex';
  if (text.includes('studio') || text.includes('atelier')) return 'Studio';
  if (text.includes('townhouse') || text.includes('residence')) return 'Townhouse';
  return 'Apartment';
}

export function filterApartments(
  apartments: Apartment[],
  options: {
    searchQuery: string;
    checkInDate: string;
    checkOutDate: string;
    guestsCount: number;
    maxPrice: number;
    selectedNeighborhood: string;
    selectedPropertyTypes: string[];
    selectedAmenities: string[];
    minBedrooms?: number;
    minBathrooms?: number;
  }
): Apartment[] {
  const {
    searchQuery,
    checkInDate,
    checkOutDate,
    guestsCount,
    maxPrice,
    selectedNeighborhood,
    selectedPropertyTypes,
    selectedAmenities,
    minBedrooms = 0,
    minBathrooms = 0,
  } = options;

  return apartments.filter((apt) => {
    // 1. Text Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const textMatch =
        apt.city.toLowerCase().includes(q) ||
        apt.neighborhood.toLowerCase().includes(q) ||
        apt.country.toLowerCase().includes(q) ||
        apt.title.toLowerCase().includes(q) ||
        apt.subtitle.toLowerCase().includes(q) ||
        getApartmentPropertyType(apt).toLowerCase().includes(q);
      if (!textMatch) return false;
    }

    // 2. Price
    if (apt.pricePerNight > maxPrice) {
      return false;
    }

    // 3. Guests
    if (apt.maxGuests < guestsCount) {
      return false;
    }

    // 4. Neighborhood
    if (selectedNeighborhood !== 'all' && apt.neighborhood !== selectedNeighborhood) {
      return false;
    }

    // 5. Property Type (multi-select: matches if any selected matches)
    if (selectedPropertyTypes.length > 0) {
      const aptType = getApartmentPropertyType(apt);
      if (!selectedPropertyTypes.includes(aptType)) {
        return false;
      }
    }

    // 6. Amenities (multi-select: must have all selected amenities)
    if (selectedAmenities.length > 0) {
      for (const amenityId of selectedAmenities) {
        const def = AMENITY_FILTERS.find((f) => f.id === amenityId);
        if (def && !def.matcher(apt)) {
          return false;
        }
      }
    }

    // 7. Bedrooms & Bathrooms
    if (minBedrooms > 0 && apt.bedrooms < minBedrooms) {
      return false;
    }
    if (minBathrooms > 0 && apt.bathrooms < minBathrooms) {
      return false;
    }

    // 8. Date Availability
    if (checkInDate && checkOutDate) {
      let curr = new Date(checkInDate);
      const end = new Date(checkOutDate);
      while (curr < end) {
        const dateStr = curr.toISOString().split('T')[0];
        if (apt.blockedDates.includes(dateStr)) {
          return false;
        }
        curr.setDate(curr.getDate() + 1);
      }
    }

    return true;
  });
}
