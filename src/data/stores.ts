// Market 396 - Las Vegas Metro Area Store Data
// 9 stores under L5 Onyi's oversight

export type SectionKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';

export interface Section {
  key: SectionKey;
  name: string;
  description: string;
  departments: string[];
  color: string;
}

export const SECTIONS: Section[] = [
  { key: 'A', name: 'Executive Summary', description: 'High-level overview', departments: ['Summary', 'KPIs', 'Highlights'], color: '#22C55E' },
  { key: 'B', name: 'Prioritized Action Plan', description: 'Today\'s priorities', departments: ['Actions', 'Tasks', 'Follow-ups'], color: '#3B82F6' },
  { key: 'C', name: 'Competitive Outperform Plan', description: 'Beat the competition', departments: ['Strategy', 'Tactics', 'Positioning'], color: '#A855F7' },
  { key: 'D', name: 'E-Commerce Benchmark', description: 'Online performance', departments: ['OGP', 'Delivery', 'Digital'], color: '#F97316' },
  { key: 'E', name: 'Predictive Stress Map', description: 'Risk forecasting', departments: ['Predictions', 'Alerts', 'Trends'], color: '#EC4899' },
  { key: 'F', name: 'Department Checklists', description: 'Daily task tracking', departments: ['Checklists', 'Compliance', 'Audits'], color: '#06B6D4' },
  { key: 'G', name: 'Risk Watchlist', description: 'Monitor key risks', departments: ['Risks', 'Issues', 'Mitigation'], color: '#EAB308' },
  { key: 'H', name: 'End-of-Day Scorecard', description: 'Daily performance', departments: ['Scores', 'Metrics', 'Results'], color: '#84CC16' },
  { key: 'I', name: 'Communication Aids', description: 'Team messaging', departments: ['Announcements', 'Updates', 'Memos'], color: '#F43F5E' },
  { key: 'J', name: 'Social Media Weekly Plan', description: 'Social content calendar', departments: ['Social', 'Content', 'Engagement'], color: '#6366F1' },
];

export function getSectionByKey(key: SectionKey): Section | undefined {
  return SECTIONS.find(s => s.key === key);
}

export interface Store {
  id: string;
  number: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  format: 'Supercenter' | 'Neighborhood Market';
  sqft: number;
  phone: string;
  openDate: string;
  tier: 'A+' | 'A' | 'B+' | 'B' | 'C+';
  avgDailyTraffic: number;
  peakHours: string[];
  departments: string[];
  features: string[];
  sections: SectionKey[];
  coordinates: { lat: number; lng: number };
  competitorProximity: {
    target: number;
    costco: number;
    amazon: { freshHub: number | null; lockerCount: number };
  };
}

