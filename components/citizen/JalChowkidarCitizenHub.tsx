'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  CITIZEN_STATIONS,
  CitizenMonitoringStation,
} from '@/lib/solutions-data';
import { ActiveStormScenario } from '@/lib/types';
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronRight,
  Compass,
  Cpu,
  Download,
  Droplets,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Heart,
  HelpCircle,
  Home,
  Info,
  MapPin,
  MoreVertical,
  Mountain,
  Plus,
  QrCode,
  Radio,
  RefreshCw,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Ticket,
  TrendingDown,
  TrendingUp,
  Upload,
  UserCheck,
  Users,
  Waves,
  Wifi,
  X,
} from 'lucide-react';

interface JalChowkidarCitizenHubProps {
  onFlyToLocation?: (coords: { latitude: number; longitude: number; height?: number }) => void;
  onAskCopilot?: (context: string) => void;
  onOpenMap?: () => void;
  activeStormScenario?: ActiveStormScenario | null;
  onNavigateToModule?: (view: string) => void;
}

// Station photo mappings using existing high-res photographic assets
const STATION_PHOTOS: Record<string, string> = {
  'station-ambrai-ghat': '/images/lake_pichola_watershed.jpg',
  'station-fateh-sagar-pal': '/images/rajasthan_aravalli_hero.jpg',
  'station-gangaur-ghat': '/images/smallholder_terraced_farming.jpg',
  'station-badi-lake': '/images/aravalli_ridge_conservation.jpg',
};

// Citizen audits dataset matching the reference design
interface CitizenAuditRecord {
  id: string;
  timestamp: string;
  stationId: string;
  stationName: string;
  photoUrl: string;
  turbidityNtu: number;
  secchiMeters: number;
  observation: string;
  status: 'Clear' | 'Moderate' | 'Eutrophic';
  source: string;
  verified: boolean;
}

const INITIAL_AUDITS: CitizenAuditRecord[] = [
  {
    id: 'aud-001',
    timestamp: '28 Jul 2024, 07:42',
    stationId: 'station-ambrai-ghat',
    stationName: 'Ambrai Ghat',
    photoUrl: '/images/lake_pichola_watershed.jpg',
    turbidityNtu: 8.4,
    secchiMeters: 1.85,
    observation: 'Clear water, minimal surface debris',
    status: 'Clear',
    source: 'Citizen (Mobile App)',
    verified: true,
  },
  {
    id: 'aud-002',
    timestamp: '28 Jul 2024, 06:18',
    stationId: 'station-fateh-sagar-pal',
    stationName: 'Fateh Sagar Pal',
    photoUrl: '/images/rajasthan_aravalli_hero.jpg',
    turbidityNtu: 12.1,
    secchiMeters: 1.40,
    observation: 'Slightly turbid, some floating vegetation',
    status: 'Moderate',
    source: 'Tourist Boat QR',
    verified: true,
  },
  {
    id: 'aud-003',
    timestamp: '27 Jul 2024, 18:30',
    stationId: 'station-gangaur-ghat',
    stationName: 'Gangaur Ghat',
    photoUrl: '/images/smallholder_terraced_farming.jpg',
    turbidityNtu: 9.6,
    secchiMeters: 1.70,
    observation: 'Evening reflection clear, silt settling',
    status: 'Clear',
    source: 'Citizen (Mobile App)',
    verified: true,
  },
  {
    id: 'aud-004',
    timestamp: '27 Jul 2024, 11:15',
    stationId: 'station-badi-lake',
    stationName: 'Badi Lake Dam',
    photoUrl: '/images/aravalli_ridge_conservation.jpg',
    turbidityNtu: 4.8,
    secchiMeters: 2.60,
    observation: 'Crystalline oligotrophic clarity',
    status: 'Clear',
    source: 'Morning Trekker Sentry',
    verified: true,
  },
];

// ---------------- Tourist Ticket Patronage Data Models ----------------
export interface BoatTicketType {
  id: string;
  lakeName: string;
  routeName: string;
  embarkationGhat: string;
  destination: string;
  vesselType: string;
  operator: string;
  baseFareInr: number;
  patronageCessInr: number;
  sponsoredCheckDamCode: string;
  sponsoredCheckDamName: string;
  watershedVillage: string;
  waterRetentionContributionLiters: number;
  imageThumbnail: string;
  description: string;
}

export interface IssuedTicket {
  pnr: string;
  ticketTypeId: string;
  routeName: string;
  lakeName: string;
  passengerName: string;
  passengerCount: number;
  baseFareTotalInr: number;
  cessTotalInr: number;
  grandTotalInr: number;
  travelDate: string;
  timeSlot: string;
  sponsoredCheckDamCode: string;
  sponsoredCheckDamName: string;
  watershedVillage: string;
  waterConservedLiters: number;
  issuedAt: string;
  qrHash: string;
}

export const BOAT_TICKET_TYPES: BoatTicketType[] = [
  {
    id: 'TKT-PICHOLA-SUNSET',
    lakeName: 'Lake Pichola',
    routeName: 'Lake Pichola Royal Sunset Island Cruise',
    embarkationGhat: 'Rameshwar Ghat (City Palace Jetty)',
    destination: 'Jag Mandir Palace & Arsi Vilas Sanctuary',
    vesselType: 'Solar-Hybrid Heritage Motor Launch',
    operator: 'Mewar Palace Boat Syndicate (MMPS)',
    baseFareInr: 450,
    patronageCessInr: 20,
    sponsoredCheckDamCode: 'CD-01',
    sponsoredCheckDamName: 'Bansdara Mountain Masonry Weir',
    watershedVillage: 'Gram Panchayat Alsigarh',
    waterRetentionContributionLiters: 4800,
    imageThumbnail: '/images/lake_pichola_watershed.jpg',
    description: 'Cruises past Jag Niwas (Lake Palace) and Mohan Mandir. The ₹20 cess maintains the upstream Bansdara weir, halting 450 tonnes of mountain gravel every monsoon.',
  },
  {
    id: 'TKT-FATEHSAGAR-SOLAR',
    lakeName: 'Fateh Sagar',
    routeName: 'Fateh Sagar Solar Eco-Ferry',
    embarkationGhat: 'Guru Govind Singh Park Jetty (Pal)',
    destination: 'Nehru Park Island & Solar Observatory View',
    vesselType: 'Twin-Hull Electric Catamaran (Zero Emission)',
    operator: 'Udaipur Smart City Water Mobility Cell',
    baseFareInr: 180,
    patronageCessInr: 10,
    sponsoredCheckDamCode: 'CD-03',
    sponsoredCheckDamName: 'Madar Feeder Canal Silt Trap & Weir',
    watershedVillage: 'Badi-Gorela Samiti',
    waterRetentionContributionLiters: 2500,
    imageThumbnail: '/images/rajasthan_aravalli_hero.jpg',
    description: 'Electric silent propulsion to Nehru Park Island. The ₹10 cess funds desiltation of the Madar Canal siphon, keeping Fateh Sagar at full FTL.',
  },
  {
    id: 'TKT-DOODHTALAI-ROW',
    lakeName: 'Doodh Talai & South Pichola',
    routeName: 'Doodh Talai Sluice & Bird Sanctuary Rowboat',
    embarkationGhat: 'Doodh Talai Southern Steps',
    destination: 'Pichola Southern Overflow Spillway',
    vesselType: 'Traditional Hand-Crafted Wooden Rowboat',
    operator: 'Sisarma Fisherfolk Eco-Tourism Cooperative',
    baseFareInr: 120,
    patronageCessInr: 10,
    sponsoredCheckDamCode: 'CD-02',
    sponsoredCheckDamName: 'Sisarma Alluvial Check Dam & Silt Basin',
    watershedVillage: 'Sisarma Gram Panchayat',
    waterRetentionContributionLiters: 1800,
    imageThumbnail: '/images/smallholder_terraced_farming.jpg',
    description: 'Gentle, human-powered rowboat exploration of water hyacinth bio-filters. Earmarks ₹10 directly to tribal stone bund maintenance.',
  },
  {
    id: 'TKT-SWAROOPSAGAR-LINK',
    lakeName: 'Swaroop Sagar Link',
    routeName: 'Historic Canal & Weir Connecting Cruise',
    embarkationGhat: 'Swaroop Sagar Heritage Sluice Gate',
    destination: 'Rang Sagar Connecting Channel',
    vesselType: 'Low-Draft Electric Pontoon',
    operator: 'Rajasthan Tourism Development Corp (RTDC)',
    baseFareInr: 250,
    patronageCessInr: 15,
    sponsoredCheckDamCode: 'CD-04',
    sponsoredCheckDamName: 'Hathipole Inter-Lake Aqueduct Buffer',
    watershedVillage: 'Udaipur Walled City Heritage Trust',
    waterRetentionContributionLiters: 3200,
    imageThumbnail: '/images/aravalli_ridge_conservation.jpg',
    description: 'Navigates the 18th-century interconnecting canals designed by Maharana Swaroop Singh. Supports the stone aqueduct desilting crews.',
  },
];

export const INITIAL_ISSUED_TICKETS: IssuedTicket[] = [
  {
    pnr: 'TIC-PICHOLA-8819',
    ticketTypeId: 'TKT-PICHOLA-SUNSET',
    routeName: 'Lake Pichola Royal Sunset Island Cruise',
    lakeName: 'Lake Pichola',
    passengerName: 'Vikramaditya & Team (DevFest Explorer)',
    passengerCount: 2,
    baseFareTotalInr: 900,
    cessTotalInr: 40,
    grandTotalInr: 940,
    travelDate: '26 Oct 2026',
    timeSlot: '17:30 (Sunset Golden Hour)',
    sponsoredCheckDamCode: 'CD-01',
    sponsoredCheckDamName: 'Bansdara Mountain Masonry Weir',
    watershedVillage: 'Gram Panchayat Alsigarh',
    waterConservedLiters: 9600,
    issuedAt: '26 Oct 2026, 14:15',
    qrHash: 'SHA256:7f9a1b8c2d4e6f',
  },
  {
    pnr: 'TIC-FATEH-4201',
    ticketTypeId: 'TKT-FATEHSAGAR-SOLAR',
    routeName: 'Fateh Sagar Solar Eco-Ferry',
    lakeName: 'Fateh Sagar',
    passengerName: 'Dr. Ananya Mathur',
    passengerCount: 4,
    baseFareTotalInr: 720,
    cessTotalInr: 40,
    grandTotalInr: 760,
    travelDate: '26 Oct 2026',
    timeSlot: '11:00 (Midday Island Visit)',
    sponsoredCheckDamCode: 'CD-03',
    sponsoredCheckDamName: 'Madar Feeder Canal Silt Trap & Weir',
    watershedVillage: 'Badi-Gorela Samiti',
    waterConservedLiters: 10000,
    issuedAt: '26 Oct 2026, 10:45',
    qrHash: 'SHA256:3c8d1e9f0a2b4',
  },
  {
    pnr: 'TIC-DOODH-1105',
    ticketTypeId: 'TKT-DOODHTALAI-ROW',
    routeName: 'Doodh Talai Sluice & Bird Sanctuary Rowboat',
    lakeName: 'Doodh Talai',
    passengerName: 'Kunal Singhal',
    passengerCount: 1,
    baseFareTotalInr: 120,
    cessTotalInr: 10,
    grandTotalInr: 130,
    travelDate: '25 Oct 2026',
    timeSlot: '07:30 (Morning Birding)',
    sponsoredCheckDamCode: 'CD-02',
    sponsoredCheckDamName: 'Sisarma Alluvial Check Dam & Silt Basin',
    watershedVillage: 'Sisarma Gram Panchayat',
    waterConservedLiters: 1800,
    issuedAt: '25 Oct 2026, 07:10',
    qrHash: 'SHA256:1a5b9c3d7e2f4',
  },
];

