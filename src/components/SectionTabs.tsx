'use client';

import { useRef, useEffect } from 'react';
import { useAppStore } from '@/stores/appStore';
import { SECTIONS, SectionKey } from '@/data/stores';

export default function SectionTabs() {
  const { activeSection, setActiveSection, selectedStore } = useAppStore();
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to active tab
  useEffect(() => {
    if (activeTabRef.current && tabsRef.current) {
      const container = tabsRef.current;
      const activeTab = activeTabRef.current;
      const scrollLeft = activeTab.offsetLeft - container.offsetWidth / 2 + activeTab.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeSection]);

  const handleSectionClick = (sectionKey: SectionKey) => {
    setActiveSection(activeSection === sectionKey ? null : sectionKey);
  };

  return (
    <div className="lg:hidden w-full">
      {/* Gradient Fades */}
      <div className="relative">
        {/* Left Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-dark-bg to-transparent z-10 pointer-events-none" />
        {/* Right Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-dark-bg to-transparent z-10 pointer-events-none" />

        {/* Tabs Container */}
        <div
          ref={tabsRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-4 py-3"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* All Sections Tab */}
          <button
            onClick={() => setActiveSection(null)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
              activeSection === null
                ? 'bg-walmart-blue text-white shadow-lg shadow-walmart-blue/30'
                : 'glass-light text-dark-text-secondary hover:text-white'
            }`}
          >
            <span className="text-sm font-medium whitespace-nowrap">All</span>
          </button>

          {/* Section Tabs */}
          {SECTIONS.map((section) => {
            const isActive = activeSection === section.key;
            const isAvailable = selectedStore?.sections.includes(section.key);

            return (
              <button
                key={section.key}
                ref={isActive ? activeTabRef : null}
                onClick={() => handleSectionClick(section.key)}
                disabled={!isAvailable}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-white shadow-lg'
                    : 'glass-light text-dark-text-secondary hover:text-white'
                } ${!isAvailable ? 'opacity-40 cursor-not-allowed' : ''}`}
                style={{
                  backgroundColor: isActive ? section.color : undefined,
                  boxShadow: isActive ? `0 4px 20px ${section.color}40` : undefined,
                }}
              >
                {/* Section Letter */}
                <span
                  className={`flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-dark-surface'
                  }`}
                  style={{ color: isActive ? 'white' : section.color }}
                >
                  {section.key}
                </span>
                {/* Section Name */}
                <span className="text-sm font-medium whitespace-nowrap">
                  {section.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Section Indicator */}
      {activeSection && (
        <div className="px-4 pb-2">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg animate-fade-in"
            style={{ backgroundColor: `${SECTIONS.find(s => s.key === activeSection)?.color}15` }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: SECTIONS.find(s => s.key === activeSection)?.color }}
            />
            <span className="text-xs text-dark-text-secondary">
              Viewing:{' '}
              <span
                className="font-medium"
                style={{ color: SECTIONS.find(s => s.key === activeSection)?.color }}
              >
                Section {activeSection} - {SECTIONS.find(s => s.key === activeSection)?.name}
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
