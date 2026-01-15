'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  Calendar,
  Home,
  TrendingUp,
  Briefcase,
  Lightbulb,
  RefreshCw,
} from 'lucide-react';
import { STORE_2593 } from '@/data/stores';

interface DemographicData {
  population: string;
  medianIncome: string;
  medianAge: string;
  households: string;
  growthRate: string;
  topEmployers: string[];
  keyInsight: string;
  lastUpdated: string;
}

export default function Demographics() {
  const store = STORE_2593;

  const [data, setData] = useState<DemographicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDemographics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/demographics');
      if (!response.ok) throw new Error('Failed to fetch demographics');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError('Unable to load demographic data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemographics();
  }, []);

  if (loading) {
    return (
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-dark-text">Market Demographics</h2>
          <span className="text-sm text-dark-text-secondary">{store.city}, {store.state} ({store.zip})</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card p-4 animate-pulse">
              <div className="h-10 w-10 rounded-xl bg-dark-surface mb-2" />
              <div className="h-6 w-20 bg-dark-surface rounded mb-1" />
              <div className="h-4 w-16 bg-dark-surface rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-dark-text">Market Demographics</h2>
          <button
            onClick={fetchDemographics}
            className="text-sm text-walmart-blue hover:text-walmart-blue/80 flex items-center gap-1"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
        <div className="glass-card p-6 text-center text-dark-text-secondary">
          {error || 'Unable to load demographic data'}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-dark-text">Market Demographics</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-medium">
            AI-Powered
          </span>
        </div>
        <span className="text-sm text-dark-text-secondary">{store.city}, {store.state} ({store.zip})</span>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Population */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-walmart-blue/20">
              <Users size={20} className="text-walmart-blue" />
            </div>
            <span className="text-2xl font-bold text-dark-text">{data.population}</span>
          </div>
          <p className="text-sm text-dark-text-secondary">Population</p>
        </div>

        {/* Median Income */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-500/20">
              <DollarSign size={20} className="text-green-400" />
            </div>
            <span className="text-2xl font-bold text-dark-text">{data.medianIncome}</span>
          </div>
          <p className="text-sm text-dark-text-secondary">Median Income</p>
        </div>

        {/* Median Age */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/20">
              <Calendar size={20} className="text-purple-400" />
            </div>
            <span className="text-2xl font-bold text-dark-text">{data.medianAge}</span>
          </div>
          <p className="text-sm text-dark-text-secondary">Median Age</p>
        </div>

        {/* Households */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-spark-yellow/20">
              <Home size={20} className="text-spark-yellow" />
            </div>
            <span className="text-2xl font-bold text-dark-text">{data.households}</span>
          </div>
          <p className="text-sm text-dark-text-secondary">Households</p>
        </div>
      </div>

      {/* Secondary Info Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Growth Rate */}
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/20">
            <TrendingUp size={20} className="text-cyan-400" />
          </div>
          <div>
            <span className="text-xl font-bold text-dark-text">{data.growthRate}</span>
            <p className="text-xs text-dark-text-secondary">Annual Growth Rate</p>
          </div>
        </div>

        {/* Top Employers */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase size={16} className="text-orange-400" />
            <span className="text-sm font-medium text-dark-text">Top Employers</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {data.topEmployers.map((employer, index) => (
              <span
                key={index}
                className="text-[10px] px-2 py-1 rounded-full bg-orange-500/10 text-orange-300"
              >
                {employer}
              </span>
            ))}
          </div>
        </div>

        {/* Key Insight */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={16} className="text-spark-yellow" />
            <span className="text-sm font-medium text-dark-text">Key Insight</span>
          </div>
          <p className="text-xs text-dark-text-secondary leading-relaxed">
            {data.keyInsight}
          </p>
        </div>
      </div>
    </section>
  );
}
