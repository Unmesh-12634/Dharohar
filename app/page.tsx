'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { CesiumMap } from '@/components/map/CesiumMap';
import { LayerPanel } from '@/components/map/LayerPanel';
import { MapControls } from '@/components/map/MapControls';
import { AravalliCopilot } from '@/components/copilot/AravalliCopilot';
import { RainSimulationModal } from '@/components/simulation/RainSimulationModal';
import { InterventionPlanner } from '@/components/interventions/InterventionPlanner';
import { CauseEffectExplorer } from '@/components/explorer/CauseEffectExplorer';
import { OverviewView } from '@/components/dashboard/OverviewView';
import { EarthHealthView } from '@/components/dashboard/EarthHealthView';
import { FutureLabView } from '@/components/dashboard/FutureLabView';
import { ImpactView } from '@/components/dashboard/ImpactView';
import { FarmIntelligenceView } from '@/components/dashboard/FarmIntelligenceView';
import { ApiKeyModal } from '@/components/settings/ApiKeyModal';
import { DEFAULT_INTERVENTIONS, DEFAULT_LAYERS } from '@/lib/geo-data';
import { BasemapMode, Intervention, LayerId, SimulationResult, TraceStep, ViewPreset } from '@/lib/types';
import { runHydrologicalSimulation } from '@/lib/simulation-engine';
import { Bot, CloudRain, Crosshair, Info, MapPin, Sparkles, X } from 'lucide-react';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<string>('overview');
  const [activePreset, setActivePreset] = useState<ViewPreset>('udaipur');
  const [isWatershedMode, setIsWatershedMode] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [basemapMode, setBasemapMode] = useState<BasemapMode>('satellite');
  const [flyToTarget, setFlyToTarget] = useState<{ latitude: number; longitude: number; height?: number } | null>(null);
  const [showHybridLabels, setShowHybridLabels] = useState<boolean>(true);
  const [show3DModels, setShow3DModels] = useState<boolean>(true);

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
      />

      {/* Main View Area */}
      <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* 3D Digital Twin Map View */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          visibility: currentView === 'map' ? 'visible' : 'hidden',
          zIndex: currentView === 'map' ? 10 : 0,
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
          />

          {/* Floating Layers Panel on Left */}
          <LayerPanel
            activeLayers={activeLayers}
            onToggleLayer={handleToggleLayer}
            selectedYear={selectedYear}
            onYearChange={(y) => setSelectedYear(y)}
          />

          {/* Floating Navigation, Camera Controls & Basemap Switcher at Bottom */}
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
          />

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

        {/* Scrollable Non-Map Views */}
        {currentView !== 'map' && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflowY: 'auto',
            backgroundColor: 'var(--bg-primary)',
            zIndex: 15,
          }}>
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

            {currentView === 'future-lab' && (
              <FutureLabView
                onOpenMap={() => setCurrentView('map')}
                onOpenSimulation={() => setIsSimulationModalOpen(true)}
              />
            )}

            {currentView === 'interventions' && (
              <InterventionPlanner
                activeInterventions={activeInterventions}
                onToggleIntervention={handleToggleIntervention}
                onRunSimulation={() => {
                  setIsSimulationModalOpen(true);
                }}
              />
            )}

            {currentView === 'trace' && (
              <CauseEffectExplorer
                onFlyToStep={handleFlyToStep}
                onOpenMap={() => setCurrentView('map')}
              />
            )}

            {currentView === 'impact' && (
              <ImpactView
                onOpenMap={() => setCurrentView('map')}
                onOpenSimulation={() => setIsSimulationModalOpen(true)}
              />
            )}
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
