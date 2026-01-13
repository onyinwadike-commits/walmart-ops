'use client';

import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    label?: string;
  };
  color?: 'blue' | 'yellow' | 'green' | 'red' | 'purple' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const colorClasses = {
  blue: {
    bg: 'bg-walmart-blue/20',
    text: 'text-walmart-blue',
    glow: 'hover:shadow-[0_0_20px_rgba(0,113,206,0.3)]',
  },
  yellow: {
    bg: 'bg-spark-yellow/20',
    text: 'text-spark-yellow',
    glow: 'hover:shadow-[0_0_20px_rgba(255,194,32,0.3)]',
  },
  green: {
    bg: 'bg-green-500/20',
    text: 'text-green-400',
    glow: 'hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]',
  },
  red: {
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    glow: 'hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]',
  },
  purple: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-400',
    glow: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]',
  },
  cyan: {
    bg: 'bg-cyan-500/20',
    text: 'text-cyan-400',
    glow: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]',
  },
};

const sizeClasses = {
  sm: {
    padding: 'p-3',
    iconSize: 'w-8 h-8',
    title: 'text-xs',
    value: 'text-lg',
    subtitle: 'text-[10px]',
  },
  md: {
    padding: 'p-4',
    iconSize: 'w-10 h-10',
    title: 'text-xs',
    value: 'text-xl',
    subtitle: 'text-xs',
  },
  lg: {
    padding: 'p-5',
    iconSize: 'w-12 h-12',
    title: 'text-sm',
    value: 'text-2xl',
    subtitle: 'text-xs',
  },
};

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'blue',
  size = 'md',
  className = '',
  onClick,
}: MetricCardProps) {
  const colors = colorClasses[color];
  const sizes = sizeClasses[size];

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return <TrendingUp size={14} className="text-green-400" />;
    if (trend.value < 0) return <TrendingDown size={14} className="text-red-400" />;
    return <Minus size={14} className="text-dark-text-secondary" />;
  };

  const getTrendColor = () => {
    if (!trend) return '';
    if (trend.value > 0) return 'text-green-400';
    if (trend.value < 0) return 'text-red-400';
    return 'text-dark-text-secondary';
  };

  return (
    <div
      onClick={onClick}
      className={`glass-card ${sizes.padding} transition-all duration-300 group ${
        onClick ? 'cursor-pointer' : ''
      } ${colors.glow} ${className}`}
    >
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div
          className={`flex items-center justify-center ${sizes.iconSize} rounded-xl ${colors.bg} transition-transform duration-200 group-hover:scale-110`}
        >
          <span className={colors.text}>{icon}</span>
        </div>

        {/* Trend Indicator */}
        {trend && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-dark-surface/50">
            {getTrendIcon()}
            <span className={`text-xs font-medium ${getTrendColor()}`}>
              {trend.value > 0 ? '+' : ''}
              {trend.value.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-4">
        <p className={`${sizes.title} text-dark-text-secondary font-medium uppercase tracking-wider`}>
          {title}
        </p>
        <p className={`${sizes.value} font-bold text-dark-text mt-1 group-hover:text-white transition-colors`}>
          {value}
        </p>
        {subtitle && (
          <p className={`${sizes.subtitle} text-dark-text-secondary mt-1`}>
            {subtitle}
          </p>
        )}
        {trend?.label && (
          <p className={`text-xs mt-2 ${getTrendColor()}`}>
            {trend.label}
          </p>
        )}
      </div>

      {/* Decorative Accent Line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        style={{
          background: `linear-gradient(90deg, ${
            color === 'blue' ? '#0071CE' :
            color === 'yellow' ? '#FFC220' :
            color === 'green' ? '#22C55E' :
            color === 'red' ? '#EF4444' :
            color === 'purple' ? '#A855F7' :
            '#06B6D4'
          }, transparent)`,
        }}
      />
    </div>
  );
}
