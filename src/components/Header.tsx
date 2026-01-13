'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Store,
  Menu,
  X,
  Bell,
  Settings,
  User,
  MapPin
} from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { MARKET_396_STORES, Store as StoreType } from '@/data/stores';

// Walmart Spark Logo SVG Component
const WalmartSpark = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    className={`spark-glow ${className}`}
    fill="currentColor"
  >
    <path d="M16 0l2.5 8.5L26 6l-2.5 7.5L32 16l-8.5 2.5L26 26l-7.5-2.5L16 32l-2.5-8.5L6 26l2.5-7.5L0 16l8.5-2.5L6 6l7.5 2.5L16 0z" />
  </svg>
);

export default function Header() {
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { selectedStore, setSelectedStore, toggleSidebar, sidebarOpen } = useAppStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsStoreDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStoreSelect = (store: StoreType) => {
    setSelectedStore(store);
    setIsStoreDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-dark-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section - Logo & Branding */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg glass-button text-dark-text hover:text-walmart-blue transition-colors"
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Walmart Logo */}
          <div className="flex items-center gap-3">
            <WalmartSpark className="w-8 h-8 text-spark-yellow" />
            <div className="hidden sm:flex flex-col">
              <span className="text-lg font-bold text-walmart-blue tracking-tight">
                Walmart
              </span>
              <span className="text-[10px] text-dark-text-secondary -mt-1 tracking-wider uppercase">
                Store Ops Orchestrator
              </span>
            </div>
          </div>

          {/* Market Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-walmart-blue/10 border border-walmart-blue/20">
            <MapPin size={14} className="text-walmart-blue" />
            <span className="text-xs font-medium text-walmart-blue">Market 396</span>
          </div>
        </div>

        {/* Center Section - Store Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsStoreDropdownOpen(!isStoreDropdownOpen)}
            className="flex items-center gap-3 px-4 py-2 rounded-xl glass-button text-dark-text hover:text-white transition-all group min-w-[200px] lg:min-w-[280px]"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-walmart-blue/20 group-hover:bg-walmart-blue/30 transition-colors">
              <Store size={16} className="text-walmart-blue" />
            </div>
            <div className="flex flex-col items-start flex-1">
              <span className="text-[10px] text-dark-text-secondary uppercase tracking-wider">
                Selected Store
              </span>
              <span className="text-sm font-semibold truncate max-w-[150px] lg:max-w-[180px]">
                {selectedStore ? `#${selectedStore.number} - ${selectedStore.name}` : 'Select Store'}
              </span>
            </div>
            <ChevronDown
              size={18}
              className={`text-dark-text-secondary transition-transform duration-300 ${isStoreDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Store Dropdown */}
          {isStoreDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 py-2 rounded-xl glass-card overflow-hidden animate-fade-in z-50">
              <div className="px-4 py-2 border-b border-dark-border">
                <span className="text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Market 396 Stores
                </span>
              </div>
              <div className="max-h-[320px] overflow-y-auto">
                {MARKET_396_STORES.map((store, index) => (
                  <button
                    key={store.id}
                    onClick={() => handleStoreSelect(store)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-walmart-blue/10 transition-all group animate-fade-in ${
                      selectedStore?.id === store.id ? 'bg-walmart-blue/15 border-l-2 border-walmart-blue' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.03}s` }}
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                      selectedStore?.id === store.id
                        ? 'bg-walmart-blue text-white'
                        : 'bg-dark-surface group-hover:bg-walmart-blue/20'
                    }`}>
                      <span className="text-sm font-bold">{store.number}</span>
                    </div>
                    <div className="flex flex-col items-start flex-1 min-w-0">
                      <span className="text-sm font-medium text-dark-text truncate w-full text-left">
                        {store.name}
                      </span>
                      <span className="text-xs text-dark-text-secondary truncate w-full text-left">
                        {store.city}, {store.state} - {store.format}
                      </span>
                    </div>
                    {selectedStore?.id === store.id && (
                      <div className="w-2 h-2 rounded-full bg-spark-yellow animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative p-2.5 rounded-xl glass-button text-dark-text-secondary hover:text-white transition-colors hidden sm:flex">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-spark-yellow animate-pulse" />
          </button>

          {/* Settings */}
          <button className="p-2.5 rounded-xl glass-button text-dark-text-secondary hover:text-white transition-colors hidden sm:flex">
            <Settings size={18} />
          </button>

          {/* User Profile */}
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl glass-button text-dark-text hover:text-white transition-colors">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-walmart-blue to-spark-yellow flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <span className="hidden lg:block text-sm font-medium">L5 Onyi</span>
          </button>
        </div>
      </div>
    </header>
  );
}
