// Phase 3: Amazon Warfare Module - Price Tracking Service
// Walmart Store Operations Orchestrator
// Tracks and compares prices between Walmart and Amazon

import {
  AmazonProduct,
  WalmartProduct,
  ProductMatch,
  PriceComparison,
  PriceAlert,
  CompetitorData,
  CompetitiveScore,
  ProductCategory,
  PriceStatus,
  AlertSeverity,
} from './types';

// Mock Product Catalog - Simulates real product data
const MOCK_WALMART_PRODUCTS: WalmartProduct[] = [
  {
    upc: '012345678901',
    sku: 'WM-TV-001',
    title: 'Samsung 55" 4K UHD Smart TV',
    category: 'electronics',
    price: 447.99,
    rollbackPrice: 399.99,
    rating: 4.6,
    reviewCount: 2847,
    inStockOnline: true,
    inStockStores: ['1560', '1584', '2050', '2593'],
    deliveryDays: 2,
    pickupAvailable: true,
    lastUpdated: new Date(),
    section: 'F',
  },
  {
    upc: '012345678902',
    sku: 'WM-TV-002',
    title: 'LG 65" OLED 4K Smart TV',
    category: 'electronics',
    price: 1299.99,
    rating: 4.8,
    reviewCount: 1523,
    inStockOnline: true,
    inStockStores: ['1560', '2593', '5101'],
    deliveryDays: 3,
    pickupAvailable: true,
    lastUpdated: new Date(),
    section: 'F',
  },
  {
    upc: '012345678903',
    sku: 'WM-AUDIO-001',
    title: 'Apple AirPods Pro (2nd Gen)',
    category: 'electronics',
    price: 199.99,
    walmartPlusPrice: 189.99,
    rating: 4.7,
    reviewCount: 5621,
    inStockOnline: true,
    inStockStores: ['1560', '1584', '2050', '2593', '2838', '4356', '4557', '5070', '5101'],
    deliveryDays: 1,
    pickupAvailable: true,
    lastUpdated: new Date(),
    section: 'F',
  },
  {
    upc: '012345678904',
    sku: 'WM-GAME-001',
    title: 'PlayStation 5 Console',
    category: 'electronics',
    price: 499.99,
    rating: 4.9,
    reviewCount: 8934,
    inStockOnline: false,
    inStockStores: ['2593', '5101'],
    deliveryDays: 5,
    pickupAvailable: true,
    lastUpdated: new Date(),
    section: 'F',
  },
  {
    upc: '012345678905',
    sku: 'WM-HOME-001',
    title: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
    category: 'home',
    price: 79.99,
    rollbackPrice: 59.99,
    rating: 4.7,
    reviewCount: 12456,
    inStockOnline: true,
    inStockStores: ['1560', '1584', '2050', '2593', '2838', '4356', '4557', '5070', '5101'],
    deliveryDays: 2,
    pickupAvailable: true,
    lastUpdated: new Date(),
    section: 'G',
  },
  {
    upc: '012345678906',
    sku: 'WM-HOME-002',
    title: 'Dyson V15 Detect Cordless Vacuum',
    category: 'home',
    price: 649.99,
    rating: 4.6,
    reviewCount: 3421,
    inStockOnline: true,
    inStockStores: ['1560', '2593', '4356', '5101'],
    deliveryDays: 3,
    pickupAvailable: true,
    lastUpdated: new Date(),
    section: 'G',
  },
  {
    upc: '012345678907',
    sku: 'WM-TOY-001',
    title: 'LEGO Star Wars Millennium Falcon',
    category: 'toys',
    price: 169.99,
    rollbackPrice: 139.99,
    rating: 4.9,
    reviewCount: 2134,
    inStockOnline: true,
    inStockStores: ['1560', '1584', '2593', '4356', '5101'],
    deliveryDays: 2,
    pickupAvailable: true,
    lastUpdated: new Date(),
    section: 'I',
  },
  {
    upc: '012345678908',
    sku: 'WM-HEALTH-001',
    title: 'Fitbit Charge 5 Advanced Fitness Tracker',
    category: 'health',
    price: 129.99,
    walmartPlusPrice: 119.99,
    rating: 4.4,
    reviewCount: 4567,
    inStockOnline: true,
    inStockStores: ['1560', '1584', '2050', '2593', '2838', '4356', '4557', '5070', '5101'],
    deliveryDays: 1,
    pickupAvailable: true,
    lastUpdated: new Date(),
    section: 'F',
  },
  {
    upc: '012345678909',
    sku: 'WM-GROCERY-001',
    title: 'Great Value Organic Extra Virgin Olive Oil 32oz',
    category: 'grocery',
    price: 9.97,
    rating: 4.5,
    reviewCount: 8923,
    inStockOnline: true,
    inStockStores: ['1560', '1584', '2050', '2593', '2838', '4356', '4557', '5070', '5101'],
    deliveryDays: 1,
    pickupAvailable: true,
    lastUpdated: new Date(),
    section: 'B',
  },
  {
    upc: '012345678910',
    sku: 'WM-AUTO-001',
    title: 'Michelin Defender T+H All Season Tire',
    category: 'automotive',
    price: 159.99,
    rollbackPrice: 139.99,
    rating: 4.7,
    reviewCount: 3421,
    inStockOnline: true,
    inStockStores: ['1560', '1584', '2050', '2593', '4557'],
    deliveryDays: 3,
    pickupAvailable: true,
    lastUpdated: new Date(),
    section: 'D',
  },
  {
    upc: '012345678911',
    sku: 'WM-SPORT-001',
    title: 'Spalding NBA Official Game Basketball',
    category: 'sports',
    price: 29.99,
    rating: 4.6,
    reviewCount: 1876,
    inStockOnline: true,
    inStockStores: ['1560', '1584', '2050', '2593', '2838', '4356', '4557', '5070', '5101'],
    deliveryDays: 2,
    pickupAvailable: true,
    lastUpdated: new Date(),
    section: 'D',
  },
  {
    upc: '012345678912',
    sku: 'WM-GARDEN-001',
    title: 'Scotts Turf Builder Lawn Food 15000 sq ft',
    category: 'garden',
    price: 49.97,
    rollbackPrice: 39.97,
    rating: 4.5,
    reviewCount: 5678,
    inStockOnline: true,
    inStockStores: ['1560', '1584', '2050', '2593', '2838', '4356', '4557', '5070', '5101'],
    deliveryDays: 2,
    pickupAvailable: true,
    lastUpdated: new Date(),
    section: 'H',
  },
  {
    upc: '012345678913',
    sku: 'WM-APPAREL-001',
    title: "Levi's Men's 501 Original Fit Jeans",
    category: 'apparel',
    price: 59.50,
    rollbackPrice: 49.50,
    rating: 4.4,
    reviewCount: 7823,
    inStockOnline: true,
    inStockStores: ['1560', '1584', '2050', '2593', '2838', '4356', '4557', '5070', '5101'],
    deliveryDays: 2,
    pickupAvailable: true,
    lastUpdated: new Date(),
    section: 'E',
  },
  {
    upc: '012345678914',
    sku: 'WM-OFFICE-001',
    title: 'HP OfficeJet Pro 9015e Wireless Printer',
    category: 'office',
    price: 229.99,
    walmartPlusPrice: 209.99,
    rating: 4.3,
    reviewCount: 2345,
    inStockOnline: true,
    inStockStores: ['1560', '1584', '2593', '4356', '5101'],
    deliveryDays: 2,
    pickupAvailable: true,
    lastUpdated: new Date(),
    section: 'F',
  },
  {
    upc: '012345678915',
    sku: 'WM-ELEC-005',
    title: 'Nintendo Switch OLED Model',
    category: 'electronics',
    price: 349.99,
    rating: 4.8,
    reviewCount: 6234,
    inStockOnline: true,
    inStockStores: ['1560', '1584', '2593', '4356', '5101'],
    deliveryDays: 2,
    pickupAvailable: true,
    lastUpdated: new Date(),
    section: 'F',
  },
];

