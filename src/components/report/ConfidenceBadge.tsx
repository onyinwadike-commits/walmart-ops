'use client';

import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

interface ConfidenceBadgeProps {
  confidence: number; // 0-1
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export default function ConfidenceBadge({
  confidence,
  size = 'md',
  showLabel = true,
  className = '',
}: ConfidenceBadgeProps) {
  // Determine confidence level
  const level = confidence >= 0.85 ? 'high' : confidence >= 0.65 ? 'medium' : 'low';

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'px-2 py-0.5 text-xs gap-1',
      icon: 12,
    },
    md: {
      container: 'px-2.5 py-1 text-sm gap-1.5',
      icon: 14,
    },
    lg: {
      container: 'px-3 py-1.5 text-base gap-2',
      icon: 16,
    },
  };

  // Level configurations
  const levelConfig = {
    high: {
      bg: 'bg-green-500/20',
      border: 'border-green-500/30',
      text: 'text-green-400',
      glow: 'shadow-[0_0_10px_rgba(34,197,94,0.2)]',
      Icon: ShieldCheck,
      label: 'High Confidence',
    },
    medium: {
      bg: 'bg-spark-yellow/20',
      border: 'border-spark-yellow/30',
      text: 'text-spark-yellow',
      glow: 'shadow-[0_0_10px_rgba(255,194,32,0.2)]',
      Icon: Shield,
      label: 'Medium Confidence',
    },
    low: {
      bg: 'bg-red-500/20',
      border: 'border-red-500/30',
      text: 'text-red-400',
      glow: 'shadow-[0_0_10px_rgba(239,68,68,0.2)]',
      Icon: ShieldAlert,
      label: 'Low Confidence',
    },
  };

  const config = levelConfig[level];
  const sizeStyles = sizeConfig[size];
  const percentage = Math.round(confidence * 100);

  return (
    <div
      className={`
        inline-flex items-center rounded-full border
        ${config.bg} ${config.border} ${config.text} ${config.glow}
        ${sizeStyles.container}
        ${className}
      `}
      title={`${config.label}: ${percentage}%`}
    >
      <config.Icon size={sizeStyles.icon} />
      <span className="font-medium">{percentage}%</span>
      {showLabel && size !== 'sm' && (
        <span className="text-dark-text-secondary hidden sm:inline">
          confidence
        </span>
      )}
    </div>
  );
}
