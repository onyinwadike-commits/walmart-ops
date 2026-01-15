'use client';

import { useAppStore } from '@/stores/appStore';
import { SECTIONS, SectionKey } from '@/data/stores';
import SidebarWeather from './SidebarWeather';
import {
  FileText,
  ListChecks,
  Target,
  ShoppingCart,
  ActivitySquare,
  ClipboardCheck,
  AlertTriangle,
  BarChart3,
  MessageCircle,
  Share2,
  ChevronRight,
} from 'lucide-react';

// Map section keys to icons
const sectionIcons: Record<SectionKey, React.ReactNode> = {
  A: <FileText size={18} />,
  B: <ListChecks size={18} />,
  C: <Target size={18} />,
  D: <ShoppingCart size={18} />,
  E: <ActivitySquare size={18} />,
  F: <ClipboardCheck size={18} />,
  G: <AlertTriangle size={18} />,
  H: <BarChart3 size={18} />,
  I: <MessageCircle size={18} />,
  J: <Share2 size={18} />,
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

          {/* Sidebar Footer - Weather */}
          <SidebarWeather />
        </div>
      </aside>
    </>
  );
}
