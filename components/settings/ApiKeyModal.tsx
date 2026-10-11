'use client';

import React, { useState } from 'react';
import { Check, ExternalLink, KeyRound, ShieldAlert, X } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  googleMapsKey: string;
  geminiKey: string;
  onSaveKeys: (googleKey: string, geminiKey: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  googleMapsKey,
  geminiKey,
  onSaveKeys,
}) => {
  const [tempGoogleKey, setTempGoogleKey] = useState(googleMapsKey);
  const [tempGeminiKey, setTempGeminiKey] = useState(geminiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKeys(tempGoogleKey.trim(), tempGeminiKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(28, 34, 32, 0.45)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 110,
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-popover)',
        width: '100%',
        maxWidth: '560px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <KeyRound size={20} color="var(--color-forest)" />
            <h2 className="serif-title" style={{ fontSize: '1.3rem', color: 'var(--color-forest)' }}>
              Geospatial API Keys & Credentials
            </h2>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{
          backgroundColor: 'rgba(46, 125, 50, 0.08)',
          border: '1px solid rgba(46, 125, 50, 0.25)',
          borderRadius: 'var(--radius-xs)',
          padding: '10px 14px',
          fontSize: '0.78rem',
          lineHeight: 1.5,
          color: 'var(--color-forest)',
        }}>
          <strong>✨ 100% Free Mode Active (No Credit Card / No Auto-Pay Needed)</strong>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.74rem' }}>
            You do <strong>not</strong> need to set up Google auto-pay or billing. Dharohar includes free high-resolution satellite imagery (Esri World Imagery), Sentinel-2 Earth view, and topographic basemaps out of the box with zero setup.
          </p>
        </div>

        {/* Google Maps Platform API Key Input */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Google Maps Tile API Key (Optional - Only if you already have one):
            </label>
            <a
              href="https://developers.google.com/maps/documentation/tile/3d-tiles-overview"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: '0.72rem', color: 'var(--color-lake)', display: 'flex', alignItems: 'center', gap: '3px' }}
            >
              Docs <ExternalLink size={10} />
            </a>
          </div>
          <input
            type="password"
            placeholder="AIzaSy..."
            value={tempGoogleKey}
            onChange={(e) => setTempGoogleKey(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-strong)',
              backgroundColor: 'var(--bg-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.80rem',
            }}
          />
          <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: '3px', display: 'block' }}>
            Enables Google Photorealistic 3D Tiles in CesiumJS with required Google attribution.
          </span>
        </div>

        {/* Gemini API Key Input */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Google AI Gemini API Key:
            </label>
            <a
              href="https://aistudio.google.com"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: '0.72rem', color: 'var(--color-lake)', display: 'flex', alignItems: 'center', gap: '3px' }}
            >
              Google AI Studio <ExternalLink size={10} />
            </a>
          </div>
          <input
            type="password"
            placeholder="AIzaSy..."
            value={tempGeminiKey}
            onChange={(e) => setTempGeminiKey(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-strong)',
              backgroundColor: 'var(--bg-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.80rem',
            }}
          />
          <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: '3px', display: 'block' }}>
            Powers the Aravalli Copilot with structured observation-cause-risk-recommendation outputs.
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-primary" style={{ padding: '8px 20px' }}>
            {savedSuccess ? (
              <>
                <Check size={14} />
                Keys Saved!
              </>
            ) : (
              'Save & Apply'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
