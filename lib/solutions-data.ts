// Domain 4: Agri-Tech & Natural Resource Conservation
// Specialized Datasets for Dharohar's 4 Breakthrough Socio-Economic & Ecological Solutions

export interface SiltExtractionZone {
  id: string;
  name: string;
  hindiName: string;
  lakeName: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  siltDepthMeters: number;
  estimatedVolumeTonnes: number;
  soilComposition: {
    organicCarbonPercent: number; // e.g. 1.8% (very high)
    nitrogenKgPerTon: number; // e.g. 14 kg/t
    phosphorusKgPerTon: number; // e.g. 8.5 kg/t
    potassiumKgPerTon: number; // e.g. 19 kg/t
    phLevel: number; // 7.2 neutral
  };
  status: 'ACTIVE_DREDGING' | 'PLANNED' | 'SEASONAL_RECEDING';
  assignedLogisticsDepot: string;
}

export interface FarmRecipientCluster {
  id: string;
  clusterName: string;
  villageName: string;
  panchayat: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  farmerCount: number;
  totalArableHa: number;
  soilDeficit: string;
  distanceFromLakeKm: number;
  subsidyPerTractorInr: number;
  recommendedSiltTonsPerHa: number;
  fertilizerSavingsPerHaInr: number;
}

export interface WaterCreditCheckDam {
  id: string;
  code: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  catchmentFed: string;
  capacityLiters: number;
  siltRetentionTonnesPerYr: number;
  floodDampingCubicMeters: number;
  availableCredits: number;
  creditPriceInr: number; // e.g., ₹1,800 / credit
  villageSamiti: string;
  panchayatPradhan: string;
  constructionYear: number;
  sponsoredCredits: number;
}

export interface HospitalitySponsor {
  id: string;
  name: string;
  propertyType: '5-Star Luxury Resort' | 'Heritage Palace Hotel' | 'Eco-Retreat' | 'Boutique Lakeview';
  location: string;
  latitude: number;
  longitude: number;
  creditsPurchased: number;
  totalContributionInr: number;
  targetCheckDamId: string;
  status: 'CERTIFIED_GUARDIAN' | 'PLEDGED' | 'ACTIVE_DONOR';
  csrCode: string;
  quote: string;
}

export interface CitizenMonitoringStation {
  id: string;
  name: string;
  hindiName: string;
  waterBody: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  defaultTurbidityNtu: number; // Nephelometric Turbidity Units
  secchiDepthMeters: number;
  status: 'CLEAR_HEALTHY' | 'MODERATE_SILT' | 'EUTROPHIC_RISK';
  sampleImages: {
    label: string;
    description: string;
    turbidity: number;
    secchi: number;
    colorHex: string;
  }[];
  recentReportsCount: number;
}

export interface HeritageCrop {
  id: string;
  cropName: string;
  hindiName: string;
  variety: string;
  waterConsumptionVsHybridPercent: number; // e.g. -58%
  droughtResistance: 'High' | 'Very High' | 'Exceptional';
  producerGroup: string;
  village: string;
  latitude: number;
  longitude: number;
  mandiPricePerKgInr: number; // e.g. 20
  dharoharFairPriceInr: number; // e.g. 48 (2.4x)
  nutritionalHighlights: string;
  annualYieldQuintals: number;
  contractedBuyers: string[];
  watershedCertificationCode: string;
}