const MOCK_AMAZON_PRODUCTS: AmazonProduct[] = [
  {
    asin: 'B0BVXN9CK6',
    title: 'Samsung 55" 4K UHD Smart TV',
    category: 'electronics',
    price: 429.99,
    primePrice: 419.99,
    rating: 4.5,
    reviewCount: 3421,
    isPrime: true,
    deliveryDays: 1,
    seller: 'Amazon.com',
    lastUpdated: new Date(),
  },
  {
    asin: 'B0BVXN9CK7',
    title: 'LG 65" OLED 4K Smart TV',
    category: 'electronics',
    price: 1249.99,
    primePrice: 1199.99,
    rating: 4.7,
    reviewCount: 1856,
    isPrime: true,
    deliveryDays: 2,
    seller: 'Amazon.com',
    lastUpdated: new Date(),
  },
  {
    asin: 'B0D1XD1ZV3',
    title: 'Apple AirPods Pro (2nd Gen)',
    category: 'electronics',
    price: 189.99,
    primePrice: 179.99,
    rating: 4.7,
    reviewCount: 12456,
    isPrime: true,
    deliveryDays: 1,
    seller: 'Amazon.com',
    lastUpdated: new Date(),
  },
  {
    asin: 'B0BCNKKZ91',
    title: 'PlayStation 5 Console',
    category: 'electronics',
    price: 499.99,
    rating: 4.8,
    reviewCount: 15678,
    isPrime: true,
    deliveryDays: 2,
    seller: 'Amazon.com',
    lastUpdated: new Date(),
  },
  {
    asin: 'B00FLYWNYQ',
    title: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
    category: 'home',
    price: 89.95,
    primePrice: 79.95,
    rating: 4.7,
    reviewCount: 167890,
    isPrime: true,
    deliveryDays: 1,
    seller: 'Amazon.com',
    lastUpdated: new Date(),
  },
  {
    asin: 'B0BJ8G3QCF',
    title: 'Dyson V15 Detect Cordless Vacuum',
    category: 'home',
    price: 699.99,
    primePrice: 649.99,
    rating: 4.6,
    reviewCount: 4567,
    isPrime: true,
    deliveryDays: 2,
    seller: 'Amazon.com',
    lastUpdated: new Date(),
  },
  {
    asin: 'B09C1KN7FL',
    title: 'LEGO Star Wars Millennium Falcon',
    category: 'toys',
    price: 159.99,
    primePrice: 149.99,
    rating: 4.9,
    reviewCount: 3456,
    isPrime: true,
    deliveryDays: 1,
    seller: 'Amazon.com',
    lastUpdated: new Date(),
  },
  {
    asin: 'B09BYP7TN4',
    title: 'Fitbit Charge 5 Advanced Fitness Tracker',
    category: 'health',
    price: 119.95,
    primePrice: 99.95,
    rating: 4.3,
    reviewCount: 8765,
    isPrime: true,
    deliveryDays: 1,
    seller: 'Amazon.com',
    lastUpdated: new Date(),
  },
  {
    asin: 'B0C5TF6KQF',
    title: 'Amazon Organic Extra Virgin Olive Oil 32oz',
    category: 'grocery',
    price: 12.99,
    primePrice: 11.99,
    rating: 4.4,
    reviewCount: 5678,
    isPrime: true,
    deliveryDays: 1,
    seller: 'Amazon.com',
    lastUpdated: new Date(),
  },
  {
    asin: 'B07H28Q6GS',
    title: 'Michelin Defender T+H All Season Tire',
    category: 'automotive',
    price: 169.99,
    rating: 4.6,
    reviewCount: 2345,
    isPrime: false,
    deliveryDays: 5,
    seller: 'TireRack',
    lastUpdated: new Date(),
  },
  {
    asin: 'B07YTH6PH4',
    title: 'Spalding NBA Official Game Basketball',
    category: 'sports',
    price: 34.99,
    primePrice: 29.99,
    rating: 4.5,
    reviewCount: 2134,
    isPrime: true,
    deliveryDays: 1,
    seller: 'Amazon.com',
    lastUpdated: new Date(),
  },
  {
    asin: 'B00GMOQ3LG',
    title: 'Scotts Turf Builder Lawn Food 15000 sq ft',
    category: 'garden',
    price: 54.97,
    primePrice: 49.97,
    rating: 4.6,
    reviewCount: 7890,
    isPrime: true,
    deliveryDays: 2,
    seller: 'Amazon.com',
    lastUpdated: new Date(),
  },
  {
    asin: 'B01N6E7QZW',
    title: "Levi's Men's 501 Original Fit Jeans",
    category: 'apparel',
    price: 69.50,
    primePrice: 59.50,
    rating: 4.4,
    reviewCount: 12345,
    isPrime: true,
    deliveryDays: 2,
    seller: 'Amazon.com',
    lastUpdated: new Date(),
  },
  {
    asin: 'B09V3J7JQK',
    title: 'HP OfficeJet Pro 9015e Wireless Printer',
    category: 'office',
    price: 249.99,
    primePrice: 229.99,
    rating: 4.2,
    reviewCount: 3456,
    isPrime: true,
    deliveryDays: 1,
    seller: 'Amazon.com',
    lastUpdated: new Date(),
  },
  {
    asin: 'B0BFJWCYTL',
    title: 'Nintendo Switch OLED Model',
    category: 'electronics',
    price: 349.00,
    rating: 4.8,
    reviewCount: 9876,
    isPrime: true,
    deliveryDays: 1,
    seller: 'Amazon.com',
    lastUpdated: new Date(),
  },
];

