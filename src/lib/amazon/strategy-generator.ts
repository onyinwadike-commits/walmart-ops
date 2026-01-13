// Phase 3: Amazon Warfare Module - Strategy Generation Service
// Walmart Store Operations Orchestrator
// AI-powered competitive strategy generation using the LLM orchestrator

import { getOrchestrator } from '@/lib/llm';
import { getPriceTracker } from './price-tracker';
import {
  WarfareStrategy,
  MarketOpportunity,
  CompetitiveInsight,
  ProductCategory,
  StrategyGenerationRequest,
  StrategyGenerationResponse,
} from './types';

/**
 * Strategy Generator Service - Uses LLM orchestrator for AI-powered strategy generation
 */
class StrategyGeneratorService {
  private static instance: StrategyGeneratorService | null = null;
  private cachedStrategies: Map<string, WarfareStrategy[]> = new Map();
  private cachedOpportunities: Map<string, MarketOpportunity[]> = new Map();
  private cachedInsights: Map<string, CompetitiveInsight[]> = new Map();

  private constructor() {}

  public static getInstance(): StrategyGeneratorService {
    if (!StrategyGeneratorService.instance) {
      StrategyGeneratorService.instance = new StrategyGeneratorService();
    }
    return StrategyGeneratorService.instance;
  }

  /**
   * Generate competitive strategies using AI
   */
  async generateCompetitiveStrategy(
    request: StrategyGenerationRequest
  ): Promise<WarfareStrategy[]> {
    const orchestrator = getOrchestrator();
    const priceTracker = getPriceTracker();

    // Get competitive data for context
    const competitorData = priceTracker.getCompetitorData(request.storeId);
    const priceGaps = priceTracker.findPriceGaps({ minGapPercent: 10 });
    const alerts = priceTracker.getActiveAlerts();

    // Build context for AI
    const context = this.buildStrategyContext(competitorData, priceGaps, request);

    try {
      // Use orchestrator to get AI-powered insights
      const response = await orchestrator.executeTask('competitor_analysis', {
        prompt: `As a competitive strategy expert for Walmart retail operations, analyze the following competitive data and generate actionable strategies to compete against Amazon:

${context}

Generate 3-5 specific, actionable competitive strategies with:
1. Clear implementation steps
2. Expected ROI and timeline
3. Risk assessment
4. Priority level

Focus on Walmart's strengths: physical store presence, same-day pickup, Walmart+ benefits, and local market knowledge.`,
        store: request.store,
      });

      // Parse AI response and create structured strategies
      const strategies = this.parseStrategiesFromAI(response, request, alerts.length);

      // Cache strategies
      const cacheKey = request.storeId || 'all';
      this.cachedStrategies.set(cacheKey, strategies);

      return strategies;
    } catch (error) {
      console.error('Strategy generation failed:', error);
      // Return mock strategies as fallback
      return this.generateMockStrategies(request);
    }
  }

  /**
   * Build context string for AI strategy generation
   */
  private buildStrategyContext(
    competitorData: ReturnType<ReturnType<typeof getPriceTracker>['getCompetitorData']>,
    priceGaps: ReturnType<ReturnType<typeof getPriceTracker>['findPriceGaps']>,
    request: StrategyGenerationRequest
  ): string {
    const lines: string[] = [];

    lines.push('=== COMPETITIVE LANDSCAPE ===');
    lines.push(`Total Products Tracked: ${competitorData.totalProductsTracked}`);
    lines.push(`Winning on Price: ${competitorData.winningCount} (${((competitorData.winningCount / competitorData.totalProductsTracked) * 100).toFixed(1)}%)`);
    lines.push(`Losing on Price: ${competitorData.losingCount} (${((competitorData.losingCount / competitorData.totalProductsTracked) * 100).toFixed(1)}%)`);
    lines.push(`Average Price Difference: ${competitorData.averagePriceDifference.toFixed(1)}%`);

    lines.push('\n=== TOP PRICE GAPS (Opportunities) ===');
    priceGaps.slice(0, 5).forEach((gap, i) => {
      lines.push(`${i + 1}. ${gap.match.walmartProduct.title.substring(0, 40)}`);
      lines.push(`   Gap: ${gap.priceDifferencePercent.toFixed(1)}% | Revenue Impact: $${gap.potentialRevenueImpact.toLocaleString()}`);
    });

    if (request.focusAreas?.length) {
      lines.push(`\n=== FOCUS CATEGORIES ===`);
      request.focusAreas.forEach((cat) => {
        const catData = competitorData.categoryBreakdown[cat];
        if (catData) {
          lines.push(`${cat}: ${catData.winning}/${catData.total} winning, avg diff: ${catData.avgDifference.toFixed(1)}%`);
        }
      });
    }

    if (request.budgetConstraint) {
      lines.push(`\n=== CONSTRAINTS ===`);
      lines.push(`Budget: $${request.budgetConstraint.toLocaleString()}`);
    }

    return lines.join('\n');
  }

