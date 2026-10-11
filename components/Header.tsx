'use client';

import React from 'react';
import { BasemapMode } from '@/lib/types';
import { Layers, Activity, CloudRain, ShieldCheck, Compass, GitCommit, Sliders, KeyRound, Sparkles, Sprout } from 'lucide-react';
import { STUDY_AREA } from '@/lib/geo-data';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onOpenSimulation: () => void;
  onOpenSettings: () => void;
  is3DTilesActive: boolean;
  activeInterventionsCount: number;
  basemapMode?: BasemapMode;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onOpenSimulation,
  onOpenSettings,
  is3DTilesActive,
  activeInterventionsCount,
  basemapMode = 'satellite',
}) => {
  return (
    <header className="apple-frosted-bar" style={{
      position: 'relative',
      zIndex: 40,
    }}>
      {/* Top micro bar with study area and system health */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '5px 22px',
        borderBottom: '1px solid rgba(235, 229, 216, 0.65)',
        fontSize: '0.72rem',
        color: 'var(--text-secondary)',
        backgroundColor: 'rgba(244, 241, 234, 0.65)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#2E7D32',
              display: 'inline-block',
            }} />
            <strong style={{ color: 'var(--text-primary)' }}>Corridor:</strong> Southern Rajasthan (Mewar & Vagad)
          </span>
          <span style={{ color: 'var(--border-strong)' }}>|</span>
          <span className="mono-text" style={{ fontSize: '0.68rem', color: 'var(--color-terracotta)', fontWeight: 600 }}>
            ARAVALLI BUILD CHAMPIONSHIP • DOMAIN 4: AGRI-TECH & NATURAL RESOURCE CONSERVATION
          </span>
          <span style={{ color: 'var(--border-strong)' }}>|</span>
          <span>Elevation: <strong>{STUDY_AREA.elevationRangeMeters.min}m – {STUDY_AREA.elevationRangeMeters.max}m</strong> MSL</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="badge badge-live">
            {is3DTilesActive
              ? '● Google 3D Tiles'
              : basemapMode === 'satellite'
              ? '● Ultra-HD Satellite (2.0x)'
              : basemapMode === 'sentinel'
              ? '● Sentinel-2 Multispectral'
              : '● Topographic Relief'}
          </span>
          {activeInterventionsCount > 0 && (
            <span className="badge badge-simulated">
              {activeInterventionsCount} Interventions Active
            </span>
          )}
          <button
            onClick={onOpenSettings}
            className="btn btn-ghost"
            style={{ padding: '2px 8px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            title="Configure Google Maps & Gemini API Keys"
          >
            <KeyRound size={12} />
            API Keys
          </button>
        </div>
      </div>

      {/* Main navigation row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 22px',
        gap: '16px',
      }}>
        {/* Brand identity */}
        <div
          onClick={() => onViewChange('overview')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'var(--color-forest)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(30, 58, 43, 0.25)',
          }}>
            <Compass size={22} style={{ color: '#E8DFD0' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <h1 className="serif-title" style={{
                fontSize: '1.45rem',
                color: 'var(--color-forest)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}>
                DHAROHAR
              </h1>
              <span className="mono-text" style={{
                fontSize: '0.68rem',
                color: 'var(--color-terracotta)',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}>
                Aravalli Twin
              </span>
            </div>
            <p style={{
              fontSize: '0.72rem',
              color: 'var(--text-secondary)',
              letterSpacing: '0.01em',
              margin: 0,
            }}>
              Southern Rajasthan Ecological & Smallholder Agrarian Intelligence
            </p>
          </div>
        </div>

        {/* View Tabs - Apple Style Sliding Segments */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: 'rgba(237, 232, 222, 0.5)',
          padding: '4px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(217, 209, 193, 0.6)',
        }}>
          <button
            onClick={() => onViewChange('overview')}
            className={`nav-tab ${currentView === 'overview' ? 'active' : ''}`}
          >
            <Activity size={15} />
            Dashboard
          </button>

          <button
            onClick={() => onViewChange('map')}
            className={`nav-tab ${currentView === 'map' ? 'active' : ''}`}
          >
            <Layers size={15} />
            3D Catchment Twin
          </button>

          <button
            onClick={() => onViewChange('farm-intel')}
            className={`nav-tab ${currentView === 'farm-intel' ? 'active' : ''}`}
          >
            <Sprout size={15} />
            Farm Intelligence
          </button>

          <button
            onClick={() => onViewChange('interventions')}
            className={`nav-tab ${currentView === 'interventions' ? 'active' : ''}`}
          >
            <ShieldCheck size={15} />
            Interventions
          </button>

          <button
            onClick={() => onViewChange('trace')}
            className={`nav-tab ${currentView === 'trace' ? 'active' : ''}`}
          >
            <GitCommit size={15} />
            Trace Problem
          </button>

          <button
            onClick={() => onViewChange('impact')}
            className={`nav-tab ${currentView === 'impact' ? 'active' : ''}`}
          >
            <Sparkles size={15} />
            Impact & PES
          </button>
        </nav>

        {/* Primary Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onOpenSimulation}
            className="btn btn-terracotta apple-pressable"
            style={{ padding: '8px 16px', fontSize: '0.82rem', fontWeight: 600, boxShadow: '0 2px 8px rgba(189, 86, 55, 0.25)' }}
          >
            <CloudRain size={16} />
            Simulate Rainfall
          </button>
        </div>
      </div>
    </header>
  );
};
