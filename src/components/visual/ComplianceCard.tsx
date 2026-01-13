'use client';

import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Package,
  AlertOctagon,
  Tag,
  Image,
  Calendar,
  ChevronRight,
  LayoutGrid,
} from 'lucide-react';
import { ComplianceStatus, StoreComplianceSummary } from '@/lib/visual/merchandising-ai';
import { OptimizationStatus } from '@/lib/visual/types';

interface ComplianceCardProps {
  compliance: ComplianceStatus | StoreComplianceSummary;
  variant?: 'section' | 'store';
  onClick?: () => void;
  className?: string;
}

const statusConfig: Record<OptimizationStatus, {
  bg: string;
  border: string;
  text: string;
  icon: typeof CheckCircle;
  label: string;
  glow: string;
}> = {
  optimal: {
    bg: 'bg-green-500/20',
    border: 'border-green-500/30',
    text: 'text-green-400',
    icon: CheckCircle,
    label: 'OPTIMAL',
    glow: 'shadow-green-500/20',
  },
  good: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    icon: CheckCircle,
    label: 'GOOD',
    glow: 'shadow-blue-500/20',
  },
  needs_improvement: {
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    icon: AlertTriangle,
    label: 'NEEDS WORK',
    glow: 'shadow-yellow-500/20',
  },
  critical: {
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
    text: 'text-red-400',
    icon: XCircle,
    label: 'CRITICAL',
    glow: 'shadow-red-500/20',
  },
};

const issueTypeConfig = {
  out_of_stock: { icon: Package, label: 'Out of Stock', color: 'text-red-400' },
  misplaced: { icon: AlertOctagon, label: 'Misplaced', color: 'text-orange-400' },
  wrong_facing: { icon: LayoutGrid, label: 'Wrong Facing', color: 'text-yellow-400' },
  price_tag: { icon: Tag, label: 'Price Tag', color: 'text-blue-400' },
  signage: { icon: Image, label: 'Signage', color: 'text-purple-400' },
};

