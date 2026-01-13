'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  LayoutGrid,
  Store,
  Sparkles,
  RefreshCw,
  ChevronDown,
  BarChart3,
  Target,
  Package,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  Layers,
} from 'lucide-react';
import { MARKET_396_STORES, Store as StoreType, SECTIONS, SectionKey } from '@/data/stores';
import { getVisualMerchandisingAI, AIAnalysisResult, getPlanogramAnalyzer } from '@/lib/visual';
import { Planogram, HeatmapData } from '@/lib/visual/types';
import PlanogramViewer from '@/components/visual/PlanogramViewer';
import ComplianceCard, { ComplianceCardCompact } from '@/components/visual/ComplianceCard';
import ShelfAnalysis from '@/components/visual/ShelfAnalysis';

type ViewMode = 'overview' | 'planograms' | 'compliance' | 'recommendations';

export default function VisualMerchandisingPage() {
  const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);
  const [selectedSection, setSelectedSection] = useState<SectionKey | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [selectedPlanogram, setSelectedPlanogram] = useState<Planogram | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null);
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);

  const merchandisingAI = getVisualMerchandisingAI();

  // Load initial data
  useEffect(() => {
    if (!selectedStore && MARKET_396_STORES.length > 0) {
      setSelectedStore(MARKET_396_STORES[0]);
    }
  }, [selectedStore]);

  const runAnalysis = useCallback(async () => {
    if (!selectedStore) return;

    setIsLoading(true);
    setIsAnalyzing(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const result = merchandisingAI.runFullAnalysis(selectedStore.id, selectedStore);
      setAnalysisResult(result);

      // Select first planogram if available
      if (result.planograms.length > 0 && !selectedPlanogram) {
        setSelectedPlanogram(result.planograms[0]);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsLoading(false);
      setIsAnalyzing(false);
    }
  }, [selectedStore, merchandisingAI, selectedPlanogram]);

  // Run analysis when store changes
  useEffect(() => {
    if (selectedStore) {
      runAnalysis();
    }
  }, [selectedStore, runAnalysis]);

  const handleStoreChange = (store: StoreType) => {
    setSelectedStore(store);
    setSelectedPlanogram(null);
    setShowStoreDropdown(false);
  };

  const handleSectionFilter = (sectionKey: SectionKey | null) => {
    setSelectedSection(sectionKey);
    if (sectionKey && analysisResult) {
      const sectionPlanograms = analysisResult.planograms.filter(p => p.sectionKey === sectionKey);
      if (sectionPlanograms.length > 0) {
        setSelectedPlanogram(sectionPlanograms[0]);
      }
    }
  };

  const handleToggleHeatmap = useCallback(() => {
    if (!showHeatmap && selectedPlanogram && selectedStore) {
      try {
        const planogramAnalyzer = getPlanogramAnalyzer();
        const data = planogramAnalyzer.generateHeatmap(selectedPlanogram.id, selectedStore.id);
        setHeatmapData(data);
      } catch (error) {
        console.error('Failed to generate heatmap:', error);
      }
    }
    setShowHeatmap(!showHeatmap);
  }, [showHeatmap, selectedPlanogram, selectedStore]);

  // Filter planograms by section
  const filteredPlanograms = analysisResult?.planograms.filter(
    p => !selectedSection || p.sectionKey === selectedSection
  ) || [];

  // Filter compliance by section
  const filteredCompliance = analysisResult?.compliance.sections.filter(
    s => !selectedSection || s.sectionKey === selectedSection
  ) || [];

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-walmart-blue to-walmart-blue-dark flex items-center justify-center shadow-neon-blue">
              <LayoutGrid size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-dark-text">Visual Merchandising AI</h1>
              <p className="text-dark-text-secondary">
                Planogram optimization and display analytics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Store Selector */}
            <div className="relative">
              <button
                onClick={() => setShowStoreDropdown(!showStoreDropdown)}
                className="flex items-center gap-3 px-4 py-2.5 glass-card rounded-xl border border-dark-border hover:border-walmart-blue transition-colors"
              >
                <Store size={18} className="text-walmart-blue" />
                <span className="text-dark-text font-medium">
                  {selectedStore?.name || 'Select Store'}
                </span>
                <ChevronDown size={16} className={`text-dark-text-secondary transition-transform ${showStoreDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showStoreDropdown && (
                <div className="absolute top-full mt-2 right-0 w-72 glass-card rounded-xl border border-dark-border p-2 z-50 max-h-80 overflow-y-auto">
                  {MARKET_396_STORES.map(store => (
                    <button
                      key={store.id}
                      onClick={() => handleStoreChange(store)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        selectedStore?.id === store.id
                          ? 'bg-walmart-blue/20 text-walmart-blue'
                          : 'text-dark-text hover:bg-dark-surface'
                      }`}
                    >
                      <Store size={16} />
                      <div className="text-left">
                        <p className="text-sm font-medium">{store.name}</p>
                        <p className="text-xs text-dark-text-secondary">#{store.number}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* AI Analysis Button */}
            <button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-spark-yellow to-spark-orange rounded-xl text-dark-bg font-semibold hover:shadow-neon-yellow transition-all disabled:opacity-50"
            >
              {isAnalyzing ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <Sparkles size={18} />
              )}
              <span>Run AI Analysis</span>
            </button>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: 'overview', label: 'Overview', icon: BarChart3 },
            { key: 'planograms', label: 'Planograms', icon: LayoutGrid },
            { key: 'compliance', label: 'Compliance', icon: Target },
            { key: 'recommendations', label: 'Recommendations', icon: Lightbulb },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setViewMode(key as ViewMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                viewMode === key
                  ? 'bg-walmart-blue text-white shadow-neon-blue'
                  : 'glass-light text-dark-text-secondary hover:text-dark-text'
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Section Filter */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => handleSectionFilter(null)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all whitespace-nowrap ${
              !selectedSection
                ? 'bg-walmart-blue text-white'
                : 'glass-light text-dark-text-secondary hover:text-dark-text'
            }`}
          >
            All Sections
          </button>
          {SECTIONS.map(section => (
            <button
              key={section.key}
              onClick={() => handleSectionFilter(section.key)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all whitespace-nowrap ${
                selectedSection === section.key
                  ? 'text-white'
                  : 'glass-light text-dark-text-secondary hover:text-dark-text'
              }`}
              style={{
                backgroundColor: selectedSection === section.key ? section.color : undefined,
              }}
            >
              {section.key}: {section.name}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && !analysisResult && (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw size={48} className="text-walmart-blue animate-spin mb-4" />
            <p className="text-dark-text-secondary">Analyzing store merchandising data...</p>
          </div>
        )}

        {/* Main Content */}
        {analysisResult && (
          <>
            {/* Overview View */}
            {viewMode === 'overview' && (
              <div className="space-y-6">
                {/* Store Summary Card */}
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-walmart-blue to-walmart-blue-dark flex items-center justify-center">
                        <Store size={24} className="text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-dark-text">
                          {analysisResult.compliance.storeName}
                        </h2>
                        <p className="text-sm text-dark-text-secondary">
                          Store #{selectedStore?.number} - {selectedStore?.format}
                        </p>
                      </div>
                    </div>

                    {/* Overall Score */}
                    <div className="text-right">
                      <div className="relative w-20 h-20">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="6"
                            className="text-dark-surface"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            fill="none"
                            strokeWidth="6"
                            strokeLinecap="round"
                            className="text-walmart-blue"
                            style={{
                              strokeDasharray: `${(analysisResult.compliance.overallScore / 100) * 226} 226`,
                            }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-walmart-blue">
                            {analysisResult.compliance.overallScore.toFixed(0)}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-dark-text-secondary mt-1">Overall Score</p>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <MetricCard
                      icon={<Layers size={20} />}
                      label="Planograms"
                      value={`${analysisResult.compliance.compliantPlanograms}/${analysisResult.compliance.totalPlanograms}`}
                      subValue="Compliant"
                      color="blue"
                    />
                    <MetricCard
                      icon={<Package size={20} />}
                      label="Out of Stock"
                      value={analysisResult.compliance.outOfStockItems}
                      subValue="Items"
                      color="red"
                    />
                    <MetricCard
                      icon={<AlertTriangle size={20} />}
                      label="Misplaced"
                      value={analysisResult.compliance.misplacedItems}
                      subValue="Items"
                      color="yellow"
                    />
                    <MetricCard
                      icon={<TrendingUp size={20} />}
                      label="Revenue at Risk"
                      value={`$${analysisResult.compliance.revenueAtRisk.toLocaleString()}`}
                      subValue="Estimated"
                      color="orange"
                    />
                  </div>

                  {/* AI Insights */}
                  <div className="glass-light rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={16} className="text-spark-yellow" />
                      <h3 className="font-semibold text-dark-text">AI Insights</h3>
                    </div>
                    <ul className="space-y-2">
                      {analysisResult.aiInsights.slice(0, 4).map((insight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-dark-text-secondary">
                          <span className="w-1.5 h-1.5 rounded-full bg-spark-yellow mt-2 shrink-0" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Priority Actions */}
                {analysisResult.priorityActions.length > 0 && (
                  <div className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Target size={20} className="text-spark-yellow" />
                      <h3 className="font-semibold text-dark-text">Priority Actions</h3>
                    </div>
                    <div className="space-y-3">
                      {analysisResult.priorityActions.slice(0, 5).map((action, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 glass-light rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                              action.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                              action.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                              {idx + 1}
                            </span>
                            <div>
                              <p className="text-sm font-medium text-dark-text">{action.action}</p>
                              <p className="text-xs text-dark-text-secondary capitalize">{action.effort} effort</p>
                            </div>
                          </div>
                          <span className="text-green-400 font-semibold">
                            +${action.estimatedRevenue.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section Compliance Grid */}
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <BarChart3 size={20} className="text-walmart-blue" />
                    <h3 className="font-semibold text-dark-text">Section Compliance</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCompliance.slice(0, 6).map(section => (
                      <ComplianceCard
                        key={section.sectionKey}
                        compliance={section}
                        variant="section"
                        onClick={() => {
                          handleSectionFilter(section.sectionKey);
                          setViewMode('compliance');
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Planograms View */}
            {viewMode === 'planograms' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Planogram List */}
                <div className="glass-card p-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                  <h3 className="font-semibold text-dark-text mb-4">
                    Planograms ({filteredPlanograms.length})
                  </h3>
                  <div className="space-y-2">
                    {filteredPlanograms.map(planogram => (
                      <button
                        key={planogram.id}
                        onClick={() => setSelectedPlanogram(planogram)}
                        className={`w-full p-3 rounded-xl text-left transition-all ${
                          selectedPlanogram?.id === planogram.id
                            ? 'bg-walmart-blue/20 border-walmart-blue'
                            : 'glass-light hover:bg-dark-surface'
                        } border border-transparent`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-dark-text text-sm">{planogram.name}</p>
                            <p className="text-xs text-dark-text-secondary">
                              {planogram.aisle} - Bay {planogram.bayNumber}
                            </p>
                          </div>
                          <span className={`text-sm font-bold ${
                            planogram.optimizationScore >= 90 ? 'text-green-400' :
                            planogram.optimizationScore >= 80 ? 'text-blue-400' :
                            planogram.optimizationScore >= 70 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {planogram.optimizationScore.toFixed(0)}%
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Planogram Viewer */}
                <div className="lg:col-span-2">
                  {selectedPlanogram ? (
                    <PlanogramViewer
                      planogram={selectedPlanogram}
                      heatmapData={heatmapData || undefined}
                      showHeatmap={showHeatmap}
                      onToggleHeatmap={handleToggleHeatmap}
                      onRefresh={runAnalysis}
                      isRefreshing={isAnalyzing}
                    />
                  ) : (
                    <div className="glass-card p-12 flex flex-col items-center justify-center">
                      <LayoutGrid size={48} className="text-dark-text-secondary mb-4" />
                      <p className="text-dark-text-secondary">Select a planogram to view</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Compliance View */}
            {viewMode === 'compliance' && (
              <div className="space-y-6">
                {/* Store-level Compliance Card */}
                <ComplianceCard
                  compliance={analysisResult.compliance}
                  variant="store"
                />

                {/* Section Compliance List */}
                <div className="glass-card p-6">
                  <h3 className="font-semibold text-dark-text mb-4">Section Compliance Details</h3>
                  <div className="space-y-3">
                    {filteredCompliance.map(section => (
                      <ComplianceCardCompact
                        key={section.sectionKey}
                        compliance={section}
                        onClick={() => handleSectionFilter(section.sectionKey)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations View */}
            {viewMode === 'recommendations' && (
              <ShelfAnalysis
                planograms={filteredPlanograms}
                recommendations={analysisResult.recommendations}
                endcapOpportunities={analysisResult.endcapOpportunities}
                crossCategoryOpportunities={analysisResult.crossCategoryOpportunities}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({
  icon,
  label,
  value,
  subValue,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue: string;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'orange' | 'purple';
}) {
  const colorConfig = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    red: 'bg-red-500/20 text-red-400',
    orange: 'bg-orange-500/20 text-orange-400',
    purple: 'bg-purple-500/20 text-purple-400',
  };

  return (
    <div className="glass-light p-4 rounded-xl">
      <div className={`w-10 h-10 rounded-xl ${colorConfig[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-xs text-dark-text-secondary">{label}</p>
      <p className="text-2xl font-bold text-dark-text">{value}</p>
      <p className="text-xs text-dark-text-secondary">{subValue}</p>
    </div>
  );
}
