'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ARAVALLI_LANDMARKS,
  CAMERA_PRESETS,
  DRAINAGE_NETWORKS,
  FARM_PARCELS,
  LAKES_DATA,
  RISK_ZONES,
  STUDY_AREA,
  WATERSHED_BOUNDARY,
} from '@/lib/geo-data';
import { BasemapMode, Intervention, LayerId, SimulationResult, ViewPreset } from '@/lib/types';
import { AlertTriangle, Compass, Eye, ShieldAlert, Waves } from 'lucide-react';

interface CesiumMapProps {
  activeLayers: Record<LayerId, boolean>;
  activePreset: ViewPreset;
  onSelectFeature?: (feature: any) => void;
  activeInterventions: Intervention[];
  simulationResult: SimulationResult | null;
  isSimulating: boolean;
  googleMapsApiKey?: string;
  onApiKeyMissing?: () => void;
  onTilesStatusChange?: (isActive: boolean) => void;
  basemapMode?: BasemapMode;
  flyToTarget?: { latitude: number; longitude: number; height?: number } | null;
  showHybridLabels?: boolean;
  show3DModels?: boolean;
}

// High-resolution cartographic place & road reference labels overlay provider
const createReferenceLabelsProvider = (Cesium: any) => {
  return new Cesium.UrlTemplateImageryProvider({
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
    maximumLevel: 19,
    credit: '© Esri, HERE, Garmin, OpenStreetMap',
  });
};

// Basemap provider factory for free high-resolution sources
const createImageryProvider = (mode: BasemapMode, Cesium: any) => {
  switch (mode) {
    case 'satellite':
      // High-resolution photorealistic satellite imagery (Esri World Imagery) - Free, no key needed
      return new Cesium.UrlTemplateImageryProvider({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        maximumLevel: 19,
        credit: '© Esri, Maxar, Earthstar Geographics, USDA, USGS',
      });
    case 'sentinel':
      // Sentinel-2 Cloudless / Earth Engine style multispectral earth view
      return new Cesium.UrlTemplateImageryProvider({
        url: 'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020/default/g/{z}/{y}/{x}.jpg',
        maximumLevel: 14,
        credit: 'Sentinel-2 Cloudless by EOX IT Services GmbH',
      });
    case 'dark':
      // High-contrast dark basemap for nocturnal / environmental analysis
      return new Cesium.UrlTemplateImageryProvider({
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        subdomains: ['a', 'b', 'c', 'd'],
        maximumLevel: 19,
        credit: '© OpenStreetMap contributors, © CARTO',
      });
    case 'topographic':
    default:
      // Clean hydrological and contour-friendly cartographic basemap
      return new Cesium.UrlTemplateImageryProvider({
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        subdomains: ['a', 'b', 'c', 'd'],
        maximumLevel: 19,
        credit: '© OpenStreetMap contributors, © CARTO',
      });
  }
};

