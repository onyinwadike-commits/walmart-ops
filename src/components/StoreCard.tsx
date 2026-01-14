'use client';

import {
  MapPin,
  Calendar,
  Building2,
  Users,
  Clock,
  Phone,
  Star,
} from 'lucide-react';
import { Store } from '@/data/stores';

interface StoreCardProps {
  store: Store;
  isSelected?: boolean;
  onSelect?: () => void;
}

// Helper to format tier display
function getTierColor(tier: Store['tier']): string {
  switch (tier) {
    case 'A+': return 'text-green-400 bg-green-500/20';
    case 'A': return 'text-blue-400 bg-blue-500/20';
    case 'B+': return 'text-purple-400 bg-purple-500/20';
    case 'B': return 'text-yellow-400 bg-yellow-500/20';
    case 'C+': return 'text-orange-400 bg-orange-500/20';
    default: return 'text-gray-400 bg-gray-500/20';
  }
}

export default function StoreCard({ store, isSelected = false, onSelect }: StoreCardProps) {
  const tierColor = getTierColor(store.tier);

  return (
    <div
      onClick={onSelect}
      className={`glass-card p-6 transition-all duration-300 cursor-pointer group relative ${
        isSelected
          ? 'ring-2 ring-walmart-blue neon-blue'
          : 'hover:ring-1 hover:ring-walmart-blue/50'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
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
        <div className="flex flex-col items-end gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${tierColor}`}>
            Tier {store.tier}
          </span>
          {isSelected && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-spark-yellow/20">
              <span className="w-2 h-2 rounded-full bg-spark-yellow animate-pulse" />
              <span className="text-xs font-medium text-spark-yellow">Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="flex items-start gap-2 mb-4 text-sm text-dark-text-secondary">
        <MapPin size={14} className="text-walmart-blue mt-0.5 shrink-0" />
        <span>{store.address}, {store.city}, {store.state} {store.zip}</span>
      </div>

      {/* Store Info Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="glass-light p-3 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <Building2 size={14} className="text-walmart-blue" />
            <span className="text-xs text-dark-text-secondary">Format</span>
          </div>
          <p className="text-sm font-semibold text-dark-text">{store.format}</p>
        </div>

        <div className="glass-light p-3 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <Users size={14} className="text-purple-400" />
            <span className="text-xs text-dark-text-secondary">Daily Traffic</span>
          </div>
          <p className="text-sm font-semibold text-dark-text">{store.avgDailyTraffic.toLocaleString()}</p>
        </div>

        <div className="glass-light p-3 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={14} className="text-spark-yellow" />
            <span className="text-xs text-dark-text-secondary">Opened</span>
          </div>
          <p className="text-sm font-semibold text-dark-text">{new Date(store.openDate).getFullYear()}</p>
        </div>

        <div className="glass-light p-3 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <Star size={14} className="text-green-400" />
            <span className="text-xs text-dark-text-secondary">Sq Ft</span>
          </div>
          <p className="text-sm font-semibold text-dark-text">{(store.sqft / 1000).toFixed(0)}K</p>
        </div>
      </div>

      {/* Peak Hours */}
      <div className="flex items-center gap-2 mb-4">
        <Clock size={14} className="text-dark-text-secondary" />
        <span className="text-xs text-dark-text-secondary">Peak Hours:</span>
        <div className="flex gap-2">
          {store.peakHours.map((hours, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded bg-dark-surface text-dark-text">
              {hours}
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="flex flex-wrap gap-2 mb-4">
        {store.features.slice(0, 3).map((feature, i) => (
          <span key={i} className="text-xs px-2 py-1 rounded-full bg-walmart-blue/10 text-walmart-blue">
            {feature}
          </span>
        ))}
        {store.features.length > 3 && (
          <span className="text-xs px-2 py-1 rounded-full bg-dark-surface text-dark-text-secondary">
            +{store.features.length - 3} more
          </span>
        )}
      </div>

      {/* Phone */}
      <div className="flex items-center gap-2 pt-3 border-t border-dark-border">
        <Phone size={14} className="text-dark-text-secondary" />
        <span className="text-sm text-dark-text-secondary">{store.phone}</span>
      </div>

      {/* Competitor Proximity Indicator */}
      {store.competitorProximity.target < 1.5 && (
        <div className="absolute top-4 left-4 flex items-center px-2 py-1 rounded-full bg-red-500/20">
          <span className="text-[10px] font-medium text-red-400">Target nearby</span>
        </div>
      )}
    </div>
  );
}
