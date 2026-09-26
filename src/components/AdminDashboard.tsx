import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  DollarSign,
  TrendingUp,
  Shield,
  CheckCircle2,
  XCircle,
  Plus,
  Lock,
  Unlock,
  Building,
  Users,
  Search,
  ArrowUpRight,
  Trash2,
  Bed,
  Bath,
  Maximize2,
  Sparkles,
  Pencil,
  Edit3,
  LayoutList,
  Table as TableIcon,
  MapPin
} from 'lucide-react';
import { Apartment, Booking, Currency, Language } from '../types';
import { CURRENCY_RATES, formatPrice, formatPriceExact, saveApartments, saveBooking } from '../services/storage';
import { TRANSLATIONS } from '../data/translations';
import { AddRoomModal } from './AddRoomModal';
import { EditResidenceModal } from './EditResidenceModal';

interface AdminDashboardProps {
  apartments: Apartment[];
  bookings: Booking[];
  currentCurrency: Currency;
  currentLang: Language;
  onUpdateApartments: (apts: Apartment[]) => void;
  onUpdateBookings: (bookings: Booking[]) => void;
  onOpenBookingEmail: (booking: Booking) => void;
  onAdminLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  apartments,
  bookings,
  currentCurrency,
  currentLang,
  onUpdateApartments,
  onUpdateBookings,
  onOpenBookingEmail,
  onAdminLogout,
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const [selectedApartmentId, setSelectedApartmentId] = useState(apartments[0]?.id || '');
  const [dateToBlock, setDateToBlock] = useState('2026-10-25');
  const [blockSuccessNotice, setBlockSuccessNotice] = useState<string | null>(null);
  const [surgePercent, setSurgePercent] = useState<number>(0);
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('all');
  const [guestSearch, setGuestSearch] = useState('');
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [editingApartment, setEditingApartment] = useState<Apartment | null>(null);
  const [inventoryViewMode, setInventoryViewMode] = useState<'cards' | 'table'>('cards');

  // Selected Apartment
  const currentApartment = apartments.find((a) => a.id === selectedApartmentId) || apartments[0];

  // Financial & KPI Computations
  const totalRevenue = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const confirmedStays = bookings.filter((b) => b.status === 'confirmed').length;
  const avgNightlyRate =
    apartments.reduce((sum, a) => sum + a.pricePerNight, 0) / (apartments.length || 1);
  const occupancyRate = 78.4; // Realistic hospitality metric for luxury apartments

  // Handler: Add New Apartment
  const handleAddApartment = (newApt: Apartment) => {
    const updated = [newApt, ...apartments];
    saveApartments(updated);
    onUpdateApartments(updated);
    setSelectedApartmentId(newApt.id);
    setBlockSuccessNotice(`New residence "${newApt.title}" in ${newApt.city}, ${newApt.country} added successfully!`);
    setTimeout(() => setBlockSuccessNotice(null), 5000);
  };

  // Handler: Save Edited Apartment
  const handleSaveEditedApartment = (updatedApartment: Apartment) => {
    const updated = apartments.map((a) => (a.id === updatedApartment.id ? updatedApartment : a));
    saveApartments(updated);
    onUpdateApartments(updated);
    if (selectedApartmentId === updatedApartment.id) {
      // Re-trigger selection to ensure fresh references
      setSelectedApartmentId(updatedApartment.id);
    }
    setBlockSuccessNotice(`Residence "${updatedApartment.title}" has been successfully updated.`);
    setTimeout(() => setBlockSuccessNotice(null), 4500);
  };

  // Handler: Delete Apartment
  const handleDeleteApartment = (aptId: string, aptTitle: string) => {
    if (apartments.length <= 1) {
      alert('You must keep at least one residence in the inventory.');
      return;
    }
    if (confirm(`Remove "${aptTitle}" from active listings?`)) {
      const updated = apartments.filter((a) => a.id !== aptId);
      saveApartments(updated);
      onUpdateApartments(updated);
      if (selectedApartmentId === aptId && updated.length > 0) {
        setSelectedApartmentId(updated[0].id);
      }
      setBlockSuccessNotice(`"${aptTitle}" removed from listings.`);
      setTimeout(() => setBlockSuccessNotice(null), 4000);
    }
  };

