// Phase 4: Visual Merchandising AI Module - Type Definitions
// Walmart Store Operations Orchestrator
// AI-powered planogram optimization and visual merchandising

import { SectionKey, Store } from '@/data/stores';

// Shelf position types
export type ShelfLevel = 'floor' | 'bottom' | 'lower' | 'middle' | 'eye' | 'upper' | 'top';
export type ShelfPosition = 'left' | 'center-left' | 'center' | 'center-right' | 'right';

// Display types
export type DisplayType =
  | 'gondola'
  | 'endcap'
  | 'wing'
  | 'pallet'
  | 'sidekick'
  | 'power_wing'
  | 'shipper'
  | 'checkout'
  | 'feature';

// Heatmap data types
export type HeatmapIntensity = 'cold' | 'cool' | 'warm' | 'hot' | 'intense';
export type TrafficType = 'foot_traffic' | 'attention' | 'dwell_time' | 'conversion';

// Optimization status
export type OptimizationStatus = 'optimal' | 'good' | 'needs_improvement' | 'critical';
export type SeasonalPeriod = 'spring' | 'summer' | 'fall' | 'winter' | 'back_to_school' | 'holiday' | 'super_bowl' | 'valentines' | 'easter' | 'memorial_day' | 'july_4th' | 'labor_day' | 'halloween' | 'thanksgiving' | 'christmas';

// Product placement on shelf
export interface ProductPlacement {
  id: string;
  productId: string;
  productName: string;
  upc: string;
  category: string;
  brand: string;
  shelfLevel: ShelfLevel;
  position: ShelfPosition;
  facings: number;
  depth: number;
  width: number; // in inches
  height: number; // in inches
  pricePoint: number;
  margin: number;
  salesVelocity: number; // units per week
  daysOfSupply: number;
  isPromoted: boolean;
  promotionType?: 'rollback' | 'clearance' | 'featured' | 'bogo' | 'bundle';
  imageUrl?: string;
}

// Shelf section within a planogram
export interface ShelfSection {
  id: string;
  level: ShelfLevel;
  width: number; // total width in inches
  height: number;
  depth: number;
  products: ProductPlacement[];
  utilizationPercent: number;
  revenuePerLinearInch: number;
  averageMargin: number;
}

// Complete planogram
export interface Planogram {
  id: string;
  storeId: string;
  sectionKey: SectionKey;
  aisle: string;
  bayNumber: number;
  displayType: DisplayType;
  name: string;
  description: string;
  width: number; // total bay width in inches
  height: number; // total height in inches
  depth: number;
  sections: ShelfSection[];
  totalProducts: number;
  totalFacings: number;
  revenuePerWeek: number;
  marginPerWeek: number;
  lastOptimized: Date;
  optimizationScore: number; // 0-100
  status: OptimizationStatus;
  version: string;
  effectiveDate: Date;
  expirationDate?: Date;
}

// Traffic heatmap data point
export interface HeatmapPoint {
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
  intensity: number; // 0-1
  type: TrafficType;
}

// Aggregated heatmap data
export interface HeatmapData {
  id: string;
  planogramId: string;
  storeId: string;
  dataPoints: HeatmapPoint[];
  type: TrafficType;
  averageIntensity: number;
  peakAreas: {
    x: number;
    y: number;
    radius: number;
    intensity: HeatmapIntensity;
  }[];
  coldSpots: {
    x: number;
    y: number;
    radius: number;
  }[];
  captureDate: Date;
  sampleSize: number;
  confidence: number;
}

// Traffic pattern analysis
export interface TrafficPattern {
  id: string;
  storeId: string;
  sectionKey: SectionKey;
  aisle: string;
  hourlyTraffic: {
    hour: number; // 0-23
    traffic: number;
    peakType: 'low' | 'normal' | 'high' | 'peak';
  }[];
  weekdayPattern: {
    day: number; // 0-6 (Sunday-Saturday)
    averageTraffic: number;
    peakHour: number;
  }[];
  flowDirection: 'left_to_right' | 'right_to_left' | 'bidirectional';
  avgDwellTime: number; // seconds
  conversionRate: number; // percentage of traffic that makes a purchase
  peakDays: string[];
  slowDays: string[];
  seasonalFactors: {
    period: SeasonalPeriod;
    multiplier: number;
  }[];
}

// AI-generated merchandising recommendation
export interface MerchandisingRecommendation {
  id: string;
  planogramId: string;
  storeId?: string;
  type: 'placement' | 'facing' | 'pricing' | 'promotion' | 'removal' | 'addition';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  rationale: string;
  affectedProducts: string[];
  currentState: {
    position?: string;
    facings?: number;
    price?: number;
  };
  suggestedState: {
    position?: string;
    facings?: number;
    price?: number;
  };
  expectedImpact: {
    revenueChange: number;
    marginChange: number;
    velocityChange: number;
  };
  confidence: number;
  implementationSteps: string[];
  estimatedEffort: 'quick' | 'moderate' | 'significant';
  aiSource: string;
  generatedAt: Date;
  validUntil: Date;
  status: 'pending' | 'approved' | 'implemented' | 'rejected';
}

// Layout suggestion for store section
export interface LayoutSuggestion {
  id: string;
  storeId: string;
  sectionKey: SectionKey;
  title: string;
  description: string;
  currentLayout: {
    aisles: number;
    bays: number;
    flowPattern: string;
    customerPathLength: number;
  };
  suggestedLayout: {
    aisles: number;
    bays: number;
    flowPattern: string;
    customerPathLength: number;
  };
  benefits: string[];
  challenges: string[];
  estimatedCost: number;
  estimatedROI: number;
  implementationTime: string;
  trafficImpact: number; // percentage change
  salesImpact: number; // percentage change
  confidence: number;
  visualizationUrl?: string;
  generatedAt: Date;
}

