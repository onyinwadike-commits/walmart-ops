'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  Shield,
  Truck,
  Star,
  RefreshCw,
} from 'lucide-react';
import { CompetitorData, CompetitiveScore, ProductCategory } from '@/lib/amazon/types';

interface CompetitorDashboardProps {
  competitorData: CompetitorData;
  competitiveScore: CompetitiveScore;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  className?: string;
}

const categoryColors: Record<ProductCategory, string> = {
  electronics: '#3B82F6',
  grocery: '#22C55E',
  home: '#A855F7',
  apparel: '#EC4899',
  toys: '#EF4444',
  health: '#10B981',
  automotive: '#6B7280',
  sports: '#F97316',
  garden: '#84CC16',
  office: '#64748B',
};

export default function CompetitorDashboard({
  competitorData,
  competitiveScore,
  onRefresh,
  isRefreshing = false,
  className = '',
}: CompetitorDashboardProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate score on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(competitiveScore.overall);
    }, 100);
    return () => clearTimeout(timer);
  }, [competitiveScore.overall]);

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 70) return 'from-green-500 to-emerald-500';
    if (score >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-orange-500';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={14} className="text-green-400" />;
      case 'down':
        return <TrendingDown size={14} className="text-red-400" />;
      default:
        return <Minus size={14} className="text-gray-400" />;
    }
  };

  const winRate = (competitorData.winningCount / competitorData.totalProductsTracked) * 100;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Score Card */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-spark-yellow to-spark-orange flex items-center justify-center">
              <Target size={24} className="text-dark-bg" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-dark-text">Competitive Score</h2>
              <p className="text-sm text-dark-text-secondary">
                vs Amazon Market Position
              </p>
            </div>
          </div>

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-surface border border-dark-border text-dark-text hover:bg-dark-border transition-colors disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={isRefreshing ? 'animate-spin' : ''}
              />
              Refresh
            </button>
          )}
        </div>

        {/* Main Score Circle */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-48 h-48">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-dark-surface"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                strokeWidth="12"
                strokeLinecap="round"
                className={`text-transparent bg-gradient-to-r ${getScoreGradient(
                  competitiveScore.overall
                )}`}
                style={{
                  stroke: `url(#scoreGradient)`,
                  strokeDasharray: `${(animatedScore / 100) * 553} 553`,
                  transition: 'stroke-dasharray 1s ease-out',
                }}
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFC220" />
                  <stop offset="100%" stopColor="#FF8200" />
                </linearGradient>
              </defs>
            </svg>

            {/* Score Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-5xl font-bold ${getScoreColor(competitiveScore.overall)}`}>
                {animatedScore}
              </span>
              <span className="text-sm text-dark-text-secondary">out of 100</span>
              <div className="flex items-center gap-1 mt-2">
                {getTrendIcon(competitiveScore.trendDirection === 'improving' ? 'up' : competitiveScore.trendDirection === 'declining' ? 'down' : 'stable')}
                <span className={`text-xs ${
                  competitiveScore.changeFromLastWeek > 0
                    ? 'text-green-400'
                    : competitiveScore.changeFromLastWeek < 0
                    ? 'text-red-400'
                    : 'text-gray-400'
                }`}>
                  {competitiveScore.changeFromLastWeek > 0 ? '+' : ''}
                  {competitiveScore.changeFromLastWeek}% this week
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Benchmarks */}
        <div className="flex items-center justify-center gap-8 text-sm">
          <div className="text-center">
            <p className="text-dark-text-secondary">Market Avg</p>
            <p className="font-bold text-yellow-400">{competitiveScore.benchmarks.marketAverage}</p>
          </div>
          <div className="text-center">
            <p className="text-dark-text-secondary">Top Performer</p>
            <p className="font-bold text-green-400">{competitiveScore.benchmarks.topPerformer}</p>
          </div>
          <div className="text-center">
            <p className="text-dark-text-secondary">Bottom Performer</p>
            <p className="font-bold text-red-400">{competitiveScore.benchmarks.bottomPerformer}</p>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <ScoreMetric
          icon={<BarChart3 size={20} />}
          label="Price"
          value={competitiveScore.priceCompetitiveness}
          color="blue"
        />
        <ScoreMetric
          icon={<Zap size={20} />}
          label="Service"
          value={competitiveScore.serviceAdvantage}
          color="yellow"
        />
        <ScoreMetric
          icon={<Shield size={20} />}
          label="Stock"
          value={competitiveScore.stockAvailability}
          color="green"
        />
        <ScoreMetric
          icon={<Truck size={20} />}
          label="Delivery"
          value={competitiveScore.deliverySpeed}
          color="purple"
        />
        <ScoreMetric
          icon={<Star size={20} />}
          label="Experience"
          value={competitiveScore.customerExperience}
          color="orange"
        />
      </div>

      {/* Win/Loss Stats */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <PieChart size={20} className="text-spark-yellow" />
          <h3 className="text-lg font-semibold text-dark-text">
            Price Competition Summary
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass-light p-4 rounded-xl text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-green-500/20 flex items-center justify-center">
              <TrendingUp size={20} className="text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400">
              {competitorData.winningCount}
            </p>
            <p className="text-xs text-dark-text-secondary">
              Products Winning
            </p>
          </div>
          <div className="glass-light p-4 rounded-xl text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Minus size={20} className="text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-yellow-400">
              {competitorData.competitiveCount}
            </p>
            <p className="text-xs text-dark-text-secondary">
              Competitive
            </p>
          </div>
          <div className="glass-light p-4 rounded-xl text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-red-500/20 flex items-center justify-center">
              <TrendingDown size={20} className="text-red-400" />
            </div>
            <p className="text-2xl font-bold text-red-400">
              {competitorData.losingCount}
            </p>
            <p className="text-xs text-dark-text-secondary">
              Products Losing
            </p>
          </div>
        </div>

        {/* Win Rate Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-dark-text-secondary">Win Rate</span>
            <span className={`text-sm font-bold ${
              winRate >= 50 ? 'text-green-400' : 'text-red-400'
            }`}>
              {winRate.toFixed(1)}%
            </span>
          </div>
          <div className="h-3 bg-dark-surface rounded-full overflow-hidden flex">
            <div
              className="h-full bg-green-500"
              style={{ width: `${(competitorData.winningCount / competitorData.totalProductsTracked) * 100}%` }}
            />
            <div
              className="h-full bg-yellow-500"
              style={{ width: `${(competitorData.competitiveCount / competitorData.totalProductsTracked) * 100}%` }}
            />
            <div
              className="h-full bg-red-500"
              style={{ width: `${(competitorData.losingCount / competitorData.totalProductsTracked) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-dark-text-secondary">
            <span>Total: {competitorData.totalProductsTracked} products tracked</span>
            <span>Avg Diff: {competitorData.averagePriceDifference.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Category Performance */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity size={20} className="text-walmart-blue" />
          <h3 className="text-lg font-semibold text-dark-text">
            Category Performance
          </h3>
        </div>

        <div className="space-y-3">
          {competitiveScore.breakdown.map((cat) => (
            <div key={cat.category} className="flex items-center gap-4">
              <div className="w-24 text-sm text-dark-text capitalize">{cat.category}</div>
              <div className="flex-1 h-4 bg-dark-surface rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${cat.score}%`,
                    backgroundColor: categoryColors[cat.category],
                  }}
                />
              </div>
              <div className="flex items-center gap-2 w-20 justify-end">
                {getTrendIcon(cat.trend)}
                <span className={`text-sm font-medium ${getScoreColor(cat.score)}`}>
                  {cat.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Score Metric Sub-component
function ScoreMetric({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'blue' | 'yellow' | 'green' | 'purple' | 'orange';
}) {
  const colorConfig = {
    blue: 'bg-blue-500/20 text-blue-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    green: 'bg-green-500/20 text-green-400',
    purple: 'bg-purple-500/20 text-purple-400',
    orange: 'bg-orange-500/20 text-orange-400',
  };

  const getValueColor = (val: number) => {
    if (val >= 70) return 'text-green-400';
    if (val >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="glass-card p-4">
      <div className={`w-10 h-10 rounded-xl ${colorConfig[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-xs text-dark-text-secondary mb-1">{label}</p>
      <p className={`text-2xl font-bold ${getValueColor(value)}`}>
        {value}
      </p>
    </div>
  );
}
