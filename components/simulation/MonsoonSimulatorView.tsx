'use client';

import React, { useState } from 'react';
import { DEFAULT_INTERVENTIONS } from '@/lib/geo-data';
import { runHydrologicalSimulation } from '@/lib/simulation-engine';
import { Intervention, SimulationParams, SimulationResult } from '@/lib/types';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  CloudLightning,
  CloudRain,
  Compass,
  Droplets,
  Layers,
  MapPin,
  Play,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sparkles,
  Sprout,
  Waves,
} from 'lucide-react';

interface MonsoonSimulatorViewProps {
  onOpen3DMap: () => void;
  activeInterventions: Intervention[];
  onSimulationComplete: (result: SimulationResult, isSimulating: boolean) => void;
  lastResult: SimulationResult | null;
}

export const MonsoonSimulatorView: React.FC<MonsoonSimulatorViewProps> = ({
  onOpen3DMap,
  activeInterventions,
  onSimulationComplete,
  lastResult,
}) => {
  const [rainfallMm, setRainfallMm] = useState<number>(200);
  const [durationHours, setDurationHours] = useState<number>(3);
  const [soilSaturation, setSoilSaturation] = useState<number>(45);
  const [isProcessing, setIsProcessing] = useState(false);

  // Compute live or use last result
  const currentParams: SimulationParams = {
    rainfallMm,
    durationHours,
    activeInterventions,
    soilSaturationInitial: soilSaturation,
  };

  const computedResult = lastResult || runHydrologicalSimulation(currentParams);

  const rainfallPresets = [
    { value: 50, label: '50 mm', desc: 'Light Monsoon Shower' },
    { value: 100, label: '100 mm', desc: 'Moderate Storm Event' },
    { value: 150, label: '150 mm', desc: 'Heavy Monsoon Downpour' },
    { value: 200, label: '200 mm', desc: 'Severe Convective Deluge' },
    { value: 250, label: '250 mm', desc: 'Very Severe Cloudburst' },
    { value: 350, label: '350 mm', desc: 'Catastrophic Cloudburst (1-in-100 Yr)' },
  ];

  const durationOptions = [1, 3, 6, 12, 24];

  const handleSimulateAndFly = () => {
    setIsProcessing(true);
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

        <button
          onClick={handleSimulateAndFly}
          disabled={isProcessing}
          className="btn apple-pressable"
          style={{
            padding: '10px 20px',
            fontSize: '0.86rem',
            fontWeight: 600,
            backgroundColor: 'var(--color-terracotta)',
            color: '#FFFFFF',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 3px 10px rgba(189, 86, 55, 0.3)',
          }}
        >
          {isProcessing ? (
            'Simulating Storm...'
          ) : (
            <>
              <Play size={16} fill="#FFFFFF" />
              Run Model & Watch 3D Landscape
            </>
          )}
        </button>
      </div>

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
    </div>
  );
};
