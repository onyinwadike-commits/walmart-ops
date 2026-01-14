// Phase 4: Visual Merchandising AI Module - Main AI Service
// Walmart Store Operations Orchestrator
// Coordinates visual merchandising analysis and AI-powered recommendations

import { SectionKey, SECTIONS, Store } from '@/data/stores';
import {
  Planogram,
  HeatmapData,
  MerchandisingRecommendation,
  EndcapOpportunity,
  SeasonalAdjustment,
  CrossCategoryOpportunity,
  DisplayEffectiveness,
  TrafficPattern,
  OptimizationStatus,
  SeasonalPeriod,
  AIRecommendationRequest,
  AIRecommendationResponse,
  PlanogramAnalysisRequest,
  PlanogramAnalysisResponse,
} from './types';
import { getPlanogramAnalyzer } from './planogram-analyzer';

// Compliance status for a store section
export interface ComplianceStatus {
  sectionKey: SectionKey;
  sectionName: string;
  overallScore: number;
  status: OptimizationStatus;
  planogramsTotal: number;
  planogramsCompliant: number;
  planogramsNeedingAttention: number;
  planogramsCritical: number;
  lastAuditDate: Date;
  nextScheduledAudit: Date;
  issues: {
    type: 'out_of_stock' | 'misplaced' | 'wrong_facing' | 'price_tag' | 'signage';
    count: number;
    priority: 'high' | 'medium' | 'low';
  }[];
  trends: {
    scoreChange: number;
    direction: 'improving' | 'stable' | 'declining';
    weekOverWeek: number;
  };
}

// Store-level compliance summary
export interface StoreComplianceSummary {
  storeId: string;
  storeName: string;
  overallScore: number;
  status: OptimizationStatus;
  sections: ComplianceStatus[];
  totalPlanograms: number;
  compliantPlanograms: number;
  outOfStockItems: number;
  misplacedItems: number;
  revenueAtRisk: number;
  recommendationsCount: number;
  lastFullAudit: Date;
}

// AI Analysis Result
export interface AIAnalysisResult {
  success: boolean;
  storeId: string;
  timestamp: Date;
  compliance: StoreComplianceSummary;
  planograms: Planogram[];
  recommendations: MerchandisingRecommendation[];
  endcapOpportunities: EndcapOpportunity[];
  seasonalAdjustments: SeasonalAdjustment[];
  crossCategoryOpportunities: CrossCategoryOpportunity[];
  heatmapData?: HeatmapData;
  aiInsights: string[];
  priorityActions: {
    action: string;
    impact: 'high' | 'medium' | 'low';
    effort: 'quick' | 'moderate' | 'significant';
    estimatedRevenue: number;
  }[];
}

// Generate mock compliance data for a section
function generateSectionCompliance(storeId: string, sectionKey: SectionKey): ComplianceStatus {
  const section = SECTIONS.find(s => s.key === sectionKey)!;
  const planogramsTotal = 4 + Math.floor(Math.random() * 5);
  const planogramsCompliant = Math.floor(planogramsTotal * (0.6 + Math.random() * 0.35));
  const planogramsCritical = Math.floor(Math.random() * 2);
  const planogramsNeedingAttention = planogramsTotal - planogramsCompliant - planogramsCritical;

  const overallScore = 60 + Math.random() * 35;
  let status: OptimizationStatus = 'optimal';
  if (overallScore < 70) status = 'critical';
  else if (overallScore < 80) status = 'needs_improvement';
  else if (overallScore < 90) status = 'good';

  const scoreChange = -5 + Math.random() * 12;

  return {
    sectionKey,
    sectionName: section.name,
    overallScore,
    status,
    planogramsTotal,
    planogramsCompliant,
    planogramsNeedingAttention: Math.max(0, planogramsNeedingAttention),
    planogramsCritical,
    lastAuditDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    nextScheduledAudit: new Date(Date.now() + (7 + Math.random() * 7) * 24 * 60 * 60 * 1000),
    issues: ([
      { type: 'out_of_stock' as const, count: Math.floor(Math.random() * 8), priority: 'high' as const },
      { type: 'misplaced' as const, count: Math.floor(Math.random() * 12), priority: 'medium' as const },
      { type: 'wrong_facing' as const, count: Math.floor(Math.random() * 6), priority: 'low' as const },
      { type: 'price_tag' as const, count: Math.floor(Math.random() * 5), priority: 'medium' as const },
      { type: 'signage' as const, count: Math.floor(Math.random() * 3), priority: 'low' as const },
    ] as ComplianceStatus['issues']).filter(issue => issue.count > 0),
    trends: {
      scoreChange,
      direction: scoreChange > 2 ? 'improving' : scoreChange < -2 ? 'declining' : 'stable',
      weekOverWeek: scoreChange,
    },
  };
}

