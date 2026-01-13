'use client';

import { useState } from 'react';
import {
  ChevronDown,
  Lightbulb,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { SectionReport } from '@/lib/llm/types';
import { SECTIONS } from '@/data/stores';
import ConfidenceBadge from './ConfidenceBadge';
import AgentAttribution from './AgentAttribution';

interface ReportSectionProps {
  report: SectionReport;
  defaultExpanded?: boolean;
  className?: string;
}

export default function ReportSection({
  report,
  defaultExpanded = false,
  className = '',
}: ReportSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const section = SECTIONS.find((s) => s.key === report.sectionKey);
  if (!section) return null;

  // Get status icon based on metrics
  const getStatusIcon = (status: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good':
        return <CheckCircle2 size={14} className="text-green-400" />;
      case 'warning':
        return <AlertTriangle size={14} className="text-spark-yellow" />;
      case 'critical':
        return <AlertCircle size={14} className="text-red-400" />;
    }
  };

  // Get trend icon
  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={12} className="text-green-400" />;
      case 'down':
        return <TrendingDown size={12} className="text-red-400" />;
      default:
        return <Minus size={12} className="text-dark-text-secondary" />;
    }
  };

  // Get importance badge color
  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-spark-yellow/20 text-spark-yellow border-spark-yellow/30';
      default:
        return 'bg-dark-surface text-dark-text-secondary border-dark-border';
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'immediate':
        return 'bg-red-500/20 text-red-400';
      case 'short-term':
        return 'bg-spark-yellow/20 text-spark-yellow';
      default:
        return 'bg-dark-surface text-dark-text-secondary';
    }
  };

  return (
    <div
      className={`glass-card overflow-hidden transition-all duration-300 ${className}`}
      style={{
        borderLeft: `4px solid ${section.color}`,
      }}
    >
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-xl text-white font-bold text-lg"
            style={{ backgroundColor: section.color }}
          >
            {section.key}
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-dark-text">
              Section {section.key}: {section.name}
            </h3>
            <p className="text-sm text-dark-text-secondary">
              {section.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ConfidenceBadge confidence={report.overallConfidence} size="sm" />
          <div
            className="p-2 rounded-lg bg-dark-surface text-dark-text-secondary transition-transform duration-300"
            style={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <ChevronDown size={20} />
          </div>
        </div>
      </button>

      {/* Expandable Content */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 space-y-6 border-t border-dark-border">
          {/* Summary */}
          <div className="pt-4">
            <p className="text-dark-text-secondary leading-relaxed">
              {report.summary}
            </p>
          </div>

          {/* Metrics Grid */}
          {report.metrics.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {report.metrics.map((metric, index) => (
                <div
                  key={index}
                  className="glass-light p-4 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-dark-text-secondary">
                      {metric.name}
                    </span>
                    {getStatusIcon(metric.status)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-dark-text">
                      {metric.value}
                    </span>
                    {metric.trend && getTrendIcon(metric.trend)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Insights */}
          {report.insights.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={18} className="text-spark-yellow" />
                <h4 className="font-semibold text-dark-text">Key Insights</h4>
              </div>
              <div className="space-y-3">
                {report.insights.slice(0, 3).map((insight) => (
                  <div
                    key={insight.id}
                    className="glass-light p-4 rounded-xl"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h5 className="font-medium text-dark-text">
                        {insight.title}
                      </h5>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full border ${getImportanceColor(
                          insight.importance
                        )}`}
                      >
                        {insight.importance}
                      </span>
                    </div>
                    <p className="text-sm text-dark-text-secondary mb-3">
                      {insight.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <AgentAttribution
                        agentName={insight.agentSource}
                        size="sm"
                      />
                      <ConfidenceBadge
                        confidence={insight.confidence}
                        size="sm"
                        showLabel={false}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {report.recommendations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target size={18} className="text-walmart-blue" />
                <h4 className="font-semibold text-dark-text">Recommendations</h4>
              </div>
              <div className="space-y-3">
                {report.recommendations.slice(0, 3).map((rec) => (
                  <div
                    key={rec.id}
                    className="glass-light p-4 rounded-xl border-l-2 border-walmart-blue"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h5 className="font-medium text-dark-text">{rec.title}</h5>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${getPriorityColor(
                          rec.priority
                        )}`}
                      >
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-sm text-dark-text-secondary mb-3">
                      {rec.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-dark-text-secondary">
                      <span>
                        Impact:{' '}
                        <span
                          className={
                            rec.impact === 'high'
                              ? 'text-green-400'
                              : rec.impact === 'medium'
                              ? 'text-spark-yellow'
                              : 'text-dark-text-secondary'
                          }
                        >
                          {rec.impact}
                        </span>
                      </span>
                      <span>
                        Effort:{' '}
                        <span
                          className={
                            rec.effort === 'low'
                              ? 'text-green-400'
                              : rec.effort === 'medium'
                              ? 'text-spark-yellow'
                              : 'text-red-400'
                          }
                        >
                          {rec.effort}
                        </span>
                      </span>
                      {rec.estimatedROI && (
                        <span>Est. ROI: {rec.estimatedROI}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contributing Agents */}
          <div className="pt-4 border-t border-dark-border">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-dark-text-secondary">
                Analysis powered by:
              </span>
              {report.agentsContributed.map((agent) => (
                <AgentAttribution
                  key={agent}
                  agentName={agent}
                  size="sm"
                  showRole={false}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
