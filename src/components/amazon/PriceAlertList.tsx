'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Target,
  Shield,
  Check,
  Clock,
  ChevronDown,
  ChevronUp,
  Store,
} from 'lucide-react';
import { PriceAlert, AlertSeverity } from '@/lib/amazon/types';

interface PriceAlertListProps {
  alerts: PriceAlert[];
  onAcknowledge?: (alertId: string) => void;
  maxDisplay?: number;
  className?: string;
}

const severityConfig: Record<AlertSeverity, {
  bg: string;
  border: string;
  text: string;
  icon: typeof AlertTriangle;
  glow: string;
}> = {
  critical: {
    bg: 'bg-red-500/20',
    border: 'border-red-500/50',
    text: 'text-red-400',
    icon: AlertTriangle,
    glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]',
  },
  high: {
    bg: 'bg-orange-500/20',
    border: 'border-orange-500/50',
    text: 'text-orange-400',
    icon: AlertTriangle,
    glow: 'shadow-[0_0_10px_rgba(249,115,22,0.2)]',
  },
  medium: {
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/50',
    text: 'text-yellow-400',
    icon: Target,
    glow: '',
  },
  low: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/50',
    text: 'text-blue-400',
    icon: Shield,
    glow: '',
  },
};

const alertTypeConfig = {
  amazon_price_drop: {
    icon: TrendingDown,
    label: 'Amazon Price Drop',
    color: 'text-red-400',
  },
  amazon_price_increase: {
    icon: TrendingUp,
    label: 'Amazon Price Increase',
    color: 'text-green-400',
  },
  walmart_opportunity: {
    icon: Target,
    label: 'Opportunity',
    color: 'text-spark-yellow',
  },
  competitive_threat: {
    icon: Shield,
    label: 'Competitive Threat',
    color: 'text-orange-400',
  },
};

