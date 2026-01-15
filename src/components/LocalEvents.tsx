'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Trophy,
  Music,
  Building2,
  PartyPopper,
  RefreshCw,
  AlertTriangle,
  Loader2,
  Sparkles,
  Navigation,
} from 'lucide-react';
import { STORE_2593 } from '@/data/stores';

interface LocalEvent {
  id: string;
  name: string;
  venue: string;
  date: string;
  time: string;
  expectedAttendance: string;
  category: 'sports' | 'concert' | 'convention' | 'festival' | 'rodeo' | 'other';
  description: string;
  impactLevel: 'high' | 'medium' | 'low';
  nearbyStores: string[];
  distanceMiles: number;
}

interface EventsResponse {
  success: boolean;
  data: LocalEvent[];
  cached: boolean;
  lastFetch: string;
  nextRefresh: string;
  error?: string;
}

const categoryConfig: Record<LocalEvent['category'], { icon: typeof Trophy; color: string; label: string }> = {
  sports: { icon: Trophy, color: '#22C55E', label: 'Sports' },
  concert: { icon: Music, color: '#A855F7', label: 'Concert' },
  convention: { icon: Building2, color: '#3B82F6', label: 'Convention' },
  festival: { icon: PartyPopper, color: '#EC4899', label: 'Festival' },
  rodeo: { icon: Trophy, color: '#F97316', label: 'Rodeo' },
  other: { icon: Calendar, color: '#6B7280', label: 'Event' },
};

const impactColors: Record<LocalEvent['impactLevel'], { bg: string; text: string; label: string }> = {
  high: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'High Impact' },
  medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Medium Impact' },
  low: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Low Impact' },
};

export default function LocalEvents() {
  const store = STORE_2593;

  const [events, setEvents] = useState<LocalEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastFetch, setLastFetch] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const response = await fetch('/api/events', {
        method: forceRefresh ? 'POST' : 'GET',
      });

      const data: EventsResponse = await response.json();

      if (data.success) {
        setEvents(data.data);
        setLastFetch(data.lastFetch);
      } else {
        setError('Failed to load events');
      }
    } catch (err) {
      setError('Failed to fetch events');
      console.error('Error fetching events:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const formatLastFetch = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (isLoading) {
    return (
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-dark-text flex items-center gap-2">
            <Sparkles size={20} className="text-spark-yellow" />
            Local Events
          </h2>
        </div>
        <div className="glass-card p-8 flex items-center justify-center">
          <Loader2 size={32} className="text-walmart-blue animate-spin" />
          <span className="ml-3 text-dark-text-secondary">Loading events from Perplexity AI...</span>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-dark-text flex items-center gap-2">
            <Sparkles size={20} className="text-spark-yellow" />
            Local Events
            <span className="text-xs font-normal text-dark-text-secondary ml-2">
              Powered by Perplexity AI
            </span>
          </h2>
          {lastFetch && (
            <p className="text-xs text-dark-text-secondary mt-1">
              Distances from Store #{store.number} • Last updated: {formatLastFetch(lastFetch)}
            </p>
          )}
        </div>
        <button
          onClick={() => fetchEvents(true)}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-dark-surface hover:bg-dark-border transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {error && (
        <div className="glass-card p-4 mb-4 border border-red-500/30 flex items-center gap-3">
          <AlertTriangle size={20} className="text-red-400" />
          <span className="text-red-400">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {events.map((event, index) => {
          const { icon: Icon, color, label } = categoryConfig[event.category];
          const impact = impactColors[event.impactLevel];

          return (
            <div
              key={event.id}
              className="glass-card p-5 hover:ring-1 hover:ring-walmart-blue/30 transition-all animate-fade-in group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-11 h-11 rounded-xl"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Icon size={22} style={{ color }} />
                  </div>
                  <div>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${color}20`, color }}
                    >
                      {label}
                    </span>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${impact.bg} ${impact.text}`}>
                  {impact.label}
                </span>
              </div>

              {/* Event Name */}
              <h3 className="text-base font-semibold text-dark-text mb-2 line-clamp-2 group-hover:text-white transition-colors">
                {event.name}
              </h3>

              {/* Venue & Distance */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm text-dark-text-secondary">
                  <MapPin size={14} />
                  <span className="truncate">{event.venue}</span>
                </div>
                <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400 whitespace-nowrap">
                  <Navigation size={10} />
                  {event.distanceMiles} mi away
                </span>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="glass-light p-2 rounded-lg">
                  <div className="flex items-center gap-2 text-xs text-dark-text-secondary mb-0.5">
                    <Calendar size={12} />
                    <span>Date</span>
                  </div>
                  <span className="text-sm font-medium text-dark-text">{event.date}</span>
                </div>
                <div className="glass-light p-2 rounded-lg">
                  <div className="flex items-center gap-2 text-xs text-dark-text-secondary mb-0.5">
                    <Clock size={12} />
                    <span>Time</span>
                  </div>
                  <span className="text-sm font-medium text-dark-text">{event.time}</span>
                </div>
              </div>

              {/* Expected Attendance */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-dark-surface/50 border border-dark-border">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-spark-yellow" />
                  <span className="text-sm text-dark-text-secondary">Expected Crowd</span>
                </div>
                <span className="text-sm font-bold text-spark-yellow">{event.expectedAttendance}</span>
              </div>

              {/* Description */}
              {event.description && (
                <p className="text-xs text-dark-text-secondary mt-3 line-clamp-2">
                  {event.description}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {events.length === 0 && !error && (
        <div className="glass-card p-8 text-center">
          <Calendar size={48} className="text-dark-text-secondary mx-auto mb-4" />
          <p className="text-dark-text-secondary">No upcoming events found</p>
        </div>
      )}
    </section>
  );
}
