// Phase 3: Amazon Warfare API Endpoint
// Walmart Store Operations Orchestrator
// Handles competitive data fetching and strategy generation

import { NextRequest, NextResponse } from 'next/server';
import { getPriceTracker, getStrategyGenerator } from '@/lib/amazon';
import { getStoreById } from '@/data/stores';
import {
  CompetitiveDataResponse,
  StrategyGenerationRequest,
  StrategyGenerationResponse,
  ProductCategory,
} from '@/lib/amazon/types';

/**
 * GET /api/amazon
 * Fetches competitive data including price comparisons, alerts, and scores
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const storeId = searchParams.get('storeId') || undefined;
    const categoriesParam = searchParams.get('categories');
    const includeAlerts = searchParams.get('includeAlerts') !== 'false';
    const includeStrategies = searchParams.get('includeStrategies') === 'true';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    // Parse categories if provided
    const categories: ProductCategory[] | undefined = categoriesParam
      ? (categoriesParam.split(',') as ProductCategory[])
      : undefined;

    const priceTracker = getPriceTracker();
    const strategyGenerator = getStrategyGenerator();

    // Get price comparisons
    const comparisons = priceTracker.comparePrices({
      storeId,
      category: categories?.[0],
      limit,
    });

    // Get alerts if requested
    const alerts = includeAlerts
      ? priceTracker.generatePriceAlerts({
          category: categories?.[0],
        })
      : [];

    // Get competitive score
    const competitiveScore = priceTracker.calculateCompetitiveScore(storeId);

    // Get competitor data
    const competitorData = priceTracker.getCompetitorData(storeId);

    // Get cached insights if strategies requested
    const insights = includeStrategies
      ? strategyGenerator.getCachedInsights(storeId)
      : [];

    const response: CompetitiveDataResponse = {
      success: true,
      data: {
        comparisons,
        alerts,
        insights,
        competitiveScore,
        competitorData,
      },
      timestamp: new Date(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Amazon API GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      } as CompetitiveDataResponse,
      { status: 500 }
    );
  }
}

/**
 * POST /api/amazon
 * Generates new competitive strategies and identifies market opportunities
 */
export async function POST(request: NextRequest) {
  try {
    const body: StrategyGenerationRequest = await request.json();

    const { storeId, focusAreas, budgetConstraint, timeHorizon } = body;

    // Get store if storeId provided
    const store = storeId ? getStoreById(storeId) : undefined;

    const strategyGenerator = getStrategyGenerator();

    // Generate full strategy report
    const response = await strategyGenerator.generateFullStrategyReport({
      storeId,
      store: store || undefined,
      focusAreas,
      budgetConstraint,
      timeHorizon,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Amazon API POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        generatedAt: new Date(),
      } as StrategyGenerationResponse,
      { status: 500 }
    );
  }
}

/**
 * PUT /api/amazon
 * Updates warfare settings or acknowledges alerts
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, alertId } = body;

    if (action === 'acknowledge_alert' && alertId) {
      const priceTracker = getPriceTracker();
      priceTracker.acknowledgeAlert(alertId);

      return NextResponse.json({
        success: true,
        message: `Alert ${alertId} acknowledged`,
        timestamp: new Date(),
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid action',
        timestamp: new Date(),
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Amazon API PUT error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      },
      { status: 500 }
    );
  }
}
