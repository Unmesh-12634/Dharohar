'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  CheckCircle2,
  Clock,
  Compass,
  Droplets,
  Eye,
  FastForward,
  Gauge,
  Layers,
  MapPin,
  Mountain,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Waves,
  X,
} from 'lucide-react';

export interface RaindropTracePoint {
  latitude: number;
  longitude: number;
  elevationMeters: number;
  label: string;
  slopePercent: number;
  velocityMs: number;
  sedimentTonsHa: number;
  status: string;
}

export interface RaindropScenario {
  id: string;
  title: string;
  originName: string;
  destinationLake: string;
  startElevation: number;
  endElevation: number;
  totalDistanceKm: number;
  timeOfConcentrationMin: number;
  peakVelocityMs: number;
  soilLossRisk: 'Severe' | 'Moderate' | 'Critical';
  checkDamIntercepted: boolean;
  interceptingStructure?: string;
  path: RaindropTracePoint[];
  narrative: string;
}

export const RAINDROP_SCENARIOS: RaindropScenario[] = [
  {
    id: 'sajjangarh-pichola',
    title: 'Bansdara Peak to Lake Pichola',
    originName: 'Monsoon Palace Ridgeline (Sajjangarh Ridge)',
    destinationLake: 'Lake Pichola (Sisarma Inflow Delta)',
    startElevation: 938,
    endElevation: 590,
    totalDistanceKm: 6.8,
    timeOfConcentrationMin: 42,
    peakVelocityMs: 3.2,
    soilLossRisk: 'Critical',
    checkDamIntercepted: true,
    interceptingStructure: 'Upper Sisarma Masonry Check Dam (CD-01)',
    narrative:
      'High-altitude thunderstorm precipitation strikes bare quartzite scree slopes above 900m MSL. Gravity drives the flow into upper Sisarma fracture gully, accelerating to 3.2 m/s before hitting Check Dam CD-01, which dissipates 72% of kinetic energy and settles gravel bedload.',
    path: [
      {
        latitude: 24.5908,
        longitude: 73.6366,
        elevationMeters: 938,
        label: 'Drop Impact: Bansdara Ridge Crest',
        slopePercent: 36.4,
        velocityMs: 0.8,
        sedimentTonsHa: 42.5,
        status: 'Sheetwash Detachment',
      },
      {
        latitude: 24.582,
        longitude: 73.642,
        elevationMeters: 780,
        label: 'Upper Sisarma Escarpment Gully',
        slopePercent: 28.5,
        velocityMs: 2.6,
        sedimentTonsHa: 38.2,
        status: 'Rill & Gully Incision',
      },
      {
        latitude: 24.571,
        longitude: 73.655,
        elevationMeters: 670,
        label: 'Check Dam CD-01 Masonry Weir',
        slopePercent: 12.2,
        velocityMs: 1.1,
        sedimentTonsHa: 9.4,
        status: 'Velocity Stilled & Silt Trapped',
      },
      {
        latitude: 24.568,
        longitude: 73.665,
        elevationMeters: 615,
        label: 'Nai Village Smallholder Farm Terrace',
        slopePercent: 4.8,
        velocityMs: 1.3,
        sedimentTonsHa: 6.2,
        status: 'Aquifer Infiltration & Buffer',
      },
      {
        latitude: 24.5765,
        longitude: 73.6795,
        elevationMeters: 590,
        label: 'Terminal Discharge: Lake Pichola',
        slopePercent: 0.8,
        velocityMs: 0.5,
        sedimentTonsHa: 2.1,
        status: 'Clean Freshwater Reservoir Inflow',
      },
    ],
  },
  {
    id: 'bahubali-badi',
    title: 'Bahubali Hills to Badi Lake',
    originName: 'Bahubali Lookout Ridge Crest',
    destinationLake: 'Badi Lake (Jiyan Sagar)',
    startElevation: 710,
    endElevation: 605,
    totalDistanceKm: 2.4,
    timeOfConcentrationMin: 18,
    peakVelocityMs: 2.8,
    soilLossRisk: 'Severe',
    checkDamIntercepted: false,
    narrative:
      'Steep dolomite escarpment with 32% slope directly overlooking Badi Lake. Flash rain produces immediate high-velocity torrents that wash loose footpath gravel straight into the lake within 18 minutes without structural intervention.',
    path: [
      {
        latitude: 24.6315,
        longitude: 73.6212,
        elevationMeters: 710,
        label: 'Drop Impact: Bahubali Ridge Peak',
        slopePercent: 32.8,
        velocityMs: 1.2,
        sedimentTonsHa: 36.8,
        status: 'Unvegetated Scree Runoff',
      },
      {
        latitude: 24.627,
        longitude: 73.6235,
        elevationMeters: 650,
        label: 'Mid-Slope Trail Gully Fracture',
        slopePercent: 24.0,
        velocityMs: 2.8,
        sedimentTonsHa: 31.4,
        status: 'Active Headcut Migration',
      },
      {
        latitude: 24.6225,
        longitude: 73.6265,
        elevationMeters: 605,
        label: 'Terminal Basin: Badi Lake Shore',
        slopePercent: 2.1,
        velocityMs: 0.6,
        sedimentTonsHa: 14.5,
        status: 'Direct Lake Sedimentation',
      },
    ],
  },
  {
    id: 'madar-fatehsagar',
    title: 'Madar Ridge to Fateh Sagar Lake',
    originName: 'Upper Madar Catchment Ridge',
    destinationLake: 'Fateh Sagar Lake (North Bay)',
    startElevation: 680,
    endElevation: 588,
    totalDistanceKm: 5.6,
    timeOfConcentrationMin: 36,
    peakVelocityMs: 2.4,
    soilLossRisk: 'Moderate',
    checkDamIntercepted: true,
    interceptingStructure: 'Madar Feeder Canal Siphon Gates',
    narrative:
      'Flow cascades through agricultural terraced soils and enters the historic 1880s engineered feeder canal channel, regulated through stone lock gates into Fateh Sagar.',
    path: [
      {
        latitude: 24.642,
        longitude: 73.612,
        elevationMeters: 680,
        label: 'Drop Impact: Northern Aravalli Buffer',
        slopePercent: 18.5,
        velocityMs: 1.1,
        sedimentTonsHa: 22.0,
        status: 'Soil Infiltration Stage',
      },
      {
        latitude: 24.62,
        longitude: 73.645,
        elevationMeters: 615,
        label: 'Chhota Madar Spillway Cascade',
        slopePercent: 8.2,
        velocityMs: 1.8,
        sedimentTonsHa: 11.2,
        status: 'Channelized Feeder Flow',
      },
      {
        latitude: 24.6047,
        longitude: 73.6738,
        elevationMeters: 588,
        label: 'Terminal Discharge: Fateh Sagar Lake',
        slopePercent: 0.5,
        velocityMs: 0.4,
        sedimentTonsHa: 3.4,
        status: 'Reservoir Replenishment',
      },
    ],
  },
];

