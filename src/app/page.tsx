'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  Zap,
  Target,
  Clock,
  CheckCircle2,
  Building2,
  Users,
  MapPin,
} from 'lucide-react';
import { Header, Sidebar, SectionTabs, LocalEvents } from '@/components';
import { useAppStore } from '@/stores/appStore';
import {
  MARKET_396_STORES,
  getTotalDailyTraffic,
  SECTIONS,
} from '@/data/stores';

// Calculate market-wide metrics
function getMarketMetrics() {
  const totalDailyTraffic = getTotalDailyTraffic();
  const supercenters = MARKET_396_STORES.filter(s => s.format === 'Supercenter').length;
  const neighborhoodMarkets = MARKET_396_STORES.filter(s => s.format === 'Neighborhood Market').length;
  const aPlusTierStores = MARKET_396_STORES.filter(s => s.tier === 'A+').length;

  return {
    totalDailyTraffic,
    supercenters,
    neighborhoodMarkets,
    aPlusTierStores,
    storeCount: MARKET_396_STORES.length,
  };
}

export default function Dashboard() {
  const router = useRouter();
  const {
    selectedStore,
    activeSection,
  } = useAppStore();

  const [isReportHovered, setIsReportHovered] = useState(false);
  const metrics = getMarketMetrics();

  // Navigate to report page for selected store
  const handleGenerateReport = () => {
    if (!selectedStore) {
      // If no store selected, use first store
      router.push(`/report/${MARKET_396_STORES[0].id}`);
    } else {
      router.push(`/report/${selectedStore.id}`);
    }
  };

  // Get active section details
  const activeSectionData = activeSection
    ? SECTIONS.find((s) => s.key === activeSection)
    : null;

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <Header />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="pt-16 lg:pl-72 min-h-screen">
        {/* Mobile Section Tabs */}
        <SectionTabs />

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-dark-text">
                  {activeSectionData ? (
                    <span className="flex items-center gap-3">
                      <span
                        className="flex items-center justify-center w-10 h-10 rounded-xl text-white text-lg"
                        style={{ backgroundColor: activeSectionData.color }}
                      >
                        {activeSectionData.key}
                      </span>
                      Section {activeSectionData.key}: {activeSectionData.name}
                    </span>
                  ) : (
                    'Market 396 Dashboard'
                  )}
                </h1>
                <p className="text-dark-text-secondary mt-1">
                  {activeSectionData
                    ? activeSectionData.description
                    : 'Real-time operations overview for Las Vegas Metro stores'}
                </p>
              </div>

              {/* Generate AI Report Button */}
              <button
                onClick={handleGenerateReport}
                onMouseEnter={() => setIsReportHovered(true)}
                onMouseLeave={() => setIsReportHovered(false)}
                className="relative flex items-center gap-3 px-6 py-4 rounded-xl btn-spark overflow-hidden group"
              >
                {/* Animated Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-spark-yellow via-spark-orange to-spark-yellow bg-[length:200%_100%] transition-all duration-500 ${
                    isReportHovered ? 'animate-shimmer' : ''
                  }`}
                />

                {/* Content */}
                <div className="relative flex items-center gap-3">
                  <Sparkles
                    size={20}
                    className={`transition-transform duration-300 ${
                      isReportHovered ? 'rotate-12 scale-110' : ''
                    }`}
                  />
                  <span className="font-bold">
                    {selectedStore ? `Report for Store #${selectedStore.number}` : 'Generate AI Report'}
                  </span>
                  <ArrowRight
                    size={18}
                    className={`transition-transform duration-300 ${
                      isReportHovered ? 'translate-x-1' : ''
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Market Overview */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-dark-text">Market Overview</h2>
              <span className="text-sm text-dark-text-secondary">
                Las Vegas Metro Area
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-walmart-blue/20">
                    <Building2 size={20} className="text-walmart-blue" />
                  </div>
                  <span className="text-2xl font-bold text-dark-text">{metrics.storeCount}</span>
                </div>
                <p className="text-sm text-dark-text-secondary">Total Stores</p>
              </div>

              <div className="glass-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-500/20">
                    <Building2 size={20} className="text-green-400" />
                  </div>
                  <span className="text-2xl font-bold text-dark-text">{metrics.supercenters}</span>
                </div>
                <p className="text-sm text-dark-text-secondary">Supercenters</p>
              </div>

              <div className="glass-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/20">
                    <MapPin size={20} className="text-purple-400" />
                  </div>
                  <span className="text-2xl font-bold text-dark-text">{metrics.neighborhoodMarkets}</span>
                </div>
                <p className="text-sm text-dark-text-secondary">Neighborhood Markets</p>
              </div>

              <div className="glass-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-spark-yellow/20">
                    <Users size={20} className="text-spark-yellow" />
                  </div>
                  <span className="text-2xl font-bold text-dark-text">{metrics.totalDailyTraffic.toLocaleString()}</span>
                </div>
                <p className="text-sm text-dark-text-secondary">Avg Daily Traffic</p>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-dark-text mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => router.push('/amazon-warfare')}
                className="glass-card p-4 flex items-center gap-4 group hover:ring-1 hover:ring-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 group-hover:from-red-500/30 group-hover:to-orange-500/30 transition-colors">
                  <Zap size={24} className="text-red-400" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold text-dark-text group-hover:text-white transition-colors">
                    Amazon Warfare
                  </span>
                  <p className="text-xs text-dark-text-secondary">Competitive Analysis</p>
                </div>
              </button>

              <button className="glass-card p-4 flex items-center gap-4 group hover:ring-1 hover:ring-spark-yellow/50 transition-all">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-spark-yellow/20 group-hover:bg-spark-yellow/30 transition-colors">
                  <Target size={24} className="text-spark-yellow" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold text-dark-text group-hover:text-white transition-colors">
                    Visual Merch
                  </span>
                  <p className="text-xs text-dark-text-secondary">Store Layouts</p>
                </div>
              </button>

              <button className="glass-card p-4 flex items-center gap-4 group hover:ring-1 hover:ring-green-500/50 transition-all">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                  <CheckCircle2 size={24} className="text-green-400" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold text-dark-text group-hover:text-white transition-colors">
                    Task Manager
                  </span>
                  <p className="text-xs text-dark-text-secondary">Daily Operations</p>
                </div>
              </button>

              <button className="glass-card p-4 flex items-center gap-4 group hover:ring-1 hover:ring-purple-500/50 transition-all">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                  <Clock size={24} className="text-purple-400" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold text-dark-text group-hover:text-white transition-colors">
                    Scheduling
                  </span>
                  <p className="text-xs text-dark-text-secondary">Labor Management</p>
                </div>
              </button>
            </div>
          </section>

          {/* Local Events - Perplexity AI Powered */}
          <LocalEvents />

          {/* Section Details (when a section is selected) */}
          {activeSectionData && (
            <section className="mt-8 animate-fade-in">
              <div
                className="glass-card p-6"
                style={{
                  borderLeft: `4px solid ${activeSectionData.color}`,
                }}
              >
                <h3 className="text-xl font-bold text-dark-text mb-4">
                  Section {activeSectionData.key}: {activeSectionData.name}
                </h3>
                <p className="text-dark-text-secondary mb-4">{activeSectionData.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-dark-text-secondary mb-2">
                      Departments
                    </h4>
                    <ul className="space-y-2">
                      {activeSectionData.departments.map((dept) => (
                        <li
                          key={dept}
                          className="flex items-center gap-2 text-sm text-dark-text"
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: activeSectionData.color }}
                          />
                          {dept}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-dark-text-secondary mb-2">
                      Actions
                    </h4>
                    <div className="space-y-2">
                      <button
                        className="w-full px-4 py-2 rounded-lg text-sm font-medium text-left transition-colors"
                        style={{
                          backgroundColor: `${activeSectionData.color}20`,
                          color: activeSectionData.color,
                        }}
                      >
                        View Section Report
                      </button>
                      <button className="w-full px-4 py-2 rounded-lg text-sm font-medium text-left bg-dark-surface text-dark-text hover:bg-dark-border transition-colors">
                        Manage Tasks
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
