'use client';

import React from 'react';
import { BasemapMode } from '@/lib/types';
import {
  Activity,
  CloudRain,
  Compass,
  Droplets,
  KeyRound,
  Layers,
  Leaf,
  ShieldCheck,
  Sprout,
  UserCheck,
  Users,
} from 'lucide-react';
import { STUDY_AREA } from '@/lib/geo-data';
import { GoogleTranslate } from '@/components/common/GoogleTranslate';

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
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid var(--fine-border)',
      boxShadow: '0 1px 4px rgba(23, 61, 45, 0.04)',
    }}>
      {/* 1. Top Utility Strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '5px 24px',
        borderBottom: '1px solid var(--fine-border)',
        fontSize: '0.72rem',
        color: 'var(--secondary-text)',
        backgroundColor: 'var(--bg-warm-ivory)',
      }}>
        {/* Left Telemetry Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-forest)',
              display: 'inline-block',
            }} />
            <strong style={{ color: 'var(--primary-forest)', fontWeight: 600 }}>
              Mewar Watershed Corridor
            </strong>
          </span>
          <span style={{ color: 'var(--fine-border)' }}>|</span>
          <span style={{ color: 'var(--primary-text)', fontWeight: 500 }}>
            Udaipur Catchment ({STUDY_AREA.areaSqKm} km²)
          </span>
          <span style={{ color: 'var(--fine-border)' }}>|</span>
          <span style={{ color: 'var(--status-error)', fontWeight: 600 }}>
            Aravalli Geomorphic Basin
          </span>
          <span style={{ color: 'var(--fine-border)' }}>|</span>
          <span className="mono-text" style={{ fontSize: '0.68rem', color: 'var(--secondary-text)' }}>
            Relief: {STUDY_AREA.elevationRangeMeters.min}m – {STUDY_AREA.elevationRangeMeters.max}m MSL
          </span>
        </div>

        {/* Right Badges & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '2px 9px',
            fontSize: '0.66rem',
            fontWeight: 700,
            borderRadius: '9999px',
            backgroundColor: '#EDF7EE',
            color: 'var(--status-positive)',
            border: '1px solid #C8E6C9',
            letterSpacing: '0.02em',
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--status-positive)' }} />
            3D WORLD TERRAIN (COPERNICUS 30M DEM)
          </span>

          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '2px 9px',
            fontSize: '0.66rem',
            fontWeight: 700,
            borderRadius: '9999px',
            backgroundColor: '#FEF3C7',
            color: 'var(--status-warning)',
            border: '1px solid #FDE68A',
            letterSpacing: '0.02em',
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--status-warning)' }} />
            {activeInterventionsCount > 0 ? `${activeInterventionsCount} INTERVENTIONS ACTIVE` : '1 INTERVENTIONS ACTIVE'}
          </span>

          {/* Google Translate Language Selector */}
          <GoogleTranslate />

          <button
            onClick={onOpenSettings}
            className="btn apple-pressable"
            style={{
              padding: '3px 9px',
              fontSize: '0.70rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              border: '1px solid var(--fine-border)',
              backgroundColor: '#FFFFFF',
              color: 'var(--primary-text)',
              borderRadius: 'var(--radius-sm)',
            }}
            title="Configure Google Maps & Gemini API Keys"
          >
            <KeyRound size={11} color="var(--antique-gold)" />
            <span>API Keys</span>
          </button>
        </div>
      </div>

      {/* 2. Main Navigation Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 24px',
        gap: '16px',
        backgroundColor: '#FFFFFF',
      }}>
        {/* Left Brand Identity */}
        <div
          onClick={() => onViewChange('overview')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', userSelect: 'none' }}
        >
          {/* Forest Green Leaf Icon Box */}
          <div style={{
            width: '36px',
            height: '36px',
            backgroundColor: 'var(--primary-forest)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(23, 61, 45, 0.22)',
          }}>
            <Leaf size={18} color="#FAF8F2" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 className="royal-title notranslate" style={{
                fontSize: '1.38rem',
                color: 'var(--primary-forest)',
                letterSpacing: '0.05em',
                lineHeight: 1.05,
                margin: 0,
                fontWeight: 800,
              }}>
                DHAROHAR
              </h1>
              <span style={{
                fontSize: '0.65rem',
                fontFamily: 'var(--font-sans)',
                color: 'var(--status-warning)',
                fontWeight: 700,
                backgroundColor: 'var(--surface-sandstone)',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid var(--antique-gold)',
                letterSpacing: '0.03em',
              }}>
                Udaipur Digital Twin
              </span>
            </div>
            <p style={{
              fontSize: '0.70rem',
              color: 'var(--secondary-text)',
              letterSpacing: '0.01em',
              margin: '2px 0 0 0',
              fontWeight: 400,
            }}>
              Ridge-to-Lake Geospatial Intelligence & Conservation Architecture
            </p>
          </div>
        </div>

        {/* Center Primary Navigation Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
        }}>
          <button
            onClick={() => onViewChange('overview')}
            className="apple-pressable"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              fontSize: '0.78rem',
              fontWeight: currentView === 'overview' ? 700 : 500,
              color: currentView === 'overview' ? 'var(--primary-forest)' : 'var(--secondary-text)',
              backgroundColor: currentView === 'overview' ? 'var(--surface-sandstone)' : 'transparent',
              borderRadius: 'var(--radius-sm)',
              border: currentView === 'overview' ? '1px solid var(--fine-border)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Compass size={14} color={currentView === 'overview' ? 'var(--primary-forest)' : 'var(--secondary-sage)'} />
            <span>Overview & Story</span>
          </button>

          <button
            onClick={() => onViewChange('map')}
            className="apple-pressable"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              fontSize: '0.78rem',
              fontWeight: currentView === 'map' ? 700 : 500,
              color: currentView === 'map' ? 'var(--primary-forest)' : 'var(--secondary-text)',
              backgroundColor: currentView === 'map' ? 'var(--surface-sandstone)' : 'transparent',
              borderRadius: 'var(--radius-sm)',
              border: currentView === 'map' ? '1px solid var(--fine-border)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Layers size={14} color={currentView === 'map' ? 'var(--primary-forest)' : 'var(--secondary-sage)'} />
            <span>3D Watershed Twin</span>
          </button>

          <button
            onClick={() => {
              if (['silt-loop', 'water-credits', 'heritage-crops', 'interventions'].includes(currentView)) {
                // already in action group
              } else {
                onViewChange('silt-loop');
              }
            }}
            className="apple-pressable"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              fontSize: '0.78rem',
              fontWeight: ['silt-loop', 'water-credits', 'heritage-crops', 'interventions'].includes(currentView) ? 700 : 500,
              color: ['silt-loop', 'water-credits', 'heritage-crops', 'interventions'].includes(currentView) ? 'var(--primary-forest)' : 'var(--secondary-text)',
              backgroundColor: ['silt-loop', 'water-credits', 'heritage-crops', 'interventions'].includes(currentView) ? 'var(--surface-sandstone)' : 'transparent',
              borderRadius: 'var(--radius-sm)',
              border: ['silt-loop', 'water-credits', 'heritage-crops', 'interventions'].includes(currentView) ? '1px solid var(--fine-border)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <ShieldCheck size={14} color={['silt-loop', 'water-credits', 'heritage-crops', 'interventions'].includes(currentView) ? 'var(--primary-forest)' : 'var(--secondary-sage)'} />
            <span>Action Lab (Solutions)</span>
          </button>

          <button
            onClick={() => {
              if (['citizen-hub', 'field-action'].includes(currentView)) {
                // already in people group
              } else {
                onViewChange('citizen-hub');
              }
            }}
            className="apple-pressable"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              fontSize: '0.78rem',
              fontWeight: ['citizen-hub', 'field-action'].includes(currentView) ? 700 : 500,
              color: ['citizen-hub', 'field-action'].includes(currentView) ? 'var(--primary-forest)' : 'var(--secondary-text)',
              backgroundColor: ['citizen-hub', 'field-action'].includes(currentView) ? 'var(--surface-sandstone)' : 'transparent',
              borderRadius: 'var(--radius-sm)',
              border: ['citizen-hub', 'field-action'].includes(currentView) ? '1px solid var(--fine-border)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Users size={14} color={['citizen-hub', 'field-action'].includes(currentView) ? 'var(--primary-forest)' : 'var(--secondary-sage)'} />
            <span>Citizen & People</span>
          </button>

          <button
            onClick={() => {
              if (['trace', 'simulation', 'satellite'].includes(currentView)) {
                // already in science group
              } else {
                onViewChange('trace');
              }
            }}
            className="apple-pressable"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              fontSize: '0.78rem',
              fontWeight: ['trace', 'simulation', 'satellite'].includes(currentView) ? 700 : 500,
              color: ['trace', 'simulation', 'satellite'].includes(currentView) ? 'var(--primary-forest)' : 'var(--secondary-text)',
              backgroundColor: ['trace', 'simulation', 'satellite'].includes(currentView) ? 'var(--surface-sandstone)' : 'transparent',
              borderRadius: 'var(--radius-sm)',
              border: ['trace', 'simulation', 'satellite'].includes(currentView) ? '1px solid var(--fine-border)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <CloudRain size={14} color={['trace', 'simulation', 'satellite'].includes(currentView) ? 'var(--primary-forest)' : 'var(--secondary-sage)'} />
            <span>Hydro-Science</span>
          </button>
        </div>

        {/* Right Tools Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onOpenRaindrop && (
            <button
              onClick={onOpenRaindrop}
              className="btn apple-pressable"
              style={{
                padding: '6px 13px',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#EDF5FA',
                color: 'var(--lake-blue)',
                border: '1.5px solid var(--lake-blue)',
                borderRadius: 'var(--radius-sm)',
              }}
              title="Launch Virtual Raindrop 3D Particle Tracer"
            >
              <Droplets size={14} color="var(--lake-blue)" />
              <span>Rainflow Tracer</span>
            </button>
          )}

          <button
            onClick={onOpenSimulation}
            className="btn apple-pressable"
            style={{
              padding: '6px 14px',
              fontSize: '0.78rem',
              fontWeight: 600,
              backgroundColor: 'var(--status-error)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 2px 6px rgba(185, 74, 56, 0.28)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="Run SCS-CN Monsoon Runoff Simulation"
          >
            <CloudRain size={14} />
            <span>Monsoon Simulator</span>
          </button>
        </div>
      </div>
    </header>
  );
};
