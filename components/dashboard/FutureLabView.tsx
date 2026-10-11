'use client';

import React, { useState } from 'react';
import { DEFAULT_INTERVENTIONS } from '@/lib/geo-data';
import { runHydrologicalSimulation } from '@/lib/simulation-engine';
import { Intervention } from '@/lib/types';
import { Check, CheckCircle2, ChevronRight, CloudRain, Droplets, Info, Play, Plus, ShieldCheck, Sliders, Sparkles } from 'lucide-react';

interface FutureLabViewProps {
  onOpenMap: () => void;
  onOpenSimulation: () => void;
}

export const FutureLabView: React.FC<FutureLabViewProps> = ({
  onOpenMap,
  onOpenSimulation,
}) => {
  const [scenario, setScenario] = useState<'current' | 'plus20' | 'plus30' | 'extreme'>('plus20');
  const [selectedInterventions, setSelectedInterventions] = useState<Intervention[]>([
    DEFAULT_INTERVENTIONS[0], // Check dam
    DEFAULT_INTERVENTIONS[1], // Contour bund
  ]);

  // Determine rainfall for scenario
  const getRainfallMm = () => {
    switch (scenario) {
      case 'current':
        return 100;
      case 'plus20':
        return 150;
      case 'plus30':
        return 200;
      case 'extreme':
        return 300;
    }
  };

  const rainfallMm = getRainfallMm();

  // Baseline (without interventions)
  const baselineResult = runHydrologicalSimulation({
    rainfallMm,
    durationHours: 3,
    activeInterventions: [],
    soilSaturationInitial: 45,
  });

  // With selected interventions
  const mitigatedResult = runHydrologicalSimulation({
    rainfallMm,
    durationHours: 3,
    activeInterventions: selectedInterventions,
    soilSaturationInitial: 45,
  });

  const toggleIntervention = (item: Intervention) => {
    if (selectedInterventions.some((x) => x.id === item.id)) {
      setSelectedInterventions(selectedInterventions.filter((x) => x.id !== item.id));
    } else {
      setSelectedInterventions([...selectedInterventions, item]);
    }
  };

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '28px 20px',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="badge badge-simulated">Scenario Modeling Sandbox</span>
          <span className="badge badge-observed">Predictive Catchment Physics</span>
        </div>
        <h2 className="serif-title" style={{ fontSize: '2rem', color: 'var(--color-forest)', marginBottom: '4px' }}>
          FUTURE LAB
        </h2>
        <p className="serif-title" style={{ fontSize: '1.15rem', color: 'var(--color-terracotta)', fontStyle: 'italic', marginBottom: '8px' }}>
          "Test the future before changing the land."
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', maxWidth: '800px' }}>
          Simulate counterfactual climate scenarios against proposed structural and nature-based interventions. Compare catastrophic unmitigated runoff peaks against stabilized landscape outcomes in real time.
        </p>
      </div>

      {/* Climate Scenario Selection Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: '20px',
        overflowX: 'auto',
      }}>
        <button
          onClick={() => setScenario('current')}
          className={`btn ${scenario === 'current' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}
        >
          Baseline Monsoon (100 mm)
        </button>

        <button
          onClick={() => setScenario('plus20')}
          className={`btn ${scenario === 'plus20' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}
        >
          +20% Rainfall Burst (150 mm)
        </button>

        <button
          onClick={() => setScenario('plus30')}
          className={`btn ${scenario === 'plus30' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}
        >
          +30% Severe Monsoon (200 mm)
        </button>

        <button
          onClick={() => setScenario('extreme')}
          className={`btn ${scenario === 'extreme' ? 'btn-terracotta' : 'btn-ghost'}`}
          style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}
        >
          Extreme Cloudburst (300 mm)
        </button>
      </div>

      {/* Interventions Selector Strip */}
      <div className="editorial-card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div>
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Configure Proposed Interventions to Test:
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginLeft: '8px' }}>
              ({selectedInterventions.length} active in scenario)
            </span>
          </div>
          <span className="badge badge-simulated" style={{ fontSize: '0.66rem' }}>
            Simulated scenario output
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {DEFAULT_INTERVENTIONS.map((item) => {
            const isSelected = selectedInterventions.some((x) => x.id === item.id);
            return (
              <button
                key={item.id}
                onClick={() => toggleIntervention(item)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-xs)',
                  border: isSelected ? '1px solid var(--color-forest)' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'var(--color-forest-bg)' : 'var(--bg-card)',
                  color: isSelected ? 'var(--color-forest)' : 'var(--text-secondary)',
                  fontSize: '0.76rem',
                  fontWeight: isSelected ? 600 : 400,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                {isSelected ? <Check size={13} color="var(--color-forest)" /> : <Plus size={13} />}
                {item.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Before vs After Comparison Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* WITHOUT INTERVENTION */}
        <div className="editorial-card" style={{
          padding: '20px',
          borderLeft: '4px solid var(--color-terracotta)',
          backgroundColor: 'var(--bg-card)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-terracotta)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              WITHOUT INTERVENTION
            </span>
            <span className="badge badge-simulated">Unmitigated Baseline</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Peak Hydrograph Surge</span>
              <span className="mono-text" style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--color-terracotta)' }}>
                {baselineResult.peakDischargeCms} m³/s
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Topsoil Erosion Scour</span>
              <span className="mono-text" style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--color-terracotta)' }}>
                {baselineResult.erosionVolumeTons.toLocaleString()} metric tons
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Farmland Flood Inundation</span>
              <span className="mono-text" style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {baselineResult.farmlandInundationHa} hectares
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Pichola Silt Inflow</span>
              <span className="mono-text" style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--color-lake)' }}>
                {baselineResult.lakeInflowVolumeMcm} MCM
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Runoff Risk Level</span>
              <span className="badge badge-simulated">{baselineResult.runoffRiskLevel}</span>
            </div>
          </div>
        </div>

        {/* WITH INTERVENTION */}
        <div className="editorial-card" style={{
          padding: '20px',
          borderLeft: '4px solid var(--color-forest)',
          backgroundColor: 'var(--bg-card)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-forest)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              WITH INTERVENTION ({selectedInterventions.length} STRUCTURES)
            </span>
            <span className="badge badge-observed">Mitigated Future</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Peak Hydrograph Surge</span>
              <div style={{ textAlign: 'right' }}>
                <span className="mono-text" style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--color-forest)' }}>
                  {mitigatedResult.peakDischargeCms} m³/s
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--color-forest)', marginLeft: '6px' }}>
                  (-{mitigatedResult.baselineVsMitigated.runoffReduction}%)
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Topsoil Erosion Scour</span>
              <div style={{ textAlign: 'right' }}>
                <span className="mono-text" style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--color-forest)' }}>
                  {mitigatedResult.erosionVolumeTons.toLocaleString()} metric tons
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--color-forest)', marginLeft: '6px' }}>
                  (-{mitigatedResult.baselineVsMitigated.erosionReduction}%)
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Farmland Flood Inundation</span>
              <div style={{ textAlign: 'right' }}>
                <span className="mono-text" style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                  {mitigatedResult.farmlandInundationHa} hectares
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--color-forest)', marginLeft: '6px' }}>
                  (-{mitigatedResult.baselineVsMitigated.agriculturalSafetyIncrease}%)
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Local Moisture Infiltration</span>
              <div style={{ textAlign: 'right' }}>
                <span className="mono-text" style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--color-lake)' }}>
                  +{mitigatedResult.waterRetentionGainPercent}% Gain
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Post-Mitigation Risk</span>
              <span className="badge badge-observed">{mitigatedResult.runoffRiskLevel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Narrative Synthesis */}
      <div className="editorial-card-subtle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ maxWidth: '720px' }}>
          <h4 style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Modeled Ecological Insight:
          </h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {mitigatedResult.narrativeSummary}
          </p>
        </div>

        <button
          onClick={onOpenMap}
          className="btn btn-primary"
          style={{ padding: '8px 18px', fontSize: '0.82rem' }}
        >
          View Simulated 3D Overlay
        </button>
      </div>
    </div>
  );
};
