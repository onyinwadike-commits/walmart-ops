// Phase 4: Visual Merchandising AI Module - Planogram Analyzer
// Walmart Store Operations Orchestrator
// Analyzes shelf effectiveness and generates heatmap data

import { SectionKey, SECTIONS } from '@/data/stores';
import {
  Planogram,
  ShelfSection,
  ProductPlacement,
  HeatmapData,
  HeatmapPoint,
  TrafficPattern,
  DisplayEffectiveness,
  OptimizationStatus,
  ShelfLevel,
  ShelfPosition,
  TrafficType,
  MerchandisingRecommendation,
} from './types';

// Mock product database for different sections
const MOCK_PRODUCTS: Record<SectionKey, { name: string; brand: string; category: string; price: number; margin: number }[]> = {
  A: [
    { name: 'KPI Dashboard Widget', brand: 'Walmart', category: 'Summary', price: 0, margin: 0 },
    { name: 'Performance Report', brand: 'Walmart', category: 'KPIs', price: 0, margin: 0 },
    { name: 'Daily Highlights', brand: 'Walmart', category: 'Highlights', price: 0, margin: 0 },
    { name: 'Executive Brief', brand: 'Walmart', category: 'Summary', price: 0, margin: 0 },
    { name: 'Metric Snapshot', brand: 'Walmart', category: 'KPIs', price: 0, margin: 0 },
    { name: 'Overview Card', brand: 'Walmart', category: 'Highlights', price: 0, margin: 0 },
  ],
  B: [
    { name: 'Priority Task Card', brand: 'Walmart', category: 'Actions', price: 0, margin: 0 },
    { name: 'Action Item List', brand: 'Walmart', category: 'Tasks', price: 0, margin: 0 },
    { name: 'Follow-up Tracker', brand: 'Walmart', category: 'Follow-ups', price: 0, margin: 0 },
    { name: 'Daily Priorities', brand: 'Walmart', category: 'Actions', price: 0, margin: 0 },
    { name: 'Task Assignment', brand: 'Walmart', category: 'Tasks', price: 0, margin: 0 },
    { name: 'Completion Status', brand: 'Walmart', category: 'Follow-ups', price: 0, margin: 0 },
  ],
  C: [
    { name: 'Competitor Analysis', brand: 'Walmart', category: 'Strategy', price: 0, margin: 0 },
    { name: 'Market Positioning', brand: 'Walmart', category: 'Tactics', price: 0, margin: 0 },
    { name: 'Price Match Report', brand: 'Walmart', category: 'Positioning', price: 0, margin: 0 },
    { name: 'Competitive Intel', brand: 'Walmart', category: 'Strategy', price: 0, margin: 0 },
    { name: 'Outperform Tactics', brand: 'Walmart', category: 'Tactics', price: 0, margin: 0 },
    { name: 'Win Rate Tracker', brand: 'Walmart', category: 'Positioning', price: 0, margin: 0 },
  ],
  D: [
    { name: 'OGP Performance', brand: 'Walmart', category: 'OGP', price: 0, margin: 0 },
    { name: 'Delivery Metrics', brand: 'Walmart', category: 'Delivery', price: 0, margin: 0 },
    { name: 'Digital Sales Report', brand: 'Walmart', category: 'Digital', price: 0, margin: 0 },
    { name: 'E-Commerce KPIs', brand: 'Walmart', category: 'OGP', price: 0, margin: 0 },
    { name: 'Fulfillment Stats', brand: 'Walmart', category: 'Delivery', price: 0, margin: 0 },
    { name: 'Online Benchmark', brand: 'Walmart', category: 'Digital', price: 0, margin: 0 },
  ],
  E: [
    { name: 'Traffic Forecast', brand: 'Walmart', category: 'Predictions', price: 0, margin: 0 },
    { name: 'Stress Alert', brand: 'Walmart', category: 'Alerts', price: 0, margin: 0 },
    { name: 'Trend Analysis', brand: 'Walmart', category: 'Trends', price: 0, margin: 0 },
    { name: 'Peak Time Predictor', brand: 'Walmart', category: 'Predictions', price: 0, margin: 0 },
    { name: 'Capacity Warning', brand: 'Walmart', category: 'Alerts', price: 0, margin: 0 },
    { name: 'Demand Pattern', brand: 'Walmart', category: 'Trends', price: 0, margin: 0 },
  ],
  F: [
    { name: 'Department Checklist', brand: 'Walmart', category: 'Checklists', price: 0, margin: 0 },
    { name: 'Compliance Check', brand: 'Walmart', category: 'Compliance', price: 0, margin: 0 },
    { name: 'Audit Form', brand: 'Walmart', category: 'Audits', price: 0, margin: 0 },
    { name: 'Daily Tasks', brand: 'Walmart', category: 'Checklists', price: 0, margin: 0 },
    { name: 'Standards Review', brand: 'Walmart', category: 'Compliance', price: 0, margin: 0 },
    { name: 'Inspection Report', brand: 'Walmart', category: 'Audits', price: 0, margin: 0 },
  ],
  G: [
    { name: 'Risk Item', brand: 'Walmart', category: 'Risks', price: 0, margin: 0 },
    { name: 'Issue Tracker', brand: 'Walmart', category: 'Issues', price: 0, margin: 0 },
    { name: 'Mitigation Plan', brand: 'Walmart', category: 'Mitigation', price: 0, margin: 0 },
    { name: 'Risk Alert', brand: 'Walmart', category: 'Risks', price: 0, margin: 0 },
    { name: 'Problem Log', brand: 'Walmart', category: 'Issues', price: 0, margin: 0 },
    { name: 'Action Response', brand: 'Walmart', category: 'Mitigation', price: 0, margin: 0 },
  ],
  H: [
    { name: 'Daily Score', brand: 'Walmart', category: 'Scores', price: 0, margin: 0 },
    { name: 'Performance Metric', brand: 'Walmart', category: 'Metrics', price: 0, margin: 0 },
    { name: 'End-of-Day Result', brand: 'Walmart', category: 'Results', price: 0, margin: 0 },
    { name: 'Scorecard Item', brand: 'Walmart', category: 'Scores', price: 0, margin: 0 },
    { name: 'KPI Tracker', brand: 'Walmart', category: 'Metrics', price: 0, margin: 0 },
    { name: 'Daily Summary', brand: 'Walmart', category: 'Results', price: 0, margin: 0 },
  ],
  I: [
    { name: 'Team Announcement', brand: 'Walmart', category: 'Announcements', price: 0, margin: 0 },
    { name: 'Store Update', brand: 'Walmart', category: 'Updates', price: 0, margin: 0 },
    { name: 'Manager Memo', brand: 'Walmart', category: 'Memos', price: 0, margin: 0 },
    { name: 'Staff Notice', brand: 'Walmart', category: 'Announcements', price: 0, margin: 0 },
    { name: 'Policy Update', brand: 'Walmart', category: 'Updates', price: 0, margin: 0 },
    { name: 'Communication Brief', brand: 'Walmart', category: 'Memos', price: 0, margin: 0 },
  ],
  J: [
    { name: 'Social Post', brand: 'Walmart', category: 'Social', price: 0, margin: 0 },
    { name: 'Content Calendar', brand: 'Walmart', category: 'Content', price: 0, margin: 0 },
    { name: 'Engagement Report', brand: 'Walmart', category: 'Engagement', price: 0, margin: 0 },
    { name: 'Weekly Plan', brand: 'Walmart', category: 'Social', price: 0, margin: 0 },
    { name: 'Marketing Content', brand: 'Walmart', category: 'Content', price: 0, margin: 0 },
    { name: 'Community Response', brand: 'Walmart', category: 'Engagement', price: 0, margin: 0 },
  ],
};

