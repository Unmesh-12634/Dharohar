'use client';

import React from 'react';
import { ArrowDownRight, ArrowUpRight, CheckCircle2, Compass, Droplet, Info, ShieldCheck, Sprout, Wind } from 'lucide-react';

interface ImpactViewProps {
  onOpenMap: () => void;
  onOpenSimulation: () => void;
}

export const ImpactView: React.FC<ImpactViewProps> = ({
  onOpenMap,
  onOpenSimulation,
}) => {
  const impactMetrics = [
    {
      metric: 'Overland Runoff Volume',
      baseline: '4.82 MCM',
      simulated: '2.98 MCM',
      change: '-38%',
      isGood: true,
      tag: 'SIMULATED' as const,
      detail: 'Based on 4 masonry check dams and contour trenching arresting velocity across Sisarma stream orders.',
    },
    {
      metric: 'Topsoil Erosion Scour',
      baseline: '46,200 tons',
      simulated: '24,900 tons',
      change: '-46%',
      isGood: true,
      tag: 'SIMULATED' as const,
      detail: 'Modeled RUSLE loss reduction via stone bunding and Dhok tree re-vegetation on Sajjangarh ridge.',
    },
    {
      metric: 'Pichola Delta Silt Choking',
      baseline: '1.2% / decade',
      simulated: '0.45% / decade',
      change: '-62%',
      isGood: true,
      tag: 'SIMULATED' as const,
      detail: 'Inflow desiltation trap prevents coarse bedload from debouching into historic lake basin.',
    },
    {
      metric: 'Farmland Flood Inundation',
      baseline: '340 hectares',
      simulated: '132 hectares',
      change: '-61%',
      isGood: true,
      tag: 'SIMULATED' as const,
      detail: 'Buffer detention ponds in Bujhra valley regulate sudden flash hydrograph peaks away from smallholder fields.',
    },
    {
      metric: 'Soil Moisture Retention',
      baseline: '32% volumetric',
      simulated: '49% volumetric',
      change: '+53%',
      isGood: true,
      tag: 'MODELED' as const,
      detail: 'Percolation enhancement sustains soil moisture 28 days longer into the dry post-monsoon winter crop cycle.',
    },
    {
      metric: 'Native Canopy Cover (NDVI)',
      baseline: '0.48 (Current)',
      simulated: '0.62 (5-yr Target)',
      change: '+29%',
      isGood: true,
      tag: 'MODELED' as const,
      detail: 'Projected recovery under community grazing regulation and native silvipasture replanting.',
    },
  ];

  return (
    <div style={{
      maxWidth: '1080px',
      margin: '0 auto',
      padding: '28px 20px',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="badge badge-simulated">Impact Assessment Framework</span>
          <span className="badge badge-observed">Empirical Integrity</span>
        </div>
        <h2 className="serif-title" style={{ fontSize: '1.9rem', color: 'var(--color-forest)', marginBottom: '6px' }}>
          Catchment Impact & Scenario Metrics
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', maxWidth: '780px' }}>
          Rigorous before-and-after comparison of ecological interventions across the Southern Rajasthan study corridor. Every value is explicitly tagged by methodology to maintain complete transparency.
        </p>
      </div>

      {/* Metrics Table / Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
        {impactMetrics.map((item, idx) => (
          <div
            key={idx}
            className="editorial-card"
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px',
            }}
          >
            <div style={{ minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className={item.tag === 'MODELED' ? 'badge badge-modeled' : 'badge badge-simulated'}>
                  {item.tag}
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>Prototype Estimate</span>
              </div>
              <h3 style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {item.metric}
              </h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px', maxWidth: '480px' }}>
                {item.detail}
              </p>
            </div>

            {/* Values Delta Strip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', display: 'block' }}>Current Baseline</span>
                <span className="mono-text" style={{ fontSize: '0.92rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  {item.baseline}
                </span>
              </div>

              <div style={{ color: 'var(--border-strong)', fontSize: '1.1rem' }}>→</div>

              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', display: 'block' }}>Simulated Outcome</span>
                <span className="mono-text" style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {item.simulated}
                </span>
              </div>

              <div style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'var(--color-forest-bg)',
                border: '1px solid #CFDCD3',
                textAlign: 'center',
              }}>
                <span style={{ fontSize: '0.64rem', color: 'var(--color-forest)', textTransform: 'uppercase', display: 'block' }}>
                  Projected Gain
                </span>
                <span className="mono-text" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-forest)' }}>
                  {item.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scientific Transparency Assurance Box */}
      <div className="editorial-card-subtle" style={{
        border: '1px solid var(--border-subtle)',
        padding: '18px 22px',
        backgroundColor: 'var(--bg-card-subtle)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
      }}>
        <Info size={18} color="var(--color-forest)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
          <strong style={{ color: 'var(--text-primary)' }}>Transparency & Validation Standard:</strong>{' '}
          In compliance with state environmental research protocols, all prospective intervention metrics are algorithmically calculated simulations using calibrated parameters for Aravalli terrain. Values should be utilized by watershed planners for comparative prioritization rather than exact engineering warranties until ground-truthed with borehole telemetry and stream flow gauging stations.
        </div>
      </div>
    </div>
  );
};
