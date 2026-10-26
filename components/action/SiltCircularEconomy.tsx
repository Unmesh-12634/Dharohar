'use client';

import React, { useState } from 'react';
import {
  SILT_EXTRACTION_ZONES,
  FARM_RECIPIENT_CLUSTERS,
  SiltExtractionZone,
  FarmRecipientCluster,
} from '@/lib/solutions-data';
import { ActiveStormScenario } from '@/lib/types';
import {
  Truck,
  Droplets,
  Sprout,
  Leaf,
  Users,
  Coins,
  MapPin,
  Sparkles,
  Check,
  ChevronRight,
  BookOpen,
  ArrowRight,
  AlertTriangle,
  X,
  CheckCircle2,
  Home,
  FileText,
} from 'lucide-react';

interface SiltCircularEconomyProps {
  onOpenMap?: () => void;
  onNavigateToModule?: (view: string) => void;
  onAskCopilot?: (context: string) => void;
  onFlyToLocation?: (coords: { latitude: number; longitude: number; height?: number }) => void;
  activeStormScenario?: ActiveStormScenario | null;
}

export const SiltCircularEconomy: React.FC<SiltCircularEconomyProps> = ({
  onOpenMap,
  onNavigateToModule,
  onAskCopilot,
  onFlyToLocation,
  activeStormScenario,
}) => {
  const [selectedZone, setSelectedZone] = useState<SiltExtractionZone>(SILT_EXTRACTION_ZONES[0]);
  const [selectedCluster, setSelectedCluster] = useState<FarmRecipientCluster>(FARM_RECIPIENT_CLUSTERS[0]);
  const [allocatedTonnage, setAllocatedTonnage] = useState<number>(4500);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);
  const [showStormReasonModal, setShowStormReasonModal] = useState(false);

  // Dynamic calculations based on allocated tonnage
  const lakeCapacityRestoredMl = Math.round(allocatedTonnage * 0.72);
  const fertilizerSavingsLakhs = ((allocatedTonnage * 185) / 100000).toFixed(2);
  const truckTripsCount = Math.ceil(allocatedTonnage / 12); // 12-ton tipper trucks
  const municipalSubsidyLakhs = (
    (truckTripsCount * selectedCluster.subsidyPerTractorInr * selectedCluster.distanceFromLakeKm) /
    100000
  ).toFixed(2);
  const organicCarbonGainKg = Math.round(
    allocatedTonnage * (selectedZone.soilComposition.organicCarbonPercent / 100) * 1000
  );

  const handleZoneSelect = (zone: SiltExtractionZone) => {
    setSelectedZone(zone);
    if (allocatedTonnage > zone.estimatedVolumeTonnes) {
      setAllocatedTonnage(zone.estimatedVolumeTonnes);
    }
  };

  const handleTonnageChange = (val: number) => {
    const clamped = Math.max(0, Math.min(selectedZone.estimatedVolumeTonnes, isNaN(val) ? 0 : val));
    setAllocatedTonnage(clamped);
  };

  const handleConfirmDispatch = () => {
    setDispatchSuccess(true);
  };

  // Image assets mapping
  const zoneThumbnails: Record<string, string> = {
    'silt-pichola-inlet': '/images/lake_pichola_watershed.jpg',
    'silt-fateh-sagar-gate': '/images/rajasthan_aravalli_hero.jpg',
    'silt-goverdhan-sagar': '/images/aravalli_ridge_conservation.jpg',
  };

  const clusterThumbnails: Record<string, string> = {
    'farm-nai-terrace': '/images/smallholder_terraced_farming.jpg',
    'farm-bujhra-south': '/images/rajasthan_aravalli_hero.jpg',
    'farm-sisarma-east': '/images/lake_pichola_watershed.jpg',
    'farm-alsigarh-plateau': '/images/aravalli_ridge_conservation.jpg',
  };

  return (
    <div
      style={{
        padding: '16px 28px 40px 28px',
        backgroundColor: 'var(--bg-warm-ivory)',
        minHeight: '100%',
        color: 'var(--primary-text)',
      }}
    >
      {/* =========================================================================
          1. ACTION LAB MODULES SUB-NAVIGATION BAR
          ========================================================================= */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '6px 12px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--fine-border)',
          borderRadius: '9999px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          marginBottom: '14px',
          width: 'fit-content',
          margin: '0 auto 14px auto',
        }}
      >
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--antique-gold)', letterSpacing: '0.02em', paddingLeft: '4px' }}>
          ✦ Action Lab Modules:
        </span>

        {/* Module 1: Silt Loop (Active) */}
        <button
          onClick={() => onNavigateToModule?.('silt-loop')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            backgroundColor: 'var(--primary-forest)',
            color: '#FFFFFF',
            borderRadius: '9999px',
            fontSize: '0.74rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Truck size={13} />
          <span>1. Circular Silt-to-Farm Loop</span>
        </button>

        {/* Module 2: Water Credits */}
        <button
          onClick={() => onNavigateToModule?.('water-credits')}
          className="apple-pressable"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            backgroundColor: '#F1EBDD',
            color: 'var(--primary-text)',
            borderRadius: '9999px',
            fontSize: '0.74rem',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Droplets size={13} color="var(--lake-blue)" />
          <span>2. Hotel Water Credits (PES)</span>
        </button>

        {/* Module 3: Heritage Crop Market */}
        <button
          onClick={() => onNavigateToModule?.('heritage-crops')}
          className="apple-pressable"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            backgroundColor: '#F1EBDD',
            color: 'var(--primary-text)',
            borderRadius: '9999px',
            fontSize: '0.74rem',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Sprout size={13} color="var(--status-warning)" />
          <span>3. Heritage Crop Market</span>
        </button>

        {/* Module 4: Civil DPR */}
        <button
          onClick={() => onNavigateToModule?.('interventions')}
          className="apple-pressable"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            backgroundColor: '#F1EBDD',
            color: 'var(--primary-text)',
            borderRadius: '9999px',
            fontSize: '0.74rem',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <BookOpen size={13} color="var(--lake-blue)" />
          <span>4. Civil DPR & Check Dams</span>
        </button>
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
              <Sparkles size={18} color="#FCD34D" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.64rem', padding: '1px 6px', borderRadius: '3px', backgroundColor: '#EDF7EE', color: '#15803D', fontWeight: 800 }}>
                  ACTIVE CLIMATE SIMULATION
                </span>
                <span className="mono-text" style={{ fontSize: '0.72rem', color: 'var(--secondary-text)' }}>
                  {activeStormScenario.rainfallMm}mm • {activeStormScenario.intensityMmH} mm/hr Storm Event
                </span>
              </div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-forest)', marginTop: '2px' }}>
                Active Storm Silt Yield: +{activeStormScenario.lakeSiltYieldTons.toLocaleString()} Tons fresh sediment deposited at Sisarma delta
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setShowStormReasonModal(true)}
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
              <span>Why did this change? (RUSLE Rationale)</span>
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

      {/* =========================================================================
          2. BREADCRUMB ROW WITH "OPEN 3D MAP" ACTION
          ========================================================================= */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem' }}>
          <button
            onClick={() => onNavigateToModule?.('overview')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary-text)', display: 'flex', alignItems: 'center' }}
            title="Return to Home Overview"
          >
            <Home size={13} />
          </button>
          <span style={{ color: 'var(--fine-border)' }}>&gt;</span>
          <span
            onClick={() => onNavigateToModule?.('overview')}
            style={{ color: 'var(--secondary-text)', cursor: 'pointer' }}
          >
            Action Lab (Overview)
          </span>
          <span style={{ color: 'var(--fine-border)' }}>&gt;</span>
          <span
            style={{
              padding: '2px 8px',
              backgroundColor: '#FFFFFF',
              borderRadius: '9999px',
              border: '1px solid var(--fine-border)',
              fontWeight: 600,
              color: 'var(--primary-forest)',
            }}
          >
            Circular Silt-to-Farm Loop
          </span>
        </div>

        {/* Open 3D Map Button */}
        <button
          onClick={onOpenMap}
          className="apple-pressable"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 14px',
            backgroundColor: 'var(--primary-forest)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 'var(--radius-xs)',
            fontSize: '0.74rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(23, 61, 45, 0.2)',
          }}
        >
          <BookOpen size={13} />
          <span>Open 3D Map</span>
          <ArrowRight size={12} />
        </button>
      </div>

      {/* =========================================================================
          3. SCENIC HERO TITLE SECTION
          ========================================================================= */}
      <div
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-md)',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--fine-border)',
          padding: '24px 28px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
          marginBottom: '20px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '135px',
        }}
      >
        {/* Left Editorial Copy */}
        <div style={{ maxWidth: '58%', zIndex: 2 }}>
          <div
            style={{
              fontSize: '0.67rem',
              fontWeight: 800,
              color: 'var(--status-warning)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '5px',
            }}
          >
            CIRCULAR AGRI-ECOLOGY · DESILTING TO FARM TERRACES
          </div>
          <h1
            className="serif-title"
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--primary-forest)',
              lineHeight: 1.18,
              margin: '0 0 8px 0',
            }}
          >
            Circular Silt-to-Farm Logistics Engine
          </h1>
          <p
            style={{
              fontSize: '0.78rem',
              color: 'var(--secondary-text)',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Dharohar matches nutrient-dense lake silt from Udaipur&apos;s reservoirs with soil-depleted Aravalli smallholder terraces, creating a circular flow of natural fertility, lower dredging costs, and higher farm productivity.
          </p>
        </div>

        {/* Right Scenic Landscape Image */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '46%',
            backgroundImage: `url('/images/lake_pichola_watershed.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 25%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 25%, black 100%)',
          }}
        >
          {/* Overlaid Pill Badge */}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              borderRadius: '9999px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              fontSize: '0.68rem',
              color: 'var(--primary-forest)',
              fontWeight: 600,
              backdropFilter: 'blur(4px)',
            }}
          >
            <span style={{ fontSize: '0.72rem' }}>🌾</span>
            <span>Lake Pichola · Udaipur | From silt to thriving farms</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. FOUR KPI CARDS (Matching Reference Metrics)
          ========================================================================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '14px',
          marginBottom: '22px',
        }}
      >
        {/* KPI 1: Lake Capacity Restored */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--fine-border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#EBF5FA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Droplets size={18} color="var(--lake-blue)" />
            </div>
            <div>
              <div style={{ fontSize: '0.70rem', color: 'var(--secondary-text)', fontWeight: 500 }}>
                Lake Capacity Restored
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--lake-blue)', margin: '1px 0' }}>
                +{lakeCapacityRestoredMl.toLocaleString()} ML
              </div>
              <div style={{ fontSize: '0.66rem', color: 'var(--secondary-text)' }}>
                Active storage reclaimed
              </div>
            </div>
          </div>
          {/* Subtle Wave Graphic */}
          <svg width="48" height="28" viewBox="0 0 48 28" fill="none" opacity="0.4">
            <path d="M0 14 Q 12 6, 24 14 T 48 14" stroke="var(--lake-blue)" strokeWidth="2.5" fill="none" />
            <path d="M0 20 Q 12 12, 24 20 T 48 20" stroke="var(--lake-blue)" strokeWidth="2" fill="none" opacity="0.6" />
          </svg>
        </div>

        {/* KPI 2: Fertilizer Money Saved */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--fine-border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#EDF7EE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sprout size={18} color="var(--status-positive)" />
            </div>
            <div>
              <div style={{ fontSize: '0.70rem', color: 'var(--secondary-text)', fontWeight: 500 }}>
                Fertilizer Money Saved
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-forest)', margin: '1px 0' }}>
                ₹{fertilizerSavingsLakhs} Lakhs
              </div>
              <div style={{ fontSize: '0.66rem', color: 'var(--secondary-text)' }}>
                DAP &amp; Urea displaced
              </div>
            </div>
          </div>
          {/* Subtle Bar Graphic */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', opacity: 0.35, height: '22px' }}>
            <div style={{ width: '4px', height: '8px', backgroundColor: 'var(--status-positive)', borderRadius: '1px' }} />
            <div style={{ width: '4px', height: '14px', backgroundColor: 'var(--status-positive)', borderRadius: '1px' }} />
            <div style={{ width: '4px', height: '20px', backgroundColor: 'var(--status-positive)', borderRadius: '1px' }} />
            <div style={{ width: '4px', height: '26px', backgroundColor: 'var(--status-positive)', borderRadius: '1px' }} />
          </div>
        </div>

        {/* KPI 3: Organic Carbon Gain */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--fine-border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#FEF5EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Leaf size={18} color="var(--antique-gold)" />
            </div>
            <div>
              <div style={{ fontSize: '0.70rem', color: 'var(--secondary-text)', fontWeight: 500 }}>
                Organic Carbon Gain
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#A67926', margin: '1px 0' }}>
                {organicCarbonGainKg.toLocaleString()} kg
              </div>
              <div style={{ fontSize: '0.66rem', color: 'var(--secondary-text)' }}>
                Natural soil biology
              </div>
            </div>
          </div>
          {/* Subtle Organic Curve */}
          <svg width="44" height="26" viewBox="0 0 44 26" fill="none" opacity="0.35">
            <path d="M4 22 C 14 18, 22 8, 40 4 C 36 14, 26 22, 4 22 Z" fill="#D8B56D" />
          </svg>
        </div>

        {/* KPI 4: Municipal Subsidy Redirect */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--fine-border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#F5EEFB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={18} color="#7C3AED" />
            </div>
            <div>
              <div style={{ fontSize: '0.70rem', color: 'var(--secondary-text)', fontWeight: 500 }}>
                Municipal Subsidy Redirect
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#6D28D9', margin: '1px 0' }}>
                ₹{municipalSubsidyLakhs} Lakhs
              </div>
              <div style={{ fontSize: '0.66rem', color: 'var(--secondary-text)' }}>
                From ₹14.8Cr dredging fund
              </div>
            </div>
          </div>
          {/* Subtle Civic Building Silhouette */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', opacity: 0.25, height: '24px' }}>
            <div style={{ width: '6px', height: '14px', backgroundColor: '#7C3AED' }} />
            <div style={{ width: '8px', height: '22px', backgroundColor: '#7C3AED' }} />
            <div style={{ width: '6px', height: '18px', backgroundColor: '#7C3AED' }} />
          </div>
        </div>
      </div>

      {/* =========================================================================
          5. MAIN TWO-COLUMN SELECTION LAYOUT
          ========================================================================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '18px',
          marginBottom: '22px',
        }}
      >
        {/* LEFT COLUMN: 1. Silt Sources (Lake Dredging Sites) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--fine-border)',
            borderRadius: 'var(--radius-md)',
            padding: '18px 20px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '5px',
                  backgroundColor: '#EBF5FA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Droplets size={14} color="var(--lake-blue)" />
              </div>
              <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--primary-text)', margin: 0 }}>
                1. Silt Sources (Lake Dredging Sites)
              </h3>
            </div>
            <span style={{ fontSize: '0.70rem', color: 'var(--lake-blue)', fontWeight: 600 }}>
              Select Dredging Zone
            </span>
          </div>

          {/* Silt Sources Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {SILT_EXTRACTION_ZONES.map((zone) => {
              const isSelected = selectedZone.id === zone.id;
              const thumb = zoneThumbnails[zone.id] || '/images/lake_pichola_watershed.jpg';

              return (
                <div
                  key={zone.id}
                  onClick={() => handleZoneSelect(zone)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: isSelected ? '1.5px solid var(--primary-forest)' : '1px solid var(--fine-border)',
                    backgroundColor: isSelected ? '#F4F8F5' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {/* Photo Thumbnail */}
                  <div
                    style={{
                      width: '58px',
                      height: '46px',
                      borderRadius: '4px',
                      backgroundImage: `url('${thumb}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      flexShrink: 0,
                      border: '1px solid rgba(0,0,0,0.08)',
                    }}
                  />

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.80rem', fontWeight: 700, color: 'var(--primary-text)' }}>
                          {zone.name}
                        </span>
                      </div>

                      {/* Status Tag */}
                      <span
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '9999px',
                          backgroundColor: zone.status === 'ACTIVE_DREDGING' ? '#EDF7EE' : '#FEF5EB',
                          color: zone.status === 'ACTIVE_DREDGING' ? 'var(--status-positive)' : 'var(--status-warning)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'currentColor' }} />
                        {zone.status === 'ACTIVE_DREDGING' ? 'ACTIVE DREDGING' : 'SCHEDULED'}
                      </span>
                    </div>

                    {/* Hindi Name */}
                    <div style={{ fontSize: '0.68rem', color: '#B94A38', fontWeight: 600, marginBottom: '4px' }}>
                      {zone.hindiName}
                    </div>

                    {/* Telemetry Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.67rem', color: 'var(--secondary-text)' }}>
                      <span>📍 {zone.lakeName} ({zone.elevationMeters}m MSL)</span>
                      <span>•</span>
                      <span>Silt Depth: <strong>{zone.siltDepthMeters}m</strong></span>
                      <span>•</span>
                      <span>Est: <strong>{zone.estimatedVolumeTonnes.toLocaleString()} t</strong></span>
                    </div>

                    {/* NPK Strip */}
                    <div
                      style={{
                        fontSize: '0.64rem',
                        color: 'var(--primary-forest)',
                        backgroundColor: isSelected ? '#E7EFEA' : '#F8F6F0',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        marginTop: '4px',
                        width: 'fit-content',
                      }}
                    >
                      NPK Profile: N: {zone.soilComposition.nitrogenKgPerTon}kg/t • P: {zone.soilComposition.phosphorusKgPerTon}kg/t • K: {zone.soilComposition.potassiumKgPerTon}kg/t • OC: {zone.soilComposition.organicCarbonPercent}%
                    </div>
                  </div>

                  {/* Radio Selection Indicator */}
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: isSelected ? '5px solid var(--primary-forest)' : '2px solid #D1D5DB',
                      backgroundColor: '#FFFFFF',
                      flexShrink: 0,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: 2. Recipient Farm Clusters */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--fine-border)',
            borderRadius: 'var(--radius-md)',
            padding: '18px 20px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '5px',
                  backgroundColor: '#EDF7EE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sprout size={14} color="var(--status-positive)" />
              </div>
              <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--primary-text)', margin: 0 }}>
                2. Recipient Farm Clusters
              </h3>
            </div>
            <span style={{ fontSize: '0.70rem', color: 'var(--secondary-text)', fontWeight: 600 }}>
              Target Village
            </span>
          </div>

          {/* Farm Clusters Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {FARM_RECIPIENT_CLUSTERS.slice(0, 3).map((cluster) => {
              const isSelected = selectedCluster.id === cluster.id;
              const thumb = clusterThumbnails[cluster.id] || '/images/smallholder_terraced_farming.jpg';

              return (
                <div
                  key={cluster.id}
                  onClick={() => setSelectedCluster(cluster)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: isSelected ? '1.5px solid var(--primary-forest)' : '1px solid var(--fine-border)',
                    backgroundColor: isSelected ? '#F4F8F5' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {/* Photo Thumbnail */}
                  <div
                    style={{
                      width: '58px',
                      height: '46px',
                      borderRadius: '4px',
                      backgroundImage: `url('${thumb}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      flexShrink: 0,
                      border: '1px solid rgba(0,0,0,0.08)',
                    }}
                  />

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1px' }}>
                      <span style={{ fontSize: '0.80rem', fontWeight: 700, color: 'var(--primary-text)' }}>
                        {cluster.clusterName}
                      </span>

                      {/* Farmer Count + Selected badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ fontSize: '0.67rem', color: 'var(--secondary-text)' }}>
                          {cluster.farmerCount} Farmers ({cluster.totalArableHa} Ha)
                        </span>
                        {isSelected && (
                          <span
                            style={{
                              fontSize: '0.60rem',
                              fontWeight: 800,
                              padding: '1px 5px',
                              borderRadius: '9999px',
                              backgroundColor: '#EDF7EE',
                              color: 'var(--status-positive)',
                            }}
                          >
                            SELECTED
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Panchayat */}
                    <div style={{ fontSize: '0.67rem', color: 'var(--secondary-text)', marginBottom: '3px' }}>
                      {cluster.panchayat}
                    </div>

                    {/* Soil Deficit Warning */}
                    <div
                      style={{
                        fontSize: '0.66rem',
                        color: 'var(--secondary-text)',
                        lineHeight: 1.3,
                        marginBottom: '4px',
                      }}
                    >
                      <span style={{ color: 'var(--status-warning)' }}>⚠️ Soil Deficit: </span>
                      {cluster.soilDeficit}
                    </div>

                    {/* Telemetry Strip */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.66rem' }}>
                      <span style={{ color: 'var(--secondary-text)' }}>Distance: <strong>{cluster.distanceFromLakeKm} km</strong></span>
                      <span style={{ color: '#B94A38', fontWeight: 700 }}>Rec. Silt: {cluster.recommendedSiltTonsPerHa} t/ha</span>
                      <span style={{ color: 'var(--status-positive)', fontWeight: 700 }}>Savings: ₹{cluster.fertilizerSavingsPerHaInr.toLocaleString()}/ha</span>
                    </div>
                  </div>

                  {/* Radio Selection Indicator */}
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: isSelected ? '5px solid var(--primary-forest)' : '2px solid #D1D5DB',
                      backgroundColor: '#FFFFFF',
                      flexShrink: 0,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================================
          6. BOTTOM PANEL: 3. SILT ALLOCATION & TRANSIT CONSOLE
          ========================================================================= */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--fine-border)',
          borderRadius: 'var(--radius-md)',
          padding: '18px 24px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Header Strip with Live Metric on Right */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '5px',
                  backgroundColor: '#FEF5EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Truck size={14} color="var(--status-warning)" />
              </div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--primary-text)', margin: 0 }}>
                3. Silt Allocation &amp; Transit Console
              </h3>
            </div>
            <div style={{ fontSize: '0.73rem', color: 'var(--secondary-text)', marginTop: '3px' }}>
              Select target dredging tonnage from <strong>{selectedZone.name}</strong> to transfer to <strong>{selectedCluster.clusterName}</strong>
            </div>
          </div>

          {/* Allocation Metric */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#C88732', lineHeight: 1 }}>
              {allocatedTonnage.toLocaleString()} Tonnes
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--secondary-text)', marginTop: '3px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
              <Truck size={12} color="#C88732" />
              <span>≈ {truckTripsCount} Standard Tipper Trips</span>
            </div>
          </div>
        </div>

        {/* Range Slider & Numeric Input Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <input
              type="range"
              min={0}
              max={selectedZone.estimatedVolumeTonnes}
              step={50}
              value={allocatedTonnage}
              onChange={(e) => handleTonnageChange(parseInt(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#C88732',
                cursor: 'pointer',
                height: '6px',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.67rem', color: 'var(--secondary-text)', marginTop: '4px' }}>
              <span>0 t</span>
              <span>{selectedZone.estimatedVolumeTonnes.toLocaleString()} t (Max)</span>
            </div>
          </div>

          {/* Numeric Input Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input
              type="number"
              min={0}
              max={selectedZone.estimatedVolumeTonnes}
              step={50}
              value={allocatedTonnage}
              onChange={(e) => handleTonnageChange(parseInt(e.target.value))}
              style={{
                width: '85px',
                padding: '6px 10px',
                fontSize: '0.86rem',
                fontWeight: 700,
                textAlign: 'center',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--fine-border)',
                backgroundColor: '#F8F6F0',
                color: 'var(--primary-text)',
                outline: 'none',
              }}
            />
            <span style={{ fontSize: '0.74rem', color: 'var(--secondary-text)' }}>tonnes</span>
          </div>
        </div>

        {/* 3 Aligned Summary Cards + Right Action Buttons Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.25fr) auto',
            gap: '14px',
            alignItems: 'center',
            paddingTop: '14px',
            borderTop: '1px solid rgba(231, 221, 203, 0.6)',
          }}
        >
          {/* Card 1: Extraction Source */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '42px',
                height: '34px',
                borderRadius: '4px',
                backgroundImage: `url('${zoneThumbnails[selectedZone.id]}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                flexShrink: 0,
                border: '1px solid rgba(0,0,0,0.08)',
              }}
            />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase' }}>
                EXTRACTION SOURCE
              </div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--primary-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {selectedZone.name}
              </div>
              <div style={{ fontSize: '0.64rem', color: 'var(--secondary-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {selectedZone.assignedLogisticsDepot}
              </div>
            </div>
          </div>

          {/* Card 2: Destination Cluster */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '42px',
                height: '34px',
                borderRadius: '4px',
                backgroundImage: `url('${clusterThumbnails[selectedCluster.id]}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                flexShrink: 0,
                border: '1px solid rgba(0,0,0,0.08)',
              }}
            />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase' }}>
                DESTINATION CLUSTER
              </div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--primary-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {selectedCluster.clusterName}
              </div>
              <div style={{ fontSize: '0.64rem', color: 'var(--secondary-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {selectedCluster.totalArableHa} Hectares Cultivated
              </div>
            </div>
          </div>

          {/* Card 3: Logistics Subsidy Coverage */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#FEF5EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Coins size={16} color="var(--antique-gold)" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--secondary-text)', textTransform: 'uppercase' }}>
                LOGISTICS SUBSIDY COVERAGE
              </div>
              <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--status-positive)' }}>
                ₹{municipalSubsidyLakhs} Lakhs (100% Subsidized)
              </div>
              <div style={{ fontSize: '0.64rem', color: 'var(--secondary-text)' }}>
                Paid via Udaipur Municipal Lake Dredging Fund (Est.)
              </div>
            </div>
          </div>

          {/* Action Buttons Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* Primary Dispatch Action */}
            <button
              onClick={() => setIsConfirmModalOpen(true)}
              className="apple-pressable"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '8px 18px',
                backgroundColor: 'var(--primary-forest)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.76rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(23, 61, 45, 0.25)',
                whiteSpace: 'nowrap',
              }}
            >
              <Truck size={14} />
              <span>Review &amp; Dispatch Silt Convoy →</span>
            </button>

            {/* Secondary Agro-Analysis Action */}
            <button
              onClick={() => onAskCopilot?.(`Agro-Analysis for ${selectedZone.name} to ${selectedCluster.clusterName}`)}
              className="apple-pressable"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '6px 14px',
                backgroundColor: '#F8F6F0',
                color: 'var(--primary-text)',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.72rem',
                fontWeight: 600,
                border: '1px solid var(--fine-border)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <Sparkles size={12} color="var(--antique-gold)" />
              <span>Ask Copilot for Agro-Analysis</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          7. DISPATCH CONFIRMATION MODAL
          ========================================================================= */}
      {isConfirmModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(6px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '460px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--fine-border)',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.18)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '14px 18px',
                borderBottom: '1px solid var(--fine-border)',
                backgroundColor: 'var(--bg-warm-ivory)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={16} color="var(--primary-forest)" />
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-forest)' }}>
                  Confirm Silt Convoy Dispatch
                </span>
              </div>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary-text)' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {dispatchSuccess ? (
                <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <CheckCircle2 size={36} color="#15803D" style={{ margin: '0 auto 8px auto' }} />
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-forest)' }}>
                      E-Waybill &amp; Silt Dispatch Authorized!
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--secondary-text)', marginTop: '2px' }}>
                      Token: <strong style={{ color: 'var(--antique-gold)' }}>RAJ-UDR-SILT-2026-{Math.floor(1000 + Math.random() * 9000)}</strong>
                    </div>
                  </div>

                  {/* Official Manifest Summary */}
                  <div
                    style={{
                      backgroundColor: '#F9F8F5',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px 14px',
                      border: '1px solid var(--fine-border)',
                      fontSize: '0.74rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--fine-border)', paddingBottom: '4px' }}>
                      <span style={{ color: 'var(--secondary-text)' }}>Authority:</span>
                      <strong>Udaipur Municipal Corp &amp; Dept of Agriculture</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--secondary-text)' }}>Dredge Reservoir:</span>
                      <strong>{selectedZone.name} ({selectedZone.lakeName})</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--secondary-text)' }}>Recipient Farmers:</span>
                      <strong>{selectedCluster.clusterName} ({selectedCluster.farmerCount} Smallholders)</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--secondary-text)' }}>Allocated Tonnage:</span>
                      <strong style={{ color: '#B45309' }}>{allocatedTonnage.toLocaleString()} Tonnes ({truckTripsCount} Tippers)</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--secondary-text)' }}>Nutrient Enrichment:</span>
                      <strong style={{ color: '#15803D' }}>+{organicCarbonGainKg.toLocaleString()} kg Soil Carbon</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--secondary-text)' }}>Chemical Fertilizer Avoided:</span>
                      <strong>₹{fertilizerSavingsLakhs} Lakhs</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--secondary-text)' }}>Subsidy Disbursed:</span>
                      <strong style={{ color: '#15803D' }}>₹{municipalSubsidyLakhs} Lakhs (100% Lake Fund)</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: '4px' }}>
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="apple-pressable"
                      style={{
                        padding: '7px 12px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--fine-border)',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        color: 'var(--primary-text)',
                      }}
                    >
                      🖨️ Print Manifest
                    </button>

                    <button
                      onClick={() => {
                        setIsConfirmModalOpen(false);
                        setDispatchSuccess(false);
                      }}
                      className="apple-pressable"
                      style={{
                        padding: '7px 16px',
                        backgroundColor: 'var(--primary-forest)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Close &amp; Keep In Silt Ledger
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: '0.76rem', color: 'var(--secondary-text)', lineHeight: 1.45 }}>
                    Please review the verified silt-to-farm allocation parameters before activating the transport fleet.
                  </div>

                  <div style={{ backgroundColor: '#F8F6F0', borderRadius: 'var(--radius-xs)', padding: '12px', border: '1px solid var(--fine-border)', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.74rem' }}>
                    <div><strong>Dredging Site:</strong> {selectedZone.name} ({selectedZone.lakeName})</div>
                    <div><strong>Destination:</strong> {selectedCluster.clusterName} ({selectedCluster.distanceFromLakeKm} km transit)</div>
                    <div><strong>Tonnage:</strong> <span style={{ color: '#C88732', fontWeight: 800 }}>{allocatedTonnage.toLocaleString()} tonnes</span> (~{truckTripsCount} trips)</div>
                    <div><strong>Municipal Subsidy:</strong> ₹{municipalSubsidyLakhs} Lakhs (100% covered via Lake Fund)</div>
                    <div><strong>Active Beneficiaries:</strong> {selectedCluster.farmerCount} smallholder farmers ({selectedCluster.totalArableHa} Ha)</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                    <button
                      onClick={() => setIsConfirmModalOpen(false)}
                      style={{
                        padding: '7px 14px',
                        backgroundColor: '#F8F6F0',
                        border: '1px solid var(--fine-border)',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleConfirmDispatch}
                      style={{
                        padding: '7px 16px',
                        backgroundColor: 'var(--primary-forest)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Truck size={13} />
                      <span>Confirm Dispatch &amp; Notify Fleet</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Why Did Silt Yield Change? (Scientific Rationale) */}
      {showStormReasonModal && activeStormScenario && (
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
                <FileText size={18} color="#FCD34D" />
                <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800 }}>
                  Hydrological Silt Detachment Rationale
                </h3>
              </div>
              <button
                onClick={() => setShowStormReasonModal(false)}
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
                1. Before vs. After Stockpile Difference
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                <div style={{ padding: '10px', backgroundColor: 'var(--surface-sandstone)', borderRadius: '4px', border: '1px solid var(--fine-border)' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--secondary-text)' }}>Calm Season Baseline:</span>
                  <div className="mono-text" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--secondary-text)' }}>
                    18,400 Tons
                  </div>
                </div>
                <div style={{ padding: '10px', backgroundColor: '#EDF7EE', borderRadius: '4px', border: '1px solid #BBF7D0' }}>
                  <span style={{ fontSize: '0.68rem', color: '#15803D' }}>With Active Storm Runoff:</span>
                  <div className="mono-text" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#15803D' }}>
                    +{(activeStormScenario.lakeSiltYieldTons).toLocaleString()} Tons Added
                  </div>
                </div>
              </div>

              <h4 style={{ margin: '0 0 6px 0', fontSize: '0.86rem', color: 'var(--primary-forest)', fontWeight: 800 }}>
                2. Physical &amp; Geospatial Equation (RUSLE)
              </h4>
              <p style={{ margin: '0 0 10px 0', color: 'var(--secondary-text)' }}>
                Soil erosion is governed by the Revised Universal Soil Loss Equation: <br />
                <code>A = R × K × LS × C × P</code>
              </p>
              <ul style={{ paddingLeft: '18px', margin: '0 0 14px 0', color: 'var(--secondary-text)', fontSize: '0.74rem' }}>
                <li><strong>R (Rainfall Erosivity Factor):</strong> Surges with precipitation intensity ({activeStormScenario.intensityMmH} mm/hr), imparting high kinetic energy that dislodges phyllite clay particles.</li>
                <li><strong>LS (Topographic Slope Length/Steepness):</strong> Steeps averaging 36.4% on Bansdara ridge crest create accelerated sheetwash velocities.</li>
                <li><strong>Delivery Ratio:</strong> ~45% of detached sediment traverses Bujhra nalla into the Sisarma inlet delta where it settles as fine organic silt.</li>
              </ul>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--fine-border)' }}>
                <button
                  onClick={() => setShowStormReasonModal(false)}
                  style={{ padding: '7px 14px', borderRadius: '4px', border: '1px solid var(--fine-border)', backgroundColor: '#FFFFFF', cursor: 'pointer', fontSize: '0.74rem' }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowStormReasonModal(false);
                    onNavigateToModule?.('simulation');
                  }}
                  className="apple-pressable"
                  style={{ padding: '7px 16px', borderRadius: '4px', backgroundColor: 'var(--deep-green)', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontSize: '0.74rem', fontWeight: 700 }}
                >
                  Modify Storm in Simulator ➔
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
