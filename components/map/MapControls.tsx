'use client';

import React, { useState, useEffect } from 'react';
import { BasemapMode, ViewPreset } from '@/lib/types';
import {
  Compass,
  Maximize,
  Minimize,
  Plus,
  Minus,
  RotateCcw,
  Home,
  Crosshair,
  Layers,
  Box,
  Rotate3d,
} from 'lucide-react';

interface MapControlsProps {
  activePreset: ViewPreset;
  onSelectPreset: (preset: ViewPreset) => void;
  isWatershedMode?: boolean;
  onToggleWatershedMode?: () => void;
  onResetView: () => void;
  basemapMode: BasemapMode;
  onSelectBasemap: (mode: BasemapMode) => void;
  showHybridLabels?: boolean;
  onToggleHybridLabels?: () => void;
  show3DModels?: boolean;
  onToggle3DModels?: () => void;
  onOpenRaindropTool?: () => void;
  isRaindropToolOpen?: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({
  activePreset,
  onSelectPreset,
  onResetView,
  basemapMode,
  onSelectBasemap,
  showHybridLabels = true,
  onToggleHybridLabels,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const presets: { id: ViewPreset; label: string }[] = [
    { id: 'regional', label: 'Whole Basin' },
    { id: 'lake', label: 'Lake Pichola' },
    { id: 'watershed', label: 'Sajjangarh Ridge' },
    { id: 'agriculture', label: 'Nai Valley' },
  ];

  const handleZoomIn = () => {
    const viewer = typeof window !== 'undefined' ? (window as any).__cesiumViewer : null;
    if (viewer?.camera) {
      const height = viewer.camera.positionCartographic?.height || 5000;
      viewer.camera.zoomIn(Math.max(height * 0.35, 100));
    }
  };

  const handleZoomOut = () => {
    const viewer = typeof window !== 'undefined' ? (window as any).__cesiumViewer : null;
    if (viewer?.camera) {
      const height = viewer.camera.positionCartographic?.height || 5000;
      viewer.camera.zoomOut(Math.max(height * 0.35, 100));
    }
  };

  const handleResetOrientation = () => {
    const viewer = typeof window !== 'undefined' ? (window as any).__cesiumViewer : null;
    const Cesium = typeof window !== 'undefined' ? (window as any).Cesium : null;
    if (viewer?.camera && Cesium) {
      const currentPos = viewer.camera.positionCartographic;
      if (currentPos) {
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromRadians(currentPos.longitude, currentPos.latitude, currentPos.height),
          orientation: {
            heading: 0, // Reset directly to True North
            pitch: Cesium.Math.toRadians(-45),
            roll: 0,
          },
          duration: 0.8,
        });
      }
    }
  };

