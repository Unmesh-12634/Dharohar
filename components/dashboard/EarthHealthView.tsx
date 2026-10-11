'use client';

import React from 'react';
import { ViewPreset } from '@/lib/types';
import { ArrowUpRight, Compass, Droplets, Mountain, Shield, Sprout, TrendingDown, TrendingUp, Wind } from 'lucide-react';

interface EarthHealthViewProps {
  onNavigateToPreset: (preset: ViewPreset) => void;
  onOpenMap: () => void;
}

export const EarthHealthView: React.FC<EarthHealthViewProps> = ({
  onNavigateToPreset,
  onOpenMap,
}) => {
  const categories = [
    {
      id: 'vegetation',
      title: 'Vegetation Health & Forest Cover',
      score: 58,
      status: 'Moderate Deficit',
      trend: 'up',
      trendText: '+2.4% over 3 years (Native Silvipasture regenerating)',
      preset: 'watershed' as ViewPreset,
      dataSource: 'MODELED' as const,
      explanation: 'Moderate canopy density across Sajjangarh wildlife sanctuary, but acute scrub degradation on western non-reserved ridge slopes facing grazing pressure.',
      indicators: [
        { label: 'Mean NDVI', value: '0.55' },
        { label: 'Dense Canopy', value: '38%' },
        { label: 'Degraded Scree', value: '32%' },
      ],
    },
    {
      id: 'water',
      title: 'Water Security & Lake Storage',
      score: 72,
      status: 'Stable Post-Monsoon',
      trend: 'stable',
      trendText: 'Pichola at 74% capacity; Fateh Sagar at 82%',
      preset: 'lake' as ViewPreset,
      dataSource: 'OBSERVED' as const,
      explanation: 'Artificial lake chain provides buffer against pre-monsoon drought, but terminal sedimentation at river inlets poses long-term volumetric risk.',
      indicators: [
        { label: 'Live Storage', value: '34.2 MCM' },
        { label: 'Annual Silt Infill', value: '1.2% / decade' },
        { label: 'Water Quality Index', value: '78 / 100' },
      ],
    },
    {
      id: 'soil',
      title: 'Topsoil Retention & Erosion Stability',
      score: 49,
      status: 'Acute Vulnerability',
      trend: 'down',
      trendText: 'Gully incisions widening by 0.35m annually',
      preset: 'risk' as ViewPreset,
      dataSource: 'MODELED' as const,
      explanation: 'Skeletal Inceptisols on quartzite slopes exhibit extreme shear vulnerability during high-intensity thunderstorms (>40 mm/hr).',
      indicators: [
        { label: 'Mean Sediment Loss', value: '34 t/ha/yr' },
        { label: 'Critical Escarpment', value: '14.2 km²' },
        { label: 'Soil Depth', value: '< 15 cm' },
      ],
    },
    {
      id: 'agriculture',
      title: 'Smallholder Agrarian Resilience',
      score: 63,
      status: 'Fair / Exposed to Floods',
      trend: 'up',
      trendText: 'Micro-irrigation adoption in Nai and Bujhra',
      preset: 'agriculture' as ViewPreset,
      dataSource: 'MODELED' as const,
      explanation: 'Terraced maize and wheat parcels face flash runoff inundation from hillside rills, causing seasonal gravel siltation on fertile fields.',
      indicators: [
        { label: 'Cultivated Area', value: '4,850 ha' },
        { label: 'Gravel Silt Exposure', value: '18% parcels' },
        { label: 'Moisture Retention', value: 'Moderate' },
      ],
    },
    {
      id: 'watershed',
      title: 'Catchment Hydrologic Regulation',
      score: 61,
      status: 'Unregulated Peak Surge',
      trend: 'down',
      trendText: 'Short concentration time (Tc = 1.4 hours)',
      preset: 'watershed' as ViewPreset,
      dataSource: 'MODELED' as const,
      explanation: 'Natural stream network lacks adequate energy dissipation check dams, resulting in rapid stormwater surge into the urban lake basin.',
      indicators: [
        { label: 'Catchment Area', value: '284.5 km²' },
        { label: 'Drainage Density', value: '2.4 km/km²' },
        { label: 'Peak Hydrograph Surge', value: 'High' },
      ],
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
          <span className="badge badge-modeled">Prototype Landscape Health Model</span>
          <span className="badge badge-observed">Udaipur Catchment Pilot</span>
        </div>
        <h2 className="serif-title" style={{ fontSize: '1.9rem', color: 'var(--color-forest)', marginBottom: '6px' }}>
          Earth Health: Regional Composite Index
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', maxWidth: '780px' }}>
          Multi-criteria environmental diagnostic synthesizing satellite vegetation indices, hydrologic drainage parameters, and digital elevation curvature across the pilot study area.
        </p>
      </div>

      {/* Aggregate Score Showcase Card */}
      <div className="editorial-card" style={{
        padding: '24px 28px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        backgroundColor: 'var(--bg-card)',
      }}>
        <div>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Overall Landscape Health Score
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
            <span className="mono-text" style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--color-forest)', lineHeight: 1 }}>
              64
            </span>
            <span style={{ fontSize: '1.2rem', color: 'var(--text-tertiary)' }}>/ 100</span>
            <span className="badge badge-modeled" style={{ marginLeft: '10px' }}>
              Prototype Model Output
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '520px' }}>
            Weighted balance between moderate water storage reserves in Udaipur lakes (72/100) and acute topsoil vulnerability on steep Aravalli ridges (49/100).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => {
              onNavigateToPreset('udaipur');
              onOpenMap();
            }}
            className="btn btn-primary"
            style={{ padding: '10px 18px', fontSize: '0.82rem' }}
          >
            <Compass size={15} />
            Inspect on 3D Digital Twin
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="editorial-card"
            style={{
              padding: '18px 22px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="mono-text" style={{
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: cat.score >= 70 ? 'var(--color-forest)' : cat.score >= 55 ? '#8C6D23' : 'var(--color-terracotta)',
                }}>
                  {cat.score}
                </span>
                <div>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {cat.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cat.status}</span>
                    <span>•</span>
                    <span>{cat.trendText}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={cat.dataSource === 'OBSERVED' ? 'badge badge-observed' : 'badge badge-modeled'}>
                  {cat.dataSource}
                </span>
                <button
                  onClick={() => {
                    onNavigateToPreset(cat.preset);
                    onOpenMap();
                  }}
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.74rem' }}
                >
                  <ArrowUpRight size={13} />
                  View Hotspot
                </button>
              </div>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {cat.explanation}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
              {cat.indicators.map((ind, i) => (
                <div key={i} style={{ fontSize: '0.72rem' }}>
                  <span style={{ color: 'var(--text-tertiary)', display: 'block' }}>{ind.label}</span>
                  <span className="mono-text" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ind.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