// Display effectiveness metrics
export interface DisplayEffectiveness {
  id: string;
  planogramId: string;
  storeId: string;
  displayType: DisplayType;
  location: string;
  metrics: {
    impressions: number;
    engagements: number;
    conversions: number;
    revenue: number;
    roi: number;
    engagementRate: number;
    conversionRate: number;
  };
  benchmarks: {
    categoryAverage: number;
    marketAverage: number;
    topPerformer: number;
  };
  performanceRating: 'excellent' | 'good' | 'average' | 'below_average' | 'poor';
  trend: 'improving' | 'stable' | 'declining';
  historicalData: {
    date: Date;
    revenue: number;
    conversions: number;
  }[];
  recommendations: string[];
  lastUpdated: Date;
}

// Endcap opportunity analysis
export interface EndcapOpportunity {
  id: string;
  storeId: string;
  location: string;
  aisle: string;
  side: 'front' | 'back';
  currentStatus: 'available' | 'occupied' | 'reserved';
  currentProduct?: string;
  currentPerformance?: {
    weeklyRevenue: number;
    roi: number;
    daysActive: number;
  };
  trafficScore: number; // 0-100
  visibilityScore: number; // 0-100
  overallScore: number; // 0-100
  suggestedProducts: {
    productId: string;
    productName: string;
    category: string;
    estimatedRevenue: number;
    estimatedROI: number;
    rationale: string;
    seasonalRelevance: number;
  }[];
  optimalTiming: {
    startDate: Date;
    endDate: Date;
    seasonalEvent?: SeasonalPeriod;
  };
  estimatedLift: number; // percentage sales lift
  confidence: number;
}

// Seasonal merchandising adjustment
export interface SeasonalAdjustment {
  id: string;
  storeId?: string;
  sectionKey: SectionKey;
  season: SeasonalPeriod;
  startDate: Date;
  endDate: Date;
  recommendations: {
    type: 'add' | 'remove' | 'increase' | 'decrease' | 'relocate';
    productCategory: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    timing: 'immediate' | 'upcoming' | 'planned';
  }[];
  themeRecommendations: {
    colorPalette: string[];
    signageTheme: string;
    displayStyle: string;
  };
  inventoryAdjustments: {
    category: string;
    currentInventory: number;
    recommendedInventory: number;
    changePercent: number;
  }[];
  estimatedImpact: {
    revenueChange: number;
    trafficChange: number;
    basketSizeChange: number;
  };
  confidence: number;
  aiRationale: string;
  generatedAt: Date;
}

// Cross-category merchandising opportunity
export interface CrossCategoryOpportunity {
  id: string;
  storeId?: string;
  primaryCategory: string;
  secondaryCategory: string;
  correlationStrength: number; // 0-1
  title: string;
  description: string;
  placement: {
    primaryLocation: string;
    suggestedCrossLocation: string;
    displayType: DisplayType;
  };
  affinity: {
    purchaseTogether: number; // percentage of purchases
    basketLift: number; // percentage increase in basket size
    frequencyIncrease: number; // percentage increase in purchase frequency
  };
  implementation: {
    steps: string[];
    effort: 'low' | 'medium' | 'high';
    cost: number;
    timeline: string;
  };
  expectedOutcome: {
    revenueIncrease: number;
    marginIncrease: number;
    customerSatisfaction: number;
  };
  examples: string[];
  confidence: number;
  seasonalRelevance: SeasonalPeriod[];
  generatedAt: Date;
}

// API Request/Response types
export interface PlanogramAnalysisRequest {
  storeId: string;
  sectionKey?: SectionKey;
  planogramId?: string;
  includeHeatmap?: boolean;
  includeRecommendations?: boolean;
}

export interface PlanogramAnalysisResponse {
  success: boolean;
  planograms?: Planogram[];
  heatmaps?: HeatmapData[];
  recommendations?: MerchandisingRecommendation[];
  error?: string;
  timestamp: Date;
}

export interface AIRecommendationRequest {
  storeId: string;
  planogramId?: string;
  sectionKey?: SectionKey;
  type: 'display' | 'endcap' | 'seasonal' | 'cross_category' | 'all';
  store?: Store;
}

export interface AIRecommendationResponse {
  success: boolean;
  displayRecommendations?: MerchandisingRecommendation[];
  endcapOpportunities?: EndcapOpportunity[];
  seasonalAdjustments?: SeasonalAdjustment[];
  crossCategoryOpportunities?: CrossCategoryOpportunity[];
  error?: string;
  generatedAt: Date;
}

// Dashboard state
export interface VisualMerchDashboardState {
  selectedStore: Store | null;
  selectedSection: SectionKey | null;
  selectedPlanogram: Planogram | null;
  planograms: Planogram[];
  heatmapData: HeatmapData | null;
  recommendations: MerchandisingRecommendation[];
  endcapOpportunities: EndcapOpportunity[];
  seasonalAdjustments: SeasonalAdjustment[];
  crossCategoryOpportunities: CrossCategoryOpportunity[];
  isLoading: boolean;
  isGeneratingAI: boolean;
  viewMode: 'planogram' | 'heatmap' | 'recommendations' | 'endcaps' | 'seasonal';
  showBeforeAfter: boolean;
  lastRefresh: Date | null;
}
