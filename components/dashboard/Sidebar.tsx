'use client';

import React from 'react';
import {
  Home,
  Layers,
  ShieldCheck,
  TrendingUp,
  Users,
  FileText,
  Map,
  Mountain,
  Waves,
  Anchor,
  Sprout,
  Truck,
  AlertTriangle,
  LayoutGrid,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { LayerId } from '@/lib/types';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onOpenSettings?: () => void;
  activeLayers?: Record<LayerId, boolean>;
  onToggleLayer?: (id: LayerId) => void;
  onScrollToSection?: (sectionId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  onOpenSettings,
  activeLayers,
  onToggleLayer,
  onScrollToSection,
}) => {
  const primaryNav = [
    { id: 'overview', label: 'Overview & Story', icon: Home, view: 'overview' },
    { id: 'map', label: '3D Watershed Twin', icon: Layers, view: 'map' },
    { id: 'silt-loop', label: 'Action Lab (Solutions)', icon: ShieldCheck, view: 'silt-loop' },
    { id: 'intelligence', label: 'Watershed Intelligence', icon: TrendingUp, view: 'trace' },
    { id: 'stakeholders', label: 'Stakeholder Matrix', icon: Users, sectionId: 'section-stakeholders' },
    { id: 'reports', label: 'Reports & Insights', icon: FileText, view: 'interventions' },
  ];

  const mapLayers = [
    { id: 'layers', label: 'Map Layers', icon: Layers, layerId: 'watershed' as LayerId },
    { id: 'basemap', label: 'Base Map', icon: Map, layerId: 'terrain' as LayerId },
    { id: 'terrain', label: 'Terrain (3D)', icon: Mountain, layerId: 'terrain' as LayerId },
    { id: 'water', label: 'Rivers & Lakes', icon: Waves, layerId: 'lakes' as LayerId },
    { id: 'dredging', label: 'Dredging Sites', icon: Anchor, layerId: 'drainage' as LayerId },
    { id: 'farms', label: 'Farm Clusters', icon: Sprout, layerId: 'farmland' as LayerId },
    { id: 'routes', label: 'Transport Routes', icon: Truck, layerId: 'settlements' as LayerId },
    { id: 'soil', label: 'Soil Deficiency', icon: AlertTriangle, layerId: 'soilErosion' as LayerId },
    { id: 'landuse', label: 'Land Use', icon: LayoutGrid, layerId: 'vegetation' as LayerId },
  ];

  const handleNavClick = (item: typeof primaryNav[0]) => {
    if (item.view) {
      onViewChange(item.view);
    } else if (item.sectionId) {
      if (currentView !== 'overview') {
        onViewChange('overview');
        setTimeout(() => {
          const el = document.getElementById(item.sectionId!);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById(item.sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <aside
      className="dharohar-sidebar"
      style={{
        width: '195px',
        minWidth: '195px',
        maxWidth: '195px',
        backgroundColor: 'var(--bg-warm-ivory)',
        borderRight: '1px solid var(--fine-border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 10px',
        userSelect: 'none',
        height: '100%',
        overflowY: 'auto',
        zIndex: 20,
        flexShrink: 0,
      }}
    >
      <div>
        {/* Primary Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const isActive =
              (item.id === 'overview' && currentView === 'overview') ||
              (item.id === 'map' && currentView === 'map') ||
              (item.id === 'silt-loop' && ['silt-loop', 'water-credits', 'heritage-crops'].includes(currentView)) ||
              (item.id === 'reports' && currentView === 'interventions');

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '7px 11px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#FFFFFF' : 'var(--primary-text)',
                  backgroundColor: isActive ? 'var(--primary-forest)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'var(--surface-sandstone)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Icon size={15} color={isActive ? '#FFFFFF' : 'var(--primary-forest)'} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            backgroundColor: 'var(--fine-border)',
            margin: '14px 6px',
            opacity: 0.8,
          }}
        />

        {/* Map Layers Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {mapLayers.map((layer) => {
            const Icon = layer.icon;
            const isLayerActive = activeLayers ? activeLayers[layer.layerId] : false;

            return (
              <button
                key={layer.id}
                onClick={() => {
                  if (onToggleLayer) {
                    onToggleLayer(layer.layerId);
                  }
                  if (currentView !== 'map') {
                    onViewChange('map');
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '6px 11px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.76rem',
                  fontWeight: 500,
                  color: 'var(--secondary-text)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-sandstone)';
                  e.currentTarget.style.color = 'var(--primary-text)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--secondary-text)';
                }}
                title={`Toggle ${layer.label} in 3D Map`}
              >
                <Icon size={14} color="var(--secondary-sage)" />
                <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {layer.label}
                </span>
                {isLayerActive && (
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--status-positive)',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Section */}
      <div style={{ marginTop: '16px' }}>
        <div
          style={{
            height: '1px',
            backgroundColor: 'var(--fine-border)',
            margin: '0 6px 12px 6px',
            opacity: 0.8,
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <button
            onClick={onOpenSettings}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 11px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.76rem',
              fontWeight: 500,
              color: 'var(--secondary-text)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-sandstone)';
              e.currentTarget.style.color = 'var(--primary-text)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--secondary-text)';
            }}
          >
            <Settings size={14} color="var(--secondary-sage)" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('section-hero');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 11px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.76rem',
              fontWeight: 500,
              color: 'var(--secondary-text)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-sandstone)';
              e.currentTarget.style.color = 'var(--primary-text)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--secondary-text)';
            }}
          >
            <HelpCircle size={14} color="var(--secondary-sage)" />
            <span>Help & Guide</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