interface VirtualRaindropToolProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenario: RaindropScenario) => void;
  onFlyToStep: (step: RaindropTracePoint) => void;
  activeScenarioId?: string;
}

export const VirtualRaindropTool: React.FC<VirtualRaindropToolProps> = ({
  isOpen,
  onClose,
  onSelectScenario,
  onFlyToStep,
  activeScenarioId = 'sajjangarh-pichola',
}) => {
  const [selectedId, setSelectedId] = useState(activeScenarioId);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen) return null;

  const currentScenario =
    RAINDROP_SCENARIOS.find((s) => s.id === selectedId) || RAINDROP_SCENARIOS[0];
  const currentStep = currentScenario.path[activeStepIndex] || currentScenario.path[0];

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setActiveStepIndex(0);
    const scen = RAINDROP_SCENARIOS.find((s) => s.id === id) || RAINDROP_SCENARIOS[0];
    onSelectScenario(scen);
    onFlyToStep(scen.path[0]);
  };

  const handleStepClick = (index: number) => {
    setActiveStepIndex(index);
    onFlyToStep(currentScenario.path[index]);
  };

  const handleNextStep = () => {
    if (activeStepIndex < currentScenario.path.length - 1) {
      const nextIdx = activeStepIndex + 1;
      setActiveStepIndex(nextIdx);
      onFlyToStep(currentScenario.path[nextIdx]);
    }
  };

  const handlePrevStep = () => {
    if (activeStepIndex > 0) {
      const prevIdx = activeStepIndex - 1;
      setActiveStepIndex(prevIdx);
      onFlyToStep(currentScenario.path[prevIdx]);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '68px',
        left: '18px',
        width: '430px',
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
        backgroundColor: 'rgba(253, 251, 247, 0.98)',
        backdropFilter: 'blur(16px)',
        border: '1.5px solid var(--border-gold)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-mewar)',
        zIndex: 35,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      {/* Top Mewar Gold Hairline Accent */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '20px',
        right: '20px',
        height: '2.5px',
        background: 'linear-gradient(90deg, transparent, #C5A059 30%, #D97706 50%, #C5A059 70%, transparent)',
      }} />

      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-xs)',
              background: 'linear-gradient(135deg, #1B4965 0%, #0F2D3F 100%)',
              border: '1px solid var(--mewar-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(27, 73, 101, 0.25)',
            }}
          >
            <Droplets size={20} color="#F4E8CE" />
          </div>
          <div>
            <h3
              className="royal-title"
              style={{ fontSize: '1.05rem', color: 'var(--color-forest)', margin: 0, lineHeight: 1.15, fontWeight: 700 }}
            >
              जल प्रवाह सिमुलेटर
            </h3>
            <span
              style={{ fontSize: '0.67rem', color: 'var(--mewar-kesariya)', fontWeight: 600, display: 'block', marginTop: '1px' }}
            >
              Mewar D8 Gravitational Contour Runoff Tracer
            </span>
          </div>
        </div>
        <button onClick={onClose} className="btn btn-ghost" style={{ padding: '3px' }}>
          <X size={15} />
        </button>
      </div>

      {/* Scenario Selector Pills */}
      <div>
        <label
          style={{
            fontSize: '0.70rem',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            fontWeight: 600,
            display: 'block',
            marginBottom: '6px',
            letterSpacing: '0.04em',
          }}
        >
          Select Mountain Drop Origin:
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {RAINDROP_SCENARIOS.map((scen) => {
            const isSelected = scen.id === selectedId;
            return (
              <div
                key={scen.id}
                onClick={() => handleSelect(scen.id)}
                style={{
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-xs)',
                  border: isSelected ? '1px solid var(--color-forest)' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'var(--color-forest-bg)' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: isSelected ? 600 : 500, color: 'var(--text-primary)' }}>
                    🏔️ {scen.title}
                  </div>
                  <div style={{ fontSize: '0.67rem', color: 'var(--text-secondary)' }}>
                    {scen.startElevation}m MSL ➔ {scen.destinationLake.split('(')[0]} ({scen.totalDistanceKm} km)
                  </div>
                </div>
                <span
                  className="mono-text"
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    color: scen.soilLossRisk === 'Critical' ? 'var(--color-terracotta)' : 'var(--color-lake)',
                  }}
                >
                  {scen.soilLossRisk} Risk
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time Descent Telemetry Dashboard */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xs)',
          padding: '10px',
        }}
      >
        <div>
          <div style={{ fontSize: '0.64rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Drop Altitude</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-forest)' }}>
            {currentStep.elevationMeters}m
          </div>
          <div style={{ fontSize: '0.64rem', color: 'var(--text-secondary)' }}>MSL Elevation</div>
        </div>
        <div>
          <div style={{ fontSize: '0.64rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Slope Angle</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-terracotta)' }}>
            {currentStep.slopePercent}%
          </div>
          <div style={{ fontSize: '0.64rem', color: 'var(--text-secondary)' }}>Gradient Vector</div>
        </div>
        <div>
          <div style={{ fontSize: '0.64rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Water Velocity</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-lake)' }}>
            {currentStep.velocityMs} m/s
          </div>
          <div style={{ fontSize: '0.64rem', color: 'var(--text-secondary)' }}>Kinematic Surge</div>
        </div>
      </div>

      {/* Step-by-Step Gravitational Flow Journey */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-forest)', textTransform: 'uppercase' }}>
            Descent Stage ({activeStepIndex + 1} of {currentScenario.path.length})
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={handlePrevStep}
              disabled={activeStepIndex === 0}
              className="btn btn-ghost"
              style={{ padding: '2px 6px', fontSize: '0.72rem' }}
            >
              Prev
            </button>
            <button
              onClick={handleNextStep}
              disabled={activeStepIndex === currentScenario.path.length - 1}
              className="btn btn-primary"
              style={{ padding: '2px 8px', fontSize: '0.72rem' }}
            >
              Next Step ➔
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {currentScenario.path.map((step, idx) => {
            const isCurrent = idx === activeStepIndex;
            return (
              <div
                key={idx}
                onClick={() => handleStepClick(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-xs)',
                  border: isCurrent ? '1px solid var(--color-lake)' : '1px solid #ECE7DC',
                  backgroundColor: isCurrent ? '#EEF5F9' : '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: isCurrent ? 'var(--color-lake)' : '#D7CFBE',
                    color: '#FFFFFF',
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: isCurrent ? 600 : 500, color: 'var(--text-primary)' }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: '0.66rem', color: isCurrent ? 'var(--color-lake)' : 'var(--text-tertiary)' }}>
                    {step.status} • {step.elevationMeters}m MSL
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="mono-text" style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--color-terracotta)' }}>
                    {step.velocityMs} m/s
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Physics Diagnostics Narrative */}
      <div
        style={{
          backgroundColor: '#FAF7F0',
          borderLeft: '3px solid var(--color-forest)',
          borderRadius: '0 4px 4px 0',
          padding: '8px 12px',
          fontSize: '0.73rem',
          lineHeight: 1.5,
          color: 'var(--text-secondary)',
        }}
      >
        <strong style={{ color: 'var(--color-forest)', textTransform: 'uppercase', fontSize: '0.66rem' }}>
          Physical Impact Cascade:
        </strong>{' '}
        {currentScenario.narrative}
      </div>

      {/* Check Dam Interception Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 10px',
          borderRadius: 'var(--radius-xs)',
          backgroundColor: currentScenario.checkDamIntercepted ? '#EDF7EE' : '#FDF3EE',
          border: currentScenario.checkDamIntercepted ? '1px solid #C5E3C8' : '1px solid #F5D3C5',
          fontSize: '0.72rem',
          color: currentScenario.checkDamIntercepted ? '#1E5E2A' : '#9E381C',
        }}
      >
        {currentScenario.checkDamIntercepted ? <ShieldCheck size={16} /> : <AlertTriangle size={16} />}
        <div>
          <strong>{currentScenario.checkDamIntercepted ? 'Check Dam Intercepted ✓' : 'Unmitigated Downpour Warning ⚠️'}</strong>
          <div style={{ fontSize: '0.66rem' }}>
            {currentScenario.checkDamIntercepted
              ? `Safeguarded by ${currentScenario.interceptingStructure}. Peak velocity reduced by 65%.`
              : 'Direct torrent into lake with high silt load. Recommended: Deploy dry-stone gully plug.'}
          </div>
        </div>
      </div>
    </div>
  );
};