/**
 * Price Tracking Service - Singleton class for competitive price analysis
 */
class PriceTrackerService {
  private static instance: PriceTrackerService | null = null;
  private productMatches: ProductMatch[] = [];
  private priceComparisons: PriceComparison[] = [];
  private alerts: PriceAlert[] = [];

  private constructor() {
    this.initializeMatches();
    this.initializeComparisons();
  }

  public static getInstance(): PriceTrackerService {
    if (!PriceTrackerService.instance) {
      PriceTrackerService.instance = new PriceTrackerService();
    }
    return PriceTrackerService.instance;
  }

  /**
   * Initialize product matches between Walmart and Amazon catalogs
   */
  private initializeMatches(): void {
    MOCK_WALMART_PRODUCTS.forEach((walmartProduct, index) => {
      const amazonProduct = MOCK_AMAZON_PRODUCTS[index];
      if (amazonProduct) {
        this.productMatches.push({
          id: `match-${index}`,
          walmartProduct,
          amazonProduct,
          matchConfidence: 0.95 + Math.random() * 0.05,
          matchedOn: ['title', 'upc'],
        });
      }
    });
  }

  /**
   * Initialize price comparisons from matches
   */
  private initializeComparisons(): void {
    this.productMatches.forEach((match, index) => {
      const walmartPrice = match.walmartProduct.rollbackPrice || match.walmartProduct.price;
      const amazonPrice = match.amazonProduct.primePrice || match.amazonProduct.price;
      const priceDiff = walmartPrice - amazonPrice;
      const priceDiffPercent = (priceDiff / amazonPrice) * 100;

      let status: PriceStatus = 'competitive';
      if (priceDiffPercent < -5) status = 'winning';
      else if (priceDiffPercent > 5) status = 'losing';

      const walmartAdvantages: string[] = [];
      const amazonAdvantages: string[] = [];

      // Determine advantages
      if (match.walmartProduct.pickupAvailable) {
        walmartAdvantages.push('Same-day pickup available');
      }
      if (match.walmartProduct.inStockStores.length > 5) {
        walmartAdvantages.push('Wide store availability');
      }
      if (match.walmartProduct.walmartPlusPrice) {
        walmartAdvantages.push('Walmart+ member pricing');
      }
      if (walmartPrice < amazonPrice) {
        walmartAdvantages.push('Lower base price');
      }

      if (match.amazonProduct.isPrime) {
        amazonAdvantages.push('Prime free shipping');
      }
      if (match.amazonProduct.deliveryDays < match.walmartProduct.deliveryDays) {
        amazonAdvantages.push('Faster delivery');
      }
      if (match.amazonProduct.reviewCount > match.walmartProduct.reviewCount) {
        amazonAdvantages.push('More customer reviews');
      }
      if (amazonPrice < walmartPrice) {
        amazonAdvantages.push('Lower price');
      }

      this.priceComparisons.push({
        id: `comparison-${index}`,
        match,
        walmartPrice,
        amazonPrice,
        priceDifference: priceDiff,
        priceDifferencePercent: priceDiffPercent,
        status,
        walmartAdvantages,
        amazonAdvantages,
        recommendation: this.generateRecommendation(status, priceDiffPercent, match),
        potentialRevenueImpact: this.calculateRevenueImpact(match, priceDiff),
        lastCompared: new Date(),
      });
    });
  }