export const MARKET_396_STORES: Store[] = [
  {
    id: 'store-1560',
    number: 1560,
    name: 'Eastern Ave Supercenter',
    address: '6005 S Eastern Ave',
    city: 'Las Vegas',
    state: 'NV',
    zip: '89119',
    format: 'Supercenter',
    sqft: 185000,
    phone: '(702) 451-8700',
    openDate: '1996-08-12',
    tier: 'A',
    avgDailyTraffic: 13200,
    peakHours: ['10:00-12:00', '17:00-19:00'],
    departments: ['Grocery', 'Electronics', 'Home', 'Apparel', 'Pharmacy', 'Vision', 'Auto'],
    features: ['Grocery Pickup', 'MoneyCenter', 'Tire & Lube'],
    sections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    coordinates: { lat: 36.0722, lng: -115.1186 },
    competitorProximity: { target: 1.5, costco: 2.8, amazon: { freshHub: 3.2, lockerCount: 2 } }
  },
  {
    id: 'store-1584',
    number: 1584,
    name: 'Rainbow Blvd Supercenter',
    address: '3615 S Rainbow Blvd',
    city: 'Las Vegas',
    state: 'NV',
    zip: '89103',
    format: 'Supercenter',
    sqft: 178000,
    phone: '(702) 253-9901',
    openDate: '1997-03-20',
    tier: 'A',
    avgDailyTraffic: 12800,
    peakHours: ['09:00-11:00', '16:00-19:00'],
    departments: ['Grocery', 'Electronics', 'Home', 'Apparel', 'Pharmacy', 'Garden'],
    features: ['Grocery Pickup', 'Grocery Delivery', 'MoneyCenter'],
    sections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    coordinates: { lat: 36.1212, lng: -115.2424 },
    competitorProximity: { target: 1.1, costco: 2.2, amazon: { freshHub: 2.9, lockerCount: 3 } }
  },
  {
    id: 'store-2050',
    number: 2050,
    name: 'Lake Mead Supercenter',
    address: '300 E Lake Mead Pkwy',
    city: 'Henderson',
    state: 'NV',
    zip: '89015',
    format: 'Supercenter',
    sqft: 192000,
    phone: '(702) 558-8500',
    openDate: '1998-06-15',
    tier: 'A+',
    avgDailyTraffic: 14500,
    peakHours: ['10:00-12:00', '17:00-20:00'],
    departments: ['Grocery', 'Electronics', 'Home', 'Apparel', 'Pharmacy', 'Vision', 'Sporting Goods'],
    features: ['Grocery Pickup', 'Grocery Delivery', 'Auto Care Center'],
    sections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    coordinates: { lat: 36.0392, lng: -114.9686 },
    competitorProximity: { target: 0.9, costco: 1.8, amazon: { freshHub: 3.5, lockerCount: 2 } }
  },
  {
    id: 'store-2593',
    number: 2593,
    name: 'Serene Ave Supercenter',
    address: '2310 E Serene Ave',
    city: 'Las Vegas',
    state: 'NV',
    zip: '89123',
    format: 'Supercenter',
    sqft: 195000,
    phone: '(702) 614-8500',
    openDate: '2002-09-10',
    tier: 'A+',
    avgDailyTraffic: 15200,
    peakHours: ['09:00-11:00', '16:00-19:00'],
    departments: ['Grocery', 'Electronics', 'Home', 'Apparel', 'Pharmacy', 'Garden', 'Auto'],
    features: ['Grocery Pickup', 'Grocery Delivery', 'MoneyCenter', 'Tire & Lube'],
    sections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    coordinates: { lat: 36.0154, lng: -115.1186 },
    competitorProximity: { target: 0.7, costco: 1.5, amazon: { freshHub: 2.1, lockerCount: 4 } }
  },
  {
    id: 'store-2838',
    number: 2838,
    name: 'Marks St Supercenter',
    address: '540 Marks St',
    city: 'Henderson',
    state: 'NV',
    zip: '89014',
    format: 'Supercenter',
    sqft: 186000,
    phone: '(702) 433-8700',
    openDate: '2000-11-05',
    tier: 'A',
    avgDailyTraffic: 13800,
    peakHours: ['10:00-12:00', '17:00-19:00'],
    departments: ['Grocery', 'Electronics', 'Home', 'Apparel', 'Pharmacy', 'Vision'],
    features: ['Grocery Pickup', 'MoneyCenter', 'Auto Care Center'],
    sections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    coordinates: { lat: 36.0589, lng: -115.0358 },
    competitorProximity: { target: 1.3, costco: 2.1, amazon: { freshHub: 2.8, lockerCount: 2 } }
  },
  {
    id: 'store-4356',
    number: 4356,
    name: 'Arroyo Crossing Supercenter',
    address: '7200 Arroyo Crossing Pkwy',
    city: 'Las Vegas',
    state: 'NV',
    zip: '89113',
    format: 'Supercenter',
    sqft: 202000,
    phone: '(702) 361-8500',
    openDate: '2008-04-18',
    tier: 'A+',
    avgDailyTraffic: 16100,
    peakHours: ['09:00-11:00', '16:00-20:00'],
    departments: ['Grocery', 'Electronics', 'Home', 'Apparel', 'Pharmacy', 'Garden', 'Sporting Goods'],
    features: ['Grocery Pickup', 'Grocery Delivery', 'MoneyCenter', 'Vision Center'],
    sections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    coordinates: { lat: 36.0612, lng: -115.3024 },
    competitorProximity: { target: 0.6, costco: 1.2, amazon: { freshHub: 1.8, lockerCount: 5 } }
  },
  {
    id: 'store-4557',
    number: 4557,
    name: 'Tropicana Supercenter',
    address: '3075 E Tropicana Ave',
    city: 'Las Vegas',
    state: 'NV',
    zip: '89121',
    format: 'Supercenter',
    sqft: 175000,
    phone: '(702) 458-8700',
    openDate: '2009-07-22',
    tier: 'B+',
    avgDailyTraffic: 11500,
    peakHours: ['10:00-12:00', '17:00-19:00'],
    departments: ['Grocery', 'Electronics', 'Home', 'Apparel', 'Pharmacy'],
    features: ['Grocery Pickup', 'MoneyCenter'],
    sections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    coordinates: { lat: 36.0989, lng: -115.1012 },
    competitorProximity: { target: 1.8, costco: 3.2, amazon: { freshHub: 3.8, lockerCount: 1 } }
  },
  {
    id: 'store-5070',
    number: 5070,
    name: 'Fort Apache Supercenter',
    address: '5200 S Fort Apache Rd',
    city: 'Las Vegas',
    state: 'NV',
    zip: '89148',
    format: 'Supercenter',
    sqft: 198000,
    phone: '(702) 876-8500',
    openDate: '2012-03-15',
    tier: 'A',
    avgDailyTraffic: 14200,
    peakHours: ['09:00-11:00', '16:00-19:00'],
    departments: ['Grocery', 'Electronics', 'Home', 'Apparel', 'Pharmacy', 'Garden', 'Auto'],
    features: ['Grocery Pickup', 'Grocery Delivery', 'Auto Care Center'],
    sections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    coordinates: { lat: 36.0678, lng: -115.2978 },
    competitorProximity: { target: 0.9, costco: 1.6, amazon: { freshHub: 2.2, lockerCount: 3 } }
  },
  {
    id: 'store-5101',
    number: 5101,
    name: 'Pahrump Supercenter',
    address: '300 S Highway 160',
    city: 'Pahrump',
    state: 'NV',
    zip: '89048',
    format: 'Supercenter',
    sqft: 168000,
    phone: '(775) 727-8500',
    openDate: '2014-08-28',
    tier: 'B+',
    avgDailyTraffic: 9800,
    peakHours: ['10:00-12:00', '16:00-18:00'],
    departments: ['Grocery', 'Electronics', 'Home', 'Apparel', 'Pharmacy', 'Auto'],
    features: ['Grocery Pickup', 'MoneyCenter', 'Tire & Lube'],
    sections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    coordinates: { lat: 36.2089, lng: -115.9834 },
    competitorProximity: { target: 15.0, costco: 60.0, amazon: { freshHub: null, lockerCount: 1 } }
  },
];

export function getStoreById(id: string): Store | undefined {
  return MARKET_396_STORES.find(store => store.id === id);
}

export function getStoreByNumber(number: number): Store | undefined {
  return MARKET_396_STORES.find(store => store.number === number);
}

export function getStoresByFormat(format: Store['format']): Store[] {
  return MARKET_396_STORES.filter(store => store.format === format);
}

export function getStoresByTier(tier: Store['tier']): Store[] {
  return MARKET_396_STORES.filter(store => store.tier === tier);
}

export function getTotalDailyTraffic(): number {
  return MARKET_396_STORES.reduce((sum, store) => sum + store.avgDailyTraffic, 0);
}
