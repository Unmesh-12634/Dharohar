'use client';

import React, { useState } from 'react';
import { LayerId } from '@/lib/types';
import {
  Layers,
  ChevronUp,
  ChevronDown,
  Search,
  MoreVertical,
} from 'lucide-react';

interface LayerPanelProps {
  activeLayers: Record<LayerId, boolean>;
  onToggleLayer: (id: LayerId) => void;
  selectedYear: number;
  onYearChange: (year: number) => void;
  className?: string;
}

interface LayerItem {
  id: LayerId;
  name: string;
  subname: string;
  color: string;
  category: 'terrain' | 'hydrology' | 'agri' | 'health';
}

interface LayerSection {
  title: string;
  category: 'terrain' | 'hydrology' | 'agri' | 'health';
  layers: LayerItem[];
}

const LAYER_SECTIONS: LayerSection[] = [
  {
    title: 'Terrain & Topography',
    category: 'terrain',
    layers: [
      { id: 'terrain', name: '3D Terrain & Relief', subname: 'Copernicus 30m DEM', color: '#1B2421', category: 'terrain' },
    ],
  },
  {
    title: 'Hydrology',
    category: 'hydrology',
    layers: [
      { id: 'waterBodies', name: 'Lakes & Reservoirs', subname: 'Lake Pichola, Fateh Sagar', color: '#1E4965', category: 'hydrology' },
      { id: 'watershed', name: 'Watershed Boundary', subname: 'Udaipur Catchment', color: '#2B4D3C', category: 'hydrology' },
      { id: 'drainage', name: 'Drainage Network', subname: 'Natural Streams & Gullies', color: '#288BA8', category: 'hydrology' },
      { id: 'conservation', name: 'Rivers & Streams', subname: 'Regional Hydrology', color: '#7EB1C9', category: 'hydrology' },
    ],
  },
  {
    title: 'Agriculture & Land Use',
    category: 'agri',
    layers: [
      { id: 'agriculture', name: 'Smallholder Farmland', subname: 'Terraces & Fields', color: '#527344', category: 'agri' },
      { id: 'infrastructure', name: 'Settlements & Bunds', subname: 'Villages & Infrastructure', color: '#68706B', category: 'agri' },
    ],
  },
  {
    title: 'Environmental Health',
    category: 'health',
    layers: [
      { id: 'vegetation', name: 'Vegetation Health (NDVI)', subname: 'Sentinel-2 Multispectral', color: '#25835A', category: 'health' },
      { id: 'soilErosion', name: 'Soil Erosion Risk', subname: 'Slope & Lithology', color: '#BD5637', category: 'health' },
      { id: 'runoffRisk', name: 'Runoff Velocity Risk', subname: 'Modelled Flow Paths', color: '#D47E38', category: 'health' },
    ],
  },
];