  /**
   * Generate recommendation based on price comparison
   */
  private generateRecommendation(
    status: PriceStatus,
    priceDiffPercent: number,
    match: ProductMatch
  ): string {
    if (status === 'winning') {
      return `Walmart is ${Math.abs(priceDiffPercent).toFixed(1)}% cheaper. Highlight price advantage in marketing and signage.`;
    } else if (status === 'losing') {
      if (match.walmartProduct.pickupAvailable) {
        return `Consider emphasizing same-day pickup to offset ${Math.abs(priceDiffPercent).toFixed(1)}% price gap.`;
      }
      return `Price gap of ${Math.abs(priceDiffPercent).toFixed(1)}%. Consider price match or promotional pricing.`;
    }
    return 'Prices are competitive. Focus on service differentiation and convenience.';
  }

  /**
   * Calculate potential revenue impact
   */
  private calculateRevenueImpact(match: ProductMatch, priceDiff: number): number {
    // Estimate based on review count as proxy for sales volume
    const estimatedMonthlySales = Math.floor(match.walmartProduct.reviewCount / 10);
    return Math.abs(priceDiff * estimatedMonthlySales);
  }

  /**
   * Get all price comparisons
   */
  getAllComparisons(): PriceComparison[] {
    return this.priceComparisons;
  }

