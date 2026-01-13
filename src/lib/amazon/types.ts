// Phase 3: Amazon Warfare Module - Type Definitions
// Walmart Store Operations Orchestrator
// Competitive intelligence and market strategy types

import { Store, SectionKey } from '@/data/stores';

// Product Categories for comparison
export type ProductCategory =
  | 'electronics'
  | 'grocery'
  | 'home'
  | 'apparel'
  | 'toys'
  | 'health'
  | 'automotive'
  | 'sports'
  | 'garden'
  | 'office';

// Price comparison status
export type PriceStatus =
  | 'winning'      // Walmart price is lower
  | 'losing'       // Amazon price is lower
  | 'competitive'  // Within 5% of each other
  | 'unknown';     // No comparison available

// Alert severity levels
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';

// Strategy type categories
export type StrategyType =
  | 'price_match'
  | 'bundle_offer'
  | 'loyalty_exclusive'
  | 'same_day_delivery'
  | 'in_store_pickup'
  | 'price_lock'
  | 'member_discount';

// Amazon Product representation
export interface AmazonProduct {
  asin: string;
  title: string;
  category: ProductCategory;
  price: number;
  primePrice?: number;
  rating: number;
  reviewCount: number;
  isPrime: boolean;
  deliveryDays: number;
  seller: string;
  imageUrl?: string;
  lastUpdated: Date;
}

// Walmart Product representation
export interface WalmartProduct {
  upc: string;
  sku: string;
  title: string;
  category: ProductCategory;
  price: number;
  rollbackPrice?: number;
  walmartPlusPrice?: number;
  rating: number;
  reviewCount: number;
  inStockOnline: boolean;
  inStockStores: string[];
  deliveryDays: number;
  pickupAvailable: boolean;
  imageUrl?: string;
  lastUpdated: Date;
  section?: SectionKey;
}

// Product match between Walmart and Amazon
export interface ProductMatch {
  id: string;
  walmartProduct: WalmartProduct;
  amazonProduct: AmazonProduct;
  matchConfidence: number; // 0-1 confidence that these are the same product
  matchedOn: ('upc' | 'title' | 'model' | 'brand')[];
}

// Price comparison between matched products
export interface PriceComparison {
  id: string;
  match: ProductMatch;
  walmartPrice: number;
  amazonPrice: number;
  priceDifference: number;
  priceDifferencePercent: number;
  status: PriceStatus;
  walmartAdvantages: string[];
  amazonAdvantages: string[];
  recommendation: string;
  potentialRevenueImpact: number;
  lastCompared: Date;
}

// Aggregated competitor data
export interface CompetitorData {
  totalProductsTracked: number;
  winningCount: number;
  losingCount: number;
  competitiveCount: number;
  averagePriceDifference: number;
  categoryBreakdown: Record<ProductCategory, {
    total: number;
    winning: number;
    losing: number;
    avgDifference: number;
  }>;
  trendData: {
    date: Date;
    winRate: number;
    avgDifference: number;
  }[];
  lastUpdated: Date;
}

// Price change alert
export interface PriceAlert {
  id: string;
  productMatch: ProductMatch;
  alertType: 'amazon_price_drop' | 'amazon_price_increase' | 'walmart_opportunity' | 'competitive_threat';
  severity: AlertSeverity;
  title: string;
  description: string;
  previousPrice: number;
  currentPrice: number;
  changePercent: number;
  suggestedAction: string;
  potentialImpact: number;
  createdAt: Date;
  expiresAt?: Date;
  acknowledged: boolean;
  storeIds?: string[];
}

// Competitive insight from analysis
export interface CompetitiveInsight {
  id: string;
  category: ProductCategory;
  insightType: 'opportunity' | 'threat' | 'trend' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  dataPoints: string[];
  actionable: boolean;
  suggestedActions: string[];
  estimatedImpact: {
    revenue?: number;
    marketShare?: number;
    customerSatisfaction?: number;
  };
  validUntil: Date;
  source: 'ai_analysis' | 'price_data' | 'market_research' | 'customer_feedback';
}