// SVG Vector Pin generator for crisp cartographic markers with drop-shadow
const createPinDataUrl = (bgColor: string, borderColor: string, iconText: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="42" viewBox="0 0 34 42">
    <filter id="pdrop" x="-20%" y="-15%" width="140%" height="135%">
      <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.38"/>
    </filter>
    <path d="M17 41 C17 41 3 27 3 17 A 14 14 0 1 1 31 17 C 31 27 17 41 17 41 Z" fill="${bgColor}" stroke="${borderColor}" stroke-width="2" filter="url(#pdrop)"/>
    <circle cx="17" cy="16" r="10.5" fill="#FFFFFF"/>
    <text x="17" y="20.8" font-size="12" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${iconText}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const CesiumMap: React.FC<CesiumMapProps> = ({
  activeLayers,
  activePreset,
  onSelectFeature,
  activeInterventions,
  simulationResult,
  isSimulating,
  googleMapsApiKey,
  onApiKeyMissing,
  onTilesStatusChange,
  basemapMode = 'satellite',
  flyToTarget,
  showHybridLabels = true,
  show3DModels = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const tilesetRef = useRef<any>(null);
  const entitiesRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isGoogleTilesActive, setIsGoogleTilesActive] = useState(false);

  // Initialize Cesium Viewer
  useEffect(() => {
    let viewer: any = null;
    let isCancelled = false;

    const checkCesiumAndInit = async () => {
      if (typeof window === 'undefined') return;

      if (!window.Cesium) {
        // Wait briefly for script load if not yet ready
        setTimeout(checkCesiumAndInit, 200);
        return;
      }

      if (!containerRef.current || viewerRef.current) return;

      const Cesium = window.Cesium;

      try {
        // High performance minimal viewer without bulky stock controls
        viewer = new Cesium.Viewer(containerRef.current, {
          animation: false,
          timeline: false,
          baseLayerPicker: false,
          geocoder: false,
          homeButton: false,
          infoBox: false,
          selectionIndicator: false,
          sceneModePicker: false,
          navigationHelpButton: false,
          fullscreenButton: false,
          terrainProvider: undefined, // fallback terrain or default ellipsoid
          imageryProvider: createImageryProvider(basemapMode, Cesium),
        });

        // Ultra-HD Clarity & Retina Engine
        const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1.0) : 1.0;
        viewer.resolutionScale = Math.min(dpr, 2.0); // Native retina pixel rendering (removes canvas blurriness)
        viewer.scene.globe.maximumScreenSpaceError = 1.25; // Sharp mipmaps & highest-res satellite tiles
        viewer.scene.msaaSamples = 4; // 4x Multi-Sample Anti-Aliasing for crisp geometry edges
        viewer.scene.globe.enableLighting = true;
        viewer.scene.globe.depthTestAgainstTerrain = false; // Prevents labels & pins from clipping or fading behind ground
        viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#FAF9F6');
        viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#EDE8DE');

        // Attempt 3D terrain elevation (gracefully catches and falls back to ellipsoid if ion token unavailable)
        if (Cesium.createWorldTerrainAsync) {
          Cesium.createWorldTerrainAsync({
            requestVertexNormals: true,
            requestWaterMask: true,
          }).then((terrain: any) => {
            if (!isCancelled && viewer && !viewer.isDestroyed?.()) {
              viewer.terrainProvider = terrain;
            }
          }).catch(() => {
            // Ellipsoid fallback is already active
          });
        }

        viewerRef.current = viewer;

        // Try loading Google Photorealistic 3D Tiles ONLY if valid key is explicitly provided
        const apiKey = googleMapsApiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (apiKey) {
          try {
            Cesium.GoogleMaps.defaultApiKey = apiKey;
            const tileset = await Cesium.createGooglePhotorealistic3Dtileset({
              key: apiKey,
            });
            if (!isCancelled) {
              viewer.scene.primitives.add(tileset);
              tilesetRef.current = tileset;
              setIsGoogleTilesActive(true);
              onTilesStatusChange?.(true);
            }
          } catch (tileErr) {
            console.warn('Google 3D Tiles not loaded; using high-res satellite/cartographic basemap:', tileErr);
            setIsGoogleTilesActive(false);
            onTilesStatusChange?.(false);
          }
        } else {
          setIsGoogleTilesActive(false);
          onTilesStatusChange?.(false);
        }

        // Cinematic initial flight: Regional overview -> Udaipur basin
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            CAMERA_PRESETS.regional.longitude,
            CAMERA_PRESETS.regional.latitude,
            CAMERA_PRESETS.regional.height
          ),
          orientation: {
            heading: Cesium.Math.toRadians(CAMERA_PRESETS.regional.heading),
            pitch: Cesium.Math.toRadians(CAMERA_PRESETS.regional.pitch),
            roll: 0,
          },
          duration: 0.1,
          complete: () => {
            // Smoothly descend to Udaipur basin study area
            setTimeout(() => {
              if (viewer && !isCancelled) {
                viewer.camera.flyTo({
                  destination: Cesium.Cartesian3.fromDegrees(
                    CAMERA_PRESETS.udaipur.longitude,
                    CAMERA_PRESETS.udaipur.latitude,
                    CAMERA_PRESETS.udaipur.height
                  ),
                  orientation: {
                    heading: Cesium.Math.toRadians(CAMERA_PRESETS.udaipur.heading),
                    pitch: Cesium.Math.toRadians(CAMERA_PRESETS.udaipur.pitch),
                    roll: 0,
                  },
                  duration: 2.8,
                });
              }
            }, 600);
          },
        });

        // Entity picking click handler
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction((click: any) => {
          const picked = viewer.scene.pick(click.position);
          if (Cesium.defined(picked) && picked.id && picked.id._aravalliData) {
            onSelectFeature?.(picked.id._aravalliData);
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        setIsLoaded(true);
      } catch (err: any) {
        console.error('Cesium initialization error:', err);
        setLoadError(err.message || 'Failed to initialize 3D map');
      }
    };

    checkCesiumAndInit();

    return () => {
      isCancelled = true;
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  // Update Google 3D Tiles if API key changes
  useEffect(() => {
    if (!viewerRef.current || !window.Cesium) return;
    const Cesium = window.Cesium;
    const apiKey = googleMapsApiKey;

    const updateTileset = async () => {
      if (tilesetRef.current) {
        viewerRef.current.scene.primitives.remove(tilesetRef.current);
        tilesetRef.current = null;
      }

      if (apiKey) {
        try {
          Cesium.GoogleMaps.defaultApiKey = apiKey;
          const tileset = await Cesium.createGooglePhotorealistic3Dtileset({ key: apiKey });
          viewerRef.current.scene.primitives.add(tileset);
          tilesetRef.current = tileset;
          setIsGoogleTilesActive(true);
          onTilesStatusChange?.(true);
        } catch (e) {
          console.warn('Could not add Google 3D Tiles with updated key:', e);
          setIsGoogleTilesActive(false);
          onTilesStatusChange?.(false);
        }
      } else {
        setIsGoogleTilesActive(false);
        onTilesStatusChange?.(false);
      }
    };

    updateTileset();
  }, [googleMapsApiKey]);

  // Switch imagery provider dynamically when basemapMode or showHybridLabels changes
  useEffect(() => {
    if (!viewerRef.current || !window.Cesium) return;
    const Cesium = window.Cesium;
    const viewer = viewerRef.current;
    try {
      const provider = createImageryProvider(basemapMode, Cesium);
      viewer.imageryLayers.removeAll();
      viewer.imageryLayers.addImageryProvider(provider);

      // Add high-resolution reference place, lake, and road overlay if enabled on satellite
      if (showHybridLabels && (basemapMode === 'satellite' || basemapMode === 'sentinel')) {
        const labelsProvider = createReferenceLabelsProvider(Cesium);
        viewer.imageryLayers.addImageryProvider(labelsProvider);
      }

      // If Google 3D Tiles is in the scene, only show it when on satellite and active
      if (tilesetRef.current) {
        tilesetRef.current.show = isGoogleTilesActive && basemapMode === 'satellite';
      }
    } catch (err) {
      console.warn('Failed to switch basemap imagery:', err);
    }
  }, [basemapMode, isGoogleTilesActive, showHybridLabels]);

  // Handle camera preset changes
  useEffect(() => {
    if (!viewerRef.current || !window.Cesium) return;
    const preset = CAMERA_PRESETS[activePreset];
    if (!preset) return;

    const Cesium = window.Cesium;
    viewerRef.current.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        preset.longitude,
        preset.latitude,
        preset.height
      ),
      orientation: {
        heading: Cesium.Math.toRadians(preset.heading),
        pitch: Cesium.Math.toRadians(preset.pitch),
        roll: Cesium.Math.toRadians(preset.roll),
      },
      duration: 2.2,
    });
  }, [activePreset]);

  // Handle smooth flyTo target when selected from feature drawer or landmark list
  useEffect(() => {
    if (!viewerRef.current || !window.Cesium || !flyToTarget) return;
    const Cesium = window.Cesium;
    viewerRef.current.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        flyToTarget.longitude,
        flyToTarget.latitude,
        flyToTarget.height || 2200
      ),
      orientation: {
        heading: Cesium.Math.toRadians(35),
        pitch: Cesium.Math.toRadians(-32),
        roll: 0,
      },
      duration: 2.2,
    });
  }, [flyToTarget]);

  // Render Environmental Layers (Water bodies, Landmarks, Watershed, Drainage, Agriculture, Erosion, Interventions)
  useEffect(() => {
    if (!viewerRef.current || !window.Cesium) return;
    const viewer = viewerRef.current;
    const Cesium = window.Cesium;

    // Remove existing custom entities
    entitiesRef.current.forEach((e) => viewer.entities.remove(e));
    entitiesRef.current = [];

    const newEntities: any[] = [];

    // Authentic 3D Architectural and Engineering Models for Udaipur
    const add3DLandmarkModels = () => {
      // 1. Sajjangarh Fort (Monsoon Palace) Citadel & Royal Towers (938m MSL Bansdara Peak)
      const sajjanCitadel = viewer.entities.add({
        name: 'Monsoon Palace Citadel (Sajjangarh Fort)',
        position: Cesium.Cartesian3.fromDegrees(73.6366, 24.5908, 938 + 12),
        box: {
          dimensions: new Cesium.Cartesian3(34.0, 48.0, 24.0),
          material: Cesium.Color.fromCssColorString('#EDE5D8'),
          outline: true,
          outlineColor: Cesium.Color.fromCssColorString('#78684C'),
          outlineWidth: 1.5,
        },
      });
      sajjanCitadel._aravalliData = ARAVALLI_LANDMARKS.find((l) => l.id === 'sajjangarh-peak');
      newEntities.push(sajjanCitadel);

      const sajjanTower = viewer.entities.add({
        name: 'Sajjangarh Palace Royal Observatory Tower',
        position: Cesium.Cartesian3.fromDegrees(73.6366, 24.5908, 938 + 29),
        box: {
          dimensions: new Cesium.Cartesian3(20.0, 22.0, 14.0),
          material: Cesium.Color.fromCssColorString('#F5EFE3'),
          outline: true,
          outlineColor: Cesium.Color.fromCssColorString('#8A7854'),
          outlineWidth: 1.5,
        },
      });
      newEntities.push(sajjanTower);

      const sajjanDome = viewer.entities.add({
        name: 'Sajjangarh Royal Chhatri Cupola',
        position: Cesium.Cartesian3.fromDegrees(73.6366, 24.5908, 938 + 39),
        cylinder: {
          length: 7.0,
          topRadius: 0.8,
          bottomRadius: 5.5,
          material: Cesium.Color.fromCssColorString('#D4AF37'),
          outline: true,
          outlineColor: Cesium.Color.fromCssColorString('#997A15'),
          outlineWidth: 1.5,
        },
      });
      newEntities.push(sajjanDome);

      // 2. Udaipur City Palace Complex (Eastern Shore of Lake Pichola)
      const cityPalaceMain = viewer.entities.add({
        name: 'City Palace Complex (Mardana & Zenana Mahal)',
        position: Cesium.Cartesian3.fromDegrees(73.6835, 24.5764, 595 + 14),
        box: {
          dimensions: new Cesium.Cartesian3(36.0, 115.0, 28.0),
          material: Cesium.Color.fromCssColorString('#F7F4EB'),
          outline: true,
          outlineColor: Cesium.Color.fromCssColorString('#8C8270'),
          outlineWidth: 1.5,
        },
      });
      cityPalaceMain._aravalliData = {
        name: 'Udaipur City Palace Complex',
        localName: 'उदयपुर सिटी पैलेस (राजमहल)',
        category: 'HERITAGE_WATER',
        elevationMeters: 595,
        description: 'Monumental royal complex founded in 1559 AD by Maharana Udai Singh II on the eastern shore of Lake Pichola.',
        historicalFact: 'Constructed over 400 years by 22 Maharanas of Mewar in granite and marble with ornate Rajput architectural pavilions.',
        agencySource: 'Maharana of Mewar Charitable Foundation (MMCF)',
        type: 'LANDMARK',
      };
      newEntities.push(cityPalaceMain);

      const cityPalaceCourt = viewer.entities.add({
        name: 'City Palace Manek Chowk & Tripolia Gate',
        position: Cesium.Cartesian3.fromDegrees(73.6841, 24.5764, 595 + 8),
        box: {
          dimensions: new Cesium.Cartesian3(28.0, 68.0, 16.0),
          material: Cesium.Color.fromCssColorString('#EFECE3'),
          outline: true,
          outlineColor: Cesium.Color.fromCssColorString('#9C927F'),
          outlineWidth: 1.0,
        },
      });
      newEntities.push(cityPalaceCourt);

      // 3. Taj Lake Palace (Jag Niwas) - Floating white marble palace in Lake Pichola
      const lakePalace = viewer.entities.add({
        name: 'Taj Lake Palace (Jag Niwas Island)',
        position: Cesium.Cartesian3.fromDegrees(73.6787, 24.5753, 591 + 4.5),
        box: {
          dimensions: new Cesium.Cartesian3(54.0, 88.0, 9.0),
          material: Cesium.Color.fromCssColorString('#FFFFFF'),
          outline: true,
          outlineColor: Cesium.Color.fromCssColorString('#94A3B8'),
          outlineWidth: 1.5,
        },
      });
      lakePalace._aravalliData = {
        name: 'Taj Lake Palace (Jag Niwas)',
        localName: 'जग निवास (ताज लेक पैलेस)',
        category: 'HERITAGE_WATER',
        elevationMeters: 591,
        description: 'Iconic white marble floating palace in the middle of Lake Pichola, built in 1746 AD by Maharana Jagat Singh II.',
        historicalFact: 'Constructed on a natural 4-acre rock foundation in Lake Pichola with black and white marble walls and lily pond courtyards.',
        agencySource: 'Rajasthan Tourism & Heritage Board',
        type: 'LANDMARK',
      };
      newEntities.push(lakePalace);

      // 4. Jag Mandir (The Lake Garden Palace) in southern Pichola
      const jagMandir = viewer.entities.add({
        name: 'Jag Mandir Palace (Gul Mahal Island)',
        position: Cesium.Cartesian3.fromDegrees(73.6769, 24.5676, 591 + 7),
        cylinder: {
          length: 14.0,
          topRadius: 11.0,
          bottomRadius: 14.0,
          material: Cesium.Color.fromCssColorString('#F5EADB'),
          outline: true,
          outlineColor: Cesium.Color.fromCssColorString('#8A7B62'),
          outlineWidth: 1.5,
        },
      });
      jagMandir._aravalliData = {
        name: 'Jag Mandir (Lake Garden Palace)',
        localName: 'जग मंदिर (गुल महल)',
        category: 'HERITAGE_WATER',
        elevationMeters: 591,
        description: 'Island palace in southern Lake Pichola constructed by Maharana Karan Singh and Maharana Jagat Singh I (1628 AD).',
        historicalFact: 'The domed yellow sandstone Gul Mahal famously inspired Shah Jahan’s design aesthetics for the Taj Mahal in Agra.',
        agencySource: 'Rajasthan Tourism & Heritage Board',
        type: 'LANDMARK',
      };
      newEntities.push(jagMandir);

      // 5. Neemach Mata Temple Hilltop on Dewali/Fateh Sagar crest
      const neemachMata = viewer.entities.add({
        name: 'Neemach Mata Temple (Hilltop Shikhara)',
        position: Cesium.Cartesian3.fromDegrees(73.6715, 24.6067, 710 + 9),
        cylinder: {
          length: 18.0,
          topRadius: 0.6,
          bottomRadius: 6.5,
          material: Cesium.Color.fromCssColorString('#FAF6EE'),
          outline: true,
          outlineColor: Cesium.Color.fromCssColorString('#B45309'),
          outlineWidth: 1.5,
        },
      });
      neemachMata._aravalliData = {
        name: 'Neemach Mata Hilltop Temple & Observatory Ridge',
        localName: 'नीमच माता मंदिर शिखर',
        category: 'RIDGE_PEAK',
        elevationMeters: 710,
        description: 'Prominent Aravalli ridge temple guarding Fateh Sagar Lake; houses the Udaipur Solar Observatory monitoring station.',
        historicalFact: 'Historic pilgrim ascent providing bird-eye hydrological vantage over the Fateh Sagar - Swaroop Sagar inter-lake canal network.',
        agencySource: 'Devasthan Department / UMC',
        type: 'LANDMARK',
      };
      newEntities.push(neemachMata);

      // 6. Check Dam CD-01 Masonry Weir Model (Upper Sisarma)
      const checkDamModel = viewer.entities.add({
        name: 'Upper Sisarma Masonry Check Dam (CD-01)',
        position: Cesium.Cartesian3.fromDegrees(73.6420, 24.5510, 610 + 3),
        box: {
          dimensions: new Cesium.Cartesian3(5.0, 36.0, 6.0),
          material: Cesium.Color.fromCssColorString('#57534E'),
          outline: true,
          outlineColor: Cesium.Color.fromCssColorString('#1C1917'),
          outlineWidth: 1.5,
        },
      });
      newEntities.push(checkDamModel);

      // 7. Sukher Quarry Gabion Rock Filter GB-03
      const gabionModel = viewer.entities.add({
        name: 'Sukher Quarry Gabion Sediment Filter (GB-03)',
        position: Cesium.Cartesian3.fromDegrees(73.7120, 24.6310, 615 + 2.5),
        box: {
          dimensions: new Cesium.Cartesian3(4.5, 28.0, 4.5),
          material: Cesium.Color.fromCssColorString('#475569'),
          outline: true,
          outlineColor: Cesium.Color.fromCssColorString('#0F172A'),
          outlineWidth: 1.5,
        },
      });
      newEntities.push(gabionModel);
    };

    // Render 3D architectural models if enabled
    if (show3DModels) {
      add3DLandmarkModels();
    }

    // 1. Major Lakes of Udaipur Basin with Realistic Cartographic Pins
    if (activeLayers.waterBodies) {
      LAKES_DATA.forEach((lake) => {
        const pinImg = createPinDataUrl('#245876', '#123042', '🌊');
        const elev = lake.elevationMeters || 590;

        // Subtle water boundary highlight without obscuring photorealistic satellite water
        const lakeEntity = viewer.entities.add({
          name: lake.name,
          position: Cesium.Cartesian3.fromDegrees(lake.longitude, lake.latitude, elev + 12),
          ellipse: {
            semiMinorAxis: Math.sqrt((lake.areaSqKm * 1_000_000) / Math.PI) * 0.75,
            semiMajorAxis: Math.sqrt((lake.areaSqKm * 1_000_000) / Math.PI) * 1.05,
            material: Cesium.Color.fromCssColorString('#245876').withAlpha(0.22),
            outline: true,
            outlineColor: Cesium.Color.fromCssColorString('#1B435B').withAlpha(0.7),
            outlineWidth: 2,
            height: elev,
          },
          billboard: {
            image: pinImg,
            width: 32,
            height: 40,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 48000),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          point: {
            pixelSize: 6,
            color: Cesium.Color.fromCssColorString('#64B5F6'),
            outlineColor: Cesium.Color.fromCssColorString('#0D47A1'),
            outlineWidth: 2,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          label: {
            text: `  ${lake.name} (${lake.localName.split(' ')[0]})  \n  ${lake.currentStoragePercent}% Live Storage • ${lake.capacityMcm} MCM  `,
            font: 'bold 12.5px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fillColor: Cesium.Color.fromCssColorString('#0F172A'),
            backgroundColor: Cesium.Color.fromCssColorString('#FFFFFF').withAlpha(0.96),
            showBackground: true,
            backgroundPadding: new Cesium.Cartesian2(9, 5),
            style: Cesium.LabelStyle.FILL,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -48),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            scaleByDistance: new Cesium.NearFarScalar(500, 1.0, 48000, 0.74),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 38000),
          },
        });
        lakeEntity._aravalliData = { type: 'LAKE', ...lake };
        newEntities.push(lakeEntity);
      });
    }

    // 2. Real Aravalli Ecological, Heritage, and Geomorphic Landmarks
    if (activeLayers.conservation || activeLayers.terrain) {
      ARAVALLI_LANDMARKS.forEach((lm) => {
        let pinColor = '#1E3A2B';
        let pinBorder = '#0E1D15';
        let pinIcon = '⛰️';

        if (lm.category === 'RIDGE_PEAK') {
          pinColor = '#1E3A2B';
          pinBorder = '#0B1610';
          pinIcon = '⛰️';
        } else if (lm.category === 'HERITAGE_WATER' || lm.category === 'CANAL_LINK') {
          pinColor = '#8A6E3D';
          pinBorder = '#4A3B20';
          pinIcon = '🏛️';
        } else if (lm.category === 'ECOLOGICAL_BUFFER') {
          pinColor = '#2E7D32';
          pinBorder = '#1B5E20';
          pinIcon = '🌿';
        } else if (lm.category === 'MINING_HOTSPOT') {
          pinColor = '#545759';
          pinBorder = '#2B2D2F';
          pinIcon = '⛏️';
        }

        const pinImg = createPinDataUrl(pinColor, pinBorder, pinIcon);

        const landmarkEntity = viewer.entities.add({
          name: lm.name,
          position: Cesium.Cartesian3.fromDegrees(lm.longitude, lm.latitude, lm.elevationMeters + 15),
          billboard: {
            image: pinImg,
            width: 32,
            height: 40,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 45000),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          point: {
            pixelSize: 6,
            color: Cesium.Color.fromCssColorString('#FAF9F6'),
            outlineColor: Cesium.Color.fromCssColorString(pinColor),
            outlineWidth: 2,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          label: {
            text: `  ${lm.name}  \n  ▲ ${lm.elevationMeters}m MSL • ${lm.fsiCanopyCoverPercent ? lm.fsiCanopyCoverPercent + '% Canopy' : 'Monitored'}  `,
            font: 'bold 12.5px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fillColor: Cesium.Color.fromCssColorString('#0F172A'),
            backgroundColor: Cesium.Color.fromCssColorString('#FFFFFF').withAlpha(0.96),
            showBackground: true,
            backgroundPadding: new Cesium.Cartesian2(9, 5),
            style: Cesium.LabelStyle.FILL,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -48),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            scaleByDistance: new Cesium.NearFarScalar(500, 1.0, 45000, 0.74),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 36000),
          },
        });
        landmarkEntity._aravalliData = { type: 'LANDMARK', ...lm };
        newEntities.push(landmarkEntity);
      });
    }

    // 3. Watershed Boundary Layer
    if (activeLayers.watershed) {
      const positions = WATERSHED_BOUNDARY.map((c) =>
        Cesium.Cartesian3.fromDegrees(c[1], c[0], 650)
      );

      const watershedEntity = viewer.entities.add({
        name: 'Udaipur Basin Catchment Divide',
        polyline: {
          positions: positions,
          width: 3.5,
          material: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.fromCssColorString('#4A6044'),
            dashLength: 16.0,
          }),
          clampToGround: true,
        },
      });
      watershedEntity._aravalliData = {
        type: 'WATERSHED',
        name: 'Udaipur Basin Catchment (Girwa)',
        areaSqKm: STUDY_AREA.areaSqKm,
        description: 'Natural hydrological divide enclosing the interconnected lake chain and Aravalli escarpments.',
      };
      newEntities.push(watershedEntity);
    }

    // 4. Drainage Network Layer
    if (activeLayers.drainage) {
      DRAINAGE_NETWORKS.forEach((drainage) => {
        const coords = drainage.coordinates.map((c) =>
          Cesium.Cartesian3.fromDegrees(c[1], c[0], 600)
        );

        const width = drainage.order === 3 ? 4.5 : drainage.order === 2 ? 3.0 : 2.0;
        const color = isSimulating
          ? Cesium.Color.fromCssColorString('#0288D1').withAlpha(0.95)
          : Cesium.Color.fromCssColorString('#3A7599').withAlpha(0.85);

        const streamEntity = viewer.entities.add({
          name: drainage.name,
          polyline: {
            positions: coords,
            width: width,
            material: new Cesium.PolylineGlowMaterialProperty({
              glowPower: isSimulating ? 0.35 : 0.15,
              color: color,
            }),
            clampToGround: true,
          },
        });
        streamEntity._aravalliData = { type: 'DRAINAGE', ...drainage };
        newEntities.push(streamEntity);
      });
    }

    // 5. Smallholder Farmland Parcels Layer
    if (activeLayers.agriculture) {
      FARM_PARCELS.forEach((farm) => {
        const pinImg = createPinDataUrl('#5D7336', '#35431D', '🌾');
        const elev = farm.elevationMeters || 615;

        const farmEntity = viewer.entities.add({
          name: farm.name,
          position: Cesium.Cartesian3.fromDegrees(farm.longitude, farm.latitude, elev + 8),
          ellipse: {
            semiMinorAxis: 160,
            semiMajorAxis: 220,
            material: Cesium.Color.fromCssColorString('#768B4C').withAlpha(0.35),
            outline: true,
            outlineColor: Cesium.Color.fromCssColorString('#4E5E2F').withAlpha(0.7),
            outlineWidth: 1.5,
            height: elev,
          },
          billboard: {
            image: pinImg,
            width: 30,
            height: 38,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 26000),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          point: {
            pixelSize: 5,
            color: Cesium.Color.fromCssColorString('#AED581'),
            outlineColor: Cesium.Color.fromCssColorString('#33691E'),
            outlineWidth: 1.5,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          label: {
            text: `  🌾 ${farm.name}  \n  ${farm.cropType.split('/')[0]} • NDVI ${farm.ndviScore}  `,
            font: 'bold 12px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fillColor: Cesium.Color.fromCssColorString('#0F172A'),
            backgroundColor: Cesium.Color.fromCssColorString('#FFFFFF').withAlpha(0.96),
            showBackground: true,
            backgroundPadding: new Cesium.Cartesian2(8, 5),
            style: Cesium.LabelStyle.FILL,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -46),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            scaleByDistance: new Cesium.NearFarScalar(400, 1.0, 30000, 0.74),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 22000),
          },
        });
        farmEntity._aravalliData = { type: 'FARM', ...farm };
        newEntities.push(farmEntity);
      });
    }

    // 6. Soil Erosion, Runoff & Mining Risk Zones
    if (activeLayers.soilErosion || activeLayers.runoffRisk) {
      RISK_ZONES.forEach((risk) => {
        const pos = risk.coordinates.map((c) =>
          Cesium.Cartesian3.fromDegrees(c[1], c[0], (risk.elevationMeters || 650) + 5)
        );

        const riskColor = risk.severity === 'Critical'
          ? Cesium.Color.fromCssColorString('#BD5637').withAlpha(0.45)
          : Cesium.Color.fromCssColorString('#D47E38').withAlpha(0.40);

        const pinImg = createPinDataUrl('#BD5637', '#732711', '⚠️');

        const riskEntity = viewer.entities.add({
          name: risk.name,
          position: Cesium.Cartesian3.fromDegrees(risk.longitude, risk.latitude, (risk.elevationMeters || 650) + 12),
          polygon: {
            hierarchy: pos,
            material: riskColor,
            outline: true,
            outlineColor: Cesium.Color.fromCssColorString('#8E361D'),
            outlineWidth: 2,
            height: risk.elevationMeters || 650,
          },
          billboard: {
            image: pinImg,
            width: 30,
            height: 38,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 30000),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          label: {
            text: `  ⚠️ ${risk.name}  \n  ${risk.severity} Risk • ${risk.soilLossRateTonHaYear || 38} t/ha/yr  `,
            font: 'bold 12px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fillColor: Cesium.Color.fromCssColorString('#0F172A'),
            backgroundColor: Cesium.Color.fromCssColorString('#FFFFFF').withAlpha(0.96),
            showBackground: true,
            backgroundPadding: new Cesium.Cartesian2(8, 5),
            style: Cesium.LabelStyle.FILL,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -46),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            scaleByDistance: new Cesium.NearFarScalar(400, 1.0, 32000, 0.74),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 26000),
          },
        });
        riskEntity._aravalliData = { ...risk, entityCategory: 'RISK_ZONE' };
        newEntities.push(riskEntity);
      });
    }

    // 7. Active Interventions (Check dams, contour bunds, reforestation, Johads)
    activeInterventions.forEach((intervention) => {
      const pinImg = createPinDataUrl('#BFA054', '#7D6425', '🛡️');

      const interventionEntity = viewer.entities.add({
        name: intervention.name,
        position: Cesium.Cartesian3.fromDegrees(intervention.longitude, intervention.latitude, 620),
        cylinder: {
          length: 22,
          topRadius: 16,
          bottomRadius: 22,
          material: Cesium.Color.fromCssColorString('#1E3A2B').withAlpha(0.85),
          outline: true,
          outlineColor: Cesium.Color.fromCssColorString('#BFA054'),
          outlineWidth: 2,
        },
        billboard: {
          image: pinImg,
          width: 32,
          height: 40,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 32000),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        label: {
          text: `  🛡️ ${intervention.name}  \n  -${intervention.runoffReductionPercent}% Runoff • ${intervention.status}  `,
          font: 'bold 12px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fillColor: Cesium.Color.fromCssColorString('#14532D'),
          backgroundColor: Cesium.Color.fromCssColorString('#FFFFFF').withAlpha(0.96),
          showBackground: true,
          backgroundPadding: new Cesium.Cartesian2(8, 5),
          style: Cesium.LabelStyle.FILL,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -48),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          scaleByDistance: new Cesium.NearFarScalar(400, 1.0, 34000, 0.74),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 30000),
        },
      });
      interventionEntity._aravalliData = { ...intervention, entityCategory: 'INTERVENTION' };
      newEntities.push(interventionEntity);
    });

    entitiesRef.current = newEntities;
  }, [activeLayers, activeInterventions, isSimulating, show3DModels]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Loading overlay */}
      {!isLoaded && !loadError && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'var(--bg-primary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          zIndex: 50,
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid var(--border-subtle)',
            borderTopColor: 'var(--color-forest)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          <div style={{ textAlign: 'center' }}>
            <h3 className="serif-title" style={{ fontSize: '1.4rem', color: 'var(--color-forest)' }}>
              ARAVALLI TWIN
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Initializing 3D Geospatial Digital Landscape & Google Photorealistic Tiles...
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {loadError && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--color-terracotta)',
          padding: '12px 20px',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 60,
        }}>
          <AlertTriangle size={18} color="var(--color-terracotta)" />
          <span style={{ fontSize: '0.84rem' }}>{loadError}</span>
        </div>
      )}

      {/* Official Google & Data Attribution Banner - Mandatory Requirement */}
      <div className="google-attribution-strip">
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Google</span>
        <span>|</span>
        <span>Map data ©2026 Google, Maxar Technologies</span>
        <span>|</span>
        <span className="mono-text" style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
          Survey of India / Aravalli Catchment Model
        </span>
      </div>

      {/* Simulation Active Indicator Banner */}
      {isSimulating && (
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(36, 88, 118, 0.94)',
          color: '#FFFFFF',
          padding: '8px 18px',
          borderRadius: 'var(--radius-sm)',
          backdropFilter: 'blur(8px)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 30,
          fontSize: '0.84rem',
        }}>
          <Waves size={16} className="pulse-ring" />
          <span>
            Simulating Monsoon Precipitation: Runoff velocity vectors active across Sisarma drainage network
          </span>
          <span className="badge badge-simulated" style={{ marginLeft: '6px' }}>
            Hydrologic Model
          </span>
        </div>
      )}

      {/* Developer Preview Callout if Google API key is pending */}
      {!isGoogleTilesActive && isLoaded && (
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          border: '1px solid var(--border-subtle)',
          padding: '8px 14px',
          borderRadius: 'var(--radius-sm)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 20,
          fontSize: '0.76rem',
          color: 'var(--text-secondary)',
          boxShadow: 'var(--shadow-subtle)',
        }}>
          <span className="badge badge-demo">Developer Preview</span>
          <span>Cartographic terrain active.</span>
          <button
            onClick={onApiKeyMissing}
            className="btn btn-ghost"
            style={{ padding: '2px 6px', fontSize: '0.74rem', color: 'var(--color-lake)', textDecoration: 'underline' }}
          >
            Connect Google 3D Key
          </button>
        </div>
      )}
    </div>
  );
};
