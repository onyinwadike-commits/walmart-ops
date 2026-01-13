'use client';

import { useState, useMemo } from 'react';
import {
  LayoutGrid,
  Layers,
  Eye,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Package,
  DollarSign,
  BarChart3,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Info,
} from 'lucide-react';
import {
  Planogram,
  ShelfSection,
  ProductPlacement,
  HeatmapData,
  OptimizationStatus,
  ShelfLevel,
} from '@/lib/visual/types';

interface PlanogramViewerProps {
  planogram: Planogram;
  heatmapData?: HeatmapData;
  showHeatmap?: boolean;
  onToggleHeatmap?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  className?: string;
}

const statusConfig: Record<OptimizationStatus, { bg: string; border: string; text: string; label: string }> = {
  optimal: {
    bg: 'bg-green-500/20',
    border: 'border-green-500/30',
    text: 'text-green-400',
    label: 'OPTIMAL',
  },
  good: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    label: 'GOOD',
  },
  needs_improvement: {
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    label: 'NEEDS WORK',
  },
  critical: {
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
    text: 'text-red-400',
    label: 'CRITICAL',
  },
};

const shelfLevelLabels: Record<ShelfLevel, string> = {
  floor: 'Floor',
  bottom: 'Bottom',
  lower: 'Lower',
  middle: 'Middle',
  eye: 'Eye Level',
  upper: 'Upper',
  top: 'Top',
};

const shelfLevelOrder: ShelfLevel[] = ['top', 'upper', 'eye', 'middle', 'lower', 'bottom', 'floor'];