  const handleToggleTilt = () => {
    const viewer = typeof window !== 'undefined' ? (window as any).__cesiumViewer : null;
    const Cesium = typeof window !== 'undefined' ? (window as any).Cesium : null;
    if (viewer?.camera && Cesium) {
      const currentPos = viewer.camera.positionCartographic;
      if (currentPos) {
        const isPitchFlat = viewer.camera.pitch < Cesium.Math.toRadians(-70);
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromRadians(currentPos.longitude, currentPos.latitude, currentPos.height),
          orientation: {
            heading: viewer.camera.heading,
            pitch: isPitchFlat ? Cesium.Math.toRadians(-35) : Cesium.Math.toRadians(-85),
            roll: 0,
          },
          duration: 0.6,
        });
      }
    }
  };

  const handleToggleFullscreen = () => {
    if (typeof document !== 'undefined') {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <>
      {/* =========================================================================
          1. BOTTOM CENTER FLOATING TOOLBAR + SCALE BAR
          ========================================================================= */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          zIndex: 22,
          pointerEvents: 'none',
        }}
      >
        {/* Main Floating Capsule Toolbar */}
        <nav
          aria-label="Map Navigation & Presets"
          style={{
            pointerEvents: 'auto',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--fine-border)',
            borderRadius: '9999px',
            padding: '4px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.10)',
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        >
          {/* Location Shortcuts */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            {presets.map((p) => {
              const isSelected = activePreset === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPreset(p.id)}
                  className="apple-pressable"
                  style={{
                    background: isSelected ? 'var(--primary-forest)' : 'transparent',
                    color: isSelected ? '#FFFFFF' : 'var(--primary-text)',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '4px 11px',
                    fontSize: '0.73rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.12s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: isSelected ? '#FFFFFF' : 'var(--primary-forest)',
                    }}
                  />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Separator */}
          <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--fine-border)', margin: '0 2px' }} />

          {/* Basemaps: Satellite | Topography | Hybrid */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <button
              onClick={() => onSelectBasemap('satellite')}
              style={{
                background: basemapMode === 'satellite' ? 'var(--primary-forest)' : 'transparent',
                color: basemapMode === 'satellite' ? '#FFFFFF' : 'var(--primary-text)',
                border: 'none',
                borderRadius: '9999px',
                padding: '4px 9px',
                fontSize: '0.71rem',
                fontWeight: basemapMode === 'satellite' ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              Satellite
            </button>

            <button
              onClick={() => onSelectBasemap('topographic')}
              style={{
                background: basemapMode === 'topographic' ? 'var(--primary-forest)' : 'transparent',
                color: basemapMode === 'topographic' ? '#FFFFFF' : 'var(--primary-text)',
                border: 'none',
                borderRadius: '9999px',
                padding: '4px 9px',
                fontSize: '0.71rem',
                fontWeight: basemapMode === 'topographic' ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              Topography
            </button>

            <button
              onClick={() => onSelectBasemap('sentinel')}
              style={{
                background: basemapMode === 'sentinel' ? 'var(--primary-forest)' : 'transparent',
                color: basemapMode === 'sentinel' ? '#FFFFFF' : 'var(--primary-text)',
                border: 'none',
                borderRadius: '9999px',
                padding: '4px 9px',
                fontSize: '0.71rem',
                fontWeight: basemapMode === 'sentinel' ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              Hybrid
            </button>
          </div>

          {/* Labels Toggle Switch */}
          {onToggleHybridLabels && (
            <>
              <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--fine-border)', margin: '0 2px' }} />
              <div
                onClick={onToggleHybridLabels}
                className="apple-pressable"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  padding: '2px 6px',
                }}
              >
                <span style={{ fontSize: '0.71rem', fontWeight: 600, color: 'var(--primary-text)' }}>
                  Labels
                </span>
                <div
                  style={{
                    width: '26px',
                    height: '15px',
                    borderRadius: '9999px',
                    backgroundColor: showHybridLabels ? 'var(--primary-forest)' : '#D1D5DB',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: '11px',
                      height: '11px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      transform: showHybridLabels ? 'translateX(11px)' : 'translateX(0)',
                      transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Reset View */}
          <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--fine-border)', margin: '0 2px' }} />
          <button
            onClick={onResetView}
            className="apple-pressable"
            style={{
              background: 'transparent',
              color: 'var(--primary-text)',
              border: 'none',
              borderRadius: '9999px',
              padding: '4px 8px',
              fontSize: '0.71rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            title="Reset to default basin view"
          >
            <RotateCcw size={12} />
            <span>Reset View</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={handleToggleFullscreen}
            className="apple-pressable"
            style={{
              background: 'transparent',
              color: 'var(--primary-text)',
              border: 'none',
              borderRadius: '9999px',
              padding: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize size={13} /> : <Maximize size={13} />}
          </button>
        </nav>

        {/* 2 km Scale Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.62rem',
            color: '#FFFFFF',
            textShadow: '0 1px 3px rgba(0,0,0,0.8)',
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: '42px',
              height: '3px',
              borderLeft: '1px solid #FFFFFF',
              borderRight: '1px solid #FFFFFF',
              borderBottom: '2px solid #FFFFFF',
            }}
          />
          <span>2 km</span>
        </div>
      </div>

      {/* =========================================================================
          2. VERTICAL GIS TOOLS STRIP (RIGHT EDGE OF MAP)
          ========================================================================= */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          right: '372px', // Just to the left of Copilot inspector
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          zIndex: 22,
          userSelect: 'none',
        }}
      >
        {/* Circular Compass Rose */}
        <button
          onClick={handleResetOrientation}
          className="apple-pressable"
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--fine-border)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.10)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            position: 'relative',
          }}
          title="Reset Heading to North (0°)"
        >
          <div
            style={{
              width: '0',
              height: '0',
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderBottom: '9px solid #E53E3E', // Red North needle
              position: 'absolute',
              top: '6px',
            }}
          />
          <div
            style={{
              width: '0',
              height: '0',
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '9px solid #718096', // South needle
              position: 'absolute',
              bottom: '6px',
            }}
          />
        </button>

        {/* Vertical GIS Buttons Stack */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--fine-border)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.10)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            className="apple-pressable"
            style={{
              padding: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--primary-forest)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Zoom In"
          >
            <Plus size={15} />
          </button>

          <div style={{ height: '1px', backgroundColor: 'var(--fine-border)' }} />

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            className="apple-pressable"
            style={{
              padding: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--primary-forest)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Zoom Out"
          >
            <Minus size={15} />
          </button>

          <div style={{ height: '1px', backgroundColor: 'var(--fine-border)' }} />

          {/* Home / Return to Basin */}
          <button
            onClick={onResetView}
            className="apple-pressable"
            style={{
              padding: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--primary-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Default Basin View"
          >
            <Home size={14} />
          </button>

          <div style={{ height: '1px', backgroundColor: 'var(--fine-border)' }} />

          {/* Focus / Crosshair */}
          <button
            onClick={() => onSelectPreset('lake')}
            className="apple-pressable"
            style={{
              padding: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--primary-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Center on Pichola"
          >
            <Crosshair size={14} />
          </button>

          <div style={{ height: '1px', backgroundColor: 'var(--fine-border)' }} />

          {/* Layers shortcut */}
          <button
            onClick={() => onSelectPreset('watershed')}
            className="apple-pressable"
            style={{
              padding: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--primary-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Sajjangarh Ridge Focus"
          >
            <Layers size={14} />
          </button>

          <div style={{ height: '1px', backgroundColor: 'var(--fine-border)' }} />

          {/* 3D Cube / Perspective */}
          <button
            onClick={handleToggleTilt}
            className="apple-pressable"
            style={{
              padding: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--primary-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Toggle 3D Oblique Tilt"
          >
            <Box size={14} />
          </button>

          <div style={{ height: '1px', backgroundColor: 'var(--fine-border)' }} />

          {/* Rotate 3D */}
          <button
            onClick={handleResetOrientation}
            className="apple-pressable"
            style={{
              padding: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--primary-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Orient North"
          >
            <Rotate3d size={14} />
          </button>
        </div>
      </div>
    </>
  );
};
