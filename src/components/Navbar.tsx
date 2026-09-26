import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  User,
  Globe,
  Lock,
  LogOut,
  ChevronDown,
  X,
  Wifi,
  WifiOff,
  SlidersHorizontal,
  Compass,
  MapPin,
  CalendarCheck,
  ShieldCheck,
  Check,
  Sparkles,
} from 'lucide-react';
import { Language, Currency } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { CURRENCY_RATES } from '../services/storage';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  currentCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  activeView: 'residences' | 'map' | 'bookings' | 'admin';
  onNavigate: (view: 'residences' | 'map' | 'bookings' | 'admin') => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
  onOpenAccessibility: () => void;
  unreadNotificationsCount: number;
  activeBookingsCount: number;
  simulatedOffline: boolean;
  onToggleSimulatedOffline: (val: boolean) => void;
  isAdminAuthenticated: boolean;
  onOpenAdminLogin: () => void;
  onAdminLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  currentCurrency,
  onCurrencyChange,
  activeView,
  onNavigate,
  onOpenProfile,
  onOpenNotifications,
  onOpenAccessibility,
  unreadNotificationsCount,
  activeBookingsCount,
  simulatedOffline,
  onToggleSimulatedOffline,
  isAdminAuthenticated,
  onOpenAdminLogin,
  onAdminLogout,
}) => {
  const [prefModalOpen, setPrefModalOpen] = useState(false);
  const [prefActiveTab, setPrefActiveTab] = useState<'lang' | 'currency'>('lang');
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setPrefModalOpen(false);
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPrefModalOpen(false);
        setAccountMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const languages: { code: Language; label: string; nativeName: string; flag: string }[] = [
    { code: 'en', label: 'English', nativeName: 'English (US)', flag: '🇺🇸' },
    { code: 'es', label: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', label: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ar', label: 'Arabic', nativeName: 'العربية', flag: '🇦🇪' },
  ];

  const currencies: Currency[] = ['USD', 'EUR', 'GBP', 'JPY', 'GHS'];

  return (
    <>
      {/* ================================================================= */}
      {/* TOP NAVIGATION BAR (Spacious, Zero-Overcrowding Contract)         */}
      {/* ================================================================= */}
      <header
        ref={navRef}
        className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/95 backdrop-blur-md transition-all shadow-xs"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          
          {/* ZONE 1: BRAND LOGO (Left) */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => onNavigate('residences')}
              aria-label="HavenStay Residences Homepage"
              className="group flex items-center gap-2 rounded-lg py-1 focus-visible:outline-2 focus-visible:outline-zinc-900 transition-transform active:scale-95 text-left"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-white font-serif font-bold text-lg shadow-sm group-hover:bg-zinc-800 transition-colors">
                H
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-zinc-950 group-hover:text-zinc-800 transition-colors">
                  {t.brandName}
                </span>
                <span className="hidden sm:inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-600 border border-zinc-200/60">
                  Residences
                </span>
              </div>
            </button>
          </div>

          {/* ZONE 2: SEGMENTED LUXURY PILL NAV (Center - Desktop & Tablet) */}
          <nav
            aria-label="Primary Navigation Bar"
            className="hidden md:flex items-center bg-zinc-100/90 p-1 rounded-full border border-zinc-200/80 shadow-inner text-xs font-medium"
          >
            <button
              onClick={() => onNavigate('residences')}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 transition-all focus-visible:outline-2 focus-visible:outline-zinc-900 ${
                activeView === 'residences'
                  ? 'bg-white font-semibold text-zinc-950 shadow-xs ring-1 ring-black/5'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/50'
              }`}
            >
              <Compass className="h-3.5 w-3.5 text-zinc-500" />
              <span>{t.navExplore}</span>
            </button>

            <button
              onClick={() => onNavigate('map')}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 transition-all focus-visible:outline-2 focus-visible:outline-zinc-900 ${
                activeView === 'map'
                  ? 'bg-white font-semibold text-zinc-950 shadow-xs ring-1 ring-black/5'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/50'
              }`}
            >
              <MapPin className="h-3.5 w-3.5 text-zinc-500" />
              <span>{t.navMap}</span>
            </button>

            <button
              onClick={() => onNavigate('bookings')}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 transition-all focus-visible:outline-2 focus-visible:outline-zinc-900 ${
                activeView === 'bookings'
                  ? 'bg-white font-semibold text-zinc-950 shadow-xs ring-1 ring-black/5'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/50'
              }`}
            >
              <CalendarCheck className="h-3.5 w-3.5 text-zinc-500" />
              <span>{t.navBookings}</span>
              {activeBookingsCount > 0 && (
                <span
                  className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    activeView === 'bookings'
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-300 text-zinc-800'
                  }`}
                >
                  {activeBookingsCount}
                </span>
              )}
            </button>
          </nav>

          {/* ZONE 3: ACTIONS & UTILITIES (Right - Clean & Uncluttered) */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* Host Portal / Admin Console Button */}
            {!isAdminAuthenticated ? (
              <button
                onClick={onOpenAdminLogin}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-zinc-200/90 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 transition-all focus-visible:outline-2 focus-visible:outline-zinc-900"
              >
                <Lock className="h-3.5 w-3.5 text-zinc-500" />
                <span>Host Portal</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50/90 py-0.5 pl-2.5 pr-1.5 text-xs font-semibold text-emerald-950 shadow-xs">
                <button
                  onClick={() => onNavigate('admin')}
                  className="flex items-center gap-1.5 py-1 text-emerald-900 hover:text-emerald-950"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="hidden sm:inline">Host Console</span>
                  <span className="sm:hidden text-[11px]">Host</span>
                </button>
                <button
                  onClick={onAdminLogout}
                  title="Sign out of Host Console"
                  aria-label="Sign out of Host Console"
                  className="rounded-full p-1 text-emerald-700 hover:bg-emerald-100 hover:text-rose-600 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Language & Currency Quick Switcher Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setPrefModalOpen(!prefModalOpen);
                  setAccountMenuOpen(false);
                }}
                aria-label="Language and Currency preferences"
                className="flex items-center gap-1 sm:gap-1.5 rounded-full border border-zinc-200/90 bg-white px-2.5 sm:px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-zinc-900 transition-all cursor-pointer"
              >
                <Globe className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                <span className="font-semibold text-zinc-800 uppercase">{currentLang}</span>
                <span className="text-zinc-300">·</span>
                <span className="font-mono text-zinc-600 font-semibold">
                  {CURRENCY_RATES[currentCurrency]?.symbol.trim() || currentCurrency}
                </span>
                <ChevronDown className="h-3 w-3 text-zinc-400 ml-0.5 hidden xs:inline-block" />
              </button>

              {/* Preferences Modal / Popover */}
              {prefModalOpen && (
                <div className="fixed inset-x-4 top-20 sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-80 rounded-2xl border border-zinc-200 bg-white p-3.5 shadow-2xl ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100">
                    <span className="text-xs font-bold text-zinc-900">Regional Settings</span>
                    <button
                      onClick={() => setPrefModalOpen(false)}
                      className="rounded-full p-1 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                      aria-label="Close preferences"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Popover Header Tabs */}
                  <div className="flex rounded-xl bg-zinc-100 p-1 text-xs font-medium mb-3">
                    <button
                      onClick={() => setPrefActiveTab('lang')}
                      className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                        prefActiveTab === 'lang'
                          ? 'bg-white font-semibold text-zinc-900 shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      Language
                    </button>
                    <button
                      onClick={() => setPrefActiveTab('currency')}
                      className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                        prefActiveTab === 'currency'
                          ? 'bg-white font-semibold text-zinc-900 shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      Currency
                    </button>
                  </div>

                  {/* Tab 1: Language */}
                  {prefActiveTab === 'lang' && (
                    <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                      <p className="px-2 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                        Available Languages
                      </p>
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            onLanguageChange(lang.code);
                            setPrefModalOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                            currentLang === lang.code
                              ? 'bg-zinc-100 font-semibold text-zinc-950'
                              : 'text-zinc-700 hover:bg-zinc-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{lang.flag}</span>
                            <div>
                              <p className="font-medium text-zinc-900">{lang.nativeName}</p>
                              <p className="text-[10px] text-zinc-400">{lang.label}</p>
                            </div>
                          </div>
                          {currentLang === lang.code && (
                            <Check className="h-4 w-4 text-zinc-950" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Tab 2: Currency */}
                  {prefActiveTab === 'currency' && (
                    <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                      <p className="px-2 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                        Available Currencies
                      </p>
                      {currencies.map((curr) => {
                        const info = CURRENCY_RATES[curr];
                        const isGHS = curr === 'GHS';
                        return (
                          <button
                            key={curr}
                            onClick={() => {
                              onCurrencyChange(curr);
                              setPrefModalOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                              currentCurrency === curr
                                ? 'bg-zinc-100 font-semibold text-zinc-950'
                                : 'text-zinc-700 hover:bg-zinc-50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono font-bold text-zinc-900 w-8">
                                {info?.symbol.trim()}
                              </span>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-medium text-zinc-900">{curr}</span>
                                  {isGHS && (
                                    <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                                      Ghana Cedis
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-zinc-400">{info?.label}</p>
                              </div>
                            </div>
                            {currentCurrency === curr && (
                              <Check className="h-4 w-4 text-zinc-950" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Notifications Bell Button */}
            <button
              onClick={onOpenNotifications}
              aria-label={`Notifications (${unreadNotificationsCount} unread)`}
              className="relative rounded-full p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-zinc-900 transition-colors"
            >
              <Bell className="h-4 w-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              )}
            </button>

            {/* User Account Button (Clean Profile & Settings Only) */}
            <div className="relative">
              <button
                onClick={() => {
                  setAccountMenuOpen(!accountMenuOpen);
                  setPrefModalOpen(false);
                }}
                aria-label="Open User Account Settings"
                className="flex items-center gap-1.5 rounded-full border border-zinc-200/90 bg-white p-1 pl-1.5 pr-2 hover:border-zinc-300 hover:shadow-xs focus-visible:outline-2 focus-visible:outline-zinc-900 transition-all cursor-pointer"
              >
                <div className="h-6 w-6 rounded-full bg-zinc-900 flex items-center justify-center text-white text-[11px] font-semibold shadow-xs">
                  RV
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
              </button>

              {/* Clean, Non-Crowded Account Menu Dropdown */}
              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-zinc-200 bg-white p-2 shadow-2xl ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95">
                  {/* User Profile Summary */}
                  <div className="px-3.5 py-3 border-b border-zinc-100 mb-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-zinc-900">Robert Vander</p>
                        <p className="text-[11px] text-zinc-500">robert.vander@example.com</p>
                      </div>
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600">
                        Guest
                      </span>
                    </div>
                  </div>

                  {/* Profile & Privacy */}
                  <button
                    onClick={() => {
                      setAccountMenuOpen(false);
                      onOpenProfile();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
                  >
                    <User className="h-4 w-4 text-zinc-500" />
                    <span>Profile & Curated Wishlist</span>
                  </button>

                  {/* Accessibility Options */}
                  <button
                    onClick={() => {
                      setAccountMenuOpen(false);
                      onOpenAccessibility();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
                  >
                    <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
                    <span>Accessibility Suite (WCAG 2.1)</span>
                  </button>

                  <div className="my-1 border-t border-zinc-100" />

                  {/* Simulate Offline Resilience Toggle */}
                  <button
                    onClick={() => onToggleSimulatedOffline(!simulatedOffline)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      {simulatedOffline ? (
                        <WifiOff className="h-4 w-4 text-amber-600" />
                      ) : (
                        <Wifi className="h-4 w-4 text-emerald-600" />
                      )}
                      <span>Offline Simulation</span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        simulatedOffline
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {simulatedOffline ? 'Offline' : 'Online'}
                    </span>
                  </button>

                  <div className="my-1 border-t border-zinc-100" />

                  {/* Host Section */}
                  {!isAdminAuthenticated ? (
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        onOpenAdminLogin();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
                    >
                      <Lock className="h-4 w-4 text-zinc-500" />
                      <span>Host Portal Login</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setAccountMenuOpen(false);
                          onNavigate('admin');
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                      >
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span>Open Host Console</span>
                      </button>
                      <button
                        onClick={() => {
                          setAccountMenuOpen(false);
                          onAdminLogout();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4 text-rose-500" />
                        <span>Sign Out of Admin</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ================================================================= */}
      {/* MOBILE BOTTOM NAVIGATION BAR (The Classic App Nav Bar)            */}
      {/* ================================================================= */}
      <nav
        aria-label="Mobile Navigation Bar"
        className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-lg border-t border-zinc-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 flex items-center justify-around"
      >
        {/* Tab 1: Residences / Explore */}
        <button
          onClick={() => onNavigate('residences')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all ${
            activeView === 'residences'
              ? 'text-zinc-950 font-bold'
              : 'text-zinc-500 hover:text-zinc-800 font-medium'
          }`}
        >
          <div className="relative">
            <Compass
              className={`h-5 w-5 transition-transform ${
                activeView === 'residences' ? 'scale-110 text-zinc-950 stroke-[2.2]' : 'text-zinc-500'
              }`}
            />
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Explore</span>
        </button>

        {/* Tab 2: Map */}
        <button
          onClick={() => onNavigate('map')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all ${
            activeView === 'map'
              ? 'text-zinc-950 font-bold'
              : 'text-zinc-500 hover:text-zinc-800 font-medium'
          }`}
        >
          <div className="relative">
            <MapPin
              className={`h-5 w-5 transition-transform ${
                activeView === 'map' ? 'scale-110 text-zinc-950 stroke-[2.2]' : 'text-zinc-500'
              }`}
            />
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Map</span>
        </button>

        {/* Tab 3: Bookings */}
        <button
          onClick={() => onNavigate('bookings')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all ${
            activeView === 'bookings'
              ? 'text-zinc-950 font-bold'
              : 'text-zinc-500 hover:text-zinc-800 font-medium'
          }`}
        >
          <div className="relative">
            <CalendarCheck
              className={`h-5 w-5 transition-transform ${
                activeView === 'bookings' ? 'scale-110 text-zinc-950 stroke-[2.2]' : 'text-zinc-500'
              }`}
            />
            {activeBookingsCount > 0 && (
              <span className="absolute -top-1 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-950 px-1 text-[9px] font-bold text-white shadow-xs">
                {activeBookingsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Bookings</span>
        </button>

        {/* Tab 4: Notifications Inbox */}
        <button
          onClick={onOpenNotifications}
          className="flex flex-col items-center justify-center flex-1 py-1 px-1 text-zinc-500 hover:text-zinc-800 font-medium transition-all"
        >
          <div className="relative">
            <Bell className="h-5 w-5 text-zinc-500" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-0.5 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 ring-2 ring-white"></span>
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Alerts</span>
        </button>

        {/* Tab 5: Profile / Account */}
        <button
          onClick={() => {
            setAccountMenuOpen(!accountMenuOpen);
            setPrefModalOpen(false);
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all ${
            accountMenuOpen
              ? 'text-zinc-950 font-bold'
              : 'text-zinc-500 hover:text-zinc-800 font-medium'
          }`}
        >
          <div className="h-5 w-5 rounded-full bg-zinc-900 flex items-center justify-center text-white text-[9px] font-bold shadow-xs">
            RV
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Account</span>
        </button>
      </nav>
    </>
  );
};
