import { create } from 'zustand';
import { Store, MARKET_396_STORES, SectionKey } from '@/data/stores';

interface AppState {
  // Store Selection
  selectedStore: Store | null;
  setSelectedStore: (store: Store | null) => void;

  // Section Navigation
  activeSection: SectionKey | null;
  setActiveSection: (section: SectionKey | null) => void;

  // UI State
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Report Generation
  isGeneratingReport: boolean;
  setIsGeneratingReport: (generating: boolean) => void;
  reportProgress: number;
  setReportProgress: (progress: number) => void;

  // Amazon Warfare Mode
  amazonWarfareActive: boolean;
  setAmazonWarfareActive: (active: boolean) => void;

  // Visual Merchandising Mode
  visualMerchActive: boolean;
  setVisualMerchActive: (active: boolean) => void;

  // Feedback
  feedbackQueue: FeedbackItem[];
  addFeedback: (feedback: FeedbackItem) => void;
  clearFeedback: () => void;
}

export interface FeedbackItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  storeId?: string;
  sectionKey?: SectionKey;
}

export const useAppStore = create<AppState>((set) => ({
  // Store Selection - default to first store
  selectedStore: MARKET_396_STORES[0],
  setSelectedStore: (store) => set({ selectedStore: store }),

  // Section Navigation
  activeSection: null,
  setActiveSection: (section) => set({ activeSection: section }),

  // UI State
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Theme - default dark
  theme: 'dark',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

  // Report Generation
  isGeneratingReport: false,
  setIsGeneratingReport: (generating) => set({ isGeneratingReport: generating }),
  reportProgress: 0,
  setReportProgress: (progress) => set({ reportProgress: progress }),

  // Amazon Warfare
  amazonWarfareActive: false,
  setAmazonWarfareActive: (active) => set({ amazonWarfareActive: active }),

  // Visual Merchandising
  visualMerchActive: false,
  setVisualMerchActive: (active) => set({ visualMerchActive: active }),

  // Feedback
  feedbackQueue: [],
  addFeedback: (feedback) => set((state) => ({
    feedbackQueue: [...state.feedbackQueue, feedback].slice(-10) // Keep last 10
  })),
  clearFeedback: () => set({ feedbackQueue: [] }),
}));