// Generate mock planogram data
function generateMockPlanogram(
  storeId: string,
  sectionKey: SectionKey,
  bayNumber: number
): Planogram {
  const section = SECTIONS.find(s => s.key === sectionKey)!;
  const products = MOCK_PRODUCTS[sectionKey] || MOCK_PRODUCTS['B'];

  const shelfLevels: ShelfLevel[] = ['floor', 'bottom', 'lower', 'middle', 'eye', 'upper'];
  const positions: ShelfPosition[] = ['left', 'center-left', 'center', 'center-right', 'right'];

  const sections: ShelfSection[] = shelfLevels.map((level, levelIndex) => {
    const levelProducts: ProductPlacement[] = [];
    const productsPerShelf = Math.min(3, products.length);

    for (let i = 0; i < productsPerShelf; i++) {
      const productIndex = (levelIndex * productsPerShelf + i) % products.length;
      const product = products[productIndex];

      levelProducts.push({
        id: `${storeId}-${sectionKey}-${bayNumber}-${level}-${i}`,
        productId: `PRD-${productIndex + 1000}`,
        productName: product.name,
        upc: `${Math.floor(Math.random() * 900000000000) + 100000000000}`,
        category: product.category,
        brand: product.brand,
        shelfLevel: level,
        position: positions[i % positions.length],
        facings: Math.floor(Math.random() * 4) + 2,
        depth: Math.floor(Math.random() * 3) + 2,
        width: Math.floor(Math.random() * 8) + 4,
        height: Math.floor(Math.random() * 6) + 4,
        pricePoint: product.price,
        margin: product.margin,
        salesVelocity: Math.floor(Math.random() * 50) + 10,
        daysOfSupply: Math.floor(Math.random() * 14) + 3,
        isPromoted: Math.random() > 0.7,
        promotionType: Math.random() > 0.8 ? 'rollback' : undefined,
      });
    }

    const utilizationPercent = 75 + Math.random() * 20;
    const revenuePerLinearInch = 15 + Math.random() * 25;

    return {
      id: `SHELF-${storeId}-${sectionKey}-${bayNumber}-${level}`,
      level,
      width: 48,
      height: 10 + (level === 'floor' ? 6 : 0),
      depth: 24,
      products: levelProducts,
      utilizationPercent,
      revenuePerLinearInch,
      averageMargin: levelProducts.reduce((sum, p) => sum + p.margin, 0) / levelProducts.length,
    };
  });

  const totalProducts = sections.reduce((sum, s) => sum + s.products.length, 0);
  const totalFacings = sections.reduce((sum, s) => s.products.reduce((ps, p) => ps + p.facings, 0), 0);
  const revenuePerWeek = sections.reduce((sum, s) => sum + s.revenuePerLinearInch * s.width, 0);
  const marginPerWeek = revenuePerWeek * 0.28;

  const optimizationScore = 60 + Math.random() * 35;
  let status: OptimizationStatus = 'optimal';
  if (optimizationScore < 70) status = 'critical';
  else if (optimizationScore < 80) status = 'needs_improvement';
  else if (optimizationScore < 90) status = 'good';

  return {
    id: `PLN-${storeId}-${sectionKey}-${bayNumber}`,
    storeId,
    sectionKey,
    aisle: `${sectionKey}${Math.floor(bayNumber / 4) + 1}`,
    bayNumber,
    displayType: bayNumber % 8 === 0 ? 'endcap' : 'gondola',
    name: `${section.name} - Bay ${bayNumber}`,
    description: `${section.description} planogram for bay ${bayNumber}`,
    width: 48,
    height: 72,
    depth: 24,
    sections,
    totalProducts,
    totalFacings,
    revenuePerWeek,
    marginPerWeek,
    lastOptimized: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    optimizationScore,
    status,
    version: `v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}`,
    effectiveDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
  };
}

