'use client';

import { useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  AlertCircle,
  Target,
  Lightbulb,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  Planogram,
  MerchandisingRecommendation,
  EndcapOpportunity,
  CrossCategoryOpportunity,
} from '@/lib/visual/types';

interface ShelfAnalysisProps {
  planograms: Planogram[];
  recommendations: MerchandisingRecommendation[];
  endcapOpportunities?: EndcapOpportunity[];
  crossCategoryOpportunities?: CrossCategoryOpportunity[];
  className?: string;
}

const priorityConfig = {
  critical: { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400', label: 'CRITICAL' },
  high: { bg: 'bg-orange-500/20', border: 'border-orange-500/30', text: 'text-orange-400', label: 'HIGH' },
  medium: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400', label: 'MEDIUM' },
  low: { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400', label: 'LOW' },
};

const effortConfig = {
  quick: { text: 'text-green-400', label: 'Quick Win' },
  moderate: { text: 'text-yellow-400', label: 'Moderate Effort' },
  significant: { text: 'text-orange-400', label: 'Significant' },
};

export default function ShelfAnalysis({
  planograms,
  recommendations,
  endcapOpportunities = [],
  crossCategoryOpportunities = [],
  className = '',
}: ShelfAnalysisProps) {
  // Calculate aggregate metrics
  const metrics = useMemo(() => {
    const totalRevenue = planograms.reduce((sum, p) => sum + p.revenuePerWeek, 0);
    const totalMargin = planograms.reduce((sum, p) => sum + p.marginPerWeek, 0);
    const avgScore = planograms.reduce((sum, p) => sum + p.optimizationScore, 0) / planograms.length;
    const criticalCount = planograms.filter(p => p.status === 'critical').length;
    const needsImprovementCount = planograms.filter(p => p.status === 'needs_improvement').length;

    const potentialRevenueGain = recommendations.reduce(
      (sum, r) => sum + r.expectedImpact.revenueChange,
      0
    );

    return {
      totalRevenue,
      totalMargin,
      avgScore,
      criticalCount,
      needsImprovementCount,
      potentialRevenueGain,
      planogramCount: planograms.length,
    };
  }, [planograms, recommendations]);

  // Sort recommendations by priority
  const sortedRecommendations = useMemo(() => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return [...recommendations].sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  }, [recommendations]);

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Metrics */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-walmart-blue to-walmart-blue-dark flex items-center justify-center">
            <BarChart3 size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-dark-text">Shelf Performance Analysis</h2>
            <p className="text-sm text-dark-text-secondary">
              Analyzing {metrics.planogramCount} planograms
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricBox
            icon={<DollarSign size={18} />}
            label="Weekly Revenue"
            value={formatCurrency(metrics.totalRevenue)}
            subValue={`${formatCurrency(metrics.totalMargin)} margin`}
            trend="up"
            color="green"
          />
          <MetricBox
            icon={<Target size={18} />}
            label="Avg. Optimization"
            value={`${metrics.avgScore.toFixed(0)}%`}
            subValue="Score across planograms"
            trend={metrics.avgScore >= 80 ? 'up' : metrics.avgScore >= 70 ? 'stable' : 'down'}
            color="yellow"
          />
          <MetricBox
            icon={<AlertCircle size={18} />}
            label="Attention Needed"
            value={metrics.criticalCount + metrics.needsImprovementCount}
            subValue={`${metrics.criticalCount} critical`}
            trend="down"
            color="red"
          />
          <MetricBox
            icon={<TrendingUp size={18} />}
            label="Revenue Potential"
            value={formatCurrency(metrics.potentialRevenueGain)}
            subValue="From recommendations"
            trend="up"
            color="blue"
          />
        </div>
      </div>

      {/* Recommendations */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-spark-yellow to-spark-orange flex items-center justify-center">
              <Lightbulb size={20} className="text-dark-bg" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-dark-text">AI Recommendations</h2>
              <p className="text-sm text-dark-text-secondary">
                {recommendations.length} optimization opportunities
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-spark-yellow" />
            <span className="text-sm text-spark-yellow font-medium">AI Generated</span>
          </div>
        </div>

        <div className="space-y-4">
          {sortedRecommendations.slice(0, 5).map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))}
        </div>

        {recommendations.length > 5 && (
          <button className="w-full mt-4 py-3 rounded-xl border border-dark-border text-dark-text-secondary hover:text-dark-text hover:border-walmart-blue transition-colors flex items-center justify-center gap-2">
            <span>View all {recommendations.length} recommendations</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>

      {/* Endcap Opportunities */}
      {endcapOpportunities.length > 0 && (
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Package size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-dark-text">Endcap Opportunities</h2>
              <p className="text-sm text-dark-text-secondary">
                {endcapOpportunities.length} high-traffic display locations
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {endcapOpportunities.slice(0, 4).map((opp) => (
              <EndcapCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        </div>
      )}

      {/* Cross-Category Opportunities */}
      {crossCategoryOpportunities.length > 0 && (
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <Target size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-dark-text">Cross-Category Opportunities</h2>
              <p className="text-sm text-dark-text-secondary">
                {crossCategoryOpportunities.length} product affinity insights
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {crossCategoryOpportunities.slice(0, 4).map((opp) => (
              <CrossCategoryCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Metric Box Component
function MetricBox({
  icon,
  label,
  value,
  subValue,
  trend,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue: string;
  trend: 'up' | 'down' | 'stable';
  color: 'green' | 'yellow' | 'red' | 'blue';
}) {
  const colorConfig = {
    green: 'bg-green-500/20 text-green-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    red: 'bg-red-500/20 text-red-400',
    blue: 'bg-blue-500/20 text-blue-400',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;

  return (
    <div className="glass-light p-4 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-8 rounded-lg ${colorConfig[color]} flex items-center justify-center`}>
          {icon}
        </div>
        {TrendIcon && (
          <TrendIcon size={16} className={trend === 'up' ? 'text-green-400' : 'text-red-400'} />
        )}
      </div>
      <p className="text-xs text-dark-text-secondary">{label}</p>
      <p className="text-xl font-bold text-dark-text">{value}</p>
      <p className="text-xs text-dark-text-secondary">{subValue}</p>
    </div>
  );
}

// Recommendation Card Component
function RecommendationCard({ recommendation }: { recommendation: MerchandisingRecommendation }) {
  const priority = priorityConfig[recommendation.priority];
  const effort = effortConfig[recommendation.estimatedEffort];

  return (
    <div className={`p-4 rounded-xl border ${priority.border} bg-dark-surface/50 hover:bg-dark-surface transition-colors`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${priority.bg} ${priority.text}`}>
              {priority.label}
            </span>
            <span className={`text-xs ${effort.text}`}>{effort.label}</span>
          </div>
          <h4 className="font-semibold text-dark-text">{recommendation.title}</h4>
          <p className="text-sm text-dark-text-secondary mt-1">{recommendation.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1 text-green-400">
            <DollarSign size={12} />
            <span>+${recommendation.expectedImpact.revenueChange.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 text-dark-text-secondary">
            <Clock size={12} />
            <span>{recommendation.estimatedEffort}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-dark-text-secondary">
          <span>{(recommendation.confidence * 100).toFixed(0)}% confidence</span>
        </div>
      </div>

      {/* Implementation Steps Preview */}
      <div className="mt-3 pt-3 border-t border-dark-border">
        <p className="text-xs text-dark-text-secondary mb-2">Implementation Steps:</p>
        <div className="flex flex-wrap gap-2">
          {recommendation.implementationSteps.slice(0, 3).map((step, idx) => (
            <span key={idx} className="text-xs px-2 py-1 bg-dark-border rounded-lg text-dark-text">
              {idx + 1}. {step.slice(0, 30)}...
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Endcap Card Component
function EndcapCard({ opportunity }: { opportunity: EndcapOpportunity }) {
  const isAvailable = opportunity.currentStatus === 'available';

  return (
    <div className="p-4 glass-light rounded-xl">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
              isAvailable ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {isAvailable ? 'AVAILABLE' : 'OCCUPIED'}
            </span>
          </div>
          <h4 className="font-semibold text-dark-text">{opportunity.location}</h4>
          <p className="text-xs text-dark-text-secondary">{opportunity.aisle} - {opportunity.side} side</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-spark-yellow">{opportunity.overallScore.toFixed(0)}</p>
          <p className="text-xs text-dark-text-secondary">Score</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="text-center p-2 bg-dark-surface rounded-lg">
          <p className="text-xs text-dark-text-secondary">Traffic</p>
          <p className="font-semibold text-dark-text">{opportunity.trafficScore.toFixed(0)}%</p>
        </div>
        <div className="text-center p-2 bg-dark-surface rounded-lg">
          <p className="text-xs text-dark-text-secondary">Visibility</p>
          <p className="font-semibold text-dark-text">{opportunity.visibilityScore.toFixed(0)}%</p>
        </div>
      </div>

      {opportunity.suggestedProducts.length > 0 && (
        <div className="pt-3 border-t border-dark-border">
          <p className="text-xs text-dark-text-secondary mb-2">Suggested: {opportunity.suggestedProducts[0].productName}</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-green-400">
              +${opportunity.suggestedProducts[0].estimatedRevenue.toFixed(0)}/wk
            </span>
            <span className="text-spark-yellow">
              +{opportunity.estimatedLift.toFixed(0)}% lift
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Cross-Category Card Component
function CrossCategoryCard({ opportunity }: { opportunity: CrossCategoryOpportunity }) {
  return (
    <div className="flex items-center gap-4 p-4 glass-light rounded-xl">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center shrink-0">
        <Target size={20} className="text-cyan-400" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-dark-text">{opportunity.title}</h4>
        <p className="text-sm text-dark-text-secondary">
          {opportunity.primaryCategory} + {opportunity.secondaryCategory}
        </p>
        <div className="flex items-center gap-4 mt-2 text-xs">
          <span className="text-green-400">
            +${opportunity.expectedOutcome.revenueIncrease.toFixed(0)}/wk
          </span>
          <span className="text-blue-400">
            {(opportunity.correlationStrength * 100).toFixed(0)}% correlation
          </span>
          <span className="text-purple-400">
            +{opportunity.affinity.basketLift.toFixed(0)}% basket
          </span>
        </div>
      </div>

      <div className="text-right shrink-0">
        <div className={`flex items-center gap-1 ${
          opportunity.implementation.effort === 'low' ? 'text-green-400' :
          opportunity.implementation.effort === 'medium' ? 'text-yellow-400' : 'text-orange-400'
        }`}>
          {opportunity.implementation.effort === 'low' ? (
            <CheckCircle2 size={16} />
          ) : (
            <Clock size={16} />
          )}
          <span className="text-xs capitalize">{opportunity.implementation.effort} effort</span>
        </div>
        <p className="text-xs text-dark-text-secondary mt-1">{opportunity.implementation.timeline}</p>
      </div>
    </div>
  );
}
