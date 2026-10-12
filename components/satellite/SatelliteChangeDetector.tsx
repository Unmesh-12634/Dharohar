'use client';

import React, { useState } from 'react';
import {
  SATELLITE_DEGRADATION_ZONES,
  SATELLITE_TIME_SERIES,
} from '@/lib/geo-data';
import {
  SatelliteDegradationZone,
  SatelliteSeasonId,
  SatelliteTimeSeriesPoint,
} from '@/lib/types';
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Compass,
  Droplets,
  ExternalLink,
  Layers,
  MapPin,
  Maximize2,
  Minimize2,
  Satellite,
  ShieldAlert,
  Sparkles,
  Sprout,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

interface SatelliteChangeDetectorProps {
  onFlyToLocation?: (coords: { latitude: number; longitude: number; height?: number }) => void;
  onDispatchFieldMission?: (zone: SatelliteDegradationZone) => void;
  onSelectSeasonOnMap?: (seasonId: SatelliteSeasonId) => void;
}

export const SatelliteChangeDetector: React.FC<SatelliteChangeDetectorProps> = ({
  onFlyToLocation,
  onDispatchFieldMission,
  onSelectSeasonOnMap,
}) => {
  const [selectedSeasonId, setSelectedSeasonId] = useState<SatelliteSeasonId>('2026-current');
  const [comparisonSeasonId, setComparisonSeasonId] = useState<SatelliteSeasonId>('2021-post');
  const [activeSpectralIndex, setActiveSpectralIndex] = useState<'NDVI' | 'NDWI' | 'BSI'>('NDVI');
  const [isSplitMode, setIsSplitMode] = useState<boolean>(false);
  const [splitSliderPercent, setSplitSliderPercent] = useState<number>(50);
  const [dispatchedZoneIds, setDispatchedZoneIds] = useState<Record<string, boolean>>({});

  const activeSeason = SATELLITE_TIME_SERIES.find((s) => s.id === selectedSeasonId) || SATELLITE_TIME_SERIES[3];
  const comparisonSeason = SATELLITE_TIME_SERIES.find((s) => s.id === comparisonSeasonId) || SATELLITE_TIME_SERIES[0];

  const handleSeasonChange = (id: SatelliteSeasonId) => {
    setSelectedSeasonId(id);
    onSelectSeasonOnMap?.(id);
  };

  const handleDispatch = (zone: SatelliteDegradationZone) => {
    setDispatchedZoneIds((prev) => ({ ...prev, [zone.id]: true }));
    onDispatchFieldMission?.(zone);
  };

  // Delta calculations between comparison and active season
  const deltaNdvi = ((activeSeason.ndviMean - comparisonSeason.ndviMean) / comparisonSeason.ndviMean) * 100;
  const deltaWater = ((activeSeason.lakeExtentSqKm - comparisonSeason.lakeExtentSqKm) / comparisonSeason.lakeExtentSqKm) * 100;
  const deltaBareSoil = ((activeSeason.bareSoilDegradedSqKm - comparisonSeason.bareSoilDegradedSqKm) / comparisonSeason.bareSoilDegradedSqKm) * 100;

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '28px 24px 60px',
      color: 'var(--text-primary)',
    }}>
      {/* Header Banner */}
      <div style={{
        marginBottom: '26px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-observed">
              <Satellite size={12} style={{ marginRight: '4px' }} />
              Sentinel-2 Multi-Spectral Engine
            </span>
            <span className="badge badge-live">Google Earth Engine Catalog</span>
            <span className="badge" style={{ backgroundColor: '#EFEBE2', color: '#555C58' }}>
              10m Ground Resolution
            </span>
          </div>
          <h2 className="serif-title" style={{ fontSize: '1.95rem', color: 'var(--color-forest)', marginBottom: '6px' }}>
            Satellite Multi-Temporal Change Detector
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '820px', lineHeight: 1.55 }}>
            Trace how five consecutive monsoon cycles transformed Southern Rajasthan&apos;s Aravalli landscape.
            Analyze multi-spectral Sentinel-2 indices (NDVI vegetation vigor, NDWI surface water spread, and BSI bare soil degradation) to distinguish resilient micro-watersheds from degrading escarpments before deploying field inspection teams.
          </p>
        </div>

        {/* View mode toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(237, 232, 222, 0.65)',
          padding: '4px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
        }}>
          <button
            onClick={() => setIsSplitMode(false)}
            className={`btn btn-ghost ${!isSplitMode ? 'btn-active' : ''}`}
            style={{
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: !isSplitMode ? 600 : 400,
              backgroundColor: !isSplitMode ? 'var(--bg-card)' : 'transparent',
              boxShadow: !isSplitMode ? 'var(--shadow-subtle)' : 'none',
            }}
          >
            Chronological Timeline
          </button>
          <button
            onClick={() => setIsSplitMode(true)}
            className={`btn btn-ghost ${isSplitMode ? 'btn-active' : ''}`}
            style={{
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: isSplitMode ? 600 : 400,
              backgroundColor: isSplitMode ? 'var(--bg-card)' : 'transparent',
              boxShadow: isSplitMode ? 'var(--shadow-subtle)' : 'none',
            }}
          >
            Temporal Diff (Split Compare)
          </button>
        </div>
      </div>

      {/* Spectral Band Selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '12px 18px',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.80rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            SPECTRAL INDEX:
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setActiveSpectralIndex('NDVI')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.78rem',
                fontWeight: 600,
                border: activeSpectralIndex === 'NDVI' ? '1.5px solid var(--color-forest)' : '1px solid var(--border-subtle)',
                backgroundColor: activeSpectralIndex === 'NDVI' ? 'var(--color-forest-bg)' : 'transparent',
                color: activeSpectralIndex === 'NDVI' ? 'var(--color-forest)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              🌱 NDVI (Vegetation Vigor)
            </button>
            <button
              onClick={() => setActiveSpectralIndex('NDWI')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.78rem',
                fontWeight: 600,
                border: activeSpectralIndex === 'NDWI' ? '1.5px solid var(--color-lake)' : '1px solid var(--border-subtle)',
                backgroundColor: activeSpectralIndex === 'NDWI' ? 'var(--color-lake-bg)' : 'transparent',
                color: activeSpectralIndex === 'NDWI' ? 'var(--color-lake)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              💧 NDWI (Surface Water Extent)
            </button>
            <button
              onClick={() => setActiveSpectralIndex('BSI')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.78rem',
                fontWeight: 600,
                border: activeSpectralIndex === 'BSI' ? '1.5px solid var(--color-terracotta)' : '1px solid var(--border-subtle)',
                backgroundColor: activeSpectralIndex === 'BSI' ? 'var(--color-terracotta-bg)' : 'transparent',
                color: activeSpectralIndex === 'BSI' ? 'var(--color-terracotta)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              ⛰️ BSI (Bare Soil & Gully Scars)
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
          <span className="mono-text">Bands: {activeSpectralIndex === 'NDVI' ? 'B8 (NIR) - B4 (Red) / (B8 + B4)' : activeSpectralIndex === 'NDWI' ? 'B3 (Green) - B8 (NIR) / (B3 + B8)' : '[(B11 + B4) - (B8 + B2)] / [(B11 + B4) + (B8 + B2)]'}</span>
        </div>
      </div>

      {/* Historical Time Slider Section */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        padding: '24px 22px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        marginBottom: '26px',
        boxShadow: 'var(--shadow-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--color-forest)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <Clock size={13} />
              Interactive Multi-Temporal Scrubber
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
              Drag to scrub through satellite passes: <span style={{ color: 'var(--color-forest)' }}>{activeSeason.label}</span>
            </h3>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="mono-text" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Pass Date: <strong>{activeSeason.date}</strong>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
              {activeSeason.satellite}
            </div>
          </div>
        </div>

        {/* Step buttons row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${SATELLITE_TIME_SERIES.length}, 1fr)`,
          gap: '10px',
          marginBottom: '18px',
        }}>
          {SATELLITE_TIME_SERIES.map((pt, idx) => {
            const isSelected = pt.id === selectedSeasonId;
            return (
              <button
                key={pt.id}
                onClick={() => handleSeasonChange(pt.id)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-xs)',
                  border: isSelected ? '1.5px solid var(--color-forest)' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'var(--color-forest-bg)' : 'var(--bg-secondary)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  boxShadow: isSelected ? '0 2px 8px rgba(30, 58, 43, 0.15)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span className="mono-text" style={{ fontSize: '0.68rem', fontWeight: 600, color: isSelected ? 'var(--color-forest)' : 'var(--text-tertiary)' }}>
                    EPOCH 0{idx + 1}
                  </span>
                  <span className="mono-text" style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
                    {pt.year}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: isSelected ? 600 : 500, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {pt.season}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.70rem', color: 'var(--text-secondary)' }}>
                  <span>NDVI: <strong>{pt.ndviMean.toFixed(2)}</strong></span>
                  <span>•</span>
                  <span>Water: <strong>{pt.lakeExtentSqKm}km²</strong></span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Observation text callout */}
        <div style={{
          padding: '12px 16px',
          backgroundColor: 'rgba(244, 241, 234, 0.75)',
          borderRadius: 'var(--radius-xs)',
          borderLeft: '3px solid var(--color-forest)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
        }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
            <strong>Earth Engine Observation:</strong> {activeSeason.keyObservations}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="badge badge-risk" style={{ fontSize: '0.70rem' }}>
              {activeSeason.detectedHotspotCount} Degradation Anomalies Flagged
            </span>
          </div>
        </div>
      </div>

      {/* Comparison Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        marginBottom: '28px',
      }}>
        {/* Metric 1: Mean NDVI */}
        <div className="editorial-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Vegetation Vigor (Mean NDVI)
            </span>
            <Sprout size={16} color="var(--color-forest)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '6px' }}>
            <span className="mono-text" style={{ fontSize: '1.9rem', fontWeight: 600, color: 'var(--color-forest)' }}>
              {activeSeason.ndviMean.toFixed(2)}
            </span>
            <span style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: deltaNdvi >= 0 ? 'var(--color-forest)' : 'var(--color-terracotta)',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
            }}>
              {deltaNdvi >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {deltaNdvi > 0 ? `+${deltaNdvi.toFixed(1)}%` : `${deltaNdvi.toFixed(1)}%`} vs 2021
            </span>
          </div>
          <p style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)', margin: 0 }}>
            Healthy dense forest &gt; 0.50; degraded stony scrub &lt; 0.35.
          </p>
        </div>

        {/* Metric 2: Lake Extent */}
        <div className="editorial-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Reservoir & Lake Surface Spread
            </span>
            <Droplets size={16} color="var(--color-lake)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '6px' }}>
            <span className="mono-text" style={{ fontSize: '1.9rem', fontWeight: 600, color: 'var(--color-lake)' }}>
              {activeSeason.lakeExtentSqKm} <span style={{ fontSize: '1.1rem' }}>km²</span>
            </span>
            <span style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: deltaWater >= 0 ? 'var(--color-lake)' : 'var(--color-terracotta)',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
            }}>
              {deltaWater >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {deltaWater > 0 ? `+${deltaWater.toFixed(1)}%` : `${deltaWater.toFixed(1)}%`} vs 2021
            </span>
          </div>
          <p style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)', margin: 0 }}>
            Pichola, Fateh Sagar, Badi & Goverdhan combined water surface spread.
          </p>
        </div>

        {/* Metric 3: Degraded Bare Soil Area */}
        <div className="editorial-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Exposed Bare Soil & Gully Scars
            </span>
            <AlertTriangle size={16} color="var(--color-terracotta)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '6px' }}>
            <span className="mono-text" style={{ fontSize: '1.9rem', fontWeight: 600, color: 'var(--color-terracotta)' }}>
              {activeSeason.bareSoilDegradedSqKm} <span style={{ fontSize: '1.1rem' }}>km²</span>
            </span>
            <span style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: deltaBareSoil <= 0 ? 'var(--color-forest)' : 'var(--color-terracotta)',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
            }}>
              {deltaBareSoil <= 0 ? <TrendingDown size={13} /> : <TrendingUp size={13} />}
              {deltaBareSoil > 0 ? `+${deltaBareSoil.toFixed(1)}%` : `${deltaBareSoil.toFixed(1)}%`} vs 2021
            </span>
          </div>
          <p style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)', margin: 0 }}>
            High-albedo denuded terrain vulnerable to torrential sheetwash.
          </p>
        </div>
      </div>

      {/* Split Comparison View Mode */}
      {isSplitMode && (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          padding: '22px',
          marginBottom: '32px',
          boxShadow: 'var(--shadow-card)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <span className="badge badge-simulated" style={{ marginBottom: '4px' }}>
                Side-by-Side Satellite Comparator
              </span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Compare Baseline ({comparisonSeason.label}) vs Target ({activeSeason.label})
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>Baseline epoch:</span>
              <select
                value={comparisonSeasonId}
                onChange={(e) => setComparisonSeasonId(e.target.value as SatelliteSeasonId)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-primary)',
                  fontSize: '0.78rem',
                  fontFamily: 'inherit',
                }}
              >
                {SATELLITE_TIME_SERIES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Split Bar Visualizer */}
          <div style={{
            position: 'relative',
            height: '240px',
            backgroundColor: '#1E2522',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Left side (Comparison) */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: `${splitSliderPercent}%`,
              background: 'linear-gradient(135deg, rgba(30, 58, 43, 0.95), rgba(44, 94, 122, 0.85))',
              borderRight: '2px solid #FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '16px',
              color: '#FFFFFF',
              boxSizing: 'border-box',
            }}>
              <div>
                <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF', fontSize: '0.70rem' }}>
                  BEFORE: {comparisonSeason.season} ({comparisonSeason.year})
                </span>
                <div style={{ marginTop: '8px', fontSize: '0.92rem', fontWeight: 600 }}>
                  NDVI: {comparisonSeason.ndviMean.toFixed(2)} | Water: {comparisonSeason.lakeExtentSqKm}km²
                </div>
              </div>
              <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>
                Sentinel-2 Surface Reflectance (L2A) • {comparisonSeason.date}
              </div>
            </div>

            {/* Right side (Active) */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: `${100 - splitSliderPercent}%`,
              background: activeSeason.id === '2023-drought'
                ? 'linear-gradient(135deg, rgba(189, 86, 55, 0.95), rgba(212, 126, 56, 0.85))'
                : 'linear-gradient(135deg, rgba(42, 102, 62, 0.95), rgba(27, 73, 101, 0.85))',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              padding: '16px',
              color: '#FFFFFF',
              boxSizing: 'border-box',
            }}>
              <div style={{ textAlign: 'right' }}>
                <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF', fontSize: '0.70rem' }}>
                  AFTER: {activeSeason.season} ({activeSeason.year})
                </span>
                <div style={{ marginTop: '8px', fontSize: '0.92rem', fontWeight: 600 }}>
                  NDVI: {activeSeason.ndviMean.toFixed(2)} | Water: {activeSeason.lakeExtentSqKm}km²
                </div>
              </div>
              <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>
                Sentinel-2 Surface Reflectance (L2A) • {activeSeason.date}
              </div>
            </div>

            {/* Drag Handle Knob */}
            <div style={{
              position: 'absolute',
              left: `${splitSliderPercent}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              color: 'var(--color-forest)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              cursor: 'ew-resize',
              zIndex: 10,
            }}>
              ↔
            </div>
          </div>

          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>Adjust split threshold:</span>
            <input
              type="range"
              min="10"
              max="90"
              value={splitSliderPercent}
              onChange={(e) => setSplitSliderPercent(Number(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--color-forest)' }}
            />
            <span className="mono-text" style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              {splitSliderPercent}% / {100 - splitSliderPercent}%
            </span>
          </div>
        </div>
      )}

      {/* Satellite-Detected Anomaly Table - Practical Ground Dispatch */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        padding: '24px 22px',
        boxShadow: 'var(--shadow-card)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '18px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--color-terracotta)', fontWeight: 600, textTransform: 'uppercase' }}>
              <ShieldAlert size={14} />
              Identified Field Inspection Targets
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
              Locations Warranting Physical Ground Verification
            </h3>
            <p style={{ fontSize: '0.80rem', color: 'var(--text-secondary)', margin: 0 }}>
              Satellite anomalies detected by Earth Engine spectral differencing. Click to fly the 3D digital twin to the location or assign directly to the Field Action Network.
            </p>
          </div>
          <span className="badge badge-risk">
            {SATELLITE_DEGRADATION_ZONES.length} High-Confidence Targets
          </span>
        </div>

        {/* List of Detected Anomaly Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {SATELLITE_DEGRADATION_ZONES.map((zone) => {
            const isDispatched = dispatchedZoneIds[zone.id];
            return (
              <div
                key={zone.id}
                style={{
                  padding: '16px 18px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  border: zone.priority === 'CRITICAL' ? '1.5px solid rgba(189, 86, 55, 0.4)' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ flex: '1 1 340px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="mono-text" style={{ fontSize: '0.70rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>
                      {zone.id}
                    </span>
                    <span className={`badge ${zone.priority === 'CRITICAL' ? 'badge-risk' : 'badge-modeled'}`}>
                      {zone.priority} PRIORITY
                    </span>
                    <span className="badge" style={{ backgroundColor: 'rgba(235, 229, 216, 0.8)', color: 'var(--text-secondary)', fontSize: '0.68rem' }}>
                      {zone.spectralIndicator}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {zone.name}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    <MapPin size={12} color="var(--color-terracotta)" />
                    <span>{zone.location} ({zone.elevationM}m MSL)</span>
                    <span>•</span>
                    <span className="mono-text">{zone.latitude.toFixed(4)}°N, {zone.longitude.toFixed(4)}°E</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
                    {zone.notes}
                  </p>
                </div>

                {/* Spectral Metrics Pill */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>Historical Loss</div>
                    <div className="mono-text" style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-terracotta)' }}>
                      -{zone.historicalLossPct}%
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>Vulnerability Index</div>
                    <div className="mono-text" style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-forest)' }}>
                      {zone.currentScore.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => onFlyToLocation?.({ latitude: zone.latitude, longitude: zone.longitude, height: 1600 })}
                    className="btn btn-ghost"
                    style={{ padding: '7px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    title="Inspect in 3D digital twin"
                  >
                    <Compass size={14} />
                    Fly to 3D
                  </button>

                  <button
                    onClick={() => handleDispatch(zone)}
                    disabled={isDispatched}
                    className="btn apple-pressable"
                    style={{
                      padding: '7px 14px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      backgroundColor: isDispatched ? 'var(--color-forest-bg)' : 'var(--color-forest)',
                      color: isDispatched ? 'var(--color-forest)' : '#FFFFFF',
                      border: isDispatched ? '1px solid var(--color-forest)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: isDispatched ? 'none' : '0 2px 6px rgba(30, 58, 43, 0.2)',
                    }}
                  >
                    {isDispatched ? (
                      <>
                        <CheckCircle size={14} color="var(--color-forest)" />
                        Assigned to Field
                      </>
                    ) : (
                      <>
                        <ArrowRight size={14} />
                        Assign Field Task
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