  /**
   * Get comparisons filtered by category
   */
  getComparisonsByCategory(category: ProductCategory): PriceComparison[] {
    return this.priceComparisons.filter(
      (c) => c.match.walmartProduct.category === category
    );
  }

  /**
   * Get comparisons filtered by status
   */
  getComparisonsByStatus(status: PriceStatus): PriceComparison[] {
    return this.priceComparisons.filter((c) => c.status === status);
  }

  /**
   * Compare prices between Walmart and Amazon for all matched products
   */
  comparePrices(options?: {
    category?: ProductCategory;
    storeId?: string;
    limit?: number;
  }): PriceComparison[] {
    let comparisons = [...this.priceComparisons];

    if (options?.category) {
      comparisons = comparisons.filter(
        (c) => c.match.walmartProduct.category === options.category
      );
    }

    if (options?.storeId) {
      comparisons = comparisons.filter((c) =>
        c.match.walmartProduct.inStockStores.includes(options.storeId!)
      );
    }

    if (options?.limit) {
      comparisons = comparisons.slice(0, options.limit);
    }

    return comparisons;
  }

  /**
   * Find price gaps where Walmart can win
   */
  findPriceGaps(options?: {
    minGapPercent?: number;
    category?: ProductCategory;
  }): PriceComparison[] {
    const minGap = options?.minGapPercent || 5;

    return this.priceComparisons.filter((c) => {
      const meetsGapThreshold = c.priceDifferencePercent > minGap;
      const meetsCategory = !options?.category || c.match.walmartProduct.category === options.category;
      return meetsGapThreshold && meetsCategory;
    }).sort((a, b) => b.priceDifferencePercent - a.priceDifferencePercent);
  }

