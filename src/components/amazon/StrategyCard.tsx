'use client';

import { useState } from 'react';
import {
  Target,
  Zap,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  ListTodo,
  Shield,
} from 'lucide-react';
import { WarfareStrategy, StrategyType } from '@/lib/amazon/types';

interface StrategyCardProps {
  strategy: WarfareStrategy;
  onApprove?: (strategyId: string) => void;
  onReject?: (strategyId: string) => void;
  className?: string;
}

const strategyTypeConfig: Record<StrategyType, {
  icon: typeof Target;
  color: string;
  bg: string;
  label: string;
}> = {
  price_match: {
    icon: DollarSign,
    color: 'text-green-400',
    bg: 'bg-green-500/20',
    label: 'Price Match',
  },
  bundle_offer: {
    icon: Target,
    color: 'text-purple-400',
    bg: 'bg-purple-500/20',
    label: 'Bundle Offer',
  },
  loyalty_exclusive: {
    icon: Sparkles,
    color: 'text-spark-yellow',
    bg: 'bg-spark-yellow/20',
    label: 'Loyalty Exclusive',
  },
  same_day_delivery: {
    icon: Zap,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/20',
    label: 'Same-Day Delivery',
  },
  in_store_pickup: {
    icon: CheckCircle2,
    color: 'text-walmart-blue',
    bg: 'bg-walmart-blue/20',
    label: 'In-Store Pickup',
  },
  price_lock: {
    icon: Shield,
    color: 'text-orange-400',
    bg: 'bg-orange-500/20',
    label: 'Price Lock',
  },
  member_discount: {
    icon: DollarSign,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    label: 'Member Discount',
  },
};

const priorityConfig = {
  critical: {
    bg: 'bg-red-500/20',
    border: 'border-red-500/50',
    text: 'text-red-400',
    glow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]',
  },
  high: {
    bg: 'bg-orange-500/20',
    border: 'border-orange-500/50',
    text: 'text-orange-400',
    glow: 'shadow-[0_0_10px_rgba(249,115,22,0.15)]',
  },
  medium: {
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/50',
    text: 'text-yellow-400',
    glow: '',
  },
  low: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/50',
    text: 'text-blue-400',
    glow: '',
  },
};

const statusConfig = {
  proposed: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Proposed' },
  approved: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Approved' },
  implementing: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', label: 'Implementing' },
  active: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Active' },
  completed: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Completed' },
  rejected: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Rejected' },
};

