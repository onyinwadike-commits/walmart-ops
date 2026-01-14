// Market 396 - Las Vegas Metro Area Store Data
// 9 stores under L5 Onyi's oversight

export type SectionKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M';

export interface Section {
  key: SectionKey;
  name: string;
  description: string;
  departments: string[];
  color: string;
}

export const SECTIONS: Section[] = [
  { key: 'A', name: 'Fresh', description: 'Produce, Deli, Bakery, Meat', departments: ['Produce', 'Deli', 'Bakery', 'Meat'], color: '#22C55E' },
  { key: 'B', name: 'Consumables', description: 'Grocery, HBA, OTC', departments: ['Grocery', 'HBA', 'Pharmacy OTC'], color: '#3B82F6' },
  { key: 'C', name: 'Center Store', description: 'Paper, Chemicals, Pets', departments: ['Paper Goods', 'Chemicals', 'Pet Supplies'], color: '#A855F7' },
  { key: 'D', name: 'GM Hardlines', description: 'Hardware, Auto, Sports', departments: ['Hardware', 'Automotive', 'Sporting Goods'], color: '#F97316' },
  { key: 'E', name: 'GM Softlines', description: 'Apparel, Shoes, Jewelry', departments: ['Apparel', 'Footwear', 'Jewelry'], color: '#EC4899' },
  { key: 'F', name: 'Electronics', description: 'TVs, Phones, Computing', departments: ['TV & Home Theater', 'Wireless', 'Computing'], color: '#06B6D4' },
  { key: 'G', name: 'Home', description: 'Furniture, Decor, Bedding', departments: ['Furniture', 'Home Decor', 'Bedding'], color: '#EAB308' },
  { key: 'H', name: 'Seasonal', description: 'Lawn, Garden, Holiday', departments: ['Lawn & Garden', 'Holiday', 'Outdoor Living'], color: '#84CC16' },
  { key: 'I', name: 'Entertainment', description: 'Toys, Books, Media', departments: ['Toys', 'Books', 'Movies & Music'], color: '#F43F5E' },
  { key: 'J', name: 'Financial Services', description: 'Money Services, Photo', departments: ['Money Services', 'Photo Lab', 'Wireless Activations'], color: '#6366F1' },
  { key: 'K', name: 'eCommerce', description: 'OGP, Ship from Store', departments: ['OGP', 'Ship from Store', 'Returns'], color: '#14B8A6' },
  { key: 'L', name: 'User Feedback', description: 'Feedback & Ratings', departments: ['User Feedback', 'Ratings', 'Surveys'], color: '#8B5CF6' },
  { key: 'M', name: 'Visual Merch AI', description: 'AI Camera Analysis', departments: ['Visual Merch', 'Planogram', 'Display Analysis'], color: '#EC4899' },
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
    id: 'store-2059',
    number: 2059,
    name: 'Charleston Supercenter',
    address: '4505 W Charleston Blvd',
    city: 'Las Vegas',
    state: 'NV',
    zip: '89102',
    format: 'Supercenter',
    sqft: 182000,
    phone: '(702) 878-0399',
    openDate: '1998-03-15',
    tier: 'A',
    avgDailyTraffic: 12500,
    peakHours: ['10:00-12:00', '17:00-19:00'],
    departments: ['Grocery', 'Electronics', 'Home', 'Apparel', 'Pharmacy', 'Vision', 'Auto'],
    features: ['Grocery Pickup', 'MoneyCenter', 'Tire & Lube'],
    sections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
    coordinates: { lat: 36.1579, lng: -115.1888 },
    competitorProximity: { target: 1.2, costco: 2.5, amazon: { freshHub: 3.1, lockerCount: 2 } }
  },
  {
    id: 'store-3455',
    number: 3455,
    name: 'Craig Road Supercenter',
    address: '6464 N Decatur Blvd',
    city: 'Las Vegas',
    state: 'NV',
    zip: '89131',
    format: 'Supercenter',
    sqft: 198000,
    phone: '(702) 515-8700',
    openDate: '2005-07-22',
    tier: 'A+',
    avgDailyTraffic: 14200,
    peakHours: ['09:00-11:00', '16:00-19:00'],
    departments: ['Grocery', 'Electronics', 'Home', 'Apparel', 'Pharmacy', 'Garden', 'Sporting Goods'],
    features: ['Grocery Pickup', 'Grocery Delivery', 'Auto Care Center'],
    sections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
    coordinates: { lat: 36.2689, lng: -115.2073 },
    competitorProximity: { target: 0.8, costco: 1.9, amazon: { freshHub: 2.8, lockerCount: 3 } }
  },
  {
    id: 'store-5765',
    number: 5765,
    name: 'Tropicana Supercenter',
    address: '4350 N Nellis Blvd',
    city: 'Las Vegas',
    state: 'NV',
    zip: '89115',
    format: 'Supercenter',
    sqft: 175000,
    phone: '(702) 459-2091',
    openDate: '2001-11-08',
    tier: 'B+',
    avgDailyTraffic: 9800,
    peakHours: ['11:00-13:00', '18:00-20:00'],
    departments: ['Grocery', 'Electronics', 'Home', 'Apparel', 'Pharmacy'],
    features: ['Grocery Pickup', 'MoneyCenter'],
    sections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
    coordinates: { lat: 36.2105, lng: -115.0627 },
    competitorProximity: { target: 2.1, costco: 4.5, amazon: { freshHub: null, lockerCount: 1 } }
  },
  {
    id: 'store-4260',
    number: 4260,
    name: 'Blue Diamond Supercenter',
    address: '7200 Arroyo Crossing Pkwy',
    city: 'Las Vegas',
    state: 'NV',
    zip: '89113',
    format: 'Supercenter',
    sqft: 205000,
    phone: '(702) 365-9600',
    openDate: '2008-09-12',
    tier: 'A+',
    avgDailyTraffic: 15500,
    peakHours: ['10:00-12:00', '16:00-19:00'],
    departments: ['Grocery', 'Electronics', 'Home', 'Apparel', 'Pharmacy', 'Vision', 'Garden', 'Sporting Goods'],
    features: ['Grocery Pickup', 'Grocery Delivery', 'Auto Care Center', 'Pharmacy Drive-Thru'],
    sections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
    coordinates: { lat: 36.0642, lng: -115.2442 },
    competitorProximity: { target: 1.5, costco: 2.2, amazon: { freshHub: 1.8, lockerCount: 4 } }
  },
  {
    id: 'store-1807',
    number: 1807,
    name: 'Henderson Supercenter',
    address: '540 Marks St',
    city: 'Henderson',
    state: 'NV',
    zip: '89014',
    format: 'Supercenter',
    sqft: 168000,
    phone: '(702) 547-2653',
    openDate: '1996-05-20',
    tier: 'B',
    avgDailyTraffic: 8200,
    peakHours: ['09:00-11:00', '17:00-19:00'],
    departments: ['Grocery', 'Electronics', 'Home', 'Apparel', 'Pharmacy'],
    features: ['Grocery Pickup', 'MoneyCenter'],
    sections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
    coordinates: { lat: 36.0397, lng: -114.9714 },
    competitorProximity: { target: 1.8, costco: 3.2, amazon: { freshHub: null, lockerCount: 1 } }
  },
  {
    id: 'store-4338',
    number: 4338,
    name: 'Centennial Hills Supercenter',
    address: '6310 N Simmons St',
    city: 'North Las Vegas',
    state: 'NV',
    zip: '89031',
    format: 'Supercenter',
    sqft: 210000,
    phone: '(702) 633-4900',
    openDate: '2010-03-28',
    tier: 'A+',
    avgDailyTraffic: 16800,
    peakHours: ['09:00-12:00', '15:00-19:00'],
    departments: ['Grocery', 'Electronics', 'Home', 'Apparel', 'Pharmacy', 'Vision', 'Garden', 'Sporting Goods', 'Wireless'],
    features: ['Grocery Pickup', 'Grocery Delivery', 'Auto Care Center', 'Pharmacy Drive-Thru', 'FedEx'],
    sections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
    coordinates: { lat: 36.2856, lng: -115.2457 },
    competitorProximity: { target: 0.6, costco: 1.5, amazon: { freshHub: 2.1, lockerCount: 5 } }
  },
  {
    id: 'store-3807',
    number: 3807,
    name: 'Flamingo Neighborhood Market',
    address: '6005 W Flamingo Rd',
    city: 'Las Vegas',
    state: 'NV',
    zip: '89103',
    format: 'Neighborhood Market',
    sqft: 42000,
    phone: '(702) 889-8800',
    openDate: '2015-08-14',
    tier: 'B+',
    avgDailyTraffic: 3200,
    peakHours: ['07:00-09:00', '17:00-19:00'],
    departments: ['Grocery', 'Pharmacy', 'Deli'],
    features: ['Grocery Pickup', 'Pharmacy Drive-Thru'],
    sections: ['A', 'B', 'C'],
    coordinates: { lat: 36.1152, lng: -115.2148 },
    competitorProximity: { target: 2.8, costco: 3.5, amazon: { freshHub: 1.2, lockerCount: 1 } }
  },
  {
    id: 'store-5005',
    number: 5005,
    name: 'Sahara Neighborhood Market',
    address: '4555 E Sahara Ave',
    city: 'Las Vegas',
    state: 'NV',
    zip: '89104',
    format: 'Neighborhood Market',
    sqft: 38000,
    phone: '(702) 431-2010',
    openDate: '2016-11-02',
    tier: 'C+',
    avgDailyTraffic: 2100,
    peakHours: ['08:00-10:00', '18:00-20:00'],
    departments: ['Grocery', 'Pharmacy'],
    features: ['Grocery Pickup'],
    sections: ['A', 'B'],
    coordinates: { lat: 36.1446, lng: -115.0948 },
    competitorProximity: { target: 3.5, costco: 5.2, amazon: { freshHub: null, lockerCount: 0 } }
  },
  {
    id: 'store-5107',
    number: 5107,
    name: 'Rainbow Neighborhood Market',
    address: '2310 S Rainbow Blvd',
    city: 'Las Vegas',
    state: 'NV',
    zip: '89146',
    format: 'Neighborhood Market',
    sqft: 45000,
    phone: '(702) 259-3600',
    openDate: '2014-02-08',
    tier: 'B',
    avgDailyTraffic: 2800,
    peakHours: ['07:00-09:00', '16:00-18:00'],
    departments: ['Grocery', 'Pharmacy', 'Deli', 'Bakery'],
    features: ['Grocery Pickup', 'Pharmacy Drive-Thru'],
    sections: ['A', 'B', 'C'],
    coordinates: { lat: 36.1425, lng: -115.2427 },
    competitorProximity: { target: 2.2, costco: 2.8, amazon: { freshHub: 2.5, lockerCount: 1 } }
  }
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
