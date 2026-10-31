'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export const MapLegend: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="apple-pressable"
        style={{
          position: 'absolute',
          bottom: '78px',
          left: '304px',
          zIndex: 22,
          padding: '5px 12px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--fine-border)',
          borderRadius: '9999px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          fontSize: '0.72rem',
          fontWeight: 700,
          color: 'var(--primary-text)',
          cursor: 'pointer',
        }}
      >
        Map Legend
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '78px',
        left: '304px',
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--fine-border)',
        borderRadius: 'var(--radius-sm)',
        padding: '10px 12px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
        zIndex: 22,
        width: '180px',
        userSelect: 'none',
      }}
    >
      {/* Header */}
      <div
        onClick={() => setIsCollapsed(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          marginBottom: '8px',
          paddingBottom: '4px',
          borderBottom: '1px solid rgba(231, 221, 203, 0.5)',
        }}
      >
        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--primary-text)' }}>
          Map Legend
        </span>
        <ChevronUp size={14} color="var(--secondary-text)" />
      </div>

      {/* Legend Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.69rem', color: 'var(--primary-text)' }}>
        {/* Watershed Boundary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '18px', borderTop: '2px dashed #2B4D3C' }} />
          <span>Watershed Boundary</span>
        </div>

        {/* Rivers & Streams */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '18px', height: '2px', backgroundColor: '#288BA8' }} />
          <span>Rivers & Streams</span>
        </div>

        {/* Lakes & Reservoirs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '9px', backgroundColor: '#1E4965', borderRadius: '1px' }} />
          <span>Lakes & Reservoirs</span>
        </div>

        {/* Farm Clusters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#527344' }} />
          <span>Farm Clusters</span>
        </div>

        {/* Dredging Sites */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#347FB3' }} />
          <span>Dredging Sites</span>
        </div>

        {/* Transport Routes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '18px', borderTop: '2px dashed #C88732' }} />
          <span>Transport Routes</span>
        </div>
      </div>
    </div>
  );
};