export default function PriceAlertList({
  alerts,
  onAcknowledge,
  maxDisplay = 10,
  className = '',
}: PriceAlertListProps) {
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  const displayAlerts = showAll ? alerts : alerts.slice(0, maxDisplay);
  const activeAlerts = alerts.filter((a) => !a.acknowledged);

  const toggleExpand = (alertId: string) => {
    const newExpanded = new Set(expandedAlerts);
    if (newExpanded.has(alertId)) {
      newExpanded.delete(alertId);
    } else {
      newExpanded.add(alertId);
    }
    setExpandedAlerts(newExpanded);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  if (alerts.length === 0) {
    return (
      <div className={`glass-card p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <Check size={32} className="text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-dark-text mb-2">All Clear</h3>
          <p className="text-dark-text-secondary">
            No active price alerts at this time
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Summary Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
              <AlertTriangle size={18} className="text-red-400" />
            </div>
            <span className="text-lg font-semibold text-dark-text">
              {activeAlerts.length} Active Alert{activeAlerts.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Severity Summary */}
        <div className="flex items-center gap-2">
          {(['critical', 'high', 'medium', 'low'] as AlertSeverity[]).map((sev) => {
            const count = activeAlerts.filter((a) => a.severity === sev).length;
            if (count === 0) return null;
            const config = severityConfig[sev];
            return (
              <span
                key={sev}
                className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}
              >
                {count} {sev}
              </span>
            );
          })}
        </div>
      </div>

      {/* Alert List */}
      {displayAlerts.map((alert) => {
        const sevConfig = severityConfig[alert.severity];
        const typeConfig = alertTypeConfig[alert.alertType];
        const SeverityIcon = sevConfig.icon;
        // TypeIcon is available but using SeverityIcon for main display
        void typeConfig.icon;
        const isExpanded = expandedAlerts.has(alert.id);

        return (
          <div
            key={alert.id}
            className={`glass-card border ${sevConfig.border} ${sevConfig.glow} transition-all ${
              alert.acknowledged ? 'opacity-60' : ''
            }`}
          >
            {/* Alert Header */}
            <button
              onClick={() => toggleExpand(alert.id)}
              className="w-full p-4 flex items-start gap-4 text-left hover:bg-white/5 transition-colors"
            >
              {/* Severity Icon */}
              <div
                className={`w-10 h-10 rounded-xl ${sevConfig.bg} flex items-center justify-center shrink-0`}
              >
                <SeverityIcon size={20} className={sevConfig.text} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium ${typeConfig.color}`}>
                    {typeConfig.label}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-xs ${sevConfig.bg} ${sevConfig.text}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  {alert.acknowledged && (
                    <span className="px-1.5 py-0.5 rounded text-xs bg-green-500/20 text-green-400">
                      Acknowledged
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-semibold text-dark-text truncate pr-4">
                  {alert.title}
                </h4>
                <p className="text-xs text-dark-text-secondary mt-1 line-clamp-2">
                  {alert.description}
                </p>
              </div>

              {/* Right Side */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="flex items-center gap-1 text-xs text-dark-text-secondary">
                  <Clock size={12} />
                  {formatTimeAgo(alert.createdAt)}
                </div>
                <div className={`p-1.5 rounded-lg ${isExpanded ? 'bg-dark-surface' : ''}`}>
                  {isExpanded ? (
                    <ChevronUp size={16} className="text-dark-text-secondary" />
                  ) : (
                    <ChevronDown size={16} className="text-dark-text-secondary" />
                  )}
                </div>
              </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="px-4 pb-4 border-t border-dark-border mt-0">
                <div className="pt-4 space-y-4">
                  {/* Price Change Details */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="glass-light p-3 rounded-xl">
                      <p className="text-xs text-dark-text-secondary mb-1">Previous Price</p>
                      <p className="text-lg font-bold text-dark-text">
                        ${alert.previousPrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="glass-light p-3 rounded-xl">
                      <p className="text-xs text-dark-text-secondary mb-1">Current Price</p>
                      <p className="text-lg font-bold text-dark-text">
                        ${alert.currentPrice.toFixed(2)}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl ${sevConfig.bg}`}>
                      <p className="text-xs text-dark-text-secondary mb-1">Change</p>
                      <p className={`text-lg font-bold ${sevConfig.text}`}>
                        {alert.changePercent > 0 ? '+' : ''}
                        {alert.changePercent.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Suggested Action */}
                  <div className="p-3 rounded-xl bg-spark-yellow/10 border border-spark-yellow/30">
                    <p className="text-xs text-spark-yellow font-medium mb-1">
                      Suggested Action
                    </p>
                    <p className="text-sm text-dark-text">{alert.suggestedAction}</p>
                  </div>

                  {/* Affected Stores */}
                  {alert.storeIds && alert.storeIds.length > 0 && (
                    <div>
                      <p className="text-xs text-dark-text-secondary mb-2">Affected Stores</p>
                      <div className="flex flex-wrap gap-2">
                        {alert.storeIds.map((storeId) => (
                          <span
                            key={storeId}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-dark-surface text-xs text-dark-text"
                          >
                            <Store size={12} />
                            #{storeId}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Impact & Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-dark-text-secondary">
                      Potential Impact:{' '}
                      <span className="text-spark-yellow font-semibold">
                        ${alert.potentialImpact.toLocaleString()}
                      </span>
                    </span>

                    {!alert.acknowledged && onAcknowledge && (
                      <button
                        onClick={() => onAcknowledge(alert.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-walmart-blue text-white text-sm font-medium hover:bg-walmart-blue-dark transition-colors"
                      >
                        <Check size={16} />
                        Acknowledge
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Show More Button */}
      {alerts.length > maxDisplay && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-3 glass-card text-center text-dark-text-secondary hover:text-dark-text hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
        >
          {showAll ? (
            <>
              <ChevronUp size={16} />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              Show {alerts.length - maxDisplay} More Alerts
            </>
          )}
        </button>
      )}
    </div>
  );
}