// Generate heatmap data for a planogram
function generateHeatmapData(planogram: Planogram, type: TrafficType): HeatmapData {
  const dataPoints: HeatmapPoint[] = [];
  const gridSize = 10;

  // Generate grid of heatmap points
  for (let x = 0; x <= 100; x += gridSize) {
    for (let y = 0; y <= 100; y += gridSize) {
      // Eye level (y around 60-70) and center positions (x around 40-60) get higher intensity
      const eyeLevelBonus = y >= 50 && y <= 75 ? 0.3 : 0;
      const centerBonus = x >= 30 && x <= 70 ? 0.2 : 0;
      const baseIntensity = Math.random() * 0.5;

      dataPoints.push({
        x,
        y,
        intensity: Math.min(1, baseIntensity + eyeLevelBonus + centerBonus),
        type,
      });
    }
  }

  // Find peak areas (high intensity clusters)
  const peakAreas = [
    { x: 50, y: 65, radius: 15, intensity: 'hot' as const },
    { x: 30, y: 60, radius: 12, intensity: 'warm' as const },
    { x: 70, y: 55, radius: 10, intensity: 'warm' as const },
  ];

  // Find cold spots (low intensity areas)
  const coldSpots = [
    { x: 10, y: 90, radius: 12 },
    { x: 90, y: 20, radius: 10 },
    { x: 15, y: 15, radius: 8 },
  ];

  return {
    id: `HM-${planogram.id}-${type}`,
    planogramId: planogram.id,
    storeId: planogram.storeId,
    dataPoints,
    type,
    averageIntensity: dataPoints.reduce((sum, p) => sum + p.intensity, 0) / dataPoints.length,
    peakAreas,
    coldSpots,
    captureDate: new Date(),
    sampleSize: 1000 + Math.floor(Math.random() * 500),
    confidence: 0.85 + Math.random() * 0.1,
  };
}

