'use client';

import { TrendingUp, TrendingDown, Minus, Package, Truck, Store, ShoppingCart } from 'lucide-react';
import { PriceComparison } from '@/lib/amazon/types';

interface PriceComparisonCardProps {
  comparison: PriceComparison;
  className?: string;
}

const statusConfig = {
  winning: {
    bg: 'bg-green-500/20',
    border: 'border-green-500/30',
    text: 'text-green-400',
    label: 'WINNING',
    icon: TrendingUp,
  },
  losing: {
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
    text: 'text-red-400',
    label: 'LOSING',
    icon: TrendingDown,
  },
  competitive: {
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    label: 'COMPETITIVE',
    icon: Minus,
  },
  unknown: {
    bg: 'bg-gray-500/20',
    border: 'border-gray-500/30',
    text: 'text-gray-400',
    label: 'UNKNOWN',
    icon: Minus,
  },
};

export default function PriceComparisonCard({
  comparison,
  className = '',
}: PriceComparisonCardProps) {
  const config = statusConfig[comparison.status];
  const StatusIcon = config.icon;

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatPercent = (percent: number) => {
    const sign = percent > 0 ? '+' : '';
    return `${sign}${percent.toFixed(1)}%`;
  };

  return (
    <div
      className={`glass-card p-4 border ${config.border} hover:border-opacity-60 transition-all group ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="text-sm font-semibold text-dark-text truncate group-hover:text-white transition-colors">
            {comparison.match.walmartProduct.title}
          </h3>
          <p className="text-xs text-dark-text-secondary mt-1">
            Category: {comparison.match.walmartProduct.category}
          </p>
        </div>

        {/* Status Badge */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bg} ${config.border} border shrink-0`}
        >
          <StatusIcon size={14} className={config.text} />
          <span className={`text-xs font-bold ${config.text}`}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Price Comparison */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Walmart Price */}
        <div className="glass-light p-3 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md bg-walmart-blue/30 flex items-center justify-center">
              <Store size={14} className="text-walmart-blue" />
            </div>
            <span className="text-xs text-dark-text-secondary">Walmart</span>
          </div>
          <p className="text-lg font-bold text-dark-text">
            {formatPrice(comparison.walmartPrice)}
          </p>
          {comparison.match.walmartProduct.rollbackPrice && (
            <p className="text-xs text-green-400 mt-1">
              Rollback from {formatPrice(comparison.match.walmartProduct.price)}
            </p>
          )}
        </div>

        {/* Amazon Price */}
        <div className="glass-light p-3 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md bg-orange-500/30 flex items-center justify-center">
              <ShoppingCart size={14} className="text-orange-400" />
            </div>
            <span className="text-xs text-dark-text-secondary">Amazon</span>
          </div>
          <p className="text-lg font-bold text-dark-text">
            {formatPrice(comparison.amazonPrice)}
          </p>
          {comparison.match.amazonProduct.isPrime && (
            <p className="text-xs text-blue-400 mt-1">Prime eligible</p>
          )}
        </div>
      </div>

      {/* Price Difference */}
      <div
        className={`flex items-center justify-between p-3 rounded-xl ${config.bg} mb-4`}
      >
        <span className="text-xs text-dark-text-secondary">Price Difference</span>
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold ${config.text}`}>
            {formatPrice(Math.abs(comparison.priceDifference))}
          </span>
          <span className={`text-sm ${config.text}`}>
            ({formatPercent(comparison.priceDifferencePercent)})
          </span>
        </div>
      </div>

      {/* Advantages */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Walmart Advantages */}
        {comparison.walmartAdvantages.length > 0 && (
          <div>
            <p className="text-xs text-dark-text-secondary mb-2">Walmart Advantages</p>
            <ul className="space-y-1">
              {comparison.walmartAdvantages.slice(0, 3).map((adv, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-walmart-blue mt-1.5 shrink-0" />
                  <span className="text-xs text-dark-text">{adv}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Amazon Advantages */}
        {comparison.amazonAdvantages.length > 0 && (
          <div>
            <p className="text-xs text-dark-text-secondary mb-2">Amazon Advantages</p>
            <ul className="space-y-1">
              {comparison.amazonAdvantages.slice(0, 3).map((adv, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                  <span className="text-xs text-dark-text">{adv}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recommendation */}
      <div className="p-3 rounded-xl bg-dark-surface/50 border border-dark-border">
        <p className="text-xs text-dark-text-secondary mb-1">Recommendation</p>
        <p className="text-sm text-dark-text">{comparison.recommendation}</p>
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-border">
        <div className="flex items-center gap-4 text-xs text-dark-text-secondary">
          <span className="flex items-center gap-1">
            <Package size={12} />
            {comparison.match.walmartProduct.inStockStores.length} stores
          </span>
          <span className="flex items-center gap-1">
            <Truck size={12} />
            {comparison.match.walmartProduct.deliveryDays}d delivery
          </span>
        </div>
        <span className="text-xs text-spark-yellow">
          Impact: ${comparison.potentialRevenueImpact.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