// 1. Silt-to-Farm Circular Logistics Data
export const SILT_EXTRACTION_ZONES: SiltExtractionZone[] = [
  {
    id: 'silt-pichola-inlet',
    name: 'Sisarma Feeder Confluence Delta',
    hindiName: 'सीसारमा नदी मुहाना गाद क्षेत्र',
    lakeName: 'Lake Pichola',
    latitude: 24.5624,
    longitude: 73.6642,
    elevationMeters: 591,
    siltDepthMeters: 2.8,
    estimatedVolumeTonnes: 18400,
    soilComposition: {
      organicCarbonPercent: 2.1,
      nitrogenKgPerTon: 16.2,
      phosphorusKgPerTon: 9.4,
      potassiumKgPerTon: 21.0,
      phLevel: 7.3,
    },
    status: 'ACTIVE_DREDGING',
    assignedLogisticsDepot: 'Nai-Sisarma Riverbank Transfer Station',
  },
  {
    id: 'silt-fateh-sagar-gate',
    name: 'Swaroop Sagar Lock Basin',
    hindiName: 'स्वरूप सागर लिंक लॉक गाद जमाव',
    lakeName: 'Fateh Sagar Link',
    latitude: 24.5822,
    longitude: 73.6791,
    elevationMeters: 588,
    siltDepthMeters: 1.9,
    estimatedVolumeTonnes: 9200,
    soilComposition: {
      organicCarbonPercent: 1.7,
      nitrogenKgPerTon: 13.5,
      phosphorusKgPerTon: 7.8,
      potassiumKgPerTon: 18.2,
      phLevel: 7.1,
    },
    status: 'PLANNED',
    assignedLogisticsDepot: 'Malla Talai North Yard',
  },
  {
    id: 'silt-goverdhan-sagar',
    name: 'Goverdhan Sagar Silt Sump',
    hindiName: 'गोवर्धन सागर अपवाह गाद कुंड',
    lakeName: 'Goverdhan Sagar',
    latitude: 24.5412,
    longitude: 73.6738,
    elevationMeters: 584,
    siltDepthMeters: 2.2,
    estimatedVolumeTonnes: 12600,
    soilComposition: {
      organicCarbonPercent: 1.9,
      nitrogenKgPerTon: 15.0,
      phosphorusKgPerTon: 8.9,
      potassiumKgPerTon: 20.1,
      phLevel: 7.4,
    },
    status: 'ACTIVE_DREDGING',
    assignedLogisticsDepot: 'Balicha South Agro Transit',
  },
];

export const FARM_RECIPIENT_CLUSTERS: FarmRecipientCluster[] = [
  {
    id: 'farm-nai-terrace',
    clusterName: 'Nai West Terraced Fields (Cluster A)',
    villageName: 'Nai',
    panchayat: 'Nai Gram Panchayat',
    latitude: 24.5580,
    longitude: 73.6290,
    elevationMeters: 624,
    farmerCount: 84,
    totalArableHa: 112,
    soilDeficit: 'Skeletal quartz scree; acute nitrogen & organic carbon deficiency',
    distanceFromLakeKm: 4.8,
    subsidyPerTractorInr: 650,
    recommendedSiltTonsPerHa: 45,
    fertilizerSavingsPerHaInr: 8400,
  },
  {
    id: 'farm-bujhra-south',
    clusterName: 'Bujhra Valley Organic Cooperative',
    villageName: 'Bujhra',
    panchayat: 'Bujhra Gram Panchayat',
    latitude: 24.5685,
    longitude: 73.6380,
    elevationMeters: 610,
    farmerCount: 62,
    totalArableHa: 88,
    soilDeficit: 'Degraded coarse loam stripped by 2023 flash flood',
    distanceFromLakeKm: 3.2,
    subsidyPerTractorInr: 520,
    recommendedSiltTonsPerHa: 38,
    fertilizerSavingsPerHaInr: 9100,
  },
  {
    id: 'farm-sisarma-east',
    clusterName: 'Sisarma Feeder Bank Smallholders',
    villageName: 'Sisarma',
    panchayat: 'Sisarma Gram Panchayat',
    latitude: 24.5520,
    longitude: 73.6540,
    elevationMeters: 598,
    farmerCount: 45,
    totalArableHa: 64,
    soilDeficit: 'Riverbank erosion and shallow topsoil over fractured phyllite',
    distanceFromLakeKm: 1.8,
    subsidyPerTractorInr: 400,
    recommendedSiltTonsPerHa: 50,
    fertilizerSavingsPerHaInr: 10200,
  },
  {
    id: 'farm-alsigarh-plateau',
    clusterName: 'Alsigarh Tribal Foothill Terraces',
    villageName: 'Alsigarh',
    panchayat: 'Alsigarh Gram Panchayat',
    latitude: 24.5310,
    longitude: 73.5980,
    elevationMeters: 665,
    farmerCount: 118,
    totalArableHa: 145,
    soilDeficit: 'Steep slope sheetwash; severe topsoil starvation',
    distanceFromLakeKm: 8.4,
    subsidyPerTractorInr: 850,
    recommendedSiltTonsPerHa: 40,
    fertilizerSavingsPerHaInr: 7800,
  },
];