// ---------------- Trekker Gully Sentry Data Models ----------------
export interface TrekkerGullyIncident {
  id: string;
  trailName: string;
  landmark: string;
  latitude: number;
  longitude: number;
  elevationM: number;
  headcutDepthM: number;
  incisionLengthM: number;
  severity: 'CRITICAL_HEADCUT' | 'ACTIVE_INCISION' | 'STABILIZED_COMMUNITY';
  soilType: string;
  reporterName: string;
  reportedDate: string;
  downstreamRisk: string;
  suggestedAction: string;
  mgnregaWorkOrderId: string;
  remedyCostInr: string;
  stoneVolumeNeededM3: number;
  status: 'PENDING_WORK_ORDER' | 'DISPATCHED_TO_FIELD' | 'COMMUNITY_RESOLVED';
  photoUrl: string;
}

export const INITIAL_TREKKER_INCIDENTS: TrekkerGullyIncident[] = [
  {
    id: 'GULLY-2026-081',
    trailName: 'Bahubali Peak Ridge Trail (KM 1.4)',
    landmark: 'Badi Lake Northern Overlook Scree',
    latitude: 24.621,
    longitude: 73.618,
    elevationM: 780,
    headcutDepthM: 1.85,
    incisionLengthM: 42,
    severity: 'CRITICAL_HEADCUT',
    soilType: 'Lithic Leptosol with detached Quartz scree',
    reporterName: 'Aravalli Trekking Club (Ravi Sen)',
    reportedDate: '26 Oct 2026, 08:30 AM',
    downstreamRisk: 'High bedload erosion threatens to silt Badi Lake northern basin during first 80mm rain event.',
    suggestedAction: 'Deploy stepped loose-stone boulder gully plugs (3 tiers) + vetiver root grass binding.',
    mgnregaWorkOrderId: 'WO-ARAVALLI-2026-042',
    remedyCostInr: '₹34,000',
    stoneVolumeNeededM3: 16,
    status: 'DISPATCHED_TO_FIELD',
    photoUrl: '/images/aravalli_ridge_conservation.jpg',
  },
  {
    id: 'GULLY-2026-082',
    trailName: 'Sajjangarh Wildlife Ridge Trail',
    landmark: 'Monsoon Palace West Slope Switchback #4',
    latitude: 24.591,
    longitude: 73.629,
    elevationM: 840,
    headcutDepthM: 0.95,
    incisionLengthM: 28,
    severity: 'ACTIVE_INCISION',
    soilType: 'Weathered Phyllite & Red Gravel Subsoil',
    reporterName: 'Mewar Mountaineering Guild',
    reportedDate: '25 Oct 2026, 04:15 PM',
    downstreamRisk: 'Surface runoff scouring road embankment towards Sisarma feeder valley.',
    suggestedAction: 'Contour stone bunding with brushwood packing to dissipate kinetic velocity.',
    mgnregaWorkOrderId: 'WO-ARAVALLI-2026-039',
    remedyCostInr: '₹22,500',
    stoneVolumeNeededM3: 9,
    status: 'DISPATCHED_TO_FIELD',
    photoUrl: '/images/rajasthan_aravalli_hero.jpg',
  },
  {
    id: 'GULLY-2026-083',
    trailName: 'Purohito Ka Talab Spillway Trail',
    landmark: 'Eastern Ridge Cowherd Pathway',
    latitude: 24.642,
    longitude: 73.651,
    elevationM: 710,
    headcutDepthM: 1.3,
    incisionLengthM: 35,
    severity: 'ACTIVE_INCISION',
    soilType: 'Alluvial Sand with Silty Clay Top layer',
    reporterName: 'Udaipur Eco-Hiker Collective',
    reportedDate: '24 Oct 2026, 09:45 AM',
    downstreamRisk: 'Active bank slumping channeling sediment directly into the masonry reservoir.',
    suggestedAction: 'Dry rubble masonry toe wall and vegetative agave hedge planting.',
    mgnregaWorkOrderId: 'WO-ARAVALLI-2026-035',
    remedyCostInr: '₹28,000',
    stoneVolumeNeededM3: 12,
    status: 'PENDING_WORK_ORDER',
    photoUrl: '/images/smallholder_terraced_farming.jpg',
  },
  {
    id: 'GULLY-2026-084',
    trailName: 'Badi Feeder Ravine Trail',
    landmark: 'Madar Aqueduct Cross-Cutting Valley',
    latitude: 24.614,
    longitude: 73.624,
    elevationM: 640,
    headcutDepthM: 0.4,
    incisionLengthM: 18,
    severity: 'STABILIZED_COMMUNITY',
    soilType: 'Stabilized Loamy Sand with Native Grasses',
    reporterName: 'Badi Watershed Youth Brigade',
    reportedDate: '22 Oct 2026, 11:20 AM',
    downstreamRisk: 'Previously active headcut now fully stabilized; silt velocity arrested.',
    suggestedAction: 'Completed 2-tier loose stone plug; quarterly vegetation check scheduled.',
    mgnregaWorkOrderId: 'WO-ARAVALLI-2026-018',
    remedyCostInr: '₹18,000',
    stoneVolumeNeededM3: 8,
    status: 'COMMUNITY_RESOLVED',
    photoUrl: '/images/lake_pichola_watershed.jpg',
  },
];

