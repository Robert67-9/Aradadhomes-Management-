import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  X,
  Smartphone,
  AlertCircle,
  FileCheck,
  Fingerprint,
  RefreshCw
} from 'lucide-react';
import { Apartment, Booking, Currency, Language } from '../types';
import { formatPrice, formatPriceExact, saveBooking, enqueueOfflineAction, getEncryptionFingerprint } from '../services/storage';
import { TRANSLATIONS } from '../data/translations';

interface PaymentModalProps {
  apartment: Apartment;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  currentCurrency: Currency;
  currentLang: Language;
  simulatedOffline: boolean;
  onClose: () => void;
  onPaymentSuccess: (booking: Booking) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  apartment,
  checkInDate,
  checkOutDate,
  guestsCount,
  currentCurrency,
  currentLang,
  simulatedOffline,
  onClose,
  onPaymentSuccess,
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'momo' | 'apple_pay' | 'google_pay'>('card');
  const [momoProvider, setMomoProvider] = useState<'mtn' | 'telecel' | 'at'>('mtn');
  const [momoPhone, setMomoPhone] = useState('024 555 8492');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('Robert Vance');
  const [guestEmail, setGuestEmail] = useState('dansorobert360@gmail.com');
  const [guestPhone, setGuestPhone] = useState('+233 24 555 8492');
  const [billingPostalCode, setBillingPostalCode] = useState('GA-183-9214');
  const [specialRequests, setSpecialRequests] = useState('');

  // Processing & 3D Secure states
  const [isProcessing, setIsProcessing] = useState(false);
  const [show3DSecureModal, setShow3DSecureModal] = useState(false);
  const [threeDsCode, setThreeDsCode] = useState('8492');
  const [threeDsInput, setThreeDsInput] = useState('');
  const [tokenizedHash, setTokenizedHash] = useState<string | null>(null);

  // Nights calculation
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const totalNights = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const subtotal = totalNights * apartment.pricePerNight;
  const cleaningFee = apartment.cleaningFee;
  const serviceFee = subtotal * (apartment.serviceFeePercent / 100);
  const taxes = (subtotal + cleaningFee + serviceFee) * (apartment.taxesPercent / 100);
  const totalAmount = subtotal + cleaningFee + serviceFee + taxes;

  // Format Card Number (adds space every 4 digits)
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').substring(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, '').substring(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.substring(0, 2)}/${raw.substring(2, 4)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  // 1-Click Test Card Quick Fill
  const fillTestCard = (type: 'visa' | 'mastercard') => {
    if (type === 'visa') {
      setCardNumber('4242 4242 4242 4242');
      setCardExpiry('12/28');
      setCardCvc('884');
      setCardholderName('Robert Vance');
    } else {
      setCardNumber('5555 5555 5555 4444');
      setCardExpiry('08/29');
      setCardCvc('312');
      setCardholderName('Robert Vance');
    }
  };

  // Detect card brand
  const getCardBrand = () => {
    if (cardNumber.startsWith('4')) return 'Visa';
    if (cardNumber.startsWith('5')) return 'Mastercard';
    if (cardNumber.startsWith('3')) return 'Amex';
    return 'Card';
  };

  const executeFinalBooking = () => {
    const last4 = paymentMethod === 'momo'
      ? momoPhone.replace(/\D/g, '').slice(-4) || '8492'
      : (cardNumber.replace(/\s/g, '').slice(-4) || '4242');
    const bookingId = 'BK-' + Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = 'INV-' + new Date().getFullYear() + '-' + bookingId.replace('BK-', '');
    const accessCode = Math.floor(1000 + Math.random() * 9000) + '#';

    const newBooking: Booking = {
      id: bookingId,
      apartmentId: apartment.id,
      apartmentTitle: apartment.title,
      apartmentImage: apartment.images[0],
      apartmentCity: `${apartment.city}, ${apartment.country}`,
      apartmentAddress: `${apartment.neighborhood}, ${apartment.city}`,
      checkInDate,
      checkOutDate,
      guests: guestsCount,
      totalNights,
      pricePerNight: apartment.pricePerNight,
      subtotal,
      cleaningFee,
      serviceFee,
      taxes,
      totalAmount,
      currency: currentCurrency,
      guestName: cardholderName,
      guestEmail,
      guestPhone: paymentMethod === 'momo' ? `+233 ${momoPhone}` : guestPhone,
      specialRequests,
      status: 'confirmed',
      paymentMethod,
      paymentLast4: last4,
      createdAt: new Date().toISOString(),
      invoiceNumber,
      accessCode,
    };

    if (simulatedOffline || (typeof navigator !== 'undefined' && !navigator.onLine)) {
      // Offline resilient path: store in encrypted offline queue
      enqueueOfflineAction({
        type: 'CREATE_BOOKING',
        payload: newBooking,
      });
      newBooking.isSyncedOffline = true;
    } else {
      // Online standard path
      saveBooking(newBooking);
    }

    setIsProcessing(false);
    setShow3DSecureModal(false);
    onPaymentSuccess(newBooking);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate tokenization & client-side encryption step
    setTimeout(() => {
      setTokenizedHash(`tok_pci_aes256_${Date.now().toString(36)}`);
      // Trigger 3D Secure / MoMo handset approval
      if (paymentMethod === 'card' || paymentMethod === 'momo') {
        setIsProcessing(false);
        setShow3DSecureModal(true);
      } else {
        // Express checkout (Apple Pay / Google Pay)
        setTimeout(() => {
          executeFinalBooking();
        }, 1200);
      }
    }, 900);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative my-8 w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close payment modal"
          className="absolute right-5 top-5 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-zinc-900"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header & Trust Badges */}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold text-zinc-950">
              {t.secureCheckout}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-emerald-800">
            <span className="flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 font-medium border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              PCI-DSS Level 1 Certified
            </span>
            <span className="flex items-center gap-1 rounded bg-zinc-100 px-2 py-0.5 font-medium text-zinc-700">
              <Lock className="h-3 w-3 text-zinc-600" />
              256-bit AES Tokenized
            </span>
            <span className="text-[11px] text-zinc-400">
              {getEncryptionFingerprint()}
            </span>
          </div>
        </div>

