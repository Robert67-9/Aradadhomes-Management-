import React, { useState } from 'react';
import {
  User,
  Shield,
  Download,
  Trash2,
  Calendar,
  Heart,
  Mail,
  CheckCircle2,
  X,
  Lock,
  FileText,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { UserProfile, Booking, Apartment, Currency, Language } from '../types';
import {
  saveProfile,
  exportUserDataPackage,
  purgeUserData,
  cancelBooking,
  generateIcsCalendarFile,
  getEncryptionFingerprint,
  formatPrice,
  formatPriceExact
} from '../services/storage';
import { TRANSLATIONS } from '../data/translations';

interface UserProfileModalProps {
  profile: UserProfile;
  bookings: Booking[];
  apartments: Apartment[];
  currentCurrency: Currency;
  currentLang: Language;
  onClose: () => void;
  onProfileUpdated: (p: UserProfile) => void;
  onBookingsUpdated: () => void;
  onOpenBookingEmail: (booking: Booking) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  profile,
  bookings,
  apartments,
  currentCurrency,
  currentLang,
  onClose,
  onProfileUpdated,
  onBookingsUpdated,
  onOpenBookingEmail,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'wishlist' | 'privacy'>('profile');
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [bio, setBio] = useState(profile.bio);
  const [pushAlerts, setPushAlerts] = useState(profile.pushAlertsEnabled);
  const [emailAlerts, setEmailAlerts] = useState(profile.emailAlertsEnabled);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);
  const [purgeConfirmation, setPurgeConfirmation] = useState(false);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const favoriteApartments = apartments.filter((a) => profile.savedApartmentIds.includes(a.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...profile,
      name,
      email,
      phone,
      bio,
      pushAlertsEnabled: pushAlerts,
      emailAlertsEnabled: emailAlerts,
    };
    saveProfile(updated);
    onProfileUpdated(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this reservation? Full refund will be automatically issued per our 48-hour cancellation policy.')) {
      cancelBooking(bookingId);
      onBookingsUpdated();
    }
  };

  const handleExportData = () => {
    exportUserDataPackage();
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 4000);
  };

  const handlePurgeData = () => {
    purgeUserData();
    window.location.reload();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-profile-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative my-8 w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center text-white font-serif font-bold text-sm">
              {profile.name.charAt(0)}
            </div>
            <div>
              <h2 id="user-profile-dialog-title" className="font-serif text-lg font-bold text-zinc-950">
                {profile.name}
              </h2>
              <div className="text-xs text-zinc-500">{profile.email}</div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close profile modal"
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-4 flex border-b border-zinc-200">
          {[
            { id: 'profile', label: 'Profile & Settings', icon: User },
            { id: 'bookings', label: `My Stays (${bookings.length})`, icon: Calendar },
            { id: 'wishlist', label: `Saved (${favoriteApartments.length})`, icon: Heart },
            { id: 'privacy', label: 'Privacy & GDPR', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'border-zinc-950 text-zinc-950'
                    : 'border-transparent text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Profile & Settings */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="mt-6 space-y-4 text-xs">
            {saveSuccess && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-2.5 text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Personal details updated successfully.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 p-2 text-xs text-zinc-900 focus:border-zinc-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 p-2 text-xs text-zinc-900 focus:border-zinc-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Telephone / Mobile</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 p-2 text-xs text-zinc-900 focus:border-zinc-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700">Client-Side Encryption Standard</label>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-[11px] font-mono text-zinc-600">
                  {getEncryptionFingerprint()}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-700">Guest Bio & Stay Preferences</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share arrival preferences, dietary notes, or preferred architecture..."
                className="w-full rounded-lg border border-zinc-200 p-2.5 text-xs text-zinc-900 focus:border-zinc-900 focus:outline-none"
              />
            </div>

            {/* Notification Toggles */}
            <div className="border-t border-zinc-100 pt-4 space-y-3">
              <div className="font-semibold text-zinc-900">Communication & Alert Preferences</div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushAlerts}
                  onChange={(e) => setPushAlerts(e.target.checked)}
                  className="h-4 w-4 rounded accent-zinc-900"
                />
                <div>
                  <div className="font-medium text-zinc-800">Push Notifications for Reservation Updates</div>
                  <div className="text-zinc-500 text-[11px]">Real-time alerts for check-in countdowns, gate codes, and host notes</div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="h-4 w-4 rounded accent-zinc-900"
                />
                <div>
                  <div className="font-medium text-zinc-800">Automated Booking Confirmation & Receipt Emails</div>
                  <div className="text-zinc-500 text-[11px]">Dispatches complete travel vouchers and calendar invites (.ics) to your inbox</div>
                </div>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="rounded-lg bg-zinc-950 px-5 py-2.5 font-semibold text-white hover:bg-zinc-800 transition-colors"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: My Stays */}
        {activeTab === 'bookings' && (
          <div className="mt-6 space-y-4">
            {bookings.length === 0 ? (
              <div className="py-12 text-center text-xs text-zinc-500">
                {t.noBookingsYet}
              </div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={booking.apartmentImage}
                      alt={booking.apartmentTitle}
                      className="h-16 w-20 rounded-lg object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-zinc-900 font-serif">
                          {booking.apartmentTitle}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.2 text-[10px] font-semibold ${
                            booking.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-zinc-100 text-zinc-600'
                          }`}
                        >
                          {booking.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5">
                        {booking.checkInDate} → {booking.checkOutDate} · {booking.totalNights} nights · Ref: #{booking.id}
                      </div>
                      <div className="text-xs font-semibold text-zinc-900 mt-1">
                        Total: {formatPriceExact(booking.totalAmount, currentCurrency)}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <button
                      onClick={() => onOpenBookingEmail(booking)}
                      className="flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-50"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span>{t.viewReceipt}</span>
                    </button>
                    <button
                      onClick={() => generateIcsCalendarFile(booking)}
                      className="flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-50"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      <span>.ICS</span>
                    </button>
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="rounded-lg border border-rose-200 px-3 py-1.5 font-medium text-rose-700 hover:bg-rose-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Saved Favorites */}
        {activeTab === 'wishlist' && (
          <div className="mt-6 space-y-4">
            {favoriteApartments.length === 0 ? (
              <div className="py-12 text-center text-xs text-zinc-500">
                No saved residences. Click the heart icon on any residence to curate your wishlist.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favoriteApartments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center gap-3 rounded-xl border border-zinc-200/80 p-3 hover:shadow-sm transition-shadow"
                  >
                    <img
                      src={apt.images[0]}
                      alt={apt.title}
                      className="h-16 w-20 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm font-semibold text-zinc-900 truncate">
                        {apt.title}
                      </h4>
                      <div className="text-xs text-zinc-500">{apt.city} · {apt.neighborhood}</div>
                      <div className="text-xs font-bold text-zinc-950 mt-1">
                        {formatPrice(apt.pricePerNight, currentCurrency)} / night
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: International Privacy & GDPR Center */}
        {activeTab === 'privacy' && (
          <div className="mt-6 space-y-6 text-xs">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-zinc-900 text-sm">
                <Shield className="h-4 w-4 text-emerald-600" />
                <span>International Privacy Standards & Compliance</span>
              </div>
              <p className="text-zinc-600 leading-relaxed">
                HavenStay complies with the European Union General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA/CPRA), and international privacy frameworks. You maintain full ownership over your personal telemetry and transactional history.
              </p>
            </div>

            {exportNotice && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>{t.dataExportedSuccess}</span>
              </div>
            )}

            {/* GDPR Actions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div>
                  <div className="font-semibold text-zinc-900">GDPR Article 20: Right to Data Portability</div>
                  <div className="text-zinc-500">Download a complete, machine-readable JSON archive of your personal records and bookings.</div>
                </div>
                <button
                  type="button"
                  onClick={handleExportData}
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 font-semibold text-zinc-800 hover:bg-zinc-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{t.gdprExport}</span>
                </button>
              </div>

              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div>
                  <div className="font-semibold text-zinc-900">Client-Side End-to-End Encryption</div>
                  <div className="text-zinc-500">All data in transit is TLS 1.3 protected. Sensitive tokens use AES-256 GCM authenticated encryption.</div>
                </div>
                <div className="flex items-center gap-1 rounded bg-zinc-100 px-2 py-1 font-mono text-[11px] text-zinc-700">
                  <Lock className="h-3 w-3 text-emerald-600" />
                  <span>Active Session Key</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="font-semibold text-rose-700">Right to be Forgotten (Erase Account)</div>
                  <div className="text-zinc-500">Permanently delete all stored profiles, reservation logs, and cached reviews from local and cloud storage.</div>
                </div>
                {!purgeConfirmation ? (
                  <button
                    type="button"
                    onClick={() => setPurgeConfirmation(true)}
                    className="flex items-center gap-1.5 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 font-semibold text-rose-700 hover:bg-rose-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{t.rightToBeForgotten}</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPurgeConfirmation(false)}
                      className="rounded border border-zinc-300 px-2 py-1 text-zinc-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handlePurgeData}
                      className="rounded bg-rose-600 px-3 py-1 font-semibold text-white hover:bg-rose-700"
                    >
                      Confirm Erase
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