export default function ComplianceCard({
  compliance,
  variant = 'section',
  onClick,
  className = '',
}: ComplianceCardProps) {
  const config = statusConfig[compliance.status];
  const StatusIcon = config.icon;

  const isSection = variant === 'section';
  const sectionCompliance = compliance as ComplianceStatus;
  const storeCompliance = compliance as StoreComplianceSummary;

  const getTrendIcon = (direction: 'improving' | 'stable' | 'declining') => {
    switch (direction) {
      case 'improving':
        return <TrendingUp size={14} className="text-green-400" />;
      case 'declining':
        return <TrendingDown size={14} className="text-red-400" />;
      default:
        return <Minus size={14} className="text-gray-400" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      className={`glass-card p-4 border ${config.border} hover:border-opacity-60 transition-all group cursor-pointer ${
        onClick ? 'hover:shadow-lg' : ''
      } ${config.glow} ${className}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center`}>
            <StatusIcon size={20} className={config.text} />
          </div>
          <div>
            <h3 className="font-semibold text-dark-text group-hover:text-white transition-colors">
              {isSection ? sectionCompliance.sectionName : storeCompliance.storeName}
            </h3>
            <p className="text-xs text-dark-text-secondary">
              {isSection
                ? `Section ${sectionCompliance.sectionKey}`
                : `${storeCompliance.totalPlanograms} planograms`}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bg} ${config.border} border`}>
          <span className={`text-xs font-bold ${config.text}`}>{config.label}</span>
        </div>
      </div>

      {/* Score Circle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-dark-surface"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                strokeWidth="6"
                strokeLinecap="round"
                className={config.text}
                style={{
                  strokeDasharray: `${(compliance.overallScore / 100) * 176} 176`,
                  transition: 'stroke-dasharray 0.5s ease-out',
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-lg font-bold ${getScoreColor(compliance.overallScore)}`}>
                {compliance.overallScore.toFixed(0)}
              </span>
            </div>
          </div>

          {/* Trend */}
          {isSection && sectionCompliance.trends && (
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                {getTrendIcon(sectionCompliance.trends.direction)}
                <span className={`text-sm font-semibold ${
                  sectionCompliance.trends.scoreChange > 0 ? 'text-green-400' :
                  sectionCompliance.trends.scoreChange < 0 ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {sectionCompliance.trends.scoreChange > 0 ? '+' : ''}
                  {sectionCompliance.trends.scoreChange.toFixed(1)}%
                </span>
              </div>
              <span className="text-xs text-dark-text-secondary">vs last week</span>
            </div>
          )}
        </div>

        {/* Planogram Stats */}
        <div className="text-right">
          {isSection ? (
            <>
              <p className="text-2xl font-bold text-dark-text">
                {sectionCompliance.planogramsCompliant}/{sectionCompliance.planogramsTotal}
              </p>
              <p className="text-xs text-dark-text-secondary">Compliant</p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-dark-text">
                {storeCompliance.compliantPlanograms}/{storeCompliance.totalPlanograms}
              </p>
              <p className="text-xs text-dark-text-secondary">Planograms OK</p>
            </>
          )}
        </div>
      </div>

      {/* Issues Summary */}
      {isSection && sectionCompliance.issues && sectionCompliance.issues.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-dark-text-secondary mb-2">Issues</p>
          <div className="flex flex-wrap gap-2">
            {sectionCompliance.issues.slice(0, 4).map((issue, idx) => {
              const issueConfig = issueTypeConfig[issue.type];
              const IssueIcon = issueConfig.icon;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg bg-dark-surface border border-dark-border`}
                >
                  <IssueIcon size={12} className={issueConfig.color} />
                  <span className="text-xs text-dark-text">{issue.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Store-level summary */}
      {!isSection && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="glass-light p-2 rounded-lg">
            <div className="flex items-center gap-1.5">
              <Package size={12} className="text-red-400" />
              <span className="text-xs text-dark-text-secondary">OOS Items</span>
            </div>
            <p className="text-lg font-bold text-red-400">{storeCompliance.outOfStockItems}</p>
          </div>
          <div className="glass-light p-2 rounded-lg">
            <div className="flex items-center gap-1.5">
              <AlertOctagon size={12} className="text-orange-400" />
              <span className="text-xs text-dark-text-secondary">Misplaced</span>
            </div>
            <p className="text-lg font-bold text-orange-400">{storeCompliance.misplacedItems}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-dark-border">
        {isSection ? (
          <>
            <div className="flex items-center gap-1.5 text-xs text-dark-text-secondary">
              <Calendar size={12} />
              <span>Audit: {formatDate(sectionCompliance.lastAuditDate)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-dark-text-secondary">
              <span>Next: {formatDate(sectionCompliance.nextScheduledAudit)}</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5 text-xs text-dark-text-secondary">
              <span className="text-spark-yellow">
                ${storeCompliance.revenueAtRisk.toLocaleString()} at risk
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-dark-text-secondary">
              <span>{storeCompliance.recommendationsCount} recommendations</span>
            </div>
          </>
        )}

        {onClick && (
          <ChevronRight size={16} className="text-dark-text-secondary group-hover:text-walmart-blue transition-colors" />
        )}
      </div>
    </div>
  );
}

// Compact variant for lists
export function ComplianceCardCompact({
  compliance,
  onClick,
  className = '',
}: {
  compliance: ComplianceStatus;
  onClick?: () => void;
  className?: string;
}) {
  const config = statusConfig[compliance.status];
  const StatusIcon = config.icon;

  return (
    <div
      className={`flex items-center gap-4 p-3 glass-light rounded-xl border ${config.border} hover:border-opacity-60 transition-all cursor-pointer group ${className}`}
      onClick={onClick}
    >
      <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
        <StatusIcon size={16} className={config.text} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-dark-text truncate">{compliance.sectionName}</span>
          <span className={`text-xs font-bold ${config.text}`}>{config.label}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-dark-text-secondary">
          <span>{compliance.planogramsCompliant}/{compliance.planogramsTotal} compliant</span>
          {compliance.issues.length > 0 && (
            <span className="text-yellow-400">
              {compliance.issues.reduce((sum, i) => sum + i.count, 0)} issues
            </span>
          )}
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className={`text-xl font-bold ${
          compliance.overallScore >= 90 ? 'text-green-400' :
          compliance.overallScore >= 80 ? 'text-blue-400' :
          compliance.overallScore >= 70 ? 'text-yellow-400' : 'text-red-400'
        }`}>
          {compliance.overallScore.toFixed(0)}%
        </p>
      </div>

      {onClick && (
        <ChevronRight size={18} className="text-dark-text-secondary group-hover:text-walmart-blue transition-colors shrink-0" />
      )}
    </div>
  );
}
