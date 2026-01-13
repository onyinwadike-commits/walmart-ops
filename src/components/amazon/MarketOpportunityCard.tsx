'use client';

import { useState } from 'react';
import {
  Target,
  TrendingUp,
  DollarSign,
  Clock,
  ChevronDown,
  ChevronUp,
  Star,
  AlertCircle,
  ArrowRight,
  Store,
  Layers,
} from 'lucide-react';
import { MarketOpportunity, ProductCategory } from '@/lib/amazon/types';

interface MarketOpportunityCardProps {
  opportunity: MarketOpportunity;
  onTakeAction?: (opportunityId: string) => void;
  className?: string;
}

const opportunityTypeConfig: Record<MarketOpportunity['opportunityType'], {
  icon: typeof Target;
  color: string;
  bg: string;
  label: string;
}> = {
  underserved_segment: {
    icon: Layers,
    color: 'text-purple-400',
    bg: 'bg-purple-500/20',
    label: 'Underserved Segment',
  },
  price_gap: {
    icon: DollarSign,
    color: 'text-green-400',
    bg: 'bg-green-500/20',
    label: 'Price Gap',
  },
  service_gap: {
    icon: Star,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/20',
    label: 'Service Gap',
  },
  product_gap: {
    icon: Target,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/20',
    label: 'Product Gap',
  },
  seasonal: {
    icon: Clock,
    color: 'text-orange-400',
    bg: 'bg-orange-500/20',
    label: 'Seasonal',
  },
};

const categoryColors: Record<ProductCategory, string> = {
  electronics: 'bg-blue-500/30 text-blue-400',
  grocery: 'bg-green-500/30 text-green-400',
  home: 'bg-purple-500/30 text-purple-400',
  apparel: 'bg-pink-500/30 text-pink-400',
  toys: 'bg-red-500/30 text-red-400',
  health: 'bg-emerald-500/30 text-emerald-400',
  automotive: 'bg-gray-500/30 text-gray-400',
  sports: 'bg-orange-500/30 text-orange-400',
  garden: 'bg-lime-500/30 text-lime-400',
  office: 'bg-slate-500/30 text-slate-400',
};

