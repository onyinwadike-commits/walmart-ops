// Market 396 - Las Vegas Metro Area Store Data
// 9 stores under L5 Onyi's oversight

export type SectionKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K';

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
  format: 'Supercenter' | 'Neighborhood Market' | 'Division 1';
  sqft: number;
  associates: number;
  openDate: string;
  marketManager: string;
  storeManager: string;
  sections: SectionKey[];
  coordinates: { lat: number; lng: number };
  metrics: {
    salesYTD: number;
    compPercent: number;
    inventoryAccuracy: number;
    customerSatisfaction: number;
    associateEngagement: number;
  };
}

export const MARKET_396_STORES: Store[] = [
  {
    id: '1560',
    number: 1560,
    name: 'Las Vegas Supercenter',
    address: '3615 S Rainbow Blvd',
    city: 'Las Vegas',
    state: 'NV',
    zip: '89103',
    format: 'Supercenter',
    sqft: 182000,
    associates: 285,
    openDate: '1998-03-15',
    marketManager: 'Regional Director',
    storeManager: 'TBD',
    sections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
    coordinates: { lat: 36.1215, lng: -115.2427 },
    metrics: { salesYTD: 89200000, compPercent: 4.2, inventoryAccuracy: 97.8, customerSatisfaction: 4.3, associateEngagement: 78 }
  },
  {
    id: '1584',
    number: 1584,
    name: 'Henderson Supercenter',
    address: '540 Marks St',
    city: 'Henderson',
    state: 'NV',
    zip: '89014',
    format: 'Supercenter',
    sqft: 197000,
    associates: 312,
    openDate: '1999-07-22',
    marketManager: 'Regional Director',
    storeManager: 'TBD',
    sections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
    coordinates: { lat: 36.0397, lng: -115.0377 },
    metrics: { salesYTD: 94500000, compPercent: 3.8, inventoryAccuracy: 98.1, customerSatisfaction: 4.4, associateEngagement: 81 }
  },
  {
    id: '2050',
    number: 2050,
    name: 'North Las Vegas Supercenter',
    address: '1807 W Craig Rd',
    city: 'North Las Vegas',
    state: 'NV',
    zip: '89032',
    format: 'Supercenter',
    sqft: 175000,
    associates: 268,
    openDate: '2001-11-08',
    marketManager: 'Regional Director',
    storeManager: 'TBD',
    sections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
    coordinates: { lat: 36.2363, lng: -115.1485 },
    metrics: { salesYTD: 78300000, compPercent: 5.1, inventoryAccuracy: 96.9, customerSatisfaction: 4.1, associateEngagement: 75 }
  },
  {
    id: '2593',
    number: 2593,
    name: 'Summerlin Supercenter',
    address: '7200 Arroyo Crossing Pkwy',
    city: 'Las Vegas',
    state: 'NV',
    zip: '89113',
    format: 'Supercenter',
    sqft: 205000,
    associates: 342,
    openDate: '2004-06-18',
    marketManager: 'Regional Director',
    storeManager: 'TBD',
    sections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
    coordinates: { lat: 36.0825, lng: -115.3049 },
    metrics: { salesYTD: 102400000, compPercent: 6.2, inventoryAccuracy: 98.5, customerSatisfaction: 4.6, associateEngagement: 84 }
  },
  {
    id: '2838',
    number: 2838,
    name: 'Spring Valley Supercenter',
    address: '4505 W Charleston Blvd',
    city: 'Las Vegas',
    state: 'NV',
    zip: '89102',
    format: 'Supercenter',
    sqft: 168000,
    associates: 255,
    openDate: '2005-09-12',
    marketManager: 'Regional Director',
    storeManager: 'TBD',
    sections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
    coordinates: { lat: 36.1592, lng: -115.2117 },
    metrics: { salesYTD: 71200000, compPercent: 2.9, inventoryAccuracy: 97.2, customerSatisfaction: 4.2, associateEngagement: 76 }
  },
  {
    id: '4356',
    number: 4356,
    name: 'Centennial Hills Supercenter',
    address: '6464 N Decatur Blvd',
    city: 'Las Vegas',
    state: 'NV',
    zip: '89131',
    format: 'Supercenter',
    sqft: 188000,
    associates: 298,
    openDate: '2007-04-20',
    marketManager: 'Regional Director',
    storeManager: 'TBD',
    sections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
    coordinates: { lat: 36.2716, lng: -115.2117 },
    metrics: { salesYTD: 86700000, compPercent: 4.8, inventoryAccuracy: 97.9, customerSatisfaction: 4.4, associateEngagement: 79 }
  },
  {
    id: '4557',
    number: 4557,
    name: 'Southwest Las Vegas Supercenter',
    address: '8060 W Tropical Pkwy',
    city: 'Las Vegas',
    state: 'NV',
    zip: '89149',
    format: 'Supercenter',
    sqft: 192000,
    associates: 305,
    openDate: '2008-08-15',
    marketManager: 'Regional Director',
    storeManager: 'TBD',
    sections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
    coordinates: { lat: 36.2827, lng: -115.2836 },
    metrics: { salesYTD: 91800000, compPercent: 5.5, inventoryAccuracy: 98.0, customerSatisfaction: 4.5, associateEngagement: 82 }
  },
  {
    id: '5070',
    number: 5070,
    name: 'Boulder Highway Supercenter',
    address: '4350 N Nellis Blvd',
    city: 'Las Vegas',
    state: 'NV',
    zip: '89115',
    format: 'Supercenter',
    sqft: 171000,
    associates: 262,
    openDate: '2010-02-28',
    marketManager: 'Regional Director',
    storeManager: 'TBD',
    sections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
    coordinates: { lat: 36.2152, lng: -115.0621 },
    metrics: { salesYTD: 74500000, compPercent: 3.2, inventoryAccuracy: 96.5, customerSatisfaction: 4.0, associateEngagement: 73 }
  },
  {
    id: '5101',
    number: 5101,
    name: 'Green Valley Supercenter',
    address: '300 N Stephanie St',
    city: 'Henderson',
    state: 'NV',
    zip: '89014',
    format: 'Supercenter',
    sqft: 199000,
    associates: 318,
    openDate: '2011-05-06',
    marketManager: 'Regional Director',
    storeManager: 'TBD',
    sections: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
    coordinates: { lat: 36.0545, lng: -115.0427 },
    metrics: { salesYTD: 97200000, compPercent: 4.5, inventoryAccuracy: 98.3, customerSatisfaction: 4.5, associateEngagement: 83 }
  },
];

export function getStoreById(id: string): Store | undefined {
  return MARKET_396_STORES.find(store => store.id === id);
}

export function getStoresByFormat(format: Store['format']): Store[] {
  return MARKET_396_STORES.filter(store => store.format === format);
}

export function getTotalAssociates(): number {
  return MARKET_396_STORES.reduce((sum, store) => sum + store.associates, 0);
}

export function getTotalSalesYTD(): number {
  return MARKET_396_STORES.reduce((sum, store) => sum + store.metrics.salesYTD, 0);
}

export function getAverageCompPercent(): number {
  const total = MARKET_396_STORES.reduce((sum, store) => sum + store.metrics.compPercent, 0);
  return total / MARKET_396_STORES.length;
}
