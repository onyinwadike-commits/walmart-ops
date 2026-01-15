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

// Store 2593 - Serene Ave Supercenter (Primary store for this dashboard)
export const STORE_2593: Store = {
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
};

// Keep array for backwards compatibility but only contains store 2593
export const MARKET_396_STORES: Store[] = [STORE_2593];

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