  /**
   * Generate price alerts for significant price changes
   */
  generatePriceAlerts(options?: {
    threshold?: number;
    category?: ProductCategory;
  }): PriceAlert[] {
    const threshold = options?.threshold || 10;
    const alerts: PriceAlert[] = [];

    this.priceComparisons.forEach((comparison, index) => {
      if (options?.category && comparison.match.walmartProduct.category !== options.category) {
        return;
      }

      // Simulate price changes for demo
      const priceChangeSimulation = (Math.random() - 0.5) * 30;

      if (Math.abs(priceChangeSimulation) >= threshold) {
        let alertType: PriceAlert['alertType'];
        let severity: AlertSeverity;
        let title: string;
        let description: string;
        let suggestedAction: string;

        if (priceChangeSimulation < -threshold) {
          // Amazon dropped price
          alertType = 'amazon_price_drop';
          severity = Math.abs(priceChangeSimulation) > 20 ? 'critical' : 'high';
          title = `Amazon Price Drop: ${comparison.match.walmartProduct.title.substring(0, 40)}...`;
          description = `Amazon has reduced price by ${Math.abs(priceChangeSimulation).toFixed(1)}%. Immediate action recommended.`;
          suggestedAction = 'Consider price match or promotional response';
        } else if (priceChangeSimulation > threshold && comparison.status === 'losing') {
          // Opportunity - Amazon raised price while we're losing
          alertType = 'walmart_opportunity';
          severity = 'medium';
          title = `Competitive Opportunity: ${comparison.match.walmartProduct.title.substring(0, 40)}...`;
          description = `Amazon price increased. Current gap reduced to ${comparison.priceDifferencePercent.toFixed(1)}%.`;
          suggestedAction = 'Maintain current pricing to capture market share';
        } else if (comparison.status === 'losing' && comparison.priceDifferencePercent > 15) {
          // Competitive threat
          alertType = 'competitive_threat';
          severity = 'high';
          title = `Competitive Threat: ${comparison.match.walmartProduct.title.substring(0, 40)}...`;
          description = `Price gap of ${comparison.priceDifferencePercent.toFixed(1)}% may impact sales.`;
          suggestedAction = 'Review pricing strategy for this product';
        } else {
          return; // Skip this comparison
        }

        alerts.push({
          id: `alert-${index}-${Date.now()}`,
          productMatch: comparison.match,
          alertType,
          severity,
          title,
          description,
          previousPrice: comparison.amazonPrice,
          currentPrice: comparison.amazonPrice * (1 + priceChangeSimulation / 100),
          changePercent: priceChangeSimulation,
          suggestedAction,
          potentialImpact: comparison.potentialRevenueImpact,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          acknowledged: false,
          storeIds: comparison.match.walmartProduct.inStockStores,
        });
      }
    });

    // Sort by severity
    const severityOrder: Record<AlertSeverity, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
    };

    this.alerts = alerts.sort(
      (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
    );

    return this.alerts;
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): PriceAlert[] {
    return this.alerts.filter(
      (a) => !a.acknowledged && (!a.expiresAt || a.expiresAt > new Date())
    );
  }

