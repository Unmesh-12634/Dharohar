'use client';

import React, { useState } from 'react';
import {
  CAUSE_EFFECT_TRACE,
  LAKES_DATA,
  UPSTREAM_CATCHMENT_TRACES,
} from '@/lib/geo-data';
import { TraceStep, UpstreamCatchmentTrace } from '@/lib/types';
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Droplets,
  GitCommit,
  Layers,
  MapPin,
  Mountain,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sprout,
  Waves,
} from 'lucide-react';

interface TransectSlice {
  distanceKm: number;
  elevationM: number;
  label: string;
  slopePercent: number;
  soilHorizon: string;
  sedimentLoad: string;
  hydraulicProcess: string;
  latitude: number;
  longitude: number;
}

interface TransectProfile {
  id: string;
  title: string;
  origin: string;
  destination: string;
  totalDistanceKm: number;
  hydraulicDropM: number;
  slices: TransectSlice[];
}

const TRANSECT_PROFILES: Record<string, TransectProfile> = {
  pichola: {
    id: 'pichola',
    title: 'Bansdara Ridge to Lake Pichola (Sisarma Transect)',
    origin: 'Sajjangarh Ridge (938m MSL)',
    destination: 'Lake Pichola Water Line (590m MSL)',
    totalDistanceKm: 14.2,
    hydraulicDropM: 348,
    slices: [
      {
        distanceKm: 0.0,
        elevationM: 938,
        label: 'Bansdara Ridge Crest',
        slopePercent: 36.4,
        soilHorizon: 'Quartzite Scree / Lithic Leptosol',
        sedimentLoad: '45.2 t/ha/yr',
        hydraulicProcess: 'High kinetic sheetwash detachment',
        latitude: 24.5908,
        longitude: 73.6366,
      },
      {
        distanceKm: 3.2,
        elevationM: 780,
        label: 'Upper Sisarma Escarpment Gully',
        slopePercent: 28.5,
        soilHorizon: 'Shallow Gravelly Regolith',
        sedimentLoad: '38.6 t/ha/yr',
        hydraulicProcess: 'Rill deepening & active headcut incision',
        latitude: 24.582,
        longitude: 73.642,
      },
      {
        distanceKm: 7.0,
        elevationM: 670,
        label: 'Check Dam CD-01 Weir Pond',
        slopePercent: 12.2,
        soilHorizon: 'Trapped Silt & Coarse Gravel Bedload',
        sedimentLoad: '9.4 t/ha/yr (76% arrested)',
        hydraulicProcess: 'Kinetic velocity dampening & silt retention',
        latitude: 24.571,
        longitude: 73.655,
      },
      {
        distanceKm: 10.4,
        elevationM: 615,
        label: 'Nai Valley Agricultural Terrace',
        slopePercent: 4.8,
        soilHorizon: 'Sandy Loam Alluvium (Arable)',
        sedimentLoad: '5.8 t/ha/yr',
        hydraulicProcess: 'Slow sheet infiltration & subsurface recharge',
        latitude: 24.568,
        longitude: 73.665,
      },
      {
        distanceKm: 14.2,
        elevationM: 590,
        label: 'Lake Pichola Shoreline Delta',
        slopePercent: 0.8,
        soilHorizon: 'Subaqueous Lacustrine Silt Clay',
        sedimentLoad: '2.1 t/ha/yr',
        hydraulicProcess: 'Terminal reservoir deposition & dead storage',
        latitude: 24.5765,
        longitude: 73.6795,
      },
    ],
  },
  fatehsagar: {
    id: 'fatehsagar',
    title: 'Northern Aravalli to Fateh Sagar Lake (Madar Feeder Transect)',
    origin: 'Madar Catchment Ridge (680m MSL)',
    destination: 'Fateh Sagar Lake (588m MSL)',
    totalDistanceKm: 11.5,
    hydraulicDropM: 92,
    slices: [
      {
        distanceKm: 0.0,
        elevationM: 680,
        label: 'Northern Catchment Divide',
        slopePercent: 21.0,
        soilHorizon: 'Mica-Schist Fractured Colluvium',
        sedimentLoad: '24.0 t/ha/yr',
        hydraulicProcess: 'Overland runoff initiation',
        latitude: 24.642,
        longitude: 73.612,
      },
      {
        distanceKm: 4.5,
        elevationM: 618,
        label: 'Chhota Madar Masonry Spillway',
        slopePercent: 8.5,
        soilHorizon: 'Silty Alluvial Basin',
        sedimentLoad: '12.0 t/ha/yr',
        hydraulicProcess: 'Feeder pond regulation and overflow',
        latitude: 24.62,
        longitude: 73.645,
      },
      {
        distanceKm: 8.2,
        elevationM: 600,
        label: 'Engineered Stone Feeder Canal',
        slopePercent: 2.2,
        soilHorizon: 'Masonry Lined Aqueduct Bed',
        sedimentLoad: '6.2 t/ha/yr',
        hydraulicProcess: 'Low-friction inter-lake gravity conveyance',
        latitude: 24.612,
        longitude: 73.66,
      },
      {
        distanceKm: 11.5,
        elevationM: 588,
        label: 'Fateh Sagar North Inflow Bay',
        slopePercent: 0.5,
        soilHorizon: 'Lacustrine Deep Mud',
        sedimentLoad: '3.4 t/ha/yr',
        hydraulicProcess: 'Urban drinking water reservoir replenishment',
        latitude: 24.6047,
        longitude: 73.6738,
      },
    ],
  },
  badi: {
    id: 'badi',
    title: 'Bahubali Lookout to Badi Lake (Hawala Valley Transect)',
    origin: 'Bahubali Ridge Crest (710m MSL)',
    destination: 'Badi Lake (605m MSL)',
    totalDistanceKm: 4.8,
    hydraulicDropM: 105,
    slices: [
      {
        distanceKm: 0.0,
        elevationM: 710,
        label: 'Bahubali Lookout Peak',
        slopePercent: 32.8,
        soilHorizon: 'Bare Dolomite Escarpment',
        sedimentLoad: '36.8 t/ha/yr',
        hydraulicProcess: 'Immediate steep runoff detachment',
        latitude: 24.6315,
        longitude: 73.6212,
      },
      {
        distanceKm: 1.8,
        elevationM: 650,
        label: 'Mid-Slope Trail Scree Fracture',
        slopePercent: 24.0,
        soilHorizon: 'Loose Gravelly Scree',
        sedimentLoad: '31.4 t/ha/yr',
        hydraulicProcess: 'Fast gullying along trekking trails',
        latitude: 24.627,
        longitude: 73.6235,
      },
      {
        distanceKm: 3.2,
        elevationM: 622,
        label: 'Hawala Johad Buffer Weir',
        slopePercent: 6.0,
        soilHorizon: 'Compacted Clayey Loam',
        sedimentLoad: '11.0 t/ha/yr',
        hydraulicProcess: 'Traditional earthen Johad water harvesting',
        latitude: 24.625,
        longitude: 73.625,
      },
      {
        distanceKm: 4.8,
        elevationM: 605,
        label: 'Badi Lake Embankment (Jiyan Sagar)',
        slopePercent: 1.2,
        soilHorizon: 'Submerged Reservoir Floor',
        sedimentLoad: '14.5 t/ha/yr',
        hydraulicProcess: 'Famine relief freshwater reserve',
        latitude: 24.6225,
        longitude: 73.6265,
      },
    ],
  },
};

