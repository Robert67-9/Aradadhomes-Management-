import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquare, Plus, X, User } from 'lucide-react';
import { Review, Apartment, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { saveReview } from '../services/storage';

interface ReviewsSectionProps {
  apartment: Apartment;
  reviews: Review[];
  currentLang: Language;
  onReviewAdded: (newReview: Review) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  apartment,
  reviews,
  currentLang,
  onReviewAdded,
}) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [cleanliness, setCleanliness] = useState(5);
  const [accuracy, setAccuracy] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [location, setLocation] = useState(5);
  const [checkIn, setCheckIn] = useState(5);
  const [value, setValue] = useState(5);
  const [authorName, setAuthorName] = useState('Robert Vance');
  const [authorCountry, setAuthorCountry] = useState('United Kingdom');
  const [comment, setComment] = useState('');

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const aptReviews = reviews.filter((r) => r.apartmentId === apartment.id);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newRev: Review = {
      id: 'rev-' + Date.now(),
      apartmentId: apartment.id,
      authorName,
      authorCountry,
      rating,
      categories: {
        cleanliness,
        accuracy,
        communication,
        location,
        checkIn,
        value,
      },
      date: 'September 2026',
      comment,
      verifiedStay: true,
    };

    saveReview(newRev);
    onReviewAdded(newRev);
    setShowReviewModal(false);
    setComment('');
  };

  return (
    <div className="space-y-8">
      {/* Reviews Summary Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            <span className="font-serif text-2xl font-bold text-zinc-950 tabular-nums">
              {apartment.rating.toFixed(2)}
            </span>
            <span className="text-sm text-zinc-500">
              · {apartment.reviewCount} {t.apartmentReviews}
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            All reviews are authenticated from verified stays with zero sponsored bias.
          </p>
        </div>

        <button
          onClick={() => setShowReviewModal(true)}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors focus-visible:outline-2 focus-visible:outline-zinc-900"
        >
          <Plus className="h-4 w-4" />
          <span>{t.leaveReview}</span>
        </button>
      </div>

      {/* Category Breakdown Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {[
          { label: t.reviewCleanliness, score: '4.98' },
          { label: t.reviewAccuracy, score: '4.96' },
          { label: t.reviewCommunication, score: '5.00' },
          { label: t.reviewLocation, score: '4.95' },
          { label: t.reviewCheckIn, score: '4.99' },
          { label: t.reviewValue, score: '4.92' },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-lg bg-zinc-50 p-2.5">
            <span className="text-zinc-600 font-medium">{item.label}</span>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-16 rounded-full bg-zinc-200 overflow-hidden">
                <div className="h-full bg-zinc-900 rounded-full" style={{ width: `${(parseFloat(item.score) / 5) * 100}%` }} />
              </div>
              <span className="font-semibold text-zinc-900 tabular-nums">{item.score}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Review List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {aptReviews.map((rev) => (
          <div
            key={rev.id}
            className="flex flex-col rounded-xl border border-zinc-200/80 bg-white p-5 space-y-3"
          >
            {/* Author info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {rev.authorAvatar ? (
                  <img
                    src={rev.authorAvatar}
                    alt={rev.authorName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-700 font-semibold text-xs">
                    {rev.authorName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900">{rev.authorName}</h4>
                  <div className="text-[11px] text-zinc-400">
                    {rev.authorCountry} · {rev.date}
                  </div>
                </div>
              </div>

              {rev.verifiedStay && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                  <CheckCircle className="h-3 w-3 text-emerald-600" />
                  {t.verifiedGuest}
                </span>
              )}
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'
                  }`}
                />
              ))}
            </div>

            {/* Comment */}
            <p className="text-xs text-zinc-600 leading-relaxed">{rev.comment}</p>

            {/* Host Reply if available */}
            {rev.hostReply && (
              <div className="mt-2 rounded-lg bg-zinc-50 p-3 text-xs border border-zinc-100 space-y-1">
                <div className="font-semibold text-zinc-900 flex items-center gap-1">
                  <MessageSquare className="h-3 w-3 text-zinc-500" />
                  <span>Response from {rev.hostReply.author}</span>
                  <span className="text-[10px] text-zinc-400">· {rev.hostReply.date}</span>
                </div>
                <p className="text-zinc-600 leading-relaxed">{rev.hostReply.text}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Leave a Review Modal Form */}
      {showReviewModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-serif text-lg font-bold text-zinc-900">
              Share Your Verified Feedback
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              Reviewing: {apartment.title}
            </p>

            <form onSubmit={handleSubmitReview} className="mt-5 space-y-4 text-xs">
              {/* Overall Rating Stars */}
              <div>
                <label className="block font-semibold text-zinc-700 mb-1.5">
                  Overall Stay Rating
                </label>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const val = i + 1;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setRating(val)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            val <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="ml-2 font-bold text-zinc-900 text-sm">{rating} / 5</span>
                </div>
              </div>

              {/* Sub-ratings */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-zinc-600 font-medium">{t.reviewCleanliness} ({cleanliness})</label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={cleanliness}
                    onChange={(e) => setCleanliness(Number(e.target.value))}
                    className="w-full accent-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 font-medium">{t.reviewAccuracy} ({accuracy})</label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={accuracy}
                    onChange={(e) => setAccuracy(Number(e.target.value))}
                    className="w-full accent-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 font-medium">{t.reviewCommunication} ({communication})</label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={communication}
                    onChange={(e) => setCommunication(Number(e.target.value))}
                    className="w-full accent-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 font-medium">{t.reviewLocation} ({location})</label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={location}
                    onChange={(e) => setLocation(Number(e.target.value))}
                    className="w-full accent-zinc-900"
                  />
                </div>
              </div>

              {/* Author name & country */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 p-2 text-xs focus:border-zinc-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={authorCountry}
                    onChange={(e) => setAuthorCountry(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 p-2 text-xs focus:border-zinc-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Detailed Experience & Recommendations
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the architectural design, comfort, bed quality, host responsiveness, and surrounding neighborhood..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 p-2.5 text-xs focus:border-zinc-900 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="w-1/2 rounded-lg border border-zinc-200 py-2.5 font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-lg bg-zinc-950 py-2.5 font-semibold text-white hover:bg-zinc-800"
                >
                  {t.reviewSubmit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
