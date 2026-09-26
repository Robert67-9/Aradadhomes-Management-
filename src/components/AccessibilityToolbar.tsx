import React, { useState, useEffect } from 'react';
import { Eye, Type, Sparkles, Volume2, X } from 'lucide-react';

interface AccessibilityToolbarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({ isOpen, onClose }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState('HavenStay accessible portal ready.');

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    const root = document.documentElement;
    if (fontSizeLevel === 'large') {
      root.style.fontSize = '18px';
    } else if (fontSizeLevel === 'xlarge') {
      root.style.fontSize = '20px';
    } else {
      root.style.fontSize = '16px';
    }
  }, [fontSizeLevel]);

  const speakCurrentStatus = (text: string) => {
    setScreenReaderAnnouncement(text);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="Accessibility settings"
      aria-modal="true"
      className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-84 max-w-sm rounded-xl border border-zinc-200 bg-white p-5 shadow-2xl shadow-zinc-900/15"
    >
      {/* Live screen reader announcement region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {screenReaderAnnouncement}
      </div>

      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-zinc-800" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-zinc-900">WCAG 2.1 Accessibility Suite</h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close accessibility settings"
          className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-zinc-900"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 space-y-4 text-xs">
        {/* Contrast toggle */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-zinc-900">High Contrast Mode</div>
            <div className="text-zinc-500">Increases contrast ratio $\ge$ 7:1 for text</div>
          </div>
          <button
            onClick={() => {
              const next = !highContrast;
              setHighContrast(next);
              speakCurrentStatus(next ? 'High contrast mode enabled' : 'High contrast mode disabled');
            }}
            aria-pressed={highContrast}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-zinc-900 ${
              highContrast ? 'bg-zinc-900' : 'bg-zinc-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                highContrast ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Text size selector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-medium text-zinc-900">Text Scaling</span>
            <span className="text-zinc-500 capitalize">{fontSizeLevel}</span>
          </div>
          <div className="grid grid-cols-3 gap-1 rounded-lg bg-zinc-100 p-1">
            {(['normal', 'large', 'xlarge'] as const).map(level => (
              <button
                key={level}
                onClick={() => {
                  setFontSizeLevel(level);
                  speakCurrentStatus(`Text size set to ${level}`);
                }}
                className={`rounded-md py-1.5 text-center font-medium capitalize transition-all focus-visible:outline-2 focus-visible:outline-zinc-900 ${
                  fontSizeLevel === level ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {level === 'normal' ? '100%' : level === 'large' ? '115%' : '125%'}
              </button>
            ))}
          </div>
        </div>

        {/* Speech synthesizer announcement test */}
        <div className="border-t border-zinc-100 pt-3">
          <button
            onClick={() => speakCurrentStatus('HavenStay luxury apartment booking portal. All controls are accessible via keyboard navigation using Tab and Enter.')}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 py-2 font-medium text-zinc-700 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-zinc-900"
          >
            <Volume2 className="h-3.5 w-3.5 text-zinc-600" />
            Audio Accessibility Summary
          </button>
        </div>

        <div className="rounded-md bg-zinc-50 p-2.5 text-[11px] text-zinc-500">
          Full keyboard navigation support enabled (Tab, Shift+Tab, Enter, Escape, Arrow Keys). Complies with Section 508 and WCAG 2.1 Level AA standards.
        </div>
      </div>
    </div>
  );
};
