'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  CAUSE_EFFECT_TRACE,
  LAKES_DATA,
  UPSTREAM_CATCHMENT_TRACES,
} from '@/lib/geo-data';
import { ActiveStormScenario, TraceStep, UpstreamCatchmentTrace } from '@/lib/types';
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Compass,
  CornerDownRight,
  Crosshair,
  Droplets,
  Eye,
  FileText,
  Filter,
  Globe,
  Home,
  Info,
  Layers,
  MapPin,
  Maximize2,
  Minus,
  Mountain,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Sprout,
  TrendingDown,
  TrendingUp,
  Waves,
  Wind,
} from 'lucide-react';

// Data models for the 3 catchment water bodies
interface LakeCatchmentProfile {
  id: string;
  name: string;
  hindiName: string;
  tagline: string;
  photoUrl: string;
  catchmentAreaSqKm: number;
  frlMeters: number;
  currentLevelMeters: number;
  levelDate: string;
  capacityMcm: number;
  primaryInflow: string;
  dataQuality: 'Verified' | 'Calibrated Sample';
  highestElevationMsl: number;
  lowestElevationMsl: number;
  meanSlopePct: number;
  totalDrainageKm: number;
  agriculturalAreaSqKm: number;
  agriculturalAreaPct: number;
  interventionCount: number;
  transect: {
    title: string;
    from: string;
    to: string;
    distanceKm: number;
    elevationDropM: number;
    meanSlopePct: number;
    terrainData: string;
    sampleInterval: string;
    generatedOn: string;
    flyCoords: { latitude: number; longitude: number; height: number };
    waypoints: {
      km: number;
      elevation: number;
      label: string;
      slope: string;
      process: string;
    }[];
  };
}

const CATCHMENT_PROFILES: Record<string, LakeCatchmentProfile> = {
  pichola: {
    id: 'pichola',
    name: 'Lake Pichola',
    hindiName: 'पिछोला झील',
    tagline: 'Historic lake · Urban & ecological importance',
    photoUrl: '/images/lake_pichola_watershed.jpg',
    catchmentAreaSqKm: 284.5,
    frlMeters: 577,
    currentLevelMeters: 571.8,
    levelDate: 'as of 14 Aug 2024',
    capacityMcm: 13.7,
    primaryInflow: 'Saijangarh Ridge Streams & Sisarma River',
    dataQuality: 'Verified',
    highestElevationMsl: 938,
    lowestElevationMsl: 571,
    meanSlopePct: 18.4,
    totalDrainageKm: 146.2,
    agriculturalAreaSqKm: 92.6,
    agriculturalAreaPct: 32,
    interventionCount: 128,
    transect: {
      title: 'Geomorphic Cross-Section: Saijangarh Ridge to Lake Pichola',
      from: 'Saijangarh Ridge Crest',
      to: 'Lake Pichola (Inlet Point)',
      distanceKm: 14.2,
      elevationDropM: 348,
      meanSlopePct: 2.45,
      terrainData: 'Copernicus DEM (30 m)',
      sampleInterval: '30 m',
      generatedOn: '14 Aug 2024, 10:32 AM',
      flyCoords: { latitude: 24.588, longitude: 73.655, height: 1850 },
      waypoints: [
        { km: 0.0, elevation: 938, label: 'Saijangarh Ridge', slope: '36.4%', process: 'High kinetic sheetwash detachment' },
        { km: 4.5, elevation: 780, label: 'Bujhra Nala', slope: '28.5%', process: 'Rill deepening & active headcut' },
        { km: 7.5, elevation: 670, label: 'Nai Terraces', slope: '12.2%', process: 'Check Dam CD-01 sediment buffer' },
        { km: 11.0, elevation: 615, label: 'Urban Fringe', slope: '4.8%', process: 'Valley floor alluvium & recharge' },
        { km: 14.2, elevation: 590, label: 'Lake Pichola', slope: '0.8%', process: 'Terminal lacustrine silt deposition' },
      ],
    },
  },
  fatehsagar: {
    id: 'fatehsagar',
    name: 'Fateh Sagar',
    hindiName: 'फतह सागर झील',
    tagline: 'Perennial drinking supply · North Aravalli basin',
    photoUrl: '/images/rajasthan_aravalli_hero.jpg',
    catchmentAreaSqKm: 53.7,
    frlMeters: 588,
    currentLevelMeters: 585.2,
    levelDate: 'as of 14 Aug 2024',
    capacityMcm: 12.1,
    primaryInflow: 'Madar Feeder Canal & Chhota Madar',
    dataQuality: 'Verified',
    highestElevationMsl: 680,
    lowestElevationMsl: 588,
    meanSlopePct: 14.2,
    totalDrainageKm: 68.5,
    agriculturalAreaSqKm: 24.8,
    agriculturalAreaPct: 46,
    interventionCount: 84,
    transect: {
      title: 'Geomorphic Cross-Section: Madar Ridge to Fateh Sagar Lake',
      from: 'Madar Catchment Ridge',
      to: 'Fateh Sagar (North Inflow)',
      distanceKm: 11.5,
      elevationDropM: 92,
      meanSlopePct: 0.80,
      terrainData: 'Copernicus DEM (30 m)',
      sampleInterval: '30 m',
      generatedOn: '14 Aug 2024, 10:32 AM',
      flyCoords: { latitude: 24.615, longitude: 73.665, height: 1750 },
      waypoints: [
        { km: 0.0, elevation: 680, label: 'Madar Divide', slope: '21.0%', process: 'High-altitude overland runoff' },
        { km: 3.5, elevation: 640, label: 'Upper Scrub', slope: '14.2%', process: 'Ephemeral rill runoff' },
        { km: 6.8, elevation: 618, label: 'Chhota Madar', slope: '8.5%', process: 'Spillway desilting pool' },
        { km: 9.2, elevation: 600, label: 'Stone Aqueduct', slope: '2.2%', process: 'Low-friction gravity conveyance' },
        { km: 11.5, elevation: 588, label: 'Fateh Sagar', slope: '0.5%', process: 'Urban reservoir recharge' },
      ],
    },
  },
  badi: {
    id: 'badi',
    name: 'Badi Lake',
    hindiName: 'बड़ी झील (जियान सागर)',
    tagline: 'Highland famine reserve · Oligotrophic freshwater',
    photoUrl: '/images/aravalli_ridge_conservation.jpg',
    catchmentAreaSqKm: 42.1,
    frlMeters: 622,
    currentLevelMeters: 619.4,
    levelDate: 'as of 14 Aug 2024',
    capacityMcm: 8.4,
    primaryInflow: 'Bahubali Highland Ravines & Hawala Stream',
    dataQuality: 'Verified',
    highestElevationMsl: 710,
    lowestElevationMsl: 605,
    meanSlopePct: 22.6,
    totalDrainageKm: 41.3,
    agriculturalAreaSqKm: 11.2,
    agriculturalAreaPct: 26,
    interventionCount: 56,
    transect: {
      title: 'Geomorphic Cross-Section: Bahubali Peak to Badi Lake',
      from: 'Bahubali Ridge Lookout',
      to: 'Badi Lake Dam Embankment',
      distanceKm: 4.8,
      elevationDropM: 105,
      meanSlopePct: 2.18,
      terrainData: 'Copernicus DEM (30 m)',
      sampleInterval: '30 m',
      generatedOn: '14 Aug 2024, 10:32 AM',
      flyCoords: { latitude: 24.624, longitude: 73.624, height: 1650 },
      waypoints: [
        { km: 0.0, elevation: 710, label: 'Bahubali Peak', slope: '32.8%', process: 'Bare quartzite scree detachment' },
        { km: 1.4, elevation: 675, label: 'Ridge Trail', slope: '24.0%', process: 'Hiker gully erosion' },
        { km: 2.8, elevation: 642, label: 'Hawala Johad', slope: '11.5%', process: 'Earthen Johad silt buffer' },
        { km: 3.9, elevation: 622, label: 'Valley Mouth', slope: '4.2%', process: 'Alluvial transition cone' },
        { km: 4.8, elevation: 605, label: 'Badi Lake Dam', slope: '1.2%', process: 'Pristine reservoir storage' },
      ],
    },
  },
};