// Generate mock endcap opportunities
function generateEndcapOpportunities(storeId: string, sectionKey?: SectionKey): EndcapOpportunity[] {
  const opportunities: EndcapOpportunity[] = [];
  const sections = sectionKey ? [sectionKey] : (['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'] as SectionKey[]);

  const productSuggestions = [
    { name: 'Seasonal Snack Display', category: 'Snacks', revenue: 2500 },
    { name: 'Energy Drink Promotion', category: 'Beverages', revenue: 3200 },
    { name: 'Back-to-School Essentials', category: 'School Supplies', revenue: 4100 },
    { name: 'Summer Grilling Bundle', category: 'Outdoor', revenue: 5500 },
    { name: 'Health & Wellness Stack', category: 'HBA', revenue: 2800 },
    { name: 'Gaming Accessories Feature', category: 'Electronics', revenue: 6200 },
    { name: 'Pet Care Essentials', category: 'Pet Supplies', revenue: 3400 },
    { name: 'Home Organization Sale', category: 'Home', revenue: 2900 },
  ];

  sections.forEach((section, idx) => {
    if (Math.random() > 0.4) {
      const suggestion = productSuggestions[idx % productSuggestions.length];
      opportunities.push({
        id: `ENDCAP-${storeId}-${section}-${idx}`,
        storeId,
        location: `Aisle ${section}1 - End`,
        aisle: `${section}1`,
        side: Math.random() > 0.5 ? 'front' : 'back',
        currentStatus: Math.random() > 0.7 ? 'available' : 'occupied',
        trafficScore: 60 + Math.random() * 35,
        visibilityScore: 55 + Math.random() * 40,
        overallScore: 58 + Math.random() * 38,
        suggestedProducts: [
          {
            productId: `PRD-${1000 + idx}`,
            productName: suggestion.name,
            category: suggestion.category,
            estimatedRevenue: suggestion.revenue + Math.random() * 1000,
            estimatedROI: 150 + Math.random() * 100,
            rationale: `High traffic location with ${suggestion.category} affinity shoppers`,
            seasonalRelevance: 70 + Math.random() * 25,
          },
        ],
        optimalTiming: {
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          seasonalEvent: ['back_to_school', 'summer', 'holiday'][Math.floor(Math.random() * 3)] as SeasonalPeriod,
        },
        estimatedLift: 15 + Math.random() * 25,
        confidence: 0.75 + Math.random() * 0.2,
      });
    }
  });

  return opportunities;
}

