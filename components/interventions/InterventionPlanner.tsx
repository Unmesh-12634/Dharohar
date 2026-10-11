'use client';

import React, { useState } from 'react';
import { DEFAULT_INTERVENTIONS } from '@/lib/geo-data';
import { Intervention } from '@/lib/types';
import { Check, Plus, Shield, ShieldAlert, Trash2 } from 'lucide-react';

interface InterventionPlannerProps {
  activeInterventions: Intervention[];
  onToggleIntervention: (intervention: Intervention) => void;
  onRunSimulation: () => void;
}

export const InterventionPlanner: React.FC<InterventionPlannerProps> = ({
  activeInterventions,
  onToggleIntervention,
  onRunSimulation,
}) => {
  const [availableList] = useState<Intervention[]>(DEFAULT_INTERVENTIONS);

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '24px 20px',
    }}>
      {/* Title & Editorial Description */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="badge badge-observed">Adaptive Watershed Engineering</span>
          <span className="badge badge-simulated">Scenario Modeling</span>
        </div>
        <h2 className="serif-title" style={{ fontSize: '1.8rem', color: 'var(--color-forest)', marginBottom: '6px' }}>
          Ecological & Structural Intervention Planner
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', maxWidth: '780px' }}>
          Evaluate nature-based solutions and small-scale masonry structures across the Aravalli landscape.
          Select structures to place them directly onto the 3D digital twin, arrest torrential sheetwash, and simulate post-implementation catchment resilience.
        </p>
      </div>

      {/* Available Interventions Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '24px' }}>
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

                <h3 style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '14px' }}>
                  {item.description}
                </p>

                {/* Metrics Pill Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '14px', fontSize: '0.70rem' }}>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: '6px', borderRadius: '3px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-tertiary)' }}>Runoff Dampening</div>
                    <div className="mono-text" style={{ fontWeight: 600, color: 'var(--color-forest)' }}>
                      -{item.runoffReductionPercent}%
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: '6px', borderRadius: '3px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-tertiary)' }}>Soil Retention</div>
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

              {/* Toggle Button */}
              <button
                onClick={() => onToggleIntervention(item)}
                className={`btn ${isDeployed ? 'btn-secondary' : 'btn-primary'}`}
                style={{ width: '100%', fontSize: '0.80rem' }}
              >
                {isDeployed ? (
                  <>
                    <Check size={14} color="var(--color-forest)" />
                    Deployed on 3D Map (Click to Remove)
                  </>
                ) : (
                  <>
                    <Plus size={14} />
                    Deploy onto Catchment
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Summary Action Bar */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
      }}>
        <div>
          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Active Intervention Set: {activeInterventions.length} structure(s) configured
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
            Re-run hydrological simulation to measure cumulative catchment delta on Lake Pichola and farmland.
          </div>
        </div>

        <button
          onClick={onRunSimulation}
          className="btn btn-terracotta"
          style={{ padding: '8px 18px', fontSize: '0.84rem' }}
        >
          Re-run Simulation with Interventions
        </button>
      </div>
    </div>
  );
};
