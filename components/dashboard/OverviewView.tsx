'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { STUDY_AREA } from '@/lib/geo-data';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Building,
  CheckCircle2,
  ChevronRight,
  CloudRain,
  Coins,
  Compass,
  Droplet,
  Droplets,
  ExternalLink,
  Eye,
  GitCommit,
  Globe2,
  Layers,
  MapPin,
  Mountain,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sprout,
  Store,
  TrendingUp,
  Truck,
  Waves,
  Wind,
} from 'lucide-react';

interface OverviewViewProps {
  onOpenMap: () => void;
  onOpenSimulation: () => void;
  onOpenTrace: () => void;
  onOpenFarmIntel?: () => void;
  onOpenInterventions?: () => void;
}

interface DistrictProfile {
  id: string;
  name: string;
  region: string;
  landscapeDescription: string;
  watershedHealthIndex: number;
  ndviScore: number;
  reservoirStoragePercent: number;
  primaryReservoirs: string;
  erosionRiskRate: number; // t/ha/yr
  cgwbStatus: string;
  dominantCrops: string;
  apmcMandiHub: string;
  fpoMarginGain: string;
  priorityIntervention: string;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onOpenMap,
  onOpenSimulation,
  onOpenTrace,
  onOpenFarmIntel,
  onOpenInterventions,
}) => {
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('udaipur');

  // Southern Rajasthan Regional Agro-Ecological Profiles
  const districtProfiles: Record<string, DistrictProfile> = {
    udaipur: {
      id: 'udaipur',
      name: 'Udaipur (Girwa Catchment)',
      region: 'Mewar Central Watershed',
      landscapeDescription: 'Steep quartzite Aravalli ridges framing the historic interconnected lake cascade (Pichola, Fateh Sagar, Badi, Swaroop Sagar, Udaisagar). High runoff velocities along Sajjangarh escarpment wash into smallholder terraces in Bujhra and Nai.',
      watershedHealthIndex: 72,
      ndviScore: 0.55,
      reservoirStoragePercent: 78,
      primaryReservoirs: 'Pichola (74%), Fateh Sagar (82%), Badi (79%), Swaroop Sagar (85%)',
      erosionRiskRate: 28.5,
      cgwbStatus: 'Critical / Over-Exploited',
      dominantCrops: 'Maize & Urad Pulses (Kharif) / Mustard & Wheat (Rabi)',
      apmcMandiHub: 'Savina Krishi Upaj Mandi (Udaipur APMC)',
      fpoMarginGain: '+17.5% net farmer realization via bulk collective aggregation',
      priorityIntervention: 'Masonry Check Dams along Sisarma river bed + Vetiver contour hedges across terraced fields',
    },
    rajsamand: {
      id: 'rajsamand',
      name: 'Rajsamand (Kumbhalgarh Ridge)',
      region: 'Upper Banas & Northern Mewar',
      landscapeDescription: 'High-altitude ridge water divide of the Aravallis, home to the Banas River origin and Kumbhalgarh sanctuary corridor. Acute marble quarry scree runoff threatens the Gomti river catchment feeding Rajsamand Lake.',
      watershedHealthIndex: 64,
      ndviScore: 0.48,
      reservoirStoragePercent: 62,
      primaryReservoirs: 'Rajsamand Lake (62%), Nandsamand Dam (68%)',
      erosionRiskRate: 34.2,
      cgwbStatus: 'Critical (High Marble Slurry Infiltration)',
      dominantCrops: 'Barley, Gram, Mustard, and Fodder Sorghum',
      apmcMandiHub: 'Kankroli Sub-Mandi Yard',
      fpoMarginGain: '+14.2% margin preservation avoiding village quarry-debt contractors',
      priorityIntervention: 'Quarry Gabion sediment filters + Dry-stone contour bunds on Kumbhalgarh slopes',
    },
    chittorgarh: {
      id: 'chittorgarh',
      name: 'Chittorgarh (Berach Basin)',
      region: 'Eastern Mewar Alluvial Plains',
      landscapeDescription: 'Rolling undulating plains dominated by medium black vertic soils and the Gambhiri-Berach river convergence. Historic citadel reservoirs and intense rabi cropping create severe seasonal groundwater stress.',
      watershedHealthIndex: 69,
      ndviScore: 0.61,
      reservoirStoragePercent: 71,
      primaryReservoirs: 'Gambhiri Reservoir (71%), Bassi Dam (69%)',
      erosionRiskRate: 18.4,
      cgwbStatus: 'Semi-Critical',
      dominantCrops: 'Soybean & Groundnut (Kharif) / Wheat, Mustard, Garlic (Rabi)',
      apmcMandiHub: 'Kapasan & Nimbahera APMC Mandis',
      fpoMarginGain: '+19.8% gain for garlic and mustard via e-NAM direct trade',
      priorityIntervention: 'Laser land leveling + Percolation tanks along Gambhiri feeder tributaries',
    },
    dungarpur: {
      id: 'dungarpur',
      name: 'Dungarpur (Vagad Foothills)',
      region: 'Vagad Agro-Climatic Zone',
      landscapeDescription: 'Rugged dissected hillocks populated by predominantly tribal smallholder hamlets. Red gravelly inceptisols on 15–25° slopes suffer extreme nutrient wash into the Som and Mahi river catchments.',
      watershedHealthIndex: 58,
      ndviScore: 0.44,
      reservoirStoragePercent: 54,
      primaryReservoirs: 'Som Kamla Amba Dam (54%), Edward Samand (58%)',
      erosionRiskRate: 38.6,
      cgwbStatus: 'Critical (Fractured Hard Rock Aquifers)',
      dominantCrops: 'Indigenous Maize, Urad, Moong, and Small Millets (Kodo/Kutki)',
      apmcMandiHub: 'Dungarpur Tribal Krishi Upaj Mandi',
      fpoMarginGain: '+24.5% premium through indigenous organic pulse certification & direct supply',
      priorityIntervention: 'Community Johads (Earthen farm ponds) + Indigenous silvipasture contour hedgerows',
    },
    banswara: {
      id: 'banswara',
      name: 'Banswara (Mahi Basin)',
      region: 'The City of Hundred Islands',
      landscapeDescription: 'Southernmost boundary of Rajasthan fed by the perennial Mahi River and the massive Mahi Bajaj Sagar reservoir. Extensive canal irrigation networks coexist with vulnerable rainfed tribal ridge farming.',
      watershedHealthIndex: 79,
      ndviScore: 0.67,
      reservoirStoragePercent: 88,
      primaryReservoirs: 'Mahi Bajaj Sagar Dam (88%), Kagdi Pick-up Weir (92%)',
      erosionRiskRate: 14.8,
      cgwbStatus: 'Safe to Semi-Critical (Canal Recharge Zone)',
      dominantCrops: 'Cotton, Paddy, Sugarcane, and Hybrid Maize',
      apmcMandiHub: 'Banswara Central Grain & Cotton Market',
      fpoMarginGain: '+16.2% fair price realization bypassing informal moneylender ginning commissions',
      priorityIntervention: 'Micro-irrigation tail-end canal equity + Sub-watershed check dams on upper tribal ridges',
    },
  };

  const selectedDistrict = districtProfiles[selectedDistrictId] || districtProfiles['udaipur'];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '28px 20px 52px',
    }}>
      {/* Visual Editorial Hero Header Banner */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(235, 229, 216, 0.95)',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 8px 32px rgba(28, 34, 32, 0.05), 0 1px 3px rgba(28, 34, 32, 0.02)',
        overflow: 'hidden',
        marginBottom: '28px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          alignItems: 'stretch',
        }}>
          {/* Left Column: Editorial Typography & Actions */}
          <div style={{ padding: '36px 36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Badge Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <span className="badge badge-observed">Aravalli Build Championship</span>
                <span className="badge badge-modeled">Domain 4: Agri-Tech & Conservation</span>
                <span className="badge badge-live">Southern Rajasthan</span>
              </div>

              {/* Main Headline */}
              <h1 className="serif-title" style={{
                fontSize: '2.5rem',
                color: 'var(--color-forest)',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                marginBottom: '12px',
              }}>
                SOUTHERN RAJASTHAN: Natural Resource Intelligence & Agrarian Twin
              </h1>

              {/* Lead Copy */}
              <p style={{
                fontSize: '0.92rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '22px',
              }}>
                Uniting ancient Aravalli mountain corridors, smallholder terraced farmlands, and historic lake catchments. Bridging high-resolution 3D terrain modeling, USLE soil erosion diagnostics, regenerative farming blueprints, and fair APMC mandi price transparency across Mewar and Vagad.
              </p>
            </div>

            {/* Apple-Style Action Button Cluster */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', paddingTop: '8px' }}>
              <button
                onClick={onOpenMap}
                className="btn btn-primary apple-pressable"
                style={{
                  padding: '10px 20px',
                  fontSize: '0.86rem',
                  backgroundColor: 'var(--color-forest)',
                  color: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(30, 58, 43, 0.25)',
                }}
              >
                <Compass size={16} />
                Launch 3D Catchment Twin
              </button>

              {onOpenFarmIntel && (
                <button
                  onClick={onOpenFarmIntel}
                  className="btn btn-secondary apple-pressable"
                  style={{
                    padding: '10px 18px',
                    fontSize: '0.86rem',
                    color: 'var(--color-forest)',
                    borderColor: 'rgba(30, 58, 43, 0.25)',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <Sprout size={16} />
                  Farm Intelligence & Mandi
                </button>
              )}

              <button
                onClick={onOpenSimulation}
                className="btn btn-terracotta apple-pressable"
                style={{ padding: '10px 18px', fontSize: '0.86rem' }}
              >
                <CloudRain size={16} />
                Simulate Rainfall
              </button>
            </div>
          </div>

          {/* Right Column: Hero High-Definition Landscape Visual */}
          <div style={{
            position: 'relative',
            minHeight: '340px',
            backgroundColor: '#EBE5D8',
            overflow: 'hidden',
          }}>
            <img
              src="/images/rajasthan_aravalli_hero.jpg"
              alt="Southern Rajasthan Aravalli Mountain Range and Udaipur Lakes"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />

            {/* Frosted Floating Pill Overlay with Live Telemetry */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              right: '16px',
              padding: '10px 14px',
              backgroundColor: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            }}>
              <div>
                <span className="mono-text" style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-forest)', textTransform: 'uppercase' }}>
                  Aravalli-to-Lake Panoramic Perspective
                </span>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Sajjangarh Ridge (938m) • Girwa Terraces • Lake Pichola (577m)
                </div>
              </div>
              <span className="badge badge-live" style={{ fontSize: '0.64rem' }}>
                Retina 2.0x Twin Ready
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Southern Rajasthan District Selector (Apple Segmented Control) */}
      <div style={{
        marginBottom: '26px',
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        padding: '16px 20px',
        boxShadow: 'var(--shadow-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Southern Rajasthan Agro-Ecological Sub-Districts
            </h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>
              Filter regional telemetry, soil erosion risks, and APMC mandi realizations
            </p>
          </div>
          <span className="mono-text" style={{ fontSize: '0.72rem', color: 'var(--color-forest)', fontWeight: 600 }}>
            {selectedDistrict.region}
          </span>
        </div>

        {/* Segmented Pills */}
        <div className="apple-segmented-group" style={{ width: '100%', overflowX: 'auto', padding: '4px' }}>
          {Object.values(districtProfiles).map((d) => {
            const isSelected = d.id === selectedDistrict.id;
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDistrictId(d.id)}
                className={`apple-segmented-pill ${isSelected ? 'active' : ''}`}
                style={{ flex: 1, whiteSpace: 'nowrap', justifyContent: 'center' }}
              >
                <MapPin size={13} color={isSelected ? 'var(--color-forest)' : 'var(--text-tertiary)'} />
                {d.name.split(' (')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Live District Landscape Telemetry Board */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '14px',
        marginBottom: '28px',
      }}>
        {/* Metric 1: Watershed Health */}
        <div className="editorial-card apple-pressable" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.70rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Watershed Health Index
            </span>
            <Mountain size={16} color="var(--color-forest)" />
          </div>
          <div className="mono-text" style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--color-forest)' }}>
            {selectedDistrict.watershedHealthIndex} <span style={{ fontSize: '0.85rem' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            Aravalli ridge stability & infiltration
          </div>
        </div>

        {/* Metric 2: Vegetative Health NDVI */}
        <div className="editorial-card apple-pressable" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.70rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Vegetation Canopy (NDVI)
            </span>
            <Sprout size={16} color="var(--color-olive)" />
          </div>
          <div className="mono-text" style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--color-olive)' }}>
            {selectedDistrict.ndviScore} <span style={{ fontSize: '0.85rem' }}>NDVI</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            Sentinel-2 multispectral vegetation vigor
          </div>
        </div>

        {/* Metric 3: Reservoir Storage */}
        <div className="editorial-card apple-pressable" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.70rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Reservoir Storage Live
            </span>
            <Droplet size={16} color="var(--color-lake)" />
          </div>
          <div className="mono-text" style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--color-lake)' }}>
            {selectedDistrict.reservoirStoragePercent}% <span style={{ fontSize: '0.85rem' }}>Full</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {selectedDistrict.primaryReservoirs.split(',')[0]}
          </div>
        </div>

        {/* Metric 4: Soil Erosion Risk */}
        <div className="editorial-card apple-pressable" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.70rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              USLE Soil Loss Risk
            </span>
            <Wind size={16} color="var(--color-terracotta)" />
          </div>
          <div className="mono-text" style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--color-terracotta)' }}>
            {selectedDistrict.erosionRiskRate} <span style={{ fontSize: '0.75rem' }}>t/ha/yr</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            Tolerable ceiling: 7.5 t/ha/yr
          </div>
        </div>

        {/* Metric 5: Smallholder Mandi Disparity */}
        <div className="editorial-card apple-pressable" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.70rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              FPO Collective Gain
            </span>
            <Store size={16} color="#8A6E3D" />
          </div>
          <div className="mono-text" style={{ fontSize: '1.65rem', fontWeight: 700, color: '#8A6E3D' }}>
            +18.2% <span style={{ fontSize: '0.75rem' }}>Avg</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            Direct APMC vs village broker
          </div>
        </div>
      </div>

      {/* Selected District Deep-Dive Overview & Priority Intervention */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px',
        marginBottom: '36px',
      }}>
        {/* District Ecological Narrative */}
        <div className="editorial-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ padding: '6px', backgroundColor: 'var(--color-forest-bg)', borderRadius: '4px', color: 'var(--color-forest)' }}>
              <Globe2 size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                {selectedDistrict.name} Landscape Profile
              </h3>
              <span className="mono-text" style={{ fontSize: '0.70rem', color: 'var(--text-tertiary)' }}>
                {selectedDistrict.region}
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '16px' }}>
            {selectedDistrict.landscapeDescription}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Major Reservoir Network:</span>
              <strong style={{ color: 'var(--color-lake)' }}>{selectedDistrict.primaryReservoirs}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Primary Cropping Calendar:</span>
              <span style={{ color: 'var(--text-primary)' }}>{selectedDistrict.dominantCrops}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>CGWB Aquifer Vulnerability:</span>
              <strong style={{ color: 'var(--color-terracotta)' }}>{selectedDistrict.cgwbStatus}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Central APMC Mandi:</span>
              <strong style={{ color: 'var(--color-forest)' }}>{selectedDistrict.apmcMandiHub}</strong>
            </div>
          </div>
        </div>

        {/* Priority Conservation & Livelihood Action Card */}
        <div className="editorial-card" style={{ padding: '24px', backgroundColor: '#FAF8F5', border: '1.5px solid #DCD4C4' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ padding: '6px', backgroundColor: '#FFFFFF', borderRadius: '4px', color: 'var(--color-forest)' }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-forest)', margin: 0 }}>
                Priority Action Blueprint
              </h3>
              <span style={{ fontSize: '0.70rem', color: 'var(--text-tertiary)' }}>
                State Watershed Development & Soil Conservation (WDSC) Directive
              </span>
            </div>
          </div>

          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(30, 58, 43, 0.15)',
            padding: '12px 14px',
            borderRadius: '6px',
            marginBottom: '16px',
          }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-forest)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Engineered Field Intervention
            </span>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-forest)', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
              {selectedDistrict.priorityIntervention}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} color="var(--color-forest)" />
              <span><strong>Mandi Equity:</strong> {selectedDistrict.fpoMarginGain}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} color="var(--color-forest)" />
              <span><strong>Lake Silt Defense:</strong> Stops upstream sediment before entering reservoirs.</span>
            </div>
          </div>

          {onOpenFarmIntel && (
            <button
              onClick={onOpenFarmIntel}
              className="btn btn-primary apple-pressable"
              style={{ width: '100%', fontSize: '0.84rem' }}
            >
              Open Smallholder Farm Intelligence View
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* The 3-Tier "Ridge-to-Lake" (रिज से झील) Visual Image Showcase */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <span className="badge badge-observed" style={{ marginBottom: '6px' }}>
            Core Paradigm: Domain 4 Closed-Loop
          </span>
          <h2 className="serif-title" style={{ fontSize: '1.95rem', color: 'var(--color-forest)', margin: 0 }}>
            The "Ridge-to-Lake" (रिज से झील) Environmental Continuum
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', maxWidth: '680px', margin: '4px auto 0' }}>
            Mountain forestry, terraced smallholder farming, and municipal lakes form a single interconnected hydrologic continuum.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
        }}>
          {/* Tier 1: Mountain Ridge */}
          <div className="editorial-card apple-pressable" style={{ padding: 0, overflow: 'hidden', borderTop: '4px solid #8A7A64' }}>
            <div style={{ position: 'relative', height: '170px', backgroundColor: '#EDE8DE' }}>
              <img
                src="/images/aravalli_ridge_conservation.jpg"
                alt="Aravalli Ridge Check Dam and Contour Bunds"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                padding: '3px 8px',
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.66rem',
                fontWeight: 700,
                color: '#6E5C3B',
              }}>
                TIER 1: THE SOURCE
              </div>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Aravalli Mountain Ridge & Escarpment
                </h3>
                <Mountain size={18} color="#8A7A64" />
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                Steep 28–35° quartzite slopes. Unmitigated flash runoff accelerates to 1.8 m/s, stripping nutrient-rich topsoil and washing into valley catchments.
              </p>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px 12px', borderRadius: '4px', fontSize: '0.74rem' }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>Engineered Interventions:</strong>
                Dry-stone contour bunds, loose boulder check dams (CD-01), and Aravalli Green Wall native re-greening (Dhok & Salar).
              </div>
            </div>
          </div>

          {/* Tier 2: Agrarian Valleys */}
          <div className="editorial-card apple-pressable" style={{ padding: 0, overflow: 'hidden', borderTop: '4px solid var(--color-forest)' }}>
            <div style={{ position: 'relative', height: '170px', backgroundColor: '#EDE8DE' }}>
              <img
                src="/images/smallholder_terraced_farming.jpg"
                alt="Smallholder Terraced Farmland with Vetiver Hedges"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                padding: '3px 8px',
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.66rem',
                fontWeight: 700,
                color: 'var(--color-forest)',
              }}>
                TIER 2: THE BUFFER
              </div>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Smallholder Terraced Farmlands
                </h3>
                <Sprout size={18} color="var(--color-forest)" />
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                Fragmented 1.2–2.4 ha holdings in Bujhra, Nai, and Vagad. Farmers face severe rill erosion, mid-monsoon moisture stress, and middleman price exploitation.
              </p>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px 12px', borderRadius: '4px', fontSize: '0.74rem' }}>
                <strong style={{ color: 'var(--color-forest)', display: 'block', marginBottom: '2px' }}>Engineered Interventions:</strong>
                Vetiver (Khus) living hedgerows, biochar micro-dosing, farm Johads, and direct collective FPO APMC Mandi dispatch.
              </div>
            </div>
          </div>

          {/* Tier 3: Lakes & Reservoirs */}
          <div className="editorial-card apple-pressable" style={{ padding: 0, overflow: 'hidden', borderTop: '4px solid var(--color-lake)' }}>
            <div style={{ position: 'relative', height: '170px', backgroundColor: '#EDE8DE' }}>
              <img
                src="/images/lake_pichola_watershed.jpg"
                alt="Lake Pichola Catchment in Udaipur"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                padding: '3px 8px',
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.66rem',
                fontWeight: 700,
                color: 'var(--color-lake)',
              }}>
                TIER 3: THE SINK
              </div>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Historic Lakes & Drinking Security
                </h3>
                <Waves size={18} color="var(--color-lake)" />
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                Lake Pichola, Fateh Sagar, Badi, and Rajsamand. Upstream sediment shrinks lake dead storage by 2.4% annually, requiring ₹450/m³ in municipal dredging.
              </p>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px 12px', borderRadius: '4px', fontSize: '0.74rem' }}>
                <strong style={{ color: 'var(--color-lake)', display: 'block', marginBottom: '2px' }}>Engineered Interventions:</strong>
                Swaroop Sagar link gates, desiltation traps, and Payment for Ecosystem Services (PES) upstream farmer compact.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "Window to the 3D Twin" (Apple Hero Card) */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1.5px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '28px 32px',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
      }}>
        <div style={{ maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-live">Live CesiumJS 3D Core</span>
            <span className="badge badge-modeled">Retina 2.0x Ultra-HD</span>
          </div>
          <h3 className="serif-title" style={{ fontSize: '1.6rem', color: 'var(--color-forest)', marginBottom: '6px' }}>
            Step Inside the 3D Digital Twin
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Inspect authentic 3D architectural models of the <strong>Monsoon Palace (Sajjangarh Fort)</strong>, <strong>City Palace</strong>, <strong>Taj Lake Palace</strong>, <strong>Jag Mandir</strong>, and engineered check dams along the Sisarma riverbed with Esri cartographic reference labels.
          </p>
        </div>

        <button
          onClick={onOpenMap}
          className="btn btn-primary apple-pressable"
          style={{
            padding: '12px 24px',
            fontSize: '0.90rem',
            backgroundColor: 'var(--color-forest)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Compass size={18} />
          Enter 3D Digital Twin
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
