// Phase 2: Report Generation API Route
// POST /api/report/[storeId] - Generate AI report for a store

import { NextRequest, NextResponse } from 'next/server';
import { generateFullStoreReport, StoreReport, CacheEntry } from '@/lib/llm';
import { getStoreById, SectionKey } from '@/data/stores';

// In-memory cache with 5-minute TTL
const reportCache = new Map<string, CacheEntry<StoreReport>>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Clean expired cache entries
 */
function cleanCache(): void {
  const now = Date.now();
  const entries = Array.from(reportCache.entries());
  for (const [key, entry] of entries) {
    if (now - entry.timestamp > entry.ttlMs) {
      reportCache.delete(key);
    }
  }
}

/**
 * Get cached report if valid
 */
function getCachedReport(cacheKey: string): StoreReport | null {
  const entry = reportCache.get(cacheKey);
  if (!entry) return null;

  const now = Date.now();
  if (now - entry.timestamp > entry.ttlMs) {
    reportCache.delete(cacheKey);
    return null;
  }

  return entry.data;
}

/**
 * Cache a report
 */
function cacheReport(cacheKey: string, report: StoreReport): void {
  reportCache.set(cacheKey, {
    data: report,
    timestamp: Date.now(),
    ttlMs: CACHE_TTL_MS,
  });
}

/**
 * POST /api/report/[storeId]
 * Generate or retrieve cached AI report for a store
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;

    // Validate store exists
    const store = getStoreById(storeId);
    if (!store) {
      return NextResponse.json(
        { success: false, error: `Store not found: ${storeId}` },
        { status: 404 }
      );
    }

    // Parse request body
    let body: { sections?: SectionKey[]; forceRefresh?: boolean } = {};
    try {
      body = await request.json();
    } catch {
      // Empty body is fine, use defaults
    }

    const { sections, forceRefresh = false } = body;

    // Generate cache key
    const sectionKey = sections?.sort().join(',') || 'all';
    const cacheKey = `${storeId}-${sectionKey}`;

    // Clean expired entries periodically
    cleanCache();

    // Check cache unless force refresh
    if (!forceRefresh) {
      const cachedReport = getCachedReport(cacheKey);
      if (cachedReport) {
        return NextResponse.json({
          success: true,
          report: {
            ...cachedReport,
            cacheHit: true,
          },
          cached: true,
        });
      }
    }

    // Generate new report
    console.log(`[Report API] Generating report for store ${storeId}...`);
    const startTime = Date.now();

    const report = await generateFullStoreReport(storeId, {
      sections,
      forceRefresh,
    });

    const duration = Date.now() - startTime;
    console.log(`[Report API] Report generated in ${duration}ms`);

    // Cache the report
    cacheReport(cacheKey, report);

    return NextResponse.json({
      success: true,
      report,
      cached: false,
    });
  } catch (error) {
    console.error('[Report API] Error generating report:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/report/[storeId]
 * Get cached report or status
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;

    // Validate store exists
    const store = getStoreById(storeId);
    if (!store) {
      return NextResponse.json(
        { success: false, error: `Store not found: ${storeId}` },
        { status: 404 }
      );
    }

    // Check for cached report
    const cacheKey = `${storeId}-all`;
    const cachedReport = getCachedReport(cacheKey);

    if (cachedReport) {
      return NextResponse.json({
        success: true,
        report: {
          ...cachedReport,
          cacheHit: true,
        },
        cached: true,
      });
    }

    // No cached report
    return NextResponse.json({
      success: true,
      report: null,
      cached: false,
      message: 'No cached report available. Use POST to generate a new report.',
    });
  } catch (error) {
    console.error('[Report API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/report/[storeId]
 * Clear cached report for a store
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;

    // Clear all cache entries for this store
    const keys = Array.from(reportCache.keys());
    for (const key of keys) {
      if (key.startsWith(storeId)) {
        reportCache.delete(key);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Cache cleared for store ${storeId}`,
    });
  } catch (error) {
    console.error('[Report API] Error clearing cache:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
