export type BasemapMode = 'satellite' | 'topographic' | 'sentinel' | 'dark';

export type LayerId =
  | 'terrain'
  | 'waterBodies'
  | 'watershed'
  | 'drainage'
  | 'agriculture'
  | 'vegetation'
  | 'soilErosion'
  | 'runoffRisk'
  | 'infrastructure'
  | 'conservation';

export interface LayerConfig {
  id: LayerId;
  name: string;
  description: string;
  category: 'natural' | 'hydrology' | 'agri' | 'risk';
  active: boolean;
  color: string;
}

export type ViewPreset =
  | 'regional'
  | 'udaipur'
  | 'watershed'
  | 'lake'
  | 'agriculture'
  | 'risk';

export interface CameraPresetConfig {
  id: ViewPreset;
  title: string;
  subtitle: string;
  latitude: number;
  longitude: number;
  height: number;
  heading: number;
  pitch: number;
  roll: number;
}

export type DataSourceType = 'LIVE' | 'OBSERVED' | 'MODELED' | 'SIMULATED' | 'DEMO DATA';

export interface LakeData {
  id: string;
  name: string;
  localName: string;
  latitude: number;
  longitude: number;
  elevationMeters?: number;
  areaSqKm: number;
  capacityMcm: number; // Million Cubic Meters
  currentStoragePercent: number;
  waterStress: 'Low' | 'Moderate' | 'High' | 'Severe';
  sedimentationRisk: 'Low' | 'Moderate' | 'High';
  inflowRivers: string[];
  catchmentSqKm: number;
  cgwbAquiferStatus?: 'Over-Exploited' | 'Critical' | 'Semi-Critical' | 'Safe';
  historicalFact?: string;
  agencySource?: string;
  dataSource: DataSourceType;
  description: string;
}

export interface FarmParcel {
  id: string;
  name: string;
  villageName: string;
  cropType: string;
  soilType: string;
  areaHa: number;
  latitude: number;
  longitude: number;
  elevationMeters?: number;
  ndviScore: number;
  waterStressIndex: 'Low' | 'Moderate' | 'Critical';
  erosionExposure: 'Minimal' | 'Moderate' | 'Acute';
  soilLossRateTonHaYear?: number;
  cgwbAquiferStatus?: string;
  suggestedAction: string;
  agencySource?: string;
  dataSource: DataSourceType;
}

export interface RiskZone {
  id: string;
  name: string;
  localName?: string;
  type: 'EROSION' | 'RUNOFF' | 'SILTATION' | 'MINING';
  severity: 'Moderate' | 'High' | 'Critical';
  slopeDegree: number;
  vegetationDeficit: number; // %
  latitude: number;
  longitude: number;
  elevationMeters?: number;
  soilLossRateTonHaYear?: number;
  fsiCanopyCoverPercent?: number;
  cgwbAquiferStatus?: string;
  recommendedConservation?: string;
  coordinates: [number, number][];
  description: string;
  agencySource?: string;
  dataSource: DataSourceType;
}

export interface AravalliLandmark {
  id: string;
  name: string;
  localName: string;
  category: 'RIDGE_PEAK' | 'HERITAGE_WATER' | 'ECOLOGICAL_BUFFER' | 'MINING_HOTSPOT' | 'CANAL_LINK';
  latitude: number;
  longitude: number;
  elevationMeters: number;
  description: string;
  ecologicalRole: string;
  fsiCanopyCoverPercent?: number;
  soilLossRateTonHaYear?: number;
  recommendedConservation: string;
  historicalFact: string;
  agencySource: string;
  dataSource: DataSourceType;
}

export interface DrainageLine {
  id: string;
  name: string;
  order: 1 | 2 | 3; // Strahler stream order
  coordinates: [number, number][];
  flowRateCms: number; // cubic meters / sec baseline
  riskIndex: number;
}

export interface Intervention {
  id: string;
  type: 'CHECK_DAM' | 'CONTOUR_BUND' | 'RESTORATION_ZONE' | 'WATER_HARVESTING' | 'VEGETATION_CORRIDOR';
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  status: 'PROPOSED' | 'MODELED';
  estimatedCostInr: string;
  runoffReductionPercent: number;
  erosionMitigationPercent: number;
  retentionIncreasePercent: number;
}

export interface SimulationParams {
  rainfallMm: number; // 50, 100, 150, 200, 250, 350 (Extreme)
  durationHours: number; // 1, 3, 6, 12, 24
  activeInterventions: Intervention[];
  soilSaturationInitial: number; // 0 - 100%
}

export interface RidgeToLakeImpactCascade {
  ridgeMountain: {
    runoffArrestedM3: number;
    slopeErosionPreventedTons: number;
    checkDamCapacityUtilizedPct: number;
    vegetativeBufferShieldHa: number;
  };
  middleFarmland: {
    topsoilSavedTons: number;
    farmlandProtectedHa: number;
    nutrientLossPreventedInr: number; // Value of NPK + Organic Carbon preserved in INR
    yieldLossMitigatedPct: number;
  };
  lowerLakes: {
    siltDivertedFromLakesTons: number;
    lakeDeadStorageSavedYears: number;
    municipalDredgingCostSavedInr: number; // Udaipur Municipal Corporation desiltation savings
    swaroopSagarLinkSafe: boolean;
  };
}

