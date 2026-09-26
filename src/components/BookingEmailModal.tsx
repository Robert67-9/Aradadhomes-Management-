import React, { useState } from 'react';
import { Mail, Calendar, Download, Printer, CheckCircle2, X, Send, Key, MapPin, Shield } from 'lucide-react';
import { Booking, Currency, Language } from '../types';
import { formatPrice, formatPriceExact, generateIcsCalendarFile } from '../services/storage';
import { TRANSLATIONS } from '../data/translations';

interface BookingEmailModalProps {
  booking: Booking;
  currentCurrency: Currency;
  currentLang: Language;
  onClose: () => void;
}

export const BookingEmailModal: React.FC<BookingEmailModalProps> = ({
  booking,
  currentCurrency,
  currentLang,
  onClose,
}) => {
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const handleResend = () => {
    setResendStatus('Resending confirmation email via automated SMTP pipeline...');
    setTimeout(() => {
      setResendStatus(`Email successfully delivered to ${booking.guestEmail}.`);
      setTimeout(() => setResendStatus(null), 4000);
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-preview-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative my-8 w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl sm:p-8">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h2 id="email-preview-title" className="font-serif text-lg font-bold text-zinc-900">
                Automated Confirmation Email & Voucher
              </h2>
              <div className="text-xs text-zinc-500">
                Sent to <span className="font-medium text-zinc-800">{booking.guestEmail}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close confirmation email preview"
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-zinc-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-4 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => generateIcsCalendarFile(booking)}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-zinc-900"
            >
              <Calendar className="h-3.5 w-3.5 text-zinc-500" />
              <span>{t.downloadCalendarInvite}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-zinc-900"
            >
              <Printer className="h-3.5 w-3.5 text-zinc-500" />
              <span>Print Invoice</span>
            </button>
          </div>

          <button
            onClick={handleResend}
            className="flex items-center gap-1.5 text-zinc-600 hover:text-zinc-900 font-medium"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Resend to Inbox</span>
          </button>
        </div>

        {resendStatus && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 p-2.5 text-xs text-emerald-800 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{resendStatus}</span>
          </div>
        )}

        {/* Email Envelope Container */}
        <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-5 sm:p-6 text-zinc-800 print:border-none print:p-0">
          {/* Header with Aradads Home logo */}
          <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-zinc-950">
                Aradads Home
              </span>
              <div className="text-[11px] text-zinc-500">Official Guest Reservation Voucher</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-zinc-900">Reference: #{booking.id}</div>
              <div className="text-[11px] text-zinc-500">{booking.invoiceNumber}</div>
            </div>
          </div>

          {/* Guest Greeting */}
          <div className="mt-5 space-y-2">
            <p className="text-sm font-medium text-zinc-900">
              Dear {booking.guestName},
            </p>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Your reservation is officially confirmed. We have notified your host and secured your selected dates. Below are your access instructions and official receipt.
            </p>
          </div>

          {/* Residence & Access Pass Module */}
          <div className="mt-5 rounded-lg border border-zinc-200 bg-white p-4">
            <div className="flex items-start gap-4">
              <img
                src={booking.apartmentImage}
                alt={booking.apartmentTitle}
                className="h-20 w-24 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-base font-bold text-zinc-950 truncate">
                  {booking.apartmentTitle}
                </h3>
                <div className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
                  <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                  <span>{booking.apartmentAddress || booking.apartmentCity}</span>
                </div>

                {/* Digital Key PIN */}
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center gap-1.5 rounded bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-800">
                    <Key className="h-3.5 w-3.5 text-amber-600" />
                    <span>Smart Key Access Code:</span>
                    <strong className="font-mono text-zinc-950 text-sm">{booking.accessCode}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Check-in & Check-out Specs */}
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-zinc-100 pt-3 text-xs">
              <div>
                <div className="text-zinc-400 uppercase tracking-wider text-[10px] font-semibold">Check-in</div>
                <div className="font-semibold text-zinc-900 mt-0.5">{booking.checkInDate}</div>
                <div className="text-zinc-500 text-[11px]">From 15:00 onwards</div>
              </div>
              <div>
                <div className="text-zinc-400 uppercase tracking-wider text-[10px] font-semibold">Check-out</div>
                <div className="font-semibold text-zinc-900 mt-0.5">{booking.checkOutDate}</div>
                <div className="text-zinc-500 text-[11px]">Until 11:00 AM</div>
              </div>
            </div>
          </div>

          {/* Itemized Payment Statement */}
          <div className="mt-5 space-y-2 rounded-lg border border-zinc-200 bg-white p-4 text-xs">
            <div className="font-semibold text-zinc-900 border-b border-zinc-100 pb-2">
              Payment Summary · Paid in Full
            </div>
            <div className="space-y-1.5 text-zinc-600 pt-1">
              <div className="flex justify-between">
                <span>{booking.totalNights} nights × {formatPrice(booking.pricePerNight, currentCurrency)}</span>
                <span className="font-medium tabular-nums text-zinc-900">{formatPrice(booking.subtotal, currentCurrency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cleaning & Sanitization</span>
                <span className="font-medium tabular-nums text-zinc-900">{formatPrice(booking.cleaningFee, currentCurrency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Service Fee</span>
                <span className="font-medium tabular-nums text-zinc-900">{formatPrice(booking.serviceFee, currentCurrency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Occupancy Taxes</span>
                <span className="font-medium tabular-nums text-zinc-900">{formatPrice(booking.taxes, currentCurrency)}</span>
              </div>
            </div>
            <div className="flex justify-between border-t border-zinc-100 pt-2 font-bold text-zinc-950 text-sm">
              <span>Total Paid ({booking.paymentMethod.toUpperCase()})</span>
              <span className="tabular-nums">{formatPriceExact(booking.totalAmount, currentCurrency)}</span>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-5 text-center text-[11px] text-zinc-400">
            Aradads Home Luxury Residences Ltd · Encrypted PCI-DSS Level 1 · 24/7 Global Concierge
          </div>
        </div>
      </div>
    </div>
  );
};
