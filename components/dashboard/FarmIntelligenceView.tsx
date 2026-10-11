'use client';

import React, { useState } from 'react';
import { FARM_PARCELS } from '@/lib/geo-data';
import { FarmParcel } from '@/lib/types';
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Bot,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Coins,
  Compass,
  DollarSign,
  Droplet,
  Droplets,
  Layers,
  Leaf,
  MapPin,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sprout,
  Store,
  TrendingDown,
  TrendingUp,
  Truck,
  Users,
  Wallet,
  X,
} from 'lucide-react';

interface FarmIntelligenceViewProps {
  onNavigateToFarm: (farm: FarmParcel) => void;
  onAskCopilot: (farm: FarmParcel) => void;
}

interface MandiSpec {
  commodity: string;
  mspPerQtl: number;
  localMandiPerQtl: number;
  mandiLocation: string;
  brokerPerQtl: number;
  brokerDeductionReason: string;
  fpoLogisticsCostPerQtl: number;
}

export const FarmIntelligenceView: React.FC<FarmIntelligenceViewProps> = ({
  onNavigateToFarm,
  onAskCopilot,
}) => {
  const [selectedFarmId, setSelectedFarmId] = useState<string>(FARM_PARCELS[0].id);
  const selectedFarm = FARM_PARCELS.find((f) => f.id === selectedFarmId) || FARM_PARCELS[0];

  // Interactive Soil Restoration Practices state
  const [activePractices, setActivePractices] = useState<Record<string, boolean>>({
    vetiver: true,
    stoneBunds: true,
    biochar: false,
    johad: false,
  });

  // Harvest Volume for Live Mandi Arbitrage
  const [harvestQuintals, setHarvestQuintals] = useState<number>(35);
  const [isFpoModalOpen, setIsFpoModalOpen] = useState<boolean>(false);
  const [isPesEnrolled, setIsPesEnrolled] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'soil' | 'mandi' | 'pes'>('soil');

  // Mandi & Commodity Pricing Benchmarks calibrated for Mewar/Southern Rajasthan
  const mandiProfiles: Record<string, MandiSpec> = {
    'farm-nai-01': {
      commodity: 'Yellow Mustard (Sarson)',
      mspPerQtl: 5650,
      localMandiPerQtl: 5820,
      mandiLocation: 'Udaipur APMC (Savina Krishi Upaj Mandi)',
      brokerPerQtl: 4950,
      brokerDeductionReason: '12% arbitrary moisture dockage + ₹120/qtl village cash discount',
      fpoLogisticsCostPerQtl: 75,
    },
    'farm-bujhra-02': {
      commodity: 'Durum Wheat (Sharbati)',
      mspPerQtl: 2275,
      localMandiPerQtl: 2540,
      mandiLocation: 'Badgaon Sub-Mandi Yard',
      brokerPerQtl: 2180,
      brokerDeductionReason: 'Uncalibrated beam scale cut (3 kg/bag) + deferred delayed voucher',
      fpoLogisticsCostPerQtl: 45,
    },
    'farm-badgaon-03': {
      commodity: 'Semi-Arid Cherry Tomatoes / Vegetable Fodder',
      mspPerQtl: 2800,
      localMandiPerQtl: 3450,
      mandiLocation: 'Udaipur Perishables Terminal',
      brokerPerQtl: 2400,
      brokerDeductionReason: 'Perishability distress discount & informal transport levy',
      fpoLogisticsCostPerQtl: 90,
    },
    'farm-sisarma-04': {
      commodity: 'Rainfed Cluster Bean (Guar)',
      mspPerQtl: 6200,
      localMandiPerQtl: 6580,
      mandiLocation: 'Fatehnagar Agricultural Terminal',
      brokerPerQtl: 5400,
      brokerDeductionReason: '18% middleman commission & informal moneylender hypothecation',
      fpoLogisticsCostPerQtl: 110,
    },
  };

  const marketProfile = mandiProfiles[selectedFarm.id] || mandiProfiles['farm-nai-01'];

  // Toggle Soil Practice
  const togglePractice = (practiceKey: string) => {
    setActivePractices((prev) => ({
      ...prev,
      [practiceKey]: !prev[practiceKey],
    }));
  };

  // Live Scientific Soil Physics Calculation
  const baselineSoilLoss = selectedFarm.soilLossRateTonHaYear || 28.5;
  let practiceMultiplier = 1.0;
  if (activePractices.vetiver) practiceMultiplier *= 0.42; // Vetiver traps ~58% of sheet wash
  if (activePractices.stoneBunds) practiceMultiplier *= 0.55; // Stone bunds arrest ~45% of rill erosion
  if (activePractices.biochar) practiceMultiplier *= 0.82; // Increased aggregate stability
  if (activePractices.johad) practiceMultiplier *= 0.70; // Traps gully overflow

  const effectiveSoilLoss = Math.max(1.8, Math.round(baselineSoilLoss * practiceMultiplier * 10) / 10);
  const soilLossPreventedTonHa = Math.max(0, Math.round((baselineSoilLoss - effectiveSoilLoss) * 10) / 10);
  const totalSoilSavedParcelTons = Math.round(soilLossPreventedTonHa * selectedFarm.areaHa * 10) / 10;
  const isBelowTolerableLimit = effectiveSoilLoss <= 7.5; // ICAR tolerable soil loss ceiling: 7.5 t/ha/yr

  // Moisture & Carbon Metrics
  const baseMoistureRetention = 32;
  const moistureGainPercent =
    (activePractices.vetiver ? 14 : 0) +
    (activePractices.stoneBunds ? 10 : 0) +
    (activePractices.biochar ? 22 : 0) +
    (activePractices.johad ? 16 : 0);
  const totalMoistureRetention = Math.min(84, baseMoistureRetention + moistureGainPercent);

  // PES (Payment for Ecosystem Services) Economics
  // Udaipur Municipal Corporation dredging cost saved: ₹450 / ton of silt
  const siltDivertedFromLakePicholaTons = Math.round(totalSoilSavedParcelTons * 0.82 * 10) / 10;
  const municipalDredgingSavedInr = Math.round(siltDivertedFromLakePicholaTons * 450);
  // Farmer's direct PES dividend (50% of municipal dredging avoided + soil organic carbon credit)
  const pesCreditAnnualInr = Math.round(municipalDredgingSavedInr * 0.52 + selectedFarm.areaHa * 1250);

  // Mandi Financial Arbitrage Calculations
  const grossBrokerPayoutInr = harvestQuintals * marketProfile.brokerPerQtl;
  const grossMspFloorInr = harvestQuintals * marketProfile.mspPerQtl;
  const grossFpoMandiPayoutInr = harvestQuintals * (marketProfile.localMandiPerQtl - marketProfile.fpoLogisticsCostPerQtl);
  const netFarmerExtraGainInr = Math.max(0, grossFpoMandiPayoutInr - grossBrokerPayoutInr);
  const gainPercentage = Math.round((netFarmerExtraGainInr / grossBrokerPayoutInr) * 100);

  return (
    <div style={{
      maxWidth: '1160px',
      margin: '0 auto',
      padding: '28px 20px',
    }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <span className="badge badge-observed">Domain 4: Agri-Tech & Livelihoods</span>
          <span className="badge badge-live">Girwa Tribal Corridor</span>
          <span className="badge badge-modeled">USLE Physics & e-NAM Mandi Sync</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 className="serif-title" style={{ fontSize: '2.1rem', color: 'var(--color-forest)', marginBottom: '4px' }}>
              MEWAR BHOOMI: Smallholder Precision & Fair Market Engine
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '820px', lineHeight: 1.5 }}>
              Precision diagnostics for Southern Rajasthan's steep Aravalli terraced farms. Uniting live vegetative telemetry (NDVI), interactive USLE soil restoration physics, direct FPO mandi arbitrage, and downstream Lake Pichola Payment for Ecosystem Services (PES).
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onNavigateToFarm(selectedFarm)}
              className="btn btn-secondary"
              style={{ fontSize: '0.80rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Compass size={15} />
              Fly to 3D Parcel
            </button>
            <button
              onClick={() => onAskCopilot(selectedFarm)}
              className="btn btn-primary"
              style={{ fontSize: '0.80rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Bot size={15} />
              Agro-Copilot Advice
            </button>
          </div>
        </div>
      </div>

      {/* Farm Parcel Selector Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '12px',
        marginBottom: '24px',
      }}>
        {FARM_PARCELS.map((farm) => {
          const isSelected = farm.id === selectedFarm.id;
          return (
            <div
              key={farm.id}
              onClick={() => setSelectedFarmId(farm.id)}
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                border: isSelected ? '2px solid var(--color-forest)' : '1px solid var(--border-subtle)',
                backgroundColor: isSelected ? 'var(--color-forest-bg)' : 'var(--bg-card)',
                boxShadow: isSelected ? 'var(--shadow-card)' : 'var(--shadow-subtle)',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span className="mono-text" style={{ fontSize: '0.68rem', fontWeight: 600, color: isSelected ? 'var(--color-forest)' : 'var(--text-tertiary)' }}>
                  {farm.villageName.split(',')[0]}
                </span>
                <span className="badge" style={{
                  backgroundColor: farm.erosionExposure === 'Acute' ? '#FDF0EC' : '#F1F7F2',
                  color: farm.erosionExposure === 'Acute' ? 'var(--color-terracotta)' : 'var(--color-forest)',
                  fontSize: '0.62rem',
                }}>
                  {farm.erosionExposure} Erosion Risk
                </span>
              </div>
              <h4 style={{ fontSize: '0.90rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '3px' }}>
                {farm.name}
              </h4>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>
                {farm.areaHa} ha • {farm.cropType.split('/')[0]}
              </p>
            </div>
          );
        })}
      </div>

      {/* Section Navigation Pills */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '12px',
        marginBottom: '20px',
      }}>
        <button
          onClick={() => setActiveTab('soil')}
          style={{
            padding: '7px 16px',
            borderRadius: '20px',
            border: activeTab === 'soil' ? '1px solid var(--color-forest)' : '1px solid var(--border-subtle)',
            backgroundColor: activeTab === 'soil' ? 'var(--color-forest)' : 'transparent',
            color: activeTab === 'soil' ? '#FFFFFF' : 'var(--text-secondary)',
            fontSize: '0.80rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Sprout size={14} />
          1. Soil Diagnostics & Interactive Restoration Simulator
        </button>

        <button
          onClick={() => setActiveTab('mandi')}
          style={{
            padding: '7px 16px',
            borderRadius: '20px',
            border: activeTab === 'mandi' ? '1px solid #8A6E3D' : '1px solid var(--border-subtle)',
            backgroundColor: activeTab === 'mandi' ? '#8A6E3D' : 'transparent',
            color: activeTab === 'mandi' ? '#FFFFFF' : 'var(--text-secondary)',
            fontSize: '0.80rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <DollarSign size={14} />
          2. Fair Market Arbitrage & Direct FPO Dispatch
        </button>

        <button
          onClick={() => setActiveTab('pes')}
          style={{
            padding: '7px 16px',
            borderRadius: '20px',
            border: activeTab === 'pes' ? '1px solid var(--color-lake)' : '1px solid var(--border-subtle)',
            backgroundColor: activeTab === 'pes' ? 'var(--color-lake)' : 'transparent',
            color: activeTab === 'pes' ? '#FFFFFF' : 'var(--text-secondary)',
            fontSize: '0.80rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Coins size={14} />
          3. Lake Pichola "Ridge-to-Lake" PES Compact
        </button>
      </div>

      {/* TAB 1: SOIL DIAGNOSTICS & INTERACTIVE RESTORATION SIMULATOR */}
      {activeTab === 'soil' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {/* Column A: Satellite & Field Telemetry Card */}
          <div className="editorial-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ padding: '6px', backgroundColor: 'var(--color-forest-bg)', borderRadius: '4px', color: 'var(--color-forest)' }}>
                <Sprout size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Satellite & Field Telemetry
                </h3>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Girwa micro-watershed observation • {selectedFarm.villageName}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '18px' }}>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Satellite NDVI Vigor</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-forest)' }}>{selectedFarm.ndviScore}</div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>Sentinel-2 10m Multispectral</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Baseline Soil Loss (USLE)</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-terracotta)' }}>
                  {baselineSoilLoss} <span style={{ fontSize: '0.7rem' }}>t/ha/yr</span>
                </div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>Tolerable limit: 7.5 t/ha/yr</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Root Zone Water Deficit</div>
                <div style={{ fontSize: '0.98rem', fontWeight: 600, color: selectedFarm.waterStressIndex === 'Critical' ? 'var(--color-terracotta)' : 'var(--color-lake)' }}>
                  {selectedFarm.waterStressIndex}
                </div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>Pre-monsoon soil tension</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Soil Stratum & Relief</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {selectedFarm.soilType}
                </div>
                <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)' }}>{selectedFarm.elevationMeters || 620}m MSL elevation</div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              padding: '12px 14px',
              borderRadius: '4px',
              marginBottom: '16px',
            }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Active Cropping Schedule & Aquifer Vulnerability
              </span>
              <p style={{ fontSize: '0.80rem', color: 'var(--text-primary)', lineHeight: 1.5, margin: 0 }}>
                <strong>{selectedFarm.cropType}</strong>. CGWB classified local aquifer as <strong>{selectedFarm.cgwbAquiferStatus || 'Critical'}</strong>. Intercropping with low-water nitrogen-fixing pulses (Urad/Moong) is advised to regenerate depleted root horizons.
              </p>
            </div>

            <div style={{ fontSize: '0.70rem', color: 'var(--text-tertiary)' }}>
              Telemetry source: Krishi Vigyan Kendra (KVK) Badgaon & Central Ground Water Board (CGWB).
            </div>
          </div>

          {/* Column B: Interactive Regenerative Soil Restoration Simulator */}
          <div className="editorial-card" style={{ padding: '24px', border: '1.5px solid var(--color-forest)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ padding: '6px', backgroundColor: 'var(--color-forest-bg)', borderRadius: '4px', color: 'var(--color-forest)' }}>
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    Interactive Soil Restoration Simulator
                  </h3>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Select regenerative practices to simulate live soil loss reduction
                  </p>
                </div>
              </div>
              <span className="badge badge-simulated">Live USLE Physics</span>
            </div>

            {/* Practice Selection Checkboxes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
              <div
                onClick={() => togglePractice('vetiver')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: activePractices.vetiver ? '1.5px solid var(--color-forest)' : '1px solid var(--border-subtle)',
                  backgroundColor: activePractices.vetiver ? 'var(--color-forest-bg)' : 'var(--bg-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    backgroundColor: activePractices.vetiver ? 'var(--color-forest)' : '#FFFFFF',
                    border: '1px solid var(--color-forest)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                  }}>
                    {activePractices.vetiver && <Check size={14} />}
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.82rem', color: 'var(--text-primary)', display: 'block' }}>
                      Vetiver (Khus) Contour Hedgerows
                    </strong>
                    <span style={{ fontSize: '0.70rem', color: 'var(--text-secondary)' }}>
                      Deep root matrix reduces slope velocity by 58%, traps 88% sediment
                    </span>
                  </div>
                </div>
                <span className="badge" style={{ fontSize: '0.65rem', backgroundColor: '#E2F0D9', color: '#276A3C' }}>-58% Runoff</span>
              </div>

              <div
                onClick={() => togglePractice('stoneBunds')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: activePractices.stoneBunds ? '1.5px solid var(--color-forest)' : '1px solid var(--border-subtle)',
                  backgroundColor: activePractices.stoneBunds ? 'var(--color-forest-bg)' : 'var(--bg-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    backgroundColor: activePractices.stoneBunds ? 'var(--color-forest)' : '#FFFFFF',
                    border: '1px solid var(--color-forest)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                  }}>
                    {activePractices.stoneBunds && <Check size={14} />}
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.82rem', color: 'var(--text-primary)', display: 'block' }}>
                      Quartzite Stone Field Bunding & Silt Terraces
                    </strong>
                    <span style={{ fontSize: '0.70rem', color: 'var(--text-secondary)' }}>
                      0.6m quartzite stone walls arrest torrential gully cuts along slope
                    </span>
                  </div>
                </div>
                <span className="badge" style={{ fontSize: '0.65rem', backgroundColor: '#E2F0D9', color: '#276A3C' }}>-45% Erosion</span>
              </div>

              <div
                onClick={() => togglePractice('biochar')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: activePractices.biochar ? '1.5px solid var(--color-forest)' : '1px solid var(--border-subtle)',
                  backgroundColor: activePractices.biochar ? 'var(--color-forest-bg)' : 'var(--bg-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    backgroundColor: activePractices.biochar ? 'var(--color-forest)' : '#FFFFFF',
                    border: '1px solid var(--color-forest)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                  }}>
                    {activePractices.biochar && <Check size={14} />}
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.82rem', color: 'var(--text-primary)', display: 'block' }}>
                      Biochar & Farmyard Manure (FYM) Micro-Dosing
                    </strong>
                    <span style={{ fontSize: '0.70rem', color: 'var(--text-secondary)' }}>
                      2.5 t/ha pyrolyzed agricultural residue boosts water holding capacity
                    </span>
                  </div>
                </div>
                <span className="badge" style={{ fontSize: '0.65rem', backgroundColor: '#E2F0D9', color: '#276A3C' }}>+22% Moisture</span>
              </div>

              <div
                onClick={() => togglePractice('johad')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: activePractices.johad ? '1.5px solid var(--color-forest)' : '1px solid var(--border-subtle)',
                  backgroundColor: activePractices.johad ? 'var(--color-forest-bg)' : 'var(--bg-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    backgroundColor: activePractices.johad ? 'var(--color-forest)' : '#FFFFFF',
                    border: '1px solid var(--color-forest)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                  }}>
                    {activePractices.johad && <Check size={14} />}
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.82rem', color: 'var(--text-primary)', display: 'block' }}>
                      Micro-Johad / Farm Water Harvesting Pit (Khet Talai)
                    </strong>
                    <span style={{ fontSize: '0.70rem', color: 'var(--text-secondary)' }}>
                      Captures 1,200 m³ overflow; supplies 2 emergency supplementary irrigations
                    </span>
                  </div>
                </div>
                <span className="badge" style={{ fontSize: '0.65rem', backgroundColor: '#E2F0D9', color: '#276A3C' }}>Aquifer Recharge</span>
              </div>
            </div>

            {/* Real-time Simulated Outputs Board */}
            <div style={{
              backgroundColor: isBelowTolerableLimit ? '#F0F7F2' : '#FDF4F0',
              border: isBelowTolerableLimit ? '1.5px solid #6BA87E' : '1.5px solid #E08C75',
              padding: '14px',
              borderRadius: '6px',
              marginBottom: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: isBelowTolerableLimit ? 'var(--color-forest)' : 'var(--color-terracotta)' }}>
                  {isBelowTolerableLimit ? '✨ Sustainable Conservation Equilibrium Achieved' : '⚠️ Soil Erosion Still Exceeds Tolerable Limit'}
                </span>
                <span className="mono-text" style={{ fontSize: '0.70rem', color: 'var(--text-tertiary)' }}>
                  Parcels: {selectedFarm.areaHa} ha
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
                <div style={{ backgroundColor: '#FFFFFF', padding: '8px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: '0.64rem', color: 'var(--text-tertiary)' }}>Simulated Soil Loss</div>
                  <div style={{ fontSize: '1.20rem', fontWeight: 800, color: isBelowTolerableLimit ? 'var(--color-forest)' : 'var(--color-terracotta)' }}>
                    {effectiveSoilLoss} <span style={{ fontSize: '0.65rem' }}>t/ha/yr</span>
                  </div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>
                    {isBelowTolerableLimit ? 'Safe (<7.5)' : 'High (>7.5)'}
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '8px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: '0.64rem', color: 'var(--text-tertiary)' }}>Moisture Holding</div>
                  <div style={{ fontSize: '1.20rem', fontWeight: 800, color: 'var(--color-lake)' }}>
                    {totalMoistureRetention}%
                  </div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>
                    +{moistureGainPercent}% Buffering
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '8px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: '0.64rem', color: 'var(--text-tertiary)' }}>Topsoil Preserved</div>
                  <div style={{ fontSize: '1.20rem', fontWeight: 800, color: 'var(--color-forest)' }}>
                    {totalSoilSavedParcelTons} <span style={{ fontSize: '0.65rem' }}>tons</span>
                  </div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>
                    Per Kharif/Rabi cycle
                  </div>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
              Integrated recommendation: Aligning stone bunds with Vetiver hedgerows reduces sediment velocity below the critical erosive threshold (0.6 m/s), trapping rich organic fines that safeguard soil fertility.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: FAIR MARKET ARBITRAGE & DIRECT FPO DISPATCH */}
      {activeTab === 'mandi' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {/* Column A: Mandi Rate Comparison & Harvest Volume Slider */}
          <div className="editorial-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ padding: '6px', backgroundColor: '#FAF6ED', borderRadius: '4px', color: '#8A6E3D' }}>
                <Store size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Live APMC Mandi vs Middleman Arbitrage
                </h3>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Real-time price transparency for {marketProfile.commodity}
                </p>
              </div>
            </div>

            {/* Harvest Volume Slider */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              padding: '14px',
              borderRadius: '6px',
              marginBottom: '18px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Estimated Harvest Volume to Market:
                </label>
                <span className="mono-text" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-forest)' }}>
                  {harvestQuintals} Quintals ({Math.round(harvestQuintals * 100)} kg)
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={harvestQuintals}
                onChange={(e) => setHarvestQuintals(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--color-forest)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                <span>10 qtl (Marginal Plot)</span>
                <span>35 qtl (Average Holding)</span>
                <span>100 qtl (Aggregated FPO Cluster)</span>
              </div>
            </div>

            {/* Three-Way Price Comparison */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                backgroundColor: '#FDF3EE',
                border: '1px solid rgba(189, 86, 55, 0.25)',
                padding: '10px 14px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-terracotta)', fontWeight: 600, textTransform: 'uppercase', display: 'block' }}>
                    1. Predatory Village Broker / Middleman
                  </span>
                  <strong style={{ fontSize: '0.98rem', color: 'var(--color-terracotta)' }}>
                    ₹ {marketProfile.brokerPerQtl.toLocaleString()} / qtl
                  </strong>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                    {marketProfile.brokerDeductionReason}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>Total Farmer Cash</div>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--color-terracotta)' }}>
                    ₹ {grossBrokerPayoutInr.toLocaleString()}
                  </strong>
                </div>
              </div>

              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                padding: '10px 14px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', display: 'block' }}>
                    2. Official Govt Minimum Support Price (MSP)
                  </span>
                  <strong style={{ fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                    ₹ {marketProfile.mspPerQtl.toLocaleString()} / qtl
                  </strong>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                    Guaranteed baseline procurement rate
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>Govt MSP Benchmark</div>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                    ₹ {grossMspFloorInr.toLocaleString()}
                  </strong>
                </div>
              </div>

              <div style={{
                backgroundColor: '#F0F7F2',
                border: '1.5px solid var(--color-forest)',
                padding: '10px 14px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-forest)', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                    3. Mewar Krishak FPO Direct Mandi Dispatch
                  </span>
                  <strong style={{ fontSize: '1.02rem', color: 'var(--color-forest)' }}>
                    ₹ {marketProfile.localMandiPerQtl.toLocaleString()} / qtl
                  </strong>
                  <div style={{ fontSize: '0.68rem', color: 'var(--color-forest)' }}>
                    {marketProfile.mandiLocation} (less ₹{marketProfile.fpoLogisticsCostPerQtl}/qtl bulk freight)
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--color-forest)' }}>Net FPO Realization</div>
                  <strong style={{ fontSize: '1.15rem', color: 'var(--color-forest)' }}>
                    ₹ {grossFpoMandiPayoutInr.toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Column B: Net Realization Card & One-Click FPO Dispatch Booking */}
          <div className="editorial-card" style={{ padding: '24px', backgroundColor: '#FAF7F0', border: '1.5px solid #C9A24D' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ padding: '6px', backgroundColor: '#FFFFFF', borderRadius: '4px', color: '#8A6E3D' }}>
                <TrendingUp size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#4A3B18', margin: 0 }}>
                  Farmer Empowerment & Margin Liberation
                </h3>
                <p style={{ fontSize: '0.72rem', color: '#735F2B', margin: 0 }}>
                  Bypassing debt bondage & asymmetric village trading
                </p>
              </div>
            </div>

            {/* Big Gain Callout */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #8A6E3D',
              borderRadius: '8px',
              padding: '18px',
              textAlign: 'center',
              marginBottom: '18px',
              boxShadow: '0 2px 6px rgba(138, 110, 61, 0.12)',
            }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#8A6E3D', letterSpacing: '0.04em' }}>
                Direct Cash Gain in Farmer's Pocket
              </span>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-forest)', margin: '4px 0' }}>
                +₹ {netFarmerExtraGainInr.toLocaleString()}
              </div>
              <span className="badge" style={{ backgroundColor: '#E2F0D9', color: '#276A3C', fontSize: '0.76rem', fontWeight: 700 }}>
                +{gainPercentage}% Higher Margin via Collective Dispatch
              </span>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '8px', marginBottom: 0 }}>
                For {harvestQuintals} quintals of {marketProfile.commodity}, pooling with Mewar Krishak FPO prevents an unfair loss of ₹{netFarmerExtraGainInr.toLocaleString()} to village brokers.
              </p>
            </div>

            {/* Dispatch Features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#54411F' }}>
                <CheckCircle2 size={16} color="var(--color-forest)" style={{ flexShrink: 0 }} />
                <span><strong>Calibrated Digital Weighing:</strong> Zero dockage or unmeasured scale manipulation.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#54411F' }}>
                <CheckCircle2 size={16} color="var(--color-forest)" style={{ flexShrink: 0 }} />
                <span><strong>Instant e-NAM Electronic Gate Pass:</strong> Live transparent competitive bidding.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#54411F' }}>
                <CheckCircle2 size={16} color="var(--color-forest)" style={{ flexShrink: 0 }} />
                <span><strong>Direct DBT / UPI Settlement:</strong> Bank transfer within 24 hours of mandi sale.</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setIsFpoModalOpen(true)}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.86rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: 'var(--color-forest)',
              }}
            >
              <Truck size={16} />
              Book FPO Collective Truck Dispatch
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: LAKE PICHOLA PAYMENT FOR ECOSYSTEM SERVICES (PES) */}
      {activeTab === 'pes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {/* Column A: Ridge-to-Lake Closed Loop Explanation */}
          <div className="editorial-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ padding: '6px', backgroundColor: 'var(--color-lake-bg)', borderRadius: '4px', color: 'var(--color-lake)' }}>
                <Droplets size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  The "Ridge-to-Lake" Ecological Compact
                </h3>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Connecting Aravalli hillside farming directly to Udaipur lake defense
                </p>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '16px' }}>
              For centuries, the lakes of Udaipur (Pichola, Fateh Sagar, Badi, and Swaroop Sagar) have suffered from silt choking caused by severe soil erosion on the upstream Aravalli hills. The Udaipur Municipal Corporation and Lake Development Authority spend massive budgets annually on mechanical desiltation dredgers.
            </p>

            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              padding: '14px',
              borderRadius: '6px',
              marginBottom: '16px',
            }}>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-forest)', marginBottom: '8px', textTransform: 'uppercase' }}>
                How the Ecosystem Service Pact Works:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'var(--color-forest)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0 }}>1</div>
                  <span><strong>Upstream Conservation:</strong> Farmer installs stone bunds & Vetiver hedges in {selectedFarm.villageName.split(',')[0]}, stopping <strong>{totalSoilSavedParcelTons} tons</strong> of sediment from washing down.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'var(--color-lake)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0 }}>2</div>
                  <span><strong>Lake Protection:</strong> <strong>{siltDivertedFromLakePicholaTons} tons</strong> of silt is prevented from entering Lake Pichola, preserving lake water quality and storage lifespan.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#8A6E3D', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0 }}>3</div>
                  <span><strong>Municipal Savings Shared:</strong> The Municipal Corporation saves <strong>₹{municipalDredgingSavedInr.toLocaleString()}</strong> in dredging fees, returning 52% directly as a Soil Stewardship Credit to the farmer!</span>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.70rem', color: 'var(--text-tertiary)' }}>
              Modeled after the Catskills Watershed Agreement & ICAR Natural Resource Stewardship Guidelines.
            </div>
          </div>

          {/* Column B: PES Credit Card & Enrollment Gateway */}
          <div className="editorial-card" style={{ padding: '24px', border: '1.5px solid var(--color-lake)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ padding: '6px', backgroundColor: 'var(--color-lake-bg)', borderRadius: '4px', color: 'var(--color-lake)' }}>
                <Coins size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Farmer Soil Conservation Dividend
                </h3>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Direct Benefit Transfer (DBT) for verified soil stewardship
                </p>
              </div>
            </div>

            {/* Dividend Board */}
            <div style={{
              backgroundColor: '#F0F6FA',
              border: '2px solid var(--color-lake)',
              borderRadius: '8px',
              padding: '18px',
              textAlign: 'center',
              marginBottom: '18px',
            }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-lake)' }}>
                Estimated Annual PES Lake Credit Payout
              </span>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-lake)', margin: '4px 0' }}>
                ₹ {pesCreditAnnualInr.toLocaleString()} <span style={{ fontSize: '0.85rem' }}>/ year</span>
              </div>
              <span className="badge" style={{ backgroundColor: '#E1EEF6', color: 'var(--color-lake)', fontSize: '0.72rem', fontWeight: 600 }}>
                Based on {totalSoilSavedParcelTons} tons topsoil retained on {selectedFarm.areaHa} ha
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '18px' }}>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.64rem', color: 'var(--text-tertiary)' }}>Silt Kept Out of Pichola</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-forest)' }}>
                  {siltDivertedFromLakePicholaTons} <span style={{ fontSize: '0.65rem' }}>tons</span>
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>Pre-catchment interception</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.64rem', color: 'var(--text-tertiary)' }}>Municipal Dredging Saved</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ₹ {municipalDredgingSavedInr.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>At ₹450 / m³ dredging rate</div>
              </div>
            </div>

            {/* PES Enrollment Button */}
            {isPesEnrolled ? (
              <div style={{
                backgroundColor: '#F0F7F2',
                border: '1px solid var(--color-forest)',
                padding: '12px',
                borderRadius: '6px',
                textAlign: 'center',
                color: 'var(--color-forest)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 700, fontSize: '0.84rem' }}>
                  <CheckCircle2 size={16} />
                  Enrolled in Mewar Lake Stewardship PES Registry
                </div>
                <p style={{ fontSize: '0.72rem', margin: '4px 0 0 0' }}>
                  Verification Token: <strong>MEWAR-PES-{selectedFarm.id.toUpperCase()}-2026</strong>. Credited quarterly via Aadhaar Payment Bridge.
                </p>
              </div>
            ) : (
              <button
                onClick={() => setIsPesEnrolled(true)}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '0.86rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--color-lake)',
                }}
              >
                <Award size={16} />
                Enroll Parcel in Mewar Lake Stewardship Credit
              </button>
            )}
          </div>
        </div>
      )}

      {/* FPO Truck Dispatch Modal */}
      {isFpoModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(28, 34, 32, 0.55)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-popover)',
            width: '100%',
            maxWidth: '560px',
            padding: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={20} color="var(--color-forest)" />
                <h3 className="serif-title" style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>
                  Confirm FPO Collective Truck Dispatch
                </h3>
              </div>
              <button
                onClick={() => setIsFpoModalOpen(false)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ backgroundColor: '#F0F7F2', padding: '14px', borderRadius: '6px', marginBottom: '16px', border: '1px solid rgba(30, 58, 43, 0.15)' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--color-forest)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                Dispatch Itinerary
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {selectedFarm.name} ({selectedFarm.villageName})
              </div>
              <div style={{ fontSize: '0.80rem', color: 'var(--text-secondary)' }}>
                Commodity: {marketProfile.commodity} • Quantity: <strong>{harvestQuintals} Quintals</strong>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.80rem', color: 'var(--text-primary)', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Designated Cluster Hub:</span>
                <strong>Girwa Farmers Aggregation Chaupal #02</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Target Destination:</span>
                <strong>{marketProfile.mandiLocation}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Collective Freight Cost:</span>
                <span>₹ {marketProfile.fpoLogisticsCostPerQtl} / qtl (Pooled bulk rate)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Net Settlement Payout:</span>
                <strong style={{ color: 'var(--color-forest)', fontSize: '0.95rem' }}>₹ {grossFpoMandiPayoutInr.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Estimated Extra Gain vs Middleman:</span>
                <strong style={{ color: 'var(--color-forest)' }}>+₹ {netFarmerExtraGainInr.toLocaleString()} (+{gainPercentage}%)</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setIsFpoModalOpen(false)}
                className="btn btn-secondary"
                style={{ flex: 1, fontSize: '0.82rem' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Success! Dispatch booked with Mewar Krishak FPO. Truck scheduled for arrival at Girwa Cluster Chaupal tomorrow at 08:30 AM.`);
                  setIsFpoModalOpen(false);
                }}
                className="btn btn-primary"
                style={{ flex: 1, fontSize: '0.82rem', backgroundColor: 'var(--color-forest)' }}
              >
                Confirm Booking & Generate Gate Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
