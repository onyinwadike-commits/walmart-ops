'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Swords,
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  Target,
  Sparkles,
  TrendingUp,
  BarChart3,
  Building2,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { Header } from '@/components';
import {
  PriceComparisonCard,
  PriceAlertList,
  StrategyCard,
  MarketOpportunityCard,
  CompetitorDashboard,
  WarfareModeToggle,
} from '@/components/amazon';
import {
  getPriceTracker,
  getStrategyGenerator,
  PriceComparison,
  PriceAlert,
  WarfareStrategy,
  MarketOpportunity,
  CompetitorData,
  CompetitiveScore,
  WarfareModeSettings,
  ProductCategory,
} from '@/lib/amazon';
import { MARKET_396_STORES, Store } from '@/data/stores';

type ViewMode = 'overview' | 'comparisons' | 'alerts' | 'strategies' | 'opportunities';

const viewModeConfig = {
  overview: { label: 'Overview', icon: BarChart3 },
  comparisons: { label: 'Price Comparisons', icon: TrendingUp },
  alerts: { label: 'Alerts', icon: AlertTriangle },
  strategies: { label: 'Strategies', icon: Sparkles },
  opportunities: { label: 'Opportunities', icon: Target },
};

const categories: ProductCategory[] = [
  'electronics', 'grocery', 'home', 'apparel', 'toys',
  'health', 'automotive', 'sports', 'garden', 'office',
];