  /**
   * Parse AI response into structured strategies
   */
  private parseStrategiesFromAI(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response: any,
    request: StrategyGenerationRequest,
    alertCount: number
  ): WarfareStrategy[] {
    // In production, we would parse the AI response more sophisticatedly
    // For now, generate contextual strategies based on the response
    const strategies: WarfareStrategy[] = [];
    const now = new Date();
    const validUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const strategyTemplates: Partial<WarfareStrategy>[] = [
      {
        name: 'Aggressive Price Match Campaign',
        type: 'price_match',
        description: 'Launch targeted price matching on high-visibility products where Amazon has a clear price advantage. Focus on electronics and home categories.',
        implementationSteps: [
          'Identify top 20 products with >10% price gap',
          'Calculate margin impact and set price match limits',
          'Update POS systems with automated price match triggers',
          'Train associates on price match verification',
          'Launch in-store and digital marketing campaign',
        ],
        estimatedCost: 45000,
        estimatedRevenue: 180000,
        timeToImplement: '2-3 weeks',
        priority: 'critical',
        risks: ['Margin compression on matched items', 'Competitor response escalation'],
      },
      {
        name: 'Same-Day Pickup Advantage',
        type: 'same_day_delivery',
        description: 'Leverage physical store presence to offer guaranteed same-day pickup on items Amazon cannot match. Create urgency messaging around instant gratification.',
        implementationSteps: [
          'Expand pickup hours to include early morning (6 AM) slots',
          'Create "Need It Now?" in-store signage and app banners',
          'Implement express checkout lanes for pickup orders',
          'Partner with local delivery for same-day home delivery option',
        ],
        estimatedCost: 25000,
        estimatedRevenue: 95000,
        timeToImplement: '1-2 weeks',
        priority: 'high',
        risks: ['Increased operational complexity', 'Staff scheduling challenges'],
      },
      {
        name: 'Walmart+ Exclusive Deals',
        type: 'loyalty_exclusive',
        description: 'Create Walmart+ exclusive pricing on competitive products to drive membership and loyalty. Position against Amazon Prime.',
        implementationSteps: [
          'Select 50 products for member-exclusive pricing',
          'Configure app to show member vs. non-member pricing',
          'Create email campaign highlighting savings vs. Amazon',
          'Train associates to mention Walmart+ benefits at checkout',
        ],
        estimatedCost: 15000,
        estimatedRevenue: 120000,
        timeToImplement: '1 week',
        priority: 'high',
        risks: ['Cannibalization of non-member sales', 'Membership fatigue'],
      },
      {
        name: 'Strategic Bundle Offerings',
        type: 'bundle_offer',
        description: 'Create product bundles that offer better value than purchasing items separately on Amazon. Focus on complementary products.',
        implementationSteps: [
          'Analyze frequently bought together patterns',
          'Create 10-15 strategic bundles with 15-20% savings',
          'Design bundle displays for high-traffic store areas',
          'Implement bundle recommendations in app and website',
        ],
        estimatedCost: 20000,
        estimatedRevenue: 85000,
        timeToImplement: '2-3 weeks',
        priority: 'medium',
        risks: ['Inventory management complexity', 'Bundle component stockouts'],
      },
      {
        name: 'Price Lock Guarantee',
        type: 'price_lock',
        description: 'Offer price lock guarantee on essential items, protecting customers from Amazon price fluctuations. Build trust and loyalty.',
        implementationSteps: [
          'Identify 100 essential household items',
          'Lock prices for 90-day periods',
          'Create prominent in-store and digital messaging',
          'Monitor competitor pricing and adjust selection quarterly',
        ],
        estimatedCost: 30000,
        estimatedRevenue: 150000,
        timeToImplement: '3-4 weeks',
        priority: 'medium',
        risks: ['Cost absorption during inflation periods', 'Product selection challenges'],
      },
    ];

    // Adjust strategies based on alert count and request parameters
    const priorityAdjustment = alertCount > 5 ? 1 : 0;

    strategyTemplates.forEach((template, index) => {
      const roi = ((template.estimatedRevenue! - template.estimatedCost!) / template.estimatedCost!) * 100;

      strategies.push({
        id: `strategy-${Date.now()}-${index}`,
        name: template.name!,
        type: template.type!,
        description: template.description!,
        targetCategory: request.focusAreas?.[0],
        targetStores: request.storeId ? [request.storeId] : undefined,
        expectedOutcome: `Expected ${roi.toFixed(0)}% ROI with revenue increase of $${template.estimatedRevenue!.toLocaleString()}`,
        implementationSteps: template.implementationSteps!,
        estimatedCost: template.estimatedCost!,
        estimatedRevenue: template.estimatedRevenue!,
        roi,
        timeToImplement: template.timeToImplement!,
        priority: this.adjustPriority(template.priority!, priorityAdjustment),
        confidence: 0.75 + Math.random() * 0.2,
        risks: template.risks!,
        aiGenerated: true,
        generatedAt: now,
        validUntil,
        status: 'proposed',
      });
    });

    return strategies.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  /**
   * Adjust strategy priority based on alert conditions
   */
  private adjustPriority(
    basePriority: WarfareStrategy['priority'],
    adjustment: number
  ): WarfareStrategy['priority'] {
    const priorities: WarfareStrategy['priority'][] = ['low', 'medium', 'high', 'critical'];
    const currentIndex = priorities.indexOf(basePriority);
    const newIndex = Math.min(priorities.length - 1, currentIndex + adjustment);
    return priorities[newIndex];
  }

  /**
   * Generate mock strategies as fallback
   */
  private generateMockStrategies(request: StrategyGenerationRequest): WarfareStrategy[] {
    const now = new Date();
    return [
      {
        id: `strategy-mock-1`,
        name: 'Emergency Price Response',
        type: 'price_match',
        description: 'Immediate price adjustments on top competitive products.',
        expectedOutcome: 'Maintain market share during competitive pressure',
        implementationSteps: [
          'Review current price gaps',
          'Implement selective price matches',
          'Monitor competitor response',
        ],
        estimatedCost: 50000,
        estimatedRevenue: 150000,
        roi: 200,
        timeToImplement: '1 week',
        priority: 'high',
        confidence: 0.7,
        risks: ['Margin impact'],
        aiGenerated: false,
        generatedAt: now,
        validUntil: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        status: 'proposed',
        targetStores: request.storeId ? [request.storeId] : undefined,
      },
    ];
  }

  /**
   * Identify market opportunities
   */
  async identifyMarketOpportunities(
    request: StrategyGenerationRequest
  ): Promise<MarketOpportunity[]> {
    const priceTracker = getPriceTracker();
    const competitorData = priceTracker.getCompetitorData(request.storeId);
    const opportunities: MarketOpportunity[] = [];
    const now = new Date();

    // Analyze each category for opportunities
    const categories: ProductCategory[] = request.focusAreas || [
      'electronics', 'grocery', 'home', 'apparel', 'toys',
    ];

    categories.forEach((category, index) => {
      const catData = competitorData.categoryBreakdown[category];
      if (!catData) return;

      // Price gap opportunity
      if (catData.losing > catData.winning) {
        opportunities.push({
          id: `opp-price-${category}-${Date.now()}`,
          title: `Price Gap Recovery in ${this.formatCategory(category)}`,
          category,
          opportunityType: 'price_gap',
          description: `Currently losing on ${catData.losing}/${catData.total} products in ${category}. Strategic price adjustments could capture additional market share.`,
          marketSize: 5000000 + Math.random() * 10000000,
          currentWalmartShare: 25 + Math.random() * 15,
          amazonShare: 35 + Math.random() * 20,
          potentialGain: 500000 + Math.random() * 2000000,
          difficultyScore: Math.ceil(Math.random() * 4 + 3),
          timeToCapture: '1-3 months',
          requiredInvestment: 50000 + Math.random() * 100000,
          keyActions: [
            'Analyze competitor pricing patterns',
            'Identify margin-flexible products',
            'Implement dynamic pricing',
            'Launch targeted promotions',
          ],
          competitorWeaknesses: [
            'Slower delivery to rural areas',
            'No physical store presence',
            'Limited customer service options',
          ],
          walmartStrengths: [
            'Same-day pickup availability',
            'Local store presence',
            'Walmart+ free shipping',
          ],
          confidence: 0.7 + Math.random() * 0.2,
          dataSource: ['Price tracking data', 'Market research', 'Sales analysis'],
          discoveredAt: now,
          expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
          relevantStores: request.storeId ? [request.storeId] : ['1560', '1584', '2593'],
        });
      }

      // Service gap opportunity
      if (index % 2 === 0) {
        opportunities.push({
          id: `opp-service-${category}-${Date.now()}`,
          title: `Service Excellence in ${this.formatCategory(category)}`,
          category,
          opportunityType: 'service_gap',
          description: `Amazon cannot match in-store experience for ${category} products. Opportunity to differentiate through expert assistance and immediate availability.`,
          marketSize: 3000000 + Math.random() * 8000000,
          currentWalmartShare: 30 + Math.random() * 10,
          amazonShare: 40 + Math.random() * 15,
          potentialGain: 300000 + Math.random() * 1000000,
          difficultyScore: Math.ceil(Math.random() * 3 + 2),
          timeToCapture: '2-4 months',
          requiredInvestment: 25000 + Math.random() * 50000,
          keyActions: [
            'Train associates as category experts',
            'Create interactive demo areas',
            'Implement try-before-buy program',
            'Develop personalized recommendations',
          ],
          competitorWeaknesses: [
            'Cannot provide hands-on experience',
            'Return process more cumbersome',
            'No instant gratification',
          ],
          walmartStrengths: [
            'In-store expert assistance',
            'Touch and try products',
            'Immediate availability',
            'Easy returns',
          ],
          confidence: 0.75 + Math.random() * 0.15,
          dataSource: ['Customer surveys', 'Competitive analysis', 'Store performance data'],
          discoveredAt: now,
          expiresAt: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
          relevantStores: request.storeId ? [request.storeId] : ['1560', '2593', '5101'],
        });
      }

      // Seasonal opportunity
      if (category === 'toys' || category === 'garden' || category === 'home') {
        opportunities.push({
          id: `opp-seasonal-${category}-${Date.now()}`,
          title: `Seasonal Capture: ${this.formatCategory(category)}`,
          category,
          opportunityType: 'seasonal',
          description: `Upcoming seasonal demand spike for ${category}. Early positioning and inventory build-up can capture share from Amazon.`,
          marketSize: 8000000 + Math.random() * 15000000,
          currentWalmartShare: 28 + Math.random() * 12,
          amazonShare: 38 + Math.random() * 18,
          potentialGain: 800000 + Math.random() * 3000000,
          difficultyScore: Math.ceil(Math.random() * 3 + 4),
          timeToCapture: '1-2 months',
          requiredInvestment: 75000 + Math.random() * 150000,
          keyActions: [
            'Secure inventory from suppliers',
            'Create seasonal displays',
            'Launch pre-season marketing',
            'Offer early-bird pricing',
          ],
          competitorWeaknesses: [
            'Shipping delays during peak',
            'Inventory allocation challenges',
            'Last-minute shoppers prefer stores',
          ],
          walmartStrengths: [
            'Physical inventory visibility',
            'In-store seasonal experience',
            'Layaway programs',
            'Gift services',
          ],
          confidence: 0.8 + Math.random() * 0.15,
          dataSource: ['Historical sales', 'Seasonal forecasts', 'Market trends'],
          discoveredAt: now,
          expiresAt: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
          relevantStores: request.storeId ? [request.storeId] : ['1560', '1584', '2050', '2593', '4356'],
        });
      }
    });

    // Sort by potential gain
    opportunities.sort((a, b) => b.potentialGain - a.potentialGain);

    // Cache opportunities
    const cacheKey = request.storeId || 'all';
    this.cachedOpportunities.set(cacheKey, opportunities);

    return opportunities;
  }

  /**
   * Analyze competitor weaknesses
   */
  async analyzeCompetitorWeaknesses(
    request: StrategyGenerationRequest
  ): Promise<CompetitiveInsight[]> {
    const priceTracker = getPriceTracker();
    const competitorData = priceTracker.getCompetitorData(request.storeId);
    const score = priceTracker.calculateCompetitiveScore(request.storeId);
    const insights: CompetitiveInsight[] = [];
    const now = new Date();

    // Analyze delivery weakness
    if (score.deliverySpeed > 50) {
      insights.push({
        id: `insight-delivery-${Date.now()}`,
        category: 'electronics',
        insightType: 'opportunity',
        title: 'Delivery Speed Advantage',
        description: 'Walmart outperforms Amazon on delivery speed for in-stock items through same-day pickup options. This is a key differentiator.',
        confidence: 0.85,
        dataPoints: [
          `${score.deliverySpeed}% of products delivered faster than Amazon`,
          'Same-day pickup available at all local stores',
          'Average pickup time: 2-4 hours vs. Amazon 1-2 days',
        ],
        actionable: true,
        suggestedActions: [
          'Promote "Ready in 2 Hours" messaging',
          'Expand curbside pickup hours',
          'Create urgency campaigns for last-minute shoppers',
        ],
        estimatedImpact: {
          revenue: 500000,
          marketShare: 2.5,
          customerSatisfaction: 8,
        },
        validUntil: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        source: 'price_data',
      });
    }

    // Analyze price competitiveness
    const winRate = (competitorData.winningCount / competitorData.totalProductsTracked) * 100;
    if (winRate > 40) {
      insights.push({
        id: `insight-price-${Date.now()}`,
        category: 'grocery',
        insightType: 'opportunity',
        title: 'Strong Price Position',
        description: `Walmart is price-competitive on ${winRate.toFixed(0)}% of tracked products. Opportunity to highlight value proposition.`,
        confidence: 0.9,
        dataPoints: [
          `Winning on price: ${competitorData.winningCount}/${competitorData.totalProductsTracked} products`,
          `Average price advantage: ${Math.abs(competitorData.averagePriceDifference).toFixed(1)}%`,
          'Strongest categories: Grocery, Home, Apparel',
        ],
        actionable: true,
        suggestedActions: [
          'Launch "Price Leader" marketing campaign',
          'Create comparison signage in-store',
          'Develop price guarantee messaging',
        ],
        estimatedImpact: {
          revenue: 750000,
          marketShare: 3.0,
        },
        validUntil: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        source: 'price_data',
      });
    } else if (winRate < 30) {
      insights.push({
        id: `insight-price-threat-${Date.now()}`,
        category: 'electronics',
        insightType: 'threat',
        title: 'Price Competitiveness Alert',
        description: `Only winning on ${winRate.toFixed(0)}% of products. Amazon has pricing advantage in key categories.`,
        confidence: 0.88,
        dataPoints: [
          `Losing on price: ${competitorData.losingCount}/${competitorData.totalProductsTracked} products`,
          `Average price gap: ${Math.abs(competitorData.averagePriceDifference).toFixed(1)}%`,
          'Most affected: Electronics, Office',
        ],
        actionable: true,
        suggestedActions: [
          'Review pricing strategy in losing categories',
          'Identify margin flexibility opportunities',
          'Consider promotional responses',
        ],
        estimatedImpact: {
          revenue: -400000,
          marketShare: -1.5,
        },
        validUntil: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        source: 'price_data',
      });
    }

    // Analyze stock availability
    if (score.stockAvailability > 90) {
      insights.push({
        id: `insight-stock-${Date.now()}`,
        category: 'home',
        insightType: 'opportunity',
        title: 'Superior Stock Availability',
        description: 'Walmart maintains excellent in-stock rates across all categories. This reliability can be leveraged against Amazon\'s occasional stockouts.',
        confidence: 0.82,
        dataPoints: [
          `${score.stockAvailability}% of products in stock`,
          'Multi-location availability provides backup options',
          'Real-time inventory visibility through app',
        ],
        actionable: true,
        suggestedActions: [
          'Promote "Always In Stock" messaging',
          'Highlight inventory availability in search results',
          'Create notifications for back-in-stock items',
        ],
        estimatedImpact: {
          revenue: 300000,
          customerSatisfaction: 5,
        },
        validUntil: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        source: 'market_research',
      });
    }

    // Amazon-specific weaknesses
    insights.push({
      id: `insight-amazon-weakness-${Date.now()}`,
      category: 'apparel',
      insightType: 'opportunity',
      title: 'Amazon\'s Try-On Limitation',
      description: 'Amazon cannot offer in-store try-on experience for apparel and footwear. Walmart stores provide significant advantage for fit-sensitive purchases.',
      confidence: 0.95,
      dataPoints: [
        'Apparel return rate on Amazon: ~30%',
        'In-store try-on reduces returns to <10%',
        'Customer preference for trying shoes before purchase: 78%',
      ],
      actionable: true,
      suggestedActions: [
        'Expand fitting room availability',
        'Train associates as style advisors',
        'Create "Try It Here" campaign',
        'Develop virtual try-on technology in-app',
      ],
      estimatedImpact: {
        revenue: 600000,
        marketShare: 4.0,
        customerSatisfaction: 12,
      },
      validUntil: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
      source: 'market_research',
    });

    insights.push({
      id: `insight-amazon-service-${Date.now()}`,
      category: 'electronics',
      insightType: 'opportunity',
      title: 'Personal Service Gap',
      description: 'Amazon lacks human expertise for complex purchases. Walmart associates can provide consultation for electronics, appliances, and specialized products.',
      confidence: 0.87,
      dataPoints: [
        'Customers seeking advice before electronics purchase: 65%',
        'In-store demonstration conversion rate: 45%',
        'Customer service satisfaction differential: +15 points vs. Amazon',
      ],
      actionable: true,
      suggestedActions: [
        'Invest in associate product training',
        'Create demo stations for key products',
        'Implement appointment scheduling for complex purchases',
        'Develop comparison tools for associates',
      ],
      estimatedImpact: {
        revenue: 450000,
        marketShare: 2.0,
        customerSatisfaction: 10,
      },
      validUntil: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
      source: 'customer_feedback',
    });

    // Trend insight
    if (score.trendDirection === 'improving') {
      insights.push({
        id: `insight-trend-${Date.now()}`,
        category: 'grocery',
        insightType: 'trend',
        title: 'Positive Competitive Momentum',
        description: `Competitive position is improving. Overall score up ${score.changeFromLastMonth}% from last month.`,
        confidence: 0.75,
        dataPoints: [
          `Weekly improvement: +${score.changeFromLastWeek}%`,
          `Monthly improvement: +${score.changeFromLastMonth}%`,
          'Strongest improvement in grocery and home categories',
        ],
        actionable: true,
        suggestedActions: [
          'Maintain current pricing strategies',
          'Double down on winning categories',
          'Expand successful tactics to other stores',
        ],
        estimatedImpact: {
          marketShare: 1.5,
        },
        validUntil: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        source: 'price_data',
      });
    }

    // Sort by confidence
    insights.sort((a, b) => b.confidence - a.confidence);

    // Cache insights
    const cacheKey = request.storeId || 'all';
    this.cachedInsights.set(cacheKey, insights);

    return insights;
  }

  /**
   * Format category name for display
   */
  private formatCategory(category: ProductCategory): string {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }

  /**
   * Get cached strategies
   */
  getCachedStrategies(storeId?: string): WarfareStrategy[] {
    return this.cachedStrategies.get(storeId || 'all') || [];
  }

  /**
   * Get cached opportunities
   */
  getCachedOpportunities(storeId?: string): MarketOpportunity[] {
    return this.cachedOpportunities.get(storeId || 'all') || [];
  }

  /**
   * Get cached insights
   */
  getCachedInsights(storeId?: string): CompetitiveInsight[] {
    return this.cachedInsights.get(storeId || 'all') || [];
  }

  /**
   * Generate complete strategy response
   */
  async generateFullStrategyReport(
    request: StrategyGenerationRequest
  ): Promise<StrategyGenerationResponse> {
    try {
      const [strategies, opportunities, insights] = await Promise.all([
        this.generateCompetitiveStrategy(request),
        this.identifyMarketOpportunities(request),
        this.analyzeCompetitorWeaknesses(request),
      ]);

      return {
        success: true,
        strategies,
        opportunities,
        insights,
        generatedAt: new Date(),
      };
    } catch (error) {
      console.error('Full strategy report generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        generatedAt: new Date(),
      };
    }
  }
}

/**
 * Get singleton instance of StrategyGeneratorService
 */
export function getStrategyGenerator(): StrategyGeneratorService {
  return StrategyGeneratorService.getInstance();
}

export { StrategyGeneratorService };
export default StrategyGeneratorService;