// 2. Aravalli Water Credits & PES (Payment for Ecosystem Services) Data
export const WATER_CREDIT_CHECK_DAMS: WaterCreditCheckDam[] = [
  {
    id: 'dam-cd01',
    code: 'CD-01-BANSDARA',
    name: 'Bansdara Upper Ridge Check Dam',
    location: 'Bansdara Escarpment Feeder (Sajjangarh)',
    latitude: 24.5880,
    longitude: 73.6350,
    elevationMeters: 670,
    catchmentFed: 'Lake Pichola Western Feeder',
    capacityLiters: 18500000,
    siltRetentionTonnesPerYr: 1850,
    floodDampingCubicMeters: 28000,
    availableCredits: 120,
    creditPriceInr: 1800,
    villageSamiti: 'Bansdara Van Suraksha Samiti',
    panchayatPradhan: 'Kishan Meena',
    constructionYear: 2024,
    sponsoredCredits: 85,
  },
  {
    id: 'dam-cd02',
    code: 'CD-02-ALSIGARH',
    name: 'Alsigarh High Gorge Masonry Dam',
    location: 'Upper Sisarma Tributary Canyon',
    latitude: 24.5385,
    longitude: 73.6050,
    elevationMeters: 685,
    catchmentFed: 'Sisarma River Primary Trunk',
    capacityLiters: 32000000,
    siltRetentionTonnesPerYr: 3100,
    floodDampingCubicMeters: 45000,
    availableCredits: 210,
    creditPriceInr: 1800,
    villageSamiti: 'Alsigarh Jal Sangam',
    panchayatPradhan: 'Geeta Devi Rawat',
    constructionYear: 2023,
    sponsoredCredits: 160,
  },
  {
    id: 'dam-cd03',
    code: 'CD-03-MADAR',
    name: 'Upper Madar Silt Decantation Weir',
    location: 'Madar Lock Canal Feeder',
    latitude: 24.6320,
    longitude: 73.6420,
    elevationMeters: 642,
    catchmentFed: 'Fateh Sagar Feeder Canal',
    capacityLiters: 24000000,
    siltRetentionTonnesPerYr: 2400,
    floodDampingCubicMeters: 36000,
    availableCredits: 150,
    creditPriceInr: 1800,
    villageSamiti: 'Madar Paryavaran Samiti',
    panchayatPradhan: 'Shambhu Lal Gameti',
    constructionYear: 2024,
    sponsoredCredits: 110,
  },
];

export const HOSPITALITY_SPONSORS: HospitalitySponsor[] = [
  {
    id: 'hotel-taj-lake-palace',
    name: 'Taj Lake Palace (Jag Niwas)',
    propertyType: 'Heritage Palace Hotel',
    location: 'Lake Pichola Island',
    latitude: 24.5758,
    longitude: 73.6795,
    creditsPurchased: 120,
    totalContributionInr: 216000,
    targetCheckDamId: 'dam-cd01',
    status: 'CERTIFIED_GUARDIAN',
    csrCode: 'CSR-RAJ-2025-UDAI-001',
    quote: 'The pristine waters of Pichola are our historic identity; protecting the Bansdara ridge is our sacred corporate duty.',
  },
  {
    id: 'hotel-oberoi-udaivilas',
    name: 'The Oberoi Udaivilas',
    propertyType: '5-Star Luxury Resort',
    location: 'Haridas Ji Ki Magri, Western Pichola',
    latitude: 24.5770,
    longitude: 73.6690,
    creditsPurchased: 140,
    totalContributionInr: 252000,
    targetCheckDamId: 'dam-cd01',
    status: 'CERTIFIED_GUARDIAN',
    csrCode: 'CSR-RAJ-2025-UDAI-002',
    quote: 'Investing in upstream soil stabilization directly reduces our lakefront water filtration load and protects tourism.',
  },
  {
    id: 'hotel-leela-palace',
    name: 'The Leela Palace Udaipur',
    propertyType: '5-Star Luxury Resort',
    location: 'Lake Pichola Flank',
    latitude: 24.5790,
    longitude: 73.6750,
    creditsPurchased: 95,
    totalContributionInr: 171000,
    targetCheckDamId: 'dam-cd02',
    status: 'CERTIFIED_GUARDIAN',
    csrCode: 'CSR-RAJ-2025-UDAI-003',
    quote: 'Eco-reciprocity with the Alsigarh watershed ensures year-round live lake water for the entire city.',
  },
  {
    id: 'hotel-fateh-garh',
    name: 'Fateh Garh Heritage Palace',
    propertyType: 'Boutique Lakeview',
    location: 'Sisarma Hills Viewpoint',
    latitude: 24.5585,
    longitude: 73.6520,
    creditsPurchased: 60,
    totalContributionInr: 108000,
    targetCheckDamId: 'dam-cd02',
    status: 'PLEDGED',
    csrCode: 'CSR-RAJ-2026-UDAI-004',
    quote: 'Every check dam built in Sisarma directly shields the agricultural heartland below our sanctuary.',
  },
];

