import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Shield,
  Send,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Building2,
  Calendar,
  Zap,
  HelpCircle,
  Car
} from 'lucide-react';
import { Apartment } from '../types';

interface ContactPageProps {
  apartments: Apartment[];
  onSelectApartment?: (apartment: Apartment) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  apartments,
  onSelectApartment
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '+233 ',
    inquiryType: 'reservation',
    residenceId: 'apt-cantonments-accra',
    dates: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const ticketNumber = `AD-GH-${Math.floor(100000 + Math.random() * 900000)}`;
      setIsSubmitting(false);
      setSubmittedTicket(ticketNumber);
      setFormData({
        fullName: '',
        email: '',
        phone: '+233 ',
        inquiryType: 'reservation',
        residenceId: 'apt-cantonments-accra',
        dates: '',
        message: ''
      });
    }, 900);
  };

  const faqs = [
    {
      q: 'How does electricity and water backup work during local outages?',
      a: 'All Aradads Home residences in Accra and Aburi are equipped with dual 24/7 backup systems: automatic silent diesel generators and solar battery inverters with sub-second cutover, plus on-site pressurized treated water reservoirs. You will enjoy 100% uninterrupted power, high-speed fiber internet, and climate control throughout your stay.'
    },
    {
      q: 'Do you offer airport pickup from Kotoka International Airport (ACC)?',
      a: 'Yes! Complimentary executive chauffeur pickup from Kotoka International Airport is included for guests staying at our Cantonments and Airport Residential suites, and available upon request across all residences. Your driver will meet you inside the terminal with an Aradads Home tablet.'
    },
    {
      q: 'What payment options are supported?',
      a: 'We accept MTN Mobile Money (MoMo), Telecel Cash, International Visa / Mastercard, and wire transfers. All payments are encrypted with bank-grade 256-bit SSL protocols.'
    },
    {
      q: 'What are the standard check-in and check-out times?',
      a: 'Standard check-in begins at 14:00 GMT and check-out is by 11:00 GMT. Early check-in or late check-out can be arranged through the concierge desk subject to availability.'
    },
    {
      q: 'Can I book long-term corporate or diplomatic stays?',
      a: 'Yes. We cater to diplomats, international executives, diaspora returnees, and families. Special weekly and monthly corporate rates with dedicated housekeeping are available through this concierge contact form.'
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 pt-8 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-amber-50/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-900 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Official Concierge & Guest Relations</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950">
            Connect with Aradads Home
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
            Located in Accra, Ghana. Whether you are planning a luxury holiday, diplomatic residence, or corporate stay, our private concierge is available 24/7 to assist you.
          </p>
        </div>

        {/* Top Channels Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Channel 1: WhatsApp Direct */}
          <div className="group relative rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-6 shadow-xs hover:shadow-md transition-all hover:border-emerald-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-bold text-zinc-950">
              WhatsApp Concierge
            </h3>
            <p className="mt-1 text-xs text-zinc-600 leading-relaxed">
              Instant responses within 5 minutes for reservations, live photo requests, and arrival coordination.
            </p>
            <div className="mt-4 font-mono text-sm font-semibold text-emerald-950">
              +233 24 412 8901
            </div>
            <a
              href="https://wa.me/233244128901?text=Hello%20Aradads%20Home%20Concierge,%20I%20am%20inquiring%20about%20booking%20a%20luxury%20residence%20in%20Ghana."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              <span>Chat on WhatsApp</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Channel 2: Telephone & Emergency Support */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs hover:shadow-md transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm">
              <Phone className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-bold text-zinc-950">
              Direct Phone & Support
            </h3>
            <p className="mt-1 text-xs text-zinc-600 leading-relaxed">
              Speak directly with our Ghana reservations team or 24/7 on-call estate manager.
            </p>
            <div className="mt-4 space-y-1 font-mono text-xs text-zinc-900">
              <div><span className="font-semibold text-zinc-500">Hotline:</span> +233 (0) 24 412 8901</div>
              <div><span className="font-semibold text-zinc-500">Landline:</span> +233 (0) 30 298 7654</div>
            </div>
            <a
              href="tel:+233244128901"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Call Reservations</span>
            </a>
          </div>

          {/* Channel 3: Email & Corporate Bookings */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs hover:shadow-md transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600 text-white shadow-sm">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-bold text-zinc-950">
              Email Reservations
            </h3>
            <p className="mt-1 text-xs text-zinc-600 leading-relaxed">
              For corporate invoice billing, diplomatic clearance, and bespoke itineraries.
            </p>
            <div className="mt-4 space-y-1 font-mono text-xs text-zinc-900">
              <div>concierge@aradadshome.com</div>
              <div>reservations@aradadshome.com</div>
            </div>
            <a
              href="mailto:concierge@aradadshome.com?subject=Aradads%20Home%20Reservation%20Inquiry"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Send Email</span>
            </a>
          </div>

        </div>

        {/* Main Section: Contact Form + Location & Assurance Details */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Form */}
          <div className="lg:col-span-7 rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-5">
              <div>
                <h2 className="font-serif text-2xl font-bold text-zinc-950">
                  Send a Concierge Request
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Average response time is under 15 minutes during operating hours.
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200/60">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Live Desk Active</span>
              </div>
            </div>

            {submittedTicket ? (
              <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 sm:p-8 text-center space-y-4 animate-in fade-in duration-300">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-emerald-950">
                  Request Dispatched to Concierge
                </h3>
                <p className="text-xs sm:text-sm text-emerald-900 max-w-md mx-auto leading-relaxed">
                  Thank you! Your ticket reference number is <strong className="font-mono text-zinc-950 bg-white/80 px-2 py-0.5 rounded border border-emerald-200">{submittedTicket}</strong>. Our Ghana reservations manager will contact you via WhatsApp or Email promptly.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setSubmittedTicket(null)}
                    className="rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-emerald-800 transition-colors"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kwame Mensah / Sarah Jenkins"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700">
                      Phone / WhatsApp Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+233 24 000 0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-none font-mono transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:bg-white focus:outline-none transition-colors"
                    >
                      <option value="reservation">Residence Reservation</option>
                      <option value="long_stay">Long-term / Corporate Stay</option>
                      <option value="airport">Kotoka Airport Chauffeur</option>
                      <option value="diplomatic">Diplomatic Delegation</option>
                      <option value="host">Host Partnership / Property Owner</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700">
                      Residence of Interest
                    </label>
                    <select
                      value={formData.residenceId}
                      onChange={(e) => setFormData({ ...formData, residenceId: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-900 focus:bg-white focus:outline-none transition-colors"
                    >
                      {apartments.map((apt) => (
                        <option key={apt.id} value={apt.id}>
                          {apt.title} ({apt.neighborhood})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700">
                      Target Dates (Arrival & Departure)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Oct 15 – Oct 22, 2026"
                      value={formData.dates}
                      onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700">
                    Special Requirements or Questions <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your trip: number of guests, airport pickup requirements, dietary preferences, or specific inquiries..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                    <Shield className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Your personal data is encrypted & strictly confidential.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-7 py-3 text-xs font-semibold text-white shadow-md hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-zinc-950 disabled:opacity-50 transition-all active:scale-95"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Sending to Concierge...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        <span>Submit Concierge Request</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Physical Locations + Tech Engineering Badge */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Accra Locations Card */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-zinc-950">
                    Our Ghana Residences & Lounges
                  </h3>
                  <div className="text-xs text-zinc-500">Greater Accra & Eastern Region</div>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-3.5 space-y-1">
                  <div className="font-semibold text-zinc-900 flex items-center justify-between">
                    <span>Cantonments Executive Lounge</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full font-medium">Head Concierge</span>
                  </div>
                  <div className="text-zinc-600">No. 14 Jawaharlal Nehru Road, Cantonments, Accra</div>
                  <div className="text-zinc-400 text-[11px]">Daily 07:00 – 22:00 GMT</div>
                </div>

                <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-3.5 space-y-1">
                  <div className="font-semibold text-zinc-900 flex items-center justify-between">
                    <span>Airport Residential Enclave</span>
                    <span className="text-[10px] text-zinc-600 bg-zinc-200/60 px-2 py-0.5 rounded-full font-medium">5 Min from ACC</span>
                  </div>
                  <div className="text-zinc-600">Senchi Street, Airport Residential Area, Accra</div>
                  <div className="text-zinc-400 text-[11px]">24/7 Airport Arrival Dispatch</div>
                </div>

                <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-3.5 space-y-1">
                  <div className="font-semibold text-zinc-900 flex items-center justify-between">
                    <span>Aburi Hills Mountain Retreat</span>
                    <span className="text-[10px] text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full font-medium">Mountain Haven</span>
                  </div>
                  <div className="text-zinc-600">Akwapim Ridge Panoramic Overlook, Aburi</div>
                  <div className="text-zinc-400 text-[11px]">Weekend Getaways & Executive Retreats</div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="border-t border-zinc-100 pt-5 grid grid-cols-2 gap-3 text-[11px]">
                <div className="flex items-center gap-2 text-zinc-700">
                  <Zap className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>24/7 Standby Power</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-700">
                  <Car className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Airport Chauffeur</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-700">
                  <Shield className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Gated 24/7 Security</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-700">
                  <Clock className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>Instant Concierge</span>
                </div>
              </div>
            </div>

            {/* POWERED BY JAMS TECH BRANDING CARD */}
            <div className="rounded-3xl border border-zinc-900/10 bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 sm:p-7 text-white shadow-lg relative overflow-hidden">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl" />
              <div className="relative space-y-3">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300 border border-zinc-700">
                  <span>Technology Partner</span>
                </div>

                <div className="flex items-baseline gap-2">
                  <h4 className="font-serif text-xl font-bold tracking-tight text-white">
                    Powered by JAMS TECH
                  </h4>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  Enterprise-grade digital hospitality architecture engineered by <strong>JAMS TECH</strong>. Designed with sub-second availability synchronization, 256-bit PCI-DSS encrypted payment pipelines, and high-performance serverless edge deployment.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] font-mono text-zinc-400">
                  <span className="rounded bg-zinc-800 px-2 py-0.5 border border-zinc-700">Python FastAPI</span>
                  <span className="rounded bg-zinc-800 px-2 py-0.5 border border-zinc-700">Supabase PostgreSQL</span>
                  <span className="rounded bg-zinc-800 px-2 py-0.5 border border-zinc-700">Edge CDN</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* FAQ Section */}
        <div className="mt-16 rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-xs">
          <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="h-4 w-4" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-zinc-950">
            Everything you need to know about staying in Ghana
          </h2>

          <div className="mt-8 divide-y divide-zinc-100">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between text-left text-sm font-semibold text-zinc-900 hover:text-zinc-700 transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180 text-zinc-900' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <p className="mt-3 text-xs sm:text-sm text-zinc-600 leading-relaxed pr-6 animate-in fade-in duration-200">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
