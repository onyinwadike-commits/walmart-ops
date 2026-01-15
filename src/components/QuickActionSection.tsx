'use client';

import { useState, useEffect, ReactNode } from 'react';
import {
  Loader2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Sparkles,
  X,
  Clock,
  Cpu,
} from 'lucide-react';

export type SectionId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';

interface QuickActionSectionProps {
  id: SectionId;
  title: string;
  icon: ReactNode;
  color: string;
  isExpanded: boolean;
  onToggle: () => void;
  children?: ReactNode;
}

interface SectionReportData {
  title: string;
  content: string;
  sections: {
    heading: string;
    content: string;
    items?: string[];
    metrics?: { label: string; value: string; trend?: 'up' | 'down' | 'stable' }[];
  }[];
  llmUsed: string[];
  generatedAt: string;
  confidence: number;
}

interface ReportSectionProps {
  sectionId: SectionId;
  storeNumber: number;
}

export function ReportSection({ sectionId, storeNumber }: ReportSectionProps) {
  const [data, setData] = useState<SectionReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReport = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await fetch(`/api/quick-actions/${sectionId}?store=${storeNumber}`, {
        method: forceRefresh ? 'POST' : 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load report');
      console.error('Error fetching report:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId, storeNumber]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="relative">
          <div className="absolute inset-0 bg-walmart-blue/20 rounded-full blur-xl animate-pulse" />
          <Loader2 size={48} className="text-walmart-blue animate-spin relative" />
        </div>
        <p className="text-dark-text-secondary mt-4 text-sm">Generating AI Report...</p>
        <p className="text-dark-text-secondary/60 text-xs mt-1">Processing real-time data</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-red-400 mb-4">
          <X size={48} />
        </div>
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => fetchReport()}
          className="flex items-center gap-2 px-4 py-2 bg-walmart-blue rounded-lg text-white hover:bg-walmart-blue/80 transition-colors"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="flex items-center justify-between border-b border-dark-border pb-4">
        <div>
          <h3 className="text-lg font-bold text-dark-text">{data.title}</h3>
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-dark-text-secondary">
              <Clock size={12} />
              Generated: {new Date(data.generatedAt).toLocaleString()}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-dark-text-secondary">
              <Cpu size={12} />
              AI: {data.llmUsed.join(', ')}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
              {Math.round(data.confidence * 100)}% Confidence
            </span>
          </div>
        </div>
        <button
          onClick={() => fetchReport(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-dark-surface hover:bg-dark-border transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Report Content */}
      <div className="prose prose-invert max-w-none">
        <p className="text-dark-text-secondary">{data.content}</p>
      </div>

      {/* Report Sections */}
      <div className="grid gap-4">
        {data.sections.map((section, index) => (
          <div
            key={index}
            className="glass-light rounded-xl p-4 hover:ring-1 hover:ring-walmart-blue/30 transition-all"
          >
            <h4 className="font-semibold text-dark-text mb-3">{section.heading}</h4>
            <p className="text-sm text-dark-text-secondary mb-3">{section.content}</p>

            {/* Items List */}
            {section.items && section.items.length > 0 && (
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-dark-text-secondary"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-walmart-blue mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {/* Metrics Grid */}
            {section.metrics && section.metrics.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {section.metrics.map((metric, i) => (
                  <div key={i} className="bg-dark-surface/50 rounded-lg p-3">
                    <span className="text-xs text-dark-text-secondary">{metric.label}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-bold text-dark-text">{metric.value}</span>
                      {metric.trend && (
                        <span
                          className={`text-xs ${
                            metric.trend === 'up'
                              ? 'text-green-400'
                              : metric.trend === 'down'
                              ? 'text-red-400'
                              : 'text-yellow-400'
                          }`}
                        >
                          {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function QuickActionSection({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  id,
  title,
  icon,
  color,
  isExpanded,
  onToggle,
  children,
}: QuickActionSectionProps) {
  return (
    <div
      className={`transition-all duration-300 ${
        isExpanded ? 'col-span-full' : ''
      }`}
    >
      {/* Button */}
      <button
        onClick={onToggle}
        className={`glass-card p-3 flex flex-col items-center gap-2 group hover:ring-1 transition-all text-center w-full ${
          isExpanded
            ? `ring-2 shadow-lg`
            : 'hover:ring-1'
        }`}
        style={{
          borderColor: isExpanded ? color : 'transparent',
          boxShadow: isExpanded ? `0 4px 20px ${color}30` : undefined,
        }}
      >
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl transition-colors"
          style={{
            backgroundColor: `${color}20`,
          }}
        >
          {icon}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-dark-text group-hover:text-white transition-colors block">
            {title}
          </span>
          {isExpanded ? (
            <ChevronUp size={14} className="text-dark-text-secondary" />
          ) : (
            <ChevronDown size={14} className="text-dark-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
        {isExpanded && (
          <span
            className="text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1"
            style={{ backgroundColor: `${color}20`, color }}
          >
            <Sparkles size={10} />
            AI Report Active
          </span>
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div
          className="mt-4 glass-card p-6 rounded-xl animate-fade-in overflow-hidden"
          style={{ borderColor: `${color}30`, borderWidth: '1px' }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