// Generate mock seasonal adjustments
function generateSeasonalAdjustments(storeId?: string, sectionKey?: SectionKey): SeasonalAdjustment[] {
  const currentMonth = new Date().getMonth();
  let currentSeason: SeasonalPeriod = 'summer';

  if (currentMonth >= 0 && currentMonth <= 1) currentSeason = 'winter';
  else if (currentMonth >= 2 && currentMonth <= 4) currentSeason = 'spring';
  else if (currentMonth >= 5 && currentMonth <= 7) currentSeason = 'summer';
  else if (currentMonth >= 8 && currentMonth <= 10) currentSeason = 'fall';
  else currentSeason = 'holiday';

  const sections = sectionKey ? [sectionKey] : (['A', 'B', 'C', 'H'] as SectionKey[]);

  return sections.map((section) => ({
    id: `SEASONAL-${storeId || 'ALL'}-${section}-${currentSeason}`,
    storeId,
    sectionKey: section,
    season: currentSeason,
    startDate: new Date(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    recommendations: [
      {
        type: 'increase' as const,
        productCategory: 'Seasonal Items',
        description: `Increase seasonal merchandise facings by 25%`,
        priority: 'high' as const,
        timing: 'immediate' as const,
      },
      {
        type: 'relocate' as const,
        productCategory: 'Promotional Items',
        description: `Move promotional items to high-traffic endcaps`,
        priority: 'medium' as const,
        timing: 'upcoming' as const,
      },
      {
        type: 'decrease' as const,
        productCategory: 'Off-Season Items',
        description: `Reduce off-season inventory to clearance sections`,
        priority: 'low' as const,
        timing: 'planned' as const,
      },
    ],
    themeRecommendations: {
      colorPalette: currentSeason === 'holiday'
        ? ['#C41E3A', '#228B22', '#FFD700']
        : currentSeason === 'summer'
        ? ['#FF6B6B', '#4ECDC4', '#FFE66D']
        : ['#FF8C00', '#8B4513', '#DAA520'],
      signageTheme: `${currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)} Collection`,
      displayStyle: 'feature_forward',
    },
    inventoryAdjustments: [
      {
        category: 'Seasonal Products',
        currentInventory: 100,
        recommendedInventory: 150,
        changePercent: 50,
      },
      {
        category: 'Clearance Items',
        currentInventory: 80,
        recommendedInventory: 40,
        changePercent: -50,
      },
    ],
    estimatedImpact: {
      revenueChange: 8000 + Math.random() * 12000,
      trafficChange: 5 + Math.random() * 10,
      basketSizeChange: 3 + Math.random() * 7,
    },
    confidence: 0.8 + Math.random() * 0.15,
    aiRationale: `Based on historical ${currentSeason} performance data and current traffic patterns, these adjustments are projected to maximize seasonal revenue opportunity.`,
    generatedAt: new Date(),
  }));
}

// Generate mock cross-category opportunities
function generateCrossCategoryOpportunities(storeId?: string): CrossCategoryOpportunity[] {
  const opportunities: {
    primary: string;
    secondary: string;
    title: string;
    correlation: number;
  }[] = [
    { primary: 'Chips', secondary: 'Soft Drinks', title: 'Snack & Beverage Bundle', correlation: 0.85 },
    { primary: 'Pasta', secondary: 'Pasta Sauce', title: 'Italian Meal Solution', correlation: 0.92 },
    { primary: 'Dog Food', secondary: 'Dog Treats', title: 'Pet Care Complete', correlation: 0.78 },
    { primary: 'Laundry Detergent', secondary: 'Fabric Softener', title: 'Laundry Care Bundle', correlation: 0.82 },
    { primary: 'Coffee', secondary: 'Creamer', title: 'Coffee Station Setup', correlation: 0.88 },
    { primary: 'Cereal', secondary: 'Milk', title: 'Breakfast Bundle', correlation: 0.75 },
    { primary: 'Hamburger Meat', secondary: 'Hamburger Buns', title: 'Grilling Essentials', correlation: 0.80 },
    { primary: 'Baby Food', secondary: 'Diapers', title: 'Baby Care Center', correlation: 0.72 },
  ];

  return opportunities.slice(0, 4 + Math.floor(Math.random() * 4)).map((opp, idx) => ({
    id: `CROSS-${storeId || 'ALL'}-${idx}`,
    storeId,
    primaryCategory: opp.primary,
    secondaryCategory: opp.secondary,
    correlationStrength: opp.correlation,
    title: opp.title,
    description: `Customers who purchase ${opp.primary} frequently also buy ${opp.secondary}. Creating a cross-merchandising display can increase basket size.`,
    placement: {
      primaryLocation: `${opp.primary} Section`,
      suggestedCrossLocation: `Adjacent to ${opp.primary} Display`,
      displayType: 'sidekick' as const,
    },
    affinity: {
      purchaseTogether: 35 + Math.random() * 30,
      basketLift: 12 + Math.random() * 18,
      frequencyIncrease: 5 + Math.random() * 10,
    },
    implementation: {
      steps: [
        `Identify optimal ${opp.primary} location for cross-display`,
        `Install sidekick display for ${opp.secondary}`,
        `Create bundled pricing signage`,
        `Monitor sales lift for 4 weeks`,
      ],
      effort: 'low' as const,
      cost: 50 + Math.random() * 100,
      timeline: '1-2 weeks',
    },
    expectedOutcome: {
      revenueIncrease: 500 + Math.random() * 1500,
      marginIncrease: 150 + Math.random() * 450,
      customerSatisfaction: 5 + Math.random() * 10,
    },
    examples: [
      `"${opp.primary} + ${opp.secondary}" promotional signage`,
      'Bundled pricing visible on both products',
    ],
    confidence: 0.7 + Math.random() * 0.25,
    seasonalRelevance: ['summer', 'fall', 'holiday'] as SeasonalPeriod[],
    generatedAt: new Date(),
  }));
}

// Visual Merchandising AI Service
class VisualMerchandisingAIService {
  private static instance: VisualMerchandisingAIService | null = null;
  private planogramAnalyzer = getPlanogramAnalyzer();

  private constructor() {}

  public static getInstance(): VisualMerchandisingAIService {
    if (!VisualMerchandisingAIService.instance) {
      VisualMerchandisingAIService.instance = new VisualMerchandisingAIService();
    }
    return VisualMerchandisingAIService.instance;
  }

  /**
   * Get comprehensive store compliance summary
   */
  getStoreCompliance(storeId: string, store?: Store): StoreComplianceSummary {
    const sections: ComplianceStatus[] = (['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'] as SectionKey[])
      .map(key => generateSectionCompliance(storeId, key));

    const totalPlanograms = sections.reduce((sum, s) => sum + s.planogramsTotal, 0);
    const compliantPlanograms = sections.reduce((sum, s) => sum + s.planogramsCompliant, 0);
    const outOfStockItems = sections.reduce((sum, s) => {
      const oosIssue = s.issues.find(i => i.type === 'out_of_stock');
      return sum + (oosIssue?.count || 0);
    }, 0);
    const misplacedItems = sections.reduce((sum, s) => {
      const misplacedIssue = s.issues.find(i => i.type === 'misplaced');
      return sum + (misplacedIssue?.count || 0);
    }, 0);

    const overallScore = sections.reduce((sum, s) => sum + s.overallScore, 0) / sections.length;
    let status: OptimizationStatus = 'optimal';
    if (overallScore < 70) status = 'critical';
    else if (overallScore < 80) status = 'needs_improvement';
    else if (overallScore < 90) status = 'good';

    return {
      storeId,
      storeName: store?.name || `Store ${storeId}`,
      overallScore,
      status,
      sections,
      totalPlanograms,
      compliantPlanograms,
      outOfStockItems,
      misplacedItems,
      revenueAtRisk: outOfStockItems * 150 + misplacedItems * 50,
      recommendationsCount: sections.filter(s => s.status !== 'optimal').length * 3,
      lastFullAudit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    };
  }

  /**
   * Analyze planograms for a store
   */
  analyzePlanograms(request: PlanogramAnalysisRequest): PlanogramAnalysisResponse {
    try {
      const planograms = this.planogramAnalyzer.getPlanograms(
        request.storeId,
        request.sectionKey
      );

      let heatmaps: HeatmapData[] | undefined;
      let recommendations: MerchandisingRecommendation[] | undefined;

      if (request.includeHeatmap && planograms.length > 0) {
        heatmaps = planograms.slice(0, 5).map(p =>
          this.planogramAnalyzer.generateHeatmap(p.id, p.storeId)
        );
      }

      if (request.includeRecommendations) {
        recommendations = planograms.flatMap(p =>
          this.planogramAnalyzer.suggestOptimizations(p)
        );
      }

      return {
        success: true,
        planograms,
        heatmaps,
        recommendations,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Generate AI-powered recommendations
   */
  generateRecommendations(request: AIRecommendationRequest): AIRecommendationResponse {
    try {
      const response: AIRecommendationResponse = {
        success: true,
        generatedAt: new Date(),
      };

      if (request.type === 'display' || request.type === 'all') {
        const planograms = this.planogramAnalyzer.getPlanograms(
          request.storeId,
          request.sectionKey
        );
        response.displayRecommendations = planograms.flatMap(p =>
          this.planogramAnalyzer.suggestOptimizations(p)
        );
      }

      if (request.type === 'endcap' || request.type === 'all') {
        response.endcapOpportunities = generateEndcapOpportunities(
          request.storeId,
          request.sectionKey
        );
      }

      if (request.type === 'seasonal' || request.type === 'all') {
        response.seasonalAdjustments = generateSeasonalAdjustments(
          request.storeId,
          request.sectionKey
        );
      }

      if (request.type === 'cross_category' || request.type === 'all') {
        response.crossCategoryOpportunities = generateCrossCategoryOpportunities(
          request.storeId
        );
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        generatedAt: new Date(),
      };
    }
  }

  /**
   * Run full AI analysis for a store
   */
  runFullAnalysis(storeId: string, store?: Store): AIAnalysisResult {
    // Get compliance summary
    const compliance = this.getStoreCompliance(storeId, store);

    // Get planograms
    const planograms = this.planogramAnalyzer.getPlanograms(storeId);

    // Generate all recommendations
    const allRecommendations = this.generateRecommendations({
      storeId,
      type: 'all',
      store,
    });

    // Generate AI insights based on compliance and recommendations
    const aiInsights = this.generateAIInsights(compliance, planograms);

    // Generate priority actions
    const priorityActions = this.generatePriorityActions(
      compliance,
      allRecommendations.displayRecommendations || []
    );

    return {
      success: true,
      storeId,
      timestamp: new Date(),
      compliance,
      planograms,
      recommendations: allRecommendations.displayRecommendations || [],
      endcapOpportunities: allRecommendations.endcapOpportunities || [],
      seasonalAdjustments: allRecommendations.seasonalAdjustments || [],
      crossCategoryOpportunities: allRecommendations.crossCategoryOpportunities || [],
      aiInsights,
      priorityActions,
    };
  }

  /**
   * Generate AI insights from analysis data
   */
  private generateAIInsights(
    compliance: StoreComplianceSummary,
    planograms: Planogram[]
  ): string[] {
    const insights: string[] = [];

    // Overall performance insight
    if (compliance.overallScore >= 90) {
      insights.push(`Store ${compliance.storeName} is performing excellently with a ${compliance.overallScore.toFixed(0)}% compliance score.`);
    } else if (compliance.overallScore >= 80) {
      insights.push(`Store ${compliance.storeName} has good compliance at ${compliance.overallScore.toFixed(0)}%, with room for optimization.`);
    } else if (compliance.overallScore >= 70) {
      insights.push(`Store ${compliance.storeName} needs attention with ${compliance.overallScore.toFixed(0)}% compliance. Focus on critical sections.`);
    } else {
      insights.push(`CRITICAL: Store ${compliance.storeName} has low compliance at ${compliance.overallScore.toFixed(0)}%. Immediate action required.`);
    }

    // Out of stock insight
    if (compliance.outOfStockItems > 10) {
      insights.push(`${compliance.outOfStockItems} out-of-stock items detected, representing approximately $${compliance.revenueAtRisk.toLocaleString()} in at-risk revenue.`);
    }

    // Misplaced items insight
    if (compliance.misplacedItems > 15) {
      insights.push(`${compliance.misplacedItems} misplaced items affecting customer experience and potential sales.`);
    }

    // Best performing sections
    const bestSections = compliance.sections
      .filter(s => s.status === 'optimal' || s.status === 'good')
      .slice(0, 2);
    if (bestSections.length > 0) {
      insights.push(`Top performing sections: ${bestSections.map(s => s.sectionName).join(', ')}.`);
    }

    // Sections needing attention
    const criticalSections = compliance.sections.filter(s => s.status === 'critical');
    if (criticalSections.length > 0) {
      insights.push(`Critical attention needed in: ${criticalSections.map(s => s.sectionName).join(', ')}.`);
    }

    // Planogram insights
    const lowScorePlanograms = planograms.filter(p => p.optimizationScore < 70);
    if (lowScorePlanograms.length > 0) {
      insights.push(`${lowScorePlanograms.length} planograms with optimization scores below 70% require review.`);
    }

    // Trend insight
    const improvingSections = compliance.sections.filter(s => s.trends.direction === 'improving');
    const decliningSections = compliance.sections.filter(s => s.trends.direction === 'declining');

    if (improvingSections.length > decliningSections.length) {
      insights.push(`Overall trend is positive with ${improvingSections.length} sections showing improvement.`);
    } else if (decliningSections.length > 0) {
      insights.push(`${decliningSections.length} sections showing declining performance - recommend immediate review.`);
    }

    return insights;
  }

  /**
   * Generate priority actions from analysis
   */
  private generatePriorityActions(
    compliance: StoreComplianceSummary,
    recommendations: MerchandisingRecommendation[]
  ): AIAnalysisResult['priorityActions'] {
    const actions: AIAnalysisResult['priorityActions'] = [];

    // High priority: Out of stock
    if (compliance.outOfStockItems > 5) {
      actions.push({
        action: `Address ${compliance.outOfStockItems} out-of-stock items across store`,
        impact: 'high',
        effort: 'moderate',
        estimatedRevenue: compliance.outOfStockItems * 150,
      });
    }

    // High priority: Critical sections
    const criticalSections = compliance.sections.filter(s => s.status === 'critical');
    criticalSections.forEach(section => {
      actions.push({
        action: `Remediate ${section.sectionName} section - ${section.overallScore.toFixed(0)}% compliance`,
        impact: 'high',
        effort: 'significant',
        estimatedRevenue: 2000 + Math.random() * 3000,
      });
    });

    // Medium priority: High-impact recommendations
    const highPriorityRecs = recommendations.filter(r => r.priority === 'high' || r.priority === 'critical');
    highPriorityRecs.slice(0, 3).forEach(rec => {
      actions.push({
        action: rec.title,
        impact: rec.priority === 'critical' ? 'high' : 'medium',
        effort: rec.estimatedEffort,
        estimatedRevenue: rec.expectedImpact.revenueChange,
      });
    });

    // Medium priority: Misplaced items
    if (compliance.misplacedItems > 10) {
      actions.push({
        action: `Correct ${compliance.misplacedItems} misplaced product positions`,
        impact: 'medium',
        effort: 'moderate',
        estimatedRevenue: compliance.misplacedItems * 50,
      });
    }

    // Sort by impact and estimated revenue
    return actions.sort((a, b) => {
      const impactOrder = { high: 3, medium: 2, low: 1 };
      if (impactOrder[a.impact] !== impactOrder[b.impact]) {
        return impactOrder[b.impact] - impactOrder[a.impact];
      }
      return b.estimatedRevenue - a.estimatedRevenue;
    }).slice(0, 8);
  }

  /**
   * Get traffic patterns for a section
   */
  getTrafficPattern(storeId: string, sectionKey: SectionKey): TrafficPattern {
    return this.planogramAnalyzer.getTrafficPattern(storeId, sectionKey);
  }

  /**
   * Get display effectiveness metrics
   */
  getDisplayEffectiveness(
    storeId: string,
    planogramId: string
  ): DisplayEffectiveness {
    const planograms = this.planogramAnalyzer.getPlanograms(storeId);
    const planogram = planograms.find(p => p.id === planogramId);

    if (!planogram) {
      throw new Error(`Planogram not found: ${planogramId}`);
    }

    const baseROI = 100 + Math.random() * 150;
    const impressions = 1000 + Math.floor(Math.random() * 4000);
    const engagementRate = 15 + Math.random() * 25;
    const conversionRate = 5 + Math.random() * 15;

    return {
      id: `EFF-${planogramId}`,
      planogramId,
      storeId,
      displayType: planogram.displayType,
      location: `Aisle ${planogram.aisle}, Bay ${planogram.bayNumber}`,
      metrics: {
        impressions,
        engagements: Math.floor(impressions * (engagementRate / 100)),
        conversions: Math.floor(impressions * (conversionRate / 100)),
        revenue: planogram.revenuePerWeek * 4,
        roi: baseROI,
        engagementRate,
        conversionRate,
      },
      benchmarks: {
        categoryAverage: 80 + Math.random() * 20,
        marketAverage: 75 + Math.random() * 15,
        topPerformer: 120 + Math.random() * 30,
      },
      performanceRating: baseROI >= 200 ? 'excellent'
        : baseROI >= 150 ? 'good'
        : baseROI >= 100 ? 'average'
        : baseROI >= 75 ? 'below_average'
        : 'poor',
      trend: Math.random() > 0.6 ? 'improving' : Math.random() > 0.3 ? 'stable' : 'declining',
      historicalData: Array.from({ length: 8 }, (_, i) => ({
        date: new Date(Date.now() - (7 - i) * 7 * 24 * 60 * 60 * 1000),
        revenue: planogram.revenuePerWeek * (0.8 + Math.random() * 0.4),
        conversions: Math.floor(impressions * (conversionRate / 100) * (0.8 + Math.random() * 0.4)),
      })),
      recommendations: [
        'Consider increasing facings for top-selling items',
        'Test promotional signage to improve engagement',
        'Review product mix for margin optimization',
      ],
      lastUpdated: new Date(),
    };
  }
}

// Export singleton getter
export function getVisualMerchandisingAI(): VisualMerchandisingAIService {
  return VisualMerchandisingAIService.getInstance();
}

export { VisualMerchandisingAIService };