// Planogram Analyzer Service
class PlanogramAnalyzerService {
  private static instance: PlanogramAnalyzerService | null = null;
  private planogramCache: Map<string, Planogram[]> = new Map();
  private heatmapCache: Map<string, HeatmapData> = new Map();

  private constructor() {}

  public static getInstance(): PlanogramAnalyzerService {
    if (!PlanogramAnalyzerService.instance) {
      PlanogramAnalyzerService.instance = new PlanogramAnalyzerService();
    }
    return PlanogramAnalyzerService.instance;
  }

  /**
   * Get planograms for a store/section
   */
  getPlanograms(storeId: string, sectionKey?: SectionKey): Planogram[] {
    const cacheKey = `${storeId}-${sectionKey || 'all'}`;

    if (this.planogramCache.has(cacheKey)) {
      return this.planogramCache.get(cacheKey)!;
    }

    const sections = sectionKey ? [sectionKey] : (['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'] as SectionKey[]);
    const planograms: Planogram[] = [];

    sections.forEach(section => {
      // Generate 4-8 bays per section
      const numBays = 4 + Math.floor(Math.random() * 5);
      for (let bay = 1; bay <= numBays; bay++) {
        planograms.push(generateMockPlanogram(storeId, section, bay));
      }
    });

    this.planogramCache.set(cacheKey, planograms);
    return planograms;
  }

