'use client';

import React, { useState } from 'react';
import { runHydrologicalSimulation } from '@/lib/simulation-engine';
import { Intervention, SimulationParams, SimulationResult } from '@/lib/types';
import { CloudRain, Droplets, Info, Play, RotateCcw, ShieldCheck, X } from 'lucide-react';

interface RainSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeInterventions: Intervention[];
  onSimulationComplete: (result: SimulationResult, isSimulating: boolean) => void;
  lastResult: SimulationResult | null;
}

export const RainSimulationModal: React.FC<RainSimulationModalProps> = ({
  isOpen,
  onClose,
  activeInterventions,
  onSimulationComplete,
  lastResult,
}) => {
  const [rainfallMm, setRainfallMm] = useState<number>(200);
  const [durationHours, setDurationHours] = useState<number>(3);
  const [soilSaturation, setSoilSaturation] = useState<number>(45);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const rainfallOptions = [
    { value: 50, label: '50 mm (Light Monsoon)' },
    { value: 100, label: '100 mm (Moderate Storm)' },
    { value: 150, label: '150 mm (Heavy Rainfall)' },
    { value: 200, label: '200 mm (Severe Downpour)' },
    { value: 250, label: '250 mm (Very Severe)' },
    { value: 350, label: '350 mm (Extreme Cloudburst)' },
  ];

  const durationOptions = [
    { value: 1, label: '1 hour' },
    { value: 3, label: '3 hours' },
    { value: 6, label: '6 hours' },
    { value: 12, label: '12 hours' },
    { value: 24, label: '24 hours' },
  ];

  const handleRunSimulation = () => {
    setIsProcessing(true);

    const params: SimulationParams = {
      rainfallMm,
      durationHours,
      activeInterventions,
      soilSaturationInitial: soilSaturation,
    };

    setTimeout(() => {
      const result = runHydrologicalSimulation(params);
      setIsProcessing(false);
      onSimulationComplete(result, true);
    }, 600);
  };

  const currentResult = lastResult;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(28, 34, 32, 0.45)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-popover)',
        width: '100%',
        maxWidth: '720px',
        maxHeight: '90vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'var(--color-terracotta-bg)',
              color: 'var(--color-terracotta)',
              borderRadius: 'var(--radius-xs)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <CloudRain size={18} />
            </div>
            <div>
              <h2 className="serif-title" style={{ fontSize: '1.28rem', color: 'var(--text-primary)' }}>
                Simulate Monsoon Rainfall & Overland Runoff
              </h2>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                Prototype hydrologic model calibrated for Aravalli steep slope hydrology
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Simulation Parameters Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {/* Rainfall Selection */}
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, marginBottom: '6px' }}>
                Precipitation Volume:
              </label>
              <select
                value={rainfallMm}
                onChange={(e) => setRainfallMm(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-strong)',
                  backgroundColor: 'var(--bg-primary)',
                  fontSize: '0.82rem',
                }}
              >
                {rainfallOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration Selection */}
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, marginBottom: '6px' }}>
                Event Duration:
              </label>
              <select
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-strong)',
                  backgroundColor: 'var(--bg-primary)',
                  fontSize: '0.82rem',
                }}
              >
                {durationOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Antecedent Soil Moisture */}
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, marginBottom: '6px' }}>
                Antecedent Moisture: {soilSaturation}%
              </label>
              <input
                type="range"
                min={15}
                max={90}
                value={soilSaturation}
                onChange={(e) => setSoilSaturation(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-lake)', marginTop: '6px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
                <span>Dry Pre-monsoon</span>
                <span>Saturated Post-burst</span>
              </div>
            </div>
          </div>

          {/* Active Interventions Status */}
          <div style={{
            padding: '10px 14px',
            backgroundColor: activeInterventions.length > 0 ? 'var(--color-forest-bg)' : 'var(--bg-secondary)',
            border: `1px solid ${activeInterventions.length > 0 ? '#CFDCD3' : 'var(--border-subtle)'}`,
            borderRadius: 'var(--radius-xs)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} color={activeInterventions.length > 0 ? 'var(--color-forest)' : 'var(--text-tertiary)'} />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                <strong>Active Conservation Interventions:</strong> {activeInterventions.length} structure(s) deployed
              </span>
            </div>
            <span className="badge badge-simulated" style={{ fontSize: '0.68rem' }}>
              {activeInterventions.length > 0 ? 'Mitigation Active' : 'Unmitigated Baseline'}
            </span>
          </div>

          {/* Action Button */}
          <button
            onClick={handleRunSimulation}
            disabled={isProcessing}
            className="btn btn-terracotta"
            style={{ padding: '10px 20px', fontSize: '0.88rem', fontWeight: 600, width: '100%' }}
          >
            <Play size={16} />
            {isProcessing ? 'Computing Hydrologic Vectors...' : 'Execute Simulation & Render 3D Runoff'}
          </button>

          {/* Simulation Output Card if available */}
          {currentResult && (
            <div style={{
              marginTop: '10px',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              backgroundColor: 'var(--bg-card-subtle)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="serif-title" style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                  Simulation Scenario Output
                </span>
                <span className="badge badge-simulated">
                  Prototype Scenario Estimate
                </span>
              </div>

              {/* Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '14px' }}>
                <div className="editorial-card" style={{ padding: '10px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Peak Discharge</div>
                  <div className="mono-text" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-terracotta)' }}>
                    {currentResult.peakDischargeCms} m³/s
                  </div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--text-tertiary)' }}>Level: {currentResult.runoffRiskLevel}</div>
                </div>

                <div className="editorial-card" style={{ padding: '10px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Topsoil Loss</div>
                  <div className="mono-text" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-terracotta)' }}>
                    {currentResult.erosionVolumeTons.toLocaleString()} t
                  </div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--text-tertiary)' }}>USLE sediment yield</div>
                </div>

                <div className="editorial-card" style={{ padding: '10px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Lake Inflow Gain</div>
                  <div className="mono-text" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-lake)' }}>
                    +{currentResult.lakeInflowVolumeMcm} MCM
                  </div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--text-tertiary)' }}>To Pichola & Fateh Sagar</div>
                </div>

                <div className="editorial-card" style={{ padding: '10px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Farmland Inundation</div>
                  <div className="mono-text" style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {currentResult.farmlandInundationHa} ha
                  </div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--text-tertiary)' }}>Bujhra & Nai terraces</div>
                </div>
              </div>

              {/* Ridge-to-Lake 3-Tier Environmental Impact Cascade */}
              {currentResult.ridgeToLakeCascade && (
                <div style={{
                  marginTop: '14px',
                  marginBottom: '14px',
                  border: '1.5px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-secondary)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    padding: '8px 14px',
                    backgroundColor: 'var(--color-forest)',
                    color: '#FFFFFF',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <span>🌊 Ridge-to-Lake 3-Tier Environmental Impact Cascade</span>
                    <span style={{ fontSize: '0.68rem', opacity: 0.9 }}>Domain 4 Closed-Loop</span>
                  </div>

                  <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* Tier 1: Mountain Ridge */}
                    <div style={{
                      backgroundColor: '#FFFFFF',
                      padding: '10px 12px',
                      borderRadius: '4px',
                      borderLeft: '4px solid #8A7A64',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '0.80rem', color: '#4A3B18' }}>
                          ⛰️ Tier 1: Aravalli Mountain Ridge & Slopes
                        </strong>
                        <span className="mono-text" style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
                          Buffer: {currentResult.ridgeToLakeCascade.ridgeMountain.vegetativeBufferShieldHa} ha
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '0.72rem' }}>
                        <div>
                          <span style={{ color: 'var(--text-tertiary)' }}>Runoff Arrested:</span>
                          <strong style={{ display: 'block', color: 'var(--color-forest)' }}>
                            {(currentResult.ridgeToLakeCascade.ridgeMountain.runoffArrestedM3 / 1000).toFixed(1)}k m³
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-tertiary)' }}>Slope Wash Stopped:</span>
                          <strong style={{ display: 'block', color: 'var(--color-terracotta)' }}>
                            {currentResult.ridgeToLakeCascade.ridgeMountain.slopeErosionPreventedTons.toLocaleString()} t
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-tertiary)' }}>Check Dam Capacity:</span>
                          <strong style={{ display: 'block', color: 'var(--color-lake)' }}>
                            {currentResult.ridgeToLakeCascade.ridgeMountain.checkDamCapacityUtilizedPct}% utilized
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Tier 2: Agrarian Valleys */}
                    <div style={{
                      backgroundColor: '#FFFFFF',
                      padding: '10px 12px',
                      borderRadius: '4px',
                      borderLeft: '4px solid var(--color-forest)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '0.80rem', color: 'var(--color-forest)' }}>
                          🌾 Tier 2: Smallholder Terraced Farmland (Girwa)
                        </strong>
                        <span className="mono-text" style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
                          Protected: {currentResult.ridgeToLakeCascade.middleFarmland.farmlandProtectedHa} ha
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '0.72rem' }}>
                        <div>
                          <span style={{ color: 'var(--text-tertiary)' }}>Topsoil Preserved:</span>
                          <strong style={{ display: 'block', color: 'var(--color-forest)' }}>
                            {currentResult.ridgeToLakeCascade.middleFarmland.topsoilSavedTons.toLocaleString()} tons
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-tertiary)' }}>NPK Nutrients Saved:</span>
                          <strong style={{ display: 'block', color: '#8A6E3D' }}>
                            ₹ {currentResult.ridgeToLakeCascade.middleFarmland.nutrientLossPreventedInr.toLocaleString()}
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-tertiary)' }}>Crop Yield Shield:</span>
                          <strong style={{ display: 'block', color: 'var(--color-forest)' }}>
                            +{currentResult.ridgeToLakeCascade.middleFarmland.yieldLossMitigatedPct}% resilience
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Tier 3: Udaipur Lakes */}
                    <div style={{
                      backgroundColor: '#FFFFFF',
                      padding: '10px 12px',
                      borderRadius: '4px',
                      borderLeft: '4px solid var(--color-lake)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '0.80rem', color: 'var(--color-lake)' }}>
                          💧 Tier 3: Udaipur Lakes & Catchments (Pichola & Fateh Sagar)
                        </strong>
                        <span className="badge" style={{
                          backgroundColor: currentResult.ridgeToLakeCascade.lowerLakes.swaroopSagarLinkSafe ? '#E1EEF6' : '#FDE8E4',
                          color: currentResult.ridgeToLakeCascade.lowerLakes.swaroopSagarLinkSafe ? 'var(--color-lake)' : 'var(--color-terracotta)',
                          fontSize: '0.62rem',
                        }}>
                          Swaroop Sagar Canal: {currentResult.ridgeToLakeCascade.lowerLakes.swaroopSagarLinkSafe ? 'Safe Flow' : 'High Risk'}
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '0.72rem' }}>
                        <div>
                          <span style={{ color: 'var(--text-tertiary)' }}>Silt Kept Out of Lakes:</span>
                          <strong style={{ display: 'block', color: 'var(--color-lake)' }}>
                            {currentResult.ridgeToLakeCascade.lowerLakes.siltDivertedFromLakesTons.toLocaleString()} tons
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-tertiary)' }}>Municipal Dredging Saved:</span>
                          <strong style={{ display: 'block', color: 'var(--color-forest)' }}>
                            ₹ {currentResult.ridgeToLakeCascade.lowerLakes.municipalDredgingCostSavedInr.toLocaleString()}
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-tertiary)' }}>Dead Storage Extended:</span>
                          <strong style={{ display: 'block', color: 'var(--color-lake)' }}>
                            +{currentResult.ridgeToLakeCascade.lowerLakes.lakeDeadStorageSavedYears} yrs lifespan
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mitigation Delta if interventions active */}
              {activeInterventions.length > 0 && (
                <div style={{
                  padding: '10px 12px',
                  backgroundColor: 'var(--color-forest-bg)',
                  border: '1px solid #CFDCD3',
                  borderRadius: 'var(--radius-xs)',
                  marginBottom: '12px',
                }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-forest)', marginBottom: '4px' }}>
                    Intervention Delta vs Unmitigated Baseline:
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.72rem', color: 'var(--text-primary)', flexWrap: 'wrap' }}>
                    <span>Runoff Peak: <strong>-{currentResult.baselineVsMitigated.runoffReduction}%</strong></span>
                    <span>Soil Loss: <strong>-{currentResult.baselineVsMitigated.erosionReduction}%</strong></span>
                    <span>Agrarian Safety: <strong>+{currentResult.baselineVsMitigated.agriculturalSafetyIncrease}%</strong></span>
                    <span>Water Retention: <strong>+{currentResult.baselineVsMitigated.waterRetentionIncrease}%</strong></span>
                  </div>
                </div>
              )}

              {/* Scientific narrative */}
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {currentResult.narrativeSummary}
              </p>
            </div>
          )}

          {/* Scientific Disclaimer */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.70rem', color: 'var(--text-tertiary)' }}>
            <Info size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              Disclaimer: Hydro-mechanical calculations are algorithmic approximations based on USDA SCS Curve Number and RUSLE equations for Southern Rajasthan quartzite topography. Calibrated against Central Ground Water Board (CGWB) & Krishi Vigyan Kendra (KVK Badgaon) data.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
