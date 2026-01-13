'use client';

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Star,
  Users,
  Package,
  MapPin,
  Calendar,
  Building2
} from 'lucide-react';
import { Store } from '@/data/stores';

interface StoreCardProps {
  store: Store;
  isSelected?: boolean;
  onSelect?: () => void;
}

// Helper to format large numbers
function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
}

// Helper to format percentage with trend
function formatPercent(value: number): { text: string; isPositive: boolean } {
  return {
    text: `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`,
    isPositive: value >= 0,
  };
}

export default function StoreCard({ store, isSelected = false, onSelect }: StoreCardProps) {
  const compTrend = formatPercent(store.metrics.compPercent);

  return (
    <div
      onClick={onSelect}
      className={`glass-card p-6 transition-all duration-300 cursor-pointer group ${
        isSelected
          ? 'ring-2 ring-walmart-blue neon-blue'
          : 'hover:ring-1 hover:ring-walmart-blue/50'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all ${
              isSelected
                ? 'bg-walmart-blue text-white'
                : 'bg-walmart-blue/20 text-walmart-blue group-hover:bg-walmart-blue/30'
            }`}
          >
            <Building2 size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-dark-text group-hover:text-white transition-colors">
              Store #{store.number}
            </h3>
            <p className="text-sm text-dark-text-secondary">{store.name}</p>
          </div>
        </div>
        {isSelected && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-spark-yellow/20">
            <span className="w-2 h-2 rounded-full bg-spark-yellow animate-pulse" />
            <span className="text-xs font-medium text-spark-yellow">Active</span>
          </div>
        )}
      </div>

      {/* Location Info */}
      <div className="flex items-center gap-4 mb-6 text-sm text-dark-text-secondary">
        <div className="flex items-center gap-1.5">
          <MapPin size={14} className="text-walmart-blue" />
          <span>{store.city}, {store.state}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={14} className="text-spark-yellow" />
          <span>Since {new Date(store.openDate).getFullYear()}</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Sales YTD */}
        <div className="glass-light p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-green-500/20">
              <DollarSign size={14} className="text-green-400" />
            </div>
            <span className="text-xs text-dark-text-secondary">Sales YTD</span>
          </div>
          <p className="text-xl font-bold text-dark-text">
            {formatCurrency(store.metrics.salesYTD)}
          </p>
        </div>

        {/* Comp % */}
        <div className="glass-light p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-1.5 rounded-lg ${compTrend.isPositive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              {compTrend.isPositive ? (
                <TrendingUp size={14} className="text-green-400" />
              ) : (
                <TrendingDown size={14} className="text-red-400" />
              )}
            </div>
            <span className="text-xs text-dark-text-secondary">Comp %</span>
          </div>
          <p className={`text-xl font-bold ${compTrend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {compTrend.text}
          </p>
        </div>

        {/* Customer Satisfaction */}
        <div className="glass-light p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-spark-yellow/20">
              <Star size={14} className="text-spark-yellow" />
            </div>
            <span className="text-xs text-dark-text-secondary">CSAT</span>
          </div>
          <p className="text-xl font-bold text-spark-yellow">
            {store.metrics.customerSatisfaction.toFixed(1)}
          </p>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-walmart-blue" />
            <span className="text-sm text-dark-text-secondary">
              <span className="text-dark-text font-medium">{store.associates}</span> associates
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Package size={14} className="text-walmart-blue" />
            <span className="text-sm text-dark-text-secondary">
              <span className="text-dark-text font-medium">{store.metrics.inventoryAccuracy}%</span> accuracy
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-dark-text-secondary">Engagement:</span>
          <div className="w-16 h-2 rounded-full bg-dark-surface overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${store.metrics.associateEngagement}%`,
                background: `linear-gradient(90deg, #0071CE, ${
                  store.metrics.associateEngagement > 80 ? '#22C55E' : '#FFC220'
                })`,
              }}
            />
          </div>
          <span className="text-xs font-medium text-dark-text">
            {store.metrics.associateEngagement}%
          </span>
        </div>
      </div>

      {/* Store Format Badge */}
      <div className="absolute top-4 right-4 hidden group-hover:flex items-center px-2 py-1 rounded-full bg-dark-surface/80 backdrop-blur-sm animate-fade-in">
        <span className="text-[10px] font-medium text-dark-text-secondary uppercase">
          {store.format}
        </span>
      </div>
    </div>
  );
}