export default function PlanogramViewer({
  planogram,
  heatmapData,
  showHeatmap = false,
  onToggleHeatmap,
  onRefresh,
  isRefreshing = false,
  className = '',
}: PlanogramViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [selectedProduct, setSelectedProduct] = useState<ProductPlacement | null>(null);
  const [hoveredShelf, setHoveredShelf] = useState<ShelfLevel | null>(null);

  const config = statusConfig[planogram.status];

  // Sort sections by shelf level order
  const sortedSections = useMemo(() => {
    return [...planogram.sections].sort((a, b) => {
      return shelfLevelOrder.indexOf(a.level) - shelfLevelOrder.indexOf(b.level);
    });
  }, [planogram.sections]);

  // Calculate heatmap overlay opacity for a position
  const getHeatmapIntensity = (x: number, y: number): number => {
    if (!heatmapData || !showHeatmap) return 0;

    const nearestPoint = heatmapData.dataPoints.reduce((nearest, point) => {
      const dist = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
      const nearestDist = Math.sqrt(Math.pow(nearest.x - x, 2) + Math.pow(nearest.y - y, 2));
      return dist < nearestDist ? point : nearest;
    });

    return nearestPoint.intensity;
  };

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div className={`glass-card p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-walmart-blue to-walmart-blue-dark flex items-center justify-center">
            <LayoutGrid size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-dark-text">{planogram.name}</h2>
            <p className="text-sm text-dark-text-secondary">
              {planogram.aisle} - Bay {planogram.bayNumber} | {planogram.displayType.replace('_', ' ')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} ${config.border} border`}>
            {planogram.status === 'optimal' && <CheckCircle size={14} className={config.text} />}
            {planogram.status === 'good' && <TrendingUp size={14} className={config.text} />}
            {planogram.status === 'needs_improvement' && <AlertTriangle size={14} className={config.text} />}
            {planogram.status === 'critical' && <TrendingDown size={14} className={config.text} />}
            <span className={`text-xs font-bold ${config.text}`}>{config.label}</span>
          </div>

          {/* Heatmap Toggle */}
          {onToggleHeatmap && (
            <button
              onClick={onToggleHeatmap}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-colors ${
                showHeatmap
                  ? 'bg-spark-yellow/20 border-spark-yellow/30 text-spark-yellow'
                  : 'bg-dark-surface border-dark-border text-dark-text-secondary hover:text-dark-text'
              }`}
            >
              <Eye size={16} />
              <span className="text-sm">Heatmap</span>
            </button>
          )}

          {/* Refresh Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-surface border border-dark-border text-dark-text-secondary hover:text-dark-text transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard
          icon={<Package size={18} />}
          label="Products"
          value={planogram.totalProducts}
          subValue={`${planogram.totalFacings} facings`}
          color="blue"
        />
        <MetricCard
          icon={<DollarSign size={18} />}
          label="Weekly Revenue"
          value={formatCurrency(planogram.revenuePerWeek)}
          subValue={`${formatCurrency(planogram.marginPerWeek)} margin`}
          color="green"
        />
        <MetricCard
          icon={<BarChart3 size={18} />}
          label="Optimization Score"
          value={`${planogram.optimizationScore.toFixed(0)}%`}
          subValue={`v${planogram.version}`}
          color="yellow"
        />
        <MetricCard
          icon={<Layers size={18} />}
          label="Dimensions"
          value={`${planogram.width}" x ${planogram.height}"`}
          subValue={`${planogram.depth}" deep`}
          color="purple"
        />
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-dark-text-secondary">Shelf Layout</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(Math.max(50, zoom - 25))}
            className="p-1.5 rounded-lg bg-dark-surface border border-dark-border text-dark-text-secondary hover:text-dark-text transition-colors"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-sm text-dark-text-secondary w-12 text-center">{zoom}%</span>
          <button
            onClick={() => setZoom(Math.min(200, zoom + 25))}
            className="p-1.5 rounded-lg bg-dark-surface border border-dark-border text-dark-text-secondary hover:text-dark-text transition-colors"
          >
            <ZoomIn size={16} />
          </button>
        </div>
      </div>

      {/* Planogram Visualization */}
      <div
        className="glass-light rounded-xl p-4 overflow-auto"
        style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
      >
        <div className="space-y-2">
          {sortedSections.map((section, sectionIdx) => (
            <ShelfRow
              key={section.id}
              section={section}
              isHovered={hoveredShelf === section.level}
              onHover={() => setHoveredShelf(section.level)}
              onLeave={() => setHoveredShelf(null)}
              onProductSelect={setSelectedProduct}
              selectedProductId={selectedProduct?.id}
              heatmapIntensity={showHeatmap ? getHeatmapIntensity(50, (sectionIdx / sortedSections.length) * 100) : 0}
            />
          ))}
        </div>
      </div>

      {/* Selected Product Detail */}
      {selectedProduct && (
        <div className="mt-4 p-4 glass-light rounded-xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-dark-text">{selectedProduct.productName}</h4>
                {selectedProduct.isPromoted && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-spark-yellow/20 text-spark-yellow">
                    {selectedProduct.promotionType?.toUpperCase() || 'PROMO'}
                  </span>
                )}
              </div>
              <p className="text-sm text-dark-text-secondary">{selectedProduct.brand} - {selectedProduct.category}</p>
            </div>
            <button
              onClick={() => setSelectedProduct(null)}
              className="p-1 rounded-lg text-dark-text-secondary hover:text-dark-text transition-colors"
            >
              <Info size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <p className="text-xs text-dark-text-secondary">Price</p>
              <p className="font-semibold text-dark-text">${selectedProduct.pricePoint.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-dark-text-secondary">Facings</p>
              <p className="font-semibold text-dark-text">{selectedProduct.facings} x {selectedProduct.depth} deep</p>
            </div>
            <div>
              <p className="text-xs text-dark-text-secondary">Velocity</p>
              <p className="font-semibold text-dark-text">{selectedProduct.salesVelocity} units/wk</p>
            </div>
            <div>
              <p className="text-xs text-dark-text-secondary">Days of Supply</p>
              <p className={`font-semibold ${selectedProduct.daysOfSupply < 5 ? 'text-red-400' : 'text-dark-text'}`}>
                {selectedProduct.daysOfSupply} days
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Heatmap Legend */}
      {showHeatmap && heatmapData && (
        <div className="mt-4 flex items-center justify-between p-3 glass-light rounded-xl">
          <span className="text-sm text-dark-text-secondary">Attention Heatmap</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-dark-text-secondary">Low</span>
            <div className="flex gap-0.5">
              {['#3B82F6', '#22C55E', '#EAB308', '#F97316', '#EF4444'].map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-3 rounded-sm"
                  style={{ backgroundColor: color, opacity: 0.3 + i * 0.15 }}
                />
              ))}
            </div>
            <span className="text-xs text-dark-text-secondary">High</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Shelf Row Component
function ShelfRow({
  section,
  isHovered,
  onHover,
  onLeave,
  onProductSelect,
  selectedProductId,
  heatmapIntensity,
}: {
  section: ShelfSection;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onProductSelect: (product: ProductPlacement) => void;
  selectedProductId?: string;
  heatmapIntensity: number;
}) {
  const isEyeLevel = section.level === 'eye';

  return (
    <div
      className={`relative p-3 rounded-lg border transition-all ${
        isHovered ? 'border-walmart-blue bg-walmart-blue/10' : 'border-dark-border bg-dark-surface/50'
      } ${isEyeLevel ? 'ring-2 ring-spark-yellow/30' : ''}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Heatmap Overlay */}
      {heatmapIntensity > 0 && (
        <div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, rgba(255, 194, 32, ${heatmapIntensity * 0.4}) 0%, transparent 70%)`,
          }}
        />
      )}

      <div className="flex items-center gap-4">
        {/* Shelf Label */}
        <div className={`w-20 shrink-0 ${isEyeLevel ? 'text-spark-yellow' : 'text-dark-text-secondary'}`}>
          <p className="text-xs font-semibold">{shelfLevelLabels[section.level]}</p>
          <p className="text-xs opacity-70">{section.utilizationPercent.toFixed(0)}% full</p>
        </div>

        {/* Products */}
        <div className="flex-1 flex gap-1 overflow-x-auto">
          {section.products.map(product => (
            <button
              key={product.id}
              onClick={() => onProductSelect(product)}
              className={`relative shrink-0 rounded-lg p-2 transition-all ${
                selectedProductId === product.id
                  ? 'bg-walmart-blue/30 border-walmart-blue'
                  : 'bg-dark-border hover:bg-dark-surface'
              } border border-dark-border hover:border-walmart-blue/50`}
              style={{
                minWidth: `${Math.max(60, product.facings * 20)}px`,
              }}
            >
              {product.isPromoted && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-spark-yellow rounded-full" />
              )}
              {product.daysOfSupply < 5 && (
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              )}
              <p className="text-xs text-dark-text truncate">{product.productName.slice(0, 15)}</p>
              <p className="text-xs text-dark-text-secondary">{product.facings}F</p>
            </button>
          ))}
        </div>

        {/* Shelf Metrics */}
        <div className="w-24 shrink-0 text-right">
          <p className="text-xs text-dark-text">${section.revenuePerLinearInch.toFixed(2)}/in</p>
          <p className="text-xs text-dark-text-secondary">{section.averageMargin.toFixed(0)}% margin</p>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({
  icon,
  label,
  value,
  subValue,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  color: 'blue' | 'green' | 'yellow' | 'purple';
}) {
  const colorConfig = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    purple: 'bg-purple-500/20 text-purple-400',
  };

  return (
    <div className="glass-light p-3 rounded-xl">
      <div className={`w-8 h-8 rounded-lg ${colorConfig[color]} flex items-center justify-center mb-2`}>
        {icon}
      </div>
      <p className="text-xs text-dark-text-secondary">{label}</p>
      <p className="text-lg font-bold text-dark-text">{value}</p>
      {subValue && <p className="text-xs text-dark-text-secondary">{subValue}</p>}
    </div>
  );
}
