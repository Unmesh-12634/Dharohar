'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Globe, Check, ChevronDown, Sparkles } from 'lucide-react';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

interface LanguageOption {
  code: string;
  label: string;
  native: string;
  flag: string;
}

const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
];

export const GoogleTranslate: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<string>('en');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Helper to read cookie
  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[2]) : null;
  };

  useEffect(() => {
    // Check initial cookie
    const savedCookie = getCookie('googtrans');
    if (savedCookie) {
      const parts = savedCookie.split('/');
      const code = parts[parts.length - 1];
      if (code && code !== 'en') {
        setCurrentLang(code);
      }
    }

    // Define Google Translate Element init callback
    window.googleTranslateElementInit = () => {
      try {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,hi,gu,mr,bn,pa,ta,te,kn,ml,ur,es,fr,de,ja',
              autoDisplay: false,
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            },
            'google_translate_element'
          );
          setIsLoaded(true);
        }
      } catch (err) {
        console.warn('Google Translate initialization:', err);
      }
    };

    // Dynamically inject Google Translate script
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google && window.google.translate) {
      setIsLoaded(true);
    }

    // Close dropdown on outside click
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (langCode: string) => {
    try {
      if (langCode === 'en') {
        // Clear cookies to restore original English
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/;`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${window.location.hostname}; path=/;`;
      } else {
        document.cookie = `googtrans=/en/${langCode}; path=/;`;
        document.cookie = `googtrans=/en/${langCode}; domain=${window.location.hostname}; path=/;`;
        document.cookie = `googtrans=/en/${langCode}; domain=.${window.location.hostname}; path=/;`;
      }

      // Try triggering in-page combobox
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event('change'));
      } else {
        // Fallback reload so Google Translate engine picks up the cookie immediately
        window.location.reload();
      }

      setCurrentLang(langCode);
      setIsOpen(false);
    } catch (err) {
      console.error('Error switching language:', err);
      window.location.reload();
    }
  };

  const currentOption = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Hidden element for Google Translate script binding */}
      <div id="google_translate_element" style={{ display: 'none' }} />

      {/* Sleek Apple-styled Language Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn apple-pressable"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          fontSize: '0.74rem',
          fontWeight: 600,
          backgroundColor: '#FFFFFF',
          color: 'var(--color-forest)',
          border: '1.5px solid var(--border-gold)',
          borderRadius: 'var(--radius-sm)',
          boxShadow: '0 1px 3px rgba(30, 58, 43, 0.08)',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        title="Translate entire website using Google Translate"
      >
        <Globe size={13} color="var(--mewar-gold)" />
        <span style={{ fontSize: '0.80rem' }}>{currentOption.flag}</span>
        <span style={{ fontWeight: 700 }}>{currentOption.native}</span>
        <ChevronDown size={11} color="var(--text-secondary)" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
      </button>

      {/* Floating Language Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          right: 0,
          width: '210px',
          backgroundColor: '#FFFFFF',
          border: '1.5px solid var(--border-gold)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 8px 24px rgba(30, 58, 43, 0.18)',
          padding: '6px',
          zIndex: 100,
          backdropFilter: 'blur(16px)',
          animation: 'fadeIn 0.15s ease',
        }}>
          <div style={{
            padding: '6px 10px 4px 10px',
            fontSize: '0.67rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: 'var(--color-forest)',
            borderBottom: '1px solid var(--border-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '4px',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Globe size={11} color="var(--mewar-gold)" />
              Language / अनुवाद
            </span>
            <span style={{ fontSize: '0.62rem', color: 'var(--mewar-kesariya)', fontWeight: 700 }}>
              Google Powered
            </span>
          </div>

          <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLanguage(lang.code)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '7px 10px',
                    fontSize: '0.75rem',
                    borderRadius: 'var(--radius-xs)',
                    border: 'none',
                    backgroundColor: isSelected ? 'var(--mewar-forest-bg)' : 'transparent',
                    color: isSelected ? 'var(--color-forest)' : 'var(--text-primary)',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.90rem' }}>{lang.flag}</span>
                    <span>{lang.native}</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>({lang.label})</span>
                  </span>
                  {isSelected && <Check size={13} color="var(--color-forest)" />}
                </button>
              );
            })}
          </div>

          <div style={{
            borderTop: '1px solid var(--border-subtle)',
            marginTop: '4px',
            paddingTop: '6px',
            paddingLeft: '8px',
            paddingRight: '8px',
            paddingBottom: '4px',
            fontSize: '0.64rem',
            color: 'var(--text-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span>Translates all pages & twins</span>
            <span style={{ color: 'var(--color-forest)', fontWeight: 700 }}>AI Sync</span>
          </div>
        </div>
      )}
    </div>
  );
};
