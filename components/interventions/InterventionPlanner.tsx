'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { DEFAULT_INTERVENTIONS, RISK_ZONES } from '@/lib/geo-data';
import { runHydrologicalSimulation } from '@/lib/simulation-engine';
import { ActiveStormScenario, Intervention, SimulationParams, SimulationResult } from '@/lib/types';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle,
  Coins,
  Compass,
  DollarSign,
  Download,
  Droplets,
  ExternalLink,
  FileCheck2,
  FileText,
  Home,
  Info,
  Layers,
  MapPin,
  Maximize2,
  Minimize2,
  Percent,
  Play,
  Plus,
  RotateCcw,
  Scale,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sprout,
  TrendingDown,
  TrendingUp,
  Truck,
  Users,
  Waves,
  X,
} from 'lucide-react';
import { GovernmentDprModal } from './GovernmentDprModal';

interface InterventionPlannerProps {
  activeInterventions: Intervention[];
  onToggleIntervention: (intervention: Intervention) => void;
  onRunSimulation?: (interventions: Intervention[]) => void;
  onFlyToLocation?: (coords: { latitude: number; longitude: number; height?: number }) => void;
  onDispatchToField?: (intervention: Intervention) => void;
  onOpenMap?: () => void;
  onNavigateToModule?: (view: string) => void;
  activeStormScenario?: ActiveStormScenario | null;
}