export default function MarketOpportunityCard({
  opportunity,
  onTakeAction,
  className = '',
}: MarketOpportunityCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const typeConfig = opportunityTypeConfig[opportunity.opportunityType];
  const TypeIcon = typeConfig.icon;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  // Calculate difficulty color
  const getDifficultyColor = (score: number) => {
    if (score <= 3) return 'text-green-400';
    if (score <= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getDifficultyBg = (score: number) => {
    if (score <= 3) return 'bg-green-500';
    if (score <= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div
      className={`glass-card overflow-hidden transition-all hover:ring-1 hover:ring-spark-yellow/30 ${className}`}
    >
      {/* Gradient Accent */}
      <div
        className="h-1 bg-gradient-to-r from-spark-yellow via-spark-orange to-red-500"
        style={{ opacity: 0.8 }}
      />

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
                <span className={`px-2 py-0.5 rounded text-xs ${categoryColors[opportunity.category]}`}>
                  {opportunity.category}
                </span>
              </div>
              <h3 className="text-base font-semibold text-dark-text">
                {opportunity.title}
              </h3>
            </div>
          </div>

          {/* Potential Gain Badge */}
          <div className="px-3 py-1.5 rounded-xl bg-spark-yellow/20 border border-spark-yellow/30">
            <p className="text-xs text-dark-text-secondary">Potential</p>
            <p className="text-lg font-bold text-spark-yellow">
              {formatCurrency(opportunity.potentialGain)}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-dark-text-secondary mb-4">
          {opportunity.description}
        </p>

        {/* Market Share Comparison */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-dark-text-secondary">Market Share</span>
            <span className="text-xs text-dark-text">
              Gap: {formatPercent(opportunity.amazonShare - opportunity.currentWalmartShare)}
            </span>
          </div>
          <div className="h-4 bg-dark-surface rounded-full overflow-hidden flex">
            <div
              className="h-full bg-walmart-blue"
              style={{ width: `${opportunity.currentWalmartShare}%` }}
            />
            <div
              className="h-full bg-orange-500"
              style={{ width: `${opportunity.amazonShare}%` }}
            />
            <div className="h-full flex-1 bg-dark-border" />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-walmart-blue">
              Walmart: {formatPercent(opportunity.currentWalmartShare)}
            </span>
            <span className="text-xs text-orange-400">
              Amazon: {formatPercent(opportunity.amazonShare)}
            </span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="glass-light p-2.5 rounded-xl text-center">
            <p className="text-xs text-dark-text-secondary mb-1">Market Size</p>
            <p className="text-sm font-bold text-dark-text">
              {formatCurrency(opportunity.marketSize)}
            </p>
          </div>
          <div className="glass-light p-2.5 rounded-xl text-center">
            <p className="text-xs text-dark-text-secondary mb-1">Investment</p>
            <p className="text-sm font-bold text-dark-text">
              {formatCurrency(opportunity.requiredInvestment)}
            </p>
          </div>
          <div className="glass-light p-2.5 rounded-xl text-center">
            <p className="text-xs text-dark-text-secondary mb-1">Time</p>
            <p className="text-sm font-bold text-dark-text">
              {opportunity.timeToCapture}
            </p>
          </div>
          <div className="glass-light p-2.5 rounded-xl text-center">
            <p className="text-xs text-dark-text-secondary mb-1">Difficulty</p>
            <div className="flex items-center justify-center gap-1">
              <span className={`text-sm font-bold ${getDifficultyColor(opportunity.difficultyScore)}`}>
                {opportunity.difficultyScore}/10
              </span>
            </div>
          </div>
        </div>

        {/* Difficulty Indicator */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-dark-text-secondary">Capture Difficulty</span>
          </div>
          <div className="h-2 bg-dark-surface rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${getDifficultyBg(opportunity.difficultyScore)}`}
              style={{ width: `${opportunity.difficultyScore * 10}%` }}
            />
          </div>
        </div>

        {/* Confidence */}
        <div className="flex items-center justify-between mb-4 px-3 py-2 rounded-xl bg-dark-surface/50">
          <span className="text-xs text-dark-text-secondary">AI Confidence</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-dark-border rounded-full overflow-hidden">
              <div
                className="h-full bg-spark-yellow rounded-full"
                style={{ width: `${opportunity.confidence * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium text-spark-yellow">
              {(opportunity.confidence * 100).toFixed(0)}%
            </span>
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
              View Strategy Details
            </>
          )}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-dark-border">
          <div className="pt-4 space-y-4">
            {/* Key Actions */}
            <div>
              <h4 className="flex items-center gap-2 text-sm font-medium text-dark-text mb-2">
                <Target size={16} className="text-spark-yellow" />
                Key Actions to Capture
              </h4>
              <ul className="space-y-2 pl-6">
                {opportunity.keyActions.map((action, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ArrowRight size={14} className="text-spark-yellow mt-1 shrink-0" />
                    <span className="text-sm text-dark-text-secondary">{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-2 gap-4">
              {/* Walmart Strengths */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-medium text-walmart-blue mb-2">
                  <TrendingUp size={16} />
                  Walmart Strengths
                </h4>
                <ul className="space-y-1.5">
                  {opportunity.walmartStrengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-walmart-blue mt-2 shrink-0" />
                      <span className="text-xs text-dark-text-secondary">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Competitor Weaknesses */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-medium text-orange-400 mb-2">
                  <AlertCircle size={16} />
                  Amazon Weaknesses
                </h4>
                <ul className="space-y-1.5">
                  {opportunity.competitorWeaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                      <span className="text-xs text-dark-text-secondary">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Relevant Stores */}
            {opportunity.relevantStores.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 text-sm font-medium text-dark-text mb-2">
                  <Store size={16} className="text-dark-text-secondary" />
                  Relevant Stores
                </h4>
                <div className="flex flex-wrap gap-2">
                  {opportunity.relevantStores.map((storeId) => (
                    <span
                      key={storeId}
                      className="px-2 py-1 rounded-lg bg-dark-surface text-xs text-dark-text"
                    >
                      Store #{storeId}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Data Sources */}
            <div className="text-xs text-dark-text-secondary">
              <span className="font-medium">Data Sources: </span>
              {opportunity.dataSource.join(', ')}
            </div>

            {/* Take Action Button */}
            {onTakeAction && (
              <button
                onClick={() => onTakeAction(opportunity.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-spark-yellow to-spark-orange text-dark-bg font-bold hover:opacity-90 transition-opacity"
              >
                <Target size={18} />
                Capture This Opportunity
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
