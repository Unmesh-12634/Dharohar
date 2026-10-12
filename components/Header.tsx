'use client';

import React from 'react';
import { BasemapMode } from '@/lib/types';
import {
  Activity,
  CloudRain,
  Compass,
  Droplets,
  GitCommit,
  KeyRound,
  Layers,
  Satellite,
  ShieldCheck,
  Sliders,
  Sparkles,
  Sprout,
  UserCheck,
} from 'lucide-react';
import { STUDY_AREA } from '@/lib/geo-data';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onOpenSimulation: () => void;
  onOpenSettings: () => void;
  is3DTilesActive: boolean;
  activeInterventionsCount: number;
  basemapMode?: BasemapMode;
  onOpenRaindrop?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onOpenSimulation,
  onOpenSettings,
  is3DTilesActive,
  activeInterventionsCount,
  basemapMode = 'satellite',
  onOpenRaindrop,
}) => {
  return (
    <header className="apple-frosted-bar" style={{
      position: 'relative',
      zIndex: 40,
      borderBottom: '1px solid rgba(42, 72, 54, 0.16)',
      boxShadow: '0 2px 12px rgba(30, 58, 43, 0.05)',
    }}>
      {/* Top Telemetry Strip with Mewar Royal Gold Border */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '5px 24px',
        borderBottom: '1px solid var(--border-gold)',
        fontSize: '0.71rem',
        color: 'var(--text-secondary)',
        backgroundColor: '#F8F4EB',
        position: 'relative',
      }}>
        {/* Subtle royal gold hairline accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #C5A059 0%, #D97706 25%, #1E3A2B 50%, #1B4965 75%, #C5A059 100%)',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#1E3A2B',
              display: 'inline-block',
              boxShadow: '0 0 0 2px rgba(197, 160, 89, 0.4)',
            }} />
            <strong style={{ color: 'var(--color-forest)', fontWeight: 700, letterSpacing: '0.03em' }}>
              मेवाड़ संभाग • MEWAR WATERSHED CORRIDOR
            </strong>
            <span style={{ color: 'var(--mewar-gold)' }}>✦</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
              Udaipur Catchment ({STUDY_AREA.areaSqKm} km²)
            </span>
          </span>
          <span style={{ color: 'var(--border-strong)' }}>|</span>
          <span className="mono-text" style={{ fontSize: '0.67rem', color: 'var(--color-terracotta)', fontWeight: 700, letterSpacing: '0.04em' }}>
            अरावली पर्वतमाला • ARAVALLI GEOMORPHIC BASIN
          </span>
          <span style={{ color: 'var(--border-strong)' }}>|</span>
          <span className="mono-text" style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
            RELIEF: {STUDY_AREA.elevationRangeMeters.min}m – {STUDY_AREA.elevationRangeMeters.max}m MSL
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="badge badge-live" style={{ padding: '2px 9px', fontSize: '0.68rem', border: '1px solid rgba(46, 125, 50, 0.3)' }}>
            {is3DTilesActive
              ? '● Photorealistic 3D Tiles'
              : '● 3D World Terrain (Copernicus 30m DEM)'}
          </span>
          {activeInterventionsCount > 0 ? (
            <span className="badge" style={{ padding: '2px 9px', fontSize: '0.68rem', backgroundColor: '#FEF3C7', color: '#B45309', border: '1px solid #FCD34D' }}>
              🛡️ {activeInterventionsCount} Interventions Active
            </span>
          ) : (
            <span className="badge" style={{ padding: '2px 9px', fontSize: '0.68rem', backgroundColor: '#EDE5D5', color: '#665C47', border: '1px solid #D9CEB8' }}>
              Baseline Catchment
            </span>
          )}
          <button
            onClick={onOpenSettings}
            className="btn btn-ghost"
            style={{ padding: '2px 8px', fontSize: '0.70rem', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--border-gold)', backgroundColor: '#FFFFFF' }}
            title="Configure Google Maps & Gemini API Keys"
          >
            <KeyRound size={11} color="var(--mewar-gold)" />
            API Keys
          </button>
        </div>
      </div>

      {/* Main Command & Navigation Row with Authentic Mewar Identity */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '9px 24px',
        gap: '16px',
        backgroundColor: 'rgba(250, 248, 242, 0.96)',
        backdropFilter: 'blur(16px)',
      }}>
        {/* Brand identity with Mewar Royal Sun Crest & Bilingual Architecture */}
        <div
          onClick={() => onViewChange('overview')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', userSelect: 'none' }}
        >
          {/* Royal Mewar Crest Icon */}
          <div style={{
            width: '42px',
            height: '42px',
            background: 'linear-gradient(135deg, #1E3A2B 0%, #162C21 100%)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 3px 12px rgba(30, 58, 43, 0.28)',
            border: '1.5px solid var(--mewar-gold)',
            position: 'relative',
          }}>
            {/* Ornate Rajput Mehraab / Sun Icon */}
            <Compass size={22} style={{ color: '#F4E8CE' }} />
            <div style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              width: '8px',
              height: '8px',
              backgroundColor: '#D97706',
              borderRadius: '50%',
              border: '1.5px solid #FFFFFF',
            }} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 className="royal-title" style={{
                fontSize: '1.45rem',
                color: 'var(--color-forest)',
                letterSpacing: '0.04em',
                lineHeight: 1.05,
                margin: 0,
                fontWeight: 800,
              }}>
                DHAROHAR
              </h1>
              <span style={{
                fontSize: '0.65rem',
                fontFamily: 'var(--font-serif)',
                color: 'var(--mewar-kesariya)',
                fontWeight: 700,
                backgroundColor: '#FEF3C7',
                padding: '2px 7px',
                borderRadius: '3px',
                border: '1px solid #FCD34D',
                letterSpacing: '0.04em',
              }}>
                मेवाड़ जल-धरोहर • UDAIPUR TWIN
              </span>
            </div>
            <p style={{
              fontSize: '0.71rem',
              color: 'var(--text-secondary)',
              letterSpacing: '0.01em',
              margin: '3px 0 0 0',
              fontWeight: 400,
            }}>
              झीलों की नगरी • Ridge-to-Lake Geospatial Intelligence & Conservation Architecture
            </p>
          </div>
        </div>

        {/* View Tabs - 5 Core Modules + Overview with Mewar Styling */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          backgroundColor: '#EDE5D5',
          padding: '4px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-gold)',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <button
            onClick={() => onViewChange('map')}
            className={`nav-tab ${currentView === 'map' ? 'active' : ''}`}
            title="1. Fullscreen 3D Watershed Explorer"
            style={{ padding: '6px 11px', fontSize: '0.78rem' }}
          >
            <Layers size={14} />
            <span>1. 3D Watershed</span>
          </button>

          <button
            onClick={() => onViewChange('trace')}
            className={`nav-tab ${currentView === 'trace' ? 'active' : ''}`}
            title="Connect the 5 Landscape Elements: Mountain to Lake"
            style={{ padding: '6px 11px', fontSize: '0.78rem' }}
          >
            <GitCommit size={14} />
            <span>2. Upstream Tracer</span>
          </button>

          <button
            onClick={() => onViewChange('simulation')}
            className={`nav-tab ${currentView === 'simulation' ? 'active' : ''}`}
            title="Monsoon Runoff & Flood Impact Simulator (SCS-CN)"
            style={{ padding: '6px 11px', fontSize: '0.78rem' }}
          >
            <CloudRain size={14} />
            <span>3. Monsoon Sim</span>
          </button>

          <button
            onClick={() => onViewChange('satellite')}
            className={`nav-tab ${currentView === 'satellite' ? 'active' : ''}`}
            title="Sentinel-2 Multi-temporal Spectral Change Scrubber"
            style={{ padding: '6px 11px', fontSize: '0.78rem' }}
          >
            <Satellite size={14} />
            <span>4. Satellite Scrubber</span>
          </button>

          <button
            onClick={() => onViewChange('interventions')}
            className={`nav-tab ${currentView === 'interventions' ? 'active' : ''}`}
            title="Conservation Intervention Lab (Before vs After Policy Battle)"
            style={{ padding: '6px 11px', fontSize: '0.78rem' }}
          >
            <ShieldCheck size={14} />
            <span>5. Intervention Lab</span>
          </button>

          <button
            onClick={() => onViewChange('field-action')}
            className={`nav-tab ${currentView === 'field-action' ? 'active' : ''}`}
            title="Field Action Network: Ground Audits & Official Dossiers"
            style={{ padding: '6px 11px', fontSize: '0.78rem' }}
          >
            <UserCheck size={14} />
            <span>6. Field Net</span>
          </button>

          <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--mewar-gold)', opacity: 0.5, margin: '0 2px' }} />

          <button
            onClick={() => onViewChange('overview')}
            className={`nav-tab ${currentView === 'overview' ? 'active' : ''}`}
            title="Basin Health Overview & Executive Analytics"
            style={{ padding: '6px 10px', fontSize: '0.78rem' }}
          >
            <Compass size={14} />
            <span>Overview</span>
          </button>
        </nav>

        {/* Primary Action Buttons with Mewar Kesariya & Azure accents */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onOpenRaindrop && (
            <button
              onClick={onOpenRaindrop}
              className="btn apple-pressable"
              style={{
                padding: '7px 13px',
                fontSize: '0.80rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'var(--mewar-lake-bg)',
                color: 'var(--mewar-lake)',
                border: '1.5px solid rgba(27, 73, 101, 0.35)',
                borderRadius: 'var(--radius-sm)',
              }}
              title="Launch Virtual Raindrop 3D Particle Tracer (D8 Gravity Downhill Flow)"
            >
              <Droplets size={14} color="var(--mewar-lake)" />
              <span>💧 जल प्रवाह (Raindrop Flow)</span>
            </button>
          )}

          <button
            onClick={onOpenSimulation}
            className="btn apple-pressable"
            style={{
              padding: '7px 15px',
              fontSize: '0.80rem',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #BD5637 0%, #A04026 100%)',
              color: '#FFFFFF',
              border: '1px solid #8E361D',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 3px 12px rgba(189, 86, 55, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <CloudRain size={15} />
            <span>🌧️ वर्षा सिमुलेशन (Monsoon Pulse)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