  /**
   * Acknowledge an alert
   */
  acknowledgeAlert(alertId: string): void {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
    }
  }

  /**
   * Calculate overall competitive score
   */
  calculateCompetitiveScore(storeId?: string): CompetitiveScore {
    let comparisons = this.priceComparisons;

    if (storeId) {
      comparisons = comparisons.filter((c) =>
        c.match.walmartProduct.inStockStores.includes(storeId)
      );
    }

    const totalProducts = comparisons.length;
    const winningProducts = comparisons.filter((c) => c.status === 'winning').length;
    const competitiveProducts = comparisons.filter((c) => c.status === 'competitive').length;

    // Calculate price competitiveness (0-100)
    const priceCompetitiveness = Math.round(
      ((winningProducts + competitiveProducts * 0.5) / totalProducts) * 100
    );

    // Calculate service advantage (based on pickup availability and stock)
    const avgStockAvailability = comparisons.reduce(
      (sum, c) => sum + c.match.walmartProduct.inStockStores.length,
      0
    ) / totalProducts;
    const serviceAdvantage = Math.min(100, Math.round(avgStockAvailability * 11));

    // Calculate delivery speed advantage
    const fasterDelivery = comparisons.filter(
      (c) => c.match.walmartProduct.deliveryDays <= c.match.amazonProduct.deliveryDays
    ).length;
    const deliverySpeed = Math.round((fasterDelivery / totalProducts) * 100);

    // Stock availability
    const inStockProducts = comparisons.filter(
      (c) => c.match.walmartProduct.inStockOnline || c.match.walmartProduct.inStockStores.length > 0
    ).length;
    const stockAvailability = Math.round((inStockProducts / totalProducts) * 100);

    // Customer experience (based on ratings)
    const avgRating = comparisons.reduce(
      (sum, c) => sum + c.match.walmartProduct.rating,
      0
    ) / totalProducts;
    const customerExperience = Math.round((avgRating / 5) * 100);

    // Overall score
    const overall = Math.round(
      priceCompetitiveness * 0.35 +
      serviceAdvantage * 0.2 +
      deliverySpeed * 0.15 +
      stockAvailability * 0.15 +
      customerExperience * 0.15
    );

    // Category breakdown
    const categories: ProductCategory[] = [
      'electronics', 'grocery', 'home', 'apparel', 'toys',
      'health', 'automotive', 'sports', 'garden', 'office'
    ];

    const breakdown = categories
      .map((category) => {
        const categoryComparisons = comparisons.filter(
          (c) => c.match.walmartProduct.category === category
        );
        if (categoryComparisons.length === 0) return null;

        const catWinning = categoryComparisons.filter((c) => c.status === 'winning').length;
        const catCompetitive = categoryComparisons.filter((c) => c.status === 'competitive').length;
        const catScore = Math.round(
          ((catWinning + catCompetitive * 0.5) / categoryComparisons.length) * 100
        );

        return {
          category,
          score: catScore,
          trend: catScore > 60 ? 'up' as const : catScore > 40 ? 'stable' as const : 'down' as const,
        };
      })
      .filter((b): b is NonNullable<typeof b> => b !== null);

    return {
      overall,
      priceCompetitiveness,
      serviceAdvantage,
      stockAvailability,
      deliverySpeed,
      customerExperience,
      trendDirection: overall > 70 ? 'improving' : overall > 50 ? 'stable' : 'declining',
      changeFromLastWeek: Math.round((Math.random() - 0.3) * 10),
      changeFromLastMonth: Math.round((Math.random() - 0.2) * 15),
      benchmarks: {
        marketAverage: 62,
        topPerformer: 89,
        bottomPerformer: 41,
      },
      breakdown,
    };
  }

  /**
   * Get aggregated competitor data
   */
  getCompetitorData(storeId?: string): CompetitorData {
    let comparisons = this.priceComparisons;

    if (storeId) {
      comparisons = comparisons.filter((c) =>
        c.match.walmartProduct.inStockStores.includes(storeId)
      );
    }

    const totalProducts = comparisons.length;
    const winningCount = comparisons.filter((c) => c.status === 'winning').length;
    const losingCount = comparisons.filter((c) => c.status === 'losing').length;
    const competitiveCount = comparisons.filter((c) => c.status === 'competitive').length;

    const avgDifference = comparisons.reduce(
      (sum, c) => sum + c.priceDifferencePercent,
      0
    ) / totalProducts;

    // Category breakdown
    const categories: ProductCategory[] = [
      'electronics', 'grocery', 'home', 'apparel', 'toys',
      'health', 'automotive', 'sports', 'garden', 'office'
    ];

    const categoryBreakdown: CompetitorData['categoryBreakdown'] = {} as CompetitorData['categoryBreakdown'];

    categories.forEach((category) => {
      const catComparisons = comparisons.filter(
        (c) => c.match.walmartProduct.category === category
      );
      if (catComparisons.length > 0) {
        categoryBreakdown[category] = {
          total: catComparisons.length,
          winning: catComparisons.filter((c) => c.status === 'winning').length,
          losing: catComparisons.filter((c) => c.status === 'losing').length,
          avgDifference: catComparisons.reduce((sum, c) => sum + c.priceDifferencePercent, 0) / catComparisons.length,
        };
      }
    });

    // Generate mock trend data for last 30 days
    const trendData: CompetitorData['trendData'] = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      trendData.push({
        date,
        winRate: (winningCount / totalProducts) * 100 + (Math.random() - 0.5) * 10,
        avgDifference: avgDifference + (Math.random() - 0.5) * 5,
      });
    }

    return {
      totalProductsTracked: totalProducts,
      winningCount,
      losingCount,
      competitiveCount,
      averagePriceDifference: avgDifference,
      categoryBreakdown,
      trendData,
      lastUpdated: new Date(),
    };
  }

  /**
   * Get products for a specific store
   */
  getStoreProducts(storeId: string): WalmartProduct[] {
    return MOCK_WALMART_PRODUCTS.filter((p) => p.inStockStores.includes(storeId));
  }

  /**
   * Get all Walmart products
   */
  getAllWalmartProducts(): WalmartProduct[] {
    return MOCK_WALMART_PRODUCTS;
  }

  /**
   * Get all Amazon products
   */
  getAllAmazonProducts(): AmazonProduct[] {
    return MOCK_AMAZON_PRODUCTS;
  }
}

/**
 * Get singleton instance of PriceTrackerService
 */
export function getPriceTracker(): PriceTrackerService {
  return PriceTrackerService.getInstance();
}

export { PriceTrackerService };
export default PriceTrackerService;
