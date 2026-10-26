'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  HERITAGE_CROPS,
  HeritageCrop,
} from '@/lib/solutions-data';
import {
  Award,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Compass,
  CreditCard,
  Droplets,
  ExternalLink,
  Flame,
  Home,
  Info,
  Layers,
  MapPin,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sprout,
  TrendingUp,
  Truck,
  Users,
  Waves,
  Wheat,
  X,
  FileText,
} from 'lucide-react';
import { ActiveStormScenario } from '@/lib/types';

interface HeritageCropMarketProps {
  onFlyToLocation?: (coords: { latitude: number; longitude: number; height?: number }) => void;
  onAskCopilot?: (context: string) => void;
  onOpenMap?: () => void;
  onNavigateToModule?: (view: string) => void;
  activeStormScenario?: ActiveStormScenario | null;
}

const CROP_PHOTOS: Record<string, string> = {
  'crop-desi-makka': '/images/smallholder_terraced_farming.jpg',
  'crop-safed-til': '/images/rajasthan_aravalli_hero.jpg',
  'crop-desi-chana': '/images/lake_pichola_watershed.jpg',
  'crop-van-amla': '/images/aravalli_ridge_conservation.jpg',
};

export const HeritageCropMarket: React.FC<HeritageCropMarketProps> = ({
  onFlyToLocation,
  onAskCopilot,
  onOpenMap,
  onNavigateToModule,
  activeStormScenario,
}) => {
  const [selectedCrop, setSelectedCrop] = useState<HeritageCrop>(HERITAGE_CROPS[0]);
  const [orderQuantityQuintals, setOrderQuantityQuintals] = useState<number>(10);
  const [isContractExecuted, setIsContractExecuted] = useState<boolean>(false);
  const [showContractModal, setShowContractModal] = useState<boolean>(false);
  const [showCropReasonModal, setShowCropReasonModal] = useState<boolean>(false);

  // Price gain % calculation
  const priceGainPercent = Math.round(
    ((selectedCrop.dharoharFairPriceInr - selectedCrop.mandiPricePerKgInr) / selectedCrop.mandiPricePerKgInr) * 100
  );

  const totalOrderValueInr = orderQuantityQuintals * 100 * selectedCrop.dharoharFairPriceInr;
  const extraIncomeEarnedInr =
    orderQuantityQuintals * 100 * (selectedCrop.dharoharFairPriceInr - selectedCrop.mandiPricePerKgInr);
  const waterConservedKL = Math.round(orderQuantityQuintals * 125 * (Math.abs(selectedCrop.waterConsumptionVsHybridPercent) / 100));

  const handleExecuteContract = (e: React.FormEvent) => {
    e.preventDefault();
    setIsContractExecuted(true);
    setShowContractModal(true);
  };

  const currentCropPhoto = CROP_PHOTOS[selectedCrop.id] || '/images/smallholder_terraced_farming.jpg';

  return (
    <div
      style={{
        padding: '16px 28px 40px 28px',
        backgroundColor: 'var(--bg-warm-ivory)',
        minHeight: '100%',
        color: 'var(--primary-text)',
      }}
    >
      {/* 1. Action Lab Sub-Navigation Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '6px 12px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--fine-border)',
          borderRadius: '9999px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          marginBottom: '14px',
          width: 'fit-content',
          margin: '0 auto 14px auto',
        }}
      >
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--antique-gold)', letterSpacing: '0.02em', paddingLeft: '4px' }}>
          ✦ Action Lab Modules:
        </span>

        {/* Module 1: Silt Loop */}
        <button
          onClick={() => onNavigateToModule?.('silt-loop')}
          className="apple-pressable"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            backgroundColor: '#F1EBDD',
            color: 'var(--primary-text)',
            borderRadius: '9999px',
            fontSize: '0.74rem',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Truck size={13} color="var(--primary-forest)" />
          <span>1. Circular Silt-to-Farm Loop</span>
        </button>

        {/* Module 2: Water Credits */}
        <button
          onClick={() => onNavigateToModule?.('water-credits')}
          className="apple-pressable"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            backgroundColor: '#F1EBDD',
            color: 'var(--primary-text)',
            borderRadius: '9999px',
            fontSize: '0.74rem',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Droplets size={13} color="var(--water-blue)" />
          <span>2. Hotel Water Credits (PES)</span>
        </button>

        {/* Module 3: Heritage Crop Market (Active) */}
        <button
          onClick={() => onNavigateToModule?.('heritage-crops')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            backgroundColor: 'var(--deep-green)',
            color: '#FFFFFF',
            borderRadius: '9999px',
            fontSize: '0.74rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Sprout size={13} color="#FCD34D" />
          <span>3. Heritage Crop Market</span>
        </button>

        {/* Module 4: Civil DPR */}
        <button
          onClick={() => onNavigateToModule?.('interventions')}
          className="apple-pressable"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            backgroundColor: '#F1EBDD',
            color: 'var(--primary-text)',
            borderRadius: '9999px',
            fontSize: '0.74rem',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <ShieldCheck size={13} color="var(--status-error)" />
          <span>4. Civil DPR & Check Dams</span>
        </button>
      </div>

      {/* Active Storm Simulation Impact Banner */}
      {activeStormScenario && (
        <div
          style={{
            marginBottom: '16px',
            backgroundColor: '#FFFFFF',
            border: '1.5px solid var(--antique-gold)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                backgroundColor: 'var(--deep-green)',
                color: '#FAF8F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Sprout size={18} color="#FCD34D" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.64rem', padding: '1px 6px', borderRadius: '3px', backgroundColor: '#EDF7EE', color: '#15803D', fontWeight: 800 }}>
                  ACTIVE CLIMATE SOIL MOISTURE
                </span>
                <span className="mono-text" style={{ fontSize: '0.72rem', color: 'var(--secondary-text)' }}>
                  {activeStormScenario.rainfallMm}mm • {activeStormScenario.intensityMmH} mm/hr Storm Event
                </span>
              </div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-forest)', marginTop: '2px' }}>
                Vadose Root-Zone Saturation: {activeStormScenario.soilMoistureRechargePct}% • Rainfed Desi Chana &amp; Barley yield outlook up +18%
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setShowCropReasonModal(true)}
              className="apple-pressable"
              style={{
                padding: '6px 12px',
                fontSize: '0.72rem',
                fontWeight: 600,
                backgroundColor: '#F1EBDD',
                border: '1px solid var(--antique-gold)',
                borderRadius: '4px',
                color: 'var(--primary-forest)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <FileText size={12} />
              <span>Why did this change? (Soil Vadose Rationale)</span>
            </button>

            <button
              onClick={() => onNavigateToModule?.('simulation')}
              className="apple-pressable"
              style={{
                padding: '6px 12px',
                fontSize: '0.72rem',
                fontWeight: 700,
                backgroundColor: 'var(--deep-green)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span>Modify Storm in Simulator ↺</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Breadcrumb Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--secondary-text)' }}>
          <Home size={14} color="var(--primary-forest)" style={{ cursor: 'pointer' }} />
          <span>/</span>
          <span style={{ color: 'var(--secondary-text)' }}>Action Lab (Solutions)</span>
          <span>/</span>
          <span
            style={{
              color: 'var(--primary-forest)',
              fontWeight: 700,
              backgroundColor: 'var(--surface-sandstone)',
              padding: '3px 10px',
              borderRadius: '6px',
              border: '1px solid var(--fine-border)',
            }}
          >
            Heritage Crop Market
          </span>
        </div>

        <button
          onClick={() => onOpenMap && onOpenMap()}
          className="apple-pressable"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            fontSize: '0.75rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--deep-green)',
            color: '#FFFFFF',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(16, 45, 35, 0.2)',
          }}
        >
          <span>Open 3D Map</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* 3. Hero Banner */}
      <div
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--fine-border)',
          boxShadow: 'var(--shadow-card)',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('/images/smallholder_terraced_farming.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            filter: 'brightness(0.80)',
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(142, 54, 29, 0.94) 0%, rgba(23, 61, 45, 0.90) 55%, rgba(23, 61, 45, 0.70) 100%)',
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            padding: '24px 28px 20px 28px',
            color: '#FAF8F2',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '3px 9px',
                borderRadius: '4px',
                backgroundColor: 'rgba(216, 181, 109, 0.22)',
                color: '#FCD34D',
                border: '1px solid rgba(216, 181, 109, 0.45)',
                letterSpacing: '0.04em',
              }}
            >
              ✦ कम पानी फसल एवं उचित मूल्य बाज़ार · HERITAGE SEED & FAIR MARKET RAIL
            </span>
            <span style={{ fontSize: '0.72rem', color: '#FDE68A', fontWeight: 500 }}>
              Low Water Demand • Guaranteed 2.47x Farmer Price Realization
            </span>
          </div>

          <h2
            className="royal-title notranslate"
            style={{
              fontSize: '1.60rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              margin: '0 0 6px 0',
              color: '#FFFFFF',
              lineHeight: 1.2,
            }}
          >
            HERITAGE CROP MARKET & WATER RECIPROCITY
          </h2>

          <p
            style={{
              fontSize: '0.80rem',
              color: '#FDE68A',
              lineHeight: 1.5,
              margin: '0 0 20px 0',
              maxWidth: '820px',
              fontWeight: 400,
            }}
          >
            Hybrid cash crops drain semi-arid aquifers. Dharohar promotes Mewar&apos;s drought-hardy indigenous seeds consuming up to 85% less water, linking tribal smallholders directly to Udaipur&apos;s luxury palace hotel dining tables at guaranteed 2.47x fair farmgate prices.
          </p>

          {/* 4 KPI Metric Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
            }}
          >
            {/* Card 1 */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                border: '1px solid var(--fine-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: '#EDF7EE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#15803D',
                  flexShrink: 0,
                }}
              >
                <Droplets size={18} />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803D', lineHeight: 1.1 }}>
                  -62% to -85%
                </div>
                <div style={{ fontSize: '0.70rem', fontWeight: 600, color: 'var(--primary-text)' }}>
                  Water Consumption
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--secondary-text)' }}>
                  Vs hybrid commercial seeds
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                border: '1px solid var(--fine-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: '#FEF3C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#B45309',
                  flexShrink: 0,
                }}
              >
                <TrendingUp size={18} />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#B45309', lineHeight: 1.1 }}>
                  2.47x Realization
                </div>
                <div style={{ fontSize: '0.70rem', fontWeight: 600, color: 'var(--primary-text)' }}>
                  Guaranteed Fair Price
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--secondary-text)' }}>
                  Over APMC mandi rate
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                border: '1px solid var(--fine-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: '#EBF5FB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--water-blue)',
                  flexShrink: 0,
                }}
              >
                <Wheat size={18} />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-forest)', lineHeight: 1.1 }}>
                  970 Quintals
                </div>
                <div style={{ fontSize: '0.70rem', fontWeight: 600, color: 'var(--primary-text)' }}>
                  Certified Annual Pool
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--secondary-text)' }}>
                  Nai, Bujhra, Alsigarh & Bansdara
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                border: '1px solid var(--fine-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: '#F3E8FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#7C3AED',
                  flexShrink: 0,
                }}
              >
                <Users size={18} />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-forest)', lineHeight: 1.1 }}>
                  ₹24.8 Lakhs
                </div>
                <div style={{ fontSize: '0.70rem', fontWeight: 600, color: 'var(--primary-text)' }}>
                  Direct Tribal Revenue
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--secondary-text)' }}>
                  Zero middlemen deduction
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Two-Column Workspace */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          gap: '20px',
        }}
      >
        {/* Left Column: Crop Selection List */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--fine-border)',
            padding: '18px 20px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
              paddingBottom: '8px',
              borderBottom: '1px solid var(--fine-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sprout size={16} color="var(--primary-forest)" />
              <h3 style={{ fontSize: '0.94rem', fontWeight: 800, margin: 0, color: 'var(--primary-forest)' }}>
                प्रमाणित धरोहर फसलें (Select Certified Heritage Crop)
              </h3>
            </div>
            <span style={{ fontSize: '0.70rem', color: 'var(--secondary-text)' }}>
              4 Varieties Verified
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {HERITAGE_CROPS.map((crop) => {
              const isSelected = selectedCrop.id === crop.id;
              const photo = CROP_PHOTOS[crop.id] || '/images/smallholder_terraced_farming.jpg';
              return (
                <div
                  key={crop.id}
                  onClick={() => {
                    setSelectedCrop(crop);
                  }}
                  className="apple-pressable"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: isSelected ? '1.5px solid var(--deep-green)' : '1px solid var(--fine-border)',
                    backgroundColor: isSelected ? '#F0FDF4' : '#FAFAFA',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      position: 'relative',
                      width: '64px',
                      height: '52px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: '1px solid var(--fine-border)',
                    }}
                  >
                    <Image src={photo} alt={crop.cropName} fill sizes="64px" style={{ objectFit: 'cover' }} />
                  </div>

                  {/* Crop Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                      <strong style={{ fontSize: '0.86rem', color: 'var(--primary-text)' }}>
                        {crop.cropName}
                      </strong>
                      <span
                        style={{
                          fontSize: '0.64rem',
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: '4px',
                          backgroundColor: '#EDF7EE',
                          color: '#15803D',
                          border: '1px solid #BBF7D0',
                        }}
                      >
                        {crop.waterConsumptionVsHybridPercent}% Water
                      </span>
                    </div>

                    <div style={{ fontSize: '0.70rem', color: 'var(--status-error)', fontWeight: 600, margin: '1px 0' }}>
                      {crop.hindiName}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--secondary-text)', marginTop: '4px' }}>
                      <span>📍 {crop.village} ({crop.producerGroup.split(' &')[0]})</span>
                      <span>Mandi: ₹{crop.mandiPricePerKgInr}/kg ➔ <strong style={{ color: '#15803D' }}>₹{crop.dharoharFairPriceInr}/kg</strong></span>
                    </div>
                  </div>

                  {/* Radio Indicator */}
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: isSelected ? '5px solid var(--deep-green)' : '2px solid var(--fine-border)',
                      backgroundColor: '#FFFFFF',
                      flexShrink: 0,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Hotel Procurement Contract Simulator */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--fine-border)',
            padding: '18px 22px',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--fine-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingBag size={16} color="var(--primary-forest)" />
                <h3 style={{ fontSize: '0.94rem', fontWeight: 800, margin: 0, color: 'var(--primary-forest)' }}>
                  सीधा होटल खरीद अनुबंध (Hotel Procurement Contract)
                </h3>
              </div>
              <span
                style={{
                  fontSize: '0.66rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: '#FEF3C7',
                  color: '#B45309',
                  border: '1px solid #FDE68A',
                }}
              >
                +{priceGainPercent}% Farmer Gain
              </span>
            </div>

            {/* Selected Crop Profile Snapshot */}
            <div
              style={{
                backgroundColor: '#FAFAFA',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--fine-border)',
                padding: '12px',
                marginBottom: '16px',
              }}
            >
              <h4 style={{ fontSize: '0.96rem', margin: '0 0 2px 0', color: 'var(--primary-forest)', fontWeight: 800 }}>
                {selectedCrop.cropName}
              </h4>
              <div style={{ fontSize: '0.72rem', color: 'var(--secondary-text)', marginBottom: '8px' }}>
                Producer: <strong>{selectedCrop.producerGroup}</strong>
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--secondary-text)', lineHeight: 1.45, marginBottom: '8px' }}>
                🌿 <strong>Nutritional Profile:</strong> {selectedCrop.nutritionalHighlights}
              </div>

              <div style={{ fontSize: '0.70rem', color: 'var(--primary-forest)', fontWeight: 600 }}>
                🏨 <strong>Contracted Hotel Buyers:</strong> {selectedCrop.contractedBuyers.join(' • ')}
              </div>
            </div>

            {/* Procurement Quantity Input Form */}
            <form onSubmit={handleExecuteContract}>
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                    Order Quantity (Quintals / 100 kg units):
                  </label>
                  <span style={{ fontSize: '1.10rem', fontWeight: 800, color: 'var(--primary-forest)' }}>
                    {orderQuantityQuintals} Quintals ({orderQuantityQuintals * 100} kg)
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={50}
                  step={1}
                  value={orderQuantityQuintals}
                  onChange={(e) => setOrderQuantityQuintals(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--deep-green)', cursor: 'pointer' }}
                />
              </div>

              {/* Economic & Environmental ROI */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  backgroundColor: '#F8FAFC',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--fine-border)',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.64rem', color: 'var(--secondary-text)' }}>Total Contract:</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-forest)' }}>
                    ₹{totalOrderValueInr.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.60rem', color: 'var(--secondary-text)' }}>₹{selectedCrop.dharoharFairPriceInr}/kg fair rate</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.64rem', color: 'var(--secondary-text)' }}>Extra Farmer Pay:</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#15803D' }}>
                    +₹{extraIncomeEarnedInr.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.60rem', color: 'var(--secondary-text)' }}>Over APMC middleman</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.64rem', color: 'var(--secondary-text)' }}>Aquifer Conserved:</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--water-blue)' }}>
                    {waterConservedKL} kL
                  </div>
                  <div style={{ fontSize: '0.60rem', color: 'var(--secondary-text)' }}>Groundwater saved</div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="apple-pressable"
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--deep-green)',
                  color: '#FFFFFF',
                  fontSize: '0.80rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 4px rgba(16, 45, 35, 0.2)',
                }}
              >
                <ShoppingBag size={15} />
                <span>Execute Fair Procurement Contract (₹{totalOrderValueInr.toLocaleString()})</span>
              </button>
            </form>
          </div>

          {/* QR Certification Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '14px',
              paddingTop: '10px',
              borderTop: '1px dashed var(--fine-border)',
              fontSize: '0.68rem',
              color: 'var(--secondary-text)',
            }}
          >
            <span>Traceability QR: <strong>{selectedCrop.watershedCertificationCode}</strong></span>
            <span style={{ color: 'var(--status-warning)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
              <QrCode size={13} /> Blockchain Verified
            </span>
          </div>
        </div>
      </div>

      {/* Contract Executed Modal */}
      {showContractModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(16, 45, 35, 0.70)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              width: '100%',
              maxWidth: '540px',
              border: '2px solid var(--antique-gold)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--deep-green)',
                color: '#FAF8F2',
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sprout size={18} color="#FCD34D" />
                <strong style={{ fontSize: '0.94rem' }}>
                  Mewar Fair Farmgate Purchase Agreement
                </strong>
              </div>
              <button
                onClick={() => setShowContractModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FAF8F2' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--antique-gold)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                DIRECT HOSPITALITY ➔ TRIBAL SHG PROCUREMENT
              </div>
              <h3 className="royal-title notranslate" style={{ fontSize: '1.35rem', margin: '6px 0 12px 0', color: 'var(--primary-forest)' }}>
                CONTRACT #ORD-{Date.now().toString().slice(-6)} EXECUTED
              </h3>

              <p style={{ fontSize: '0.76rem', color: 'var(--secondary-text)', lineHeight: 1.5, margin: '0 auto 16px auto', maxWidth: '420px' }}>
                Successfully locked purchase of <strong>{orderQuantityQuintals} Quintals</strong> of <strong>{selectedCrop.cropName}</strong> at guaranteed fair price of <strong>₹{selectedCrop.dharoharFairPriceInr}/kg</strong>. A net transfer of <strong>₹{totalOrderValueInr.toLocaleString()}</strong> has been routed directly to <strong>{selectedCrop.producerGroup}</strong>.
              </p>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  backgroundColor: '#EDF7EE',
                  borderRadius: '9999px',
                  color: '#15803D',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  marginBottom: '18px',
                }}
              >
                <CheckCircle2 size={14} />
                <span>Conserved {waterConservedKL} kL Aquifer Reserve in {selectedCrop.village}</span>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  onClick={() => setShowContractModal(false)}
                  className="apple-pressable"
                  style={{
                    padding: '8px 18px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--deep-green)',
                    color: '#FFFFFF',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Download Contract & Return
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Why Did Crop Moisture & Yield Outlook Change? */}
      {showCropReasonModal && activeStormScenario && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(16, 45, 35, 0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 110,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              width: '100%',
              maxWidth: '560px',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.22)',
              border: '2px solid var(--antique-gold)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--deep-green)',
                color: '#FAF8F2',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sprout size={18} color="#FCD34D" />
                <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800 }}>
                  Soil Vadose Recharge &amp; Agrarian Resilience Rationale
                </h3>
              </div>
              <button
                onClick={() => setShowCropReasonModal(false)}
                style={{ background: 'none', border: 'none', color: '#FAF8F2', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '20px', fontSize: '0.78rem', color: 'var(--primary-text)', lineHeight: 1.6 }}>
              <div style={{ backgroundColor: '#EDF7EE', border: '1px solid #BBF7D0', padding: '12px', borderRadius: '6px', marginBottom: '14px', color: '#15803D' }}>
                <strong>Active Storm Simulation:</strong> {activeStormScenario.scenarioName} ({activeStormScenario.rainfallMm}mm over {activeStormScenario.durationHours}h)
              </div>

              <h4 style={{ margin: '0 0 6px 0', fontSize: '0.86rem', color: 'var(--primary-forest)', fontWeight: 800 }}>
                1. Agrarian Root-Zone Vadose Saturation Comparison
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                <div style={{ padding: '10px', backgroundColor: 'var(--surface-sandstone)', borderRadius: '4px', border: '1px solid var(--fine-border)' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--secondary-text)' }}>Calm Season Baseline:</span>
                  <div className="mono-text" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--secondary-text)' }}>
                    35% Moisture
                  </div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--secondary-text)' }}>High irrigation deficit</div>
                </div>
                <div style={{ padding: '10px', backgroundColor: '#EDF7EE', borderRadius: '4px', border: '1px solid #BBF7D0' }}>
                  <span style={{ fontSize: '0.68rem', color: '#15803D' }}>Active Storm Vadose Recharge:</span>
                  <div className="mono-text" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#15803D' }}>
                    {activeStormScenario.soilMoistureRechargePct}% Saturation
                  </div>
                  <div style={{ fontSize: '0.64rem', color: '#15803D' }}>Tube-well run hours -38%</div>
                </div>
              </div>

              <h4 style={{ margin: '0 0 6px 0', fontSize: '0.86rem', color: 'var(--primary-forest)', fontWeight: 800 }}>
                2. Agronomic &amp; Vadose Hydrology Rationale
              </h4>
              <p style={{ margin: '0 0 10px 0', color: 'var(--secondary-text)' }}>
                Deep matrix infiltration into red gravelly loam and Inceptisols replenishes the capillary fringe and hard-rock aquifer fractures.
              </p>
              <ul style={{ paddingLeft: '18px', margin: '0 0 14px 0', color: 'var(--secondary-text)', fontSize: '0.74rem' }}>
                <li><strong>Rainfed Drought-Hardy Cultivars:</strong> Indigenous Desi Chana, Safed Til, and Makka develop deep taproot architectures that exploit this recharged vadose reserve without artificial groundwater over-draft.</li>
                <li><strong>Economic Benefit:</strong> Farmers in Bujhra and Nai avoid diesel irrigation pumping expenditures, preserving profit margins under Dharohar Direct Fair MSP Procurement.</li>
              </ul>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--fine-border)' }}>
                <button
                  onClick={() => setShowCropReasonModal(false)}
                  style={{ padding: '7px 14px', borderRadius: '4px', border: '1px solid var(--fine-border)', backgroundColor: '#FFFFFF', cursor: 'pointer', fontSize: '0.74rem' }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowCropReasonModal(false);
                    onNavigateToModule?.('simulation');
                  }}
                  className="apple-pressable"
                  style={{ padding: '7px 16px', borderRadius: '4px', backgroundColor: 'var(--deep-green)', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontSize: '0.74rem', fontWeight: 700 }}
                >
                  Adjust Storm in Simulator ➔
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
