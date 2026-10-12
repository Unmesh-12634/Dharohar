'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { CesiumMap } from '@/components/map/CesiumMap';
import { LayerPanel } from '@/components/map/LayerPanel';
import { MapControls } from '@/components/map/MapControls';
import { AravalliCopilot } from '@/components/copilot/AravalliCopilot';
import { RainSimulationModal } from '@/components/simulation/RainSimulationModal';
import { MonsoonSimulatorView } from '@/components/simulation/MonsoonSimulatorView';
import { InterventionPlanner } from '@/components/interventions/InterventionPlanner';
import { CauseEffectExplorer } from '@/components/explorer/CauseEffectExplorer';
import { SatelliteChangeDetector } from '@/components/satellite/SatelliteChangeDetector';
import { FieldActionNetwork } from '@/components/field/FieldActionNetwork';
import { OverviewView } from '@/components/dashboard/OverviewView';
import { EarthHealthView } from '@/components/dashboard/EarthHealthView';
import { FutureLabView } from '@/components/dashboard/FutureLabView';
import { ImpactView } from '@/components/dashboard/ImpactView';
import { FarmIntelligenceView } from '@/components/dashboard/FarmIntelligenceView';
import { ApiKeyModal } from '@/components/settings/ApiKeyModal';
import {
  VirtualRaindropTool,
  RaindropScenario,
  RaindropTracePoint,
  RAINDROP_SCENARIOS,
} from '@/components/tools/VirtualRaindropTool';
import { DEFAULT_INTERVENTIONS, DEFAULT_LAYERS } from '@/lib/geo-data';
import {
  BasemapMode,
  FieldMission,
  Intervention,
  LayerId,
  SatelliteDegradationZone,
  SimulationResult,
  TraceStep,
  ViewPreset,
} from '@/lib/types';
import { runHydrologicalSimulation } from '@/lib/simulation-engine';
import {
  Bot,
  CloudRain,
  Columns,
  Compass,
  Crosshair,
  Droplets,
  GitCommit,
  Info,
  Layers,
  MapPin,
  Maximize2,
  Minimize2,
  PanelLeft,
  Satellite,
  ShieldCheck,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<string>('map');
  const [panelMode, setPanelMode] = useState<'docked' | 'split' | 'fullscreen'>('docked');
  const [activePreset, setActivePreset] = useState<ViewPreset>('udaipur');
  const [isWatershedMode, setIsWatershedMode] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [basemapMode, setBasemapMode] = useState<BasemapMode>('satellite');
  const [flyToTarget, setFlyToTarget] = useState<{ latitude: number; longitude: number; height?: number } | null>(null);
  const [showHybridLabels, setShowHybridLabels] = useState<boolean>(true);
  const [show3DModels, setShow3DModels] = useState<boolean>(true);

  // Virtual Raindrop 3D flow simulator state
  const [isRaindropToolOpen, setIsRaindropToolOpen] = useState(false);
  const [activeRaindropScenario, setActiveRaindropScenario] = useState<RaindropScenario | null>(null);
  const [activeRaindropStep, setActiveRaindropStep] = useState<RaindropTracePoint | null>(null);

  // Layer state
  const [activeLayers, setActiveLayers] = useState<Record<LayerId, boolean>>(() => {
    const map: any = {};
    DEFAULT_LAYERS.forEach((l) => {
      map[l.id] = l.active;
    });
    return map;
  });

  // Interventions state
  const [activeInterventions, setActiveInterventions] = useState<Intervention[]>([
    DEFAULT_INTERVENTIONS[0], // Check dam CD-01
  ]);

  // Simulation state
  const [isSimulationModalOpen, setIsSimulationModalOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  // Feature inspector state
  const [selectedFeature, setSelectedFeature] = useState<any | null>(null);

  // Copilot state
  const [isCopilotOpen, setIsCopilotOpen] = useState(true);

  // Settings & Keys state
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [googleMapsKey, setGoogleMapsKey] = useState<string>('');
  const [geminiKey, setGeminiKey] = useState<string>('');
  const [is3DTilesActive, setIs3DTilesActive] = useState<boolean>(false);

  // Load keys from localStorage on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedGoogle = localStorage.getItem('aravalli_google_maps_key') || '';
      const savedGemini = localStorage.getItem('aravalli_gemini_key') || '';
      if (savedGoogle) setGoogleMapsKey(savedGoogle);
      if (savedGemini) setGeminiKey(savedGemini);
    }
  }, []);

  const handleSaveKeys = (google: string, gemini: string) => {
    setGoogleMapsKey(google);
    setGeminiKey(gemini);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aravalli_google_maps_key', google);
      localStorage.setItem('aravalli_gemini_key', gemini);
    }
  };

  // Toggle specific environmental layer
  const handleToggleLayer = (id: LayerId) => {
    setActiveLayers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Toggle Watershed Mode
  const handleToggleWatershedMode = () => {
    const nextState = !isWatershedMode;
    setIsWatershedMode(nextState);

    if (nextState) {
      setActiveLayers((prev) => ({
        ...prev,
        watershed: true,
        drainage: true,
        waterBodies: true,
      }));
      setActivePreset('watershed');
    }
  };

  // Toggle Intervention
  const handleToggleIntervention = (item: Intervention) => {
    if (activeInterventions.some((x) => x.id === item.id)) {
      setActiveInterventions(activeInterventions.filter((x) => x.id !== item.id));
    } else {
      setActiveInterventions([...activeInterventions, item]);
    }
  };

  // Handle Simulation execution
  const handleSimulationComplete = (result: SimulationResult, simulating: boolean) => {
    setSimulationResult(result);
    setIsSimulating(simulating);
    setIsSimulationModalOpen(false);

    // If simulating, ensure drainage network is highlighted and map is shown
    if (simulating) {
      setActiveLayers((prev) => ({
        ...prev,
        drainage: true,
        waterBodies: true,
      }));
      setCurrentView('map');
      setActivePreset('watershed');

      // Auto revert intense flow pulses after 12 seconds
      setTimeout(() => {
        setIsSimulating(false);
      }, 12000);
    }
  };

  // Dynamic Field Missions & Trace State
  const [dispatchedMissions, setDispatchedMissions] = useState<FieldMission[]>([]);
  const [selectedLakeTraceId, setSelectedLakeTraceId] = useState<string>('pichola');

  // Handle fly to arbitrary coordinates from any view
  const handleFlyToCoords = (coords: { latitude: number; longitude: number; height?: number }) => {
    setFlyToTarget({
      latitude: coords.latitude,
      longitude: coords.longitude,
      height: coords.height || 1800,
    });
    setCurrentView('map');
  };

  // Dispatch satellite anomaly into Field Action Network
  const handleDispatchFieldMission = (zone: SatelliteDegradationZone) => {
    const newMission: FieldMission = {
      id: `MSN-${Date.now().toString().slice(-4)}`,
      title: `${zone.name} Physical Ground Audit`,
      degradationZoneId: zone.id,
      priority: zone.priority,
      status: 'PENDING_INSPECTION',
      gramPanchayat: zone.location.split('(')[0].replace('Gram Panchayat', '').trim(),
      village: zone.location,
      assignedTo: 'Assigned to Block Watershed Team',
      targetCoordinates: {
        latitude: zone.latitude,
        longitude: zone.longitude,
        elevationM: zone.elevationM,
      },
      flaggedReason: `Satellite detector identified ${zone.spectralIndicator} with -${zone.historicalLossPct}% change score.`,
      satelliteEvidence: `Sentinel-2 multi-spectral composite score: ${zone.currentScore.toFixed(2)}. ${zone.notes}`,
      requiredMeasurements: [
        'Survey active gully headcut migration rate',
        'Inspect soil crusting and infiltration rate',
        'Consult adjacent plot farmers regarding monsoon runoff direction',
        'Record GPS point for proposed stone check dam or contour bund',
      ],
      suggestedAction: 'Deploy loose stone gully plug and vetiver grass vegetative barrier.',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setDispatchedMissions((prev) => [newMission, ...prev]);
    setCurrentView('field-action');
  };

  // Handle lake trace selection
  const handleSelectLakeTrace = (lakeId: string) => {
    setSelectedLakeTraceId(lakeId);
    if (lakeId === 'pichola') {
      setFlyToTarget({ latitude: 24.5765, longitude: 73.6795, height: 2600 });
    } else if (lakeId === 'fatehsagar') {
      setFlyToTarget({ latitude: 24.6047, longitude: 73.6738, height: 2600 });
    } else if (lakeId === 'badi') {
      setFlyToTarget({ latitude: 24.6225, longitude: 73.6265, height: 2400 });
    }
  };

  // Handle fly to spatial trace step
  const handleFlyToStep = (step: TraceStep) => {
    setSelectedFeature({
      name: step.title,
      localName: step.locationName,
      latitude: step.latitude,
      longitude: step.longitude,
      type: 'TRACE_STEP',
      description: `${step.phenomenon} • Physical process: ${step.physicalProcess}.`,
      historicalFact: `Impact cascade consequence: ${step.consequence}.`,
      agencySource: 'Hydro-Geological Survey of Udaipur Basin',
    });
    setFlyToTarget({
      latitude: step.latitude,
      longitude: step.longitude,
      height: step.height || 2200,
    });
    setCurrentView('map');
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-primary)',
      overflow: 'hidden',
    }}>
      {/* Top Navigation & Status Bar */}
      <Header
        currentView={currentView}
        onViewChange={(v) => setCurrentView(v)}
        onOpenSimulation={() => setIsSimulationModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        is3DTilesActive={is3DTilesActive}
        activeInterventionsCount={activeInterventions.length}
        basemapMode={basemapMode}
        onOpenRaindrop={() => {
          setIsRaindropToolOpen((prev) => !prev);
          if (!activeRaindropScenario) {
            setActiveRaindropScenario(RAINDROP_SCENARIOS[0]);
            setActiveRaindropStep(RAINDROP_SCENARIOS[0].path[0]);
          }
        }}
      />

      {/* Main View Area */}
      <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* 3D Digital Twin Map View - Always persistently active */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          visibility: 'visible',
          zIndex: 1,
        }}>
          <CesiumMap
            activeLayers={activeLayers}
            activePreset={activePreset}
            onSelectFeature={(feat) => setSelectedFeature(feat)}
            activeInterventions={activeInterventions}
            simulationResult={simulationResult}
            isSimulating={isSimulating}
            googleMapsApiKey={googleMapsKey}
            onApiKeyMissing={() => setIsSettingsModalOpen(true)}
            onTilesStatusChange={(active) => setIs3DTilesActive(active)}
            basemapMode={basemapMode}
            flyToTarget={flyToTarget}
            showHybridLabels={showHybridLabels}
            show3DModels={show3DModels}
            activeRaindropTrace={activeRaindropScenario}
            activeRaindropStep={activeRaindropStep}
          />

          {/* Quick HUD Launchpad when exploring 3D Map */}
          {currentView === 'map' && (
            <div style={{
              position: 'absolute',
              top: '16px',
              right: isCopilotOpen ? '375px' : '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: 'rgba(253, 251, 247, 0.96)',
              backdropFilter: 'blur(16px)',
              border: '1.5px solid var(--border-gold)',
              borderRadius: 'var(--radius-sm)',
              padding: '4px 10px',
              boxShadow: 'var(--shadow-mewar)',
              zIndex: 25,
              transition: 'right 0.25s ease',
            }}>
              <span style={{ fontSize: '0.67rem', fontWeight: 700, color: 'var(--mewar-gold-dark)', textTransform: 'uppercase', marginRight: '4px', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span>✦</span>
                <span>मेवाड़ हब:</span>
              </span>
              <button
                onClick={() => {
                  setIsRaindropToolOpen((prev) => !prev);
                  if (!activeRaindropScenario) {
                    setActiveRaindropScenario(RAINDROP_SCENARIOS[0]);
                    setActiveRaindropStep(RAINDROP_SCENARIOS[0].path[0]);
                  }
                }}
                className={`btn apple-pressable ${isRaindropToolOpen ? 'btn-terracotta' : 'btn-ghost'}`}
                style={{ padding: '3px 8px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                title="Launch Virtual Raindrop 3D Particle Tracer (D8 Gravity Downhill Flow)"
              >
                <Droplets size={12} color={isRaindropToolOpen ? '#FFFFFF' : 'var(--mewar-lake)'} />
                जल प्रवाह
              </button>
              <button
                onClick={() => { setCurrentView('trace'); setPanelMode('docked'); }}
                className="btn btn-ghost apple-pressable"
                style={{ padding: '3px 8px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                title="Open 3D Upstream Landscape Tracer"
              >
                <GitCommit size={12} color="var(--color-terracotta)" />
                प्रवाह अनुरेखक
              </button>
              <button
                onClick={() => { setCurrentView('simulation'); setPanelMode('docked'); }}
                className="btn btn-ghost apple-pressable"
                style={{ padding: '3px 8px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                title="Open Monsoon Runoff Simulator"
              >
                <CloudRain size={12} color="var(--mewar-lake)" />
                मानसून सिमुलेशन
              </button>
              <button
                onClick={() => { setCurrentView('satellite'); setPanelMode('docked'); }}
                className="btn btn-ghost apple-pressable"
                style={{ padding: '3px 8px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                title="Open Sentinel-2 Satellite Change Scrubber"
              >
                <Satellite size={12} color="var(--color-forest)" />
                उपग्रह संवेदक
              </button>
              <button
                onClick={() => { setCurrentView('interventions'); setPanelMode('docked'); }}
                className="btn btn-ghost apple-pressable"
                style={{ padding: '3px 8px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                title="Open Conservation Intervention Lab"
              >
                <ShieldCheck size={12} color="var(--mewar-gold)" />
                संरक्षण योजना
              </button>
              <button
                onClick={() => { setCurrentView('field-action'); setPanelMode('docked'); }}
                className="btn btn-ghost apple-pressable"
                style={{ padding: '3px 8px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                title="Open Field Action Network & Ground Verification"
              >
                <UserCheck size={12} color="var(--color-terracotta)" />
                ग्राम निरीक्षण
              </button>
            </div>
          )}

          {/* Floating Layers Panel on Left */}
          {currentView === 'map' && (
            <LayerPanel
              activeLayers={activeLayers}
              onToggleLayer={handleToggleLayer}
              selectedYear={selectedYear}
              onYearChange={(y) => setSelectedYear(y)}
            />
          )}

          {/* Floating Navigation, Camera Controls & Basemap Switcher at Bottom */}
          {(currentView === 'map' || panelMode === 'docked') && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: currentView !== 'map' && panelMode === 'docked' ? 'min(680px, 94vw)' : 0,
              right: 0,
              pointerEvents: 'none',
              zIndex: 22,
            }}>
              <div style={{ pointerEvents: 'auto' }}>
                <MapControls
                  activePreset={activePreset}
                  onSelectPreset={(p) => setActivePreset(p)}
                  isWatershedMode={isWatershedMode}
                  onToggleWatershedMode={handleToggleWatershedMode}
                  onResetView={() => setActivePreset('regional')}
                  basemapMode={basemapMode}
                  onSelectBasemap={(b) => setBasemapMode(b)}
                  showHybridLabels={showHybridLabels}
                  onToggleHybridLabels={() => setShowHybridLabels((prev) => !prev)}
                  show3DModels={show3DModels}
                  onToggle3DModels={() => setShow3DModels((prev) => !prev)}
                  onOpenRaindropTool={() => {
                    setIsRaindropToolOpen((prev) => !prev);
                    if (!activeRaindropScenario) {
                      setActiveRaindropScenario(RAINDROP_SCENARIOS[0]);
                      setActiveRaindropStep(RAINDROP_SCENARIOS[0].path[0]);
                    }
                  }}
                  isRaindropToolOpen={isRaindropToolOpen}
                />
              </div>
            </div>
          )}

          {/* Dockable Aravalli Copilot AI on Right */}
          <AravalliCopilot
            isOpen={isCopilotOpen}
            onToggle={() => setIsCopilotOpen(!isCopilotOpen)}
            selectedFeature={selectedFeature}
            simulationResult={simulationResult}
            activeLayers={activeLayers}
            apiKey={geminiKey}
          />

          {/* Editorial Geospatial Intelligence Dossier Drawer */}
          {selectedFeature && (
            <div style={{
              position: 'absolute',
              bottom: '84px',
              left: '18px',
              width: '390px',
              maxHeight: 'calc(100vh - 160px)',
              overflowY: 'auto',
              backgroundColor: 'rgba(255, 255, 255, 0.97)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-card)',
              padding: '16px 18px',
              zIndex: 35,
              backdropFilter: 'blur(12px)',
            }}>
              {/* Drawer Top Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="badge badge-modeled" style={{ textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.04em' }}>
                    {selectedFeature.type === 'LAKE'
                      ? '🌊 Water Reservoir'
                      : selectedFeature.type === 'LANDMARK'
                      ? '⛰️ Aravalli Landmark'
                      : selectedFeature.type === 'RISK_ZONE'
                      ? '⚠️ Environmental Risk'
                      : selectedFeature.type === 'FARM'
                      ? '🌾 Smallholder Farm'
                      : selectedFeature.type === 'INTERVENTION'
                      ? '🛡️ Engineered Buffer'
                      : selectedFeature.type || 'GEOSPATIAL NODE'}
                  </span>
                  <span className="mono-text" style={{ fontSize: '0.66rem', color: 'var(--text-tertiary)' }}>
                    {selectedFeature.dataSource || 'OBSERVED'}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="btn btn-ghost"
                  style={{ padding: '3px', borderRadius: '50%' }}
                  title="Close Inspector"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Title & Local Hindi Name */}
              <div style={{ marginBottom: '8px' }}>
                <h3 className="serif-title" style={{ fontSize: '1.18rem', color: 'var(--text-primary)', lineHeight: 1.25, margin: 0 }}>
                  {selectedFeature.name}
                </h3>
                {selectedFeature.localName && (
                  <p style={{ fontSize: '0.80rem', color: 'var(--color-terracotta)', fontWeight: 500, margin: '2px 0 0 0' }}>
                    {selectedFeature.localName}
                  </p>
                )}
              </div>

              {/* Spatial Coordinates & Altitude Strip */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                marginBottom: '12px',
                fontSize: '0.70rem',
                color: 'var(--text-secondary)',
              }}>
                <span style={{ backgroundColor: 'var(--bg-secondary)', padding: '2px 7px', borderRadius: '3px' }}>
                  📍 {selectedFeature.latitude?.toFixed(4)}° N, {selectedFeature.longitude?.toFixed(4)}° E
                </span>
                {selectedFeature.elevationMeters && (
                  <span style={{ backgroundColor: 'var(--bg-secondary)', padding: '2px 7px', borderRadius: '3px' }}>
                    ▲ {selectedFeature.elevationMeters}m MSL
                  </span>
                )}
                {selectedFeature.catchmentSqKm && (
                  <span style={{ backgroundColor: 'var(--bg-secondary)', padding: '2px 7px', borderRadius: '3px' }}>
                    💧 Catchment: {selectedFeature.catchmentSqKm} km²
                  </span>
                )}
              </div>

              {/* Real Telemetry Metrics Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                marginBottom: '12px',
              }}>
                {/* Metric 1 */}
                {selectedFeature.currentStoragePercent !== undefined && (
                  <div style={{ backgroundColor: '#F0F6FA', padding: '8px 10px', borderRadius: '4px', border: '1px solid rgba(36, 88, 118, 0.15)' }}>
                    <div style={{ fontSize: '0.66rem', color: 'var(--color-lake)', textTransform: 'uppercase', fontWeight: 600 }}>Live Storage</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-lake)' }}>
                      {selectedFeature.currentStoragePercent}%
                    </div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-tertiary)' }}>{selectedFeature.capacityMcm} MCM Cap.</div>
                  </div>
                )}

                {selectedFeature.soilLossRateTonHaYear !== undefined && (
                  <div style={{ backgroundColor: '#FDF3EE', padding: '8px 10px', borderRadius: '4px', border: '1px solid rgba(189, 86, 55, 0.2)' }}>
                    <div style={{ fontSize: '0.66rem', color: 'var(--color-terracotta)', textTransform: 'uppercase', fontWeight: 600 }}>USLE Soil Loss</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-terracotta)' }}>
                      {selectedFeature.soilLossRateTonHaYear} <span style={{ fontSize: '0.66rem', fontWeight: 400 }}>t/ha/yr</span>
                    </div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-tertiary)' }}>Tolerable: &lt;7.5 t/ha/yr</div>
                  </div>
                )}

                {/* Metric 2: Canopy or Soil */}
                {selectedFeature.fsiCanopyCoverPercent !== undefined && (
                  <div style={{ backgroundColor: '#F1F7F2', padding: '8px 10px', borderRadius: '4px', border: '1px solid rgba(30, 58, 43, 0.15)' }}>
                    <div style={{ fontSize: '0.66rem', color: 'var(--color-forest)', textTransform: 'uppercase', fontWeight: 600 }}>FSI Canopy Cover</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-forest)' }}>
                      {selectedFeature.fsiCanopyCoverPercent}%
                    </div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-tertiary)' }}>Forest Survey of India</div>
                  </div>
                )}

                {selectedFeature.ndviScore !== undefined && (
                  <div style={{ backgroundColor: '#F1F7F2', padding: '8px 10px', borderRadius: '4px', border: '1px solid rgba(30, 58, 43, 0.15)' }}>
                    <div style={{ fontSize: '0.66rem', color: 'var(--color-forest)', textTransform: 'uppercase', fontWeight: 600 }}>NDVI Vigor</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-forest)' }}>
                      {selectedFeature.ndviScore}
                    </div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-tertiary)' }}>Area: {selectedFeature.areaHa} ha</div>
                  </div>
                )}

                {/* Metric 3: Groundwater / Aquifer Stress */}
                {selectedFeature.cgwbAquiferStatus && (
                  <div style={{ backgroundColor: '#F8F6F0', padding: '8px 10px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Groundwater CGWB</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: selectedFeature.cgwbAquiferStatus === 'Over-Exploited' ? 'var(--color-terracotta)' : selectedFeature.cgwbAquiferStatus === 'Critical' ? '#D47E38' : 'var(--color-forest)' }}>
                      {selectedFeature.cgwbAquiferStatus}
                    </div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-tertiary)' }}>Hard Rock Aquifer</div>
                  </div>
                )}

                {/* Metric 4: Inflows or Slope */}
                {selectedFeature.slopeDegree !== undefined && (
                  <div style={{ backgroundColor: '#F8F6F0', padding: '8px 10px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Slope Gradient</div>
                    <div style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {selectedFeature.slopeDegree}°
                    </div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-tertiary)' }}>Vegetation Deficit: {selectedFeature.vegetationDeficit}%</div>
                  </div>
                )}

                {selectedFeature.runoffReductionPercent !== undefined && (
                  <div style={{ backgroundColor: '#FAF6ED', padding: '8px 10px', borderRadius: '4px', border: '1px solid rgba(191, 160, 84, 0.3)' }}>
                    <div style={{ fontSize: '0.66rem', color: '#8A6E3D', textTransform: 'uppercase', fontWeight: 600 }}>Runoff Mitigation</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#8A6E3D' }}>
                      -{selectedFeature.runoffReductionPercent}%
                    </div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--text-tertiary)' }}>Est: {selectedFeature.estimatedCostInr}</div>
                  </div>
                )}
              </div>

              {/* Physical Diagnostics Narrative */}
              <div style={{ marginBottom: '10px' }}>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {selectedFeature.description || selectedFeature.ecologicalRole || 'Monitored geospatial observation node within Udaipur pilot catchment.'}
                </p>
              </div>

              {/* Heritage Fact / History */}
              {selectedFeature.historicalFact && (
                <div style={{
                  backgroundColor: '#FAF7F2',
                  borderLeft: '3px solid var(--color-sandstone)',
                  padding: '7px 10px',
                  borderRadius: '0 4px 4px 0',
                  marginBottom: '10px',
                  fontSize: '0.72rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.45,
                }}>
                  <strong style={{ color: 'var(--color-sandstone)', textTransform: 'uppercase', fontSize: '0.65rem' }}>Heritage & Context: </strong>
                  {selectedFeature.historicalFact}
                </div>
              )}

              {/* Recommended Conservation Action */}
              {(selectedFeature.suggestedAction || selectedFeature.recommendedConservation) && (
                <div style={{
                  backgroundColor: 'var(--color-forest-bg)',
                  border: '1px solid rgba(30, 58, 43, 0.15)',
                  padding: '8px 10px',
                  borderRadius: '4px',
                  marginBottom: '12px',
                  fontSize: '0.73rem',
                  color: 'var(--color-forest)',
                  lineHeight: 1.45,
                }}>
                  <strong style={{ textTransform: 'uppercase', fontSize: '0.65rem', display: 'block', marginBottom: '2px' }}>
                    Conservation Directive (Panchayat / Forest Dept):
                  </strong>
                  {selectedFeature.suggestedAction || selectedFeature.recommendedConservation}
                </div>
              )}

              {/* Agency Source attribution */}
              {selectedFeature.agencySource && (
                <div className="mono-text" style={{ fontSize: '0.64rem', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
                  Source: {selectedFeature.agencySource}
                </div>
              )}

              {/* Interactive Action Buttons Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => setIsCopilotOpen(true)}
                  className="btn btn-secondary"
                  style={{ flex: 1, fontSize: '0.74rem', padding: '6px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                >
                  <Bot size={13} />
                  Ask Copilot
                </button>

                <button
                  onClick={() => setIsSimulationModalOpen(true)}
                  className="btn btn-terracotta"
                  style={{ flex: 1, fontSize: '0.74rem', padding: '6px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                >
                  <CloudRain size={13} />
                  Simulate Rain
                </button>

                <button
                  onClick={() => setFlyToTarget({ latitude: selectedFeature.latitude, longitude: selectedFeature.longitude, height: 1900 })}
                  className="btn btn-ghost"
                  style={{ fontSize: '0.74rem', padding: '6px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  title="Fly 3D Camera directly to site"
                >
                  <Crosshair size={13} />
                  Focus
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Adaptive Tactical HUD Panel */}
        {currentView !== 'map' && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: panelMode === 'fullscreen' ? '100%' : panelMode === 'split' ? '50%' : 'min(720px, 94vw)',
            bottom: 0,
            overflowY: 'hidden',
            backgroundColor: panelMode === 'fullscreen' ? 'var(--bg-primary)' : 'rgba(250, 249, 246, 0.96)',
            backdropFilter: 'blur(16px)',
            borderRight: panelMode === 'fullscreen' ? 'none' : '1px solid rgba(42, 72, 54, 0.20)',
            boxShadow: panelMode === 'fullscreen' ? 'none' : '6px 0 28px rgba(30, 58, 43, 0.14)',
            zIndex: 25,
            transition: 'width 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Tactical Panel Top Header Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '9px 20px',
              borderBottom: '1px solid var(--border-gold)',
              backgroundColor: 'rgba(250, 248, 242, 0.98)',
              position: 'sticky',
              top: 0,
              zIndex: 35,
              backdropFilter: 'blur(16px)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-observed" style={{ fontSize: '0.68rem', letterSpacing: '0.04em', border: '1px solid var(--border-gold)' }}>
                  {currentView === 'trace' ? '२. भू-प्रवाह अनुरेखक (Upstream Tracer)' :
                   currentView === 'simulation' ? '३. मानसून प्रभाव सिमुलेटर (Monsoon Sim)' :
                   currentView === 'satellite' ? '४. उपग्रह परिवर्तन संवेदक (Satellite Scrubber)' :
                   currentView === 'interventions' ? '५. संरक्षण कार्यशाला (Intervention Lab)' :
                   currentView === 'field-action' ? '६. ग्राम निरीक्षण तंत्र (Field Net)' :
                   currentView === 'overview' ? 'मेवाड़ बेसिन सर्वेक्षण (Basin Overview)' : 'विश्लेषण (Diagnostics)'}
                </span>
                <span className="mono-text" style={{ fontSize: '0.67rem', color: 'var(--mewar-gold-dark)', fontWeight: 600 }}>
                  ● 3D Sync Active
                </span>
              </div>

              {/* Window Layout Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <button
                  onClick={() => setPanelMode('docked')}
                  className={`btn ${panelMode === 'docked' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ padding: '3px 8px', fontSize: '0.70rem' }}
                  title="Dock as floating HUD card (720px) alongside 3D terrain"
                >
                  <PanelLeft size={12} />
                  Docked
                </button>
                <button
                  onClick={() => setPanelMode('split')}
                  className={`btn ${panelMode === 'split' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ padding: '3px 8px', fontSize: '0.70rem' }}
                  title="Split view (50% Panel / 50% 3D Terrain)"
                >
                  <Columns size={12} />
                  50/50
                </button>
                <button
                  onClick={() => setPanelMode('fullscreen')}
                  className={`btn ${panelMode === 'fullscreen' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ padding: '3px 8px', fontSize: '0.70rem' }}
                  title="Fullscreen workspace view"
                >
                  <Maximize2 size={12} />
                  Full
                </button>
                <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--border-subtle)', margin: '0 2px' }} />
                <button
                  onClick={() => setCurrentView('map')}
                  className="btn btn-secondary"
                  style={{ padding: '3px 9px', fontSize: '0.72rem', color: 'var(--color-forest)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                  title="Close panel and return full focus to 3D map"
                >
                  <X size={13} />
                  Close Panel
                </button>
              </div>
            </div>

            {/* Scrollable View Content */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
            {currentView === 'overview' && (
              <OverviewView
                onOpenMap={() => setCurrentView('map')}
                onOpenSimulation={() => setIsSimulationModalOpen(true)}
                onOpenTrace={() => setCurrentView('trace')}
                onOpenFarmIntel={() => setCurrentView('farm-intel')}
                onOpenInterventions={() => setCurrentView('interventions')}
              />
            )}

            {currentView === 'earth-health' && (
              <EarthHealthView
                onNavigateToPreset={(p) => {
                  setActivePreset(p);
                  setCurrentView('map');
                }}
                onOpenMap={() => setCurrentView('map')}
              />
            )}

            {currentView === 'farm-intel' && (
              <FarmIntelligenceView
                onNavigateToFarm={(farm) => {
                  setSelectedFeature({
                    name: farm.name,
                    localName: `${farm.villageName} Holding`,
                    latitude: farm.latitude,
                    longitude: farm.longitude,
                    type: 'FARM',
                    description: `Area: ${farm.areaHa} ha • Soil: ${farm.soilType} • Active crop: ${farm.cropType}.`,
                    elevationMeters: farm.elevationMeters,
                    soilLossRateTonHaYear: farm.soilLossRateTonHaYear,
                    historicalFact: `Micro-watershed holding directly upstream of ${farm.villageName === 'Nai' ? 'Lake Pichola' : 'Fateh Sagar'}.`,
                    agencySource: farm.agencySource || 'Mewar Krishi Vigyan Kendra & Dept of Agriculture',
                  });
                  setFlyToTarget({
                    latitude: farm.latitude,
                    longitude: farm.longitude,
                    height: 1800,
                  });
                  setCurrentView('map');
                }}
                onAskCopilot={(farm) => {
                  setSelectedFeature({
                    name: farm.name,
                    localName: `${farm.villageName} Holding`,
                    latitude: farm.latitude,
                    longitude: farm.longitude,
                    type: 'FARM',
                    description: `Area: ${farm.areaHa} ha • Soil: ${farm.soilType} • Active crop: ${farm.cropType}.`,
                    elevationMeters: farm.elevationMeters,
                    soilLossRateTonHaYear: farm.soilLossRateTonHaYear,
                    historicalFact: `Micro-watershed holding directly upstream of ${farm.villageName === 'Nai' ? 'Lake Pichola' : 'Fateh Sagar'}.`,
                    agencySource: farm.agencySource || 'Mewar Krishi Vigyan Kendra & Dept of Agriculture',
                  });
                  setIsCopilotOpen(true);
                }}
              />
            )}

            {/* Mode 1: Upstream Landscape Tracer */}
            {currentView === 'trace' && (
              <CauseEffectExplorer
                onFlyToStep={handleFlyToStep}
                onOpenMap={() => setCurrentView('map')}
                onSelectLakeTrace={handleSelectLakeTrace}
                selectedLakeId={selectedLakeTraceId}
              />
            )}

            {/* Mode 2: Monsoon Impact Simulator */}
            {currentView === 'simulation' && (
              <MonsoonSimulatorView
                onOpen3DMap={() => setCurrentView('map')}
                activeInterventions={activeInterventions}
                onSimulationComplete={handleSimulationComplete}
                lastResult={simulationResult}
              />
            )}

            {/* Mode 3: Satellite Change Detector */}
            {currentView === 'satellite' && (
              <SatelliteChangeDetector
                onFlyToLocation={handleFlyToCoords}
                onDispatchFieldMission={handleDispatchFieldMission}
                onSelectSeasonOnMap={(seasonId) => {
                  if (seasonId === '2023-drought') {
                    setBasemapMode('topographic');
                  } else if (seasonId === '2021-post') {
                    setBasemapMode('sentinel');
                  } else {
                    setBasemapMode('satellite');
                  }
                }}
              />
            )}

            {/* Mode 4: Conservation Intervention Lab */}
            {currentView === 'interventions' && (
              <InterventionPlanner
                activeInterventions={activeInterventions}
                onToggleIntervention={handleToggleIntervention}
                onRunSimulation={(interventions) => {
                  setActiveInterventions(interventions);
                  setIsSimulationModalOpen(true);
                }}
                onFlyToLocation={handleFlyToCoords}
                onDispatchToField={() => {
                  setCurrentView('field-action');
                }}
              />
            )}

            {/* Mode 5: Field Action Network */}
            {currentView === 'field-action' && (
              <FieldActionNetwork
                onFlyToLocation={handleFlyToCoords}
                externalNewMissions={dispatchedMissions}
              />
            )}

            {currentView === 'future-lab' && (
              <FutureLabView
                onOpenMap={() => setCurrentView('map')}
                onOpenSimulation={() => setIsSimulationModalOpen(true)}
              />
            )}

            {currentView === 'impact' && (
              <ImpactView
                onOpenMap={() => setCurrentView('map')}
                onOpenSimulation={() => setIsSimulationModalOpen(true)}
              />
            )}
            </div>
          </div>
        )}
      </main>

      {/* Rainfall Simulation Modal */}
      <RainSimulationModal
        isOpen={isSimulationModalOpen}
        onClose={() => setIsSimulationModalOpen(false)}
        activeInterventions={activeInterventions}
        onSimulationComplete={handleSimulationComplete}
        lastResult={simulationResult}
      />

      {/* Virtual Raindrop 3D Particle Flow Tool */}
      <VirtualRaindropTool
        isOpen={isRaindropToolOpen}
        onClose={() => setIsRaindropToolOpen(false)}
        onSelectScenario={(scen) => {
          setActiveRaindropScenario(scen);
          setActiveRaindropStep(scen.path[0]);
        }}
        onFlyToStep={(step) => {
          setActiveRaindropStep(step);
          handleFlyToCoords({
            latitude: step.latitude,
            longitude: step.longitude,
            height: 1800,
          });
        }}
        activeScenarioId={activeRaindropScenario?.id || 'sajjangarh-pichola'}
      />

      {/* API Key Credentials Modal */}
      <ApiKeyModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        googleMapsKey={googleMapsKey}
        geminiKey={geminiKey}
        onSaveKeys={handleSaveKeys}
      />
    </div>
  );
}