  /**
   * Analyze shelf effectiveness for a planogram
   */
  analyzeShelfEffectiveness(planogram: Planogram): {
    score: number;
    insights: string[];
    issues: { level: ShelfLevel; issue: string; severity: 'high' | 'medium' | 'low' }[];
    strengths: string[];
  } {
    const insights: string[] = [];
    const issues: { level: ShelfLevel; issue: string; severity: 'high' | 'medium' | 'low' }[] = [];
    const strengths: string[] = [];

    let totalScore = 0;
    let factorCount = 0;

    // Analyze each shelf section
    planogram.sections.forEach(section => {
      // Check utilization
      if (section.utilizationPercent < 70) {
        issues.push({
          level: section.level,
          issue: `Low utilization (${section.utilizationPercent.toFixed(0)}%) - opportunity to add products`,
          severity: 'medium',
        });
      } else if (section.utilizationPercent > 95) {
        issues.push({
          level: section.level,
          issue: `Over-packed shelf (${section.utilizationPercent.toFixed(0)}%) - may cause out-of-stocks`,
          severity: 'high',
        });
      }

      // Check revenue per linear inch
      if (section.revenuePerLinearInch > 25) {
        strengths.push(`${section.level} shelf generating strong revenue: $${section.revenuePerLinearInch.toFixed(2)}/inch`);
      } else if (section.revenuePerLinearInch < 15) {
        issues.push({
          level: section.level,
          issue: `Low revenue per inch ($${section.revenuePerLinearInch.toFixed(2)}) - consider product mix changes`,
          severity: 'medium',
        });
      }

      // Check product placement at eye level
      if (section.level === 'eye') {
        const highMarginProducts = section.products.filter(p => p.margin > 0.35);
        if (highMarginProducts.length < section.products.length * 0.5) {
          issues.push({
            level: section.level,
            issue: 'Eye level not optimized for high-margin products',
            severity: 'high',
          });
        } else {
          strengths.push('Eye level well-optimized with high-margin products');
        }
      }

      totalScore += section.utilizationPercent * 0.3 + section.revenuePerLinearInch * 2 + section.averageMargin * 100;
      factorCount += 3;
    });

    // Calculate overall score
    const rawScore = totalScore / factorCount;
    const normalizedScore = Math.min(100, Math.max(0, rawScore));

    // Generate insights
    if (normalizedScore > 85) {
      insights.push('This planogram is performing well above average');
    } else if (normalizedScore > 70) {
      insights.push('Good performance with room for optimization');
    } else {
      insights.push('Significant optimization opportunities exist');
    }

    if (planogram.displayType === 'endcap') {
      insights.push('Endcap location provides high visibility - maximize promotional impact');
    }

    // Check days since last optimization
    const daysSinceOptimization = Math.floor((Date.now() - planogram.lastOptimized.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceOptimization > 30) {
      insights.push(`Planogram last optimized ${daysSinceOptimization} days ago - review recommended`);
    }

    return {
      score: normalizedScore,
      insights,
      issues,
      strengths,
    };
  }

  /**
   * Generate traffic/attention heatmap data
   */
  generateHeatmap(planogramId: string, storeId: string, type: TrafficType = 'attention'): HeatmapData {
    const cacheKey = `${planogramId}-${type}`;

    if (this.heatmapCache.has(cacheKey)) {
      return this.heatmapCache.get(cacheKey)!;
    }

    // Find or generate the planogram
    const allPlanograms = this.getPlanograms(storeId);
    const planogram = allPlanograms.find(p => p.id === planogramId);

    if (!planogram) {
      throw new Error(`Planogram not found: ${planogramId}`);
    }

    const heatmap = generateHeatmapData(planogram, type);
    this.heatmapCache.set(cacheKey, heatmap);

    return heatmap;
  }

  /**
   * Suggest optimizations for a planogram
   */
  suggestOptimizations(planogram: Planogram): MerchandisingRecommendation[] {
    const recommendations: MerchandisingRecommendation[] = [];
    const effectiveness = this.analyzeShelfEffectiveness(planogram);

    // Generate recommendations based on issues
    effectiveness.issues.forEach((issue, index) => {
      const recommendation: MerchandisingRecommendation = {
        id: `REC-${planogram.id}-${index}`,
        planogramId: planogram.id,
        storeId: planogram.storeId,
        type: issue.issue.includes('utilization') ? 'facing' : 'placement',
        priority: issue.severity === 'high' ? 'high' : issue.severity === 'medium' ? 'medium' : 'low',
        title: `Optimize ${issue.level} shelf`,
        description: issue.issue,
        rationale: `Analysis shows ${issue.level} shelf is underperforming. Addressing this issue can improve overall planogram effectiveness.`,
        affectedProducts: planogram.sections
          .find(s => s.level === issue.level)?.products
          .map(p => p.productId) || [],
        currentState: {
          position: issue.level,
        },
        suggestedState: {
          position: issue.level,
        },
        expectedImpact: {
          revenueChange: issue.severity === 'high' ? 500 : issue.severity === 'medium' ? 300 : 100,
          marginChange: issue.severity === 'high' ? 150 : issue.severity === 'medium' ? 90 : 30,
          velocityChange: 5 + Math.random() * 10,
        },
        confidence: 0.75 + Math.random() * 0.2,
        implementationSteps: [
          'Review current product placement',
          'Identify underperforming products',
          'Swap with higher-performing alternatives',
          'Adjust facings based on sales velocity',
          'Monitor results for 2 weeks',
        ],
        estimatedEffort: issue.severity === 'high' ? 'moderate' : 'quick',
        aiSource: 'planogram-analyzer',
        generatedAt: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'pending',
      };

      recommendations.push(recommendation);
    });

    // Add general optimization recommendation if score is low
    if (effectiveness.score < 75) {
      recommendations.push({
        id: `REC-${planogram.id}-general`,
        planogramId: planogram.id,
        storeId: planogram.storeId,
        type: 'placement',
        priority: 'high',
        title: 'Full planogram review recommended',
        description: `Overall effectiveness score of ${effectiveness.score.toFixed(0)} indicates significant optimization opportunity`,
        rationale: 'A comprehensive review of this planogram could yield substantial revenue improvements',
        affectedProducts: planogram.sections.flatMap(s => s.products.map(p => p.productId)),
        currentState: {},
        suggestedState: {},
        expectedImpact: {
          revenueChange: 1000 + Math.random() * 1500,
          marginChange: 300 + Math.random() * 500,
          velocityChange: 15 + Math.random() * 20,
        },
        confidence: 0.85,
        implementationSteps: [
          'Export current planogram data',
          'Run AI optimization analysis',
          'Generate new planogram layout',
          'Review with category manager',
          'Implement changes during low-traffic period',
          'Monitor performance metrics',
        ],
        estimatedEffort: 'significant',
        aiSource: 'planogram-analyzer',
        generatedAt: new Date(),
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'pending',
      });
    }

    return recommendations;
  }

  /**
   * Calculate ROI for display changes
   */
  calculateDisplayROI(
    currentDisplay: DisplayEffectiveness,
    proposedChanges: Partial<MerchandisingRecommendation>
  ): {
    estimatedNewRevenue: number;
    incrementalRevenue: number;
    implementationCost: number;
    roi: number;
    paybackPeriod: string;
    confidence: number;
  } {
    // Calculate based on current performance and expected impact
    const currentWeeklyRevenue = currentDisplay.metrics.revenue / 4; // Assume monthly data
    const impactMultiplier = proposedChanges.expectedImpact?.revenueChange
      ? 1 + (proposedChanges.expectedImpact.revenueChange / currentWeeklyRevenue)
      : 1.15;

    const estimatedNewRevenue = currentWeeklyRevenue * impactMultiplier;
    const incrementalRevenue = (estimatedNewRevenue - currentWeeklyRevenue) * 52; // Annual

    // Estimate implementation cost based on effort
    const costByEffort = {
      quick: 150,
      moderate: 500,
      significant: 1500,
    };
    const implementationCost = costByEffort[proposedChanges.estimatedEffort || 'moderate'];

    const roi = ((incrementalRevenue - implementationCost) / implementationCost) * 100;
    const paybackWeeks = incrementalRevenue > 0
      ? Math.ceil(implementationCost / (incrementalRevenue / 52))
      : Infinity;

    return {
      estimatedNewRevenue,
      incrementalRevenue,
      implementationCost,
      roi,
      paybackPeriod: paybackWeeks < 52 ? `${paybackWeeks} weeks` : `${Math.ceil(paybackWeeks / 52)} years`,
      confidence: proposedChanges.confidence || 0.75,
    };
  }

  /**
   * Get traffic patterns for a section
   */
  getTrafficPattern(storeId: string, sectionKey: SectionKey): TrafficPattern {
    // Generate mock traffic pattern data
    const hourlyTraffic = Array.from({ length: 24 }, (_, hour) => {
      let traffic = 20;
      let peakType: 'low' | 'normal' | 'high' | 'peak' = 'low';

      if (hour >= 10 && hour <= 20) {
        traffic = 50 + Math.random() * 50;
        peakType = 'normal';
      }
      if (hour >= 11 && hour <= 14) {
        traffic = 80 + Math.random() * 30;
        peakType = 'high';
      }
      if (hour >= 17 && hour <= 19) {
        traffic = 100 + Math.random() * 50;
        peakType = 'peak';
      }

      return { hour, traffic, peakType };
    });

    const weekdayPattern = Array.from({ length: 7 }, (_, day) => ({
      day,
      averageTraffic: day === 0 || day === 6 ? 150 : 100 + Math.random() * 30,
      peakHour: day === 0 || day === 6 ? 14 : 18,
    }));

    return {
      id: `TP-${storeId}-${sectionKey}`,
      storeId,
      sectionKey,
      aisle: `${sectionKey}1`,
      hourlyTraffic,
      weekdayPattern,
      flowDirection: Math.random() > 0.5 ? 'left_to_right' : 'right_to_left',
      avgDwellTime: 30 + Math.random() * 60,
      conversionRate: 15 + Math.random() * 25,
      peakDays: ['Saturday', 'Sunday'],
      slowDays: ['Tuesday', 'Wednesday'],
      seasonalFactors: [
        { period: 'holiday', multiplier: 1.8 },
        { period: 'back_to_school', multiplier: 1.4 },
        { period: 'summer', multiplier: 1.2 },
      ],
    };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.planogramCache.clear();
    this.heatmapCache.clear();
  }
}

// Export singleton getter
export function getPlanogramAnalyzer(): PlanogramAnalyzerService {
  return PlanogramAnalyzerService.getInstance();
}

export { PlanogramAnalyzerService };
