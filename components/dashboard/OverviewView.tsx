'use client';

import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Anchor,
  ArrowRight,
  ArrowUpRight,
  Award,
  Box,
  Building,
  CheckCircle2,
  ChevronRight,
  CloudRain,
  Compass,
  Droplet,
  Droplets,
  ExternalLink,
  Eye,
  FileText,
  Globe2,
  Info,
  Layers,
  LayoutGrid,
  Leaf,
  MapPin,
  Mountain,
  RefreshCw,
  RotateCw,
  ShieldCheck,
  Sparkles,
  Sprout,
  TrendingUp,
  Truck,
  UserCheck,
  Users,
  Waves,
} from 'lucide-react';

interface OverviewViewProps {
  onOpenMap: () => void;
  onOpenSimulation: () => void;
  onOpenTrace: () => void;
  onOpenFarmIntel?: () => void;
  onOpenInterventions?: () => void;
  onOpenSiltLoop?: () => void;
  onOpenWaterCredits?: () => void;
  onOpenCitizenHub?: () => void;
  onOpenHeritageCrops?: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onOpenMap,
  onOpenSimulation,
  onOpenTrace,
  onOpenFarmIntel,
  onOpenInterventions,
  onOpenSiltLoop,
  onOpenWaterCredits,
  onOpenCitizenHub,
  onOpenHeritageCrops,
}) => {
  const [selectedStage, setSelectedStage] = useState<number>(0);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('udaipur');
  const [selectedStakeholder, setSelectedStakeholder] = useState<'farmers' | 'hotels' | 'citizens' | 'gov'>('farmers');

  const cascadeStages = [
    {
      id: 0,
      label: 'Stage 1: Mountain Crest',
      title: 'Sajjangarh Ridge & Aravalli Crests',
      elevation: '938 m MSL',
      slope: '36.4% Slope',
      process: 'Flash monsoon cloudbursts strike quartzite scree, detaching 45 t/ha/yr of high-velocity sheetwash sediment.',
      solution: 'Continuous contour stone bunds and vetiver hedges on ridge flanks to arrest kinetic energy before gullies form.',
    },
    {
      id: 1,
      label: 'Stage 2: Drainage Gullies',
      title: 'Upper Drainage Gullies (Sisarma Feeder)',
      elevation: '780 m MSL',
      slope: '28.5% Slope',
      process: 'Torrential runoff cuts deep headcut canyons, transporting coarse debris into agricultural valleys.',
      solution: 'Loose-boulder gully plugs and masonry anicuts funded through Hotel Water Credit escrows.',
    },
    {
      id: 2,
      label: 'Stage 3: Valley Terraces',
      title: 'Smallholder Terraces (Nai & Bujhra Clusters)',
      elevation: '615 m MSL',
      slope: '4.8% Slope',
      process: 'Valley farmlands suffer from eroded, stony topsoil with critical organic carbon deficiency.',
      solution: 'Precision infusion of dredged lacustrine silt (+38% organic matter) + guaranteed Heritage Crop pricing.',
    },
    {
      id: 3,
      label: 'Stage 4: Lake Cascade',
      title: 'Lake Pichola & Interconnected Cascades',
      elevation: '577 m MSL',
      slope: '0.5% Flat Lacustrine',
      process: 'Sediment accumulates on lake bed, reducing active storage by 2.4 ML/month and elevating eutrophication risk.',
      solution: 'Desiltation matched directly to upstream farms, restoring full flood cushion and water clarity.',
    },
    {
      id: 4,
      label: 'Stage 5: Interventions',
      title: 'Civil Interventions & Sanctioned DPR',
      elevation: 'Catchment-Wide',
      slope: 'Adaptive Relief',
      process: 'Automated geospatial estimation replaces 90-day manual surveys with GIS-verified engineering reports.',
      solution: 'Verified ₹1.42 Cr budget with smart contract escrow and 5-year maintenance assurance.',
    },
  ];

  const districtsData: Record<string, {
    name: string;
    catchmentArea: string;
    elevationRange: string;
    avgSlope: string;
    annualRainfall: string;
    crops: string;
    priorityAction: string;
  }> = {
    udaipur: {
      name: 'Udaipur (Mewar)',
      catchmentArea: '284.5 km²',
      elevationRange: '577 – 938 m',
      avgSlope: '36.4%',
      annualRainfall: '650 mm',
      crops: 'Mahi Maize, Desi Chana, Mung, Mustard, Bajra | Udaipur KKRK, UPA Mandi (Sohda)',
      priorityAction: 'Stone bunds on Sajjangarh ridge flanks + Desiltation check dam CD-01',
    },
    rajsamand: {
      name: 'Rajsamand',
      catchmentArea: '312.0 km²',
      elevationRange: '530 – 890 m',
      avgSlope: '28.2%',
      annualRainfall: '580 mm',
      crops: 'Sorghum (Jowar), Maize, Barley, Gram | Kankroli APMC Mandi Yard',
      priorityAction: 'Marble slurry runoff interception traps before Gomati debouchment',
    },
    dungarpur: {
      name: 'Dungarpur',
      catchmentArea: '245.8 km²',
      elevationRange: '320 – 680 m',
      avgSlope: '31.0%',
      annualRainfall: '710 mm',
      crops: 'Indigenous Maize, Pulses, Minor Millets (Kodo, Kutki) | Tribal Collectives',
      priorityAction: 'Continuous contour trenches (CCT) along steep tribal smallholder flanks',
    },
    banswara: {
      name: 'Banswara',
      catchmentArea: '388.4 km²',
      elevationRange: '210 – 540 m',
      avgSlope: '19.8%',
      annualRainfall: '890 mm',
      crops: 'Soybean, Cotton, Rice, Maize (Kharif) / Wheat (Rabi) | Krishi Upaj Mandi',
      priorityAction: 'Riparian buffer vegetation belts along Mahi reservoir feeder zones',
    },
  };

  const currentDist = districtsData[selectedDistrict] || districtsData.udaipur;

  return (
    <div
      style={{
        flex: 1,
        padding: '16px 24px 60px 24px',
        backgroundColor: 'var(--bg-warm-ivory)',
        color: 'var(--primary-text)',
        minHeight: '100%',
        maxWidth: '1600px',
        margin: '0 auto',
        scrollBehavior: 'smooth',
      }}
    >
      {/* =========================================================================
          APPLE-GRADE FLOATING TRANSLUCENT QUICK-NAV STRIP
          ========================================================================= */}
      <div
        style={{
          position: 'sticky',
          top: '8px',
          zIndex: 35,
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '16px',
          pointerEvents: 'none',
        }}
      >
        <nav
          style={{
            pointerEvents: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 6px',
            backgroundColor: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(16px) saturate(180%)',
            border: '1px solid rgba(231, 221, 203, 0.85)',
            borderRadius: '9999px',
            boxShadow: '0 4px 16px rgba(23, 61, 45, 0.08)',
          }}
        >
          {[
            { id: 'section-hero', label: 'अवलोकन (Overview)' },
            { id: 'section-kpis', label: 'मुख्य संकेतक (Key Metrics)' },
            { id: 'section-engines', label: '४ संरक्षण इंजन (4 Engines)' },
            { id: 'section-cascade', label: 'कैचमेंट प्रवाह (Catchment Flow)' },
            { id: 'section-intelligence', label: 'क्षेत्रीय बुद्धिमत्ता (Regional Intel)' },
            { id: 'section-stakeholders', label: 'पारस्परिकता मैट्रिक्स (Reciprocity)' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                const el = document.getElementById(item.id);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="apple-pressable"
              style={{
                padding: '5px 12px',
                borderRadius: '9999px',
                fontSize: '0.70rem',
                fontWeight: 600,
                backgroundColor: 'transparent',
                color: 'var(--primary-text)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.16s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-sandstone)';
                e.currentTarget.style.color = 'var(--primary-forest)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--primary-text)';
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* =========================================================================
          1. HERO SECTION: Match Reference Exactly
          ========================================================================= */}
      <section
        id="section-hero"
        style={{
          backgroundColor: 'var(--surface-white)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--fine-border)',
          boxShadow: 'var(--shadow-card)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 1.35fr)',
          minHeight: '340px',
          marginBottom: '20px',
        }}
      >
        {/* Left Section: Editorial Typography & Actions */}
        <div
          style={{
            padding: '34px 38px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            {/* Small Eyebrow Label */}
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: 'var(--secondary-text)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              MEWAR BASIN DIGITAL TWIN · AGRI-TECH & NATURAL RESOURCE CONSERVATION
            </div>

            {/* Main Editorial Heading */}
            <h1
              className="serif-title"
              style={{
                fontSize: '2.55rem',
                color: 'var(--primary-forest)',
                lineHeight: 1.12,
                fontWeight: 700,
                margin: '0 0 8px 0',
                letterSpacing: '-0.02em',
              }}
            >
              From Aravalli Crests to the Waters of Pichola
            </h1>

            {/* Subtitle */}
            <div
              className="serif-title"
              style={{
                fontSize: '1.14rem',
                color: 'var(--primary-text)',
                fontWeight: 500,
                marginBottom: '14px',
              }}
            >
              Where Ancient Mountain Ridges Meet Living Lake Waters
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: '0.86rem',
                color: 'var(--secondary-text)',
                lineHeight: 1.62,
                margin: '0 0 24px 0',
                maxWidth: '560px',
              }}
            >
              Southern Rajasthan’s fragile ecosystem unites smallholder farmland, vital lake catchments,
              and ancient Aravalli ridges. Dharohar solves the historic conservation impasse: upstream
              mountain farmers protect the watershed from flash-erosion, while downstream hotels, tourists,
              and lake systems return verifiable economic reciprocity.
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                const el = document.getElementById('section-engines');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn apple-pressable"
              style={{
                padding: '10px 20px',
                fontSize: '0.84rem',
                fontWeight: 600,
                backgroundColor: 'var(--primary-forest)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(23, 61, 45, 0.25)',
                cursor: 'pointer',
              }}
            >
              <FileText size={15} color="#FFFFFF" />
              <span>Explore the Watershed</span>
              <ArrowRight size={14} color="#FFFFFF" />
            </button>

            <button
              onClick={onOpenMap}
              className="btn apple-pressable"
              style={{
                padding: '10px 18px',
                fontSize: '0.84rem',
                fontWeight: 600,
                backgroundColor: '#FFFFFF',
                color: 'var(--primary-text)',
                border: '1px solid var(--fine-border)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                cursor: 'pointer',
              }}
            >
              <Box size={15} color="var(--primary-forest)" />
              <span>Open 3D Twin</span>
            </button>
          </div>
        </div>

        {/* Right Section: Realistic Aerial Landscape Image with Overlays */}
        <div
          style={{
            position: 'relative',
            backgroundColor: '#1E3A2B',
            overflow: 'hidden',
          }}
        >
          <img
            src="/images/lake_pichola_watershed.jpg"
            alt="Udaipur Lake Pichola and Aravalli Mountain Catchment"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
            }}
          />

          {/* Subtle gradient vignette to blend with left side */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.12) 0%, rgba(0, 0, 0, 0.1) 40%, rgba(0, 0, 0, 0.25) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Top-Right Badge: 3D Digital Twin Active */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              zIndex: 5,
              backgroundColor: 'rgba(16, 45, 35, 0.88)',
              backdropFilter: 'blur(8px)',
              padding: '5px 12px',
              borderRadius: '9999px',
              fontSize: '0.70rem',
              fontWeight: 700,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            <span
              className="pulse-ring"
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--status-positive)',
                boxShadow: '0 0 6px var(--status-positive)',
                display: 'inline-block',
              }}
            />
            <span>3D Digital Twin Active</span>
          </div>

          {/* Hotspot 1: Aravalli Hills (938 m) with Live Radar Ping */}
          <div
            onClick={onOpenTrace}
            className="apple-pressable"
            style={{
              position: 'absolute',
              top: '24%',
              left: '32%',
              zIndex: 5,
              backgroundColor: 'rgba(23, 61, 45, 0.85)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.35)',
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '0.68rem',
              fontWeight: 600,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              animation: 'floatGentle 3.6s ease-in-out infinite',
            }}
          >
            <span className="radar-ping" style={{ position: 'absolute', inset: '-3px', borderRadius: '4px', border: '1.5px solid var(--antique-gold)', pointerEvents: 'none' }} />
            <span style={{ color: 'var(--antique-gold)', fontWeight: 800 }}>△</span>
            <span>Aravalli Hills (938 m)</span>
          </div>

          {/* Hotspot 2: Lake Pichola (577 m) with Live Radar Ping */}
          <div
            onClick={onOpenMap}
            className="apple-pressable"
            style={{
              position: 'absolute',
              top: '58%',
              left: '42%',
              zIndex: 5,
              backgroundColor: 'rgba(27, 73, 101, 0.88)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.35)',
              padding: '4px 11px',
              borderRadius: '4px',
              fontSize: '0.68rem',
              fontWeight: 600,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              animation: 'floatGentle 3.6s ease-in-out infinite 0.7s',
            }}
          >
            <span className="radar-ping" style={{ position: 'absolute', inset: '-3px', borderRadius: '4px', border: '1.5px solid #38BDF8', pointerEvents: 'none' }} />
            <span style={{ color: '#93C5FD', fontWeight: 800 }}>◎</span>
            <span>Lake Pichola (577 m)</span>
          </div>

          {/* Label 3: Udaipur City on the right shore */}
          <div
            style={{
              position: 'absolute',
              top: '60%',
              right: '10%',
              zIndex: 5,
              backgroundColor: 'rgba(32, 43, 39, 0.78)',
              backdropFilter: 'blur(6px)',
              padding: '3px 8px',
              borderRadius: '4px',
              fontSize: '0.67rem',
              fontWeight: 600,
              color: '#FAF8F2',
            }}
          >
            Udaipur City
          </div>

          {/* Bottom Right: Compass Rose Orientation Indicator */}
          <div
            style={{
              position: 'absolute',
              bottom: '14px',
              right: '16px',
              zIndex: 5,
              color: '#FFFFFF',
              opacity: 0.9,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontSize: '0.64rem',
              fontWeight: 800,
              textShadow: '0 1px 3px rgba(0,0,0,0.6)',
            }}
          >
            <span>N</span>
            <span style={{ fontSize: '0.85rem', lineHeight: 1 }}>★</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. KPI CARDS: 4 Horizontal Cards Matching Reference with Apple Craft
          ========================================================================= */}
      <section
        id="section-kpis"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '26px',
        }}
      >
        {/* KPI 1: Lake Capacity Restored */}
        <div
          onClick={onOpenTrace}
          className="apple-card-hover apple-pressable"
          style={{
            backgroundColor: 'var(--surface-white)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--fine-border)',
            padding: '16px 18px',
            boxShadow: 'var(--shadow-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: '#EBF5FA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(52, 127, 179, 0.15)',
              }}
            >
              <Waves size={20} color="var(--lake-blue)" />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--secondary-text)', fontWeight: 500 }}>
                Lake Capacity Restored
              </div>
              <div
                className="number-animate"
                style={{
                  fontSize: '1.30rem',
                  fontWeight: 800,
                  color: 'var(--lake-blue)',
                  margin: '1px 0',
                  letterSpacing: '-0.02em',
                }}
              >
                +3,240 ML
              </div>
              <div style={{ fontSize: '0.67rem', color: 'var(--secondary-text)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span>Active storage reclaimed</span>
                <span style={{ opacity: 0.6 }}>↗</span>
              </div>
            </div>
          </div>
          <span
            style={{
              padding: '2px 8px',
              fontSize: '0.68rem',
              fontWeight: 700,
              color: 'var(--status-positive)',
              backgroundColor: '#EDF7EE',
              borderRadius: '9999px',
              border: '1px solid rgba(46, 125, 50, 0.2)',
            }}
          >
            ↑ +12%
          </span>
        </div>

        {/* KPI 2: Silt to Soil Transferred */}
        <div
          onClick={onOpenSiltLoop}
          className="apple-card-hover apple-pressable"
          style={{
            backgroundColor: 'var(--surface-white)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--fine-border)',
            padding: '16px 18px',
            boxShadow: 'var(--shadow-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: '#EDF7EE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(37, 131, 90, 0.15)',
              }}
            >
              <Sprout size={20} color="var(--status-positive)" />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--secondary-text)', fontWeight: 500 }}>
                Silt to Soil Transferred
              </div>
              <div
                className="number-animate"
                style={{
                  fontSize: '1.30rem',
                  fontWeight: 800,
                  color: 'var(--primary-forest)',
                  margin: '1px 0',
                  letterSpacing: '-0.02em',
                }}
              >
                38,400 tonnes
              </div>
              <div style={{ fontSize: '0.67rem', color: 'var(--secondary-text)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span>To farms & terraces</span>
                <span style={{ opacity: 0.6 }}>↗</span>
              </div>
            </div>
          </div>
          <span
            style={{
              padding: '2px 8px',
              fontSize: '0.68rem',
              fontWeight: 700,
              color: 'var(--status-positive)',
              backgroundColor: '#EDF7EE',
              borderRadius: '9999px',
              border: '1px solid rgba(46, 125, 50, 0.2)',
            }}
          >
            ↑ +18%
          </span>
        </div>

        {/* KPI 3: Water Credits (PES) */}
        <div
          onClick={onOpenWaterCredits}
          className="apple-card-hover apple-pressable"
          style={{
            backgroundColor: 'var(--surface-white)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--fine-border)',
            padding: '16px 18px',
            boxShadow: 'var(--shadow-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: '#FEF5EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--status-warning)',
                boxShadow: '0 2px 6px rgba(200, 135, 50, 0.15)',
              }}
            >
              ₹
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--secondary-text)', fontWeight: 500 }}>
                Water Credits (PES)
              </div>
              <div
                className="number-animate"
                style={{
                  fontSize: '1.30rem',
                  fontWeight: 800,
                  color: 'var(--status-warning)',
                  margin: '1px 0',
                  letterSpacing: '-0.02em',
                }}
              >
                ₹48.5 Lakhs
              </div>
              <div style={{ fontSize: '0.67rem', color: 'var(--secondary-text)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span>Active escrow value</span>
                <span style={{ opacity: 0.6 }}>↗</span>
              </div>
            </div>
          </div>
          <span
            style={{
              padding: '2px 8px',
              fontSize: '0.68rem',
              fontWeight: 700,
              color: 'var(--status-positive)',
              backgroundColor: '#EDF7EE',
              borderRadius: '9999px',
              border: '1px solid rgba(46, 125, 50, 0.2)',
            }}
          >
            ↑ +22%
          </span>
        </div>

        {/* KPI 4: Citizen Reports (Heritage Terracotta/Amber, Purple Ban compliant) */}
        <div
          onClick={onOpenCitizenHub}
          className="apple-card-hover apple-pressable"
          style={{
            backgroundColor: 'var(--surface-white)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--fine-border)',
            padding: '16px 18px',
            boxShadow: 'var(--shadow-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: '#FEF3C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(180, 83, 9, 0.15)',
              }}
            >
              <Users size={20} color="#B45309" />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--secondary-text)', fontWeight: 500 }}>
                Citizen Reports
              </div>
              <div
                className="number-animate"
                style={{
                  fontSize: '1.30rem',
                  fontWeight: 800,
                  color: '#B45309',
                  margin: '1px 0',
                  letterSpacing: '-0.02em',
                }}
              >
                50,000+
              </div>
              <div style={{ fontSize: '0.67rem', color: 'var(--secondary-text)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span>Boat tickets & field data</span>
                <span style={{ opacity: 0.6 }}>↗</span>
              </div>
            </div>
          </div>
          <span
            style={{
              padding: '2px 8px',
              fontSize: '0.68rem',
              fontWeight: 700,
              color: 'var(--status-positive)',
              backgroundColor: '#EDF7EE',
              borderRadius: '9999px',
              border: '1px solid rgba(46, 125, 50, 0.2)',
            }}
          >
            ↑ +35%
          </span>
        </div>
      </section>

      {/* =========================================================================
          3. SECTION: FOUR ENGINES OF CIRCULAR CONSERVATION
          ========================================================================= */}
      <section id="section-engines" style={{ marginBottom: '26px' }}>
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <h2 className="serif-title" style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--primary-forest)', margin: 0, letterSpacing: '-0.02em' }}>
              Four engines of circular conservation
            </h2>
            <p style={{ fontSize: '0.80rem', color: 'var(--secondary-text)', margin: '2px 0 0 0' }}>
              Integrated solutions connecting lake health, farmers, hotels, and citizens.
            </p>
          </div>

          <button
            onClick={() => onOpenSiltLoop && onOpenSiltLoop()}
            className="apple-pressable"
            style={{
              fontSize: '0.76rem',
              fontWeight: 600,
              color: 'var(--primary-forest)',
              backgroundColor: 'rgba(23, 61, 45, 0.05)',
              padding: '6px 14px',
              borderRadius: '9999px',
              border: '1px solid rgba(23, 61, 45, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.16s ease',
            }}
          >
            <span>Explore All Action Lab Modules</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {/* Engine 1: Circular Silt Economy */}
          <div
            onClick={onOpenSiltLoop}
            className="apple-card-hover apple-pressable apple-metric-card"
            style={{
              backgroundColor: 'var(--surface-white)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--fine-border)',
              padding: '20px',
              boxShadow: 'var(--shadow-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              minHeight: '210px',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#EBF5FA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                  boxShadow: '0 2px 6px rgba(52, 127, 179, 0.15)',
                }}
              >
                <RefreshCw size={18} color="var(--lake-blue)" />
              </div>
              <h3 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--primary-text)', margin: '0 0 8px 0', letterSpacing: '-0.01em' }}>
                1. Circular Silt Economy
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--secondary-text)', lineHeight: 1.55, margin: 0 }}>
                Nutrient-dense lake silt matched and moved to topsoil-starved Aravalli farms, boosting soil organic carbon and crop yields.
              </p>
            </div>

            <div style={{ marginTop: '16px' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--lake-blue)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Open Logistics Engine <ArrowRight size={13} />
              </span>
            </div>
          </div>

          {/* Engine 2: Hotel Water Credits */}
          <div
            onClick={onOpenWaterCredits}
            className="apple-card-hover apple-pressable apple-metric-card"
            style={{
              backgroundColor: 'var(--surface-white)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--fine-border)',
              padding: '20px',
              boxShadow: 'var(--shadow-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              minHeight: '210px',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#EBF5FA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                  boxShadow: '0 2px 6px rgba(52, 127, 179, 0.15)',
                }}
              >
                <Building size={18} color="var(--lake-blue)" />
              </div>
              <h3 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--primary-text)', margin: '0 0 8px 0', letterSpacing: '-0.01em' }}>
                2. Hotel Water Credits (PES)
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--secondary-text)', lineHeight: 1.55, margin: 0 }}>
                Lakefront luxury hotels fund upstream conservation through verified water credits, linking tourism revenue to watershed health.
              </p>
            </div>

            <div style={{ marginTop: '16px' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--lake-blue)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Open Water Credit Exchange <ArrowRight size={13} />
              </span>
            </div>
          </div>

          {/* Engine 3: Heritage Crop Market */}
          <div
            onClick={onOpenHeritageCrops}
            className="apple-card-hover apple-pressable apple-metric-card"
            style={{
              backgroundColor: 'var(--surface-white)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--fine-border)',
              padding: '20px',
              boxShadow: 'var(--shadow-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              minHeight: '210px',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#FEF5EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                  boxShadow: '0 2px 6px rgba(200, 135, 50, 0.15)',
                }}
              >
                <Leaf size={18} color="var(--status-warning)" />
              </div>
              <h3 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--primary-text)', margin: '0 0 8px 0', letterSpacing: '-0.01em' }}>
                3. Heritage Drought-Hardy Crop Market
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--secondary-text)', lineHeight: 1.55, margin: 0 }}>
                Indigenous seeds (Mahi Maize, Desi Chana, Mung) connected to premium markets, ensuring higher and more stable farmer incomes.
              </p>
            </div>

            <div style={{ marginTop: '16px' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--status-warning)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Open Crop Mandi Hub <ArrowRight size={13} />
              </span>
            </div>
          </div>

          {/* Engine 4: Jal-Chowkidar */}
          <div
            onClick={onOpenCitizenHub}
            className="apple-card-hover apple-pressable apple-metric-card"
            style={{
              backgroundColor: 'var(--surface-white)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--fine-border)',
              padding: '20px',
              boxShadow: 'var(--shadow-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              minHeight: '210px',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#EDF7EE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                  boxShadow: '0 2px 6px rgba(37, 131, 90, 0.15)',
                }}
              >
                <UserCheck size={18} color="var(--status-positive)" />
              </div>
              <h3 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--primary-text)', margin: '0 0 8px 0', letterSpacing: '-0.01em' }}>
                4. Jal-Chowkidar (Citizen & Tourist Hub)
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--secondary-text)', lineHeight: 1.55, margin: 0 }}>
                Tourists and local citizens report lake conditions, illegal activities, and biodiversity sightings, creating a real-time community sentinel.
              </p>
            </div>

            <div style={{ marginTop: '16px' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--status-positive)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Open Citizen Hub <ArrowRight size={13} />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. LOWER SECTION: Catchment Cascade + Regional Watershed Intelligence
          ========================================================================= */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)',
          gap: '20px',
          marginBottom: '26px',
        }}
      >
        {/* Left Panel: The Physical Catchment Cascade */}
        <div
          id="section-cascade"
          style={{
            backgroundColor: 'var(--surface-white)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--fine-border)',
            padding: '22px 24px',
            boxShadow: 'var(--shadow-subtle)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <h3 className="serif-title" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-forest)', margin: 0, letterSpacing: '-0.02em' }}>
                The Physical Catchment Cascade
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', margin: '2px 0 0 0' }}>
                From mountain crests to lake, showing the natural flow and intervention points.
              </p>
            </div>
            <button
              onClick={onOpenTrace}
              className="apple-pressable"
              style={{
                fontSize: '0.74rem',
                fontWeight: 600,
                color: 'var(--primary-forest)',
                background: 'rgba(23, 61, 45, 0.05)',
                padding: '4px 10px',
                borderRadius: '9999px',
                border: '1px solid rgba(23, 61, 45, 0.15)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.16s ease',
              }}
            >
              <span>View Full Cascade</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* 5 Compact Stage Tabs */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
            {cascadeStages.map((stg) => {
              const isSelected = selectedStage === stg.id;
              return (
                <button
                  key={stg.id}
                  onClick={() => setSelectedStage(stg.id)}
                  className="apple-pressable"
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.72rem',
                    fontWeight: isSelected ? 700 : 500,
                    backgroundColor: isSelected ? 'var(--primary-forest)' : 'var(--surface-sandstone)',
                    color: isSelected ? '#FFFFFF' : 'var(--primary-text)',
                    border: isSelected ? '1px solid var(--primary-forest)' : '1px solid var(--fine-border)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isSelected ? '0 2px 8px rgba(23, 61, 45, 0.25)' : 'none',
                  }}
                >
                  {stg.label}
                </button>
              );
            })}
          </div>

          {/* Elevation Profile Graphic (Matches Reference Illustration with Apple SVG Motion) */}
          <div
            style={{
              backgroundColor: 'var(--surface-sandstone)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--fine-border)',
              padding: '16px 16px 10px 16px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* SVG Terrain Profile */}
            <svg viewBox="0 0 540 130" style={{ width: '100%', height: 'auto', display: 'block' }}>
              <defs>
                <linearGradient id="terrainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#7D967E" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#C8B896" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#F1EBDD" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="waterFlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#347FB3" stopOpacity="0.3" />
                  <stop offset="40%" stopColor="#347FB3" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#1B4965" stopOpacity="1" />
                </linearGradient>
              </defs>

              {/* Distant mountain silhouette */}
              <path
                d="M 0 95 Q 60 40 100 50 T 220 75 T 380 90 T 540 100 L 540 130 L 0 130 Z"
                fill="#D4C8B0"
                opacity="0.35"
              />

              {/* Primary Elevation Profile Ridge */}
              <path
                d="M 0 105 Q 40 25 80 30 Q 140 38 180 70 Q 230 85 280 88 Q 360 92 420 100 L 540 105 L 540 130 L 0 130 Z"
                fill="url(#terrainGrad)"
              />
              <path
                d="M 0 105 Q 40 25 80 30 Q 140 38 180 70 Q 230 85 280 88 Q 360 92 420 100 L 540 105"
                fill="none"
                stroke="#173D2D"
                strokeWidth="2.2"
              />

              {/* Water Stream Line */}
              <path
                id="cascadeStreamPath"
                d="M 80 35 Q 140 65 240 86 Q 340 92 440 103"
                fill="none"
                stroke="url(#waterFlowGrad)"
                strokeWidth="2.5"
                strokeDasharray="4 2"
                className="stream-water-pulse"
              />

              {/* Flowing Hydro Particles Along Watershed Stream */}
              <circle r="3.5" fill="#38BDF8" opacity="0.9" filter="drop-shadow(0 0 4px #38BDF8)">
                <animateMotion
                  path="M 80 35 Q 140 65 240 86 Q 340 92 440 103"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle r="2.2" fill="#93C5FD" opacity="0.8">
                <animateMotion
                  path="M 80 35 Q 140 65 240 86 Q 340 92 440 103"
                  dur="4s"
                  begin="2s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Water Basin / Pichola on right */}
              <rect x="440" y="103" width="95" height="15" fill="#347FB3" opacity="0.6" rx="2" />
              <line x1="440" y1="103" x2="535" y2="103" stroke="#1B4965" strokeWidth="2" />

              {/* Sajjangarh Ridge Peak (938 m) with Live Radar Pulsing Ring */}
              <circle cx="80" cy="30" r="8" fill="none" stroke="#C88732" strokeWidth="1" opacity="0.7">
                <animate attributeName="r" values="4;12;4" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0;0.8" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <circle cx="80" cy="30" r="4" fill="#173D2D" />
              <line x1="80" y1="30" x2="80" y2="12" stroke="#173D2D" strokeWidth="1" strokeDasharray="1 1" />
              <text x="80" y="10" textAnchor="middle" fontSize="9" fontWeight="700" fill="#173D2D">
                Sajjangarh Ridge
              </text>
              <text x="80" y="21" textAnchor="middle" fontSize="8" fontWeight="800" fill="#C88732">
                938 m
              </text>

              {/* Nai Terraces (615 m) */}
              <circle cx="280" cy="88" r="7" fill="none" stroke="#25835A" strokeWidth="1" opacity="0.6">
                <animate attributeName="r" values="3.5;10;3.5" dur="2.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0;0.7" dur="2.8s" repeatCount="indefinite" />
              </circle>
              <circle cx="280" cy="88" r="3.5" fill="#7D967E" />
              <line x1="280" y1="88" x2="280" y2="72" stroke="#7D967E" strokeWidth="1" strokeDasharray="1 1" />
              <text x="280" y="66" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#202B27">
                Nai Terraces
              </text>
              <text x="280" y="75" textAnchor="middle" fontSize="8" fontWeight="800" fill="#25835A">
                615 m
              </text>

              {/* Lake Pichola (577 m) */}
              <circle cx="480" cy="103" r="7" fill="none" stroke="#347FB3" strokeWidth="1" opacity="0.6">
                <animate attributeName="r" values="3.5;10;3.5" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0;0.7" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="480" cy="103" r="3.5" fill="#347FB3" />
              <line x1="480" y1="103" x2="480" y2="88" stroke="#347FB3" strokeWidth="1" strokeDasharray="1 1" />
              <text x="480" y="82" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#347FB3">
                Lake Pichola
              </text>
              <text x="480" y="91" textAnchor="middle" fontSize="8" fontWeight="800" fill="#1B4965">
                577 m
              </text>
            </svg>

            {/* 3 Sub-Zones Footer */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                marginTop: '10px',
                textAlign: 'center',
                borderTop: '1px solid var(--fine-border)',
                paddingTop: '8px',
              }}
            >
              <div>
                <div style={{ fontSize: '0.69rem', fontWeight: 700, color: 'var(--primary-forest)' }}>
                  Upper Catchment
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--secondary-text)' }}>
                  (Flash Erosion Control)
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.69rem', fontWeight: 700, color: 'var(--status-positive)' }}>
                  Mid Catchment
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--secondary-text)' }}>
                  (Farm Terraces & Recharge)
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.69rem', fontWeight: 700, color: 'var(--lake-blue)' }}>
                  Lower Catchment
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--secondary-text)' }}>
                  (Lake Storage & Water Quality)
                </div>
              </div>
            </div>
          </div>

          {/* Active Stage Detail Card (Dynamic Inspection) */}
          {(() => {
            const activeStageInfo = cascadeStages.find((s) => s.id === selectedStage) || cascadeStages[0];
            return (
              <div
                className="apple-card-hover"
                style={{
                  marginTop: '12px',
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-warm-ivory)',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--fine-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.70rem', fontWeight: 700, color: 'var(--primary-forest)' }}>
                      {activeStageInfo.title}
                    </span>
                    <span
                      style={{
                        padding: '1px 6px',
                        fontSize: '0.64rem',
                        fontWeight: 700,
                        backgroundColor: 'var(--surface-sandstone)',
                        borderRadius: '9999px',
                        color: 'var(--primary-text)',
                      }}
                    >
                      {activeStageInfo.elevation}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--status-warning)' }}>
                    Slope: {activeStageInfo.slope}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--secondary-text)', lineHeight: 1.45 }}>
                  <strong style={{ color: 'var(--primary-text)' }}>Mechanism:</strong> {activeStageInfo.process}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--status-positive)', lineHeight: 1.45, fontWeight: 500 }}>
                  <strong style={{ color: 'var(--primary-forest)' }}>Dharohar Solution:</strong> {activeStageInfo.solution}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Right Panel: Regional Watershed Intelligence */}
        <div
          id="section-intelligence"
          style={{
            backgroundColor: 'var(--surface-white)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--fine-border)',
            padding: '22px 24px',
            boxShadow: 'var(--shadow-subtle)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h3 className="serif-title" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-forest)', margin: 0, letterSpacing: '-0.02em' }}>
                  Regional Watershed Intelligence
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--secondary-text)', margin: '2px 0 0 0' }}>
                  Comparative insights across Udaipur and neighboring basins.
                </p>
              </div>
              <button
                onClick={onOpenMap}
                className="apple-pressable"
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: 'var(--primary-forest)',
                  background: 'rgba(23, 61, 45, 0.05)',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(23, 61, 45, 0.15)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.16s ease',
                }}
              >
                <span>View Dashboard</span>
                <ArrowRight size={12} />
              </button>
            </div>

            {/* Region Selectors */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
              {Object.keys(districtsData).map((key) => {
                const isSelected = selectedDistrict === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDistrict(key)}
                    className="apple-pressable"
                    style={{
                      flex: 1,
                      padding: '5px 8px',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.72rem',
                      fontWeight: isSelected ? 700 : 500,
                      backgroundColor: isSelected ? 'var(--primary-forest)' : 'var(--surface-sandstone)',
                      color: isSelected ? '#FFFFFF' : 'var(--primary-text)',
                      border: isSelected ? '1px solid var(--primary-forest)' : '1px solid var(--fine-border)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      whiteSpace: 'nowrap',
                      boxShadow: isSelected ? '0 2px 6px rgba(23, 61, 45, 0.2)' : 'none',
                    }}
                  >
                    {districtsData[key].name}
                  </button>
                );
              })}
            </div>

            {/* 4 Compact Metrics Horizontal Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                padding: '10px 12px',
                backgroundColor: 'var(--bg-warm-ivory)',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--fine-border)',
                marginBottom: '14px',
                textAlign: 'center',
              }}
            >
              <div className="apple-metric-card" style={{ padding: '4px' }}>
                <div style={{ fontSize: '0.64rem', color: 'var(--secondary-text)' }}>Catchment Area</div>
                <div className="number-animate" style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-forest)', letterSpacing: '-0.01em' }}>
                  {currentDist.catchmentArea}
                </div>
              </div>

              <div className="apple-metric-card" style={{ padding: '4px' }}>
                <div style={{ fontSize: '0.64rem', color: 'var(--secondary-text)' }}>Elevation Range</div>
                <div className="number-animate" style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-forest)', letterSpacing: '-0.01em' }}>
                  {currentDist.elevationRange}
                </div>
              </div>

              <div className="apple-metric-card" style={{ padding: '4px' }}>
                <div style={{ fontSize: '0.64rem', color: 'var(--secondary-text)' }}>Avg. Slope</div>
                <div className="number-animate" style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--status-warning)', letterSpacing: '-0.01em' }}>
                  {currentDist.avgSlope}
                </div>
              </div>

              <div className="apple-metric-card" style={{ padding: '4px' }}>
                <div style={{ fontSize: '0.64rem', color: 'var(--secondary-text)' }}>Annual Rainfall</div>
                <div className="number-animate" style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--lake-blue)', letterSpacing: '-0.01em' }}>
                  {currentDist.annualRainfall}
                </div>
              </div>
            </div>

            {/* 2 Supporting Action Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Card 1: Dominant Crops */}
              <div
                className="apple-card-hover"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '10px 12px',
                  backgroundColor: '#F3F6F3',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid #D6E2D6',
                  transition: 'all 0.2s ease',
                }}
              >
                <Sprout size={16} color="var(--status-positive)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.70rem', fontWeight: 700, color: 'var(--primary-forest)' }}>
                    Dominant Crops & Land Use
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--secondary-text)', marginTop: '2px' }}>
                    {currentDist.crops}
                  </div>
                </div>
              </div>

              {/* Card 2: Priority Catchment Action */}
              <div
                className="apple-card-hover"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '10px 12px',
                  backgroundColor: '#FEF8F4',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid #F5DED2',
                  transition: 'all 0.2s ease',
                }}
              >
                <AlertTriangle size={16} color="var(--status-warning)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.70rem', fontWeight: 700, color: 'var(--status-error)' }}>
                    Priority Catchment Action
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--secondary-text)', marginTop: '2px' }}>
                    {currentDist.priorityAction}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. BOTTOM SECTION: Stakeholder Reciprocity Matrix
          ========================================================================= */}
      <section
        id="section-stakeholders"
        style={{
          backgroundColor: 'var(--surface-white)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--fine-border)',
          padding: '22px 24px',
          boxShadow: 'var(--shadow-subtle)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <h3 className="serif-title" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-forest)', margin: 0, letterSpacing: '-0.02em' }}>
              Stakeholder Reciprocity Matrix
            </h3>
            <p style={{ fontSize: '0.76rem', color: 'var(--secondary-text)', margin: '2px 0 0 0' }}>
              Connecting upstream smallholder farmers, lakefront hotels, citizens and government for shared value.
            </p>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('section-stakeholders');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="apple-pressable"
            style={{
              fontSize: '0.74rem',
              fontWeight: 600,
              color: 'var(--primary-forest)',
              background: 'rgba(23, 61, 45, 0.05)',
              padding: '4px 10px',
              borderRadius: '9999px',
              border: '1px solid rgba(23, 61, 45, 0.15)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.16s ease',
            }}
          >
            <span>View Full Matrix</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {[
            { id: 'farmers', label: '🌾 Upstream Farmers' },
            { id: 'hotels', label: '🏨 Lakefront Hotels' },
            { id: 'citizens', label: '📷 Citizens & Tourists' },
            { id: 'gov', label: '🏛️ Government & Panchayat' },
          ].map((cat) => {
            const isSelected = selectedStakeholder === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedStakeholder(cat.id as any)}
                className="apple-pressable"
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.74rem',
                  fontWeight: isSelected ? 700 : 500,
                  backgroundColor: isSelected ? 'var(--primary-forest)' : 'var(--surface-sandstone)',
                  color: isSelected ? '#FFFFFF' : 'var(--primary-text)',
                  border: isSelected ? '1px solid var(--primary-forest)' : '1px solid var(--fine-border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isSelected ? '0 2px 8px rgba(23, 61, 45, 0.2)' : 'none',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Structured Stakeholder Data Card */}
        <div
          className="apple-card-hover"
          style={{
            backgroundColor: 'var(--bg-warm-ivory)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--fine-border)',
            padding: '18px 22px',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)',
            gap: '20px',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {selectedStakeholder === 'farmers' && (
            <>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-forest)', margin: '0 0 6px 0', letterSpacing: '-0.01em' }}>
                  Tribal Smallholders (Nai & Bujhra Terraced Holdings)
                </h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--secondary-text)', lineHeight: 1.55, marginBottom: '10px' }}>
                  <strong>Challenge:</strong> Steep slope gradients wash away valuable organic topsoil during monsoon cloudbursts, leaving gravel scree and requiring expensive chemical fertilizer.
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--primary-text)', lineHeight: 1.55 }}>
                  <strong>Dharohar Intervention:</strong> Free enrichment via nutrient-rich lacustrine silt dredged from Pichola (+38% organic matter) + guaranteed 2.4× fair market pricing for heritage Malvi maize.
                </div>
              </div>
              <div
                className="apple-metric-card"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--fine-border)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--status-positive)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Measured Annual Benefit
                </div>
                <div className="number-animate" style={{ fontSize: '1.30rem', fontWeight: 800, color: 'var(--primary-forest)', margin: '4px 0', letterSpacing: '-0.02em' }}>
                  +₹34,800 / hectare
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--secondary-text)' }}>
                  Combined fertilizer savings and premium heritage grain market contracts.
                </div>
              </div>
            </>
          )}

          {selectedStakeholder === 'hotels' && (
            <>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--lake-blue)', margin: '0 0 6px 0', letterSpacing: '-0.01em' }}>
                  Lakefront Hospitality (Taj Lake Palace, Oberoi Udaivilas, Leela)
                </h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--secondary-text)', lineHeight: 1.55, marginBottom: '10px' }}>
                  <strong>Challenge:</strong> Lake siltation reduces water storage, causing shallow lake levels, algae blooms, and odor that severely damages tourist demand and room rates (₹65,000+/night).
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--primary-text)', lineHeight: 1.55 }}>
                  <strong>Dharohar Intervention:</strong> Automatic water-credit escrow on occupied room nights directly finances upstream loose-boulder check dams in the Sisarma feeder corridor.
                </div>
              </div>
              <div
                className="apple-metric-card"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--fine-border)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--lake-blue)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Water Security ROI
                </div>
                <div className="number-animate" style={{ fontSize: '1.30rem', fontWeight: 800, color: 'var(--lake-blue)', margin: '4px 0', letterSpacing: '-0.02em' }}>
                  +3.4 ML Live Storage
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--secondary-text)' }}>
                  Guarantees year-round lake beauty and hedges against ₹4.8 Cr tourist cancellation risk.
                </div>
              </div>
            </>
          )}

          {selectedStakeholder === 'citizens' && (
            <>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--status-positive)', margin: '0 0 6px 0', letterSpacing: '-0.01em' }}>
                  Udaipur Citizens & Global Eco-Tourists
                </h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--secondary-text)', lineHeight: 1.55, marginBottom: '10px' }}>
                  <strong>Challenge:</strong> Citizens lack real-time accountability tools for water pollution, while tourists consume the natural ecosystem without giving back.
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--primary-text)', lineHeight: 1.55 }}>
                  <strong>Dharohar Intervention:</strong> QR codes on 50,000+ boat tickets enable tourists to log lake clarity, turning every boat ride into active lake defense.
                </div>
              </div>
              <div
                className="apple-metric-card"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--fine-border)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--status-positive)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Community Reach
                </div>
                <div className="number-animate" style={{ fontSize: '1.30rem', fontWeight: 800, color: 'var(--status-positive)', margin: '4px 0', letterSpacing: '-0.02em' }}>
                  ₹10.0L / month
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--secondary-text)' }}>
                  Autonomous micro-contribution fund dedicated exclusively to lake desiltation.
                </div>
              </div>
            </>
          )}

          {selectedStakeholder === 'gov' && (
            <>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--status-warning)', margin: '0 0 6px 0', letterSpacing: '-0.01em' }}>
                  Panchayat Samitis, Watershed Dept & District Administration
                </h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--secondary-text)', lineHeight: 1.55, marginBottom: '10px' }}>
                  <strong>Challenge:</strong> Manual civil preparation of Detailed Project Reports (DPRs) for MGNREGA stone bunds takes months of surveying, delaying interventions until after floods strike.
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--primary-text)', lineHeight: 1.55 }}>
                  <strong>Dharohar Intervention:</strong> 1-click automated DPR generation combining Copernicus 30m DEM slope calculations and government SSR stone masonry schedule rates.
                </div>
              </div>
              <div
                className="apple-metric-card"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--fine-border)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--status-warning)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Administrative Velocity
                </div>
                <div className="number-animate" style={{ fontSize: '1.30rem', fontWeight: 800, color: 'var(--status-warning)', margin: '4px 0', letterSpacing: '-0.02em' }}>
                  90 Days → 15 Mins
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--secondary-text)' }}>
                  From terrain slope analysis to government-sanctioned engineering DPR.
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