export default function AmazonWarfarePage() {
  const router = useRouter();

  // State
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Data state
  const [comparisons, setComparisons] = useState<PriceComparison[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [strategies, setStrategies] = useState<WarfareStrategy[]>([]);
  const [opportunities, setOpportunities] = useState<MarketOpportunity[]>([]);
  const [competitorData, setCompetitorData] = useState<CompetitorData | null>(null);
  const [competitiveScore, setCompetitiveScore] = useState<CompetitiveScore | null>(null);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGeneratingStrategies, setIsGeneratingStrategies] = useState(false);

  // Warfare mode settings
  const [warfareSettings, setWarfareSettings] = useState<WarfareModeSettings>({
    enabled: true,
    aggressiveness: 'moderate',
    autoAlerts: true,
    alertThreshold: 10,
    focusCategories: [],
    excludedCategories: [],
    priceMatchEnabled: true,
    maxPriceMatchDiscount: 10,
    monitoredStores: [],
    refreshInterval: 15,
  });

  // Load data
  const loadData = useCallback(async () => {
    const priceTracker = getPriceTracker();
    const strategyGenerator = getStrategyGenerator();

    try {
      // Get comparisons
      const comparisonOptions: { category?: ProductCategory; storeId?: string } = {};
      if (selectedCategory) comparisonOptions.category = selectedCategory;
      if (selectedStore) comparisonOptions.storeId = selectedStore.id;

      const priceComparisons = priceTracker.comparePrices(comparisonOptions);
      setComparisons(priceComparisons);

      // Get alerts
      const priceAlerts = priceTracker.generatePriceAlerts({
        threshold: warfareSettings.alertThreshold,
        category: selectedCategory || undefined,
      });
      setAlerts(priceAlerts);

      // Get competitive data and score
      const compData = priceTracker.getCompetitorData(selectedStore?.id);
      const compScore = priceTracker.calculateCompetitiveScore(selectedStore?.id);
      setCompetitorData(compData);
      setCompetitiveScore(compScore);

      // Get cached strategies and opportunities
      const cachedStrategies = strategyGenerator.getCachedStrategies(selectedStore?.id);
      const cachedOpportunities = strategyGenerator.getCachedOpportunities(selectedStore?.id);

      if (cachedStrategies.length > 0) {
        setStrategies(cachedStrategies);
      }
      if (cachedOpportunities.length > 0) {
        setOpportunities(cachedOpportunities);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }, [selectedStore, selectedCategory, warfareSettings.alertThreshold]);

  // Initial load
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await loadData();
      setIsLoading(false);
    };
    init();
  }, [loadData]);

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  // Generate strategies
  const handleGenerateStrategies = async () => {
    setIsGeneratingStrategies(true);
    const strategyGenerator = getStrategyGenerator();

    try {
      const response = await strategyGenerator.generateFullStrategyReport({
        storeId: selectedStore?.id,
        store: selectedStore || undefined,
        focusAreas: selectedCategory ? [selectedCategory] : undefined,
      });

      if (response.success) {
        if (response.strategies) setStrategies(response.strategies);
        if (response.opportunities) setOpportunities(response.opportunities);
      }
    } catch (error) {
      console.error('Strategy generation failed:', error);
    }

    setIsGeneratingStrategies(false);
  };

  // Handle alert acknowledgment
  const handleAcknowledgeAlert = (alertId: string) => {
    const priceTracker = getPriceTracker();
    priceTracker.acknowledgeAlert(alertId);
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a)));
  };

  // Handle warfare mode toggle
  const handleWarfareToggle = (enabled: boolean) => {
    setWarfareSettings((prev) => ({ ...prev, enabled }));
  };

  // Handle settings change
  const handleSettingsChange = (updates: Partial<WarfareModeSettings>) => {
    setWarfareSettings((prev) => ({ ...prev, ...updates }));
  };

  // Active alerts count
  const activeAlertsCount = alerts.filter((a) => !a.acknowledged).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center animate-pulse">
            <Swords size={32} className="text-white" />
          </div>
          <p className="text-dark-text-secondary">Loading Amazon Warfare...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />

      <main className="pt-16 min-h-screen">
        <div className="p-4 lg:p-8 max-w-[1800px] mx-auto">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="p-2 rounded-xl bg-dark-surface border border-dark-border text-dark-text-secondary hover:text-dark-text hover:bg-dark-border transition-colors"
              >
                <ArrowLeft size={20} />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                  <Swords size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-dark-text">
                    Amazon Warfare
                  </h1>
                  <p className="text-sm text-dark-text-secondary">
                    Competitive intelligence and market strategy
                  </p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Store Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowStoreDropdown(!showStoreDropdown)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-surface border border-dark-border text-dark-text hover:bg-dark-border transition-colors"
                >
                  <Building2 size={16} />
                  <span className="text-sm">
                    {selectedStore ? `Store #${selectedStore.number}` : 'All Stores'}
                  </span>
                  <ChevronDown size={16} />
                </button>

                {showStoreDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-56 rounded-xl bg-dark-surface border border-dark-border shadow-xl z-50 overflow-hidden">
                    <button
                      onClick={() => {
                        setSelectedStore(null);
                        setShowStoreDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-dark-border transition-colors ${
                        !selectedStore ? 'bg-walmart-blue/20 text-walmart-blue' : 'text-dark-text'
                      }`}
                    >
                      All Stores
                    </button>
                    {MARKET_396_STORES.map((store) => (
                      <button
                        key={store.id}
                        onClick={() => {
                          setSelectedStore(store);
                          setShowStoreDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-dark-border transition-colors ${
                          selectedStore?.id === store.id
                            ? 'bg-walmart-blue/20 text-walmart-blue'
                            : 'text-dark-text'
                        }`}
                      >
                        #{store.number} - {store.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Category Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-surface border border-dark-border text-dark-text hover:bg-dark-border transition-colors"
                >
                  <Filter size={16} />
                  <span className="text-sm capitalize">
                    {selectedCategory || 'All Categories'}
                  </span>
                  <ChevronDown size={16} />
                </button>

                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-48 rounded-xl bg-dark-surface border border-dark-border shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto">
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-dark-border transition-colors ${
                        !selectedCategory ? 'bg-walmart-blue/20 text-walmart-blue' : 'text-dark-text'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowCategoryDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm capitalize hover:bg-dark-border transition-colors ${
                          selectedCategory === category
                            ? 'bg-walmart-blue/20 text-walmart-blue'
                            : 'text-dark-text'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-surface border border-dark-border text-dark-text hover:bg-dark-border transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                <span className="text-sm">Refresh</span>
              </button>
            </div>
          </div>

          {/* Warfare Mode Toggle */}
          <div className="mb-8">
            <WarfareModeToggle
              settings={warfareSettings}
              onToggle={handleWarfareToggle}
              onSettingsChange={handleSettingsChange}
            />
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            {(Object.keys(viewModeConfig) as ViewMode[]).map((mode) => {
              const config = viewModeConfig[mode];
              const Icon = config.icon;
              const isActive = viewMode === mode;

              // Add badge for alerts
              const showBadge = mode === 'alerts' && activeAlertsCount > 0;

              return (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-spark-yellow border border-spark-yellow/30'
                      : 'bg-dark-surface border border-dark-border text-dark-text-secondary hover:text-dark-text hover:bg-dark-border'
                  }`}
                >
                  <Icon size={16} />
                  {config.label}
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {activeAlertsCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Content Based on View Mode */}
          {viewMode === 'overview' && competitorData && competitiveScore && (
            <div className="space-y-6">
              <CompetitorDashboard
                competitorData={competitorData}
                competitiveScore={competitiveScore}
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
              />

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Alerts Preview */}
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-dark-text flex items-center gap-2">
                      <AlertTriangle size={20} className="text-red-400" />
                      Recent Alerts
                    </h3>
                    <button
                      onClick={() => setViewMode('alerts')}
                      className="text-sm text-walmart-blue hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  {alerts.slice(0, 3).length > 0 ? (
                    <PriceAlertList
                      alerts={alerts.slice(0, 3)}
                      onAcknowledge={handleAcknowledgeAlert}
                      maxDisplay={3}
                    />
                  ) : (
                    <p className="text-dark-text-secondary text-center py-8">
                      No active alerts
                    </p>
                  )}
                </div>

                {/* Generate Strategies CTA */}
                <div className="glass-card p-6">
                  <div className="text-center py-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-spark-yellow to-spark-orange flex items-center justify-center">
                      <Sparkles size={32} className="text-dark-bg" />
                    </div>
                    <h3 className="text-lg font-semibold text-dark-text mb-2">
                      AI-Powered Strategies
                    </h3>
                    <p className="text-dark-text-secondary mb-4">
                      Generate competitive strategies tailored to your market position
                    </p>
                    <button
                      onClick={handleGenerateStrategies}
                      disabled={isGeneratingStrategies}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-spark-yellow to-spark-orange text-dark-bg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {isGeneratingStrategies ? (
                        <>
                          <RefreshCw size={18} className="animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles size={18} />
                          Generate Strategies
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'comparisons' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-dark-text">
                  Price Comparisons ({comparisons.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {comparisons.map((comparison) => (
                  <PriceComparisonCard key={comparison.id} comparison={comparison} />
                ))}
              </div>
            </div>
          )}

          {viewMode === 'alerts' && (
            <PriceAlertList
              alerts={alerts}
              onAcknowledge={handleAcknowledgeAlert}
              maxDisplay={20}
            />
          )}

          {viewMode === 'strategies' && (
            <div className="space-y-6">
              {/* Generate Button */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-dark-text">
                  Competitive Strategies ({strategies.length})
                </h2>
                <button
                  onClick={handleGenerateStrategies}
                  disabled={isGeneratingStrategies}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-spark-yellow to-spark-orange text-dark-bg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isGeneratingStrategies ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Generate New
                    </>
                  )}
                </button>
              </div>

              {strategies.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {strategies.map((strategy) => (
                    <StrategyCard key={strategy.id} strategy={strategy} />
                  ))}
                </div>
              ) : (
                <div className="glass-card p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-spark-yellow/20 flex items-center justify-center">
                    <Sparkles size={32} className="text-spark-yellow" />
                  </div>
                  <h3 className="text-lg font-semibold text-dark-text mb-2">
                    No Strategies Generated Yet
                  </h3>
                  <p className="text-dark-text-secondary mb-4">
                    Click the button above to generate AI-powered competitive strategies
                  </p>
                </div>
              )}
            </div>
          )}

          {viewMode === 'opportunities' && (
            <div className="space-y-6">
              {/* Generate Button */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-dark-text">
                  Market Opportunities ({opportunities.length})
                </h2>
                <button
                  onClick={handleGenerateStrategies}
                  disabled={isGeneratingStrategies}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-spark-yellow to-spark-orange text-dark-bg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isGeneratingStrategies ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Target size={16} />
                      Scan for Opportunities
                    </>
                  )}
                </button>
              </div>

              {opportunities.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {opportunities.map((opportunity) => (
                    <MarketOpportunityCard key={opportunity.id} opportunity={opportunity} />
                  ))}
                </div>
              ) : (
                <div className="glass-card p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-spark-yellow/20 flex items-center justify-center">
                    <Target size={32} className="text-spark-yellow" />
                  </div>
                  <h3 className="text-lg font-semibold text-dark-text mb-2">
                    No Opportunities Identified Yet
                  </h3>
                  <p className="text-dark-text-secondary mb-4">
                    Click the button above to scan for market opportunities
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Click outside to close dropdowns */}
      {(showStoreDropdown || showCategoryDropdown) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowStoreDropdown(false);
            setShowCategoryDropdown(false);
          }}
        />
      )}
    </div>
  );
}