export default function StrategyCard({
  strategy,
  onApprove,
  onReject,
  className = '',
}: StrategyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const typeConfig = strategyTypeConfig[strategy.type];
  const prioConfig = priorityConfig[strategy.priority];
  const statConfig = statusConfig[strategy.status];
  const TypeIcon = typeConfig.icon;

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div
      className={`glass-card border ${prioConfig.border} ${prioConfig.glow} transition-all hover:border-opacity-80 ${className}`}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            {/* Type Icon */}
            <div className={`w-12 h-12 rounded-xl ${typeConfig.bg} flex items-center justify-center shrink-0`}>
              <TypeIcon size={24} className={typeConfig.color} />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-medium ${typeConfig.color}`}>
                  {typeConfig.label}
                </span>
                {strategy.aiGenerated && (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-spark-yellow/20 text-xs text-spark-yellow">
                    <Sparkles size={10} />
                    AI
                  </span>
                )}
              </div>
              <h3 className="text-base font-semibold text-dark-text">
                {strategy.name}
              </h3>
            </div>
          </div>

          {/* Priority & Status Badges */}
          <div className="flex flex-col items-end gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${prioConfig.bg} ${prioConfig.text} border ${prioConfig.border}`}>
              {strategy.priority.toUpperCase()}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs ${statConfig.bg} ${statConfig.text}`}>
              {statConfig.label}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-dark-text-secondary mb-4">
          {strategy.description}
        </p>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="glass-light p-2.5 rounded-xl text-center">
            <p className="text-xs text-dark-text-secondary mb-1">Cost</p>
            <p className="text-sm font-bold text-dark-text">
              {formatCurrency(strategy.estimatedCost)}
            </p>
          </div>
          <div className="glass-light p-2.5 rounded-xl text-center">
            <p className="text-xs text-dark-text-secondary mb-1">Revenue</p>
            <p className="text-sm font-bold text-green-400">
              {formatCurrency(strategy.estimatedRevenue)}
            </p>
          </div>
          <div className={`p-2.5 rounded-xl text-center ${strategy.roi > 100 ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
            <p className="text-xs text-dark-text-secondary mb-1">ROI</p>
            <p className={`text-sm font-bold ${strategy.roi > 100 ? 'text-green-400' : 'text-yellow-400'}`}>
              {strategy.roi.toFixed(0)}%
            </p>
          </div>
          <div className="glass-light p-2.5 rounded-xl text-center">
            <p className="text-xs text-dark-text-secondary mb-1">Timeline</p>
            <p className="text-sm font-bold text-dark-text">
              {strategy.timeToImplement}
            </p>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-dark-text-secondary">AI Confidence</span>
            <span className="text-xs font-medium text-dark-text">
              {(strategy.confidence * 100).toFixed(0)}%
            </span>
          </div>
          <div className="h-2 bg-dark-surface rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                strategy.confidence > 0.8
                  ? 'bg-green-500'
                  : strategy.confidence > 0.6
                  ? 'bg-yellow-500'
                  : 'bg-orange-500'
              }`}
              style={{ width: `${strategy.confidence * 100}%` }}
            />
          </div>
        </div>

        {/* Expand Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-dark-text-secondary hover:text-dark-text transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp size={16} />
              Hide Details
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              View Implementation Details
            </>
          )}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-dark-border">
          <div className="pt-4 space-y-4">
            {/* Expected Outcome */}
            <div>
              <h4 className="flex items-center gap-2 text-sm font-medium text-dark-text mb-2">
                <TrendingUp size={16} className="text-green-400" />
                Expected Outcome
              </h4>
              <p className="text-sm text-dark-text-secondary pl-6">
                {strategy.expectedOutcome}
              </p>
            </div>

            {/* Implementation Steps */}
            <div>
              <h4 className="flex items-center gap-2 text-sm font-medium text-dark-text mb-2">
                <ListTodo size={16} className="text-walmart-blue" />
                Implementation Steps
              </h4>
              <ol className="space-y-2 pl-6">
                {strategy.implementationSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-walmart-blue/20 text-walmart-blue text-xs font-bold shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-sm text-dark-text-secondary">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Risks */}
            <div>
              <h4 className="flex items-center gap-2 text-sm font-medium text-dark-text mb-2">
                <AlertTriangle size={16} className="text-orange-400" />
                Risk Factors
              </h4>
              <ul className="space-y-1 pl-6">
                {strategy.risks.map((risk, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                    <span className="text-sm text-dark-text-secondary">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Target Info */}
            {(strategy.targetCategory || strategy.targetStores) && (
              <div className="flex flex-wrap gap-4">
                {strategy.targetCategory && (
                  <div>
                    <span className="text-xs text-dark-text-secondary">Target Category</span>
                    <p className="text-sm font-medium text-dark-text capitalize">
                      {strategy.targetCategory}
                    </p>
                  </div>
                )}
                {strategy.targetStores && strategy.targetStores.length > 0 && (
                  <div>
                    <span className="text-xs text-dark-text-secondary">Target Stores</span>
                    <p className="text-sm font-medium text-dark-text">
                      {strategy.targetStores.map((s) => `#${s}`).join(', ')}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {strategy.status === 'proposed' && (onApprove || onReject) && (
              <div className="flex items-center gap-3 pt-2">
                {onApprove && (
                  <button
                    onClick={() => onApprove(strategy.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
                  >
                    <CheckCircle2 size={18} />
                    Approve Strategy
                  </button>
                )}
                {onReject && (
                  <button
                    onClick={() => onReject(strategy.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-dark-surface border border-dark-border text-dark-text font-medium hover:bg-dark-border transition-colors"
                  >
                    Reject
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