export interface SimulationResult {
  runoffVolumeCubicMeters: number;
  peakDischargeCms: number;
  erosionVolumeTons: number;
  farmlandInundationHa: number;
  lakeInflowVolumeMcm: number;
  runoffRiskLevel: 'Low' | 'Medium' | 'High' | 'Extreme';
  erosionRiskLevel: 'Low' | 'Medium' | 'High' | 'Extreme';
  waterRetentionGainPercent: number;
  baselineVsMitigated: {
    runoffReduction: number;
    erosionReduction: number;
    agriculturalSafetyIncrease: number;
    waterRetentionIncrease: number;
  };
  narrativeSummary: string;
  dataSource: DataSourceType;
  ridgeToLakeCascade?: RidgeToLakeImpactCascade;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'ai';
  timestamp: string;
  text?: string;
  structured?: {
    observation: string;
    cause: string;
    risk: string;
    recommendation: string;
  };
  contextReferenced?: string;
}

export interface TraceStep {
  step: number;
  title: string;
  locationName: string;
  latitude: number;
  longitude: number;
  height: number;
  heading: number;
  pitch: number;
  phenomenon: string;
  physicalProcess: string;
  consequence: string;
  recommendation: string;
}

export type AppViewMode =
  | 'watershed-3d'
  | 'simulation'
  | 'satellite'
  | 'interventions'
  | 'field-action'
  | 'overview';

export type SatelliteSeasonId = '2021-post' | '2023-drought' | '2024-normal' | '2026-current';

export interface SatelliteTimeSeriesPoint {
  id: SatelliteSeasonId;
  label: string;
  year: number;
  season: 'Pre-Monsoon' | 'Post-Monsoon' | 'Drought Phase' | 'Current';
  date: string;
  satellite: string;
  ndviMean: number;
  ndviDeltaPct: number;
  lakeExtentSqKm: number;
  waterSpreadDeltaPct: number;
  bareSoilDegradedSqKm: number;
  precipitationPrecedingMm: number;
  imageryOverlayUrl?: string;
  keyObservations: string;
  detectedHotspotCount: number;
}

export interface SatelliteDegradationZone {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  elevationM: number;
  spectralIndicator: 'NDVI Drop' | 'Water Extent Shrinkage' | 'Gully Expansion (BSI)';
  historicalLossPct: number;
  currentScore: number; // 0 to 1
  priority: 'CRITICAL' | 'HIGH' | 'MODERATE';
  groundInspectionRecommended: boolean;
  notes: string;
}

export interface FieldObservation {
  inspectorName: string;
  organization: string;
  inspectionDate: string;
  measuredGullyDepthM: number;
  measuredGullyWidthM: number;
  soilCompaction: 'Loose / Highly Friable' | 'Moderate' | 'Hard Baked / Crusted';
  soilMoistureObserved: 'Desiccated' | 'Damp' | 'Waterlogged';
  stoneAvailabilityNearby: boolean;
  communityConsulted: string;
  recommendedMeasure: string;
  fieldNotes: string;
  photoUploaded: boolean;
  photoUrl?: string;
}

export interface FieldMission {
  id: string;
  title: string;
  riskZoneId?: string;
  degradationZoneId?: string;
  priority: 'CRITICAL' | 'HIGH' | 'MODERATE';
  status: 'PENDING_INSPECTION' | 'IN_PROGRESS' | 'VERIFIED' | 'RESOLVED';
  gramPanchayat: string;
  village: string;
  assignedTo: string;
  targetCoordinates: {
    latitude: number;
    longitude: number;
    elevationM: number;
  };
  flaggedReason: string;
  satelliteEvidence: string;
  requiredMeasurements: string[];
  suggestedAction: string;
  fieldObservations?: FieldObservation;
  createdAt: string;
  updatedAt: string;
}

export interface UpstreamCatchmentTrace {
  lakeId: string;
  lakeName: string;
  catchmentAreaSqKm: number;
  mainTributaries: string[];
  mountainOrigins: {
    name: string;
    latitude: number;
    longitude: number;
    elevationM: number;
    role: string;
  }[];
  contributingRiskHotspots: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    soilLossTonPerYear: number;
  }[];
  agriculturalValleysInCorridor: {
    id: string;
    name: string;
    areaHa: number;
    soilType: string;
  }[];
  totalSiltDeliveryTonsPerYear: number;
  recommendedInterventions: string[];
}

export interface ActiveStormScenario {
  id: string;
  scenarioName: string;
  rainfallMm: number;
  durationHours: number;
  intensityMmH: number;
  soilSaturationPct: number;
  runoffVolumeMcm: number;
  peakDischargeCms: number;
  erosionVolumeTons: number;
  farmlandInundatedHa: number;
  lakeSiltYieldTons: number;
  lakeTurbiditySurgeNtu: number;
  checkDamStressPct: number;
  soilMoistureRechargePct: number;
  lakeLevelRiseMeters: number;
  simulatedAt: string;
  mitigated: boolean;
  activeInterventionsCount: number;
}