interface CauseEffectExplorerProps {
  onFlyToStep: (step: TraceStep) => void;
  onOpenMap: () => void;
  onSelectLakeTrace?: (lakeId: string) => void;
  selectedLakeId?: string;
}

export const CauseEffectExplorer: React.FC<CauseEffectExplorerProps> = ({
  onFlyToStep,
  onOpenMap,
  onSelectLakeTrace,
  selectedLakeId = 'pichola',
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeLakeId, setActiveLakeId] = useState<string>(selectedLakeId);
  const [selectedSliceIndex, setSelectedSliceIndex] = useState<number>(0);
  const currentStep = CAUSE_EFFECT_TRACE[currentStepIndex];

  const activeCatchmentTrace = UPSTREAM_CATCHMENT_TRACES[activeLakeId] || UPSTREAM_CATCHMENT_TRACES.pichola;
  const activeTransect = TRANSECT_PROFILES[activeLakeId] || TRANSECT_PROFILES.pichola;
  const currentSlice = activeTransect.slices[selectedSliceIndex] || activeTransect.slices[0];

  const handleSelectLake = (id: string) => {
    setActiveLakeId(id);
    onSelectLakeTrace?.(id);
  };

  const handleSelectStep = (index: number) => {
    setCurrentStepIndex(index);
    onFlyToStep(CAUSE_EFFECT_TRACE[index]);
  };

  const handleNext = () => {
    if (currentStepIndex < CAUSE_EFFECT_TRACE.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      onFlyToStep(CAUSE_EFFECT_TRACE[nextIndex]);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      onFlyToStep(CAUSE_EFFECT_TRACE[prevIndex]);
    }
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '28px 24px 60px',
      color: 'var(--text-primary)',
    }}>
      {/* Mewar Heritage Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <span className="badge" style={{ backgroundColor: '#FEF3C7', color: '#B45309', border: '1px solid #FCD34D' }}>
            ✦ मेवाड़ जल संरक्षण तंत्र
          </span>
          <span className="badge badge-observed">3D Watershed Intelligence</span>
          <span className="badge badge-modeled">Upstream Causal Diagnostics</span>
          <span className="badge" style={{ backgroundColor: '#EDE5D5', color: '#574E39', border: '1px solid #D9CEB8' }}>
            Aravalli Ridge-to-Lake System
          </span>
        </div>
        <h2 className="royal-title" style={{ fontSize: '1.85rem', color: 'var(--color-forest)', marginBottom: '6px', fontWeight: 800 }}>
          अरावली भू-प्रवाह अनुरेखक (Upstream Landscape Tracer)
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '840px', lineHeight: 1.55 }}>
          Environmental crises in semi-arid watersheds do not exist in isolation.
          Sediment accumulation in Lake Pichola is not born at the waterfront—it originates 14 kilometers upstream on de-vegetated Aravalli mountain ridges.
          Connect the 5 critical landscape elements below: <strong>पर्वत शिखर (Mountains)</strong> ➔ <strong>अपवाह तंत्र (Drainage)</strong> ➔ <strong>कृषि भूमि (Farms)</strong> ➔ <strong>झीलें (Lakes)</strong> ➔ <strong>संरक्षण संरचनाएं (Interventions)</strong>.
        </p>
      </div>

      {/* The 5 Interconnected Elements Banner with Mewar Jharokha Accents */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '12px',
        marginBottom: '28px',
      }}>
        {/* 1. The Mountains */}
        <div className="mewar-card apple-pressable" style={{ padding: '16px', borderTop: '3.5px solid var(--color-forest)', borderBottom: '1px solid var(--border-gold)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ padding: '6px', borderRadius: '4px', backgroundColor: 'var(--color-forest-bg)', color: 'var(--color-forest)', border: '1px solid rgba(30,58,43,0.15)' }}>
              <Mountain size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.67rem', fontWeight: 700, color: 'var(--mewar-gold-dark)', letterSpacing: '0.04em' }}>
                १. पर्वत शिखर
              </div>
              <div style={{ fontSize: '0.74rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-forest)' }}>
                1. The Mountains
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Where runoff & erosion begin
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
            Steep quartzite slopes (&gt;30°) generate torrents and detach 45+ tons/ha/yr of topsoil.
          </p>
        </div>

        {/* 2. The Drainage Network */}
        <div className="mewar-card apple-pressable" style={{ padding: '16px', borderTop: '3.5px solid var(--mewar-lake)', borderBottom: '1px solid var(--border-gold)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ padding: '6px', borderRadius: '4px', backgroundColor: 'var(--color-lake-bg)', color: 'var(--color-lake)', border: '1px solid rgba(27,73,101,0.15)' }}>
              <Waves size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.67rem', fontWeight: 700, color: 'var(--mewar-gold-dark)', letterSpacing: '0.04em' }}>
                २. प्राकृतिक अपवाह
              </div>
              <div style={{ fontSize: '0.74rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-lake)' }}>
                2. The Drainage
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            How water moves across terrain
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
            1st & 2nd order gullies aggregate into high-velocity Sisarma and Ayad river streams.
          </p>
        </div>

        {/* 3. The Farms */}
        <div className="mewar-card apple-pressable" style={{ padding: '16px', borderTop: '3.5px solid #768B4C', borderBottom: '1px solid var(--border-gold)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ padding: '6px', borderRadius: '4px', backgroundColor: 'rgba(118, 139, 76, 0.15)', color: '#768B4C', border: '1px solid rgba(118,139,76,0.2)' }}>
              <Sprout size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.67rem', fontWeight: 700, color: 'var(--mewar-gold-dark)', letterSpacing: '0.04em' }}>
                ३. कृषि क्षेत्र
              </div>
              <div style={{ fontSize: '0.74rem', fontWeight: 600, textTransform: 'uppercase', color: '#5B6F35' }}>
                3. The Farms
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Where crops & livelihoods suffer
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
            Bujhra & Nai terraced fields are drowned by sandy slurry, washing away Kharif maize crops.
          </p>
        </div>

        {/* 4. The Lakes */}
        <div className="mewar-card apple-pressable" style={{ padding: '16px', borderTop: '3.5px solid #1B4965', borderBottom: '1px solid var(--border-gold)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ padding: '6px', borderRadius: '4px', backgroundColor: 'rgba(27, 73, 101, 0.15)', color: '#1B4965', border: '1px solid rgba(27,73,101,0.2)' }}>
              <Droplets size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.67rem', fontWeight: 700, color: 'var(--mewar-gold-dark)', letterSpacing: '0.04em' }}>
                ४. ऐतिहासिक झीलें
              </div>
              <div style={{ fontSize: '0.74rem', fontWeight: 600, textTransform: 'uppercase', color: '#1B4965' }}>
                4. The Lakes
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Where water & silt accumulate
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
            Pichola & Fateh Sagar lose dead storage capacity and experience high eutrophication.
          </p>
        </div>

        {/* 5. The Interventions */}
        <div className="mewar-card apple-pressable" style={{ padding: '16px', borderTop: '3.5px solid var(--color-terracotta)', borderBottom: '1px solid var(--border-gold)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ padding: '6px', borderRadius: '4px', backgroundColor: 'var(--color-terracotta-bg)', color: 'var(--color-terracotta)', border: '1px solid rgba(189,86,55,0.2)' }}>
              <ShieldCheck size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.67rem', fontWeight: 700, color: 'var(--mewar-gold-dark)', letterSpacing: '0.04em' }}>
                ५. संरक्षण संरचनाएं
              </div>
              <div style={{ fontSize: '0.74rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-terracotta)' }}>
                5. Interventions
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Actions to restore the landscape
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
            Masonry check dams, contour bunds, and agroforestry arrest 38% of sheetwash.
          </p>
        </div>
      </div>

      {/* Upstream Lake Tracer Interactive Selector */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        padding: '22px',
        marginBottom: '26px',
        boxShadow: 'var(--shadow-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--color-lake)', fontWeight: 600, textTransform: 'uppercase' }}>
              <Droplets size={13} />
              Interactive Lake Catchment Tracer
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
              Select a Water Body to Trace its Upstream Contributing Landscape:
            </h3>
          </div>
          <span className="badge badge-observed">
            {activeCatchmentTrace.catchmentAreaSqKm} km² Catchment Area
          </span>
        </div>

        {/* Lake Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {LAKES_DATA.slice(0, 3).map((lake) => {
            const isSelected = lake.id === activeLakeId;
            return (
              <button
                key={lake.id}
                onClick={() => handleSelectLake(lake.id)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-xs)',
                  border: isSelected ? '1.5px solid var(--color-lake)' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'var(--color-lake-bg)' : 'var(--bg-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.18s ease',
                }}
              >
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: isSelected ? 'var(--color-lake)' : 'var(--border-strong)',
                }} />
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: isSelected ? 600 : 500, color: 'var(--text-primary)' }}>
                    {lake.name} ({lake.localName})
                  </div>
                  <div style={{ fontSize: '0.70rem', color: 'var(--text-tertiary)' }}>
                    Storage: {lake.capacityMcm} MCM • Inflow via {lake.inflowRivers[0]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Trace Analysis Grid for Selected Lake */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px',
          padding: '16px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-xs)',
        }}>
          <div>
            <div style={{ fontSize: '0.70rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
              Contributing Mountain Origins:
            </div>
            <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {activeCatchmentTrace.mountainOrigins.map((m, idx) => (
                <div key={idx} style={{ fontSize: '0.78rem' }}>
                  <strong style={{ color: 'var(--color-forest)' }}>• {m.name}</strong>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{m.role}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.70rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
              Drainage Network Pathways:
            </div>
            <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {activeCatchmentTrace.mainTributaries.map((t, idx) => (
                <div key={idx} style={{ fontSize: '0.76rem', color: 'var(--text-primary)' }}>
                  ➔ {t}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.70rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
              Annual Upstream Sediment Delivery:
            </div>
            <div className="mono-text" style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--color-terracotta)', marginTop: '4px' }}>
              {activeCatchmentTrace.totalSiltDeliveryTonsPerYear.toLocaleString()} Tons / Year
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
              Sediment deposit rate threatens reservoir dead storage.
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Ridge-to-Lake Topographic Elevation Cross-Section Profile */}
      <div className="editorial-card" style={{ padding: '22px', marginBottom: '26px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.70rem', color: 'var(--color-forest)', fontWeight: 600, textTransform: 'uppercase' }}>
              <Mountain size={13} />
              Geomorphic Cross-Section & Hydraulic Drop Slicer
            </div>
            <h3 style={{ fontSize: '1.20rem', fontWeight: 600, color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
              {activeTransect.title}
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="mono-text" style={{ fontSize: '0.72rem', backgroundColor: '#EDF4EE', color: 'var(--color-forest)', padding: '3px 8px', borderRadius: '3px', fontWeight: 600 }}>
              ▲ {activeTransect.hydraulicDropM}m Total Hydraulic Drop
            </span>
            <span className="mono-text" style={{ fontSize: '0.72rem', backgroundColor: '#FDF3EE', color: 'var(--color-terracotta)', padding: '3px 8px', borderRadius: '3px', fontWeight: 600 }}>
              {activeTransect.totalDistanceKm} km Transect
            </span>
          </div>
        </div>

        {/* Interactive SVG Topographic Altitude Slice */}
        <div style={{ width: '100%', height: '220px', backgroundColor: '#FAF9F6', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)', padding: '8px 12px', position: 'relative', overflow: 'hidden' }}>
          <svg viewBox="0 0 800 210" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <linearGradient id="terrainGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4A6044" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#8A6E3D" stopOpacity="0.30" />
                <stop offset="100%" stopColor="#1B4965" stopOpacity="0.20" />
              </linearGradient>
              <linearGradient id="contourStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1E3A2B" />
                <stop offset="50%" stopColor="#BD5637" />
                <stop offset="100%" stopColor="#1B4965" />
              </linearGradient>
            </defs>

            {/* Altitude Reference Grid Lines */}
            {[900, 800, 700, 600].map((alt) => {
              // Map 550m..950m to Y=180..20
              const y = 180 - ((alt - 550) / 400) * 160;
              return (
                <g key={alt}>
                  <line x1="50" y1={y} x2="770" y2={y} stroke="#E2DCD0" strokeDasharray="3 3" strokeWidth="1" />
                  <text x="44" y={y + 4} fontSize="9" textAnchor="end" fill="#887F6E" fontFamily="monospace">
                    {alt}m
                  </text>
                </g>
              );
            })}

            {/* Terrain polygon area & contour polyline */}
            {(() => {
              const pts = activeTransect.slices.map((s) => {
                const x = 50 + (s.distanceKm / activeTransect.totalDistanceKm) * 720;
                const y = 180 - ((s.elevationM - 550) / 400) * 160;
                return { x, y, slice: s };
              });
              const polyPoints = `50,180 ` + pts.map((p) => `${p.x},${p.y}`).join(' ') + ` 770,180`;
              const linePoints = pts.map((p) => `${p.x},${p.y}`).join(' ');

              return (
                <>
                  <polygon points={polyPoints} fill="url(#terrainGradient)" />
                  <polyline points={linePoints} fill="none" stroke="url(#contourStroke)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

                  {/* Waypoint dots along the topographic slope */}
                  {pts.map((pt, idx) => {
                    const isSelected = idx === selectedSliceIndex;
                    return (
                      <g
                        key={idx}
                        onClick={() => setSelectedSliceIndex(idx)}
                        style={{ cursor: 'pointer' }}
                      >
                        {isSelected && (
                          <line x1={pt.x} y1="20" x2={pt.x} y2="180" stroke="#BD5637" strokeWidth="1.5" strokeDasharray="4 2" />
                        )}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isSelected ? 7 : 5}
                          fill={isSelected ? '#BD5637' : '#FFFFFF'}
                          stroke={isSelected ? '#FFFFFF' : '#1E3A2B'}
                          strokeWidth={isSelected ? 2.5 : 2}
                        />
                        <text
                          x={pt.x}
                          y={pt.y - 10}
                          fontSize="9.5"
                          fontWeight={isSelected ? 'bold' : '600'}
                          textAnchor="middle"
                          fill={isSelected ? '#BD5637' : '#1E3A2B'}
                          fontFamily="sans-serif"
                        >
                          {pt.slice.elevationM}m
                        </text>
                        <text
                          x={pt.x}
                          y="196"
                          fontSize="8.5"
                          textAnchor="middle"
                          fill="#7A7264"
                          fontFamily="monospace"
                        >
                          {pt.slice.distanceKm}km
                        </text>
                      </g>
                    );
                  })}
                </>
              );
            })()}
          </svg>
        </div>

        {/* Selected Elevation Slice Telemetry Card */}
        <div style={{
          marginTop: '12px',
          padding: '14px 16px',
          backgroundColor: '#F5F2EB',
          borderRadius: 'var(--radius-xs)',
          border: '1px solid rgba(42, 72, 54, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span className="mono-text" style={{ fontSize: '0.70rem', fontWeight: 700, color: 'var(--color-terracotta)' }}>
                TRANSECT STATION {selectedSliceIndex + 1} OF {activeTransect.slices.length}:
              </span>
              <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                {currentSlice.label}
              </strong>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              <span>▲ <strong>{currentSlice.elevationM}m MSL</strong></span>
              <span>• Distance: <strong>{currentSlice.distanceKm} km</strong></span>
              <span>• Slope: <strong>{currentSlice.slopePercent}%</strong></span>
              <span>• Soil: <strong style={{ color: 'var(--color-forest)' }}>{currentSlice.soilHorizon}</strong></span>
              <span>• USLE Detachment: <strong style={{ color: 'var(--color-terracotta)' }}>{currentSlice.sedimentLoad}</strong></span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px', fontStyle: 'italic' }}>
              Hydraulic Action: {currentSlice.hydraulicProcess}
            </div>
          </div>

          <button
            onClick={() => {
              onFlyToStep({
                step: selectedSliceIndex + 1,
                title: currentSlice.label,
                locationName: `${currentSlice.label} (${currentSlice.elevationM}m MSL)`,
                latitude: currentSlice.latitude,
                longitude: currentSlice.longitude,
                height: 1900,
                heading: 35,
                pitch: -30,
                phenomenon: currentSlice.soilHorizon,
                physicalProcess: currentSlice.hydraulicProcess,
                consequence: `Sediment detachment rate: ${currentSlice.sedimentLoad}`,
                recommendation: 'Targeted elevation transect buffer structure',
              });
            }}
            className="btn btn-primary apple-pressable"
            style={{ padding: '6px 12px', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '5px' }}
            title="Fly 3D Cesium camera to exact elevation station"
          >
            <Compass size={13} />
            Fly 3D Camera to Slice
          </button>
        </div>
      </div>

      {/* Causal Step Timeline Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${CAUSE_EFFECT_TRACE.length}, 1fr)`,
        gap: '8px',
        marginBottom: '24px',
      }}>
        {CAUSE_EFFECT_TRACE.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isPassed = idx < currentStepIndex;
          return (
            <div
              key={step.step}
              onClick={() => handleSelectStep(idx)}
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-xs)',
                border: isActive ? '1.5px solid var(--color-terracotta)' : '1px solid var(--border-subtle)',
                backgroundColor: isActive ? 'var(--color-terracotta-bg)' : isPassed ? 'var(--bg-secondary)' : 'var(--bg-card)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span className="mono-text" style={{ fontSize: '0.70rem', fontWeight: 600, color: isActive ? 'var(--color-terracotta)' : 'var(--text-tertiary)' }}>
                  STAGE 0{step.step}
                </span>
                {isPassed && <CheckCircle2 size={12} color="var(--color-forest)" />}
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: isActive ? 600 : 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {step.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Focus Card for Current Step */}
      <div className="editorial-card" style={{ padding: '26px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="mono-text" style={{
              fontSize: '0.86rem',
              fontWeight: 700,
              backgroundColor: 'var(--color-terracotta)',
              color: '#FFFFFF',
              padding: '4px 10px',
              borderRadius: 'var(--radius-xs)',
            }}>
              STAGE 0{currentStep.step}
            </span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              {currentStep.title}
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.80rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={13} color="var(--color-terracotta)" />
              {currentStep.locationName}
            </span>
            <button
              onClick={() => onFlyToStep(currentStep)}
              className="btn btn-ghost"
              style={{ padding: '4px 8px', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Compass size={13} />
              Fly Camera
            </button>
          </div>
        </div>

        {/* 3 Process Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-xs)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>
              PHYSICAL PHENOMENON:
            </div>
            <div style={{ fontSize: '0.90rem', fontWeight: 600, color: 'var(--color-forest)', marginBottom: '4px' }}>
              {currentStep.phenomenon}
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
              {currentStep.physicalProcess}
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-xs)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>
              DOWNSTREAM IMPACT CONSEQUENCE:
            </div>
            <div style={{ fontSize: '0.90rem', fontWeight: 600, color: 'var(--color-terracotta)', marginBottom: '4px' }}>
              Ecosystem Vulnerability
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
              {currentStep.consequence}
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-xs)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>
              TARGETED CONSERVATION REMEDY:
            </div>
            <div style={{ fontSize: '0.90rem', fontWeight: 600, color: 'var(--color-lake)', marginBottom: '4px' }}>
              Recommended Engineering
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
              {currentStep.recommendation}
            </p>
          </div>
        </div>

        {/* Stepper Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="btn btn-ghost"
            style={{ padding: '8px 14px', fontSize: '0.80rem', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <ChevronLeft size={16} />
            Previous Stage
          </button>

          <span className="mono-text" style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
            Stage {currentStepIndex + 1} of {CAUSE_EFFECT_TRACE.length}
          </span>

          <button
            onClick={handleNext}
            disabled={currentStepIndex === CAUSE_EFFECT_TRACE.length - 1}
            className="btn apple-pressable"
            style={{
              padding: '8px 16px',
              fontSize: '0.80rem',
              fontWeight: 600,
              backgroundColor: 'var(--color-forest)',
              color: '#FFFFFF',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Next Stage
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
