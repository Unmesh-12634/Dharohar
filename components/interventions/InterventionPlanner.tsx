'use client';

import React, { useState } from 'react';
import { DEFAULT_INTERVENTIONS, RISK_ZONES } from '@/lib/geo-data';
import { runHydrologicalSimulation } from '@/lib/simulation-engine';
import { Intervention, SimulationParams, SimulationResult } from '@/lib/types';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle,
  Coins,
  Compass,
  ExternalLink,
  FileText,
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
  Waves,
} from 'lucide-react';
import { GovernmentDprModal } from './GovernmentDprModal';

interface InterventionPlannerProps {
  activeInterventions: Intervention[];
  onToggleIntervention: (intervention: Intervention) => void;
  onRunSimulation?: (interventions: Intervention[]) => void;
  onFlyToLocation?: (coords: { latitude: number; longitude: number; height?: number }) => void;
  onDispatchToField?: (intervention: Intervention) => void;
}

export const InterventionPlanner: React.FC<InterventionPlannerProps> = ({
  activeInterventions,
  onToggleIntervention,
  onRunSimulation,
  onFlyToLocation,
  onDispatchToField,
}) => {
  const [availableList, setAvailableList] = useState<Intervention[]>(DEFAULT_INTERVENTIONS);
  const [activeStrategyPlan, setActiveStrategyPlan] = useState<'PLAN_A' | 'PLAN_B' | 'PLAN_C'>('PLAN_C');
  const [isDprModalOpen, setIsDprModalOpen] = useState(false);

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
  const planAInterventions: Intervention[] = []; // Zero interventions (Current Baseline)
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
    // Notify parent simulation
    onRunSimulation?.(targetSet);
  };

  const handleCreateCustomIntervention = () => {
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
            <span className="badge badge-observed">Adaptive Watershed Engineering</span>
            <span className="badge badge-simulated">Before vs After Scenario Engine</span>
            <span className="badge" style={{ backgroundColor: '#EFEBE2', color: '#555C58' }}>
              MGNREGA / PMKSY Format
            </span>
          </div>
          <h2 className="serif-title" style={{ fontSize: '1.95rem', color: 'var(--color-forest)', marginBottom: '6px' }}>
            Conservation Intervention Lab
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '820px', lineHeight: 1.55 }}>
            Propose check dams, contour bunds, and vegetative restoration corridors across the Aravalli landscape.
            Run the defensible hydrologic model to test proposed interventions against the unmitigated baseline, quantify trade-offs across plans, and inspect proposed structures in 3D before field commissioning.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsDprModalOpen(true)}
            className="btn apple-pressable"
            style={{
              padding: '9px 16px',
              fontSize: '0.82rem',
              fontWeight: 600,
              backgroundColor: 'var(--color-forest)',
              color: '#FFFFFF',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(30, 58, 43, 0.25)',
            }}
            title="Generate Official Indian Government DPR adhering to PMKSY & MGNREGA norms"
          >
            <FileText size={16} />
            1-Click Government DPR & Schemes
          </button>

          <button
            onClick={() => setIsProposerOpen(true)}
            className="btn apple-pressable"
            style={{
              padding: '9px 16px',
              fontSize: '0.82rem',
              fontWeight: 600,
              backgroundColor: 'var(--color-terracotta)',
              color: '#FFFFFF',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(189, 86, 55, 0.25)',
            }}
          >
            <Plus size={16} />
            Propose Intervention
          </button>
        </div>
      </div>

      {/* Feature 5B: Conservation Strategy Battle (Plan A vs Plan B vs Plan C) */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        padding: '22px',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--color-forest)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <Scale size={13} />
              Catchment Strategy Battle: Trade-Off Comparison
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
              Compare 3 Watershed Policies under Severe Monsoon (150mm / 3h)
            </h3>
          </div>
          <span className="badge badge-modeled">SCS-CN + RUSLE Modeled Outputs</span>
        </div>

        {/* 3 Strategy Plan Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {/* Plan A */}
          <div
            onClick={() => handleApplyStrategy('PLAN_A')}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              border: activeStrategyPlan === 'PLAN_A' ? '2px solid var(--color-terracotta)' : '1px solid var(--border-subtle)',
              backgroundColor: activeStrategyPlan === 'PLAN_A' ? 'rgba(189, 86, 55, 0.06)' : 'var(--bg-secondary)',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span className="badge badge-risk" style={{ fontSize: '0.68rem' }}>
                PLAN A: CURRENT STATUS
              </span>
              <span className="mono-text" style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                Cost: ₹0 (No Action)
              </span>
            </div>
            <h4 style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Unmitigated Catchment Baseline
            </h4>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '12px' }}>
              No check dams or soil conservation; torrential runoff cascades unchecked into agricultural terraces and Pichola lake delta.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '0.72rem' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.8)', padding: '6px', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-tertiary)' }}>Peak Flow</div>
                <div className="mono-text" style={{ fontWeight: 600, color: 'var(--color-terracotta)' }}>
                  {simResultPlanA.peakDischargeCms.toFixed(0)} m³/s
                </div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.8)', padding: '6px', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-tertiary)' }}>Soil Lost</div>
                <div className="mono-text" style={{ fontWeight: 600, color: 'var(--color-terracotta)' }}>
                  {(simResultPlanA.erosionVolumeTons / 1000).toFixed(1)}k Tons
                </div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.8)', padding: '6px', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-tertiary)' }}>Farm Flood</div>
                <div className="mono-text" style={{ fontWeight: 600, color: 'var(--color-terracotta)' }}>
                  {simResultPlanA.farmlandInundationHa.toFixed(0)} Ha
                </div>
              </div>
            </div>
          </div>

          {/* Plan B */}
          <div
            onClick={() => handleApplyStrategy('PLAN_B')}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              border: activeStrategyPlan === 'PLAN_B' ? '2px solid var(--color-forest)' : '1px solid var(--border-subtle)',
              backgroundColor: activeStrategyPlan === 'PLAN_B' ? 'var(--color-forest-bg)' : 'var(--bg-secondary)',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span className="badge badge-modeled" style={{ fontSize: '0.68rem' }}>
                PLAN B: NATURE-BASED
              </span>
              <span className="mono-text" style={{ fontSize: '0.72rem', color: 'var(--color-forest)', fontWeight: 600 }}>
                Est. ₹6.4 Lakhs
              </span>
            </div>
            <h4 style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Vegetation Restoration & Bio-Shields
            </h4>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '12px' }}>
              Agroforestry buffer strips and Vetiver grass hedges on degraded communal pasture slopes; zero heavy masonry.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '0.72rem' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.8)', padding: '6px', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-tertiary)' }}>Peak Flow</div>
                <div className="mono-text" style={{ fontWeight: 600, color: 'var(--color-forest)' }}>
                  {simResultPlanB.peakDischargeCms.toFixed(0)} m³/s (-{simResultPlanB.baselineVsMitigated.runoffReduction}%)
                </div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.8)', padding: '6px', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-tertiary)' }}>Soil Saved</div>
                <div className="mono-text" style={{ fontWeight: 600, color: 'var(--color-forest)' }}>
                  {((simResultPlanA.erosionVolumeTons - simResultPlanB.erosionVolumeTons) / 1000).toFixed(1)}k Tons
                </div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.8)', padding: '6px', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-tertiary)' }}>Recharge</div>
                <div className="mono-text" style={{ fontWeight: 600, color: 'var(--color-lake)' }}>
                  +{simResultPlanB.baselineVsMitigated.waterRetentionIncrease}%
                </div>
              </div>
            </div>
          </div>

          {/* Plan C */}
          <div
            onClick={() => handleApplyStrategy('PLAN_C')}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              border: activeStrategyPlan === 'PLAN_C' ? '2px solid var(--color-forest)' : '1px solid var(--border-subtle)',
              backgroundColor: activeStrategyPlan === 'PLAN_C' ? 'rgba(42, 102, 62, 0.12)' : 'var(--bg-secondary)',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span className="badge badge-observed" style={{ fontSize: '0.68rem' }}>
                PLAN C: INTEGRATED BIO-ENGINEERING
              </span>
              <span className="mono-text" style={{ fontSize: '0.72rem', color: 'var(--color-forest)', fontWeight: 600 }}>
                Est. ₹28.5 Lakhs
              </span>
            </div>
            <h4 style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Integrated Check Dams + Contour Bunds + Bio-Shield
            </h4>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '12px' }}>
              Ridge-to-valley comprehensive program: check dams at 2nd-order stream confluences + continuous contour trenches.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '0.72rem' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.8)', padding: '6px', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-tertiary)' }}>Peak Flow</div>
                <div className="mono-text" style={{ fontWeight: 600, color: 'var(--color-forest)' }}>
                  {simResultPlanC.peakDischargeCms.toFixed(0)} m³/s (-{simResultPlanC.baselineVsMitigated.runoffReduction}%)
                </div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.8)', padding: '6px', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-tertiary)' }}>Soil Saved</div>
                <div className="mono-text" style={{ fontWeight: 600, color: 'var(--color-forest)' }}>
                  {((simResultPlanA.erosionVolumeTons - simResultPlanC.erosionVolumeTons) / 1000).toFixed(1)}k Tons
                </div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.8)', padding: '6px', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-tertiary)' }}>Farmland Safe</div>
                <div className="mono-text" style={{ fontWeight: 600, color: 'var(--color-forest)' }}>
                  +{simResultPlanC.baselineVsMitigated.agriculturalSafetyIncrease}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROI / Benefit Callout Strip */}
        <div style={{
          padding: '12px 18px',
          backgroundColor: 'rgba(244, 241, 234, 0.85)',
          borderRadius: 'var(--radius-xs)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.80rem',
        }}>
          <div>
            <strong>Active Strategy Focus:</strong> {activeStrategyPlan === 'PLAN_A' ? 'Plan A (Zero Interventions)' : activeStrategyPlan === 'PLAN_B' ? 'Plan B (Vegetative Bio-Shields)' : 'Plan C (Integrated Masonry & Agrarian Bunds)'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span>Runoff Dampened: <strong>-{currentPlanResult.baselineVsMitigated.runoffReduction}%</strong></span>
            <span>•</span>
            <span>Soil Detachment Reduced: <strong>-{currentPlanResult.baselineVsMitigated.erosionReduction}%</strong></span>
            <span>•</span>
            <span>Aquifer Infiltration: <strong>+{currentPlanResult.baselineVsMitigated.waterRetentionIncrease}%</strong></span>
          </div>
        </div>
      </div>

      {/* Available Interventions Cards */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Individual Structural & Biological Interventions ({availableList.length})
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
              Toggle individual interventions to place or remove them from the 3D digital twin and recalculate hydrological retention.
            </p>
          </div>
          <span className="mono-text" style={{ fontSize: '0.76rem', color: 'var(--color-forest)', fontWeight: 600 }}>
            {activeInterventions.length} Deployed in 3D
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {availableList.map((item) => {
            const isDeployed = activeInterventions.some((a) => a.id === item.id);
            return (
              <div
                key={item.id}
                className="editorial-card"
                style={{
                  border: isDeployed ? '1.5px solid var(--color-forest)' : '1px solid var(--border-subtle)',
                  backgroundColor: isDeployed ? 'var(--color-forest-bg)' : 'var(--bg-card)',
                  transition: 'all 0.18s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '18px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="badge badge-modeled">
                      {item.type.replace('_', ' ')}
                    </span>
                    <span className="mono-text" style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>
                      Est. {item.estimatedCostInr}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    {item.name}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '14px' }}>
                    {item.description}
                  </p>

                  {/* Metrics Pill Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '14px', fontSize: '0.70rem' }}>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: '6px', borderRadius: '3px', textAlign: 'center' }}>
                      <div style={{ color: 'var(--text-tertiary)' }}>Runoff Arrest</div>
                      <div className="mono-text" style={{ fontWeight: 600, color: 'var(--color-forest)' }}>
                        -{item.runoffReductionPercent}%
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: '6px', borderRadius: '3px', textAlign: 'center' }}>
                      <div style={{ color: 'var(--text-tertiary)' }}>Soil Saved</div>
                      <div className="mono-text" style={{ fontWeight: 600, color: 'var(--color-terracotta)' }}>
                        +{item.erosionMitigationPercent}%
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: '6px', borderRadius: '3px', textAlign: 'center' }}>
                      <div style={{ color: 'var(--text-tertiary)' }}>Infiltration</div>
                      <div className="mono-text" style={{ fontWeight: 600, color: 'var(--color-lake)' }}>
                        +{item.retentionIncreasePercent}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                  <button
                    onClick={() => onFlyToLocation?.({ latitude: item.latitude, longitude: item.longitude, height: 1400 })}
                    className="btn btn-ghost"
                    style={{ padding: '6px 8px', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Compass size={13} />
                    Fly to 3D
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => onDispatchToField?.(item)}
                      className="btn btn-ghost"
                      style={{ padding: '6px 8px', fontSize: '0.74rem' }}
                      title="Send to Field Action Network"
                    >
                      Audit
                    </button>

                    <button
                      onClick={() => onToggleIntervention(item)}
                      className="btn apple-pressable"
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        backgroundColor: isDeployed ? 'var(--color-forest)' : 'var(--bg-secondary)',
                        color: isDeployed ? '#FFFFFF' : 'var(--text-primary)',
                        border: isDeployed ? 'none' : '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {isDeployed ? (
                        <>
                          <Check size={13} />
                          Active
                        </>
                      ) : (
                        <>
                          <Plus size={13} />
                          Deploy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Proposer Modal */}
      {isProposerOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(28, 34, 32, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-popover)',
            width: '100%',
            maxWidth: '640px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px',
          }}>
            <h3 className="serif-title" style={{ fontSize: '1.4rem', color: 'var(--color-forest)', marginBottom: '4px' }}>
              Propose New Watershed Intervention
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Define structural or biological intervention parameters. Model will simulate hydrological impact at specified coordinates.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  STRUCTURE / MEASURE TYPE:
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-primary)',
                    fontSize: '0.80rem',
                    fontFamily: 'inherit',
                  }}
                >
                  <option value="CHECK_DAM">Masonry Check Dam (Crest Height 1.2-1.8m)</option>
                  <option value="CONTOUR_BUND">Continuous Contour Trenching (CCT)</option>
                  <option value="RESTORATION_ZONE">Vegetation Restoration & Grass Seeding</option>
                  <option value="WATER_HARVESTING">Subsurface Percolation Anicut</option>
                  <option value="VEGETATION_CORRIDOR">Vetiver & Kair Agroforestry Bio-Shield</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  LOCATION / ANOMALY TARGET:
                </label>
                <select
                  value={targetHotspotId}
                  onChange={(e) => setTargetHotspotId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-primary)',
                    fontSize: '0.80rem',
                    fontFamily: 'inherit',
                  }}
                >
                  {RISK_ZONES.map((rz) => (
                    <option key={rz.id} value={rz.id}>
                      {rz.name} ({rz.latitude.toFixed(3)}°N, {rz.longitude.toFixed(3)}°E - Slope {rz.slopeDegree}°)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  INTERVENTION NAME:
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-primary)',
                    fontSize: '0.80rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  ENGINEERING DESCRIPTION:
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-primary)',
                    fontSize: '0.80rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.70rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>
                    RUNOFF REDUCTION (%):
                  </label>
                  <input
                    type="number"
                    value={newRunoffRed}
                    onChange={(e) => setNewRunoffRed(Number(e.target.value))}
                    style={{ width: '100%', padding: '6px', fontSize: '0.80rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.70rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>
                    EROSION ARREST (%):
                  </label>
                  <input
                    type="number"
                    value={newErosionRed}
                    onChange={(e) => setNewErosionRed(Number(e.target.value))}
                    style={{ width: '100%', padding: '6px', fontSize: '0.80rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.70rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>
                    EST. COST (INR):
                  </label>
                  <input
                    type="text"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    style={{ width: '100%', padding: '6px', fontSize: '0.80rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={() => setIsProposerOpen(false)}
                className="btn btn-ghost"
                style={{ padding: '8px 14px', fontSize: '0.80rem' }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCustomIntervention}
                className="btn apple-pressable"
                style={{
                  padding: '8px 18px',
                  fontSize: '0.80rem',
                  fontWeight: 600,
                  backgroundColor: 'var(--color-forest)',
                  color: '#FFFFFF',
                  border: 'none',
                }}
              >
                Add & Simulate in 3D
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Government DPR & MGNREGA Scheme Modal */}
      <GovernmentDprModal
        isOpen={isDprModalOpen}
        onClose={() => setIsDprModalOpen(false)}
        activeInterventions={currentPlanInterventions}
        simulationResult={currentPlanResult}
        activeStrategyPlan={activeStrategyPlan}
      />
    </div>
  );
};

