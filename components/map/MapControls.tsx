'use client';

import React from 'react';
import { CAMERA_PRESETS } from '@/lib/geo-data';
import { BasemapMode, ViewPreset } from '@/lib/types';
import { Compass, Eye, Globe2, Mountain, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';

interface MapControlsProps {
  activePreset: ViewPreset;
  onSelectPreset: (preset: ViewPreset) => void;
  isWatershedMode: boolean;
  onToggleWatershedMode: () => void;
  onResetView: () => void;
  basemapMode: BasemapMode;
  onSelectBasemap: (mode: BasemapMode) => void;
  showHybridLabels?: boolean;
  onToggleHybridLabels?: () => void;
  show3DModels?: boolean;
  onToggle3DModels?: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  activePreset,
  onSelectPreset,
  isWatershedMode,
  onToggleWatershedMode,
  onResetView,
  basemapMode,
  onSelectBasemap,
  showHybridLabels = true,
  onToggleHybridLabels,
  show3DModels = true,
  onToggle3DModels,
}) => {
  return (
    <div style={{
      position: 'absolute',
      bottom: '36px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(255, 255, 255, 0.94)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '6px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: 'var(--shadow-card)',
      backdropFilter: 'blur(8px)',
      zIndex: 25,
      maxWidth: '92vw',
      overflowX: 'auto',
    }}>
      {/* Watershed Mode Spotlight Button */}
      <button
        onClick={onToggleWatershedMode}
        className={`btn ${isWatershedMode ? 'btn-primary' : 'btn-secondary'}`}
        style={{
          padding: '6px 12px',
          fontSize: '0.78rem',
          fontWeight: 600,
          border: isWatershedMode ? '1px solid var(--color-forest)' : '1px solid var(--border-strong)',
        }}
        title="Activate dedicated Watershed Mode (focuses drainage, sub-basins, and runoff pathways)"
      >
        <Mountain size={14} />
        {isWatershedMode ? 'Watershed Mode (Active)' : 'Watershed Mode'}
      </button>

      <div style={{ width: '1px', height: '22px', backgroundColor: 'var(--border-subtle)' }} />

      {/* Preset pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: '4px' }}>
          Presets:
        </span>
        {Object.values(CAMERA_PRESETS).map((p) => {
          const isSelected = activePreset === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelectPreset(p.id as ViewPreset)}
              style={{
                background: isSelected ? 'var(--color-forest-bg)' : 'transparent',
                color: isSelected ? 'var(--color-forest)' : 'var(--text-secondary)',
                border: isSelected ? '1px solid var(--color-forest)' : '1px solid transparent',
                borderRadius: 'var(--radius-xs)',
                padding: '4px 8px',
                fontSize: '0.74rem',
                fontWeight: isSelected ? 600 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {p.title}
            </button>
          );
        })}
      </div>

      <div style={{ width: '1px', height: '22px', backgroundColor: 'var(--border-subtle)' }} />

      {/* Free Basemap selection pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
        <span style={{ fontSize: '0.70rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: '4px' }}>
          Basemap:
        </span>
        {[
          { id: 'satellite' as BasemapMode, label: '🛰️ Satellite', title: 'High-Res Photorealistic Satellite (Free Esri World Imagery - No Key Needed)' },
          { id: 'topographic' as BasemapMode, label: '🗺️ Topo', title: 'Clean Hydrological Topographic Basemap (CartoDB)' },
          { id: 'sentinel' as BasemapMode, label: '🌍 Earth', title: 'Sentinel-2 Cloudless Earth Multispectral' },
          { id: 'dark' as BasemapMode, label: '🌙 Dark', title: 'Dark Contrast Mode' },
        ].map((b) => {
          const isSelected = basemapMode === b.id;
          return (
            <button
              key={b.id}
              onClick={() => onSelectBasemap(b.id)}
              title={b.title}
              style={{
                background: isSelected ? 'rgba(46, 125, 50, 0.12)' : 'transparent',
                color: isSelected ? 'var(--color-forest)' : 'var(--text-secondary)',
                border: isSelected ? '1px solid var(--color-forest)' : '1px solid transparent',
                borderRadius: 'var(--radius-xs)',
                padding: '3px 7px',
                fontSize: '0.72rem',
                fontWeight: isSelected ? 600 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {b.label}
            </button>
          );
        })}
      </div>

      <div style={{ width: '1px', height: '22px', backgroundColor: 'var(--border-subtle)' }} />

      {/* 3D Real Models Toggle */}
      {onToggle3DModels && (
        <button
          onClick={onToggle3DModels}
          style={{
            background: show3DModels ? 'var(--color-forest-bg)' : 'transparent',
            color: show3DModels ? 'var(--color-forest)' : 'var(--text-secondary)',
            border: show3DModels ? '1px solid var(--color-forest)' : '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xs)',
            padding: '3px 8px',
            fontSize: '0.72rem',
            fontWeight: show3DModels ? 600 : 400,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.15s ease',
          }}
          title="Toggle Authentic 3D Architectural Models of Udaipur (Monsoon Palace, City Palace, Lake Palace, Jag Mandir)"
        >
          <span>🏛️ 3D Models</span>
          <span style={{ fontSize: '0.64rem', padding: '1px 4px', borderRadius: '3px', backgroundColor: show3DModels ? '#2E7D32' : 'var(--border-strong)', color: '#FFFFFF', fontWeight: 700 }}>
            {show3DModels ? 'ON' : 'OFF'}
          </span>
        </button>
      )}

      {/* Hybrid Labels Overlay Toggle */}
      {onToggleHybridLabels && (
        <button
          onClick={onToggleHybridLabels}
          style={{
            background: showHybridLabels ? 'rgba(36, 88, 118, 0.10)' : 'transparent',
            color: showHybridLabels ? 'var(--color-lake)' : 'var(--text-secondary)',
            border: showHybridLabels ? '1px solid var(--color-lake)' : '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xs)',
            padding: '3px 8px',
            fontSize: '0.72rem',
            fontWeight: showHybridLabels ? 600 : 400,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.15s ease',
          }}
          title="Toggle High-Resolution Street, Hill & Place Reference Labels Overlay"
        >
          <span>🏷️ Road/Place Labels</span>
          <span style={{ fontSize: '0.64rem', padding: '1px 4px', borderRadius: '3px', backgroundColor: showHybridLabels ? 'var(--color-lake)' : 'var(--border-strong)', color: '#FFFFFF', fontWeight: 700 }}>
            {showHybridLabels ? 'ON' : 'OFF'}
          </span>
        </button>
      )}

      <div style={{ width: '1px', height: '22px', backgroundColor: 'var(--border-subtle)' }} />

      {/* Reset camera */}
      <button
        onClick={onResetView}
        className="btn btn-ghost"
        style={{ padding: '4px 8px', fontSize: '0.74rem' }}
        title="Reset to Regional Overview"
      >
        <RefreshCw size={13} />
        Reset
      </button>
    </div>
  );
};
