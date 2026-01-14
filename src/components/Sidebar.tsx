'use client';

import { useAppStore } from '@/stores/appStore';
import { SECTIONS, SectionKey } from '@/data/stores';
import {
  Apple,
  ShoppingCart,
  Package,
  Wrench,
  Shirt,
  Tv,
  Home,
  Sun,
  Gamepad2,
  CreditCard,
  Globe,
  ChevronRight,
  MessageSquare,
  Camera
} from 'lucide-react';

// Map section keys to icons
const sectionIcons: Record<SectionKey, React.ReactNode> = {
  A: <Apple size={18} />,
  B: <ShoppingCart size={18} />,
  C: <Package size={18} />,
  D: <Wrench size={18} />,
  E: <Shirt size={18} />,
  F: <Tv size={18} />,
  G: <Home size={18} />,
  H: <Sun size={18} />,
  I: <Gamepad2 size={18} />,
  J: <CreditCard size={18} />,
  K: <Globe size={18} />,
  L: <MessageSquare size={18} />,
  M: <Camera size={18} />,
};

export default function Sidebar() {
  const { activeSection, setActiveSection, sidebarOpen, setSidebarOpen, selectedStore } = useAppStore();

  const handleSectionClick = (sectionKey: SectionKey) => {
    setActiveSection(activeSection === sectionKey ? null : sectionKey);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-72 glass border-r border-dark-border z-40 transform transition-transform duration-300 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="px-4 py-4 border-b border-dark-border">
            <h2 className="text-sm font-semibold text-dark-text-secondary uppercase tracking-wider">
              Store Sections
            </h2>
            <p className="text-xs text-dark-text-secondary mt-1">
              Navigate by department area
            </p>
          </div>

          {/* Section Navigation */}
          <nav className="flex-1 overflow-y-auto py-2">
            <ul className="space-y-1 px-2">
              {SECTIONS.map((section, index) => {
                const isActive = activeSection === section.key;
                const isAvailable = selectedStore?.sections.includes(section.key);

                return (
                  <li
                    key={section.key}
                    className="animate-slide-in-left"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <button
                      onClick={() => handleSectionClick(section.key)}
                      disabled={!isAvailable}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                        isActive
                          ? 'bg-gradient-to-r from-walmart-blue/20 to-transparent border-l-2'
                          : 'hover:bg-dark-surface/50'
                      } ${!isAvailable ? 'opacity-40 cursor-not-allowed' : ''}`}
                      style={{
                        borderLeftColor: isActive ? section.color : 'transparent',
                      }}
                    >
                      {/* Section Letter Badge */}
                      <div
                        className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${
                          isActive ? 'scale-110' : 'group-hover:scale-105'
                        }`}
                        style={{
                          backgroundColor: isActive
                            ? section.color
                            : `${section.color}20`,
                          boxShadow: isActive
                            ? `0 0 20px ${section.color}40`
                            : 'none',
                        }}
                      >
                        <span
                          className={`text-sm font-bold ${
                            isActive ? 'text-white' : ''
                          }`}
                          style={{ color: isActive ? 'white' : section.color }}
                        >
                          {section.key}
                        </span>
                      </div>

                      {/* Section Info */}
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-medium transition-colors ${
                              isActive ? 'text-white' : 'text-dark-text group-hover:text-white'
                            }`}
                          >
                            {section.name}
                          </span>
                          <span
                            className="opacity-60"
                            style={{ color: section.color }}
                          >
                            {sectionIcons[section.key]}
                          </span>
                        </div>
                        <span className="text-xs text-dark-text-secondary truncate block">
                          {section.description}
                        </span>
                      </div>

                      {/* Arrow Indicator */}
                      <ChevronRight
                        size={16}
                        className={`text-dark-text-secondary transition-all duration-200 ${
                          isActive
                            ? 'translate-x-1 opacity-100'
                            : 'opacity-0 group-hover:opacity-50'
                        }`}
                        style={{ color: isActive ? section.color : undefined }}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar Footer - Quick Stats */}
          <div className="px-4 py-4 border-t border-dark-border">
            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-dark-text-secondary uppercase">
                  Quick Stats
                </span>
                <span className="text-[10px] text-spark-yellow font-medium">
                  Live
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-lg font-bold text-walmart-blue">
                    {SECTIONS.length}
                  </span>
                  <span className="text-xs text-dark-text-secondary block">
                    Sections
                  </span>
                </div>
                <div>
                  <span className="text-lg font-bold text-spark-yellow">
                    {selectedStore?.avgDailyTraffic.toLocaleString() || '-'}
                  </span>
                  <span className="text-xs text-dark-text-secondary block">
                    Daily Traffic
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
