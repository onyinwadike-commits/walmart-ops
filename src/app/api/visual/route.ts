// Phase 4: Visual Merchandising AI Module - API Route
// Walmart Store Operations Orchestrator
// API endpoint for visual merchandising analysis

import { NextRequest, NextResponse } from 'next/server';
import { getVisualMerchandisingAI, getPlanogramAnalyzer } from '@/lib/visual';
import { getStoreById, MARKET_396_STORES } from '@/data/stores';
import type { SectionKey } from '@/data/stores';
import type {
  PlanogramAnalysisRequest,
  AIRecommendationRequest,
} from '@/lib/visual/types';

// GET: Retrieve visual merchandising data
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');
  const storeId = searchParams.get('storeId');
  const sectionKey = searchParams.get('sectionKey') as SectionKey | null;
  const planogramId = searchParams.get('planogramId');

  try {
    const merchandisingAI = getVisualMerchandisingAI();
    const planogramAnalyzer = getPlanogramAnalyzer();

    switch (action) {
      case 'compliance': {
        // Get store compliance summary
        if (!storeId) {
          return NextResponse.json(
            { error: 'storeId is required' },
            { status: 400 }
          );
        }

        const store = getStoreById(storeId);
        const compliance = merchandisingAI.getStoreCompliance(storeId, store);

        return NextResponse.json({
          success: true,
          data: compliance,
          timestamp: new Date().toISOString(),
        });
      }

      case 'planograms': {
        // Get planograms for a store/section
        if (!storeId) {
          return NextResponse.json(
            { error: 'storeId is required' },
            { status: 400 }
          );
        }

        const planograms = planogramAnalyzer.getPlanograms(storeId, sectionKey || undefined);

        return NextResponse.json({
          success: true,
          data: planograms,
          count: planograms.length,
          timestamp: new Date().toISOString(),
        });
      }

      case 'heatmap': {
        // Get heatmap data for a planogram
        if (!storeId || !planogramId) {
          return NextResponse.json(
            { error: 'storeId and planogramId are required' },
            { status: 400 }
          );
        }

        const type = searchParams.get('type') as 'foot_traffic' | 'attention' | 'dwell_time' | 'conversion' || 'attention';
        const heatmap = planogramAnalyzer.generateHeatmap(planogramId, storeId, type);

        return NextResponse.json({
          success: true,
          data: heatmap,
          timestamp: new Date().toISOString(),
        });
      }

      case 'traffic-pattern': {
        // Get traffic pattern for a section
        if (!storeId || !sectionKey) {
          return NextResponse.json(
            { error: 'storeId and sectionKey are required' },
            { status: 400 }
          );
        }

        const trafficPattern = merchandisingAI.getTrafficPattern(storeId, sectionKey);

        return NextResponse.json({
          success: true,
          data: trafficPattern,
          timestamp: new Date().toISOString(),
        });
      }

      case 'display-effectiveness': {
        // Get display effectiveness metrics
        if (!storeId || !planogramId) {
          return NextResponse.json(
            { error: 'storeId and planogramId are required' },
            { status: 400 }
          );
        }

        const effectiveness = merchandisingAI.getDisplayEffectiveness(storeId, planogramId);

        return NextResponse.json({
          success: true,
          data: effectiveness,
          timestamp: new Date().toISOString(),
        });
      }

      case 'stores': {
        // Get available stores
        return NextResponse.json({
          success: true,
          data: MARKET_396_STORES,
          count: MARKET_396_STORES.length,
          timestamp: new Date().toISOString(),
        });
      }

      default: {
        return NextResponse.json(
          {
            error: 'Invalid action',
            validActions: [
              'compliance',
              'planograms',
              'heatmap',
              'traffic-pattern',
              'display-effectiveness',
              'stores',
            ],
          },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.error('Visual API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// POST: Run AI analysis and generate recommendations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, storeId, sectionKey, planogramId, type } = body;

    const merchandisingAI = getVisualMerchandisingAI();
    const planogramAnalyzer = getPlanogramAnalyzer();

    switch (action) {
      case 'analyze': {
        // Run planogram analysis
        if (!storeId) {
          return NextResponse.json(
            { error: 'storeId is required' },
            { status: 400 }
          );
        }

        const analysisRequest: PlanogramAnalysisRequest = {
          storeId,
          sectionKey: sectionKey || undefined,
          planogramId: planogramId || undefined,
          includeHeatmap: body.includeHeatmap ?? true,
          includeRecommendations: body.includeRecommendations ?? true,
        };

        const result = merchandisingAI.analyzePlanograms(analysisRequest);

        return NextResponse.json({
          success: result.success,
          data: result,
          timestamp: new Date().toISOString(),
        });
      }

      case 'recommendations': {
        // Generate AI recommendations
        if (!storeId) {
          return NextResponse.json(
            { error: 'storeId is required' },
            { status: 400 }
          );
        }

        const store = getStoreById(storeId);
        const recommendationRequest: AIRecommendationRequest = {
          storeId,
          sectionKey: sectionKey || undefined,
          planogramId: planogramId || undefined,
          type: type || 'all',
          store,
        };

        const result = merchandisingAI.generateRecommendations(recommendationRequest);

        return NextResponse.json({
          success: result.success,
          data: result,
          timestamp: new Date().toISOString(),
        });
      }

      case 'full-analysis': {
        // Run full AI analysis
        if (!storeId) {
          return NextResponse.json(
            { error: 'storeId is required' },
            { status: 400 }
          );
        }

        const store = getStoreById(storeId);
        const result = merchandisingAI.runFullAnalysis(storeId, store);

        return NextResponse.json({
          success: result.success,
          data: result,
          timestamp: new Date().toISOString(),
        });
      }

      case 'shelf-analysis': {
        // Analyze shelf effectiveness
        if (!planogramId || !storeId) {
          return NextResponse.json(
            { error: 'storeId and planogramId are required' },
            { status: 400 }
          );
        }

        const planograms = planogramAnalyzer.getPlanograms(storeId);
        const planogram = planograms.find(p => p.id === planogramId);

        if (!planogram) {
          return NextResponse.json(
            { error: 'Planogram not found' },
            { status: 404 }
          );
        }

        const analysis = planogramAnalyzer.analyzeShelfEffectiveness(planogram);
        const optimizations = planogramAnalyzer.suggestOptimizations(planogram);

        return NextResponse.json({
          success: true,
          data: {
            planogram,
            analysis,
            optimizations,
          },
          timestamp: new Date().toISOString(),
        });
      }

      default: {
        return NextResponse.json(
          {
            error: 'Invalid action',
            validActions: [
              'analyze',
              'recommendations',
              'full-analysis',
              'shelf-analysis',
            ],
          },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.error('Visual API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