export const InterventionPlanner: React.FC<InterventionPlannerProps> = ({
  activeInterventions,
  onToggleIntervention,
  onRunSimulation,
  onFlyToLocation,
  onDispatchToField,
  onOpenMap,
  onNavigateToModule,
  activeStormScenario,
}) => {
  const [availableList, setAvailableList] = useState<Intervention[]>(DEFAULT_INTERVENTIONS);
  const [activeStrategyPlan, setActiveStrategyPlan] = useState<'PLAN_A' | 'PLAN_B' | 'PLAN_C'>('PLAN_C');
  const [isDprModalOpen, setIsDprModalOpen] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'CHECK_DAM' | 'CONTOUR_BUND' | 'RESTORATION_ZONE'>('ALL');
  const [selectedDossierItem, setSelectedDossierItem] = useState<Intervention | null>(null);
  const [showDprReasonModal, setShowDprReasonModal] = useState<boolean>(false);

  // Custom Intervention Proposer Form State
  const [isProposerOpen, setIsProposerOpen] = useState(false);
  const [newType, setNewType] = useState<Intervention['type']>('CHECK_DAM');
  const [newName, setNewName] = useState('Sisarma Gorge Masonry Weir (CD-03)');
  const [newDesc, setNewDesc] = useState('Cascading boulder check dam with stone masonry apron to arrest gravel bedload.');
  const [newCost, setNewCost] = useState('₹4,20,000');
  const [newRunoffRed, setNewRunoffRed] = useState(32);
  const [newErosionRed, setNewErosionRed] = useState(48);
  const [newRetInc, setNewRetInc] = useState(28);
  const [targetHotspotId, setTargetHotspotId] = useState('RZ-01');

  // Multi-Plan Presets
  const planAInterventions: Intervention[] = []; // Zero interventions (Baseline)
  const planBInterventions: Intervention[] = availableList.filter(
    (i) => i.type === 'RESTORATION_ZONE' || i.type === 'VEGETATION_CORRIDOR'
  ); // Vegetative restoration only
  const planCInterventions: Intervention[] = availableList; // Full integrated bio-structural suite

  // Run Hydrologic Simulations for each plan under standard 150mm monsoon downpour
  const baseSimParams: SimulationParams = {
    rainfallMm: 150,
    durationHours: 3,
    activeInterventions: [],
    soilSaturationInitial: 45,
  };

  const simResultPlanA = runHydrologicalSimulation(baseSimParams);
  const simResultPlanB = runHydrologicalSimulation({
    ...baseSimParams,
    activeInterventions: planBInterventions,
  });
  const simResultPlanC = runHydrologicalSimulation({
    ...baseSimParams,
    activeInterventions: planCInterventions,
  });

  const currentPlanResult =
    activeStrategyPlan === 'PLAN_A'
      ? simResultPlanA
      : activeStrategyPlan === 'PLAN_B'
      ? simResultPlanB
      : simResultPlanC;

  const currentPlanInterventions =
    activeStrategyPlan === 'PLAN_A'
      ? planAInterventions
      : activeStrategyPlan === 'PLAN_B'
      ? planBInterventions
      : planCInterventions;

  const handleApplyStrategy = (plan: 'PLAN_A' | 'PLAN_B' | 'PLAN_C') => {
    setActiveStrategyPlan(plan);
    const targetSet = plan === 'PLAN_A' ? [] : plan === 'PLAN_B' ? planBInterventions : planCInterventions;
    onRunSimulation?.(targetSet);
  };

  const handleCreateCustomIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSpot = RISK_ZONES.find((r) => r.id === targetHotspotId) || RISK_ZONES[0];
    const created: Intervention = {
      id: `CUSTOM-${Date.now().toString().slice(-4)}`,
      type: newType,
      name: newName,
      latitude: selectedSpot.latitude,
      longitude: selectedSpot.longitude,
      description: newDesc,
      status: 'PROPOSED',
      estimatedCostInr: newCost,
      runoffReductionPercent: newRunoffRed,
      erosionMitigationPercent: newErosionRed,
      retentionIncreasePercent: newRetInc,
    };

    setAvailableList((prev) => [created, ...prev]);
    onToggleIntervention(created);
    setIsProposerOpen(false);
  };

  const filteredInterventions = availableList.filter(item => {
    if (selectedFilter === 'ALL') return true;
    return item.type === selectedFilter;
  });

  return (
    <div
      style={{
        padding: '16px 28px 40px 28px',
        backgroundColor: 'var(--bg-warm-ivory)',
        minHeight: '100%',
        color: 'var(--primary-text)',
      }}
    >
      {/* 1. Action Lab Sub-Navigation Bar */}
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

        {/* Module 1: Silt Loop */}
        <button
          onClick={() => onNavigateToModule?.('silt-loop')}
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
          <Truck size={13} color="var(--primary-forest)" />
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
          <Droplets size={13} color="var(--water-blue)" />
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

        {/* Module 4: Civil DPR (Active) */}
        <button
          onClick={() => onNavigateToModule?.('interventions')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            backgroundColor: 'var(--deep-green)',
            color: '#FFFFFF',
            borderRadius: '9999px',
            fontSize: '0.74rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <ShieldCheck size={13} color="#FCD34D" />
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
              <ShieldCheck size={18} color="#FCD34D" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.64rem', padding: '1px 6px', borderRadius: '3px', backgroundColor: '#FEF3C7', color: 'var(--status-warning)', fontWeight: 800 }}>
                  ACTIVE CLIMATE HYDRAULIC STRESS
                </span>
                <span className="mono-text" style={{ fontSize: '0.72rem', color: 'var(--secondary-text)' }}>
                  {activeStormScenario.rainfallMm}mm • {activeStormScenario.intensityMmH} mm/hr Storm Event
                </span>
              </div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-forest)', marginTop: '2px' }}>
                Check Dam CD-04 (Sisarma) Surcharge: {activeStormScenario.checkDamStressPct}% Capacity • Catchment Peak Inflow Qp: {activeStormScenario.peakDischargeCms} m³/s
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setShowDprReasonModal(true)}
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
              <span>Why did this change? (Rational Method Rationale)</span>
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

      {/* 2. Breadcrumb Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--secondary-text)' }}>
          <Home size={14} color="var(--primary-forest)" style={{ cursor: 'pointer' }} />
          <span>/</span>
          <span style={{ color: 'var(--secondary-text)' }}>Action Lab (Solutions)</span>
          <span>/</span>
          <span
            style={{
              color: 'var(--primary-forest)',
              fontWeight: 700,
              backgroundColor: 'var(--surface-sandstone)',
              padding: '3px 10px',
              borderRadius: '6px',
              border: '1px solid var(--fine-border)',
            }}
          >
            Civil DPR & Check Dams
          </span>
        </div>

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
          <span>Open 3D Map</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* 3. Hero Banner */}
      <div
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--fine-border)',
          boxShadow: 'var(--shadow-card)',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('/images/aravalli_ridge_conservation.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 45%',
            filter: 'brightness(0.75)',
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(16, 45, 35, 0.94) 0%, rgba(23, 61, 45, 0.90) 55%, rgba(23, 61, 45, 0.70) 100%)',
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            padding: '24px 28px 20px 28px',
            color: '#FAF8F2',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
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
                }}
              >
                ✦ विस्तृत परियोजना रिपोर्ट (DPR) एवं संरचना नियोजन · CIVIL DPR & ENGINEERING SUITE
              </span>
              <span style={{ fontSize: '0.72rem', color: '#D8B56D', fontWeight: 500 }}>
                Aravalli Ridge-to-Lake Civil Defence
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setIsDprModalOpen(true)}
                className="apple-pressable"
                style={{
                  padding: '6px 14px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  backgroundColor: '#D97706',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 5px rgba(217, 119, 6, 0.3)',
                }}
              >
                <FileText size={14} />
                <span>1-Click Government DPR Export</span>
              </button>

              <button
                onClick={() => setIsProposerOpen(true)}
                className="apple-pressable"
                style={{
                  padding: '6px 14px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  backgroundColor: '#FFFFFF',
                  color: 'var(--primary-forest)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--antique-gold)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Plus size={14} />
                <span>+ Propose Intervention</span>
              </button>
            </div>
          </div>

          <h2
            className="royal-title notranslate"
            style={{
              fontSize: '1.60rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              margin: '0 0 6px 0',
              color: '#FFFFFF',
              lineHeight: 1.2,
            }}
          >
            CIVIL DPR & WATERSHED INTERVENTION PLANNER
          </h2>

          <p
            style={{
              fontSize: '0.80rem',
              color: '#E2E8F0',
              lineHeight: 1.5,
              margin: '0 0 20px 0',
              maxWidth: '820px',
              fontWeight: 400,
            }}
          >
            Engineering-grade hydrological design suite for Aravalli catchment stabilization. Simulates and generates government-ready Detailed Project Reports (DPR) for masonry check dams, contour bunds, gabions, and continuous trenches under standard 150mm monsoon downpours.
          </p>

          {/* 4 KPI Metric Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
            }}
          >
            {/* Card 1 */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                border: '1px solid var(--fine-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: '#EDF7EE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#15803D',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={18} />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803D', lineHeight: 1.1 }}>
                  128 Structures
                </div>
                <div style={{ fontSize: '0.70rem', fontWeight: 600, color: 'var(--primary-text)' }}>
                  Total Intervention Target
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--secondary-text)' }}>
                  Across 7 micro-watersheds
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                border: '1px solid var(--fine-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: '#FEF3C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#B45309',
                  flexShrink: 0,
                }}
              >
                <TrendingDown size={18} />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#B45309', lineHeight: 1.1 }}>
                  -48.2% Silt Detachment
                </div>
                <div style={{ fontSize: '0.70rem', fontWeight: 600, color: 'var(--primary-text)' }}>
                  Soil Loss Mitigation
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--secondary-text)' }}>
                  Under Plan C full deployment
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                border: '1px solid var(--fine-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: '#EBF5FB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--water-blue)',
                  flexShrink: 0,
                }}
              >
                <Coins size={18} />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-forest)', lineHeight: 1.1 }}>
                  ₹2.14 Crores
                </div>
                <div style={{ fontSize: '0.70rem', fontWeight: 600, color: 'var(--primary-text)' }}>
                  Total Civil Budget
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--secondary-text)' }}>
                  Rajasthan PWD & BSR rates
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                border: '1px solid var(--fine-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: '#F3E8FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#7C3AED',
                  flexShrink: 0,
                }}
              >
                <Scale size={18} />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-forest)', lineHeight: 1.1 }}>
                  3.8 Years
                </div>
                <div style={{ fontSize: '0.70rem', fontWeight: 600, color: 'var(--primary-text)' }}>
                  Economic Payback
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--secondary-text)' }}>
                  Via dredging cost avoidance
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Strategy Plan Battle (Plan A vs Plan B vs Plan C) */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--fine-border)',
          padding: '18px 22px',
          boxShadow: 'var(--shadow-card)',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '0.94rem', fontWeight: 800, margin: 0, color: 'var(--primary-forest)' }}>
              संरक्षण रणनीति तुलना (Multi-Plan Scenario Engine)
            </h3>
            <p style={{ fontSize: '0.70rem', color: 'var(--secondary-text)', margin: '2px 0 0 0' }}>
              Simulated under 150mm / 3h Monsoon Downpour (Copernicus 30m Terrain Model)
            </p>
          </div>

          {/* Strategy Plan Switch Buttons */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => handleApplyStrategy('PLAN_A')}
              className="apple-pressable"
              style={{
                padding: '6px 12px',
                fontSize: '0.72rem',
                fontWeight: activeStrategyPlan === 'PLAN_A' ? 700 : 500,
                borderRadius: 'var(--radius-sm)',
                backgroundColor: activeStrategyPlan === 'PLAN_A' ? '#FEE2E2' : '#FAFAFA',
                color: activeStrategyPlan === 'PLAN_A' ? '#991B1B' : 'var(--primary-text)',
                border: activeStrategyPlan === 'PLAN_A' ? '1px solid #FCA5A5' : '1px solid var(--fine-border)',
                cursor: 'pointer',
              }}
            >
              Plan A: Baseline (0 Interventions)
            </button>

            <button
              onClick={() => handleApplyStrategy('PLAN_B')}
              className="apple-pressable"
              style={{
                padding: '6px 12px',
                fontSize: '0.72rem',
                fontWeight: activeStrategyPlan === 'PLAN_B' ? 700 : 500,
                borderRadius: 'var(--radius-sm)',
                backgroundColor: activeStrategyPlan === 'PLAN_B' ? '#FEF3C7' : '#FAFAFA',
                color: activeStrategyPlan === 'PLAN_B' ? '#92400E' : 'var(--primary-text)',
                border: activeStrategyPlan === 'PLAN_B' ? '1px solid #FDE68A' : '1px solid var(--fine-border)',
                cursor: 'pointer',
              }}
            >
              Plan B: Vegetative Buffers Only
            </button>

            <button
              onClick={() => handleApplyStrategy('PLAN_C')}
              className="apple-pressable"
              style={{
                padding: '6px 12px',
                fontSize: '0.72rem',
                fontWeight: activeStrategyPlan === 'PLAN_C' ? 700 : 500,
                borderRadius: 'var(--radius-sm)',
                backgroundColor: activeStrategyPlan === 'PLAN_C' ? 'var(--deep-green)' : '#FAFAFA',
                color: activeStrategyPlan === 'PLAN_C' ? '#FFFFFF' : 'var(--primary-text)',
                border: activeStrategyPlan === 'PLAN_C' ? '1px solid var(--deep-green)' : '1px solid var(--fine-border)',
                cursor: 'pointer',
              }}
            >
              Plan C: Integrated Bio-Structural Suite
            </button>
          </div>
        </div>

        {/* Live Hydrologic Comparison Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          <div style={{ backgroundColor: '#FAFAFA', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--fine-border)' }}>
            <span style={{ fontSize: '0.66rem', color: 'var(--secondary-text)' }}>Active Structures:</span>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-text)' }}>
              {currentPlanInterventions.length} Units
            </div>
            <div style={{ fontSize: '0.60rem', color: 'var(--secondary-text)' }}>
              {activeStrategyPlan === 'PLAN_A' ? 'No defense' : activeStrategyPlan === 'PLAN_B' ? 'Green buffer' : 'Full defense'}
            </div>
          </div>

          <div style={{ backgroundColor: '#FAFAFA', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--fine-border)' }}>
            <span style={{ fontSize: '0.66rem', color: 'var(--secondary-text)' }}>Peak Inflow Discharge:</span>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--water-blue)' }}>
              {currentPlanResult.peakDischargeCms.toFixed(1)} m³/s
            </div>
            <div style={{ fontSize: '0.60rem', color: 'var(--secondary-text)' }}>
              Down from {simResultPlanA.peakDischargeCms.toFixed(1)} m³/s baseline
            </div>
          </div>

          <div style={{ backgroundColor: '#FAFAFA', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--fine-border)' }}>
            <span style={{ fontSize: '0.66rem', color: 'var(--secondary-text)' }}>Runoff Reduction:</span>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#15803D' }}>
              {(currentPlanResult.baselineVsMitigated?.runoffReduction ?? 0).toFixed(1)} %
            </div>
            <div style={{ fontSize: '0.60rem', color: 'var(--secondary-text)' }}>
              {currentPlanResult.waterRetentionGainPercent.toFixed(1)}% retention increase
            </div>
          </div>

          <div style={{ backgroundColor: '#FAFAFA', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--fine-border)' }}>
            <span style={{ fontSize: '0.66rem', color: 'var(--secondary-text)' }}>Sediment Trapped:</span>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#B45309' }}>
              {Math.round(currentPlanResult.ridgeToLakeCascade?.lowerLakes.siltDivertedFromLakesTons ?? (currentPlanResult.erosionVolumeTons * 0.48)).toLocaleString()} Tonnes
            </div>
            <div style={{ fontSize: '0.60rem', color: 'var(--secondary-text)' }}>
              Avoided lake siltation
            </div>
          </div>
        </div>
      </div>

      {/* 5. Intervention Inventory List */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--fine-border)',
          padding: '18px 22px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} color="var(--primary-forest)" />
            <h3 style={{ fontSize: '0.94rem', fontWeight: 800, margin: 0, color: 'var(--primary-forest)' }}>
              Intervention Catalogue & Engineering Assets
            </h3>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['ALL', 'CHECK_DAM', 'CONTOUR_BUND', 'RESTORATION_ZONE'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                style={{
                  padding: '4px 10px',
                  fontSize: '0.68rem',
                  fontWeight: selectedFilter === cat ? 700 : 500,
                  borderRadius: '4px',
                  border: selectedFilter === cat ? '1px solid var(--deep-green)' : '1px solid var(--fine-border)',
                  backgroundColor: selectedFilter === cat ? 'var(--deep-green)' : '#FFFFFF',
                  color: selectedFilter === cat ? '#FFFFFF' : 'var(--primary-text)',
                  cursor: 'pointer',
                }}
              >
                {cat === 'ALL' ? 'All Assets' : cat.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredInterventions.map((item) => {
            const isActive = activeInterventions.some(i => i.id === item.id);
            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: isActive ? '1.5px solid var(--deep-green)' : '1px solid var(--fine-border)',
                  backgroundColor: isActive ? '#F0FDF4' : '#FAFAFA',
                  transition: 'all 0.15s ease',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '3px',
                        backgroundColor: item.type === 'CHECK_DAM' ? '#FEF3C7' : '#EDF7EE',
                        color: item.type === 'CHECK_DAM' ? '#B45309' : '#15803D',
                        border: `1px solid ${item.type === 'CHECK_DAM' ? '#FDE68A' : '#BBF7D0'}`,
                      }}
                    >
                      {item.type.replace('_', ' ')}
                    </span>
                    <strong style={{ fontSize: '0.86rem', color: 'var(--primary-text)' }}>
                      {item.name}
                    </strong>
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--secondary-text)', margin: '3px 0 0 0' }}>
                    {item.description} • Est. Cost: <strong>{item.estimatedCostInr}</strong>
                  </p>
                </div>

                {/* Efficiency Pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.70rem' }}>
                  <span style={{ color: '#15803D', fontWeight: 600 }}>
                    -{item.runoffReductionPercent}% Runoff
                  </span>
                  <span style={{ color: '#B45309', fontWeight: 600 }}>
                    -{item.erosionMitigationPercent}% Erosion
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => setSelectedDossierItem(item)}
                    className="apple-pressable"
                    style={{
                      padding: '5px 10px',
                      fontSize: '0.70rem',
                      fontWeight: 600,
                      borderRadius: '4px',
                      border: '1px solid var(--fine-border)',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--primary-forest)',
                    }}
                  >
                    <FileText size={12} color="var(--primary-forest)" />
                    <span>Civil Specs</span>
                  </button>

                  <button
                    onClick={() => onToggleIntervention(item)}
                    className="apple-pressable"
                    style={{
                      padding: '5px 12px',
                      fontSize: '0.70rem',
                      fontWeight: 700,
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: isActive ? 'var(--deep-green)' : '#E2E8F0',
                      color: isActive ? '#FFFFFF' : 'var(--primary-text)',
                      cursor: 'pointer',
                    }}
                  >
                    {isActive ? '✓ Commissioned' : '+ Include in Plan'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Propose Custom Intervention Modal */}
      {isProposerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(16, 45, 35, 0.70)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              width: '100%',
              maxWidth: '520px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              border: '1px solid var(--fine-border)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--surface-sandstone)',
                padding: '14px 18px',
                borderBottom: '1px solid var(--fine-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <strong style={{ fontSize: '0.94rem', color: 'var(--primary-forest)' }}>
                + Propose New Civil Intervention
              </strong>
              <button
                onClick={() => setIsProposerOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateCustomIntervention} style={{ padding: '18px' }}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
                  Structure Type:
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  style={{ width: '100%', padding: '7px', fontSize: '0.76rem', borderRadius: '4px', border: '1px solid var(--fine-border)' }}
                >
                  <option value="CHECK_DAM">Masonry Check Dam (CD)</option>
                  <option value="CONTOUR_BUND">Contour Stone Bund (CB)</option>
                  <option value="RESTORATION_ZONE">Vegetative Bio-Shield / Afforestation</option>
                  <option value="VEGETATION_CORRIDOR">Gully Riparian Corridor</option>
                </select>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
                  Structure Name:
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{ width: '100%', padding: '7px', fontSize: '0.76rem', borderRadius: '4px', border: '1px solid var(--fine-border)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
                    Estimated Budget:
                  </label>
                  <input
                    type="text"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    style={{ width: '100%', padding: '7px', fontSize: '0.76rem', borderRadius: '4px', border: '1px solid var(--fine-border)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
                    Erosion Mitigation %:
                  </label>
                  <input
                    type="number"
                    value={newErosionRed}
                    onChange={(e) => setNewErosionRed(Number(e.target.value))}
                    style={{ width: '100%', padding: '7px', fontSize: '0.76rem', borderRadius: '4px', border: '1px solid var(--fine-border)' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
                  Engineering Description:
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  style={{ width: '100%', padding: '7px', fontSize: '0.76rem', borderRadius: '4px', border: '1px solid var(--fine-border)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsProposerOpen(false)}
                  style={{ padding: '7px 14px', fontSize: '0.74rem', borderRadius: '4px', border: '1px solid var(--fine-border)', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="apple-pressable"
                  style={{ padding: '7px 18px', fontSize: '0.74rem', fontWeight: 700, borderRadius: '4px', backgroundColor: 'var(--deep-green)', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
                >
                  Save & Include in DPR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Civil & Hydrological Specification Dossier Modal */}
      {selectedDossierItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(5px)',
            zIndex: 110,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              width: '540px',
              maxWidth: '95vw',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--fine-border)',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.16)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--fine-border)',
                backgroundColor: 'var(--bg-warm-ivory)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="var(--primary-forest)" />
                <span style={{ fontSize: '0.90rem', fontWeight: 800, color: 'var(--primary-forest)' }}>
                  Civil Engineering &amp; Hydrological Dossier
                </span>
              </div>
              <button
                onClick={() => setSelectedDossierItem(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary-text)', fontSize: '1rem', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.76rem' }}>
              <div>
                <span style={{ fontSize: '0.64rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#FEF3C7', color: '#B45309' }}>
                  {selectedDossierItem.type.replace('_', ' ')} • {selectedDossierItem.status}
                </span>
                <h4 style={{ fontSize: '1.05rem', margin: '4px 0 2px 0', color: 'var(--primary-forest)', fontWeight: 800 }}>
                  {selectedDossierItem.name}
                </h4>
                <p style={{ color: 'var(--secondary-text)', margin: 0, fontSize: '0.72rem' }}>
                  {selectedDossierItem.description}
                </p>
              </div>

              {/* Civil Specifications Matrix */}
              <div
                style={{
                  backgroundColor: '#F9F8F5',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  border: '1px solid var(--fine-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--secondary-text)' }}>Structural Code:</span>
                  <strong>{selectedDossierItem.id}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--secondary-text)' }}>Estimated Civil Cost:</span>
                  <strong style={{ color: '#B45309' }}>{selectedDossierItem.estimatedCostInr}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--secondary-text)' }}>Peak Runoff Damping:</span>
                  <strong style={{ color: '#15803D' }}>-{selectedDossierItem.runoffReductionPercent}% Runoff Attenuation</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--secondary-text)' }}>Sediment Bedload Arrest:</span>
                  <strong style={{ color: '#15803D' }}>-{selectedDossierItem.erosionMitigationPercent}% Silt Arrest</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--secondary-text)' }}>Groundwater Recharge Gain:</span>
                  <strong style={{ color: 'var(--water-blue)' }}>+{selectedDossierItem.retentionIncreasePercent}% Infiltration Increase</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--secondary-text)' }}>Standards Compliance:</span>
                  <strong>Rajasthan Water Resources BSR 2024 / JJM</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                <button
                  onClick={() => {
                    onToggleIntervention(selectedDossierItem);
                    setSelectedDossierItem(null);
                  }}
                  className="apple-pressable"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: activeInterventions.some(i => i.id === selectedDossierItem.id) ? '#EF4444' : 'var(--deep-green)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {activeInterventions.some(i => i.id === selectedDossierItem.id) ? 'Remove From Plan' : 'Add To Watershed Plan'}
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      setSelectedDossierItem(null);
                      setIsDprModalOpen(true);
                    }}
                    className="apple-pressable"
                    style={{
                      padding: '8px 14px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--fine-border)',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: 'var(--primary-forest)',
                    }}
                  >
                    View in Government DPR
                  </button>

                  <button
                    onClick={() => setSelectedDossierItem(null)}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: '#F3F4F6',
                      border: 'none',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Government DPR Modal */}
      <GovernmentDprModal
        isOpen={isDprModalOpen}
        onClose={() => setIsDprModalOpen(false)}
        activeInterventions={currentPlanInterventions}
        simulationResult={currentPlanResult}
        activeStrategyPlan={activeStrategyPlan}
      />

      {/* Modal: Why Did Check Dam Hydraulic Stress Change? */}
      {showDprReasonModal && activeStormScenario && (
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
                <ShieldCheck size={18} color="#FCD34D" />
                <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800 }}>
                  Weir Freeboard &amp; Peak Discharge Rationale
                </h3>
              </div>
              <button
                onClick={() => setShowDprReasonModal(false)}
                style={{ background: 'none', border: 'none', color: '#FAF8F2', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '20px', fontSize: '0.78rem', color: 'var(--primary-text)', lineHeight: 1.6 }}>
              <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE68A', padding: '12px', borderRadius: '6px', marginBottom: '14px', color: '#92400E' }}>
                <strong>Active Storm Simulation:</strong> {activeStormScenario.scenarioName} ({activeStormScenario.rainfallMm}mm over {activeStormScenario.durationHours}h)
              </div>

              <h4 style={{ margin: '0 0 6px 0', fontSize: '0.86rem', color: 'var(--primary-forest)', fontWeight: 800 }}>
                1. Check Dam CD-04 (Sisarma) Hydraulic Inflow Metrics
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                <div style={{ padding: '10px', backgroundColor: 'var(--surface-sandstone)', borderRadius: '4px', border: '1px solid var(--fine-border)' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--secondary-text)' }}>Calm Season Baseline:</span>
                  <div className="mono-text" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--secondary-text)' }}>
                    30% Surcharge
                  </div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--secondary-text)' }}>Qp: ~12.4 m³/s</div>
                </div>
                <div style={{ padding: '10px', backgroundColor: '#FEF3C7', borderRadius: '4px', border: '1px solid #FDE68A' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--status-warning)' }}>Simulated Storm Stress:</span>
                  <div className="mono-text" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--status-warning)' }}>
                    {activeStormScenario.checkDamStressPct}% Surcharge
                  </div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--status-warning)' }}>Qp: {activeStormScenario.peakDischargeCms} m³/s</div>
                </div>
              </div>

              <h4 style={{ margin: '0 0 6px 0', fontSize: '0.86rem', color: 'var(--primary-forest)', fontWeight: 800 }}>
                2. Rational Method Peak Discharge Equation
              </h4>
              <p style={{ margin: '0 0 10px 0', color: 'var(--secondary-text)' }}>
                Peak inflow rate is governed by the Rational Method: <br />
                <code>Q_p = (C × I × A) / 3.6</code>
              </p>
              <ul style={{ paddingLeft: '18px', margin: '0 0 14px 0', color: 'var(--secondary-text)', fontSize: '0.74rem' }}>
                <li><strong>C (Runoff Coefficient):</strong> In steep degraded quartzite scrub (slope &gt; 25°), C reaches 0.72, generating rapid flood concentration.</li>
                <li><strong>I (Storm Intensity):</strong> At {activeStormScenario.intensityMmH} mm/hr, rainfall exceeds initial depression storage within 18 minutes.</li>
                <li><strong>Engineering Role of Cascading Plugs:</strong> Without upstream loose boulder check dams (LBCDs), high-velocity torrents scour gully beds; cascading masonry dams dissipate up to 68% of downstream kinetic head.</li>
              </ul>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--fine-border)' }}>
                <button
                  onClick={() => setShowDprReasonModal(false)}
                  style={{ padding: '7px 14px', borderRadius: '4px', border: '1px solid var(--fine-border)', backgroundColor: '#FFFFFF', cursor: 'pointer', fontSize: '0.74rem' }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowDprReasonModal(false);
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