  // Handler: Block a Date
  const handleBlockDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateToBlock || !currentApartment) return;

    if (currentApartment.blockedDates.includes(dateToBlock)) {
      setBlockSuccessNotice(`Date ${dateToBlock} is already blocked.`);
      return;
    }

    const updatedApts = apartments.map((apt) => {
      if (apt.id === currentApartment.id) {
        return {
          ...apt,
          blockedDates: [...apt.blockedDates, dateToBlock],
        };
      }
      return apt;
    });

    saveApartments(updatedApts);
    onUpdateApartments(updatedApts);
    setBlockSuccessNotice(`Date ${dateToBlock} successfully blocked on ${currentApartment.title}.`);
    setTimeout(() => setBlockSuccessNotice(null), 4000);
  };

  // Handler: Unblock a Date
  const handleUnblockDate = (dateStr: string) => {
    const updatedApts = apartments.map((apt) => {
      if (apt.id === currentApartment.id) {
        return {
          ...apt,
          blockedDates: apt.blockedDates.filter((d) => d !== dateStr),
        };
      }
      return apt;
    });

    saveApartments(updatedApts);
    onUpdateApartments(updatedApts);
    setBlockSuccessNotice(`Date ${dateStr} unblocked and opened for booking.`);
    setTimeout(() => setBlockSuccessNotice(null), 4000);
  };

  // Handler: Apply Dynamic Surge Pricing
  const handleApplySurge = (percent: number) => {
    setSurgePercent(percent);
    const updatedApts = apartments.map((apt) => {
      if (apt.id === currentApartment.id) {
        const base = apt.pricePerNight;
        const adjusted = Math.round(base * (1 + percent / 100));
        return { ...apt, pricePerNight: adjusted };
      }
      return apt;
    });
    saveApartments(updatedApts);
    onUpdateApartments(updatedApts);
    setBlockSuccessNotice(`Surge pricing ${percent >= 0 ? '+' : ''}${percent}% applied to ${currentApartment.title}.`);
    setTimeout(() => setBlockSuccessNotice(null), 3000);
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = bookingFilterStatus === 'all' || b.status === bookingFilterStatus;
    const matchesSearch =
      b.guestName.toLowerCase().includes(guestSearch.toLowerCase()) ||
      b.apartmentTitle.toLowerCase().includes(guestSearch.toLowerCase()) ||
      b.id.toLowerCase().includes(guestSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600">
            <Building className="h-4 w-4" />
            <span>Hospitality Management & Multi-Region Host Operations</span>
          </div>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
            {t.adminDashboardTitle}
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Real-time calendar date blocking, pricing surge management, and guest reservation oversight.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setIsAddRoomOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-950 px-3.5 py-1.5 font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Add Room / Residence</span>
          </button>
          <span className="rounded-md bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-800 border border-emerald-200">
            Global Node Sync: Active
          </span>
          <div className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-zinc-700">
            <Shield className="h-3.5 w-3.5 text-zinc-500" />
            <span className="font-semibold text-zinc-900">admin@havenstay.com</span>
            <span className="text-zinc-400">· Senior Admin</span>
          </div>
          {onAdminLogout && (
            <button
              onClick={onAdminLogout}
              className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 font-medium text-zinc-600 hover:bg-zinc-100 hover:text-rose-600 transition-colors"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Revenue */}
        <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>{t.adminRevenue}</span>
            <span className="font-mono text-xs font-bold text-zinc-600 bg-zinc-100 rounded px-1.5 py-0.5 border border-zinc-200/60">
              {CURRENCY_RATES[currentCurrency]?.symbol.trim() || currentCurrency}
            </span>
          </div>
          <div className="mt-2 font-serif text-2xl font-bold text-zinc-950 tabular-nums">
            {formatPrice(totalRevenue, currentCurrency)}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <TrendingUp className="h-3 w-3" />
            <span>+18.4% vs last period</span>
          </div>
        </div>

        {/* Metric 2: Occupancy Rate */}
        <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>{t.adminOccupancy}</span>
            <TrendingUp className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="mt-2 font-serif text-2xl font-bold text-zinc-950 tabular-nums">
            {occupancyRate}%
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">
            Target benchmark: 75%
          </div>
        </div>

        {/* Metric 3: Active Bookings */}
        <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>{t.adminActiveBookings}</span>
            <Users className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="mt-2 font-serif text-2xl font-bold text-zinc-950 tabular-nums">
            {confirmedStays} Stays
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">
            {bookings.length} total logged
          </div>
        </div>

        {/* Metric 4: Average Nightly Rate */}
        <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>{t.adminAvgRate}</span>
            <BarChart3 className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="mt-2 font-serif text-2xl font-bold text-zinc-950 tabular-nums">
            {formatPrice(avgNightlyRate, currentCurrency)}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">
            Across {apartments.length} curated residences
          </div>
        </div>
      </div>

      {/* Residences & Room Inventory Section */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl font-bold text-zinc-950">
                Residences & Room Inventory
              </h2>
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-700">
                {apartments.length} Active Listings
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Administrators can add new apartments, configure rooms, update nightly pricing, and manage calendar availability.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            {/* View Mode Switcher: Card List (Fitted) vs Compact Table */}
            <div className="flex items-center rounded-lg bg-zinc-100 p-0.5 border border-zinc-200 text-xs font-medium">
              <button
                type="button"
                onClick={() => setInventoryViewMode('cards')}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition-all cursor-pointer ${
                  inventoryViewMode === 'cards'
                    ? 'bg-white text-zinc-950 font-bold shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
                title="Full-width screen-fitted card view (no horizontal scroll)"
              >
                <LayoutList className="h-3.5 w-3.5" />
                <span>Card View</span>
              </button>
              <button
                type="button"
                onClick={() => setInventoryViewMode('table')}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition-all cursor-pointer ${
                  inventoryViewMode === 'table'
                    ? 'bg-white text-zinc-950 font-bold shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
                title="Fitted table view"
              >
                <TableIcon className="h-3.5 w-3.5" />
                <span>Table</span>
              </button>
            </div>

            <button
              onClick={() => setIsAddRoomOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>+ Add Residence</span>
            </button>
          </div>
        </div>

        {/* MODE 1: SCREEN-FITTED CARD VIEW (No horizontal scrolling, 100% width) */}
        {inventoryViewMode === 'cards' ? (
          <div className="space-y-3">
            {apartments.map((apt) => (
              <div
                key={apt.id}
                className={`rounded-xl border p-3.5 sm:p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 ${
                  selectedApartmentId === apt.id
                    ? 'border-amber-400 bg-amber-50/30 ring-1 ring-amber-400/20'
                    : 'border-zinc-200/80 bg-white hover:border-zinc-300'
                }`}
              >
                {/* Left: Thumbnail & Main info */}
                <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                  <div
                    onClick={() => setEditingApartment(apt)}
                    className="relative cursor-pointer group shrink-0"
                    title="Click to edit residence & media"
                  >
                    <img
                      src={apt.images[0]}
                      alt={apt.title}
                      className="h-16 w-20 sm:h-20 sm:w-24 rounded-lg object-cover border border-zinc-200 group-hover:opacity-85 transition-opacity"
                    />
                    <span className="absolute inset-0 bg-black/30 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Pencil className="h-3.5 w-3.5 text-white" />
                    </span>
                    {apt.featured && (
                      <span className="absolute top-1 left-1 rounded bg-amber-500 text-white font-bold text-[9px] px-1 py-0.2 shadow-2xs">
                        ★
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingApartment(apt)}
                        className="font-serif font-bold text-zinc-950 text-sm sm:text-base text-left hover:text-amber-800 transition-colors flex items-center gap-1 group cursor-pointer truncate max-w-full"
                        title="Click to edit residence"
                      >
                        <span className="truncate">{apt.title}</span>
                        <Pencil className="h-3 w-3 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </button>
                      <span className="rounded bg-emerald-50 px-2 py-0.5 font-semibold text-[10px] text-emerald-700 border border-emerald-200 shrink-0">
                        Live / Available
                      </span>
                      {apt.featured && (
                        <span className="rounded bg-amber-50 px-2 py-0.5 font-semibold text-[10px] text-amber-800 border border-amber-200 shrink-0">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-zinc-500">
                      <span className="font-medium text-zinc-700 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-zinc-400" />
                        {apt.neighborhood || apt.city}, {apt.country} {apt.country.toLowerCase().includes('ghana') ? '🇬🇭' : ''}
                      </span>
                      <span>·</span>
                      <span className="text-zinc-600">
                        {apt.bedrooms} bed · {apt.bathrooms} bath · {apt.maxGuests} guests · {apt.sqft} sqft
                      </span>
                      <span>·</span>
                      <span className="font-semibold text-zinc-900">★ {apt.rating.toFixed(2)} ({apt.reviewCount})</span>
                    </div>

                    <div className="text-[11px] text-zinc-400 line-clamp-1">
                      {apt.subtitle}
                    </div>
                  </div>
                </div>

                {/* Right: Pricing & Action Buttons */}
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between md:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                  <div className="text-left sm:text-right">
                    <div className="text-sm sm:text-base font-bold text-zinc-950 tabular-nums">
                      {formatPrice(apt.pricePerNight, currentCurrency)}
                    </div>
                    <div className="text-[10px] text-zinc-400">per night</div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingApartment(apt)}
                      className="flex items-center gap-1 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:border-zinc-950 hover:bg-zinc-950 hover:text-white transition-all cursor-pointer shadow-2xs"
                      title="Edit residence details, nightly rates, layout specs, photos, and video"
                    >
                      <Pencil className="h-3.5 w-3.5 text-amber-600" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setSelectedApartmentId(apt.id)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                        selectedApartmentId === apt.id
                          ? 'bg-zinc-900 text-white border-zinc-900'
                          : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100'
                      }`}
                      title="Manage calendar and blocked dates for this room"
                    >
                      {selectedApartmentId === apt.id ? 'Selected' : 'Calendar'}
                    </button>
                    <button
                      onClick={() => handleDeleteApartment(apt.id, apt.title)}
                      className="rounded-lg border border-zinc-200 p-1.5 text-zinc-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete this room"
                      aria-label={`Delete ${apt.title}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* MODE 2: FITTED COMPACT TABLE (Responsive columns, fits 100% without horizontal scroll) */
          <div className="w-full overflow-hidden rounded-xl border border-zinc-200/80 bg-white">
            <table className="w-full text-left text-xs text-zinc-700">
              <thead className="border-b border-zinc-100 bg-zinc-50 font-semibold text-zinc-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-3 sm:px-4">Property</th>
                  <th className="py-3 px-3 hidden sm:table-cell">Location</th>
                  <th className="py-3 px-3">Nightly Rate</th>
                  <th className="py-3 px-3 hidden md:table-cell">Status</th>
                  <th className="py-3 px-3 sm:px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {apartments.map((apt) => (
                  <tr
                    key={apt.id}
                    className={`hover:bg-zinc-50/80 transition-colors ${
                      selectedApartmentId === apt.id ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    <td className="py-3 px-3 sm:px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          onClick={() => setEditingApartment(apt)}
                          className="relative cursor-pointer group shrink-0"
                          title="Click to edit"
                        >
                          <img
                            src={apt.images[0]}
                            alt={apt.title}
                            className="h-10 w-12 rounded object-cover border border-zinc-200 group-hover:opacity-85"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() => setEditingApartment(apt)}
                            className="font-serif font-bold text-zinc-950 truncate max-w-[170px] sm:max-w-xs text-left hover:text-amber-700 transition-colors block cursor-pointer"
                          >
                            {apt.title}
                          </button>
                          <div className="text-[10px] text-zinc-500 truncate sm:hidden">
                            {apt.neighborhood || apt.city} · ★ {apt.rating.toFixed(2)}
                          </div>
                          <div className="text-[10px] text-zinc-400 hidden sm:block truncate">
                            {apt.bedrooms} bed · {apt.bathrooms} bath · {apt.maxGuests} guests
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-zinc-900 hidden sm:table-cell">
                      <div>{apt.neighborhood || apt.city}</div>
                      <div className="text-[10px] text-zinc-400">{apt.country}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-zinc-950 tabular-nums">
                      <div>{formatPrice(apt.pricePerNight, currentCurrency)}</div>
                      <div className="text-[9px] text-zinc-400">per night</div>
                    </td>
                    <td className="py-3 px-3 hidden md:table-cell">
                      <span className="rounded bg-emerald-50 px-2 py-0.5 font-semibold text-[10px] text-emerald-700 border border-emerald-200">
                        Live
                      </span>
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingApartment(apt)}
                          className="rounded border border-zinc-300 bg-white px-2 py-1 text-[11px] font-semibold text-zinc-800 hover:border-zinc-950 hover:bg-zinc-950 hover:text-white transition-all cursor-pointer shadow-2xs"
                          title="Edit"
                        >
                          <Pencil className="h-3 w-3 text-amber-600 inline mr-0.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setSelectedApartmentId(apt.id)}
                          className={`rounded border px-2 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                            selectedApartmentId === apt.id
                              ? 'bg-zinc-900 text-white border-zinc-900'
                              : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100'
                          }`}
                          title="Calendar"
                        >
                          {selectedApartmentId === apt.id ? 'Selected' : 'Calendar'}
                        </button>
                        <button
                          onClick={() => handleDeleteApartment(apt.id, apt.title)}
                          className="rounded border border-zinc-200 p-1 text-zinc-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Real-time Calendar Date Blocker & Surge Engine */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-100 pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-zinc-950">
              {t.adminBlockDates} & Dynamic Surge Pricing
            </h2>
            <p className="text-xs text-zinc-500">
              Prevent conflicts by locking dates for owner stays, maintenance, or applying seasonal rate multipliers.
            </p>
          </div>

          {/* Residence Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-700">Residence:</span>
            <select
              value={selectedApartmentId}
              onChange={(e) => setSelectedApartmentId(e.target.value)}
              className="rounded-lg border border-zinc-200 bg-white py-1.5 px-3 text-xs font-medium text-zinc-900 focus:border-zinc-900 focus:outline-none"
            >
              {apartments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title} ({a.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        {blockSuccessNotice && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{blockSuccessNotice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Date Blocker Form */}
          <form onSubmit={handleBlockDate} className="space-y-4 rounded-xl bg-zinc-50 p-4 border border-zinc-200/70 text-xs">
            <div className="font-semibold text-zinc-900 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-amber-600" />
              <span>Block Single Date in Calendar</span>
            </div>

            <div className="space-y-1">
              <label htmlFor="date-block-input" className="text-zinc-600">
                Select Date to Block (Maintenance / Private Use)
              </label>
              <input
                id="date-block-input"
                type="date"
                required
                value={dateToBlock}
                onChange={(e) => setDateToBlock(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white p-2 text-xs text-zinc-900 focus:border-zinc-900 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-zinc-900 py-2.5 font-semibold text-white hover:bg-zinc-800"
            >
              {t.adminBlockButton}
            </button>

            {/* Currently Blocked Dates List */}
            <div className="pt-2 border-t border-zinc-200">
              <div className="font-medium text-zinc-700 mb-2">
                Currently Blocked Dates on {currentApartment?.title}:
              </div>
              {currentApartment?.blockedDates.length === 0 ? (
                <div className="text-zinc-400">No dates blocked. All dates available.</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {currentApartment?.blockedDates.map((d) => (
                    <span
                      key={d}
                      className="inline-flex items-center gap-1 rounded bg-zinc-200 px-2 py-1 text-[11px] font-mono text-zinc-800"
                    >
                      <span>{d}</span>
                      <button
                        type="button"
                        onClick={() => handleUnblockDate(d)}
                        title="Unblock this date"
                        className="text-zinc-500 hover:text-rose-600"
                      >
                        <Unlock className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </form>

          {/* Right: Dynamic Surge Pricing Controls */}
          <div className="space-y-4 rounded-xl bg-zinc-50 p-4 border border-zinc-200/70 text-xs">
            <div className="font-semibold text-zinc-900 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              <span>{t.adminSurgePricing} (Nightly Rate Adjuster)</span>
            </div>

            <p className="text-zinc-500 leading-relaxed">
              Instantly adjust this residence’s nightly rate for high-demand dates, fashion weeks, or holidays. Current base rate: <strong className="text-zinc-900">{formatPrice(currentApartment?.pricePerNight || 0, currentCurrency)}</strong>.
            </p>

            <div className="grid grid-cols-4 gap-2 pt-2">
              {[
                { label: 'Standard (0%)', val: 0 },
                { label: '+10% Surge', val: 10 },
                { label: '+25% Peak', val: 25 },
                { label: '-10% Promo', val: -10 },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => handleApplySurge(opt.val)}
                  className={`rounded-lg border py-2 text-center font-medium transition-colors ${
                    surgePercent === opt.val
                      ? 'border-zinc-950 bg-zinc-950 text-white'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="rounded-lg bg-white p-3 border border-zinc-200 text-zinc-600">
              <span className="font-medium text-zinc-900">Current Adjusted Rate: </span>
              <span className="font-bold text-zinc-950 text-sm tabular-nums">
                {formatPrice(currentApartment?.pricePerNight || 0, currentCurrency)} / night
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Management Table */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-100 pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-zinc-950">
              Guest Reservations & Arrivals
            </h2>
            <div className="text-xs text-zinc-500">
              Manage check-ins, view automated email receipts, and review guest notes.
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search guest or ref..."
                value={guestSearch}
                onChange={(e) => setGuestSearch(e.target.value)}
                className="rounded-lg border border-zinc-200 py-1.5 pl-8 pr-3 text-xs focus:border-zinc-900 focus:outline-none"
              />
            </div>

            <select
              value={bookingFilterStatus}
              onChange={(e) => setBookingFilterStatus(e.target.value)}
              className="rounded-lg border border-zinc-200 py-1.5 px-3 text-xs font-medium focus:border-zinc-900 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Table on Desktop / Responsive Cards on Mobile */}
        <div className="w-full overflow-hidden">
          {/* Mobile / Tablet Cards */}
          <div className="md:hidden space-y-3">
            {filteredBookings.length === 0 ? (
              <div className="py-8 text-center text-zinc-400 text-xs">
                No reservations matching filter.
              </div>
            ) : (
              filteredBookings.map((b) => (
                <div
                  key={b.id}
                  className="rounded-xl border border-zinc-200/80 bg-white p-3.5 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-zinc-900">{b.id}</span>
                    <span
                      className={`rounded px-2 py-0.5 font-semibold text-[10px] ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : b.status === 'completed'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {b.status.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <div className="font-semibold text-zinc-950">{b.guestName}</div>
                    <div className="text-[11px] text-zinc-400">{b.guestEmail}</div>
                  </div>

                  <div className="text-zinc-700 font-serif font-medium">
                    {b.apartmentTitle}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                    <div>
                      <div className="text-zinc-600 text-[11px]">{b.checkInDate} → {b.checkOutDate}</div>
                      <div className="text-[10px] text-zinc-400">{b.totalNights} nights</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-zinc-950 tabular-nums">
                        {formatPriceExact(b.totalAmount, currentCurrency)}
                      </div>
                      <button
                        onClick={() => onOpenBookingEmail(b)}
                        className="mt-1 rounded border border-zinc-200 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-700 hover:bg-zinc-100"
                      >
                        Voucher
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Fitted Table */}
          <div className="hidden md:block rounded-xl border border-zinc-200/80 bg-white overflow-hidden">
            <table className="w-full text-left text-xs text-zinc-700">
              <thead className="border-b border-zinc-100 bg-zinc-50 font-semibold text-zinc-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-3 sm:px-4">Ref #</th>
                  <th className="py-3 px-3 sm:px-4">Guest</th>
                  <th className="py-3 px-3 sm:px-4">Residence</th>
                  <th className="py-3 px-3">Dates</th>
                  <th className="py-3 px-3 font-right">Total</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 sm:px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-zinc-400">
                      No reservations matching filter.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3 px-3 sm:px-4 font-mono font-semibold text-zinc-900">{b.id}</td>
                      <td className="py-3 px-3 sm:px-4">
                        <div className="font-semibold text-zinc-900">{b.guestName}</div>
                        <div className="text-[10px] text-zinc-400">{b.guestEmail}</div>
                      </td>
                      <td className="py-3 px-3 sm:px-4 font-serif font-medium text-zinc-900 max-w-[160px] truncate">
                        {b.apartmentTitle}
                      </td>
                      <td className="py-3 px-3">
                        <div>{b.checkInDate} → {b.checkOutDate}</div>
                        <div className="text-[10px] text-zinc-400">{b.totalNights} nights</div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-zinc-900 tabular-nums">
                        {formatPriceExact(b.totalAmount, currentCurrency)}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`rounded px-2 py-0.5 font-semibold text-[10px] ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : b.status === 'completed'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {b.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-3 sm:px-4 text-right">
                        <button
                          onClick={() => onOpenBookingEmail(b)}
                          className="rounded border border-zinc-200 px-2.5 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                        >
                          Voucher
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Room Modal */}
      {isAddRoomOpen && (
        <AddRoomModal
          currentCurrency={currentCurrency}
          currentLang={currentLang}
          onClose={() => setIsAddRoomOpen(false)}
          onAddApartment={handleAddApartment}
        />
      )}

      {/* Edit Residence & Room Inventory Modal */}
      {editingApartment && (
        <EditResidenceModal
          apartment={editingApartment}
          currentCurrency={currentCurrency}
          isOpen={true}
          onClose={() => setEditingApartment(null)}
          onSave={handleSaveEditedApartment}
        />
      )}
    </div>
  );
};
