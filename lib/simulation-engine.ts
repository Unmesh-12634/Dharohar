import { Intervention, SimulationParams, SimulationResult } from './types';

/**
 * Hydrological Simulation Engine for Aravalli Twin
 * 
 * Modeled on SCS-CN (Soil Conservation Service Curve Number) and
 * Rational Peak Discharge & Revised Universal Soil Loss Equation (RUSLE) principles.
 * 
 * NOTE: Labeled as 'Prototype environmental risk model'.
 * Not intended to replace a validated hydraulic engineering survey.
 */
export function runHydrologicalSimulation(params: SimulationParams): SimulationResult {
  const { rainfallMm, durationHours, activeInterventions = [], soilSaturationInitial = 40 } = params;

  // Catchment base parameters for Udaipur Pilot Study Area (284.5 km²)
  const catchmentAreaSqKm = 284.5;
  const catchmentAreaSqM = catchmentAreaSqKm * 1_000_000;

  // Rainfall intensity (mm/hour)
  const rainfallIntensityMmH = rainfallMm / Math.max(durationHours, 0.5);

  // Curve Number (CN) estimation:
  // Degraded Aravalli quartzite/phyllite slopes with sparse thorny scrub typically exhibit CN ~ 78-86.
  const baseCurveNumber = 82;
  // Saturation modifier
  const saturationModifier = (soilSaturationInitial - 40) * 0.15;
  const effectiveCN = Math.min(96, Math.max(65, baseCurveNumber + saturationModifier));

  // Potential maximum retention S (in mm) = (25400 / CN) - 254
  const potentialRetentionS = (25400 / effectiveCN) - 254;

  // Initial abstraction Ia = 0.2 * S
  const initialAbstraction = 0.2 * potentialRetentionS;

  // Effective direct runoff depth Q (mm):
  let directRunoffDepthMm = 0;
  if (rainfallMm > initialAbstraction) {
    directRunoffDepthMm = Math.pow(rainfallMm - initialAbstraction, 2) / (rainfallMm - initialAbstraction + potentialRetentionS);
  }

  // Base gross runoff volume in cubic meters
  const baseRunoffVolumeM3 = (directRunoffDepthMm / 1000) * catchmentAreaSqM;

  // Peak discharge calculation: Qp = (C * I * A) / 360
  // Rational runoff coefficient C ~ 0.45 - 0.75 for undulating stony hill terrain
  const runoffCoeffC = Math.min(0.85, 0.35 + (effectiveCN / 150));
  const basePeakDischargeCms = (runoffCoeffC * rainfallIntensityMmH * catchmentAreaSqKm) / 3.6;

  // USLE-based erosion factor estimation:
  // E = R (Rainfall erosivity) * K (Soil erodibility) * LS (Slope length/steepness) * C (Cover) * P (Practice)
  const rainfallErosivityR = Math.pow(rainfallMm, 1.3) * (rainfallIntensityMmH / 10);
  const soilErodibilityK = 0.038; // Inceptisols / red gravelly loam
  const slopeFactorLS = 4.2; // Steep Aravalli escarpment
  const coverFactorC = 0.48; // Degraded scrub
  const practiceFactorP = 0.95; // Minimal current conservation

  const baseErosionTons = (rainfallErosivityR * soilErodibilityK * slopeFactorLS * coverFactorC * practiceFactorP * catchmentAreaSqKm * 10);

  // Base farmland inundation (hectares)
  const baseFarmlandInundationHa = Math.min(680, (basePeakDischargeCms * 1.8) * (rainfallMm / 100));

  // Base lake inflow (Million Cubic Meters - MCM)
  const baseLakeInflowMcm = (baseRunoffVolumeM3 * 0.42) / 1_000_000;

  // Compute cumulative mitigation effects of active interventions
  let totalRunoffMitigationFraction = 0;
  let totalErosionMitigationFraction = 0;
  let totalRetentionGainFraction = 0;

  for (const intervention of activeInterventions) {
    const rRed = (intervention.runoffReductionPercent || 0) / 100;
    const eRed = (intervention.erosionMitigationPercent || 0) / 100;
    const retInc = (intervention.retentionIncreasePercent || 0) / 100;

    // Diminishing returns formula to avoid exceeding physical bounds
    totalRunoffMitigationFraction = 1 - (1 - totalRunoffMitigationFraction) * (1 - rRed * 0.35);
    totalErosionMitigationFraction = 1 - (1 - totalErosionMitigationFraction) * (1 - eRed * 0.35);
    totalRetentionGainFraction = Math.min(0.85, totalRetentionGainFraction + (retInc * 0.18));
  }

  // Mitigated values
  const finalRunoffVolume = baseRunoffVolumeM3 * (1 - totalRunoffMitigationFraction);
  const finalPeakDischarge = basePeakDischargeCms * (1 - totalRunoffMitigationFraction * 0.9);
  const finalErosionTons = baseErosionTons * (1 - totalErosionMitigationFraction);
  const finalFarmlandInundation = baseFarmlandInundationHa * (1 - totalRunoffMitigationFraction * 1.1);
  const finalLakeInflow = (finalRunoffVolume * 0.42) / 1_000_000;

  // Determine categorical risk levels
  let runoffRiskLevel: 'Low' | 'Medium' | 'High' | 'Extreme' = 'Low';
  if (finalPeakDischarge > 120) runoffRiskLevel = 'Extreme';
  else if (finalPeakDischarge > 65) runoffRiskLevel = 'High';
  else if (finalPeakDischarge > 30) runoffRiskLevel = 'Medium';

  let erosionRiskLevel: 'Low' | 'Medium' | 'High' | 'Extreme' = 'Low';
  if (finalErosionTons > 45000) erosionRiskLevel = 'Extreme';
  else if (finalErosionTons > 20000) erosionRiskLevel = 'High';
  else if (finalErosionTons > 8000) erosionRiskLevel = 'Medium';

  // Percentage reductions
  const runoffReductionPct = Math.round(totalRunoffMitigationFraction * 100);
  const erosionReductionPct = Math.round(totalErosionMitigationFraction * 100);
  const retentionGainPct = Math.round(totalRetentionGainFraction * 100);
  const agriSafetyPct = Math.round(
    baseFarmlandInundationHa > 0
      ? ((baseFarmlandInundationHa - finalFarmlandInundation) / baseFarmlandInundationHa) * 100
      : 0
  );

  // Scientific narrative summary
  let narrative = '';
  if (activeInterventions.length === 0) {
    narrative = `Baseline scenario: A ${rainfallMm} mm precipitation event over ${durationHours}h generates ~${(finalRunoffVolume / 1_000_000).toFixed(2)} MCM surface runoff with peak discharge of ${finalPeakDischarge.toFixed(1)} m³/s. Unmitigated steep slopes induce ${Math.round(finalErosionTons).toLocaleString()} metric tons of topsoil displacement into the Sisarma catchment and Lake Pichola.`;
  } else {
    narrative = `Mitigated scenario with ${activeInterventions.length} structural/ecological intervention(s): Runoff velocity is dampened by ${runoffReductionPct}%, arresting ~${Math.round(baseErosionTons - finalErosionTons).toLocaleString()} tons of sediment wash. Local groundwater retention increases by ${retentionGainPct}%, buffering smallholder farmland in Bujhra and Nai.`;
  }

  // Ridge-to-Lake 3-Tier Cascade Computations
  const runoffArrestedM3 = Math.max(0, Math.round(baseRunoffVolumeM3 - finalRunoffVolume));
  const totalErosionPreventedTons = Math.max(0, Math.round(baseErosionTons - finalErosionTons));
  const farmlandProtectedHa = parseFloat(Math.max(0, baseFarmlandInundationHa - finalFarmlandInundation).toFixed(1));
  const topsoilSavedTons = Math.round(totalErosionPreventedTons * 0.45);
  // ICAR standard valuation: ~₹380 value of plant-available NPK and humus preserved per ton
  const nutrientLossPreventedInr = Math.round(topsoilSavedTons * 380);
  const siltDivertedFromLakesTons = Math.round(totalErosionPreventedTons * 0.72);
  // Municipal Corporation dredging benchmark in Southern Rajasthan: ₹450 / ton mechanical removal
  const municipalDredgingCostSavedInr = Math.round(siltDivertedFromLakesTons * 450);
  const lakeDeadStorageSavedYears = parseFloat((siltDivertedFromLakesTons / 12500).toFixed(2));

  return {
    runoffVolumeCubicMeters: Math.round(finalRunoffVolume),
    peakDischargeCms: parseFloat(finalPeakDischarge.toFixed(1)),
    erosionVolumeTons: Math.round(finalErosionTons),
    farmlandInundationHa: parseFloat(finalFarmlandInundation.toFixed(1)),
    lakeInflowVolumeMcm: parseFloat(finalLakeInflow.toFixed(2)),
    runoffRiskLevel,
    erosionRiskLevel,
    waterRetentionGainPercent: retentionGainPct,
    baselineVsMitigated: {
      runoffReduction: runoffReductionPct,
      erosionReduction: erosionReductionPct,
      agriculturalSafetyIncrease: agriSafetyPct,
      waterRetentionIncrease: retentionGainPct,
    },
    narrativeSummary: narrative,
    dataSource: 'SIMULATED',
    ridgeToLakeCascade: {
      ridgeMountain: {
        runoffArrestedM3,
        slopeErosionPreventedTons: totalErosionPreventedTons,
        checkDamCapacityUtilizedPct: Math.min(98, Math.round(30 + (rainfallMm / 350) * 55)),
        vegetativeBufferShieldHa: Math.round(activeInterventions.length * 48 + 120),
      },
      middleFarmland: {
        topsoilSavedTons,
        farmlandProtectedHa,
        nutrientLossPreventedInr,
        yieldLossMitigatedPct: Math.min(45, Math.round(agriSafetyPct * 0.65)),
      },
      lowerLakes: {
        siltDivertedFromLakesTons,
        lakeDeadStorageSavedYears: Math.max(0.1, lakeDeadStorageSavedYears),
        municipalDredgingCostSavedInr,
        swaroopSagarLinkSafe: finalPeakDischarge < 85,
      },
    },
  };
}
