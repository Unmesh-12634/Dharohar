'use client';

import React, { useState } from 'react';
import { DEFAULT_LAYERS, VEGETATION_TIME_SERIES } from '@/lib/geo-data';
import { LayerId } from '@/lib/types';
import { ChevronDown, ChevronUp, Clock, Eye, EyeOff, Layers, SlidersHorizontal } from 'lucide-react';

interface LayerPanelProps {
  activeLayers: Record<LayerId, boolean>;
  onToggleLayer: (id: LayerId) => void;
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export const LayerPanel: React.FC<LayerPanelProps> = ({
  activeLayers,
  onToggleLayer,
  selectedYear,
  onYearChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const currentVegData = VEGETATION_TIME_SERIES.find((v) => v.year === selectedYear) || VEGETATION_TIME_SERIES[4];

  return (
    <div style={{
      position: 'absolute',
      top: '16px',
      left: '16px',
      width: isCollapsed ? 'auto' : '290px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-sm)',
      boxShadow: 'var(--shadow-card)',
      backdropFilter: 'blur(10px)',
      zIndex: 25,
      transition: 'all 0.2s ease',
      maxHeight: 'calc(100vh - 120px)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 14px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
      }}
      onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={16} color="var(--color-forest)" />
          <span style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
            Environmental Layers
          </span>
        </div>
        <button
          className="btn btn-ghost"
          style={{ padding: '2px 4px' }}
          aria-label={isCollapsed ? 'Expand Layers' : 'Collapse Layers'}
        >
          {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>

      {!isCollapsed && (
        <div style={{ padding: '12px 14px', overflowY: 'auto' }}>
          {/* Layer toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {DEFAULT_LAYERS.map((layer) => {
              const isActive = activeLayers[layer.id];
              return (
                <div
                  key={layer.id}
                  onClick={() => onToggleLayer(layer.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: isActive ? 'var(--bg-card-subtle)' : 'transparent',
                    border: isActive ? '1px solid var(--border-subtle)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '2px',
                        backgroundColor: layer.color,
                        opacity: isActive ? 1 : 0.35,
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: isActive ? 600 : 400, color: 'var(--text-primary)' }}>
                        {layer.name}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
                        {layer.category}
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn btn-ghost"
                    style={{ padding: '2px', color: isActive ? 'var(--color-forest)' : 'var(--text-tertiary)' }}
                  >
                    {isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Vegetation NDVI Time Slider if Vegetation layer active */}
          {activeLayers.vegetation && (
            <div style={{
              marginTop: '14px',
              padding: '10px',
              backgroundColor: 'var(--color-forest-bg)',
              border: '1px solid #CFDCD3',
              borderRadius: 'var(--radius-xs)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--color-forest)' }}>
                  NDVI Time Horizon
                </span>
                <span className="mono-text" style={{ fontSize: '0.72rem', color: 'var(--color-forest)', fontWeight: 600 }}>
                  {selectedYear}
                </span>
              </div>

              <input
                type="range"
                min={2022}
                max={2026}
                step={1}
                value={selectedYear}
                onChange={(e) => onYearChange(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-forest)' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                <span>2022</span>
                <span>2023</span>
                <span>2024</span>
                <span>2025</span>
                <span>2026</span>
              </div>

              <div style={{ marginTop: '8px', fontSize: '0.70rem', color: 'var(--text-secondary)' }}>
                <div>Mean NDVI: <strong>{currentVegData.meanNdvi}</strong></div>
                <div>Condition: <em>{currentVegData.status}</em></div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                  Source: Sentinel-2 / Landsat-8 composite
                </div>
              </div>
            </div>
          )}

          {/* Compact Scientific Legend */}
          <div style={{ marginTop: '14px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Risk Index Legend
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', fontSize: '0.66rem', textAlign: 'center' }}>
              <div style={{ padding: '3px 0', backgroundColor: '#E8F5E9', color: '#2E7D32', borderRadius: '2px' }}>Low</div>
              <div style={{ padding: '3px 0', backgroundColor: '#FFF8E1', color: '#F57F17', borderRadius: '2px' }}>Medium</div>
              <div style={{ padding: '3px 0', backgroundColor: '#FBE9E7', color: '#D84315', borderRadius: '2px' }}>High</div>
              <div style={{ padding: '3px 0', backgroundColor: '#FFEBEE', color: '#C62828', borderRadius: '2px' }}>Extreme</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