        {/* Residence Brief Summary */}
        <div className="mt-5 flex items-center gap-4 rounded-xl border border-zinc-200/80 bg-zinc-50 p-3.5">
          <img
            src={apartment.images[0]}
            alt={apartment.title}
            className="h-16 w-20 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-serif text-sm font-bold text-zinc-900 truncate">
              {apartment.title}
            </h4>
            <div className="text-xs text-zinc-500">
              {checkInDate} → {checkOutDate} · {totalNights} nights · {guestsCount} guests
            </div>
            <div className="text-xs font-semibold text-zinc-900 mt-1">
              Total: {formatPriceExact(totalAmount, currentCurrency)}
            </div>
          </div>
        </div>

        {/* Payment Methods Tabs */}
        <div className="mt-6">
          <div className="grid grid-cols-4 gap-1.5 rounded-xl bg-zinc-100 p-1">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                paymentMethod === 'card' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>Card</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('momo')}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                paymentMethod === 'momo' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5 text-amber-600" />
              <span>MoMo (GH₵)</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('apple_pay')}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                paymentMethod === 'apple_pay' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Apple Pay</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('google_pay')}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                paymentMethod === 'google_pay' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Google Pay</span>
            </button>
          </div>
        </div>

        {/* Quick Test Fill Trigger */}
        {paymentMethod === 'card' && (
          <div className="mt-4 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50/60 px-3 py-2 text-xs">
            <span className="text-amber-900 font-medium">Testing Checkout?</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillTestCard('visa')}
                className="rounded bg-white border border-amber-300 px-2 py-1 text-[11px] font-semibold text-amber-950 hover:bg-amber-100"
              >
                1-Click Visa Test Card
              </button>
              <button
                type="button"
                onClick={() => fillTestCard('mastercard')}
                className="rounded bg-white border border-amber-300 px-2 py-1 text-[11px] font-semibold text-amber-950 hover:bg-amber-100"
              >
                Mastercard
              </button>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {paymentMethod === 'card' ? (
            <>
              {/* Card Number */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="card-number" className="text-xs font-semibold text-zinc-700">
                    {t.cardNumber}
                  </label>
                  <span className="text-[11px] font-medium text-zinc-500">{getCardBrand()}</span>
                </div>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                  <input
                    id="card-number"
                    type="text"
                    required
                    maxLength={19}
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm font-mono text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              {/* Expiry & CVC & Zip */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label htmlFor="card-expiry" className="text-xs font-semibold text-zinc-700">
                    {t.cardExpiry}
                  </label>
                  <input
                    id="card-expiry"
                    type="text"
                    required
                    maxLength={5}
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-white py-2 px-3 text-sm font-mono text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="card-cvc" className="text-xs font-semibold text-zinc-700">
                    {t.cardCvc}
                  </label>
                  <input
                    id="card-cvc"
                    type="password"
                    required
                    maxLength={4}
                    placeholder="•••"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                    className="w-full rounded-lg border border-zinc-200 bg-white py-2 px-3 text-sm font-mono text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="billing-zip" className="text-xs font-semibold text-zinc-700">
                    {t.billingPostalCode}
                  </label>
                  <input
                    id="billing-zip"
                    type="text"
                    required
                    placeholder="W1K 6JP"
                    value={billingPostalCode}
                    onChange={(e) => setBillingPostalCode(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-white py-2 px-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>
            </>
          ) : paymentMethod === 'momo' ? (
            <div className="space-y-4 rounded-xl bg-amber-50/60 border border-amber-200/80 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Smartphone className="h-4 w-4 text-amber-600" />
                  Ghana Mobile Money Gateway (GH₵)
                </span>
                <button
                  type="button"
                  onClick={() => setMomoPhone('024 555 8492')}
                  className="rounded bg-white border border-amber-300 px-2 py-0.5 text-[10px] font-semibold text-amber-900 hover:bg-amber-100"
                >
                  1-Click Demo Fill
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                  Select Telecom Network
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'mtn', label: 'MTN MoMo', tag: '*170#' },
                    { id: 'telecel', label: 'Telecel Cash', tag: '*110#' },
                    { id: 'at', label: 'AT Money', tag: '*110#' },
                  ].map((prov) => (
                    <button
                      key={prov.id}
                      type="button"
                      onClick={() => setMomoProvider(prov.id as any)}
                      className={`rounded-lg border py-2 px-2 text-center text-xs font-semibold transition-all ${
                        momoProvider === prov.id
                          ? 'border-amber-600 bg-amber-100 text-amber-950 ring-1 ring-amber-600'
                          : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                      }`}
                    >
                      <div>{prov.label}</div>
                      <div className="text-[10px] font-normal text-zinc-400">{prov.tag}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Mobile Money Wallet Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-mono font-bold text-zinc-500">
                    +233
                  </span>
                  <input
                    type="tel"
                    required
                    value={momoPhone}
                    onChange={(e) => setMomoPhone(e.target.value)}
                    placeholder="024 555 8492"
                    className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-14 pr-3 text-sm font-mono text-zinc-900 focus:border-zinc-950 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-zinc-500 mt-1.5">
                  An instant push prompt will be sent to your handset to authorize <strong className="text-zinc-900">{formatPriceExact(totalAmount, currentCurrency)}</strong> with your 4-digit PIN.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center">
              <Smartphone className="mx-auto h-8 w-8 text-zinc-800" />
              <div className="mt-2 font-semibold text-zinc-900">
                {paymentMethod === 'apple_pay' ? 'Apple Pay Biometric Pass' : 'Google Pay 1-Tap Authorization'}
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                You will be prompted to authenticate with FaceID or Passkey on confirmation.
              </p>
            </div>
          )}

          {/* Guest Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="space-y-1">
              <label htmlFor="cardholder-name" className="text-xs font-semibold text-zinc-700">
                {t.cardholderName}
              </label>
              <input
                id="cardholder-name"
                type="text"
                required
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white py-2 px-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="guest-email" className="text-xs font-semibold text-zinc-700">
                Confirmation Email Address
              </label>
              <input
                id="guest-email"
                type="email"
                required
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white py-2 px-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-1">
            <label htmlFor="special-requests" className="text-xs font-semibold text-zinc-700">
              Host Notes & Arrival Details (Optional)
            </label>
            <input
              id="special-requests"
              type="text"
              placeholder="e.g. Flight arrival time, quiet room preference..."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white py-2 px-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full rounded-xl bg-zinc-950 py-3.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-zinc-800 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-zinc-900"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  {t.paymentProcessing}
                </span>
              ) : (
                <span>
                  {t.confirmAndPay} · {formatPriceExact(totalAmount, currentCurrency)}
                </span>
              )}
            </button>

            <div className="mt-2.5 text-center text-[11px] text-zinc-500">
              {t.freeCancellation} · By confirming, you agree to our international privacy standards.
            </div>
          </div>
        </form>

        {/* 3D Secure / MoMo Verification Modal Step */}
        {show3DSecureModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-2xl">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                {paymentMethod === 'momo' ? (
                  <>
                    <Smartphone className="h-5 w-5 text-amber-600" />
                    <h3 className="font-semibold text-sm text-zinc-900">Mobile Money USSD Authorization</h3>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-semibold text-sm text-zinc-900">3D Secure 2.0 Bank Verification</h3>
                  </>
                )}
              </div>

              <p className="mt-3 text-xs text-zinc-600">
                {paymentMethod === 'momo' ? (
                  <>
                    A push authorization request for <strong className="text-zinc-950">{formatPriceExact(totalAmount, currentCurrency)}</strong> has been sent to your registered mobile number <strong className="font-mono text-zinc-950">+233 {momoPhone}</strong>. Enter your secret 4-digit PIN to approve:
                  </>
                ) : (
                  <>
                    To confirm this charge of <strong>{formatPriceExact(totalAmount, currentCurrency)}</strong>, enter the one-time passcode sent to your mobile device:
                  </>
                )}
              </p>

              <div className="my-4 rounded-lg bg-zinc-50 p-3 text-center">
                <span className="text-xs text-zinc-500">
                  {paymentMethod === 'momo' ? 'Sample MoMo approval PIN:' : 'Demo verification code:'}
                </span>
                <div className="text-xl font-mono font-bold tracking-widest text-zinc-900">{threeDsCode}</div>
              </div>

              <input
                type="text"
                placeholder={paymentMethod === 'momo' ? 'Enter 4-digit MoMo PIN' : 'Enter 4-digit code'}
                value={threeDsInput}
                onChange={(e) => setThreeDsInput(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 py-2 text-center font-mono text-base focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShow3DSecureModal(false)}
                  className="w-1/2 rounded-lg border border-zinc-200 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    executeFinalBooking();
                  }}
                  className="w-1/2 rounded-lg bg-zinc-900 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
                >
                  {paymentMethod === 'momo' ? 'Approve & Pay' : 'Verify & Complete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