// 3. Jal-Chowkidar Citizen & Tourist Stations Data
export const CITIZEN_STATIONS: CitizenMonitoringStation[] = [
  {
    id: 'station-ambrai-ghat',
    name: 'Ambrai Ghat (Ahar Feeder Mouth)',
    hindiName: 'अम्बराई घाट (पिछोला उत्तरी तट)',
    waterBody: 'Lake Pichola',
    latitude: 24.5785,
    longitude: 73.6805,
    elevationMeters: 590,
    defaultTurbidityNtu: 8.4,
    secchiDepthMeters: 1.85,
    status: 'CLEAR_HEALTHY',
    sampleImages: [
      { label: 'Morning Post-Monsoon', description: 'Crystal azure with sunlight penetration to 2.1m', turbidity: 5.2, secchi: 2.1, colorHex: '#2563EB' },
      { label: 'Pre-Storm Silt Influx', description: 'Suspended clay particles during flash runoff', turbidity: 24.6, secchi: 0.8, colorHex: '#92400E' },
    ],
    recentReportsCount: 142,
  },
  {
    id: 'station-fateh-sagar-pal',
    name: 'Fateh Sagar Pal Promenade',
    hindiName: 'फतह सागर पाल पैदल मार्ग',
    waterBody: 'Fateh Sagar',
    latitude: 24.5990,
    longitude: 73.6760,
    elevationMeters: 588,
    defaultTurbidityNtu: 12.1,
    secchiDepthMeters: 1.40,
    status: 'MODERATE_SILT',
    sampleImages: [
      { label: 'Normal Citizen Walkway', description: 'Moderate particulate level from city stormwater', turbidity: 11.8, secchi: 1.45, colorHex: '#0D9488' },
      { label: 'Algal Surge Peak', description: 'Nutrient loading from Madar overflow canal', turbidity: 32.0, secchi: 0.55, colorHex: '#15803D' },
    ],
    recentReportsCount: 236,
  },
  {
    id: 'station-gangaur-ghat',
    name: 'Gangaur Ghat Heritage Waterfront',
    hindiName: 'गणगौर घाट हेरिटेज किनारा',
    waterBody: 'Lake Pichola',
    latitude: 24.5800,
    longitude: 73.6830,
    elevationMeters: 590,
    defaultTurbidityNtu: 9.6,
    secchiDepthMeters: 1.70,
    status: 'CLEAR_HEALTHY',
    sampleImages: [
      { label: 'Festival Baseline', description: 'Clean heritage basin with active municipal skimmers', turbidity: 7.9, secchi: 1.9, colorHex: '#1D4ED8' },
    ],
    recentReportsCount: 98,
  },
  {
    id: 'station-badi-lake',
    name: 'Badi Lake (Jiyan Sagar) Dam Wall',
    hindiName: 'बड़ी झील (जियान सागर) पाल',
    waterBody: 'Badi Lake',
    latitude: 24.6180,
    longitude: 73.6210,
    elevationMeters: 622,
    defaultTurbidityNtu: 4.8,
    secchiDepthMeters: 2.60,
    status: 'CLEAR_HEALTHY',
    sampleImages: [
      { label: 'Dolomite Filtered Water', description: 'Extremely clear highland catchment water', turbidity: 4.2, secchi: 2.8, colorHex: '#0284C7' },
    ],
    recentReportsCount: 74,
  },
];

