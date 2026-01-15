'use client';

import { useState, useEffect } from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  CloudSun,
  Droplets,
  Thermometer,
  Loader2,
  MapPin,
} from 'lucide-react';

interface WeatherData {
  temperature: number;
  condition: string;
  icon: 'sun' | 'cloud' | 'rain' | 'snow' | 'storm' | 'partly-cloudy' | 'wind';
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  high: number;
  low: number;
  location: string;
  lastUpdated: string;
}

interface WeatherResponse {
  success: boolean;
  data: WeatherData;
  cached: boolean;
  lastFetch: string;
}

const weatherIcons: Record<WeatherData['icon'], typeof Sun> = {
  sun: Sun,
  cloud: Cloud,
  rain: CloudRain,
  snow: CloudSnow,
  storm: CloudLightning,
  'partly-cloudy': CloudSun,
  wind: Wind,
};

const weatherColors: Record<WeatherData['icon'], string> = {
  sun: '#FCD34D',
  cloud: '#94A3B8',
  rain: '#60A5FA',
  snow: '#E2E8F0',
  storm: '#A78BFA',
  'partly-cloudy': '#FBBF24',
  wind: '#67E8F9',
};

export default function SidebarWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('/api/weather');
        const data: WeatherResponse = await response.json();

        if (data.success) {
          setWeather(data.data);
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();

    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="px-4 py-4 border-t border-dark-border">
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center justify-center gap-2 py-4">
            <Loader2 size={20} className="text-walmart-blue animate-spin" />
            <span className="text-xs text-dark-text-secondary">Loading weather...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  const WeatherIcon = weatherIcons[weather.icon] || Sun;
  const iconColor = weatherColors[weather.icon] || '#FCD34D';

  return (
    <div className="px-4 py-4 border-t border-dark-border">
      <div className="glass-card p-4 rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <MapPin size={12} className="text-dark-text-secondary" />
            <span className="text-xs font-medium text-dark-text-secondary">
              {weather.location}
            </span>
          </div>
          <span className="text-[10px] text-spark-yellow font-medium">
            Live
          </span>
        </div>

        {/* Main Weather Display */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-xl"
              style={{ backgroundColor: `${iconColor}20` }}
            >
              <WeatherIcon size={28} style={{ color: iconColor }} />
            </div>
            <div>
              <span className="text-3xl font-bold text-dark-text">
                {weather.temperature}°
              </span>
              <span className="text-xs text-dark-text-secondary block">
                {weather.condition}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-dark-text-secondary">
              H: <span className="text-dark-text font-medium">{weather.high}°</span>
            </div>
            <div className="text-xs text-dark-text-secondary">
              L: <span className="text-dark-text font-medium">{weather.low}°</span>
            </div>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-dark-border/50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Thermometer size={12} className="text-orange-400" />
            </div>
            <span className="text-sm font-semibold text-dark-text">
              {weather.feelsLike}°
            </span>
            <span className="text-[10px] text-dark-text-secondary block">
              Feels Like
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Droplets size={12} className="text-blue-400" />
            </div>
            <span className="text-sm font-semibold text-dark-text">
              {weather.humidity}%
            </span>
            <span className="text-[10px] text-dark-text-secondary block">
              Humidity
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Wind size={12} className="text-cyan-400" />
            </div>
            <span className="text-sm font-semibold text-dark-text">
              {weather.windSpeed}
            </span>
            <span className="text-[10px] text-dark-text-secondary block">
              mph
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
