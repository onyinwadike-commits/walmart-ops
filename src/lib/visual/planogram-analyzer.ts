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
    { name: 'Organic Bananas', brand: 'Walmart', category: 'Produce', price: 1.49, margin: 0.35 },
    { name: 'Fresh Strawberries 1lb', brand: 'Driscoll\'s', category: 'Produce', price: 4.99, margin: 0.28 },
    { name: 'Rotisserie Chicken', brand: 'Walmart Deli', category: 'Deli', price: 7.98, margin: 0.42 },
    { name: 'Artisan French Bread', brand: 'Walmart Bakery', category: 'Bakery', price: 2.98, margin: 0.55 },
    { name: 'Ground Beef 80/20 1lb', brand: 'Walmart', category: 'Meat', price: 5.48, margin: 0.22 },
    { name: 'Boneless Chicken Breast', brand: 'Great Value', category: 'Meat', price: 3.98, margin: 0.25 },
  ],
  B: [
    { name: 'Great Value Milk 1 Gallon', brand: 'Great Value', category: 'Dairy', price: 3.18, margin: 0.15 },
    { name: 'Coca-Cola 12pk Cans', brand: 'Coca-Cola', category: 'Beverages', price: 7.48, margin: 0.22 },
    { name: 'Tylenol Extra Strength', brand: 'Tylenol', category: 'HBA', price: 9.97, margin: 0.38 },
    { name: 'Crest 3D White Toothpaste', brand: 'Crest', category: 'HBA', price: 5.97, margin: 0.42 },
    { name: 'Lay\'s Classic Chips', brand: 'Lay\'s', category: 'Snacks', price: 4.28, margin: 0.32 },
    { name: 'Cheerios Family Size', brand: 'General Mills', category: 'Cereal', price: 6.98, margin: 0.28 },
  ],
  C: [
    { name: 'Bounty Paper Towels 8pk', brand: 'Bounty', category: 'Paper', price: 18.97, margin: 0.25 },
    { name: 'Tide Pods 42ct', brand: 'Tide', category: 'Laundry', price: 13.97, margin: 0.35 },
    { name: 'Purina Dog Chow 40lb', brand: 'Purina', category: 'Pet', price: 28.98, margin: 0.22 },
    { name: 'Charmin Ultra Soft 12pk', brand: 'Charmin', category: 'Paper', price: 14.97, margin: 0.28 },
    { name: 'Clorox Disinfecting Wipes', brand: 'Clorox', category: 'Cleaning', price: 6.97, margin: 0.38 },
    { name: 'Fancy Feast Cat Food 24pk', brand: 'Fancy Feast', category: 'Pet', price: 22.98, margin: 0.25 },
  ],
  D: [
    { name: 'Craftsman Tool Set 230pc', brand: 'Craftsman', category: 'Tools', price: 149.00, margin: 0.35 },
    { name: 'Pennzoil Full Synthetic 5qt', brand: 'Pennzoil', category: 'Auto', price: 28.97, margin: 0.28 },
    { name: 'Coleman Camping Tent 4P', brand: 'Coleman', category: 'Sports', price: 79.00, margin: 0.32 },
    { name: 'Ozark Trail Cooler 52qt', brand: 'Ozark Trail', category: 'Sports', price: 34.97, margin: 0.42 },
    { name: 'Rain-X Wiper Blades', brand: 'Rain-X', category: 'Auto', price: 19.97, margin: 0.38 },
    { name: 'Stanley Socket Set 40pc', brand: 'Stanley', category: 'Tools', price: 29.97, margin: 0.33 },
  ],
  E: [
    { name: 'Time and Tru Women\'s Tee', brand: 'Time and Tru', category: 'Women\'s', price: 8.98, margin: 0.55 },
    { name: 'Athletic Works Men\'s Shorts', brand: 'Athletic Works', category: 'Men\'s', price: 9.98, margin: 0.52 },
    { name: 'Wonder Nation Kids Jeans', brand: 'Wonder Nation', category: 'Kids', price: 12.98, margin: 0.48 },
    { name: 'George Men\'s Dress Shirt', brand: 'George', category: 'Men\'s', price: 14.98, margin: 0.45 },
    { name: 'No Boundaries Juniors Top', brand: 'No Boundaries', category: 'Juniors', price: 7.98, margin: 0.58 },
    { name: 'Athletic Works Sneakers', brand: 'Athletic Works', category: 'Footwear', price: 19.97, margin: 0.42 },
  ],
  F: [
    { name: 'Samsung 55" 4K Smart TV', brand: 'Samsung', category: 'TV', price: 347.99, margin: 0.12 },
    { name: 'Apple AirPods Pro 2', brand: 'Apple', category: 'Audio', price: 249.00, margin: 0.08 },
    { name: 'HP Chromebook 14"', brand: 'HP', category: 'Computing', price: 199.00, margin: 0.15 },
    { name: 'Straight Talk Phone', brand: 'Straight Talk', category: 'Wireless', price: 49.88, margin: 0.25 },
    { name: 'Nintendo Switch Console', brand: 'Nintendo', category: 'Gaming', price: 299.00, margin: 0.10 },
    { name: 'Roku Streaming Stick', brand: 'Roku', category: 'Streaming', price: 29.99, margin: 0.22 },
  ],
  G: [
    { name: 'Better Homes Garden Comforter', brand: 'Better Homes', category: 'Bedding', price: 39.97, margin: 0.45 },
    { name: 'Mainstays 3-Piece Lamp Set', brand: 'Mainstays', category: 'Lighting', price: 24.97, margin: 0.52 },
    { name: 'Mainstays 5-Shelf Bookcase', brand: 'Mainstays', category: 'Furniture', price: 39.87, margin: 0.38 },
    { name: 'Pioneer Woman Dinnerware 12pc', brand: 'Pioneer Woman', category: 'Kitchen', price: 44.97, margin: 0.42 },
    { name: 'Keurig K-Express Coffee Maker', brand: 'Keurig', category: 'Appliances', price: 59.00, margin: 0.28 },
    { name: 'Ninja Air Fryer 4qt', brand: 'Ninja', category: 'Appliances', price: 89.99, margin: 0.25 },
  ],
  H: [
    { name: 'Miracle-Gro Potting Mix 2cf', brand: 'Miracle-Gro', category: 'Garden', price: 12.97, margin: 0.35 },
    { name: 'Ozark Trail 10x10 Canopy', brand: 'Ozark Trail', category: 'Outdoor', price: 64.00, margin: 0.38 },
    { name: 'Holiday Living Christmas Tree 7ft', brand: 'Holiday Living', category: 'Holiday', price: 99.00, margin: 0.45 },
    { name: 'Char-Broil Gas Grill', brand: 'Char-Broil', category: 'Outdoor', price: 179.00, margin: 0.28 },
    { name: 'Sun Joe Electric Mower', brand: 'Sun Joe', category: 'Lawn', price: 199.00, margin: 0.22 },
    { name: 'Kingsford Charcoal 20lb', brand: 'Kingsford', category: 'Outdoor', price: 14.98, margin: 0.32 },
  ],
  I: [
    { name: 'LEGO Star Wars Set', brand: 'LEGO', category: 'Toys', price: 49.99, margin: 0.25 },
    { name: 'Barbie Dream House', brand: 'Barbie', category: 'Toys', price: 199.00, margin: 0.28 },
    { name: 'Hot Wheels 20-Pack', brand: 'Hot Wheels', category: 'Toys', price: 21.97, margin: 0.32 },
    { name: 'Bestseller Hardcover Novel', brand: 'Various', category: 'Books', price: 14.99, margin: 0.42 },
    { name: 'Marvel Blu-ray Collection', brand: 'Disney', category: 'Movies', price: 24.96, margin: 0.35 },
    { name: 'Board Game Classic Monopoly', brand: 'Hasbro', category: 'Games', price: 19.82, margin: 0.38 },
  ],
  J: [
    { name: 'Money Order', brand: 'Walmart', category: 'Money Services', price: 1.00, margin: 0.90 },
    { name: 'Walmart Gift Card', brand: 'Walmart', category: 'Gift Cards', price: 50.00, margin: 0.02 },
    { name: 'Prepaid Phone Card', brand: 'Various', category: 'Wireless', price: 35.00, margin: 0.15 },
    { name: 'Photo Prints 4x6 100ct', brand: 'Walmart Photo', category: 'Photo', price: 19.00, margin: 0.55 },
    { name: 'Custom Photo Book', brand: 'Walmart Photo', category: 'Photo', price: 29.96, margin: 0.48 },
    { name: 'Bill Pay Service', brand: 'Walmart', category: 'Money Services', price: 4.00, margin: 0.85 },
  ],
  K: [
    { name: 'OGP Substitution Item', brand: 'Various', category: 'OGP', price: 0, margin: 0 },
    { name: 'Ship from Store Package', brand: 'Various', category: 'SFS', price: 0, margin: 0 },
    { name: 'Curbside Pickup Item', brand: 'Various', category: 'OGP', price: 0, margin: 0 },
    { name: 'Express Delivery Item', brand: 'Various', category: 'Delivery', price: 0, margin: 0 },
    { name: 'InHome Delivery Item', brand: 'Various', category: 'InHome', price: 0, margin: 0 },
    { name: 'Returns Processing', brand: 'Walmart', category: 'Returns', price: 0, margin: 0 },
  ],
  L: [
    { name: 'Customer Survey Kiosk', brand: 'Walmart', category: 'Feedback', price: 0, margin: 0 },
    { name: 'Digital Rating Terminal', brand: 'Walmart', category: 'Ratings', price: 0, margin: 0 },
    { name: 'NPS Collection Point', brand: 'Walmart', category: 'Surveys', price: 0, margin: 0 },
    { name: 'Voice of Customer Display', brand: 'Walmart', category: 'Feedback', price: 0, margin: 0 },
    { name: 'Associate Feedback Station', brand: 'Walmart', category: 'Ratings', price: 0, margin: 0 },
    { name: 'Experience Rating Pad', brand: 'Walmart', category: 'Surveys', price: 0, margin: 0 },
  ],
  M: [
    { name: 'AI Camera Module', brand: 'Walmart Tech', category: 'Visual Merch', price: 0, margin: 0 },
    { name: 'Planogram Scanner', brand: 'Walmart Tech', category: 'Planogram', price: 0, margin: 0 },
    { name: 'Shelf Compliance Sensor', brand: 'Walmart Tech', category: 'Display Analysis', price: 0, margin: 0 },
    { name: 'Inventory Vision System', brand: 'Walmart Tech', category: 'Visual Merch', price: 0, margin: 0 },
    { name: 'Display Analytics Hub', brand: 'Walmart Tech', category: 'Planogram', price: 0, margin: 0 },
    { name: 'Smart Shelf Monitor', brand: 'Walmart Tech', category: 'Display Analysis', price: 0, margin: 0 },
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