// 4. Mewari Heritage Crops & Fair Market Data
export const HERITAGE_CROPS: HeritageCrop[] = [
  {
    id: 'crop-desi-makka',
    cropName: 'Mewari Desi Safed Makka',
    hindiName: 'मेवाड़ी देसी सफेद मक्का (धरोहर बीज)',
    variety: 'Mewar Indigenous White Flint Maize (Non-GMO)',
    waterConsumptionVsHybridPercent: -62,
    droughtResistance: 'Exceptional',
    producerGroup: 'Nai Mahila Krishi SHG & Alsigarh Sangam',
    village: 'Nai & Alsigarh',
    latitude: 24.5580,
    longitude: 73.6290,
    mandiPricePerKgInr: 21,
    dharoharFairPriceInr: 52, // 2.47x price realization
    nutritionalHighlights: 'High dietary fiber, slow glycemic release, drought-induced protein density (11.8%)',
    annualYieldQuintals: 340,
    contractedBuyers: ['The Oberoi Udaivilas', 'Taj Lake Palace Fine Dining', 'Mewari Swad Organic Retails'],
    watershedCertificationCode: 'MEWAR-QR-MAIZE-2025-081',
  },
  {
    id: 'crop-safed-til',
    cropName: 'Aravalli Wild Safed Til (Sesame)',
    hindiName: 'अरावली सफेद तिल (कम पानी फसल)',
    variety: 'Native Girwa Hillside Sesame',
    waterConsumptionVsHybridPercent: -74,
    droughtResistance: 'Exceptional',
    producerGroup: 'Bujhra Agro-Ecology Cooperative',
    village: 'Bujhra',
    latitude: 24.5685,
    longitude: 73.6380,
    mandiPricePerKgInr: 95,
    dharoharFairPriceInr: 210, // 2.21x
    nutritionalHighlights: 'Unrefined cold-press sesame lignans, 48% oil content, natural pest deterrent',
    annualYieldQuintals: 180,
    contractedBuyers: ['The Leela Palace Udaipur Spa & Kitchens', 'Fateh Garh Organic Bistro'],
    watershedCertificationCode: 'MEWAR-QR-SESAME-2025-044',
  },
  {
    id: 'crop-desi-chana',
    cropName: 'Kankroli Brown Desi Chana (Chickpea)',
    hindiName: 'कांकरोली देसी भूरा चना (सूखा प्रतिरोधी)',
    variety: 'Hard-Rock Drought Tolerant Pulses',
    waterConsumptionVsHybridPercent: -55,
    droughtResistance: 'High',
    producerGroup: 'Sisarma Watershed Farmer Collective',
    village: 'Sisarma',
    latitude: 24.5520,
    longitude: 73.6540,
    mandiPricePerKgInr: 54,
    dharoharFairPriceInr: 125, // 2.31x
    nutritionalHighlights: 'Deep taproot nitrogen fixer; replenishes 35 kg N/ha into Aravalli hard rock soils',
    annualYieldQuintals: 260,
    contractedBuyers: ['Udaipur Heritage Heritage Hotels Guild', 'Green Udaipur Farm Direct'],
    watershedCertificationCode: 'MEWAR-QR-PULSE-2025-092',
  },
  {
    id: 'crop-van-amla',
    cropName: 'Sajjangarh Wild Forest Amla (Gooseberry)',
    hindiName: 'सज्जनगढ़ वन आंवला (प्राकृतिक संरक्षण)',
    variety: 'Indigenous Mountain Silvopasture Amla',
    waterConsumptionVsHybridPercent: -85,
    droughtResistance: 'Exceptional',
    producerGroup: 'Bansdara Tribal Self-Help Federation',
    village: 'Bansdara Foothills',
    latitude: 24.5880,
    longitude: 73.6350,
    mandiPricePerKgInr: 32,
    dharoharFairPriceInr: 88, // 2.75x
    nutritionalHighlights: 'Pure vitamin C powerhouse (720 mg/100g); stabilizes steep scree contour ridges',
    annualYieldQuintals: 190,
    contractedBuyers: ['Mewar Ayurvedic Trust', 'Udaivilas Wellness Sanctuary'],
    watershedCertificationCode: 'MEWAR-QR-AMLA-2025-115',
  },
];
