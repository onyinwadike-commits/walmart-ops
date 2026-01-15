'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  Zap,
  Target,
  FileText,
  ListChecks,
  TrendingUp,
  ShoppingCart,
  Activity,
  ClipboardCheck,
  AlertTriangle,
  MessageCircle,
  Share2,
  Award,
} from 'lucide-react';
import { Header, LocalEvents, Demographics } from '@/components';
import QuickActionSection, { ReportSection, SectionId } from '@/components/QuickActionSection';
import ReportEmailModal from '@/components/ReportEmailModal';
import { useAppStore } from '@/stores/appStore';
import { MARKET_396_STORES } from '@/data/stores';

// Quick Action configuration
const QUICK_ACTIONS: {
  id: SectionId;
  title: string;
  icon: typeof FileText;
  color: string;
}[] = [
  { id: 'A', title: 'Executive Summary', icon: FileText, color: '#3B82F6' },
  { id: 'B', title: 'Prioritized Action Plan', icon: ListChecks, color: '#22C55E' },
  { id: 'C', title: 'Competitive Outperform', icon: TrendingUp, color: '#A855F7' },
  { id: 'D', title: 'E-Commerce Benchmark', icon: ShoppingCart, color: '#06B6D4' },
  { id: 'E', title: 'Predictive Stress Map', icon: Activity, color: '#F97316' },
  { id: 'F', title: 'Dept Checklists', icon: ClipboardCheck, color: '#14B8A6' },
  { id: 'G', title: 'Risk Watchlist', icon: AlertTriangle, color: '#F59E0B' },
  { id: 'H', title: 'End-of-Day Scorecard', icon: Award, color: '#84CC16' },
  { id: 'I', title: 'Communication Aids', icon: MessageCircle, color: '#6366F1' },
  { id: 'J', title: 'Social Media Plan', icon: Share2, color: '#EC4899' },
];

export default function Dashboard() {
  const router = useRouter();
  const { selectedStore } = useAppStore();

  const [isReportHovered, setIsReportHovered] = useState(false);
  const [expandedSection, setExpandedSection] = useState<SectionId | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Open the report modal
  const handleGenerateReport = () => {
    setIsReportModalOpen(true);
  };

  const handleSectionToggle = (sectionId: SectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const store = selectedStore || MARKET_396_STORES[0];

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        {/* Page Content */}
        <div className="p-4 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-dark-text">
                  Store {store.number} | Market 396 Dashboard
                </h1>
                <p className="text-dark-text-secondary mt-1">
                  Real-Time Operations Insights for Store Leaders
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

          {/* Market Demographics - AI Powered */}
          <Demographics />

          {/* Quick Actions - Dynamic Expandable Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-dark-text flex items-center gap-2">
                  Quick Actions
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-walmart-blue/20 text-walmart-blue font-medium">
                    AI-Powered
                  </span>
                </h2>
                <p className="text-xs text-dark-text-secondary mt-1">
                  Click any section to expand real-time AI insights
                </p>
              </div>
              {expandedSection && (
                <button
                  onClick={() => setExpandedSection(null)}
                  className="text-xs text-dark-text-secondary hover:text-white transition-colors"
                >
                  Collapse All
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-3">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                const isExpanded = expandedSection === action.id;

                return (
                  <QuickActionSection
                    key={action.id}
                    id={action.id}
                    title={action.title}
                    icon={<Icon size={20} style={{ color: action.color }} />}
                    color={action.color}
                    isExpanded={isExpanded}
                    onToggle={() => handleSectionToggle(action.id)}
                  >
                    {isExpanded && (
                      <ReportSection sectionId={action.id} storeNumber={store.number} />
                    )}
                  </QuickActionSection>
                );
              })}
            </div>

            {/* Special Action Buttons - Navigate to full pages */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {/* Amazon Warfare */}
              <button
                onClick={() => router.push('/amazon-warfare')}
                className="glass-card p-4 flex items-center gap-4 group hover:ring-1 hover:ring-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 group-hover:from-red-500/30 group-hover:to-orange-500/30 transition-colors">
                  <Zap size={24} className="text-red-400" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold text-dark-text group-hover:text-white transition-colors block">
                    Amazon Warfare Mode
                  </span>
                  <span className="text-xs text-dark-text-secondary">
                    Real-time competitive intelligence
                  </span>
                </div>
                <ArrowRight size={20} className="text-dark-text-secondary ml-auto group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Visual Merchandising */}
              <button
                onClick={() => router.push('/visual-merchandising')}
                className="glass-card p-4 flex items-center gap-4 group hover:ring-1 hover:ring-spark-yellow/50 transition-all"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-spark-yellow/20 group-hover:bg-spark-yellow/30 transition-colors">
                  <Target size={24} className="text-spark-yellow" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold text-dark-text group-hover:text-white transition-colors block">
                    Visual Merchandising AI
                  </span>
                  <span className="text-xs text-dark-text-secondary">
                    Planogram analysis & optimization
                  </span>
                </div>
                <ArrowRight size={20} className="text-dark-text-secondary ml-auto group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </section>

          {/* Local Events - Perplexity AI Powered */}
          <LocalEvents />
        </div>
      </main>

      {/* Report Email Modal */}
      <ReportEmailModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        storeNumber={store.number}
        storeName={store.name}
      />
    </div>
  );
}