export const LayerPanel: React.FC<LayerPanelProps> = ({
  activeLayers,
  onToggleLayer,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'terrain' | 'hydrology'>('all');

  const allLayers = LAYER_SECTIONS.flatMap((s) => s.layers);
  const activeCount = allLayers.filter((l) => activeLayers[l.id]).length;

  if (isCollapsed) {
    return (
      <div style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 25 }}>
        <button
          onClick={() => setIsCollapsed(false)}
          className="apple-pressable"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 14px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--fine-border)',
            borderRadius: '9999px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            cursor: 'pointer',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--primary-forest)',
          }}
        >
          <Layers size={14} color="var(--primary-forest)" />
          <span>Layers ({activeCount})</span>
        </button>
      </div>
    );
  }

  return (
    <aside
      className="dharohar-layers-drawer"
      style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        width: '280px',
        maxHeight: 'calc(100% - 100px)',
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--fine-border)',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 6px 24px rgba(0, 0, 0, 0.09)',
        zIndex: 25,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 14px 10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(231, 221, 203, 0.6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={16} color="var(--primary-forest)" />
          <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-text)' }}>
            Environmental Layers ({activeCount} Active)
          </span>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary-text)', padding: '2px' }}
          title="Collapse Layers"
        >
          <ChevronUp size={16} />
        </button>
      </div>

      {/* Search Input */}
      <div style={{ padding: '8px 12px 6px 12px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            backgroundColor: '#F8F6F0',
            borderRadius: '6px',
            border: '1px solid var(--fine-border)',
          }}
        >
          <Search size={13} color="var(--secondary-text)" />
          <input
            type="text"
            placeholder="Search layers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '0.74rem',
              color: 'var(--primary-text)',
              width: '100%',
            }}
          />
        </div>
      </div>

      {/* Filter Category Pills */}
      <div
        style={{
          display: 'flex',
          gap: '5px',
          padding: '2px 12px 8px 12px',
          overflowX: 'auto',
          borderBottom: '1px solid rgba(231, 221, 203, 0.4)',
        }}
      >
        <button
          onClick={() => setFilterTab('all')}
          style={{
            padding: '3px 9px',
            fontSize: '0.69rem',
            fontWeight: filterTab === 'all' ? 700 : 500,
            borderRadius: '9999px',
            border: 'none',
            backgroundColor: filterTab === 'all' ? 'var(--primary-forest)' : '#F1EBDD',
            color: filterTab === 'all' ? '#FFFFFF' : 'var(--primary-text)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          All (10)
        </button>

        <button
          onClick={() => setFilterTab('active')}
          style={{
            padding: '3px 9px',
            fontSize: '0.69rem',
            fontWeight: filterTab === 'active' ? 700 : 500,
            borderRadius: '9999px',
            border: 'none',
            backgroundColor: filterTab === 'active' ? 'var(--primary-forest)' : '#F1EBDD',
            color: filterTab === 'active' ? '#FFFFFF' : 'var(--primary-text)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Active ({activeCount})
        </button>

        <button
          onClick={() => setFilterTab('terrain')}
          style={{
            padding: '3px 9px',
            fontSize: '0.69rem',
            fontWeight: filterTab === 'terrain' ? 700 : 500,
            borderRadius: '9999px',
            border: 'none',
            backgroundColor: filterTab === 'terrain' ? 'var(--primary-forest)' : '#F1EBDD',
            color: filterTab === 'terrain' ? '#FFFFFF' : 'var(--primary-text)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Terrain
        </button>

        <button
          onClick={() => setFilterTab('hydrology')}
          style={{
            padding: '3px 9px',
            fontSize: '0.69rem',
            fontWeight: filterTab === 'hydrology' ? 700 : 500,
            borderRadius: '9999px',
            border: 'none',
            backgroundColor: filterTab === 'hydrology' ? 'var(--primary-forest)' : '#F1EBDD',
            color: filterTab === 'hydrology' ? '#FFFFFF' : 'var(--primary-text)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Hydrology
        </button>
      </div>

      {/* Layer Groups List */}
      <div
        style={{
          padding: '8px 12px',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {LAYER_SECTIONS.map((section) => {
          const visibleLayers = section.layers.filter((layer) => {
            const matchesSearch =
              layer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              layer.subname.toLowerCase().includes(searchQuery.toLowerCase());
            if (!matchesSearch) return false;
            if (filterTab === 'active') return !!activeLayers[layer.id];
            if (filterTab === 'terrain') return layer.category === 'terrain';
            if (filterTab === 'hydrology') return layer.category === 'hydrology';
            return true;
          });

          if (visibleLayers.length === 0) return null;

          return (
            <div key={section.title}>
              {/* Section Title */}
              <div
                style={{
                  fontSize: '0.70rem',
                  fontWeight: 700,
                  color: 'var(--primary-text)',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>{section.title}</span>
                <ChevronUp size={13} color="var(--secondary-text)" />
              </div>

              {/* Layers List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {visibleLayers.map((layer) => {
                  const isActive = !!activeLayers[layer.id];

                  return (
                    <div
                      key={layer.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        backgroundColor: isActive ? 'rgba(23, 61, 45, 0.03)' : 'transparent',
                        transition: 'background-color 0.12s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = 'var(--surface-sandstone)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {/* Left: Swatch + Titles */}
                      <div
                        onClick={() => onToggleLayer(layer.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flex: 1, minWidth: 0 }}
                      >
                        <div
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '2px',
                            backgroundColor: layer.color,
                            flexShrink: 0,
                            opacity: isActive ? 1 : 0.4,
                          }}
                        />
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: isActive ? 600 : 500,
                              color: 'var(--primary-text)',
                              lineHeight: 1.25,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {layer.name}
                          </div>
                          <div
                            style={{
                              fontSize: '0.64rem',
                              color: 'var(--secondary-text)',
                              lineHeight: 1.2,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {layer.subname}
                          </div>
                        </div>
                      </div>

                      {/* Right: iOS-Style Toggle Switch + More dots */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        <div
                          onClick={() => onToggleLayer(layer.id)}
                          style={{
                            width: '28px',
                            height: '16px',
                            borderRadius: '9999px',
                            backgroundColor: isActive ? '#25835A' : '#D1D5DB',
                            padding: '2px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <div
                            style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              backgroundColor: '#FFFFFF',
                              transform: isActive ? 'translateX(12px)' : 'translateX(0)',
                              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                            }}
                          />
                        </div>

                        <button
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--secondary-text)',
                            padding: '2px',
                            opacity: 0.6,
                          }}
                          title="Layer Options"
                        >
                          <MoreVertical size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
