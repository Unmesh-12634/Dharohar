'use client';

import React, { useState } from 'react';
import { DEFAULT_INTERVENTIONS } from '@/lib/geo-data';
import { buildActiveStormScenario, runHydrologicalSimulation } from '@/lib/simulation-engine';
import { ActiveStormScenario, Intervention, SimulationParams, SimulationResult } from '@/lib/types';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  CheckCircle2,
  CloudLightning,
  CloudRain,
  Compass,
  Droplets,
  ExternalLink,
  FileText,
  Layers,
  MapPin,
  Play,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sparkles,
  Sprout,
  Truck,
  Waves,
} from 'lucide-react';

interface MonsoonSimulatorViewProps {
  onOpen3DMap: () => void;
  activeInterventions: Intervention[];
  onSimulationComplete: (result: SimulationResult, isSimulating: boolean) => void;
  lastResult: SimulationResult | null;
  activeStormScenario?: ActiveStormScenario;
  onUpdateStormScenario?: (scenario: ActiveStormScenario) => void;
  onNavigateToModule?: (module: string) => void;
}

export const MonsoonSimulatorView: React.FC<MonsoonSimulatorViewProps> = ({
  onOpen3DMap,
  activeInterventions,
  onSimulationComplete,
  lastResult,
  activeStormScenario,
  onUpdateStormScenario,
  onNavigateToModule,
}) => {
  const [rainfallMm, setRainfallMm] = useState<number>(activeStormScenario?.rainfallMm ?? 200);
  const [durationHours, setDurationHours] = useState<number>(activeStormScenario?.durationHours ?? 3);
  const [soilSaturation, setSoilSaturation] = useState<number>(activeStormScenario?.soilSaturationPct ?? 45);
  const [isProcessing, setIsProcessing] = useState(false);
  const [appliedFeedback, setAppliedFeedback] = useState<string | null>(null);

  // Compute live or use last result
  const currentParams: SimulationParams = {
    rainfallMm,
    durationHours,
    activeInterventions,
    soilSaturationInitial: soilSaturation,
  };

  const computedResult = lastResult || runHydrologicalSimulation(currentParams);
  const liveScenario = buildActiveStormScenario(currentParams, computedResult);

  const rainfallPresets = [
    { value: 50, label: '50 mm', desc: 'Light Monsoon Shower' },
    { value: 100, label: '100 mm', desc: 'Moderate Storm Event' },
    { value: 150, label: '150 mm', desc: 'Heavy Monsoon Downpour' },
    { value: 200, label: '200 mm', desc: 'Severe Convective Deluge' },
    { value: 250, label: '250 mm', desc: 'Very Severe Cloudburst' },
    { value: 350, label: '350 mm', desc: 'Catastrophic Cloudburst (1-in-100 Yr)' },
  ];

  const durationOptions = [1, 3, 6, 12, 24];

  const handleApplyScenario = () => {
    onUpdateStormScenario?.(liveScenario);
    setAppliedFeedback(`✓ "${liveScenario.scenarioName}" applied! Readings modulated across all Dharohar modules.`);
    setTimeout(() => setAppliedFeedback(null), 5000);
  };

  const handleSimulateAndFly = () => {
    setIsProcessing(true);
    onUpdateStormScenario?.(liveScenario);
    setTimeout(() => {
      const result = runHydrologicalSimulation(currentParams);
      setIsProcessing(false);
      onSimulationComplete(result, true);
    }, 500);
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '28px 24px 60px',
      color: 'var(--text-primary)',
    }}>
      {/* Editorial Header */}
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
            <span className="badge badge-simulated">
              <CloudRain size={12} style={{ marginRight: '4px' }} />
              Monsoon Hydrology Simulator
            </span>
            <span className="badge badge-modeled">SCS-CN + HydroSHEDS Routing</span>
            <span className="badge" style={{ backgroundColor: '#EFEBE2', color: '#555C58' }}>
              Udaipur Catchment (284.5 km²)
            </span>
          </div>
          <h2 className="serif-title" style={{ fontSize: '1.95rem', color: 'var(--color-forest)', marginBottom: '6px' }}>
            Monsoon Impact Simulator
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '820px', lineHeight: 1.55 }}>
            Model flash runoff generation, overland stream velocities, and topsoil detachment across the Aravalli topography.
            This is a defensible terrain-based model employing USDA SCS Curve Numbers (CN 82–92) and the Revised Universal Soil Loss Equation (RUSLE), routing excess precipitation from mountain crests through farmlands down into Lake Pichola and Fateh Sagar.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={handleApplyScenario}
              className="btn apple-pressable"
              style={{
                padding: '9px 16px',
                fontSize: '0.82rem',
                fontWeight: 700,
                backgroundColor: 'var(--deep-green)',
                color: '#FAF8F2',
                border: '1.5px solid var(--antique-gold)',
                borderRadius: 'var(--radius-xs)',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                cursor: 'pointer',
              }}
              title="Apply this storm scenario across Silt Loop, Citizen Sentry, Check Dams and Heritage Crops"
            >
              <Sparkles size={14} color="#FCD34D" />
              <span>⚡ Set as Active Twin Storm (Modulate All Pages)</span>
            </button>

            <button
              onClick={handleSimulateAndFly}
              disabled={isProcessing}
              className="btn apple-pressable"
              style={{
                padding: '9px 18px',
                fontSize: '0.82rem',
                fontWeight: 700,
                backgroundColor: 'var(--color-terracotta)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 'var(--radius-xs)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 3px 10px rgba(189, 86, 55, 0.3)',
                cursor: 'pointer',
              }}
            >
              {isProcessing ? (
                'Simulating Storm...'
              ) : (
                <>
                  <Play size={15} fill="#FFFFFF" />
                  Run Model &amp; Watch 3D Landscape
                </>
              )}
            </button>
          </div>

          <div style={{ fontSize: '0.70rem', color: 'var(--text-tertiary)', textAlign: 'right' }}>
            Active Target: <strong>{liveScenario.scenarioName}</strong> (Rainfall: {rainfallMm}mm)
          </div>
        </div>
      </div>

      {/* Applied Feedback Toast */}
      {appliedFeedback && (
        <div
          style={{
            backgroundColor: '#EDF7EE',
            border: '1px solid #BBF7D0',
            color: '#15803D',
            padding: '12px 18px',
            borderRadius: 'var(--radius-xs)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.82rem',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(21, 128, 61, 0.1)',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{appliedFeedback}</span>
        </div>
      )}

      {/* Main Simulation Workbench (2 Columns: Controls + Model Output) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '22px',
        marginBottom: '28px',
      }}>
        {/* Left Column: Precipitation & Soil Parameters */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          padding: '22px',
          boxShadow: 'var(--shadow-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              1. Precipitation Scenario
            </h3>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: 0 }}>
              Select simulated 24h monsoon rainfall depth across the catchment:
            </p>
          </div>

          {/* Rainfall Depth Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {rainfallPresets.map((opt) => {
              const isSelected = rainfallMm === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setRainfallMm(opt.value)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-xs)',
                    border: isSelected ? '1.5px solid var(--color-terracotta)' : '1px solid var(--border-subtle)',
                    backgroundColor: isSelected ? 'var(--color-terracotta-bg)' : 'var(--bg-secondary)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="mono-text" style={{ fontSize: '0.90rem', fontWeight: 700, color: isSelected ? 'var(--color-terracotta)' : 'var(--text-primary)' }}>
                      {opt.label}
                    </span>
                    {isSelected && <CheckCircle size={14} color="var(--color-terracotta)" />}
                  </div>
                  <div style={{ fontSize: '0.70rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {opt.desc}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Storm Duration */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Storm Event Duration:
              </label>
              <span className="mono-text" style={{ fontSize: '0.78rem', color: 'var(--color-forest)', fontWeight: 600 }}>
                {durationHours} Hours (Intensity: {(rainfallMm / durationHours).toFixed(1)} mm/hr)
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {durationOptions.map((h) => (
                <button
                  key={h}
                  onClick={() => setDurationHours(h)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 'var(--radius-xs)',
                    border: durationHours === h ? '1.5px solid var(--color-forest)' : '1px solid var(--border-subtle)',
                    backgroundColor: durationHours === h ? 'var(--color-forest-bg)' : 'var(--bg-secondary)',
                    color: durationHours === h ? 'var(--color-forest)' : 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>

          {/* Antecedent Soil Moisture Slider */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Antecedent Soil Moisture (AMC):
              </label>
              <span className="mono-text" style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-lake)' }}>
                {soilSaturation}% Saturation
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="95"
              step="5"
              value={soilSaturation}
              onChange={(e) => setSoilSaturation(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-lake)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              <span>Dry / Baked (AMC I)</span>
              <span>Average Moisture (AMC II)</span>
              <span>Fully Saturated (AMC III)</span>
            </div>
          </div>

          {/* Interventions in active scope */}
          <div style={{
            padding: '12px 14px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-xs)',
            borderLeft: '3px solid var(--color-forest)',
            fontSize: '0.78rem',
          }}>
            <div style={{ fontWeight: 600, color: 'var(--color-forest)', marginBottom: '2px' }}>
              ACTIVE CONSERVATION BUFFER: {activeInterventions.length} Measures
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.74rem' }}>
              {activeInterventions.length > 0
                ? activeInterventions.map((i) => i.name).join(', ')
                : 'No conservation interventions deployed. Landscape unmitigated.'}
            </div>
          </div>
        </div>

        {/* Right Column: Hydrologic Results & Quantitative Metrics */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          padding: '22px',
          boxShadow: 'var(--shadow-subtle)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <span className="badge badge-observed" style={{ fontSize: '0.68rem' }}>
                  Model Output Run
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', margin: '2px 0 0' }}>
                  Catchment Response Telemetry
                </h3>
              </div>
              <span className={`badge ${
                computedResult.runoffRiskLevel === 'Extreme'
                  ? 'badge-risk'
                  : computedResult.runoffRiskLevel === 'High'
                  ? 'badge-modeled'
                  : 'badge-live'
              }`}>
                {computedResult.runoffRiskLevel} Risk Tier
              </span>
            </div>

            {/* 4 Core Hydrological Numbers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '14px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-xs)' }}>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Gross Runoff Volume
                </div>
                <div className="mono-text" style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--color-lake)' }}>
                  {(computedResult.runoffVolumeCubicMeters / 1_000_000).toFixed(2)} <span style={{ fontSize: '0.85rem' }}>MCM</span>
                </div>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-secondary)' }}>
                  {computedResult.runoffVolumeCubicMeters.toLocaleString()} m³ total
                </div>
              </div>

              <div style={{ padding: '14px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-xs)' }}>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Peak Discharge (Qp)
                </div>
                <div className="mono-text" style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--color-terracotta)' }}>
                  {computedResult.peakDischargeCms.toFixed(1)} <span style={{ fontSize: '0.85rem' }}>m³/s</span>
                </div>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-secondary)' }}>
                  Max velocity at Sisarma nallah
                </div>
              </div>

              <div style={{ padding: '14px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-xs)' }}>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Topsoil Erosion Loss
                </div>
                <div className="mono-text" style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--color-terracotta)' }}>
                  {(computedResult.erosionVolumeTons / 1000).toFixed(1)} <span style={{ fontSize: '0.85rem' }}>k Tons</span>
                </div>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-secondary)' }}>
                  RUSLE modeled detachment
                </div>
              </div>

              <div style={{ padding: '14px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-xs)' }}>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Inundated Terraced Farmland
                </div>
                <div className="mono-text" style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--color-forest)' }}>
                  {computedResult.farmlandInundationHa.toFixed(0)} <span style={{ fontSize: '0.85rem' }}>Hectares</span>
                </div>
                <div style={{ fontSize: '0.70rem', color: 'var(--text-secondary)' }}>
                  Smallholder crop flood hazard
                </div>
              </div>
            </div>

            {/* Narrative Explanation */}
            <div style={{
              padding: '12px 14px',
              backgroundColor: 'rgba(244, 241, 234, 0.75)',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.78rem',
              color: 'var(--text-primary)',
              lineHeight: 1.5,
              marginBottom: '16px',
            }}>
              <strong>Model Assessment:</strong> {computedResult.narrativeSummary}
            </div>
          </div>

          {/* Action button to return to 3D Map */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>
              Data: SCS-CN / Survey of India DEM
            </span>
            <button
              onClick={onOpen3DMap}
              className="btn btn-ghost"
              style={{ padding: '8px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Compass size={14} />
              Inspect Runoff Vectors in 3D Map
            </button>
          </div>
        </div>
      </div>

      {/* Feature 5 Cascade: Ridge to Lake Impact Cascade Breakdown */}
      {computedResult.ridgeToLakeCascade && (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          padding: '24px 22px',
          boxShadow: 'var(--shadow-card)',
        }}>
          <h3 className="serif-title" style={{ fontSize: '1.35rem', color: 'var(--color-forest)', marginBottom: '4px' }}>
            The Ridge-to-Lake Physical Impact Cascade
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
            How water and sediment propagate from the crest of the mountain down to the historic urban lakes:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
            {/* 1. Mountain Ridge */}
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-xs)', borderLeft: '3px solid var(--color-forest)' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-forest)', textTransform: 'uppercase', marginBottom: '4px' }}>
                STAGE 1: UPPER MOUNTAIN RIDGES
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Runoff & Slope Erosion Prevention
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <li>Runoff arrested by contours: <strong>{computedResult.ridgeToLakeCascade.ridgeMountain.runoffArrestedM3.toLocaleString()} m³</strong></li>
                <li>Slope topsoil preserved: <strong>{computedResult.ridgeToLakeCascade.ridgeMountain.slopeErosionPreventedTons.toLocaleString()} Tons</strong></li>
                <li>Check dam capacity utilized: <strong>{computedResult.ridgeToLakeCascade.ridgeMountain.checkDamCapacityUtilizedPct}%</strong></li>
              </ul>
            </div>

            {/* 2. Middle Farmland */}
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-xs)', borderLeft: '3px solid #768B4C' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#768B4C', textTransform: 'uppercase', marginBottom: '4px' }}>
                STAGE 2: MIDDLE AGRARIAN VALLEYS
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Smallholder Livelihood Shield
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <li>Farmland spared from inundation: <strong>{computedResult.ridgeToLakeCascade.middleFarmland.farmlandProtectedHa} Hectares</strong></li>
                <li>NPK soil nutrient value saved: <strong>₹{computedResult.ridgeToLakeCascade.middleFarmland.nutrientLossPreventedInr.toLocaleString()}</strong></li>
                <li>Crop yield loss mitigated: <strong>{computedResult.ridgeToLakeCascade.middleFarmland.yieldLossMitigatedPct}%</strong></li>
              </ul>
            </div>

            {/* 3. Lower Lakes */}
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-xs)', borderLeft: '3px solid var(--color-lake)' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-lake)', textTransform: 'uppercase', marginBottom: '4px' }}>
                STAGE 3: LOWER LAKES & URBAN RESERVOIRS
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Reservoir Silt Diversion & Dead Storage
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <li>Silt diverted from Lake Pichola: <strong>{computedResult.ridgeToLakeCascade.lowerLakes.siltDivertedFromLakesTons.toLocaleString()} Tons</strong></li>
                <li>Municipal desiltation dredging saved: <strong>₹{computedResult.ridgeToLakeCascade.lowerLakes.municipalDredgingCostSavedInr.toLocaleString()}</strong></li>
                <li>Inter-lake Swaroop Sagar lock link: <strong>{computedResult.ridgeToLakeCascade.lowerLakes.swaroopSagarLinkSafe ? 'Safe (No Overflow)' : 'Spill Risk'}</strong></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Cross-Module Cascading Impact Hub across Dharohar */}
      <div
        style={{
          marginTop: '28px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1.5px solid var(--antique-gold)',
          padding: '24px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge" style={{ backgroundColor: 'var(--deep-green)', color: '#FAF8F2', fontWeight: 700, fontSize: '0.68rem' }}>
                LIVE TWIN IMPACT CASCADE
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--antique-gold)', fontWeight: 700 }}>
                Modulating Active Scenario: {liveScenario.scenarioName}
              </span>
            </div>
            <h3 className="serif-title" style={{ fontSize: '1.4rem', color: 'var(--color-forest)', margin: '4px 0 2px' }}>
              How This Storm Modulates Readings Across Dharohar Pages
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '840px' }}>
              Simulating this storm does not stay confined here. It triggers real hydrological shifts across our Circular Silt-to-Farm Logistics, Citizen Water Sentry, Civil DPR, and Heritage Crop Market. Click any module below to inspect the modulated readings and scientific rationale:
            </p>
          </div>

          <button
            onClick={handleApplyScenario}
            className="apple-pressable"
            style={{
              padding: '8px 16px',
              fontSize: '0.78rem',
              fontWeight: 700,
              backgroundColor: 'var(--deep-green)',
              color: '#FAF8F2',
              borderRadius: '4px',
              border: '1px solid var(--antique-gold)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={14} color="#FCD34D" />
            <span>Apply to All Pages</span>
          </button>
        </div>

        {/* 5 Impact Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
          {/* Card 1: Silt Loop */}
          <div
            style={{
              border: '1px solid var(--fine-border)',
              borderRadius: '6px',
              padding: '16px',
              backgroundColor: 'var(--surface-sandstone)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '4px', backgroundColor: '#EDF7EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Truck size={16} color="#15803D" />
                </div>
                <div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--secondary-text)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Module 1: Action Lab
                  </div>
                  <strong style={{ fontSize: '0.84rem', color: 'var(--primary-forest)' }}>
                    Circular Silt-to-Farm Loop
                  </strong>
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '10px', borderRadius: '4px', border: '1px solid var(--fine-border)', margin: '8px 0' }}>
                <div style={{ fontSize: '0.66rem', color: 'var(--secondary-text)' }}>Modulated Storm Silt Yield:</div>
                <div className="mono-text" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--antique-gold)' }}>
                  +{liveScenario.lakeSiltYieldTons.toLocaleString()} <span style={{ fontSize: '0.72rem', fontWeight: 500 }}>Tons</span>
                </div>
                <div style={{ fontSize: '0.68rem', color: '#15803D', fontWeight: 600 }}>
                  Harvestable stockpile in Sisarma Delta expands
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--secondary-text)', lineHeight: 1.45, marginBottom: '12px' }}>
                <strong>Why it changes:</strong> Raindrop kinetic impact (E = 0.29 · [1 - 0.72 · e^(-0.05 · I)]) detaches steep Aravalli phyllite clay, flushing nutrient-dense lacustrine silt into lake deltas for bio-fertilizer extraction.
              </div>
            </div>

            <button
              onClick={() => onNavigateToModule?.('silt-loop')}
              className="apple-pressable"
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '0.74rem',
                fontWeight: 700,
                backgroundColor: 'var(--deep-green)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <span>Inspect Stockpile in Silt Loop</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Card 2: Citizen Sentry */}
          <div
            style={{
              border: '1px solid var(--fine-border)',
              borderRadius: '6px',
              padding: '16px',
              backgroundColor: 'var(--surface-sandstone)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '4px', backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Waves size={16} color="var(--water-blue)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--secondary-text)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Module 2: Citizen Sentry
                  </div>
                  <strong style={{ fontSize: '0.84rem', color: 'var(--primary-forest)' }}>
                    Lake Water Quality &amp; Ghats
                  </strong>
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '10px', borderRadius: '4px', border: '1px solid var(--fine-border)', margin: '8px 0' }}>
                <div style={{ fontSize: '0.66rem', color: 'var(--secondary-text)' }}>Modulated Lake Turbidity:</div>
                <div className="mono-text" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--status-warning)' }}>
                  {liveScenario.lakeTurbiditySurgeNtu} <span style={{ fontSize: '0.72rem', fontWeight: 500 }}>NTU</span>
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--water-blue)', fontWeight: 600 }}>
                  Lake Pichola rises +{liveScenario.lakeLevelRiseMeters}m (to {(571.8 + liveScenario.lakeLevelRiseMeters).toFixed(2)}m)
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--secondary-text)', lineHeight: 1.45, marginBottom: '12px' }}>
                <strong>Why it changes:</strong> Flash stormwater flushes colloidal sediment across Ambrai &amp; Gangaur Ghats. Secchi clarity temporarily drops from 1.8m to 0.4m until settling is complete.
              </div>
            </div>

            <button
              onClick={() => onNavigateToModule?.('citizen-hub')}
              className="apple-pressable"
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '0.74rem',
                fontWeight: 700,
                backgroundColor: 'var(--deep-green)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <span>Inspect Telemetry in Citizen Hub</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Card 3: Civil DPR & Check Dams */}
          <div
            style={{
              border: '1px solid var(--fine-border)',
              borderRadius: '6px',
              padding: '16px',
              backgroundColor: 'var(--surface-sandstone)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '4px', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={16} color="var(--antique-gold)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--secondary-text)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Module 3: Civil DPR
                  </div>
                  <strong style={{ fontSize: '0.84rem', color: 'var(--primary-forest)' }}>
                    Check Dams &amp; Interventions
                  </strong>
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '10px', borderRadius: '4px', border: '1px solid var(--fine-border)', margin: '8px 0' }}>
                <div style={{ fontSize: '0.66rem', color: 'var(--secondary-text)' }}>Check Dam CD-04 Capacity Load:</div>
                <div className="mono-text" style={{ fontSize: '1.25rem', fontWeight: 800, color: liveScenario.checkDamStressPct > 80 ? 'var(--status-danger)' : 'var(--antique-gold)' }}>
                  {liveScenario.checkDamStressPct}% <span style={{ fontSize: '0.72rem', fontWeight: 500 }}>Surcharge</span>
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--secondary-text)' }}>
                  Peak Inflow Qp: <strong>{liveScenario.peakDischargeCms} m³/s</strong>
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--secondary-text)', lineHeight: 1.45, marginBottom: '12px' }}>
                <strong>Why it changes:</strong> High runoff velocity tests masonry weir crest freeboard. Without upstream loose boulder plugs, downstream gully scour increases tenfold.
              </div>
            </div>

            <button
              onClick={() => onNavigateToModule?.('interventions')}
              className="apple-pressable"
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '0.74rem',
                fontWeight: 700,
                backgroundColor: 'var(--deep-green)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <span>Inspect Stress in Civil DPR</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Card 4: Heritage Crop Market */}
          <div
            style={{
              border: '1px solid var(--fine-border)',
              borderRadius: '6px',
              padding: '16px',
              backgroundColor: 'var(--surface-sandstone)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '4px', backgroundColor: '#EDF7EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sprout size={16} color="#15803D" />
                </div>
                <div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--secondary-text)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Module 4: Heritage Crops
                  </div>
                  <strong style={{ fontSize: '0.84rem', color: 'var(--primary-forest)' }}>
                    Soil Moisture &amp; Crop Yields
                  </strong>
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '10px', borderRadius: '4px', border: '1px solid var(--fine-border)', margin: '8px 0' }}>
                <div style={{ fontSize: '0.66rem', color: 'var(--secondary-text)' }}>Vadose Soil Moisture Saturation:</div>
                <div className="mono-text" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803D' }}>
                  {liveScenario.soilMoistureRechargePct}% <span style={{ fontSize: '0.72rem', fontWeight: 500 }}>Recharge</span>
                </div>
                <div style={{ fontSize: '0.68rem', color: '#15803D', fontWeight: 600 }}>
                  Desi Chana &amp; Barley yields up ~18%
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--secondary-text)', lineHeight: 1.45, marginBottom: '12px' }}>
                <strong>Why it changes:</strong> Deep infiltration into red gravelly loam recharges the root zone, reducing tube-well pumping requirements by 38% and restoring soil humus.
              </div>
            </div>

            <button
              onClick={() => onNavigateToModule?.('heritage-crops')}
              className="apple-pressable"
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '0.74rem',
                fontWeight: 700,
                backgroundColor: 'var(--deep-green)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <span>Inspect Recharge in Heritage Market</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Card 5: Upstream Landscape Tracer */}
          <div
            style={{
              border: '1px solid var(--fine-border)',
              borderRadius: '6px',
              padding: '16px',
              backgroundColor: 'var(--surface-sandstone)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '4px', backgroundColor: '#FAF5FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Compass size={16} color="var(--primary-forest)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--secondary-text)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Module 5: Landscape Tracer
                  </div>
                  <strong style={{ fontSize: '0.84rem', color: 'var(--primary-forest)' }}>
                    Crest-to-Lake Flow Velocity
                  </strong>
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '10px', borderRadius: '4px', border: '1px solid var(--fine-border)', margin: '8px 0' }}>
                <div style={{ fontSize: '0.66rem', color: 'var(--secondary-text)' }}>Peak Overland Stream Velocity:</div>
                <div className="mono-text" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-forest)' }}>
                  {((liveScenario.intensityMmH / 22) * 1.6).toFixed(1)} <span style={{ fontSize: '0.72rem', fontWeight: 500 }}>m/s</span>
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--secondary-text)' }}>
                  Storm Transit Time: ~{Math.max(22, Math.round(85 - (liveScenario.rainfallMm / 350) * 50))} mins to Pichola
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--secondary-text)', lineHeight: 1.45, marginBottom: '12px' }}>
                <strong>Why it changes:</strong> Steep 36.4% slopes on Bansdara peak accelerate runoff kinetic energy. Overland stream vectors reach terminal velocity in Bujhra gully before hitting check dams.
              </div>
            </div>

            <button
              onClick={() => onNavigateToModule?.('trace')}
              className="apple-pressable"
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '0.74rem',
                fontWeight: 700,
                backgroundColor: 'var(--deep-green)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <span>Inspect Flow Vectors in Tracer</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
