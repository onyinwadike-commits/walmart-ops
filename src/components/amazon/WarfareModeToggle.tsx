'use client';

import { useState } from 'react';
import {
  Swords,
  Shield,
  Zap,
  AlertTriangle,
  Settings,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { WarfareModeSettings } from '@/lib/amazon/types';

interface WarfareModeToggleProps {
  settings: WarfareModeSettings;
  onToggle: (enabled: boolean) => void;
  onSettingsChange?: (settings: Partial<WarfareModeSettings>) => void;
  className?: string;
}

const aggressivenessConfig = {
  conservative: {
    label: 'Conservative',
    description: 'Monitor only, minimal automatic actions',
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
  },
  moderate: {
    label: 'Moderate',
    description: 'Balanced approach with selective responses',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/20',
  },
  aggressive: {
    label: 'Aggressive',
    description: 'Maximum competitive response, auto price matching',
    color: 'text-red-400',
    bg: 'bg-red-500/20',
  },
};

export default function WarfareModeToggle({
  settings,
  onToggle,
  onSettingsChange,
  className = '',
}: WarfareModeToggleProps) {
  const [showSettings, setShowSettings] = useState(false);
  const aggConfig = aggressivenessConfig[settings.aggressiveness];

  return (
    <div className={`glass-card overflow-hidden ${className}`}>
      {/* Main Toggle Section */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Icon with animated glow when active */}
            <div
              className={`relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 ${
                settings.enabled
                  ? 'bg-gradient-to-br from-red-500 to-orange-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]'
                  : 'bg-dark-surface border border-dark-border'
              }`}
            >
              <Swords
                size={28}
                className={`transition-all duration-300 ${
                  settings.enabled ? 'text-white' : 'text-dark-text-secondary'
                }`}
              />
              {settings.enabled && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 animate-pulse opacity-50" />
              )}
            </div>

            <div>
              <h3 className="text-lg font-bold text-dark-text flex items-center gap-2">
                Amazon Warfare Mode
                {settings.enabled && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs">
                    <Zap size={12} />
                    ACTIVE
                  </span>
                )}
              </h3>
              <p className="text-sm text-dark-text-secondary">
                {settings.enabled
                  ? `${aggConfig.label} mode - monitoring ${settings.focusCategories.length || 'all'} categories`
                  : 'Enable to activate competitive monitoring'}
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={() => onToggle(!settings.enabled)}
            className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
              settings.enabled
                ? 'bg-gradient-to-r from-red-500 to-orange-500'
                : 'bg-dark-surface border border-dark-border'
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-300 shadow-lg ${
                settings.enabled ? 'left-9' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Quick Stats when enabled */}
        {settings.enabled && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className={`px-3 py-2 rounded-xl ${aggConfig.bg}`}>
              <p className="text-xs text-dark-text-secondary">Mode</p>
              <p className={`text-sm font-medium ${aggConfig.color}`}>
                {aggConfig.label}
              </p>
            </div>
            <div className="px-3 py-2 rounded-xl bg-dark-surface/50">
              <p className="text-xs text-dark-text-secondary">Alert Threshold</p>
              <p className="text-sm font-medium text-dark-text">
                {settings.alertThreshold}%
              </p>
            </div>
            <div className="px-3 py-2 rounded-xl bg-dark-surface/50">
              <p className="text-xs text-dark-text-secondary">Refresh</p>
              <p className="text-sm font-medium text-dark-text">
                {settings.refreshInterval}min
              </p>
            </div>
          </div>
        )}

        {/* Settings Toggle */}
        {settings.enabled && onSettingsChange && (
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-sm text-dark-text-secondary hover:text-dark-text transition-colors border-t border-dark-border"
          >
            <Settings size={16} />
            {showSettings ? 'Hide' : 'Show'} Settings
            {showSettings ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>

      {/* Expanded Settings */}
      {showSettings && settings.enabled && onSettingsChange && (
        <div className="px-4 pb-4 border-t border-dark-border">
          <div className="pt-4 space-y-4">
            {/* Aggressiveness Level */}
            <div>
              <label className="text-sm text-dark-text-secondary mb-2 block">
                Aggressiveness Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(aggressivenessConfig) as Array<keyof typeof aggressivenessConfig>).map(
                  (level) => {
                    const config = aggressivenessConfig[level];
                    const isActive = settings.aggressiveness === level;
                    return (
                      <button
                        key={level}
                        onClick={() =>
                          onSettingsChange({ aggressiveness: level })
                        }
                        className={`p-3 rounded-xl border transition-all ${
                          isActive
                            ? `${config.bg} border-current ${config.color}`
                            : 'bg-dark-surface border-dark-border text-dark-text-secondary hover:border-dark-text'
                        }`}
                      >
                        <div className="text-sm font-medium">{config.label}</div>
                        <div className="text-xs opacity-75 mt-1">
                          {config.description}
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Alert Threshold */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-dark-text-secondary">
                  Alert Threshold
                </label>
                <span className="text-sm font-medium text-spark-yellow">
                  {settings.alertThreshold}%
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                value={settings.alertThreshold}
                onChange={(e) =>
                  onSettingsChange({ alertThreshold: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-dark-surface rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-spark-yellow"
              />
              <div className="flex justify-between text-xs text-dark-text-secondary mt-1">
                <span>1%</span>
                <span>25%</span>
              </div>
            </div>

            {/* Auto Alerts Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-text">Auto Alerts</p>
                <p className="text-xs text-dark-text-secondary">
                  Automatically generate alerts for price changes
                </p>
              </div>
              <button
                onClick={() =>
                  onSettingsChange({ autoAlerts: !settings.autoAlerts })
                }
                className={`relative w-12 h-6 rounded-full transition-all ${
                  settings.autoAlerts
                    ? 'bg-green-500'
                    : 'bg-dark-surface border border-dark-border'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${
                    settings.autoAlerts ? 'left-6' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Price Match Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-text">Price Match Enabled</p>
                <p className="text-xs text-dark-text-secondary">
                  Allow automatic price match suggestions
                </p>
              </div>
              <button
                onClick={() =>
                  onSettingsChange({
                    priceMatchEnabled: !settings.priceMatchEnabled,
                  })
                }
                className={`relative w-12 h-6 rounded-full transition-all ${
                  settings.priceMatchEnabled
                    ? 'bg-green-500'
                    : 'bg-dark-surface border border-dark-border'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${
                    settings.priceMatchEnabled ? 'left-6' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Max Discount Slider (when price match enabled) */}
            {settings.priceMatchEnabled && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-dark-text-secondary">
                    Max Price Match Discount
                  </label>
                  <span className="text-sm font-medium text-green-400">
                    {settings.maxPriceMatchDiscount}%
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={settings.maxPriceMatchDiscount}
                  onChange={(e) =>
                    onSettingsChange({
                      maxPriceMatchDiscount: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-dark-surface rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
                />
              </div>
            )}

            {/* Warning for Aggressive Mode */}
            {settings.aggressiveness === 'aggressive' && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                <AlertTriangle size={20} className="text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-400">
                    Aggressive Mode Active
                  </p>
                  <p className="text-xs text-dark-text-secondary mt-1">
                    This mode may significantly impact margins. Monitor closely and
                    review automatic actions regularly.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Disabled State Helper */}
      {!settings.enabled && (
        <div className="px-4 pb-4 border-t border-dark-border">
          <div className="flex items-start gap-3 pt-4">
            <Shield size={20} className="text-dark-text-secondary shrink-0" />
            <div>
              <p className="text-sm text-dark-text-secondary">
                Enable Warfare Mode to start monitoring Amazon prices, generate
                competitive strategies, and receive real-time alerts when action
                is needed.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
