'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Brain,
  Cpu,
  Zap,
} from 'lucide-react';
import { Header, Sidebar } from '@/components';
import { ReportCard } from '@/components/report';
import { StoreReport, ReportGenerationStatus } from '@/lib/llm/types';
import { getStoreById, Store } from '@/data/stores';

interface ReportPageProps {
  params: Promise<{ storeId: string }>;
}

// Loading skeleton component
function ReportSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="glass-card p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-dark-surface" />
          <div className="flex-1">
            <div className="h-8 w-64 bg-dark-surface rounded mb-2" />
            <div className="h-4 w-48 bg-dark-surface rounded mb-2" />
            <div className="h-4 w-32 bg-dark-surface rounded" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-dark-surface rounded-xl" />
          ))}
        </div>
      </div>

      {/* Summary skeleton */}
      <div className="glass-card p-6">
        <div className="h-6 w-48 bg-dark-surface rounded mb-4" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-dark-surface rounded" />
          <div className="h-4 w-5/6 bg-dark-surface rounded" />
          <div className="h-4 w-4/6 bg-dark-surface rounded" />
        </div>
      </div>

      {/* Sections skeleton */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-dark-surface" />
            <div className="flex-1">
              <div className="h-6 w-48 bg-dark-surface rounded mb-2" />
              <div className="h-4 w-32 bg-dark-surface rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Generation progress component
function GenerationProgress({ status }: { status: ReportGenerationStatus }) {
  const stages = [
    { key: 'analyzing', label: 'Analyzing Store Data', icon: Brain },
    { key: 'generating', label: 'Generating Insights', icon: Sparkles },
    { key: 'processing', label: 'Processing with AI Agents', icon: Cpu },
    { key: 'finalizing', label: 'Finalizing Report', icon: Zap },
  ];

  const currentStageIndex = Math.floor((status.progress / 100) * stages.length);

  return (
    <div className="glass-card p-8">
      <div className="max-w-xl mx-auto text-center">
        {/* Animated Icon */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-walmart-blue to-spark-yellow opacity-20 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-walmart-blue to-spark-yellow opacity-30 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles size={40} className="text-spark-yellow animate-bounce" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-dark-text mb-2">
          Generating AI Report
        </h2>
        <p className="text-dark-text-secondary mb-6">
          {status.currentSection
            ? `Analyzing Section ${status.currentSection}...`
            : 'Initializing multi-agent analysis...'}
        </p>

        {/* Progress Bar */}
        <div className="relative h-2 bg-dark-surface rounded-full overflow-hidden mb-4">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-walmart-blue to-spark-yellow transition-all duration-500 rounded-full"
            style={{ width: `${Math.min(status.progress, 100)}%` }}
          />
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-walmart-blue to-spark-yellow opacity-50 animate-pulse rounded-full"
            style={{ width: `${Math.min(status.progress + 5, 100)}%` }}
          />
        </div>

        <p className="text-lg font-bold text-spark-yellow mb-8">
          {Math.round(status.progress)}% Complete
        </p>

        {/* Stage Indicators */}
        <div className="grid grid-cols-4 gap-4">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isActive = index === currentStageIndex;
            const isComplete = index < currentStageIndex;

            return (
              <div
                key={stage.key}
                className={`flex flex-col items-center gap-2 transition-all duration-300 ${
                  isActive
                    ? 'opacity-100 scale-105'
                    : isComplete
                    ? 'opacity-60'
                    : 'opacity-30'
                }`}
              >
                <div
                  className={`p-3 rounded-xl ${
                    isActive
                      ? 'bg-spark-yellow/20 text-spark-yellow'
                      : isComplete
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-dark-surface text-dark-text-secondary'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'animate-pulse' : ''} />
                </div>
                <span className="text-xs text-center text-dark-text-secondary">
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Agent Activity Indicator */}
        {status.currentAgent && (
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-dark-text-secondary">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>Active Agent: {status.currentAgent}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReportPage({ params }: ReportPageProps) {
  const router = useRouter();
  const { storeId } = use(params);

  const [store, setStore] = useState<Store | null>(null);
  const [report, setReport] = useState<StoreReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] = useState<ReportGenerationStatus>({
    storeId: storeId,
    status: 'queued',
    progress: 0,
  });

  // Get store data
  useEffect(() => {
    const storeData = getStoreById(storeId);
    if (!storeData) {
      setError(`Store not found: ${storeId}`);
      setIsLoading(false);
      return;
    }
    setStore(storeData);
  }, [storeId]);

  // Check for cached report on mount
  useEffect(() => {
    if (!store) return;

    const checkCachedReport = async () => {
      try {
        const response = await fetch(`/api/report/${storeId}`);
        const data = await response.json();

        if (data.success && data.report) {
          setReport(data.report);
          setIsLoading(false);
        } else {
          // No cached report, generate one
          generateReport();
        }
      } catch {
        // Error checking cache, generate new report
        generateReport();
      }
    };

    checkCachedReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store, storeId]);

  // Generate report
  const generateReport = async (forceRefresh = false) => {
    if (!store) return;

    setIsGenerating(true);
    setError(null);
    setGenerationStatus({
      storeId: storeId,
      status: 'generating',
      progress: 0,
      startedAt: new Date(),
    });

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setGenerationStatus((prev) => {
        if (prev.progress >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        const increment = Math.random() * 15 + 5;
        const newProgress = Math.min(prev.progress + increment, 95);
        const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
        const currentSection = sections[Math.floor((newProgress / 100) * sections.length)];
        const agents = ['perplexity', 'grok', 'gemini', 'claude', 'chatgpt', 'deepseek'];
        const currentAgent = agents[Math.floor(Math.random() * agents.length)];

        return {
          ...prev,
          progress: newProgress,
          currentSection: currentSection as ReportGenerationStatus['currentSection'],
          currentAgent: currentAgent as ReportGenerationStatus['currentAgent'],
        };
      });
    }, 800);

    try {
      const response = await fetch(`/api/report/${storeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ forceRefresh }),
      });

      clearInterval(progressInterval);

      const data = await response.json();

      if (data.success) {
        setReport(data.report);
        setGenerationStatus({
          storeId: storeId,
          status: 'completed',
          progress: 100,
          completedAt: new Date(),
        });
      } else {
        throw new Error(data.error || 'Failed to generate report');
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setGenerationStatus({
        storeId: storeId,
        status: 'failed',
        progress: 0,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setReport(null);
    generateReport(true);
  };

  // Error state
  if (error && !store) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Header />
        <Sidebar />
        <main className="pt-16 lg:pl-72 min-h-screen">
          <div className="p-4 lg:p-8">
            <div className="glass-card p-8 text-center">
              <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
              <h2 className="text-xl font-bold text-dark-text mb-2">
                Store Not Found
              </h2>
              <p className="text-dark-text-secondary mb-6">{error}</p>
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-walmart-blue text-white hover:bg-walmart-blue-dark transition-colors"
              >
                <ArrowLeft size={18} />
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />
      <Sidebar />

      <main className="pt-16 lg:pl-72 min-h-screen">
        <div className="p-4 lg:p-8">
          {/* Page Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.push('/')}
              className="p-2 rounded-xl bg-dark-surface border border-dark-border text-dark-text-secondary hover:text-dark-text hover:bg-dark-border transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-dark-text">
                AI Operations Report
              </h1>
              {store && (
                <p className="text-dark-text-secondary">
                  Store #{store.number} - {store.name}
                </p>
              )}
            </div>
          </div>

          {/* Content */}
          {isLoading || isGenerating ? (
            isGenerating ? (
              <GenerationProgress status={generationStatus} />
            ) : (
              <ReportSkeleton />
            )
          ) : error ? (
            <div className="glass-card p-8 text-center">
              <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
              <h2 className="text-xl font-bold text-dark-text mb-2">
                Error Generating Report
              </h2>
              <p className="text-dark-text-secondary mb-6">{error}</p>
              <button
                onClick={() => generateReport(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-walmart-blue text-white hover:bg-walmart-blue-dark transition-colors"
              >
                <RefreshCw size={18} />
                Try Again
              </button>
            </div>
          ) : report && store ? (
            <ReportCard
              report={report}
              store={store}
              onRefresh={handleRefresh}
              isRefreshing={isGenerating}
            />
          ) : null}
        </div>
      </main>
    </div>
  );
}