// Competitive strategy recommendation
export interface WarfareStrategy {
  id: string;
  name: string;
  type: StrategyType;
  description: string;
  targetCategory?: ProductCategory;
  targetProducts?: string[];
  targetStores?: string[];
  expectedOutcome: string;
  implementationSteps: string[];
  estimatedCost: number;
  estimatedRevenue: number;
  roi: number;
  timeToImplement: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  risks: string[];
  aiGenerated: boolean;
  generatedAt: Date;
  validUntil: Date;
  status: 'proposed' | 'approved' | 'implementing' | 'active' | 'completed' | 'rejected';
}

// Market opportunity
export interface MarketOpportunity {
  id: string;
  title: string;
  category: ProductCategory;
  opportunityType: 'underserved_segment' | 'price_gap' | 'service_gap' | 'product_gap' | 'seasonal';
  description: string;
  marketSize: number;
  currentWalmartShare: number;
  amazonShare: number;
  potentialGain: number;
  difficultyScore: number; // 1-10, 10 being hardest
  timeToCapture: string;
  requiredInvestment: number;
  keyActions: string[];
  competitorWeaknesses: string[];
  walmartStrengths: string[];
  confidence: number;
  dataSource: string[];
  discoveredAt: Date;
  expiresAt: Date;
  relevantStores: string[];
}

// Warfare mode settings
export interface WarfareModeSettings {
  enabled: boolean;
  aggressiveness: 'conservative' | 'moderate' | 'aggressive';
  autoAlerts: boolean;
  alertThreshold: number; // Minimum price difference % to trigger alerts
  focusCategories: ProductCategory[];
  excludedCategories: ProductCategory[];
  priceMatchEnabled: boolean;
  maxPriceMatchDiscount: number; // Maximum % discount for price matching
  monitoredStores: string[];
  refreshInterval: number; // minutes
  lastEnabled?: Date;
}

// Competitive score metrics
export interface CompetitiveScore {
  overall: number; // 0-100
  priceCompetitiveness: number;
  serviceAdvantage: number;
  stockAvailability: number;
  deliverySpeed: number;
  customerExperience: number;
  trendDirection: 'improving' | 'stable' | 'declining';
  changeFromLastWeek: number;
  changeFromLastMonth: number;
  benchmarks: {
    marketAverage: number;
    topPerformer: number;
    bottomPerformer: number;
  };
  breakdown: {
    category: ProductCategory;
    score: number;
    trend: 'up' | 'down' | 'stable';
  }[];
}

// API Request/Response types
export interface CompetitiveDataRequest {
  storeId?: string;
  categories?: ProductCategory[];
  includeAlerts?: boolean;
  includeStrategies?: boolean;
  limit?: number;
}

export interface CompetitiveDataResponse {
  success: boolean;
  data?: {
    comparisons: PriceComparison[];
    alerts: PriceAlert[];
    insights: CompetitiveInsight[];
    competitiveScore: CompetitiveScore;
    competitorData: CompetitorData;
  };
  error?: string;
  timestamp: Date;
}

export interface StrategyGenerationRequest {
  storeId?: string;
  store?: Store;
  focusAreas?: ProductCategory[];
  budgetConstraint?: number;
  timeHorizon?: 'immediate' | 'short-term' | 'long-term';
}

export interface StrategyGenerationResponse {
  success: boolean;
  strategies?: WarfareStrategy[];
  opportunities?: MarketOpportunity[];
  insights?: CompetitiveInsight[];
  error?: string;
  generatedAt: Date;
}

// Dashboard state
export interface WarfareDashboardState {
  settings: WarfareModeSettings;
  competitorData: CompetitorData | null;
  competitiveScore: CompetitiveScore | null;
  activeAlerts: PriceAlert[];
  recentStrategies: WarfareStrategy[];
  topOpportunities: MarketOpportunity[];
  isLoading: boolean;
  lastRefresh: Date | null;
  selectedStore: Store | null;
  selectedCategory: ProductCategory | null;
  viewMode: 'overview' | 'alerts' | 'strategies' | 'opportunities';
}