export const JalChowkidarCitizenHub: React.FC<JalChowkidarCitizenHubProps> = ({
  onFlyToLocation,
  onAskCopilot,
  onOpenMap,
  activeStormScenario,
  onNavigateToModule,
}) => {
  const [selectedStation, setSelectedStation] = useState<CitizenMonitoringStation>(CITIZEN_STATIONS[0]);
  const [activeTab, setActiveTab] = useState<'TURBIDITY_SCANNER' | 'BOAT_TICKET_PATRONAGE' | 'TREKKER_SENTRY'>('TURBIDITY_SCANNER');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanMessage, setScanMessage] = useState<string>('');
  const [audits, setAudits] = useState<CitizenAuditRecord[]>(INITIAL_AUDITS);
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [showIotModal, setShowIotModal] = useState<boolean>(false);
  const [showTurbidityReasonModal, setShowTurbidityReasonModal] = useState<boolean>(false);

  // ---------------- Tourist Ticket Patronage State ----------------
  const [selectedTicketType, setSelectedTicketType] = useState<BoatTicketType>(BOAT_TICKET_TYPES[0]);
  const [passengerName, setPassengerName] = useState('Vikramaditya Sharma / DevFest Explorer');
  const [passengerCount, setPassengerCount] = useState<number>(2);
  const [travelDate, setTravelDate] = useState('2026-10-26');
  const [timeSlot, setTimeSlot] = useState('17:30 (Sunset Golden Hour)');
  const [issuedTickets, setIssuedTickets] = useState<IssuedTicket[]>(INITIAL_ISSUED_TICKETS);
  const [activeBoardingPassModal, setActiveBoardingPassModal] = useState<IssuedTicket | null>(null);
  const [ticketIssueSuccess, setTicketIssueSuccess] = useState<boolean>(false);

  // ---------------- Trekker Gully Sentry State ----------------
  const [trekkerIncidents, setTrekkerIncidents] = useState<TrekkerGullyIncident[]>(INITIAL_TREKKER_INCIDENTS);
  const [selectedIncidentFilter, setSelectedIncidentFilter] = useState<'ALL' | 'CRITICAL_HEADCUT' | 'ACTIVE_INCISION' | 'STABILIZED_COMMUNITY'>('ALL');
  const [selectedDossierIncident, setSelectedDossierIncident] = useState<TrekkerGullyIncident | null>(null);
  const [isLogGullyModalOpen, setIsLogGullyModalOpen] = useState<boolean>(false);
  const [gullyTrailName, setGullyTrailName] = useState('Bahubali Peak Ridge Trail (KM 1.4)');
  const [gullyDepthM, setGullyDepthM] = useState('1.60');
  const [gullyLengthM, setGullyLengthM] = useState('35');
  const [gullySoilType, setGullySoilType] = useState('Weathered Quartz scree on steep slope');
  const [gullyReporterName, setGullyReporterName] = useState('Mewar Eco-Trekkers Team');
  const [gullyDownstreamRisk, setGullyDownstreamRisk] = useState('Active erosion headcut threatening Badi Lake catchment feeder canal.');
  const [gullyProposedRemedy, setGullyProposedRemedy] = useState('Deploy 3-tier stepped boulder check dam with vetiver root stabilization.');
  const [gullySuccessMessage, setGullySuccessMessage] = useState<string>('');

  // New Audit Form State
  const [newAuditStation, setNewAuditStation] = useState(CITIZEN_STATIONS[0].id);
  const [newAuditNotes, setNewAuditNotes] = useState('');
  const [newAuditNtu, setNewAuditNtu] = useState('8.4');
  const [newAuditSecchi, setNewAuditSecchi] = useState('1.85');

  // Handle station selection in-place without triggering map redirect
  const handleSelectStation = (station: CitizenMonitoringStation) => {
    setSelectedStation(station);
  };

  // Re-scan simulation
  const handleReScan = () => {
    setIsScanning(true);
    setScanMessage('Sampling Secchi disk refraction & optical sensor telemetry...');
    setTimeout(() => {
      setIsScanning(false);
      setScanMessage('Analysis complete • Telemetry validated against CPCB Class B standards');
      setTimeout(() => setScanMessage(''), 4000);
    }, 1200);
  };

  // Handle new audit submission
  const handleSubmitAudit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = CITIZEN_STATIONS.find(s => s.id === newAuditStation) || selectedStation;
    const ntuVal = parseFloat(newAuditNtu) || st.defaultTurbidityNtu;
    const secchiVal = parseFloat(newAuditSecchi) || st.secchiDepthMeters;

    const newRecord: CitizenAuditRecord = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now',
      stationId: st.id,
      stationName: st.name.split(' (')[0],
      photoUrl: STATION_PHOTOS[st.id] || '/images/lake_pichola_watershed.jpg',
      turbidityNtu: ntuVal,
      secchiMeters: secchiVal,
      observation: newAuditNotes || 'Shoreline visual audit logged via web portal',
      status: ntuVal <= 10 ? 'Clear' : ntuVal <= 25 ? 'Moderate' : 'Eutrophic',
      source: 'Citizen (Web Portal)',
      verified: true,
    };

    setAudits([newRecord, ...audits]);
    setShowLogModal(false);
    setNewAuditNotes('');
  };

  const currentPhoto = STATION_PHOTOS[selectedStation.id] || '/images/lake_pichola_watershed.jpg';

  return (
    <div style={{
      padding: '16px 24px 36px 24px',
      color: 'var(--primary-text)',
      backgroundColor: 'var(--bg-warm-ivory)',
      minHeight: '100%',
    }}>
      {/* 1. Breadcrumb Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--secondary-text)' }}>
          <Home size={14} color="var(--primary-forest)" style={{ cursor: 'pointer' }} />
          <span>/</span>
          <span style={{ color: 'var(--secondary-text)' }}>Citizen & People</span>
          <span>/</span>
          <span style={{
            color: 'var(--primary-forest)',
            fontWeight: 700,
            backgroundColor: 'var(--surface-sandstone)',
            padding: '3px 10px',
            borderRadius: '6px',
            border: '1px solid var(--fine-border)',
          }}>
            Jal-Chowkidar (Citizen & Tourist Sentry)
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
              <Waves size={18} color="#93C5FD" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.64rem', padding: '1px 6px', borderRadius: '3px', backgroundColor: '#E0F2FE', color: 'var(--water-blue)', fontWeight: 800 }}>
                  ACTIVE CLIMATE IMPACT TELEMETRY
                </span>
                <span className="mono-text" style={{ fontSize: '0.72rem', color: 'var(--secondary-text)' }}>
                  {activeStormScenario.rainfallMm}mm • {activeStormScenario.intensityMmH} mm/hr Storm Event
                </span>
              </div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-forest)', marginTop: '2px' }}>
                Modeled Lake Turbidity: {activeStormScenario.lakeTurbiditySurgeNtu} NTU • Lake Pichola Level: {(571.8 + activeStormScenario.lakeLevelRiseMeters).toFixed(2)}m MSL (+{activeStormScenario.lakeLevelRiseMeters}m surge)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setShowTurbidityReasonModal(true)}
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
              <span>Why did this change? (Hydraulic Rationale)</span>
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

      {/* 2. Hero Section: Jal-Chowkidar Citizen Sentry Hub */}
      <div style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--fine-border)',
        boxShadow: 'var(--shadow-card)',
        marginBottom: '20px',
      }}>
        {/* Background Image with Dark Forest Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('/images/lake_pichola_watershed.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          filter: 'brightness(0.85)',
          zIndex: 0,
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(16, 45, 35, 0.95) 0%, rgba(23, 61, 45, 0.90) 55%, rgba(23, 61, 45, 0.72) 100%)',
          zIndex: 1,
        }} />

        {/* Hero Content */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          padding: '24px 28px 20px 28px',
          color: '#FAF8F2',
        }}>
          {/* Eyebrow Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span style={{
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
            }}>
              ✦ जन-भागीदारी एवं नागरिक विज्ञान · CITIZEN SENSING NETWORK
            </span>
            <span style={{ fontSize: '0.72rem', color: '#D8B56D', fontWeight: 500 }}>
              Morning Walkers • Trekkers • Lake Tourists
            </span>
          </div>

          <h2 className="royal-title notranslate" style={{
            fontSize: '1.58rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            margin: '0 0 6px 0',
            color: '#FFFFFF',
            lineHeight: 1.2,
          }}>
            JAL-CHOWKIDAR: CITIZEN & TOURIST SENTRY HUB
          </h2>

          <p style={{
            fontSize: '0.80rem',
            color: '#E2E8F0',
            lineHeight: 1.5,
            margin: '0 0 20px 0',
            maxWidth: '780px',
            fontWeight: 400,
          }}>
            Satellites cannot pierce thick monsoon cloudburst cover when flash floods strike. Dharohar mobilizes Udaipur&apos;s 4.5 lakh residents and 18 lakh annual tourists into a real-time living sensor network—turning morning walks into water clarity audits and tourist boat rides into direct watershed defense.
          </p>

          {/* 4 KPI Metric Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
          }}>
            {/* Card 1: Citizen Audits Logged */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid var(--fine-border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: '#EBF5FB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--water-blue)',
                  flexShrink: 0,
                }}>
                  <Droplets size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-forest)', lineHeight: 1.1 }}>
                    1,248
                  </div>
                  <div style={{ fontSize: '0.70rem', fontWeight: 600, color: 'var(--primary-text)' }}>
                    Citizen Audits Logged
                  </div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--secondary-text)' }}>
                    Lake shoreline photos
                  </div>
                </div>
              </div>

              {/* Sparkline Wave */}
              <svg width="44" height="24" viewBox="0 0 44 24" fill="none">
                <path d="M2 18 C 10 6, 20 22, 28 10 C 34 2, 38 14, 42 8" stroke="#347FB3" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            {/* Card 2: Tourist Micro-Patronage */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid var(--fine-border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: '#EDF7EE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--status-positive)',
                  flexShrink: 0,
                }}>
                  <Users size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-forest)', lineHeight: 1.1 }}>
                    ₹3.82 Lakhs
                  </div>
                  <div style={{ fontSize: '0.70rem', fontWeight: 600, color: 'var(--primary-text)' }}>
                    Tourist Micro-Patronage
                  </div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--secondary-text)' }}>
                    Via ₹10 boat ticket QR
                  </div>
                </div>
              </div>

              {/* Mini Bar Chart */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '22px' }}>
                <div style={{ width: '4px', height: '8px', backgroundColor: '#A5D6A7', borderRadius: '1px' }} />
                <div style={{ width: '4px', height: '14px', backgroundColor: '#81C784', borderRadius: '1px' }} />
                <div style={{ width: '4px', height: '10px', backgroundColor: '#A5D6A7', borderRadius: '1px' }} />
                <div style={{ width: '4px', height: '18px', backgroundColor: '#4CAF50', borderRadius: '1px' }} />
                <div style={{ width: '4px', height: '22px', backgroundColor: '#2E7D32', borderRadius: '1px' }} />
              </div>
            </div>

            {/* Card 3: Trekker Gullies Flagged */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid var(--fine-border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: '#FBE9E7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--status-error)',
                  flexShrink: 0,
                }}>
                  <Mountain size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--status-error)', lineHeight: 1.1 }}>
                    34
                  </div>
                  <div style={{ fontSize: '0.70rem', fontWeight: 600, color: 'var(--primary-text)' }}>
                    Trekker Gullies Flagged
                  </div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--secondary-text)' }}>
                    Bahubali & Sajjangarh
                  </div>
                </div>
              </div>

              {/* Mini Mountain Sparkline */}
              <svg width="44" height="24" viewBox="0 0 44 24" fill="none">
                <path d="M2 20 L 14 6 L 24 16 L 34 4 L 42 20 Z" fill="rgba(185, 74, 56, 0.15)" stroke="#B94A38" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Card 4: Community Water Sentry */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid var(--fine-border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: '#F3E8FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#7C3AED',
                  flexShrink: 0,
                }}>
                  <UserCheck size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-forest)', lineHeight: 1.1 }}>
                    100% Free
                  </div>
                  <div style={{ fontSize: '0.70rem', fontWeight: 600, color: 'var(--primary-text)' }}>
                    Community Water Sentry
                  </div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--secondary-text)' }}>
                    Zero app download required
                  </div>
                </div>
              </div>

              <div style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                color: '#25835A',
                backgroundColor: '#EDF7EE',
                padding: '2px 6px',
                borderRadius: '4px',
              }}>
                PWA Active
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Module Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '18px',
      }}>
        <button
          onClick={() => setActiveTab('TURBIDITY_SCANNER')}
          className="apple-pressable"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            fontSize: '0.80rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-sm)',
            backgroundColor: activeTab === 'TURBIDITY_SCANNER' ? 'var(--deep-green)' : '#FFFFFF',
            color: activeTab === 'TURBIDITY_SCANNER' ? '#FFFFFF' : 'var(--primary-text)',
            border: activeTab === 'TURBIDITY_SCANNER' ? '1px solid var(--deep-green)' : '1px solid var(--fine-border)',
            cursor: 'pointer',
            boxShadow: activeTab === 'TURBIDITY_SCANNER' ? '0 2px 5px rgba(16, 45, 35, 0.2)' : '0 1px 2px rgba(0,0,0,0.03)',
            transition: 'all 0.15s ease',
          }}
        >
          <Camera size={15} color={activeTab === 'TURBIDITY_SCANNER' ? '#FCD34D' : 'var(--secondary-sage)'} />
          <span>1. Turbidity Scanner</span>
        </button>

        <button
          onClick={() => setActiveTab('BOAT_TICKET_PATRONAGE')}
          className="apple-pressable"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            fontSize: '0.80rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-sm)',
            backgroundColor: activeTab === 'BOAT_TICKET_PATRONAGE' ? 'var(--deep-green)' : '#FFFFFF',
            color: activeTab === 'BOAT_TICKET_PATRONAGE' ? '#FFFFFF' : 'var(--primary-text)',
            border: activeTab === 'BOAT_TICKET_PATRONAGE' ? '1px solid var(--deep-green)' : '1px solid var(--fine-border)',
            cursor: 'pointer',
            boxShadow: activeTab === 'BOAT_TICKET_PATRONAGE' ? '0 2px 5px rgba(16, 45, 35, 0.2)' : '0 1px 2px rgba(0,0,0,0.03)',
            transition: 'all 0.15s ease',
          }}
        >
          <Ticket size={15} color={activeTab === 'BOAT_TICKET_PATRONAGE' ? '#FCD34D' : 'var(--secondary-sage)'} />
          <span>2. Tourist Ticket Patronage</span>
        </button>

        <button
          onClick={() => setActiveTab('TREKKER_SENTRY')}
          className="apple-pressable"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            fontSize: '0.80rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-sm)',
            backgroundColor: activeTab === 'TREKKER_SENTRY' ? 'var(--deep-green)' : '#FFFFFF',
            color: activeTab === 'TREKKER_SENTRY' ? '#FFFFFF' : 'var(--primary-text)',
            border: activeTab === 'TREKKER_SENTRY' ? '1px solid var(--deep-green)' : '1px solid var(--fine-border)',
            cursor: 'pointer',
            boxShadow: activeTab === 'TREKKER_SENTRY' ? '0 2px 5px rgba(16, 45, 35, 0.2)' : '0 1px 2px rgba(0,0,0,0.03)',
            transition: 'all 0.15s ease',
          }}
        >
          <Mountain size={15} color={activeTab === 'TREKKER_SENTRY' ? '#FCD34D' : 'var(--secondary-sage)'} />
          <span>3. Trekker Gully Sentry</span>
        </button>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowIotModal(true)}
            className="apple-pressable"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              fontSize: '0.72rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#FFFFFF',
              color: 'var(--primary-forest)',
              border: '1px solid var(--fine-border)',
              cursor: 'pointer',
            }}
          >
            <Cpu size={13} color="var(--primary-forest)" />
            <span>IoT Sensor Spec & API</span>
          </button>
        </div>
      </div>

      {/* 4. Tab 1: Turbidity Scanner Main Layout (Two-Column) */}
      {activeTab === 'TURBIDITY_SCANNER' && (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.05fr 1.15fr',
            gap: '18px',
            marginBottom: '20px',
          }}>
            {/* Left Column: Select Monitoring Station */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--fine-border)',
              padding: '16px 18px',
              boxShadow: 'var(--shadow-card)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
                paddingBottom: '10px',
                borderBottom: '1px solid var(--fine-border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Camera size={16} color="var(--primary-forest)" />
                  <h3 style={{
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    margin: 0,
                    color: 'var(--primary-forest)',
                  }}>
                    झील किनारे निगरानी स्टेशन (Select Monitoring Station)
                  </h3>
                </div>
                <span style={{ fontSize: '0.70rem', color: 'var(--secondary-text)' }}>
                  Lake Shoreline Stations (4)
                </span>
              </div>

              {/* Station Cards List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {CITIZEN_STATIONS.map((station) => {
                  const isSelected = selectedStation.id === station.id;
                  const photoSrc = STATION_PHOTOS[station.id] || '/images/lake_pichola_watershed.jpg';
                  const isModerate = station.status === 'MODERATE_SILT';

                  return (
                    <div
                      key={station.id}
                      onClick={() => handleSelectStation(station)}
                      className="apple-pressable"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: isSelected ? '1.5px solid var(--water-blue)' : '1px solid var(--fine-border)',
                        backgroundColor: isSelected ? '#F0F7FB' : '#FAFAFA',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {/* Thumbnail Photo */}
                      <div style={{
                        position: 'relative',
                        width: '74px',
                        height: '52px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: '1px solid var(--fine-border)',
                      }}>
                        <Image
                          src={photoSrc}
                          alt={station.name}
                          fill
                          sizes="74px"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>

                      {/* Station Details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                          <strong style={{
                            fontSize: '0.84rem',
                            color: 'var(--primary-text)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            {station.name}
                          </strong>

                          {/* Status Pill */}
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.62rem',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '4px',
                            backgroundColor: isModerate ? '#FEF3C7' : '#EDF7EE',
                            color: isModerate ? '#B45309' : '#15803D',
                            border: `1px solid ${isModerate ? '#FDE68A' : '#BBF7D0'}`,
                            flexShrink: 0,
                          }}>
                            {isModerate ? '▲ MODERATE SILT' : '● CLEAR AZURE'}
                          </span>
                        </div>

                        {/* Hindi Name */}
                        <div style={{ fontSize: '0.70rem', color: 'var(--status-error)', fontWeight: 500, margin: '1px 0' }}>
                          {station.id === 'station-ambrai-ghat' ? 'अमराई घाट (आहड़ फीडर मुहाना)' :
                           station.id === 'station-fateh-sagar-pal' ? 'फतह सागर पाल प्रोमेनाड' :
                           station.id === 'station-gangaur-ghat' ? 'गणगौर घाट हेरिटेज किनारा' :
                           'बड़ी झील (जियान सागर) डैम वॉल'}
                        </div>

                        {/* Location & Metrics */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.68rem',
                          color: 'var(--secondary-text)',
                          marginTop: '3px',
                        }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <MapPin size={10} color="var(--status-error)" />
                            {station.waterBody} ({station.elevationMeters}m MSL)
                          </span>
                          <span>
                            Turbidity: <strong style={{ color: 'var(--primary-text)' }}>{station.defaultTurbidityNtu} NTU</strong>
                          </span>
                          <span>
                            Secchi: <strong style={{ color: 'var(--primary-text)' }}>{station.secchiDepthMeters} m</strong>
                          </span>
                        </div>
                      </div>

                      {/* Selection Radio Indicator */}
                      <div style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: isSelected ? '5px solid var(--primary-forest)' : '2px solid var(--fine-border)',
                        backgroundColor: '#FFFFFF',
                        flexShrink: 0,
                        marginLeft: '4px',
                      }} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Live Water Clarity Analysis */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--fine-border)',
              padding: '16px 18px',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                {/* Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  paddingBottom: '10px',
                  borderBottom: '1px solid var(--fine-border)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Eye size={16} color="var(--primary-forest)" />
                    <h3 style={{
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      margin: 0,
                      color: 'var(--primary-forest)',
                    }}>
                      जल-पारदर्शिता विश्लेषण (Live Water Clarity Analysis)
                    </h3>
                  </div>

                  <span
                    onClick={() => {
                      if (onFlyToLocation) {
                        onFlyToLocation({
                          latitude: selectedStation.latitude,
                          longitude: selectedStation.longitude,
                          height: 1400,
                        });
                      }
                    }}
                    style={{
                      fontSize: '0.70rem',
                      color: 'var(--water-blue)',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    + Station Preview
                  </span>
                </div>

                {/* Live Camera Viewport */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '220px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  marginBottom: '14px',
                  border: '1px solid var(--fine-border)',
                  backgroundColor: '#102D23',
                }}>
                  <Image
                    src={currentPhoto}
                    alt={selectedStation.name}
                    fill
                    sizes="(max-width: 1200px) 100vw, 600px"
                    style={{ objectFit: 'cover' }}
                    priority
                  />

                  {/* Gradient bottom shadow */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.65) 100%)',
                  }} />

                  {/* Live Feed Pill (Top Right) */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(16, 45, 35, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#FAF8F2',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#22C55E',
                      boxShadow: '0 0 6px #22C55E',
                    }} />
                    <span>Live Camera Feed / Simulated Sample</span>
                  </div>

                  {/* Station Location Pill (Bottom Right) */}
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(16, 45, 35, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: '#FFFFFF',
                    padding: '3px 10px',
                    borderRadius: '4px',
                    fontSize: '0.70rem',
                    fontWeight: 600,
                  }}>
                    {selectedStation.waterBody} · {selectedStation.name.split(' (')[0]}
                  </div>
                </div>

                {/* Station Title & Clarity Badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}>
                  <div>
                    <h4 style={{
                      fontSize: '0.98rem',
                      fontWeight: 800,
                      margin: 0,
                      color: 'var(--primary-forest)',
                    }}>
                      {selectedStation.name}
                    </h4>
                    <div style={{ fontSize: '0.74rem', color: 'var(--status-error)', fontWeight: 600, marginTop: '2px' }}>
                      {selectedStation.id === 'station-ambrai-ghat' ? 'अमराई घाट (आहड़ फीडर मुहाना)' :
                       selectedStation.id === 'station-fateh-sagar-pal' ? 'फतह सागर पाल प्रोमेनाड' :
                       selectedStation.id === 'station-gangaur-ghat' ? 'गणगौर घाट हेरिटेज किनारा' :
                       'बड़ी झील (जियान सागर) डैम वॉल'}
                    </div>
                  </div>

                  {/* Water Clarity Status Badge */}
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    backgroundColor: selectedStation.status === 'MODERATE_SILT' ? '#FEF3C7' : '#EBF5FB',
                    color: selectedStation.status === 'MODERATE_SILT' ? '#B45309' : 'var(--water-blue)',
                    border: `1px solid ${selectedStation.status === 'MODERATE_SILT' ? '#FDE68A' : '#BFDBFE'}`,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}>
                    <Droplets size={12} />
                    <span>Water Clarity: {selectedStation.status === 'MODERATE_SILT' ? 'Moderate' : 'Good'}</span>
                  </span>
                </div>

                {/* 3 Metric Cards in a Row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px',
                  marginBottom: '14px',
                }}>
                  {/* Card 1: Turbidity */}
                  <div style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid var(--fine-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Droplets size={14} color="var(--water-blue)" />
                      <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-text)' }}>
                        {selectedStation.defaultTurbidityNtu} NTU
                      </span>
                    </div>
                    <div style={{ fontSize: '0.70rem', fontWeight: 600, color: 'var(--primary-text)' }}>
                      Turbidity
                    </div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--secondary-text)' }}>
                      Lower is better
                    </div>
                  </div>

                  {/* Card 2: Secchi Depth */}
                  <div style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid var(--fine-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Waves size={14} color="var(--water-blue)" />
                      <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--water-blue)' }}>
                        {selectedStation.secchiDepthMeters} m
                      </span>
                    </div>
                    <div style={{ fontSize: '0.70rem', fontWeight: 600, color: 'var(--primary-text)' }}>
                      Secchi Depth
                    </div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--secondary-text)' }}>
                      Higher is better
                    </div>
                  </div>

                  {/* Card 3: Visibility Status */}
                  <div style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid var(--fine-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Eye size={14} color="var(--water-blue)" />
                      <span style={{
                        fontSize: '0.88rem',
                        fontWeight: 800,
                        color: selectedStation.status === 'MODERATE_SILT' ? '#B45309' : 'var(--primary-forest)',
                      }}>
                        {selectedStation.status === 'MODERATE_SILT' ? 'Moderate Silt' : 'Clear Azure'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.70rem', fontWeight: 600, color: 'var(--primary-text)' }}>
                      Visibility Status
                    </div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--secondary-text)' }}>
                      {selectedStation.status === 'MODERATE_SILT' ? 'Requires upstream check dam' : 'Suitable for recreation'}
                    </div>
                  </div>
                </div>

                {scanMessage && (
                  <div style={{
                    fontSize: '0.72rem',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    backgroundColor: '#EDF7EE',
                    color: '#15803D',
                    border: '1px solid #BBF7D0',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <CheckCircle2 size={13} />
                    <span>{scanMessage}</span>
                  </div>
                )}
              </div>

              {/* Action Button: Re-Scan Water Clarity */}
              <button
                onClick={handleReScan}
                disabled={isScanning}
                className="apple-pressable"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--deep-green)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  border: 'none',
                  cursor: isScanning ? 'wait' : 'pointer',
                  boxShadow: '0 2px 4px rgba(16, 45, 35, 0.2)',
                }}
              >
                <Camera size={15} className={isScanning ? 'spin-slow' : ''} />
                <span>{isScanning ? 'Scanning Refraction & Telemetry...' : 'Re-Scan Water Clarity'}</span>
              </button>
            </div>
          </div>

          {/* 5. Recent Citizen Audits Table */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--fine-border)',
            padding: '16px 20px',
            boxShadow: 'var(--shadow-card)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
              paddingBottom: '10px',
              borderBottom: '1px solid var(--fine-border)',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={16} color="var(--primary-forest)" />
                  <h3 style={{
                    fontSize: '0.94rem',
                    fontWeight: 700,
                    margin: 0,
                    color: 'var(--primary-forest)',
                  }}>
                    Recent Citizen Audits
                  </h3>
                </div>
                <p style={{ fontSize: '0.70rem', color: 'var(--secondary-text)', margin: '2px 0 0 0' }}>
                  Latest shoreline observations from residents, tourists and morning walkers
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => setShowLogModal(true)}
                  className="apple-pressable"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 12px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--surface-sandstone)',
                    color: 'var(--primary-forest)',
                    border: '1px solid var(--antique-gold)',
                    cursor: 'pointer',
                  }}
                >
                  <Upload size={12} />
                  <span>+ Log Shoreline Audit</span>
                </button>

                <button
                  onClick={() => {}}
                  style={{
                    fontSize: '0.74rem',
                    color: 'var(--water-blue)',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <span>View All Audits</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                <thead>
                  <tr style={{
                    borderBottom: '1px solid var(--fine-border)',
                    textAlign: 'left',
                    color: 'var(--secondary-text)',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                  }}>
                    <th style={{ padding: '8px 10px' }}>Time</th>
                    <th style={{ padding: '8px 10px' }}>Station</th>
                    <th style={{ padding: '8px 10px' }}>Photo</th>
                    <th style={{ padding: '8px 10px' }}>Turbidity (NTU)</th>
                    <th style={{ padding: '8px 10px' }}>Secchi (m)</th>
                    <th style={{ padding: '8px 10px' }}>Observation</th>
                    <th style={{ padding: '8px 10px' }}>Status</th>
                    <th style={{ padding: '8px 10px' }}>Source</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {audits.map((item) => (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid var(--fine-border)',
                        color: 'var(--primary-text)',
                      }}
                    >
                      <td style={{ padding: '10px 10px', color: 'var(--secondary-text)', whiteSpace: 'nowrap' }}>
                        {item.timestamp}
                      </td>
                      <td style={{ padding: '10px 10px', fontWeight: 600 }}>
                        {item.stationName}
                      </td>
                      <td style={{ padding: '10px 10px' }}>
                        <div style={{
                          position: 'relative',
                          width: '38px',
                          height: '26px',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          border: '1px solid var(--fine-border)',
                        }}>
                          <Image
                            src={item.photoUrl}
                            alt={item.stationName}
                            fill
                            sizes="38px"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      </td>
                      <td style={{ padding: '10px 10px', fontFamily: 'monospace', fontWeight: 600 }}>
                        {item.turbidityNtu}
                      </td>
                      <td style={{ padding: '10px 10px', fontFamily: 'monospace' }}>
                        {item.secchiMeters.toFixed(2)}
                      </td>
                      <td style={{ padding: '10px 10px', color: 'var(--secondary-text)', maxWidth: '240px' }}>
                        {item.observation}
                      </td>
                      <td style={{ padding: '10px 10px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          backgroundColor: item.status === 'Clear' ? '#EDF7EE' : '#FEF3C7',
                          color: item.status === 'Clear' ? '#15803D' : '#B45309',
                          border: `1px solid ${item.status === 'Clear' ? '#BBF7D0' : '#FDE68A'}`,
                        }}>
                          <span>●</span>
                          <span>{item.status}</span>
                        </span>
                      </td>
                      <td style={{ padding: '10px 10px', color: 'var(--secondary-text)', fontSize: '0.70rem' }}>
                        {item.source}
                      </td>
                      <td style={{ padding: '10px 10px', textAlign: 'center' }}>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary-text)' }}>
                          <MoreVertical size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* 6. Tab 2: Tourist Ticket Patronage (Udaipur Lake Cruise QR Patronage Rail) */}
      {activeTab === 'BOAT_TICKET_PATRONAGE' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
          {/* Header Banner */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--fine-border)',
              padding: '22px 26px',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Ticket size={18} color="var(--primary-forest)" />
                  <h3 className="royal-title notranslate" style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--primary-forest)' }}>
                    पर्यटक नौका टिकट संरक्षण : Udaipur Lake Cruise QR Patronage Rail
                  </h3>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--secondary-text)', margin: 0, lineHeight: 1.5, maxWidth: '820px' }}>
                  Every boat ride taken on Lake Pichola, Fateh Sagar, Doodh Talai, or Swaroop Sagar includes a verified <strong>₹10–₹20 Aravalli Ecological Patronage Cess</strong>. 100% of this fund is automatically ring-fenced to desilt and maintain the exact upstream mountain check dam feeding that boat route.
                </p>
              </div>

              {/* Live Micro-Patronage Summary Metrics */}
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  backgroundColor: 'var(--bg-warm-ivory)',
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--antique-gold)',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.62rem', color: 'var(--secondary-text)', display: 'block' }}>Cess Raised (2026):</span>
                  <strong style={{ fontSize: '0.94rem', color: 'var(--primary-forest)' }}>₹18.42 Lakhs</strong>
                </div>
                <div style={{ width: '1px', backgroundColor: 'var(--fine-border)' }} />
                <div>
                  <span style={{ fontSize: '0.62rem', color: 'var(--secondary-text)', display: 'block' }}>Desilting Mandays:</span>
                  <strong style={{ fontSize: '0.94rem', color: '#15803D' }}>3,420 Days</strong>
                </div>
                <div style={{ width: '1px', backgroundColor: 'var(--fine-border)' }} />
                <div>
                  <span style={{ fontSize: '0.62rem', color: 'var(--secondary-text)', display: 'block' }}>Trips Certified:</span>
                  <strong style={{ fontSize: '0.94rem', color: 'var(--water-blue)' }}>92,150</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Two-Column Booking & Patronage Matrix */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '20px' }}>
            {/* Left Column: Select Route / Ticket Type */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--fine-border)',
                padding: '20px',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid var(--fine-border)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--primary-forest)' }}>
                  1. Select Lake Cruise Route &amp; Vessel
                </span>
                <span style={{ fontSize: '0.70rem', color: 'var(--secondary-text)' }}>
                  {BOAT_TICKET_TYPES.length} Verified Cruise Rails
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {BOAT_TICKET_TYPES.map((route) => {
                  const isSelected = selectedTicketType.id === route.id;
                  return (
                    <div
                      key={route.id}
                      onClick={() => setSelectedTicketType(route)}
                      className="apple-pressable"
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: isSelected ? '1.5px solid var(--deep-green)' : '1px solid var(--fine-border)',
                        backgroundColor: isSelected ? '#F0FDF4' : '#FAFAFA',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: 'var(--surface-sandstone)',
                            color: 'var(--primary-forest)',
                            border: '1px solid var(--antique-gold)',
                          }}
                        >
                          {route.lakeName} • {route.vesselType.split(' (')[0]}
                        </span>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--primary-forest)' }}>
                          ₹{route.baseFareInr} <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--secondary-text)' }}>/ guest</span>
                        </div>
                      </div>

                      <h4 style={{ fontSize: '0.92rem', margin: '2px 0 4px 0', color: 'var(--primary-forest)', fontWeight: 800 }}>
                        {route.routeName}
                      </h4>

                      <div style={{ fontSize: '0.70rem', color: 'var(--secondary-text)', margin: '0 0 8px 0' }}>
                        📍 <strong>Departs:</strong> {route.embarkationGhat} ➔ {route.destination}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          backgroundColor: '#FFFFFF',
                          padding: '6px 10px',
                          borderRadius: '4px',
                          border: '1px solid var(--fine-border)',
                          fontSize: '0.68rem',
                        }}
                      >
                        <span style={{ color: '#15803D', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ShieldCheck size={12} /> ₹{route.patronageCessInr} Earmarked Cess: {route.sponsoredCheckDamCode}
                        </span>
                        <span style={{ color: 'var(--water-blue)', fontWeight: 600 }}>
                          +{route.waterRetentionContributionLiters.toLocaleString()} L water protected
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Interactive Booking & Patronage Calculator */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--fine-border)',
                padding: '20px 22px',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div style={{ borderBottom: '1px solid var(--fine-border)', paddingBottom: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--primary-forest)' }}>
                  2. Passenger Manifest &amp; Patronage Issuance
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Lead Passenger / Explorer Name:
                  </label>
                  <input
                    type="text"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      fontSize: '0.78rem',
                      borderRadius: '4px',
                      border: '1px solid var(--fine-border)',
                      backgroundColor: '#FAFAFA',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Passenger Count:
                    </label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[1, 2, 4, 6].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setPassengerCount(num)}
                          className="apple-pressable"
                          style={{
                            flex: 1,
                            padding: '6px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            borderRadius: '4px',
                            backgroundColor: passengerCount === num ? 'var(--deep-green)' : '#FFFFFF',
                            color: passengerCount === num ? '#FFFFFF' : 'var(--primary-text)',
                            border: '1px solid var(--fine-border)',
                            cursor: 'pointer',
                          }}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Sailing Slot:
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '7px 8px',
                        fontSize: '0.74rem',
                        borderRadius: '4px',
                        border: '1px solid var(--fine-border)',
                        backgroundColor: '#FAFAFA',
                      }}
                    >
                      <option value="09:30 (Morning Mist)">09:30 AM • Morning Mist</option>
                      <option value="12:00 (Midday Sun)">12:00 PM • Midday Sun</option>
                      <option value="17:30 (Sunset Golden Hour)">05:30 PM • Sunset Golden Hour</option>
                      <option value="19:00 (Twilight City Lights)">07:00 PM • Twilight City Lights</option>
                    </select>
                  </div>
                </div>

                {/* Live Real-Time Financial & Ecological Breakdown */}
                <div
                  style={{
                    backgroundColor: '#F9F8F5',
                    borderRadius: 'var(--radius-sm)',
                    padding: '14px',
                    border: '1px solid var(--fine-border)',
                    fontSize: '0.74rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    marginTop: '4px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--secondary-text)' }}>Base Cruise Fare ({passengerCount} Guests):</span>
                    <strong>₹{(passengerCount * selectedTicketType.baseFareInr).toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#15803D' }}>
                    <span style={{ fontWeight: 600 }}>Aravalli Watershed Cess (Ring-Fenced):</span>
                    <strong>+₹{(passengerCount * selectedTicketType.patronageCessInr).toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--fine-border)', paddingTop: '6px', marginTop: '2px', fontSize: '0.86rem' }}>
                    <span style={{ fontWeight: 800, color: 'var(--primary-forest)' }}>Total Ticket Fare:</span>
                    <strong style={{ fontWeight: 800, color: 'var(--primary-forest)' }}>
                      ₹{(passengerCount * (selectedTicketType.baseFareInr + selectedTicketType.patronageCessInr)).toLocaleString()}
                    </strong>
                  </div>
                  <div style={{ borderTop: '1px dashed var(--fine-border)', paddingTop: '6px', marginTop: '2px', fontSize: '0.70rem', color: 'var(--secondary-text)' }}>
                    🎯 <strong>Upstream Beneficiary:</strong> {selectedTicketType.sponsoredCheckDamName} ({selectedTicketType.watershedVillage}) • <span style={{ color: 'var(--water-blue)', fontWeight: 700 }}>+{(passengerCount * selectedTicketType.waterRetentionContributionLiters).toLocaleString()} Liters safeguarded</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => {
                    const baseFareTotal = passengerCount * selectedTicketType.baseFareInr;
                    const cessTotal = passengerCount * selectedTicketType.patronageCessInr;
                    const grandTotal = baseFareTotal + cessTotal;
                    const waterConserved = passengerCount * selectedTicketType.waterRetentionContributionLiters;
                    const newTicket: IssuedTicket = {
                      pnr: `TIC-${selectedTicketType.lakeName.slice(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
                      ticketTypeId: selectedTicketType.id,
                      routeName: selectedTicketType.routeName,
                      lakeName: selectedTicketType.lakeName,
                      passengerName: passengerName || 'Valued Guest Explorer',
                      passengerCount,
                      baseFareTotalInr: baseFareTotal,
                      cessTotalInr: cessTotal,
                      grandTotalInr: grandTotal,
                      travelDate,
                      timeSlot,
                      sponsoredCheckDamCode: selectedTicketType.sponsoredCheckDamCode,
                      sponsoredCheckDamName: selectedTicketType.sponsoredCheckDamName,
                      watershedVillage: selectedTicketType.watershedVillage,
                      waterConservedLiters: waterConserved,
                      issuedAt: 'Just now',
                      qrHash: `SHA256:${Math.random().toString(36).substring(2, 12)}`,
                    };
                    setIssuedTickets([newTicket, ...issuedTickets]);
                    setActiveBoardingPassModal(newTicket);
                  }}
                  className="apple-pressable"
                  style={{
                    padding: '11px 18px',
                    backgroundColor: 'var(--deep-green)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 8px rgba(16, 45, 35, 0.25)',
                    marginTop: '4px',
                  }}
                >
                  <Ticket size={16} color="#FCD34D" />
                  <span>Issue Official Patronage Ticket &amp; Boarding Pass</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. Recently Issued Patronage Tickets Registry */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--fine-border)',
              padding: '20px',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid var(--fine-border)', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <QrCode size={16} color="var(--primary-forest)" />
                <h4 style={{ margin: 0, fontSize: '0.90rem', fontWeight: 800, color: 'var(--primary-forest)' }}>
                  Recent Issued Tourist Patronage Passes (Verified E-Ledger)
                </h4>
              </div>
              <span style={{ fontSize: '0.70rem', color: 'var(--secondary-text)' }}>
                {issuedTickets.length} Digital Boarding Passes Active
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {issuedTickets.map((ticket) => (
                <div
                  key={ticket.pnr}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    backgroundColor: '#FAFAFA',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--fine-border)',
                    fontSize: '0.74rem',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <div style={{ minWidth: '220px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="mono-text" style={{ fontWeight: 800, color: 'var(--antique-gold)' }}>
                        {ticket.pnr}
                      </span>
                      <span style={{ fontSize: '0.64rem', padding: '1px 6px', borderRadius: '3px', backgroundColor: '#EDF7EE', color: '#15803D', fontWeight: 700 }}>
                        {ticket.passengerCount} Guests
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--primary-forest)', marginTop: '2px' }}>
                      {ticket.passengerName}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--secondary-text)' }}>
                      {ticket.routeName} • {ticket.timeSlot}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.70rem' }}>
                    <div>Total Fare: <strong>₹{ticket.grandTotalInr}</strong></div>
                    <div style={{ color: '#15803D', fontWeight: 700 }}>
                      🌿 ₹{ticket.cessTotalInr} Cess ➔ {ticket.sponsoredCheckDamCode}
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => setActiveBoardingPassModal(ticket)}
                      className="apple-pressable"
                      style={{
                        padding: '6px 14px',
                        fontSize: '0.70rem',
                        fontWeight: 700,
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--fine-border)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        color: 'var(--primary-forest)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Eye size={12} />
                      <span>View Boarding Pass &amp; QR</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. Tab 3: Trekker Gully Sentry (Crowdsourced Headcut Incident Network) */}
      {activeTab === 'TREKKER_SENTRY' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
          {/* Header Banner */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--fine-border)',
              padding: '22px 26px',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Mountain size={18} color="var(--primary-forest)" />
                  <h3 className="royal-title notranslate" style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--primary-forest)' }}>
                    पर्वतारोही भू-कटाव रिपोर्टर : Hiker &amp; Trekker Gully Incision Sentry
                  </h3>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--secondary-text)', margin: 0, lineHeight: 1.5, maxWidth: '820px' }}>
                  Adventure trekkers traversing the ridge trails of <strong>Bahubali Peak</strong>, <strong>Sajjangarh Wildlife Sanctuary</strong>, and <strong>Purohito Ka Talab</strong> report active flash-flood gullies. Verified reports instantly sanction MGNREGA stone bund work orders to arrest erosion before sediment reaches the lakes.
                </p>
              </div>

              {/* Action Button: Log Incident */}
              <button
                onClick={() => setIsLogGullyModalOpen(true)}
                className="apple-pressable"
                style={{
                  padding: '9px 18px',
                  backgroundColor: 'var(--deep-green)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-xs)',
                  border: 'none',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 6px rgba(16, 45, 35, 0.25)',
                }}
              >
                <Plus size={14} color="#FCD34D" />
                <span>+ Report Trail Gully Incision</span>
              </button>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', borderTop: '1px solid var(--fine-border)', paddingTop: '12px', flexWrap: 'wrap' }}>
              {(['ALL', 'CRITICAL_HEADCUT', 'ACTIVE_INCISION', 'STABILIZED_COMMUNITY'] as const).map((filt) => (
                <button
                  key={filt}
                  onClick={() => setSelectedIncidentFilter(filt)}
                  className="apple-pressable"
                  style={{
                    padding: '5px 12px',
                    fontSize: '0.70rem',
                    fontWeight: 700,
                    borderRadius: '9999px',
                    backgroundColor: selectedIncidentFilter === filt ? 'var(--deep-green)' : '#F3F4F6',
                    color: selectedIncidentFilter === filt ? '#FFFFFF' : 'var(--primary-text)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {filt === 'ALL'
                    ? `All Incidents (${trekkerIncidents.length})`
                    : filt === 'CRITICAL_HEADCUT'
                    ? 'Critical Headcuts (>1.5m)'
                    : filt === 'ACTIVE_INCISION'
                    ? 'Active Incisions (0.5–1.5m)'
                    : 'Stabilized Community Plugs'}
                </button>
              ))}
            </div>
          </div>

          {/* Success Banner if newly reported */}
          {gullySuccessMessage && (
            <div
              style={{
                backgroundColor: '#EDF7EE',
                border: '1px solid #BBF7D0',
                padding: '10px 16px',
                borderRadius: 'var(--radius-sm)',
                color: '#15803D',
                fontSize: '0.76rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} />
                <span>{gullySuccessMessage}</span>
              </div>
              <button
                onClick={() => setGullySuccessMessage('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#15803D', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Incident Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {trekkerIncidents
              .filter((inc) => selectedIncidentFilter === 'ALL' || inc.severity === selectedIncidentFilter)
              .map((incident) => {
                const isCritical = incident.severity === 'CRITICAL_HEADCUT';
                const isStabilized = incident.severity === 'STABILIZED_COMMUNITY';
                return (
                  <div
                    key={incident.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-md)',
                      border: isCritical ? '1.5px solid #FCA5A5' : '1px solid var(--fine-border)',
                      padding: '18px 20px',
                      boxShadow: 'var(--shadow-card)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span
                          style={{
                            fontSize: '0.64rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: isCritical ? '#FEE2E2' : isStabilized ? '#EDF7EE' : '#FEF3C7',
                            color: isCritical ? '#991B1B' : isStabilized ? '#15803D' : '#92400E',
                            border: `1px solid ${isCritical ? '#FCA5A5' : isStabilized ? '#BBF7D0' : '#FDE68A'}`,
                          }}
                        >
                          {isCritical ? '⚠️ Critical Headcut' : isStabilized ? '✓ Stabilized' : '⚡ Active Incision'}
                        </span>
                        <span className="mono-text" style={{ fontSize: '0.68rem', color: 'var(--secondary-text)' }}>
                          {incident.mgnregaWorkOrderId}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '0.98rem', margin: '0 0 4px 0', color: 'var(--primary-forest)', fontWeight: 800 }}>
                        {incident.trailName}
                      </h4>

                      <div style={{ fontSize: '0.72rem', color: 'var(--secondary-text)', marginBottom: '8px' }}>
                        📍 {incident.landmark} • Alt: <strong>{incident.elevationM}m MSL</strong>
                      </div>

                      <div
                        style={{
                          backgroundColor: '#F9F8F5',
                          borderRadius: 'var(--radius-xs)',
                          padding: '10px 12px',
                          border: '1px solid var(--fine-border)',
                          fontSize: '0.72rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                        }}
                      >
                        <div>
                          <strong>Measured Depth:</strong> <span style={{ color: isCritical ? '#B91C1C' : '#B45309', fontWeight: 800 }}>{incident.headcutDepthM} m</span> • <strong>Length:</strong> {incident.incisionLengthM} m
                        </div>
                        <div>
                          <strong>Scour Material:</strong> {incident.soilType}
                        </div>
                        <div style={{ color: 'var(--secondary-text)', fontSize: '0.68rem', marginTop: '2px' }}>
                          ⚠️ {incident.downstreamRisk}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--fine-border)', paddingTop: '10px', fontSize: '0.68rem' }}>
                      <span style={{ color: 'var(--secondary-text)' }}>
                        Reported by: <strong>{incident.reporterName.split(' (')[0]}</strong>
                      </span>
                      <button
                        onClick={() => setSelectedDossierIncident(incident)}
                        className="apple-pressable"
                        style={{
                          padding: '6px 14px',
                          fontSize: '0.70rem',
                          fontWeight: 700,
                          backgroundColor: '#FFFFFF',
                          border: '1px solid var(--fine-border)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          color: 'var(--primary-forest)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <FileText size={12} />
                        <span>View Civil Dossier</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Bottom KPI Bar */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--fine-border)',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              boxShadow: 'var(--shadow-card)',
              textAlign: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-forest)' }}>
                {trekkerIncidents.length} Active Trails
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--secondary-text)' }}>Monitored by Trekkers</div>
            </div>
            <div style={{ width: '1px', height: '28px', backgroundColor: 'var(--fine-border)' }} />
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#B45309' }}>
                45 m³ Loose Stone
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--secondary-text)' }}>Required for Gully Plugs</div>
            </div>
            <div style={{ width: '1px', height: '28px', backgroundColor: 'var(--fine-border)' }} />
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#15803D' }}>
                ₹1,02,500
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--secondary-text)' }}>MGNREGA Sanctioned</div>
            </div>
            <div style={{ width: '1px', height: '28px', backgroundColor: 'var(--fine-border)' }} />
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--water-blue)' }}>
                14 Hiker Clubs
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--secondary-text)' }}>Certified Aravalli Sentries</div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 1: Log Shoreline Audit */}
      {showLogModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(16, 45, 35, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            width: '100%',
            maxWidth: '520px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            border: '1px solid var(--fine-border)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '16px 20px',
              backgroundColor: 'var(--surface-sandstone)',
              borderBottom: '1px solid var(--fine-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={16} color="var(--primary-forest)" />
                <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: 'var(--primary-forest)' }}>
                  Log Citizen Shoreline Audit
                </h3>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary-text)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitAudit} style={{ padding: '20px' }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Monitoring Station
                </label>
                <select
                  value={newAuditStation}
                  onChange={(e) => setNewAuditStation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    fontSize: '0.78rem',
                    borderRadius: '4px',
                    border: '1px solid var(--fine-border)',
                  }}
                >
                  {CITIZEN_STATIONS.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Turbidity (NTU)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newAuditNtu}
                    onChange={(e) => setNewAuditNtu(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      fontSize: '0.78rem',
                      borderRadius: '4px',
                      border: '1px solid var(--fine-border)',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Secchi Depth (m)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={newAuditSecchi}
                    onChange={(e) => setNewAuditSecchi(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      fontSize: '0.78rem',
                      borderRadius: '4px',
                      border: '1px solid var(--fine-border)',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Observation & Notes
                </label>
                <textarea
                  rows={3}
                  value={newAuditNotes}
                  onChange={(e) => setNewAuditNotes(e.target.value)}
                  placeholder="Note water color, algae, surface scum or sediment discharge..."
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    fontSize: '0.78rem',
                    borderRadius: '4px',
                    border: '1px solid var(--fine-border)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    borderRadius: '4px',
                    border: '1px solid var(--fine-border)',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="apple-pressable"
                  style={{
                    padding: '8px 18px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    borderRadius: '4px',
                    backgroundColor: 'var(--deep-green)',
                    color: '#FFFFFF',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Save & Publish Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: IoT Sensor Specification & Integration Guide */}
      {showIotModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(16, 45, 35, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '85vh',
            overflowY: 'auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            border: '1px solid var(--fine-border)',
          }}>
            <div style={{
              padding: '16px 20px',
              backgroundColor: 'var(--surface-sandstone)',
              borderBottom: '1px solid var(--fine-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={16} color="var(--primary-forest)" />
                <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: 'var(--primary-forest)' }}>
                  Physical IoT & Telemetry Ingestion Architecture
                </h3>
              </div>
              <button
                onClick={() => setShowIotModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary-text)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '20px', fontSize: '0.78rem', color: 'var(--primary-text)', lineHeight: 1.6 }}>
              <div style={{
                padding: '12px 14px',
                backgroundColor: '#EDF7EE',
                border: '1px solid #BBF7D0',
                borderRadius: '6px',
                marginBottom: '16px',
                color: '#15803D',
              }}>
                <strong>Notice of Data Integrity:</strong> No simulated telemetry is passed off as physical hardware. Where IoT nodes or vendor gateways are not physically connected, Dharohar provides this standard data contract and runs in <em>Validated Sample Mode</em> calibrated to CPCB reference guidelines.
              </div>

              <h4 style={{ fontSize: '0.86rem', fontWeight: 700, margin: '14px 0 6px 0', color: 'var(--primary-forest)' }}>
                1. Sensor Telemetry Ingestion Pipeline
              </h4>
              <p style={{ margin: '0 0 10px 0', color: 'var(--secondary-text)' }}>
                <code>Calibrated Optical Turbidity Probe + DS18B20 Temp + Glass pH Probe</code> ➔ <code>ESP32 / LoRaWAN Node</code> ➔ <code>MQTT over TLS (Port 8883)</code> ➔ <code>IoT Ingestion Gateway</code> ➔ <code>PostgreSQL / TimescaleDB</code> ➔ <code>SSE / WebSockets</code> ➔ <code>Dharohar React Dashboard</code>.
              </p>

              <h4 style={{ fontSize: '0.86rem', fontWeight: 700, margin: '14px 0 6px 0', color: 'var(--primary-forest)' }}>
                2. Telemetry Payload Contract (JSON)
              </h4>
              <pre style={{
                backgroundColor: '#1E293B',
                color: '#E2E8F0',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                overflowX: 'auto',
                fontFamily: 'monospace',
              }}>
{`{
  "station_id": "ambrai_ghat",
  "device_id": "dharohar_turbidity_probe_001",
  "observed_at": "2026-10-26T10:30:00Z",
  "turbidity_ntu": 8.4,
  "water_temperature_c": 26.1,
  "ph": 7.4,
  "quality_flag": "calibrated_valid",
  "battery_pct": 98.4
}`}
              </pre>

              <h4 style={{ fontSize: '0.86rem', fontWeight: 700, margin: '14px 0 6px 0', color: 'var(--primary-forest)' }}>
                3. Activation Instructions for Real Hardware
              </h4>
              <ul style={{ paddingLeft: '20px', margin: '0 0 16px 0', color: 'var(--secondary-text)' }}>
                <li>Set environment variable <code>MQTT_BROKER_URL=tls://iot.dharohar.org:8883</code>.</li>
                <li>Flash ESP32 with Dharohar firmware using mutual TLS certificates.</li>
                <li>Authorize camera RTSP/HLS stream endpoint in <code>NEXT_PUBLIC_STREAM_GATEWAY_URL</code>.</li>
              </ul>

              <div style={{ textAlign: 'right' }}>
                <button
                  onClick={() => setShowIotModal(false)}
                  className="apple-pressable"
                  style={{
                    padding: '8px 18px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    borderRadius: '4px',
                    backgroundColor: 'var(--deep-green)',
                    color: '#FFFFFF',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Close Specification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Official Rajput Boarding Pass & QR Patronage Ticket */}
      {activeBoardingPassModal && (
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
            {/* Top Rajput Gold Header */}
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
              <div>
                <div style={{ fontSize: '0.62rem', color: '#FCD34D', fontWeight: 700, letterSpacing: '0.04em' }}>
                  GOVERNMENT OF RAJASTHAN • UDAIPUR LAKE BASIN
                </div>
                <strong style={{ fontSize: '0.96rem', letterSpacing: '0.02em' }}>
                  ARAVALLI WATERSHED PATRONAGE BOARDING PASS
                </strong>
              </div>
              <button
                onClick={() => setActiveBoardingPassModal(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FAF8F2', fontSize: '1.1rem', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>

            {/* Ticket Body with Ornamental Stamp */}
            <div style={{ padding: '20px', background: 'linear-gradient(135deg, #FAF8F2 0%, #F5EFEB 100%)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px dashed var(--antique-gold)', paddingBottom: '10px' }}>
                <div>
                  <span style={{ fontSize: '0.66rem', color: 'var(--secondary-text)' }}>Booking Reference (PNR):</span>
                  <div className="mono-text" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-forest)' }}>
                    {activeBoardingPassModal.pnr}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.66rem', color: 'var(--secondary-text)' }}>Sailing Slot:</span>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--antique-gold)' }}>
                    {activeBoardingPassModal.timeSlot}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
                <div style={{ flex: 1, fontSize: '0.74rem', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div><strong>Lead Passenger:</strong> {activeBoardingPassModal.passengerName}</div>
                  <div><strong>Guest Count:</strong> {activeBoardingPassModal.passengerCount} Passengers (Confirmed)</div>
                  <div><strong>Cruise Route:</strong> {activeBoardingPassModal.routeName}</div>
                  <div><strong>Travel Date:</strong> {activeBoardingPassModal.travelDate}</div>
                  <div><strong>Total Fare Paid:</strong> ₹{activeBoardingPassModal.grandTotalInr}.00</div>
                </div>

                {/* QR Code Stamp */}
                <div
                  style={{
                    width: '110px',
                    height: '110px',
                    border: '1.5px solid var(--antique-gold)',
                    borderRadius: '6px',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px',
                    textAlign: 'center',
                    flexShrink: 0,
                  }}
                >
                  <QrCode size={64} color="var(--primary-forest)" />
                  <span className="mono-text" style={{ fontSize: '0.55rem', fontWeight: 700, color: 'var(--status-warning)', marginTop: '2px' }}>
                    VALIDATED QR
                  </span>
                </div>
              </div>

              {/* Ring-Fenced Cess Box */}
              <div
                style={{
                  backgroundColor: '#EDF7EE',
                  border: '1px solid #BBF7D0',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  fontSize: '0.72rem',
                  color: '#15803D',
                  marginBottom: '14px',
                }}
              >
                <div style={{ fontWeight: 800, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} />
                  <span>₹{activeBoardingPassModal.cessTotalInr} Aravalli Watershed Patronage Disbursed:</span>
                </div>
                <div>
                  Maintaining <strong>{activeBoardingPassModal.sponsoredCheckDamName}</strong> ({activeBoardingPassModal.sponsoredCheckDamCode}) under {activeBoardingPassModal.watershedVillage}.
                </div>
                <div style={{ color: 'var(--water-blue)', fontWeight: 700, marginTop: '2px' }}>
                  💧 Recharges +{activeBoardingPassModal.waterConservedLiters.toLocaleString()} Liters of fresh mountain rainwater directly into {activeBoardingPassModal.lakeName}.
                </div>
              </div>

              {/* Verification & Print Action */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--fine-border)', paddingTop: '12px' }}>
                <span className="mono-text" style={{ fontSize: '0.62rem', color: 'var(--secondary-text)' }}>
                  {activeBoardingPassModal.qrHash} • Verified by Lake Conservation Samiti
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => window.print()}
                    className="apple-pressable"
                    style={{
                      padding: '7px 14px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--fine-border)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--primary-forest)',
                    }}
                  >
                    <Download size={13} />
                    <span>Print Boarding Pass</span>
                  </button>
                  <button
                    onClick={() => setActiveBoardingPassModal(null)}
                    className="apple-pressable"
                    style={{
                      padding: '7px 16px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      backgroundColor: 'var(--deep-green)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Trekker Gully Civil & Work Order Dossier */}
      {selectedDossierIncident && (
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
              border: '1px solid var(--fine-border)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '16px 20px',
                backgroundColor: 'var(--surface-sandstone)',
                borderBottom: '1px solid var(--fine-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mountain size={18} color="var(--primary-forest)" />
                <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: 'var(--primary-forest)' }}>
                  Trekker Gully Civil Dossier &amp; MGNREGA Work Order
                </h3>
              </div>
              <button
                onClick={() => setSelectedDossierIncident(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary-text)', fontSize: '1.1rem', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.76rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="mono-text" style={{ fontSize: '0.70rem', fontWeight: 800, color: 'var(--antique-gold)' }}>
                    {selectedDossierIncident.mgnregaWorkOrderId}
                  </span>
                  <span style={{ fontSize: '0.64rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#EDF7EE', color: '#15803D', fontWeight: 700 }}>
                    {selectedDossierIncident.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <h4 style={{ fontSize: '1.05rem', margin: '2px 0 4px 0', color: 'var(--primary-forest)', fontWeight: 800 }}>
                  {selectedDossierIncident.trailName}
                </h4>
                <div style={{ color: 'var(--secondary-text)', fontSize: '0.72rem' }}>
                  📍 Landmark: <strong>{selectedDossierIncident.landmark}</strong> • Altitude: <strong>{selectedDossierIncident.elevationM}m MSL</strong>
                </div>
              </div>

              {/* Physical Measurements Grid */}
              <div
                style={{
                  backgroundColor: '#F9F8F5',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  border: '1px solid var(--fine-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--secondary-text)' }}>Observed Headcut Depth:</span>
                  <strong style={{ color: '#B91C1C' }}>{selectedDossierIncident.headcutDepthM} Meters</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--secondary-text)' }}>Active Incision Length:</span>
                  <strong>{selectedDossierIncident.incisionLengthM} Meters along ridge</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--secondary-text)' }}>Detached Scree Material:</span>
                  <strong>{selectedDossierIncident.soilType}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--secondary-text)' }}>Required Boulder Stone:</span>
                  <strong style={{ color: '#15803D' }}>{selectedDossierIncident.stoneVolumeNeededM3} m³ Graded Boulder Stone</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--secondary-text)' }}>MGNREGA Sanctioned Budget:</span>
                  <strong style={{ color: '#B45309' }}>{selectedDossierIncident.remedyCostInr} (Labour + Cartage)</strong>
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '4px', padding: '8px 12px', fontSize: '0.70rem', color: '#92400E' }}>
                ⚠️ <strong>Downstream Threat:</strong> {selectedDossierIncident.downstreamRisk}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--fine-border)', paddingTop: '12px' }}>
                <button
                  onClick={() => {
                    setTrekkerIncidents((prev) =>
                      prev.map((inc) =>
                        inc.id === selectedDossierIncident.id
                          ? { ...inc, status: 'DISPATCHED_TO_FIELD' }
                          : inc
                      )
                    );
                    setSelectedDossierIncident((prev) => (prev ? { ...prev, status: 'DISPATCHED_TO_FIELD' } : null));
                    setGullySuccessMessage(`Work Order ${selectedDossierIncident.mgnregaWorkOrderId} dispatched to Block Watershed Field Action Network!`);
                  }}
                  className="apple-pressable"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'var(--deep-green)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Dispatch to Field Action Team
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      setTrekkerIncidents((prev) =>
                        prev.map((inc) =>
                          inc.id === selectedDossierIncident.id
                            ? { ...inc, status: 'COMMUNITY_RESOLVED' }
                            : inc
                        )
                      );
                      setSelectedDossierIncident((prev) => (prev ? { ...prev, status: 'COMMUNITY_RESOLVED' } : null));
                      setGullySuccessMessage(`Incident ${selectedDossierIncident.id} marked as Stabilized via community stone plug!`);
                    }}
                    className="apple-pressable"
                    style={{
                      padding: '8px 14px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--fine-border)',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: '#15803D',
                    }}
                  >
                    Mark Stabilized
                  </button>
                  <button
                    onClick={() => setSelectedDossierIncident(null)}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: '#F3F4F6',
                      border: 'none',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 5: Log Trekker Gully Incident Form */}
      {isLogGullyModalOpen && (
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
              maxWidth: '520px',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.22)',
              border: '1px solid var(--fine-border)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                backgroundColor: 'var(--surface-sandstone)',
                borderBottom: '1px solid var(--fine-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mountain size={18} color="var(--primary-forest)" />
                <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: 'var(--primary-forest)' }}>
                  Report Trail Gully Incision (Trekker Sentry)
                </h3>
              </div>
              <button
                onClick={() => setIsLogGullyModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary-text)', fontSize: '1.1rem', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const depthNum = parseFloat(gullyDepthM) || 1.2;
                const lengthNum = parseFloat(gullyLengthM) || 25;
                const newIncident: TrekkerGullyIncident = {
                  id: `GULLY-2026-${Math.floor(100 + Math.random() * 900)}`,
                  trailName: gullyTrailName,
                  landmark: gullyTrailName.includes('Bahubali') ? 'Bahubali Northern Scree' : gullyTrailName.includes('Sajjangarh') ? 'Sajjangarh West Contour' : 'Alsigarh Ridge Feeder',
                  latitude: 24.618,
                  longitude: 73.621,
                  elevationM: 760,
                  headcutDepthM: depthNum,
                  incisionLengthM: lengthNum,
                  severity: depthNum >= 1.5 ? 'CRITICAL_HEADCUT' : depthNum >= 0.6 ? 'ACTIVE_INCISION' : 'STABILIZED_COMMUNITY',
                  soilType: gullySoilType,
                  reporterName: gullyReporterName || 'Mewar Eco-Hiker',
                  reportedDate: 'Just now',
                  downstreamRisk: gullyDownstreamRisk,
                  suggestedAction: gullyProposedRemedy,
                  mgnregaWorkOrderId: `WO-ARAVALLI-2026-${Math.floor(100 + Math.random() * 900)}`,
                  remedyCostInr: `₹${Math.round(lengthNum * 820).toLocaleString()}`,
                  stoneVolumeNeededM3: Math.round(depthNum * lengthNum * 0.35),
                  status: 'DISPATCHED_TO_FIELD',
                  photoUrl: '/images/aravalli_ridge_conservation.jpg',
                };
                setTrekkerIncidents([newIncident, ...trekkerIncidents]);
                setIsLogGullyModalOpen(false);
                setGullySuccessMessage(`Trail gully report logged! MGNREGA work order ${newIncident.mgnregaWorkOrderId} created.`);
              }}
              style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
                  Hiking Trail &amp; Location:
                </label>
                <select
                  value={gullyTrailName}
                  onChange={(e) => setGullyTrailName(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', fontSize: '0.76rem', borderRadius: '4px', border: '1px solid var(--fine-border)' }}
                >
                  <option value="Bahubali Peak Ridge Trail (KM 1.4)">Bahubali Peak Ridge Trail (KM 1.4)</option>
                  <option value="Sajjangarh Wildlife Ridge Trail">Sajjangarh Wildlife Ridge Trail</option>
                  <option value="Purohito Ka Talab Spillway Trail">Purohito Ka Talab Spillway Trail</option>
                  <option value="Alsigarh Mountain Gorge Trail">Alsigarh Mountain Gorge Trail</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
                    Headcut Depth (Meters):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={gullyDepthM}
                    onChange={(e) => setGullyDepthM(e.target.value)}
                    style={{ width: '100%', padding: '7px', fontSize: '0.76rem', borderRadius: '4px', border: '1px solid var(--fine-border)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
                    Incision Length (Meters):
                  </label>
                  <input
                    type="number"
                    value={gullyLengthM}
                    onChange={(e) => setGullyLengthM(e.target.value)}
                    style={{ width: '100%', padding: '7px', fontSize: '0.76rem', borderRadius: '4px', border: '1px solid var(--fine-border)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
                  Soil / Scour Material Observed:
                </label>
                <input
                  type="text"
                  value={gullySoilType}
                  onChange={(e) => setGullySoilType(e.target.value)}
                  style={{ width: '100%', padding: '7px', fontSize: '0.76rem', borderRadius: '4px', border: '1px solid var(--fine-border)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
                  Downstream Lake Threat:
                </label>
                <input
                  type="text"
                  value={gullyDownstreamRisk}
                  onChange={(e) => setGullyDownstreamRisk(e.target.value)}
                  style={{ width: '100%', padding: '7px', fontSize: '0.76rem', borderRadius: '4px', border: '1px solid var(--fine-border)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
                  Trekker Name / Club:
                </label>
                <input
                  type="text"
                  value={gullyReporterName}
                  onChange={(e) => setGullyReporterName(e.target.value)}
                  style={{ width: '100%', padding: '7px', fontSize: '0.76rem', borderRadius: '4px', border: '1px solid var(--fine-border)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsLogGullyModalOpen(false)}
                  style={{ padding: '7px 14px', fontSize: '0.74rem', borderRadius: '4px', border: '1px solid var(--fine-border)', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="apple-pressable"
                  style={{ padding: '7px 18px', fontSize: '0.74rem', fontWeight: 700, borderRadius: '4px', backgroundColor: 'var(--deep-green)', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
                >
                  Submit Sentry Report &amp; Issue Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Why Did Lake Turbidity Change? (Hydraulic Rationale) */}
      {showTurbidityReasonModal && activeStormScenario && (
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
                <Waves size={18} color="#FCD34D" />
                <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800 }}>
                  Lake Turbidity Surge &amp; Colloidal Dynamics
                </h3>
              </div>
              <button
                onClick={() => setShowTurbidityReasonModal(false)}
                style={{ background: 'none', border: 'none', color: '#FAF8F2', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '20px', fontSize: '0.78rem', color: 'var(--primary-text)', lineHeight: 1.6 }}>
              <div style={{ backgroundColor: '#E0F2FE', border: '1px solid #BAE6FD', padding: '12px', borderRadius: '6px', marginBottom: '14px', color: '#0369A1' }}>
                <strong>Active Storm Simulation:</strong> {activeStormScenario.scenarioName} ({activeStormScenario.rainfallMm}mm over {activeStormScenario.durationHours}h)
              </div>

              <h4 style={{ margin: '0 0 6px 0', fontSize: '0.86rem', color: 'var(--primary-forest)', fontWeight: 800 }}>
                1. Measured Sensor Baseline vs. Simulated Storm Telemetry
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                <div style={{ padding: '10px', backgroundColor: 'var(--surface-sandstone)', borderRadius: '4px', border: '1px solid var(--fine-border)' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--secondary-text)' }}>Calm Season Baseline:</span>
                  <div className="mono-text" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--secondary-text)' }}>
                    8.4 NTU (Clear)
                  </div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--secondary-text)' }}>Secchi Depth: ~1.8m</div>
                </div>
                <div style={{ padding: '10px', backgroundColor: '#FEF3C7', borderRadius: '4px', border: '1px solid #FDE68A' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--status-warning)' }}>Simulated Storm Inflow:</span>
                  <div className="mono-text" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--status-warning)' }}>
                    {activeStormScenario.lakeTurbiditySurgeNtu} NTU (Plume)
                  </div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--status-warning)' }}>Secchi Depth: ~0.4m</div>
                </div>
              </div>

              <h4 style={{ margin: '0 0 6px 0', fontSize: '0.86rem', color: 'var(--primary-forest)', fontWeight: 800 }}>
                2. Hydraulic Cause &amp; Sediment Settling Rationale
              </h4>
              <p style={{ margin: '0 0 10px 0', color: 'var(--secondary-text)' }}>
                When precipitation intensity exceeds the soil infiltration capacity ($I &gt; f_c$), overland sheetwash transports colloidal suspension particles (phyllite and red loam clays) down mountain gullies directly into Ambrai Ghat and Gangaur Ghat.
              </p>
              <ul style={{ paddingLeft: '18px', margin: '0 0 14px 0', color: 'var(--secondary-text)', fontSize: '0.74rem' }}>
                <li><strong>Sediment Plume Time-to-Settle:</strong> Stokes&apos; Law models fine colloidal clays settling over 36–48 hours post-storm.</li>
                <li><strong>Lake Volume Expansion:</strong> Inflow of ~{activeStormScenario.runoffVolumeMcm} MCM raises Lake Pichola water level by +{activeStormScenario.lakeLevelRiseMeters}m above the 571.8m MSL sill.</li>
                <li><strong>Municipal Action:</strong> Sentry hub triggers automated public notice recommending tourists avoid swimming until Secchi clarity returns to &gt;1.2m.</li>
              </ul>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--fine-border)' }}>
                <button
                  onClick={() => setShowTurbidityReasonModal(false)}
                  style={{ padding: '7px 14px', borderRadius: '4px', border: '1px solid var(--fine-border)', backgroundColor: '#FFFFFF', cursor: 'pointer', fontSize: '0.74rem' }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowTurbidityReasonModal(false);
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