interface CauseEffectExplorerProps {
  onFlyToStep?: (step: TraceStep) => void;
  onOpenMap?: () => void;
  onSelectLakeTrace?: (lakeId: string) => void;
  selectedLakeId?: string;
  activeStormScenario?: ActiveStormScenario | null;
  onNavigateToModule?: (view: string) => void;
}

export const CauseEffectExplorer: React.FC<CauseEffectExplorerProps> = ({
  onFlyToStep,
  onOpenMap,
  onSelectLakeTrace,
  selectedLakeId = 'pichola',
  activeStormScenario,
  onNavigateToModule,
}) => {
  const [activeLakeId, setActiveLakeId] = useState<string>(selectedLakeId);
  const [activeProcessCard, setActiveProcessCard] = useState<number>(1);
  const [basemapMode, setBasemapMode] = useState<'satellite' | 'terrain' | 'topographic'>('satellite');
  const [isLayersOpen, setIsLayersOpen] = useState<boolean>(true);
  const [hoveredWaypoint, setHoveredWaypoint] = useState<number | null>(null);
  const [showTraceReasonModal, setShowTraceReasonModal] = useState<boolean>(false);

  // Map layer toggle states
  const [layers, setLayers] = useState({
    lakeBoundary: true,
    upstreamCatchment: true,
    drainageNetwork: true,
    elevationDem: true,
    slopeAnalysis: false,
    landUseCover: false,
    interventions: true,
    monitoringStations: false,
    villageSettlements: false,
  });

  const activeProfile = CATCHMENT_PROFILES[activeLakeId] || CATCHMENT_PROFILES.pichola;

  const handleSelectLake = (id: string) => {
    setActiveLakeId(id);
    onSelectLakeTrace?.(id);
  };

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{
      padding: '16px 24px 36px 24px',
      color: 'var(--primary-text)',
      backgroundColor: 'var(--bg-warm-ivory)',
      minHeight: '100%',
    }}>
      {/* 1. Breadcrumb Bar & Header Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '10px',
      }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--secondary-text)' }}>
          <Home size={14} color="var(--primary-forest)" style={{ cursor: 'pointer' }} />
          <span>मेवाड़ जल बुद्धिमत्ता (Overview)</span>
          <span>/</span>
          <span style={{
            color: 'var(--primary-forest)',
            fontWeight: 700,
            backgroundColor: 'var(--surface-sandstone)',
            padding: '3px 10px',
            borderRadius: '6px',
            border: '1px solid var(--fine-border)',
          }}>
            अरावली भू-प्रवाह अनुरेखक (UPSTREAM LANDSCAPE TRACER)
          </span>
        </div>

        {/* Right Tools: Open 3D Map + Watershed Corridor Context */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => onOpenMap && onOpenMap()}
            className="apple-pressable"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--deep-green)',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(16, 45, 35, 0.2)',
            }}
          >
            <Compass size={14} />
            <span>Open in 3D Map</span>
          </button>

          {/* Context Card Chip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 10px',
            borderRadius: '6px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--fine-border)',
            fontSize: '0.70rem',
            color: 'var(--secondary-text)',
          }}>
            <div style={{
              width: '18px',
              height: '18px',
              borderRadius: '3px',
              backgroundColor: 'rgba(216, 181, 109, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--status-warning)',
              fontWeight: 800,
              fontSize: '0.65rem',
            }}>
              ▲
            </div>
            <div>
              <strong style={{ color: 'var(--primary-forest)', display: 'block', lineHeight: 1.1 }}>Mewar Watershed Corridor</strong>
              <span style={{ fontSize: '0.64rem' }}>Udaipur Catchment (284.5 km²)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Storm Simulation Impact Banner */}
      {activeStormScenario && (
        <div
          style={{
            marginBottom: '16px',
            backgroundColor: '#FFFFFF',
            border: '1.5px solid var(--antique-gold)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                backgroundColor: 'var(--deep-green)',
                color: '#FAF8F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Compass size={18} color="#FCD34D" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.64rem', padding: '1px 6px', borderRadius: '3px', backgroundColor: '#EDF7EE', color: '#15803D', fontWeight: 800 }}>
                  ACTIVE CLIMATE HYDRO-DYNAMIC TRANSECT
                </span>
                <span className="mono-text" style={{ fontSize: '0.72rem', color: 'var(--secondary-text)' }}>
                  {activeStormScenario.rainfallMm}mm • {activeStormScenario.intensityMmH} mm/hr Storm Event
                </span>
              </div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-forest)', marginTop: '2px' }}>
                Crest-to-Lake Storm Transit: ~{Math.max(22, Math.round(85 - (activeStormScenario.rainfallMm / 350) * 50))} mins • Peak Sheetwash Velocity: {((activeStormScenario.intensityMmH / 22) * 1.6).toFixed(1)} m/s down Bansdara Escarpment
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setShowTraceReasonModal(true)}
              className="apple-pressable"
              style={{
                padding: '6px 12px',
                fontSize: '0.72rem',
                fontWeight: 600,
                backgroundColor: '#F1EBDD',
                border: '1px solid var(--antique-gold)',
                borderRadius: '4px',
                color: 'var(--primary-forest)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <FileText size={12} />
              <span>Why did this change? (Geomorphic Transect Rationale)</span>
            </button>

            <button
              onClick={() => onNavigateToModule?.('simulation')}
              className="apple-pressable"
              style={{
                padding: '6px 12px',
                fontSize: '0.72rem',
                fontWeight: 700,
                backgroundColor: 'var(--deep-green)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span>Modify Storm in Simulator ↺</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Hero Section: Aravalli Bhū-Pravāh Anurekhak */}
      <div style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--fine-border)',
        boxShadow: 'var(--shadow-card)',
        marginBottom: '20px',
      }}>
        {/* Background Image with Dark Green Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('/images/lake_pichola_watershed.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          filter: 'brightness(0.80)',
          zIndex: 0,
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(16, 45, 35, 0.94) 0%, rgba(23, 61, 45, 0.88) 55%, rgba(23, 61, 45, 0.65) 100%)',
          zIndex: 1,
        }} />

        {/* Hero Content */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          padding: '24px 28px',
          color: '#FAF8F2',
        }}>
          {/* Eyebrow Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '3px 9px',
              borderRadius: '4px',
              backgroundColor: 'rgba(216, 181, 109, 0.22)',
              color: '#FCD34D',
              border: '1px solid rgba(216, 181, 109, 0.45)',
              letterSpacing: '0.04em',
            }}>
              ✦ मेवाड़ जल बुद्धिमत्ता तंत्र
            </span>
          </div>

          <h2 className="royal-title notranslate" style={{
            fontSize: '1.65rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            margin: '0 0 6px 0',
            color: '#FFFFFF',
            lineHeight: 1.2,
          }}>
            अरावली भू-प्रवाह अनुरेखक
          </h2>
          <div style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: '#D8B56D',
            marginBottom: '10px',
            textTransform: 'uppercase',
          }}>
            UPSTREAM LANDSCAPE TRACER
          </div>

          <p style={{
            fontSize: '0.80rem',
            color: '#E2E8F0',
            lineHeight: 1.5,
            margin: '0',
            maxWidth: '820px',
            fontWeight: 400,
          }}>
            Trace how sediment and runoff originating in the upstream Aravalli landscape move through drainage networks and agricultural areas before reaching downstream lakes. Explore mountain terrain, drainage pathways, farmland, lakes and conservation interventions as a connected system.
          </p>

          {/* Bottom Right Location Pin */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            right: '24px',
            backgroundColor: 'rgba(16, 45, 35, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '0.70rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <MapPin size={12} color="#FCD34D" />
            <span>Aravalli Ridges ➔ Lake Pichola</span>
          </div>
        </div>
      </div>

      {/* 3. Five Interconnected Landscape-Process Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '10px',
        marginBottom: '20px',
      }}>
        {/* Card 1: The Mountains */}
        <div
          onClick={() => {
            setActiveProcessCard(1);
            setLayers(prev => ({ ...prev, elevationDem: true, slopeAnalysis: true }));
          }}
          className="apple-pressable"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-sm)',
            border: activeProcessCard === 1 ? '1.5px solid var(--primary-forest)' : '1px solid var(--fine-border)',
            padding: '12px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.04)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  position: 'relative',
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}>
                  <Image src="/images/lake_pichola_watershed.jpg" alt="Mountains" fill sizes="32px" style={{ objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--secondary-text)', fontWeight: 600 }}>1. पर्वत क्षेत्र</div>
                  <strong style={{ fontSize: '0.74rem', color: 'var(--primary-forest)', display: 'block' }}>THE MOUNTAINS</strong>
                </div>
              </div>
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: activeProcessCard === 1 ? 'var(--deep-green)' : 'var(--surface-sandstone)',
                color: activeProcessCard === 1 ? '#FFFFFF' : 'var(--primary-forest)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.62rem',
              }}>
                ➔
              </div>
            </div>

            <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '0.68rem', color: 'var(--secondary-text)', lineHeight: 1.55 }}>
              <li>Elevation & terrain</li>
              <li>Slope & erosion risk</li>
              <li>Land cover condition</li>
              <li>Sediment source zones</li>
            </ul>
          </div>
        </div>

        {/* Card 2: The Drainage */}
        <div
          onClick={() => {
            setActiveProcessCard(2);
            setLayers(prev => ({ ...prev, drainageNetwork: true }));
          }}
          className="apple-pressable"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-sm)',
            border: activeProcessCard === 2 ? '1.5px solid var(--water-blue)' : '1px solid var(--fine-border)',
            padding: '12px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.04)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  position: 'relative',
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}>
                  <Image src="/images/rajasthan_aravalli_hero.jpg" alt="Drainage" fill sizes="32px" style={{ objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--secondary-text)', fontWeight: 600 }}>2. प्राकृतिक अपवाह</div>
                  <strong style={{ fontSize: '0.74rem', color: 'var(--water-blue)', display: 'block' }}>THE DRAINAGE</strong>
                </div>
              </div>
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: activeProcessCard === 2 ? 'var(--water-blue)' : 'var(--surface-sandstone)',
                color: activeProcessCard === 2 ? '#FFFFFF' : 'var(--primary-forest)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.62rem',
              }}>
                ➔
              </div>
            </div>

            <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '0.68rem', color: 'var(--secondary-text)', lineHeight: 1.55 }}>
              <li>Stream network & order</li>
              <li>Flow direction & connectivity</li>
              <li>Runoff accumulation</li>
              <li>Contributing pathways</li>
            </ul>
          </div>
        </div>

        {/* Card 3: The Farms */}
        <div
          onClick={() => {
            setActiveProcessCard(3);
            setLayers(prev => ({ ...prev, landUseCover: true }));
          }}
          className="apple-pressable"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-sm)',
            border: activeProcessCard === 3 ? '1.5px solid #25835A' : '1px solid var(--fine-border)',
            padding: '12px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.04)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  position: 'relative',
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}>
                  <Image src="/images/smallholder_terraced_farming.jpg" alt="Farms" fill sizes="32px" style={{ objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--secondary-text)', fontWeight: 600 }}>3. कृषि क्षेत्र</div>
                  <strong style={{ fontSize: '0.74rem', color: '#25835A', display: 'block' }}>THE FARMS</strong>
                </div>
              </div>
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: activeProcessCard === 3 ? '#25835A' : 'var(--surface-sandstone)',
                color: activeProcessCard === 3 ? '#FFFFFF' : 'var(--primary-forest)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.62rem',
              }}>
                ➔
              </div>
            </div>

            <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '0.68rem', color: 'var(--secondary-text)', lineHeight: 1.55 }}>
              <li>Agricultural land & crops</li>
              <li>Soil and land cover</li>
              <li>Erosion prone farm areas</li>
              <li>Farm-drainage relationship</li>
            </ul>
          </div>
        </div>

        {/* Card 4: The Lakes */}
        <div
          onClick={() => {
            setActiveProcessCard(4);
            setLayers(prev => ({ ...prev, lakeBoundary: true, upstreamCatchment: true }));
          }}
          className="apple-pressable"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-sm)',
            border: activeProcessCard === 4 ? '1.5px solid #1B4965' : '1px solid var(--fine-border)',
            padding: '12px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.04)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  position: 'relative',
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}>
                  <Image src="/images/aravalli_ridge_conservation.jpg" alt="Lakes" fill sizes="32px" style={{ objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--secondary-text)', fontWeight: 600 }}>4. झीलें</div>
                  <strong style={{ fontSize: '0.74rem', color: '#1B4965', display: 'block' }}>THE LAKES</strong>
                </div>
              </div>
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: activeProcessCard === 4 ? '#1B4965' : 'var(--surface-sandstone)',
                color: activeProcessCard === 4 ? '#FFFFFF' : 'var(--primary-forest)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.62rem',
              }}>
                ➔
              </div>
            </div>

            <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '0.68rem', color: 'var(--secondary-text)', lineHeight: 1.55 }}>
              <li>Lake boundary & catchment</li>
              <li>Inflow pathways</li>
              <li>Water level & sediment data</li>
              <li>Storage information</li>
            </ul>
          </div>
        </div>

        {/* Card 5: Interventions */}
        <div
          onClick={() => {
            setActiveProcessCard(5);
            setLayers(prev => ({ ...prev, interventions: true }));
          }}
          className="apple-pressable"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-sm)',
            border: activeProcessCard === 5 ? '1.5px solid var(--status-error)' : '1px solid var(--fine-border)',
            padding: '12px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.04)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  position: 'relative',
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}>
                  <Image src="/images/rajasthan_aravalli_hero.jpg" alt="Interventions" fill sizes="32px" style={{ objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--secondary-text)', fontWeight: 600 }}>5. संरक्षण संरचनाएं</div>
                  <strong style={{ fontSize: '0.74rem', color: 'var(--status-error)', display: 'block' }}>INTERVENTIONS</strong>
                </div>
              </div>
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: activeProcessCard === 5 ? 'var(--status-error)' : 'var(--surface-sandstone)',
                color: activeProcessCard === 5 ? '#FFFFFF' : 'var(--primary-forest)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.62rem',
              }}>
                ➔
              </div>
            </div>

            <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '0.68rem', color: 'var(--secondary-text)', lineHeight: 1.55 }}>
              <li>Check dams & contour bunds</li>
              <li>Watershed projects</li>
              <li>Afforestation & soil conservation</li>
              <li>Location, status and outcomes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Interactive Catchment Workspace (Two-Column Layout) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.65fr',
        gap: '18px',
        marginBottom: '20px',
      }}>
        {/* Left Column: Water-Body Selector & Lake Profile Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--fine-border)',
          padding: '16px 18px',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: '1px solid var(--fine-border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Droplets size={16} color="var(--primary-forest)" />
                <h3 style={{ fontSize: '0.90rem', fontWeight: 700, margin: 0, color: 'var(--primary-forest)' }}>
                  जल निकाय चुनें (Select a Water Body)
                </h3>
              </div>
            </div>

            {/* 3 Lake Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '14px' }}>
              {(['pichola', 'fatehsagar', 'badi'] as const).map((lakeKey) => {
                const lake = CATCHMENT_PROFILES[lakeKey];
                const isSelected = activeLakeId === lakeKey;
                return (
                  <button
                    key={lakeKey}
                    onClick={() => handleSelectLake(lakeKey)}
                    className="apple-pressable lake-button"
                    style={{
                      padding: '7px 4px',
                      fontSize: '0.74rem',
                      fontWeight: isSelected ? 700 : 500,
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isSelected ? 'var(--deep-green)' : 'var(--surface-sandstone)',
                      color: isSelected ? '#FFFFFF' : 'var(--primary-text)',
                      border: isSelected ? '1px solid var(--deep-green)' : '1px solid var(--fine-border)',
                      boxShadow: isSelected ? '0 2px 8px rgba(16, 45, 35, 0.22)' : 'none',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transform: isSelected ? 'scale(1.02)' : 'none',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    {lake.name}
                  </button>
                );
              })}
            </div>

            {/* Selected Lake Card */}
            <div style={{
              backgroundColor: '#FAFAFA',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--fine-border)',
              padding: '12px',
              marginBottom: '14px',
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{
                  position: 'relative',
                  width: '64px',
                  height: '46px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: '1px solid var(--fine-border)',
                  flexShrink: 0,
                }}>
                  <Image src={activeProfile.photoUrl} alt={activeProfile.name} fill sizes="64px" style={{ objectFit: 'cover' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--primary-forest)' }}>
                    {activeProfile.name} ({activeProfile.hindiName})
                  </h4>
                  <div style={{ fontSize: '0.68rem', color: 'var(--secondary-text)', marginTop: '2px' }}>
                    {activeProfile.tagline}
                  </div>
                </div>
              </div>

              {/* Lake Metrics Key-Value List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.74rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ECE7DD', paddingBottom: '4px' }}>
                  <span style={{ color: 'var(--secondary-text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Compass size={12} color="var(--primary-forest)" />
                    Catchment Area
                  </span>
                  <strong style={{ color: 'var(--primary-text)' }}>≈ {activeProfile.catchmentAreaSqKm} km²</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ECE7DD', paddingBottom: '4px' }}>
                  <span style={{ color: 'var(--secondary-text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mountain size={12} color="var(--status-warning)" />
                    Full Reservoir Level (FRL)
                  </span>
                  <strong style={{ color: 'var(--primary-text)' }}>{activeProfile.frlMeters} m MSL</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ECE7DD', paddingBottom: '4px' }}>
                  <span style={{ color: 'var(--secondary-text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Droplets size={12} color="var(--water-blue)" />
                    Current Water Level
                  </span>
                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ color: 'var(--water-blue)' }}>{activeProfile.currentLevelMeters} m MSL</strong>
                    <div style={{ fontSize: '0.62rem', color: 'var(--secondary-text)' }}>({activeProfile.levelDate})</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ECE7DD', paddingBottom: '4px' }}>
                  <span style={{ color: 'var(--secondary-text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Waves size={12} color="var(--primary-forest)" />
                    Storage Capacity
                  </span>
                  <strong style={{ color: 'var(--primary-text)' }}>{activeProfile.capacityMcm} MCM</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ECE7DD', paddingBottom: '4px' }}>
                  <span style={{ color: 'var(--secondary-text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Wind size={12} color="var(--status-error)" />
                    Primary Inflow
                  </span>
                  <span style={{ color: 'var(--primary-text)', fontWeight: 600, fontSize: '0.70rem' }}>
                    {activeProfile.primaryInflow}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '2px' }}>
                  <span style={{ color: 'var(--secondary-text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={12} color="#15803D" />
                    Data Quality
                  </span>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: '#15803D',
                    backgroundColor: '#EDF7EE',
                    padding: '2px 7px',
                    borderRadius: '4px',
                  }}>
                    ● {activeProfile.dataQuality}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Button */}
          <button
            onClick={() => onOpenMap && onOpenMap()}
            className="apple-pressable"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--fine-border)',
              color: 'var(--primary-forest)',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <span>View Detailed Lake Dashboard</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Right Column: Interactive Catchment Map */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--fine-border)',
          padding: '16px',
          boxShadow: 'var(--shadow-card)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Top Bar inside Map Panel */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px',
            zIndex: 10,
          }}>
            {/* Catchment Dropdown */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--surface-sandstone)',
              border: '1px solid var(--fine-border)',
              fontSize: '0.74rem',
              fontWeight: 700,
              color: 'var(--primary-forest)',
              cursor: 'pointer',
            }}>
              <span>{activeProfile.name} Catchment</span>
              <ChevronDown size={14} />
            </div>

            <div style={{ fontSize: '0.68rem', color: 'var(--secondary-text)' }}>
              Copernicus 30m DEM • Aravalli Basin
            </div>
          </div>

          {/* Map Viewport Canvas (SVG GIS Catchment Simulation) */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '360px',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            backgroundColor: '#1C2E24',
            border: '1px solid var(--fine-border)',
          }}>
            {/* Background Terrain / Satellite Imagery */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: basemapMode === 'satellite'
                ? `url('/images/rajasthan_aravalli_hero.jpg')`
                : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.55) contrast(1.15)',
              zIndex: 0,
            }} />

            {/* SVG Catchment Polygons & Drainage Stream Vectors */}
            <svg
              viewBox="0 0 600 360"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                zIndex: 2,
              }}
            >
              <defs>
                {/* Elevation Shaded Relief Gradient */}
                <radialGradient id="catchmentDemGrad" cx="45%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#8A2E1B" stopOpacity="0.80" />
                  <stop offset="35%" stopColor="#C88732" stopOpacity="0.75" />
                  <stop offset="65%" stopColor="#4A7C59" stopOpacity="0.70" />
                  <stop offset="100%" stopColor="#1B4965" stopOpacity="0.85" />
                </radialGradient>
                {/* Stream Glow Filter */}
                <filter id="streamGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Upstream Catchment Polygon with Shaded Relief DEM */}
              {layers.upstreamCatchment && (
                <path
                  d="M 310,40 C 370,50 430,100 445,160 C 460,220 420,280 370,300 C 320,320 280,310 240,280 C 200,250 180,180 200,120 C 220,60 260,35 310,40 Z"
                  fill="url(#catchmentDemGrad)"
                  stroke="#FCD34D"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
              )}

              {/* Drainage Stream Networks (Dendritic Blue Lines with Animated Flow) */}
              {layers.drainageNetwork && (
                <g filter="url(#streamGlow)">
                  {/* Main Trunk: Saijangarh to Pichola */}
                  <path
                    d="M 315,50 Q 320,100 340,150 T 365,230 T 385,285"
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="3.5"
                    className="stream-water-pulse stream-glow"
                  />
                  {/* Bujhra Nala Tributary */}
                  <path
                    d="M 230,140 Q 270,165 340,150"
                    fill="none"
                    stroke="#93C5FD"
                    strokeWidth="2.2"
                    className="stream-water-pulse-secondary"
                  />
                  {/* Sisarma Feeder Tributary */}
                  <path
                    d="M 270,230 Q 310,240 365,230"
                    fill="none"
                    stroke="#93C5FD"
                    strokeWidth="2.2"
                    className="stream-water-pulse-secondary"
                  />
                  {/* Ayad River Inflow */}
                  <path
                    d="M 430,170 Q 400,200 370,245"
                    fill="none"
                    stroke="#93C5FD"
                    strokeWidth="2.2"
                    className="stream-water-pulse-secondary"
                  />
                  {/* Small 1st Order Gullies */}
                  <path d="M 270,80 Q 290,105 315,110" fill="none" stroke="#BAE6FD" strokeWidth="1.2" strokeDasharray="2 2" />
                  <path d="M 380,90 Q 355,115 340,135" fill="none" stroke="#BAE6FD" strokeWidth="1.2" strokeDasharray="2 2" />

                  {/* Flowing Water Particle Droplets travelling along channel */}
                  <circle r="3.2" fill="#FFFFFF" opacity="0.95" filter="drop-shadow(0 0 3px #60A5FA)">
                    <animateMotion path="M 315,50 Q 320,100 340,150 T 365,230 T 385,285" dur="2.8s" repeatCount="indefinite" />
                  </circle>
                  <circle r="2.5" fill="#93C5FD" opacity="0.85">
                    <animateMotion path="M 230,140 Q 270,165 340,150 T 365,230 T 385,285" dur="3.8s" repeatCount="indefinite" />
                  </circle>
                </g>
              )}

              {/* Lake Water Body Boundary (Terminal Reservoir) */}
              {layers.lakeBoundary && (
                <path
                  d="M 370,270 C 400,275 425,295 410,315 C 395,335 365,330 350,315 C 340,300 355,275 370,270 Z"
                  fill="#1B4965"
                  stroke="#38BDF8"
                  strokeWidth="2.5"
                  filter="drop-shadow(0 0 6px rgba(56, 189, 248, 0.5))"
                />
              )}

              {/* Interventions (Check Dams CD-01, CD-02, Johads with Live Radar Ping) */}
              {layers.interventions && (
                <g>
                  {/* Check Dam 1 (Bansdara Gorge) */}
                  <circle cx="340" cy="150" r="10" fill="none" stroke="#EF4444" strokeWidth="1.5" className="radar-ping" />
                  <circle cx="340" cy="150" r="4.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />

                  {/* Check Dam 2 (Bujhra Confluence) */}
                  <circle cx="280" cy="170" r="10" fill="none" stroke="#EF4444" strokeWidth="1.5" className="radar-ping" />
                  <circle cx="280" cy="170" r="4.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />

                  {/* Contour Bunds */}
                  <circle cx="365" cy="230" r="10" fill="none" stroke="#EF4444" strokeWidth="1.5" className="radar-ping" />
                  <circle cx="365" cy="230" r="4.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
                </g>
              )}

              {/* Map Labels on Canvas */}
              <text x="315" y="32" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle" filter="drop-shadow(0 1px 2px black)">
                Saijangarh Ridge (938 m)
              </text>
              <circle cx="315" cy="42" r="3.5" fill="#FCD34D" stroke="#000000" strokeWidth="1" />

              <text x="260" y="160" fill="#E2E8F0" fontSize="9" fontWeight="600" textAnchor="middle" filter="drop-shadow(0 1px 2px black)">
                Bujhra Nala
              </text>

              <text x="435" y="180" fill="#E2E8F0" fontSize="9" fontWeight="600" textAnchor="middle" filter="drop-shadow(0 1px 2px black)">
                Ayad River
              </text>

              <text x="385" y="310" fill="#FFFFFF" fontSize="10.5" fontWeight="bold" textAnchor="middle" filter="drop-shadow(0 1px 3px black)">
                Lake Pichola
              </text>

              <text x="445" y="300" fill="#CBD5E1" fontSize="9" fontWeight="600" textAnchor="middle">
                Udaipur
              </text>
            </svg>

            {/* Top-Left Map Tools */}
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              zIndex: 10,
            }}>
              <button
                className="apple-pressable"
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255,255,255,0.92)',
                  border: '1px solid var(--fine-border)',
                  color: 'var(--primary-forest)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontWeight: 800,
                }}
              >
                <Plus size={14} />
              </button>
              <button
                className="apple-pressable"
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255,255,255,0.92)',
                  border: '1px solid var(--fine-border)',
                  color: 'var(--primary-forest)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontWeight: 800,
                }}
              >
                <Minus size={14} />
              </button>
              <button
                onClick={() => onFlyToStep && onFlyToStep({
                  step: 1,
                  title: activeProfile.name,
                  locationName: activeProfile.name,
                  latitude: 24.5785,
                  longitude: 73.6805,
                  height: 1800,
                  heading: 0,
                  pitch: -45,
                  phenomenon: 'Catchment',
                  physicalProcess: 'Hydrology',
                  consequence: 'Storage',
                  recommendation: 'Active',
                })}
                className="apple-pressable"
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255,255,255,0.92)',
                  border: '1px solid var(--fine-border)',
                  color: 'var(--primary-forest)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Home size={13} />
              </button>
              <button
                onClick={() => onOpenMap && onOpenMap()}
                className="apple-pressable"
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255,255,255,0.92)',
                  border: '1px solid var(--fine-border)',
                  color: 'var(--primary-forest)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Compass size={13} />
              </button>
            </div>

            {/* Top-Right Collapsible Layer Selector & DEM Elevation Legend */}
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              zIndex: 10,
              backgroundColor: 'rgba(16, 45, 35, 0.88)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              padding: '10px 12px',
              color: '#FFFFFF',
              width: '180px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            }}>
              <div
                onClick={() => setIsLayersOpen(!isLayersOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  marginBottom: isLayersOpen ? '8px' : '0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={13} color="#FCD34D" />
                  <span>Layers</span>
                </div>
                <span>{isLayersOpen ? '−' : '+'}</span>
              </div>

              {isLayersOpen && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.66rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={layers.lakeBoundary} onChange={() => toggleLayer('lakeBoundary')} />
                      <span>Lake Boundary</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={layers.upstreamCatchment} onChange={() => toggleLayer('upstreamCatchment')} />
                      <span>Upstream Catchment</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={layers.drainageNetwork} onChange={() => toggleLayer('drainageNetwork')} />
                      <span>Drainage Network</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={layers.elevationDem} onChange={() => toggleLayer('elevationDem')} />
                      <span>Elevation (DEM)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={layers.slopeAnalysis} onChange={() => toggleLayer('slopeAnalysis')} />
                      <span>Slope Analysis</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={layers.landUseCover} onChange={() => toggleLayer('landUseCover')} />
                      <span>Land Use / Land Cover</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={layers.interventions} onChange={() => toggleLayer('interventions')} />
                      <span>Interventions (Check Dams)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={layers.monitoringStations} onChange={() => toggleLayer('monitoringStations')} />
                      <span>Monitoring Stations</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={layers.villageSettlements} onChange={() => toggleLayer('villageSettlements')} />
                      <span>Village / Settlements</span>
                    </label>
                  </div>

                  {/* Elevation Legend Ramp */}
                  <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                    <div style={{ fontSize: '0.62rem', color: '#D8B56D', fontWeight: 600, marginBottom: '4px' }}>
                      Elevation (m)
                    </div>
                    <div style={{
                      height: '6px',
                      borderRadius: '2px',
                      background: 'linear-gradient(90deg, #1B4965 0%, #4A7C59 35%, #C88732 70%, #8A2E1B 100%)',
                      marginBottom: '4px',
                    }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.58rem', color: '#D1D5DB' }}>
                      <span>450</span>
                      <span>600</span>
                      <span>750</span>
                      <span>900+</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.58rem', color: '#9CA3AF', marginTop: '4px' }}>
                      <span>0</span>
                      <span>5</span>
                      <span>10 km</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Bottom-Left Basemap Selector */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              display: 'flex',
              gap: '4px',
              zIndex: 10,
              backgroundColor: 'rgba(255,255,255,0.92)',
              padding: '3px',
              borderRadius: '6px',
              border: '1px solid var(--fine-border)',
            }}>
              {(['satellite', 'terrain', 'topographic'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setBasemapMode(mode)}
                  style={{
                    padding: '3px 8px',
                    fontSize: '0.66rem',
                    fontWeight: basemapMode === mode ? 700 : 500,
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: basemapMode === mode ? 'var(--deep-green)' : 'transparent',
                    color: basemapMode === mode ? '#FFFFFF' : 'var(--primary-text)',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Upstream Landscape Summary (Selected Catchment) - 6 Metric Cards */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--fine-border)',
        padding: '16px 20px',
        boxShadow: 'var(--shadow-card)',
        marginBottom: '20px',
      }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-forest)', marginBottom: '12px' }}>
          Upstream Landscape Summary ({activeProfile.name} Catchment)
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '12px',
        }}>
          {/* 1. Highest Elevation */}
          <div style={{
            backgroundColor: '#FAFAFA',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--fine-border)',
            padding: '10px 12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-warning)', marginBottom: '4px' }}>
              <Mountain size={14} />
              <span style={{ fontSize: '0.66rem', color: 'var(--secondary-text)', fontWeight: 600 }}>Highest Elevation</span>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-text)' }}>
              {activeProfile.highestElevationMsl} m <span style={{ fontSize: '0.68rem', fontWeight: 500, color: 'var(--secondary-text)' }}>MSL</span>
            </div>
          </div>

          {/* 2. Lowest Elevation */}
          <div style={{
            backgroundColor: '#FAFAFA',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--fine-border)',
            padding: '10px 12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--water-blue)', marginBottom: '4px' }}>
              <ArrowDown size={14} />
              <span style={{ fontSize: '0.66rem', color: 'var(--secondary-text)', fontWeight: 600 }}>Lowest Elevation</span>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-text)' }}>
              {activeProfile.lowestElevationMsl} m <span style={{ fontSize: '0.68rem', fontWeight: 500, color: 'var(--secondary-text)' }}>MSL</span>
            </div>
          </div>

          {/* 3. Mean Slope */}
          <div style={{
            backgroundColor: '#FAFAFA',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--fine-border)',
            padding: '10px 12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-warning)', marginBottom: '4px' }}>
              <TrendingUp size={14} />
              <span style={{ fontSize: '0.66rem', color: 'var(--secondary-text)', fontWeight: 600 }}>Mean Slope</span>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-text)' }}>
              {activeProfile.meanSlopePct} %
            </div>
          </div>

          {/* 4. Total Drainage Length */}
          <div style={{
            backgroundColor: '#FAFAFA',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--fine-border)',
            padding: '10px 12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--water-blue)', marginBottom: '4px' }}>
              <Waves size={14} />
              <span style={{ fontSize: '0.66rem', color: 'var(--secondary-text)', fontWeight: 600 }}>Total Drainage Length</span>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-text)' }}>
              {activeProfile.totalDrainageKm} km
            </div>
          </div>

          {/* 5. Agricultural Area */}
          <div style={{
            backgroundColor: '#FAFAFA',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--fine-border)',
            padding: '10px 12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#25835A', marginBottom: '4px' }}>
              <Sprout size={14} />
              <span style={{ fontSize: '0.66rem', color: 'var(--secondary-text)', fontWeight: 600 }}>Agricultural Area</span>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-text)' }}>
              {activeProfile.agriculturalAreaSqKm} km² <span style={{ fontSize: '0.68rem', fontWeight: 500, color: 'var(--secondary-text)' }}>({activeProfile.agriculturalAreaPct}%)</span>
            </div>
          </div>

          {/* 6. Interventions */}
          <div style={{
            backgroundColor: '#FAFAFA',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--fine-border)',
            padding: '10px 12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-error)', marginBottom: '4px' }}>
              <ShieldCheck size={14} />
              <span style={{ fontSize: '0.66rem', color: 'var(--secondary-text)', fontWeight: 600 }}>Interventions</span>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-text)' }}>
              {activeProfile.interventionCount} <span style={{ fontSize: '0.68rem', fontWeight: 500, color: 'var(--secondary-text)' }}>structures</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Geomorphic Cross-Section: Selected Upstream Ridge to Lake */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--fine-border)',
        padding: '18px 22px',
        boxShadow: 'var(--shadow-card)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          paddingBottom: '10px',
          borderBottom: '1px solid var(--fine-border)',
          flexWrap: 'wrap',
          gap: '10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mountain size={16} color="var(--primary-forest)" />
            <h3 style={{ fontSize: '0.94rem', fontWeight: 800, margin: 0, color: 'var(--primary-forest)' }}>
              {activeProfile.transect.title}
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '0.70rem',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '9999px',
              backgroundColor: '#EDF7EE',
              color: '#15803D',
              border: '1px solid #BBF7D0',
            }}>
              {activeProfile.transect.elevationDropM} m Elevation Difference
            </span>
            <span style={{
              fontSize: '0.70rem',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '9999px',
              backgroundColor: '#FBE9E7',
              color: '#B94A38',
              border: '1px solid #FFCCBC',
            }}>
              {activeProfile.transect.distanceKm} km Transect Length
            </span>
          </div>
        </div>

        {/* Layout: Chart (Left) + Transect Details Card (Right) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 280px',
          gap: '20px',
        }}>
          {/* Cross-Section Elevation Chart Canvas */}
          <div style={{
            position: 'relative',
            height: '240px',
            backgroundColor: '#FAF9F6',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--fine-border)',
            padding: '12px 16px 24px 38px',
          }}>
            <svg
              viewBox="0 0 700 200"
              style={{ width: '100%', height: '100%', overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="profileAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C88732" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#768B4C" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#347FB3" stopOpacity="0.10" />
                </linearGradient>
                <linearGradient id="profileLineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#B94A38" />
                  <stop offset="30%" stopColor="#C88732" />
                  <stop offset="70%" stopColor="#768B4C" />
                  <stop offset="100%" stopColor="#347FB3" />
                </linearGradient>
              </defs>

              {/* Y-Axis Grid & Labels (m MSL: 400, 600, 800, 1000) */}
              {[400, 600, 800, 1000].map((elev) => {
                const y = 180 - ((elev - 400) / 600) * 150;
                return (
                  <g key={elev}>
                    <line x1="40" y1={y} x2="680" y2={y} stroke="#E5DEC9" strokeDasharray="3 3" strokeWidth="1" />
                    <text x="32" y={y + 3} fontSize="9" textAnchor="end" fill="#887F6E" fontFamily="monospace">
                      {elev}
                    </text>
                  </g>
                );
              })}
              <text x="8" y="100" fontSize="9" fill="#887F6E" transform="rotate(-90 8 100)" textAnchor="middle">
                Elevation (m MSL)
              </text>

              {/* X-Axis Ticks (km) */}
              {[0, 2, 4, 6, 8, 10, 12, 14].map((dist) => {
                const x = 50 + (dist / 14.2) * 620;
                return (
                  <g key={dist}>
                    <line x1={x} y1="180" x2={x} y2="185" stroke="#887F6E" strokeWidth="1" />
                    <text x={x} y="196" fontSize="9" textAnchor="middle" fill="#887F6E" fontFamily="monospace">
                      {dist}
                    </text>
                  </g>
                );
              })}
              <text x="360" y="210" fontSize="9" fill="#887F6E" textAnchor="middle">
                Distance (km)
              </text>

              {/* Dynamic Terrain Profile Polyline and Area */}
              {(() => {
                const wps = activeProfile.transect.waypoints;
                const pts = wps.map((wp) => {
                  const x = 50 + (wp.km / activeProfile.transect.distanceKm) * 620;
                  const y = 180 - ((wp.elevation - 400) / 600) * 150;
                  return { x, y, wp };
                });

                const polyPoints = `50,180 ` + pts.map(p => `${p.x},${p.y}`).join(' ') + ` 670,180`;
                const linePoints = pts.map(p => `${p.x},${p.y}`).join(' ');
                const slopePathD = pts.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`, '');

                return (
                  <>
                    <polygon points={polyPoints} fill="url(#profileAreaGrad)" />
                    <polyline points={linePoints} fill="none" stroke="url(#profileLineGrad)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Animated Water Pulse Droplet Travelling Down Transect Slope */}
                    <circle r="4.5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" filter="drop-shadow(0 0 6px #0284C7)">
                      <animateMotion path={slopePathD} dur="3.6s" repeatCount="indefinite" />
                    </circle>
                    <circle r="3" fill="#FFFFFF" opacity="0.85">
                      <animateMotion path={slopePathD} dur="3.6s" begin="0.25s" repeatCount="indefinite" />
                    </circle>
                    <circle r="2.2" fill="#BAE6FD" opacity="0.75">
                      <animateMotion path={slopePathD} dur="3.6s" begin="0.5s" repeatCount="indefinite" />
                    </circle>

                    {/* Waypoint Nodes and Labels */}
                    {pts.map((pt, idx) => {
                      const isHovered = hoveredWaypoint === idx;
                      const markerColor = idx === 0 ? '#B94A38' : idx === pts.length - 1 ? '#347FB3' : '#C88732';
                      return (
                        <g
                          key={idx}
                          onMouseEnter={() => setHoveredWaypoint(idx)}
                          onMouseLeave={() => setHoveredWaypoint(null)}
                          style={{ cursor: 'pointer' }}
                        >
                          {/* Pulsing Ripple Ring around each waypoint */}
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isHovered ? 12 : 8.5}
                            fill="none"
                            stroke={markerColor}
                            strokeWidth="1.5"
                            className="pulse-ring"
                            opacity={0.7}
                          />

                          {/* Vertical Marker Guide */}
                          <line x1={pt.x} y1={pt.y} x2={pt.x} y2="180" stroke={markerColor} strokeWidth="1" strokeDasharray="2 2" opacity={isHovered ? 1 : 0.4} />

                          {/* Node Circle */}
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isHovered ? 6.5 : 4.5}
                            fill={markerColor}
                            stroke="#FFFFFF"
                            strokeWidth={2}
                            style={{ transition: 'r 0.2s ease' }}
                          />

                          {/* Node Label Text */}
                          <text
                            x={pt.x}
                            y={pt.y - 12}
                            fontSize="9"
                            fontWeight="bold"
                            textAnchor="middle"
                            fill="var(--primary-text)"
                            filter="drop-shadow(0 1px 2px white)"
                          >
                            {pt.wp.label}
                          </text>
                          <text
                            x={pt.x}
                            y={pt.y - 2}
                            fontSize="8"
                            fontWeight="600"
                            textAnchor="middle"
                            fill="var(--secondary-text)"
                          >
                            {pt.wp.elevation} m
                          </text>
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredWaypoint !== null && (
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '20px',
                backgroundColor: 'rgba(16, 45, 35, 0.90)',
                color: '#FFFFFF',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.70rem',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              }}>
                <strong>{activeProfile.transect.waypoints[hoveredWaypoint].label}</strong>
                <div>Elevation: {activeProfile.transect.waypoints[hoveredWaypoint].elevation} m MSL</div>
                <div>Slope: {activeProfile.transect.waypoints[hoveredWaypoint].slope}</div>
                <div style={{ color: '#FCD34D' }}>{activeProfile.transect.waypoints[hoveredWaypoint].process}</div>
              </div>
            )}
          </div>

          {/* Right Column: Transect Details Card */}
          <div style={{
            backgroundColor: '#FAFAFA',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--fine-border)',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: '0.80rem', fontWeight: 800, color: 'var(--primary-forest)', marginBottom: '10px' }}>
                Transect Details
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.72rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--secondary-text)' }}>From</span>
                  <strong style={{ color: 'var(--primary-text)' }}>{activeProfile.transect.from}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--secondary-text)' }}>To</span>
                  <strong style={{ color: 'var(--primary-text)' }}>{activeProfile.transect.to}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--secondary-text)' }}>Distance</span>
                  <strong style={{ color: 'var(--primary-text)' }}>{activeProfile.transect.distanceKm} km</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--secondary-text)' }}>Elevation Drop</span>
                  <strong style={{ color: 'var(--status-error)' }}>{activeProfile.transect.elevationDropM} m</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--secondary-text)' }}>Mean Slope</span>
                  <strong style={{ color: 'var(--primary-text)' }}>{activeProfile.transect.meanSlopePct} %</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--secondary-text)' }}>Terrain Data</span>
                  <strong style={{ color: 'var(--primary-text)' }}>{activeProfile.transect.terrainData}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--secondary-text)' }}>Sample Interval</span>
                  <strong style={{ color: 'var(--primary-text)' }}>{activeProfile.transect.sampleInterval}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E5DEC9', paddingTop: '4px', marginTop: '2px' }}>
                  <span style={{ color: 'var(--secondary-text)' }}>Generated On</span>
                  <span style={{ color: 'var(--secondary-text)', fontSize: '0.68rem' }}>{activeProfile.transect.generatedOn}</span>
                </div>
              </div>
            </div>

            {/* Fly 3D Camera to Transect Button */}
            <button
              onClick={() => {
                if (onFlyToStep) {
                  onFlyToStep({
                    step: 1,
                    title: activeProfile.transect.title,
                    locationName: activeProfile.transect.from,
                    latitude: activeProfile.transect.flyCoords.latitude,
                    longitude: activeProfile.transect.flyCoords.longitude,
                    height: activeProfile.transect.flyCoords.height,
                    heading: 35,
                    pitch: -35,
                    phenomenon: activeProfile.transect.terrainData,
                    physicalProcess: 'Hydraulic head drop along Aravalli transect',
                    consequence: `${activeProfile.transect.elevationDropM}m altitude loss`,
                    recommendation: 'Check Dam & Contour Bund buffer array',
                  });
                }
              }}
              className="apple-pressable"
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--deep-green)',
                color: '#FFFFFF',
                fontSize: '0.74rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 2px 4px rgba(16, 45, 35, 0.2)',
              }}
            >
              <Compass size={13} />
              <span>Fly 3D Camera to Transect</span>
            </button>
          </div>
        </div>
      </div>
      {/* Modal: Why Did Flow Dynamics Change? (Geomorphic Transect Rationale) */}
      {showTraceReasonModal && activeStormScenario && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(16, 45, 35, 0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 110,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              width: '100%',
              maxWidth: '560px',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.22)',
              border: '2px solid var(--antique-gold)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--deep-green)',
                color: '#FAF8F2',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={18} color="#FCD34D" />
                <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800 }}>
                  Geomorphic Elevation Transect &amp; Velocity Dynamics
                </h3>
              </div>
              <button
                onClick={() => setShowTraceReasonModal(false)}
                style={{ background: 'none', border: 'none', color: '#FAF8F2', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '20px', fontSize: '0.78rem', color: 'var(--primary-text)', lineHeight: 1.6 }}>
              <div style={{ backgroundColor: '#EDF7EE', border: '1px solid #BBF7D0', padding: '12px', borderRadius: '6px', marginBottom: '14px', color: '#15803D' }}>
                <strong>Active Storm Simulation:</strong> {activeStormScenario.scenarioName} ({activeStormScenario.rainfallMm}mm over {activeStormScenario.durationHours}h)
              </div>

              <h4 style={{ margin: '0 0 6px 0', fontSize: '0.86rem', color: 'var(--primary-forest)', fontWeight: 800 }}>
                1. Overland Runoff Velocity Comparison
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                <div style={{ padding: '10px', backgroundColor: 'var(--surface-sandstone)', borderRadius: '4px', border: '1px solid var(--fine-border)' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--secondary-text)' }}>Calm Monsoon Baseline:</span>
                  <div className="mono-text" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--secondary-text)' }}>
                    0.8 m/s
                  </div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--secondary-text)' }}>Transit time: ~90 mins</div>
                </div>
                <div style={{ padding: '10px', backgroundColor: '#EDF7EE', borderRadius: '4px', border: '1px solid #BBF7D0' }}>
                  <span style={{ fontSize: '0.68rem', color: '#15803D' }}>Simulated Storm Surge:</span>
                  <div className="mono-text" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#15803D' }}>
                    {((activeStormScenario.intensityMmH / 22) * 1.6).toFixed(1)} m/s
                  </div>
                  <div style={{ fontSize: '0.64rem', color: '#15803D' }}>Transit time: ~{Math.max(22, Math.round(85 - (activeStormScenario.rainfallMm / 350) * 50))} mins</div>
                </div>
              </div>

              <h4 style={{ margin: '0 0 6px 0', fontSize: '0.86rem', color: 'var(--primary-forest)', fontWeight: 800 }}>
                2. Manning-Strickler Hydraulic Gradient Rationale
              </h4>
              <p style={{ margin: '0 0 10px 0', color: 'var(--secondary-text)' }}>
                Water velocity down the elevation drop of 348m (from Bansdara 938m MSL to Pichola 590m MSL) follows Manning&apos;s Equation: <br />
                <code>v = (1/n) × R^(2/3) × S^(1/2)</code>
              </p>
              <ul style={{ paddingLeft: '18px', margin: '0 0 14px 0', color: 'var(--secondary-text)', fontSize: '0.74rem' }}>
                <li><strong>Hydraulic Radius (R):</strong> High precipitation depth increases overland water film thickness, reducing relative ground roughness drag.</li>
                <li><strong>Slope Acceleration (S):</strong> 36.4% upper gradient accelerates flow rapidly before reaching middle terrace fields.</li>
                <li><strong>Intervention Role:</strong> Contour bunds and check dams introduce artificial hydraulic steps, cutting velocity by &gt;55% and trapping bedload gravel.</li>
              </ul>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--fine-border)' }}>
                <button
                  onClick={() => setShowTraceReasonModal(false)}
                  style={{ padding: '7px 14px', borderRadius: '4px', border: '1px solid var(--fine-border)', backgroundColor: '#FFFFFF', cursor: 'pointer', fontSize: '0.74rem' }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowTraceReasonModal(false);
                    onNavigateToModule?.('simulation');
                  }}
                  className="apple-pressable"
                  style={{ padding: '7px 16px', borderRadius: '4px', backgroundColor: 'var(--deep-green)', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontSize: '0.74rem', fontWeight: 700 }}
                >
                  Adjust Storm in Simulator ➔
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
