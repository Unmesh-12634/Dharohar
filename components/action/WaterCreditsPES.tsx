'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  WATER_CREDIT_CHECK_DAMS,
  HOSPITALITY_SPONSORS,
  WaterCreditCheckDam,
  HospitalitySponsor,
} from '@/lib/solutions-data';
import {
  Award,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  Compass,
  CreditCard,
  DollarSign,
  Download,
  Droplets,
  ExternalLink,
  HeartHandshake,
  Home,
  Info,
  Layers,
  MapPin,
  QrCode,
  ShieldCheck,
  Sparkles,
  Sprout,
  TrendingDown,
  TrendingUp,
  Truck,
  Users,
  Waves,
  X,
} from 'lucide-react';

interface WaterCreditsPESProps {
  onFlyToLocation?: (coords: { latitude: number; longitude: number; height?: number }) => void;
  onAskCopilot?: (context: string) => void;
  onOpenMap?: () => void;
  onNavigateToModule?: (view: string) => void;
}

export const WaterCreditsPES: React.FC<WaterCreditsPESProps> = ({
  onFlyToLocation,
  onAskCopilot,
  onOpenMap,
  onNavigateToModule,
}) => {
  const [damsList, setDamsList] = useState<WaterCreditCheckDam[]>(WATER_CREDIT_CHECK_DAMS);
  const [selectedDam, setSelectedDam] = useState<WaterCreditCheckDam>(WATER_CREDIT_CHECK_DAMS[0]);
  const [selectedSponsor, setSelectedSponsor] = useState<HospitalitySponsor>(HOSPITALITY_SPONSORS[0]);
  const [creditsToPledge, setCreditsToPledge] = useState<number>(25);
  const [isPledged, setIsPledged] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'REGISTRY' | 'CHECK_DAMS' | 'PLEDGE'>('REGISTRY');
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  // Dynamic calculations based on credits
  const totalCostInr = creditsToPledge * selectedDam.creditPriceInr;
  const siltTrappedTonnes = creditsToPledge * 10;
  const floodBufferedLiters = creditsToPledge * 25000;
  const mandaysCreated = Math.ceil(creditsToPledge * 3.4);

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPledged(true);
    // Real in-place problem resolution: update dam funding progress bar live
    setDamsList((prev) =>
      prev.map((d) =>
        d.id === selectedDam.id
          ? {
              ...d,
              sponsoredCredits: Math.min(d.sponsoredCredits + creditsToPledge, d.availableCredits + d.sponsoredCredits),
              availableCredits: Math.max(0, d.availableCredits - creditsToPledge),
            }
          : d
      )
    );
    setSelectedDam((prev) => ({
      ...prev,
      sponsoredCredits: Math.min(prev.sponsoredCredits + creditsToPledge, prev.availableCredits + prev.sponsoredCredits),
      availableCredits: Math.max(0, prev.availableCredits - creditsToPledge),
    }));
    setShowCertificateModal(true);
  };

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

        {/* Module 2: Water Credits (Active) */}
        <button
          onClick={() => onNavigateToModule?.('water-credits')}
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
          <Droplets size={13} color="#FCD34D" />
          <span>2. Hotel Water Credits (PES)</span>
        </button>

        {/* Module 3: Heritage Crop Market */}
        <button
          onClick={() => onNavigateToModule?.('heritage-crops')}
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
          <Sprout size={13} color="var(--status-warning)" />
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
            Hotel Water Credits (PES)
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
            backgroundImage: `url('/images/lake_pichola_watershed.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%',
            filter: 'brightness(0.80)',
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(16, 45, 35, 0.94) 0%, rgba(27, 73, 101, 0.88) 55%, rgba(23, 61, 45, 0.70) 100%)',
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
              ✦ पर्यावरण सेवा भुगतान • PAYMENT FOR ECOSYSTEM SERVICES (PES)
            </span>
            <span style={{ fontSize: '0.72rem', color: '#93C5FD', fontWeight: 500 }}>
              Urban Lakefront Hospitality 🤝 Upstream Aravalli Check Dams
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
            HOTEL WATER CREDITS (PES) MARKET
          </h2>

          <p
            style={{
              fontSize: '0.80rem',
              color: '#E0E7FF',
              lineHeight: 1.5,
              margin: '0 0 20px 0',
              maxWidth: '820px',
              fontWeight: 400,
            }}
          >
            Udaipur&apos;s ₹4,000 Crore luxury tourism sector relies on clean, full lakes. Dharohar creates India&apos;s first verified Watershed PES marketplace—enabling 5-star hotels and CSR donors to directly sponsor upstream mountain check dams, turning hotel room views into guaranteed rural watershed wages.
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
                  backgroundColor: '#EBF5FB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--water-blue)',
                  flexShrink: 0,
                }}
              >
                <Droplets size={18} />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-forest)', lineHeight: 1.1 }}>
                  ₹1,800
                </div>
                <div style={{ fontSize: '0.70rem', fontWeight: 600, color: 'var(--primary-text)' }}>
                  1 Water Credit
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--secondary-text)' }}>
                  Regulated unit price
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
                <Truck size={18} />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#B45309', lineHeight: 1.1 }}>
                  10.0 Tonnes
                </div>
                <div style={{ fontSize: '0.70rem', fontWeight: 600, color: 'var(--primary-text)' }}>
                  Silt Trapped Per Credit
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--secondary-text)' }}>
                  Kept out of Pichola dead storage
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
                  backgroundColor: '#EDF7EE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#15803D',
                  flexShrink: 0,
                }}
              >
                <Waves size={18} />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803D', lineHeight: 1.1 }}>
                  25,000 L
                </div>
                <div style={{ fontSize: '0.70rem', fontWeight: 600, color: 'var(--primary-text)' }}>
                  Flood Runoff Buffered
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--secondary-text)' }}>
                  Aquifer recharge per credit
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
                <Building2 size={18} />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-forest)', lineHeight: 1.1 }}>
                  ₹9.27 Lakhs
                </div>
                <div style={{ fontSize: '0.70rem', fontWeight: 600, color: 'var(--primary-text)' }}>
                  Active Hotel CSR Pool
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--secondary-text)' }}>
                  515 credits verified funded
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Sub-Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
        <button
          onClick={() => setActiveTab('REGISTRY')}
          className="apple-pressable"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            fontSize: '0.80rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-sm)',
            backgroundColor: activeTab === 'REGISTRY' ? 'var(--deep-green)' : '#FFFFFF',
            color: activeTab === 'REGISTRY' ? '#FFFFFF' : 'var(--primary-text)',
            border: activeTab === 'REGISTRY' ? '1px solid var(--deep-green)' : '1px solid var(--fine-border)',
            cursor: 'pointer',
            boxShadow: activeTab === 'REGISTRY' ? '0 2px 5px rgba(16, 45, 35, 0.2)' : '0 1px 2px rgba(0,0,0,0.03)',
            transition: 'all 0.15s ease',
          }}
        >
          <Building2 size={15} color={activeTab === 'REGISTRY' ? '#FCD34D' : 'var(--secondary-sage)'} />
          <span>1. Hospitality CSR Registry</span>
        </button>

        <button
          onClick={() => setActiveTab('CHECK_DAMS')}
          className="apple-pressable"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            fontSize: '0.80rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-sm)',
            backgroundColor: activeTab === 'CHECK_DAMS' ? 'var(--deep-green)' : '#FFFFFF',
            color: activeTab === 'CHECK_DAMS' ? '#FFFFFF' : 'var(--primary-text)',
            border: activeTab === 'CHECK_DAMS' ? '1px solid var(--deep-green)' : '1px solid var(--fine-border)',
            cursor: 'pointer',
            boxShadow: activeTab === 'CHECK_DAMS' ? '0 2px 5px rgba(16, 45, 35, 0.2)' : '0 1px 2px rgba(0,0,0,0.03)',
            transition: 'all 0.15s ease',
          }}
        >
          <ShieldCheck size={15} color={activeTab === 'CHECK_DAMS' ? '#FCD34D' : 'var(--secondary-sage)'} />
          <span>2. Verified Check Dam Assets</span>
        </button>

        <button
          onClick={() => setActiveTab('PLEDGE')}
          className="apple-pressable"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            fontSize: '0.80rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-sm)',
            backgroundColor: activeTab === 'PLEDGE' ? 'var(--deep-green)' : '#FFFFFF',
            color: activeTab === 'PLEDGE' ? '#FFFFFF' : 'var(--primary-text)',
            border: activeTab === 'PLEDGE' ? '1px solid var(--deep-green)' : '1px solid var(--fine-border)',
            cursor: 'pointer',
            boxShadow: activeTab === 'PLEDGE' ? '0 2px 5px rgba(16, 45, 35, 0.2)' : '0 1px 2px rgba(0,0,0,0.03)',
            transition: 'all 0.15s ease',
          }}
        >
          <CreditCard size={15} color={activeTab === 'PLEDGE' ? '#FCD34D' : 'var(--secondary-sage)'} />
          <span>3. Pledge & Sponsor Calculator</span>
        </button>
      </div>

      {/* 5. Tab 1: Hospitality CSR Registry */}
      {activeTab === 'REGISTRY' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {HOSPITALITY_SPONSORS.map((sponsor) => (
            <div
              key={sponsor.id}
              onClick={() => {
                setSelectedSponsor(sponsor);
                setActiveTab('PLEDGE');
              }}
              className="apple-pressable"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: selectedSponsor.id === sponsor.id ? '1.5px solid var(--deep-green)' : '1px solid var(--fine-border)',
                padding: '18px 20px',
                boxShadow: 'var(--shadow-card)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span
                  style={{
                    backgroundColor: 'var(--surface-sandstone)',
                    color: 'var(--primary-forest)',
                    fontSize: '0.67rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: '1px solid var(--antique-gold)',
                  }}
                >
                  {sponsor.propertyType}
                </span>
                <span
                  style={{
                    fontSize: '0.67rem',
                    color: '#059669',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: '#EDF7EE',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: '1px solid #BBF7D0',
                  }}
                >
                  <Award size={13} /> {sponsor.status}
                </span>
              </div>

              <h4 style={{ fontSize: '1.05rem', margin: '0 0 4px 0', color: 'var(--primary-forest)', fontWeight: 800 }}>
                {sponsor.name}
              </h4>
              <p style={{ fontSize: '0.72rem', color: 'var(--secondary-text)', margin: '0 0 10px 0' }}>
                📍 {sponsor.location}
              </p>

              <blockquote
                style={{
                  fontSize: '0.74rem',
                  fontStyle: 'italic',
                  color: 'var(--secondary-text)',
                  margin: '0 0 12px 0',
                  paddingLeft: '10px',
                  borderLeft: '2.5px solid var(--antique-gold)',
                  lineHeight: 1.45,
                }}
              >
                &ldquo;{sponsor.quote}&rdquo;
              </blockquote>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px',
                  backgroundColor: '#FAFAFA',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.72rem',
                  border: '1px solid var(--fine-border)',
                }}
              >
                <div>
                  <span style={{ color: 'var(--secondary-text)' }}>Credits Funded:</span>
                  <div style={{ fontWeight: 800, color: 'var(--water-blue)', fontSize: '0.94rem' }}>
                    {sponsor.creditsPurchased} Credits
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--secondary-text)' }}>Total Contribution:</span>
                  <div style={{ fontWeight: 800, color: '#059669', fontSize: '0.94rem' }}>
                    ₹{sponsor.totalContributionInr.toLocaleString()}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '12px',
                  fontSize: '0.68rem',
                  color: 'var(--secondary-text)',
                }}
              >
                <span>CSR File: <strong>{sponsor.csrCode}</strong></span>
                <span style={{ color: 'var(--deep-green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  Select for Water Pledge ➔
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. Tab 2: Verified Check Dam Assets */}
      {activeTab === 'CHECK_DAMS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
          {damsList.map((dam) => {
            const isSelected = selectedDam.id === dam.id;
            const totalRequired = dam.availableCredits + dam.sponsoredCredits;
            const progressPct = Math.round((dam.sponsoredCredits / totalRequired) * 100);
            return (
              <div
                key={dam.id}
                onClick={() => {
                  setSelectedDam(dam);
                }}
                className="apple-pressable apple-card-hover"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? '1.5px solid var(--deep-green)' : '1px solid var(--fine-border)',
                  padding: '18px 22px',
                  boxShadow: isSelected ? '0 8px 24px rgba(16, 45, 35, 0.12)' : 'var(--shadow-card)',
                  cursor: 'pointer',
                  transform: isSelected ? 'scale(1.008)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--status-warning)', letterSpacing: '0.04em' }}>
                      {dam.code} • {dam.villageSamiti}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', margin: '2px 0', color: 'var(--primary-forest)', fontWeight: 800 }}>
                      {dam.name}
                    </h4>
                  </div>
                  <span
                    className={progressPct >= 65 ? 'badge' : ''}
                    style={{
                      fontSize: '0.70rem',
                      fontWeight: 700,
                      padding: '3px 9px',
                      borderRadius: '4px',
                      backgroundColor: progressPct >= 65 ? '#EDF7EE' : '#FEF3C7',
                      color: progressPct >= 65 ? '#15803D' : '#B45309',
                      border: `1px solid ${progressPct >= 65 ? '#BBF7D0' : '#FDE68A'}`,
                    }}
                  >
                    {progressPct}% Sponsored
                  </span>
                </div>

                <p style={{ fontSize: '0.74rem', color: 'var(--secondary-text)', margin: '0 0 12px 0' }}>
                  📍 {dam.location} • Alt: {dam.elevationMeters}m MSL • Shields <strong>{dam.catchmentFed}</strong> from sediment influx.
                </p>

                {/* Progress Bar with Fluid Animated Shimmer */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--secondary-text)' }}>Credits Funded: <strong>{dam.sponsoredCredits}</strong> / {totalRequired}</span>
                    <span style={{ color: 'var(--primary-forest)', fontWeight: 700 }}>₹{(dam.sponsoredCredits * dam.creditPriceInr).toLocaleString()} Raised</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      className="water-shimmer-bar"
                      style={{
                        width: `${progressPct}%`,
                        height: '100%',
                        borderRadius: '4px',
                        transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    />
                  </div>
                </div>

                {/* 3 Metrics Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '0.72rem' }}>
                  <div className="apple-metric-card" style={{ backgroundColor: '#FAFAFA', padding: '8px 10px', borderRadius: '4px', border: '1px solid var(--fine-border)' }}>
                    <span style={{ color: 'var(--secondary-text)' }}>Annual Silt Arrested:</span>
                    <div style={{ fontWeight: 800, color: '#B45309' }}>{dam.siltRetentionTonnesPerYr} Tonnes/Yr</div>
                  </div>
                  <div className="apple-metric-card" style={{ backgroundColor: '#FAFAFA', padding: '8px 10px', borderRadius: '4px', border: '1px solid var(--fine-border)' }}>
                    <span style={{ color: 'var(--secondary-text)' }}>Groundwater Recharge:</span>
                    <div style={{ fontWeight: 800, color: 'var(--water-blue)' }}>{(dam.capacityLiters / 1000).toLocaleString()} kL/Yr</div>
                  </div>
                  <div className="apple-metric-card" style={{ backgroundColor: '#FAFAFA', padding: '8px 10px', borderRadius: '4px', border: '1px solid var(--fine-border)' }}>
                    <span style={{ color: 'var(--secondary-text)' }}>Remaining Capacity:</span>
                    <div style={{ fontWeight: 800, color: 'var(--primary-forest)' }}>{dam.availableCredits} Credits</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 7. Tab 3: Pledge & Sponsor Calculator */}
      {activeTab === 'PLEDGE' && (
        <div
          className="apple-card-hover"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--fine-border)',
            padding: '24px 28px',
            boxShadow: 'var(--shadow-card)',
            maxWidth: '780px',
            margin: '0 auto',
          }}
        >
          <h3 className="royal-title notranslate" style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--primary-forest)' }}>
            जल-ऋण क्रय / संकल्प : Water Credit Sponsorship Calculator
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--secondary-text)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
            Calculate the exact ecological ROI and sponsor check dams that directly protect your hospitality property&apos;s shoreline views and water security.
          </p>

          <form onSubmit={handlePledgeSubmit}>
            {/* Step 1: Select Check Dam */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.74rem', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Target Aravalli Check Dam Asset:
              </label>
              <select
                value={selectedDam.id}
                onChange={(e) => {
                  const d = WATER_CREDIT_CHECK_DAMS.find(x => x.id === e.target.value) || selectedDam;
                  setSelectedDam(d);
                }}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--fine-border)',
                  fontSize: '0.78rem',
                  backgroundColor: '#FAFAFA',
                  cursor: 'pointer',
                }}
              >
                {WATER_CREDIT_CHECK_DAMS.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.code}: {d.name} ({d.location} • Shields {d.catchmentFed})
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Slider for Credits */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                  Number of Water Credits to Sponsor:
                </label>
                <span
                  key={creditsToPledge}
                  className="number-animate"
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--primary-forest)',
                    display: 'inline-block',
                  }}
                >
                  {creditsToPledge} Credits
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={150}
                step={5}
                value={creditsToPledge}
                onChange={(e) => setCreditsToPledge(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: 'var(--deep-green)',
                  cursor: 'pointer',
                  height: '6px',
                  borderRadius: '3px',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.64rem', color: 'var(--secondary-text)', marginTop: '4px' }}>
                <span>Min: 5 Credits (₹9,000)</span>
                <span>Max: 150 Credits (₹2,70,000)</span>
              </div>
            </div>

            {/* Impact Calculation Grid with Micro-Spring Animation */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px',
                backgroundColor: '#F8FAFC',
                padding: '16px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--fine-border)',
                marginBottom: '20px',
              }}
            >
              <div className="apple-metric-card" style={{ padding: '8px', borderRadius: '4px' }}>
                <span style={{ fontSize: '0.66rem', color: 'var(--secondary-text)' }}>Total Investment:</span>
                <div key={`cost-${totalCostInr}`} className="number-animate" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-forest)' }}>
                  ₹{totalCostInr.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.60rem', color: 'var(--secondary-text)' }}>100% 80G Tax Deductible</div>
              </div>
              <div className="apple-metric-card" style={{ padding: '8px', borderRadius: '4px' }}>
                <span style={{ fontSize: '0.66rem', color: 'var(--secondary-text)' }}>Silt Arrested:</span>
                <div key={`silt-${siltTrappedTonnes}`} className="number-animate" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#B45309' }}>
                  {siltTrappedTonnes} Tonnes
                </div>
                <div style={{ fontSize: '0.60rem', color: 'var(--secondary-text)' }}>Kept from lake basin</div>
              </div>
              <div className="apple-metric-card" style={{ padding: '8px', borderRadius: '4px' }}>
                <span style={{ fontSize: '0.66rem', color: 'var(--secondary-text)' }}>Runoff Recharged:</span>
                <div key={`water-${floodBufferedLiters}`} className="number-animate" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--water-blue)' }}>
                  {(floodBufferedLiters / 1000).toFixed(0)} kL
                </div>
                <div style={{ fontSize: '0.60rem', color: 'var(--secondary-text)' }}>Aquifer buffer</div>
              </div>
              <div className="apple-metric-card" style={{ padding: '8px', borderRadius: '4px' }}>
                <span style={{ fontSize: '0.66rem', color: 'var(--secondary-text)' }}>Rural Wages:</span>
                <div key={`wages-${mandaysCreated}`} className="number-animate" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#15803D' }}>
                  {mandaysCreated} Mandays
                </div>
                <div style={{ fontSize: '0.60rem', color: 'var(--secondary-text)' }}>Tribal SHG employment</div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="apple-pressable"
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--deep-green)',
                color: '#FFFFFF',
                fontSize: '0.86rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(16, 45, 35, 0.25)',
              }}
            >
              <Award size={16} />
              <span>Pledge ₹{totalCostInr.toLocaleString()} & Issue Verified PES Certificate</span>
            </button>
          </form>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertificateModal && (
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
              maxWidth: '560px',
              border: '2px solid var(--antique-gold)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
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
                <Award size={18} color="#FCD34D" />
                <strong style={{ fontSize: '0.94rem', letterSpacing: '0.02em' }}>
                  Mewar Watershed Guardian Certificate
                </strong>
              </div>
              <button
                onClick={() => setShowCertificateModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FAF8F2' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Certificate Body */}
            <div style={{ padding: '24px', textAlign: 'center', background: 'linear-gradient(180deg, #FAF8F2 0%, #FFFFFF 100%)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--antique-gold)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Official Government of Rajasthan & Dharohar Digital Twin
              </div>
              <h3 className="royal-title notranslate" style={{ fontSize: '1.40rem', margin: '8px 0', color: 'var(--primary-forest)' }}>
                HERITAGE WATER GUARDIAN
              </h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--secondary-text)', margin: '0 auto 16px auto', maxWidth: '420px', lineHeight: 1.5 }}>
                Presented for sponsoring <strong>{creditsToPledge} Water Credits (₹{totalCostInr.toLocaleString()})</strong> at <strong>{selectedDam.name}</strong>, successfully arresting <strong>{siltTrappedTonnes} Tonnes</strong> of upstream mountain silt.
              </p>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
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
                <span>Verified Hash: #PES-MEWAR-2026-{(totalCostInr % 9999) + 1000}</span>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  onClick={() => setShowCertificateModal(false)}
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
                  Confirm & Save to Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
