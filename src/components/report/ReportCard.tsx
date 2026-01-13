'use client';

import { useState } from 'react';
import {
  FileText,
  Clock,
  Cpu,
  Zap,
  ChevronDown,
  ChevronUp,
  Download,
  RefreshCw,
  Building2,
  MapPin,
  Calendar,
  Target,
  AlertCircle,
} from 'lucide-react';
import { StoreReport } from '@/lib/llm/types';
import { Store } from '@/data/stores';
import ConfidenceBadge from './ConfidenceBadge';
import { AgentList } from './AgentAttribution';
import ReportSection from './ReportSection';

interface ReportCardProps {
  report: StoreReport;
  store: Store;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  className?: string;
}

export default function ReportCard({
  report,
  store,
  onRefresh,
  isRefreshing = false,
  className = '',
}: ReportCardProps) {
  const [showAllSections, setShowAllSections] = useState(false);
  const [expandedPriorities, setExpandedPriorities] = useState(true);

  // Format duration
  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  // Format date
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Get priority icon
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'immediate':
        return <AlertCircle size={16} className="text-red-400" />;
      case 'short-term':
        return <Zap size={16} className="text-spark-yellow" />;
      default:
        return <Target size={16} className="text-walmart-blue" />;
    }
  };

  // Get priority badge color
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'immediate':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'short-term':
        return 'bg-spark-yellow/20 text-spark-yellow border-spark-yellow/30';
      default:
        return 'bg-walmart-blue/20 text-walmart-blue border-walmart-blue/30';
    }
  };

  const sectionsToShow = showAllSections
    ? report.sections
    : report.sections.slice(0, 3);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Report Header Card */}
      <div className="glass-card p-6">
        {/* Store Info & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-walmart-blue to-walmart-blue-dark text-white">
              <Building2 size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-dark-text">
                Store #{store.number} Report
              </h2>
              <p className="text-dark-text-secondary">{store.name}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-dark-text-secondary">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {store.city}, {store.state}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  Generated {formatDate(report.generatedAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {report.cacheHit && (
              <span className="px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                Cached
              </span>
            )}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-surface border border-dark-border text-dark-text hover:bg-dark-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                size={16}
                className={isRefreshing ? 'animate-spin' : ''}
              />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-walmart-blue text-white hover:bg-walmart-blue-dark transition-colors">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Report Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="glass-light p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-walmart-blue" />
              <span className="text-xs text-dark-text-secondary">Sections</span>
            </div>
            <p className="text-xl font-bold text-dark-text">
              {report.sections.length}
            </p>
          </div>
          <div className="glass-light p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className="text-spark-yellow" />
              <span className="text-xs text-dark-text-secondary">Generation Time</span>
            </div>
            <p className="text-xl font-bold text-dark-text">
              {formatDuration(report.generationDurationMs)}
            </p>
          </div>
          <div className="glass-light p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Cpu size={16} className="text-purple-400" />
              <span className="text-xs text-dark-text-secondary">Tokens Used</span>
            </div>
            <p className="text-xl font-bold text-dark-text">
              {report.totalTokensUsed.toLocaleString()}
            </p>
          </div>
          <div className="glass-light p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-green-400" />
              <span className="text-xs text-dark-text-secondary">Confidence</span>
            </div>
            <ConfidenceBadge
              confidence={report.overallConfidence}
              size="md"
              showLabel={false}
            />
          </div>
        </div>

        {/* Agents Used */}
        <AgentList agents={report.agentsUsed} maxDisplay={6} />
      </div>

      {/* Executive Summary */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-dark-text mb-4 flex items-center gap-2">
          <FileText size={20} className="text-walmart-blue" />
          Executive Summary
        </h3>
        <div className="prose prose-invert max-w-none">
          <p className="text-dark-text-secondary leading-relaxed whitespace-pre-wrap">
            {report.executiveSummary}
          </p>
        </div>
      </div>

      {/* Top Priorities */}
      {report.topPriorities.length > 0 && (
        <div className="glass-card overflow-hidden">
          <button
            onClick={() => setExpandedPriorities(!expandedPriorities)}
            className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <h3 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <Target size={20} className="text-red-400" />
              Top Priorities ({report.topPriorities.length})
            </h3>
            <div className="p-2 rounded-lg bg-dark-surface text-dark-text-secondary">
              {expandedPriorities ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </div>
          </button>

          <div
            className={`transition-all duration-300 overflow-hidden ${
              expandedPriorities ? 'max-h-[1000px]' : 'max-h-0'
            }`}
          >
            <div className="px-6 pb-6 space-y-3">
              {report.topPriorities.map((priority, index) => (
                <div
                  key={priority.id}
                  className="glass-light p-4 rounded-xl flex items-start gap-4"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-dark-surface text-spark-yellow font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getPriorityIcon(priority.priority)}
                      <h4 className="font-medium text-dark-text">
                        {priority.title}
                      </h4>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full border ${getPriorityBadgeColor(
                          priority.priority
                        )}`}
                      >
                        {priority.priority}
                      </span>
                    </div>
                    <p className="text-sm text-dark-text-secondary">
                      {priority.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-dark-text-secondary">
                      <span>Impact: {priority.impact}</span>
                      <span>Effort: {priority.effort}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section Reports */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-dark-text">Section Analysis</h3>
          {report.sections.length > 3 && (
            <button
              onClick={() => setShowAllSections(!showAllSections)}
              className="text-sm text-walmart-blue hover:underline flex items-center gap-1"
            >
              {showAllSections
                ? 'Show Less'
                : `Show All (${report.sections.length})`}
              {showAllSections ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
            </button>
          )}
        </div>

        {sectionsToShow.map((sectionReport, index) => (
          <ReportSection
            key={sectionReport.sectionKey}
            report={sectionReport}
            defaultExpanded={index === 0}
          />
        ))}

        {!showAllSections && report.sections.length > 3 && (
          <button
            onClick={() => setShowAllSections(true)}
            className="w-full py-4 glass-card text-center text-dark-text-secondary hover:text-dark-text hover:bg-white/5 transition-colors"
          >
            Show {report.sections.length - 3} more sections...
          </button>
        )}
      </div>
    </div>
  );
}
