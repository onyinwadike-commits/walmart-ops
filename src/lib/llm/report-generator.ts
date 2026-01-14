// Phase 2: Report Generator
// High-level API for generating store reports

import { getOrchestrator } from './orchestrator';
import {
  StoreReport,
  SectionReport,
  TaskType,
  ReportGenerationStatus,
} from './types';
import { Store, SectionKey, SECTIONS, getStoreById } from '@/data/stores';

// Section to TaskType mapping - defines what analysis each section needs
export const SECTION_TASKS: Record<SectionKey, TaskType[]> = {
  A: ['inventory_optimization', 'shrink_prevention', 'visual_merchandising'], // Fresh
  B: ['inventory_optimization', 'pricing_strategy', 'promotion_analysis'], // Consumables
  C: ['inventory_optimization', 'supply_chain', 'visual_merchandising'], // Center Store
  D: ['visual_merchandising', 'customer_insights', 'pricing_strategy'], // GM Hardlines
  E: ['visual_merchandising', 'shrink_prevention', 'customer_insights'], // GM Softlines
  F: ['shrink_prevention', 'competitor_analysis', 'customer_traffic'], // Electronics
  G: ['visual_merchandising', 'customer_insights', 'seasonal_planning'], // Home
  H: ['seasonal_planning', 'visual_merchandising', 'inventory_optimization'], // Seasonal
  I: ['customer_insights', 'seasonal_planning', 'promotion_analysis'], // Entertainment
  J: ['operational_efficiency', 'customer_insights', 'compliance_audit'], // Financial Services
  K: ['ecommerce_integration', 'operational_efficiency', 'customer_traffic'], // eCommerce
  L: ['customer_insights', 'operational_efficiency', 'associate_performance'], // User Feedback
  M: ['visual_merchandising', 'inventory_optimization', 'operational_efficiency'], // Visual Merch AI
};

// Report generation status tracker
const generationStatus = new Map<string, ReportGenerationStatus>();

// Progress callback type
type ProgressCallback = (status: ReportGenerationStatus) => void;

/**
 * Generate a report for a single section
 */
export async function generateSectionReport(
  store: Store,
  sectionKey: SectionKey,
  onProgress?: ProgressCallback
): Promise<SectionReport> {
  const orchestrator = getOrchestrator();
  const section = SECTIONS.find((s) => s.key === sectionKey);

  if (!section) {
    throw new Error(`Invalid section key: ${sectionKey}`);
  }

  // Update status
  const statusKey = `${store.id}-${sectionKey}`;
  const status: ReportGenerationStatus = {
    storeId: store.id,
    status: 'generating',
    progress: 0,
    currentSection: sectionKey,
    startedAt: new Date(),
  };
  generationStatus.set(statusKey, status);
  onProgress?.(status);

  try {
    const sectionReport = await orchestrator.generateSectionReport(store, sectionKey);

    // Update status to completed
    const completedStatus: ReportGenerationStatus = {
      ...status,
      status: 'completed',
      progress: 100,
      completedAt: new Date(),
    };
    generationStatus.set(statusKey, completedStatus);
    onProgress?.(completedStatus);

    return sectionReport;
  } catch (error) {
    // Update status to failed
    const failedStatus: ReportGenerationStatus = {
      ...status,
      status: 'failed',
      error: (error as Error).message,
    };
    generationStatus.set(statusKey, failedStatus);
    onProgress?.(failedStatus);
    throw error;
  }
}

/**
 * Generate a full store report with all sections
 */
export async function generateFullStoreReport(
  storeId: string,
  options: {
    sections?: SectionKey[];
    forceRefresh?: boolean;
    onProgress?: ProgressCallback;
  } = {}
): Promise<StoreReport> {
  const { sections, onProgress } = options;

  // Get store data
  const store = getStoreById(storeId);
  if (!store) {
    throw new Error(`Store not found: ${storeId}`);
  }

  // Initialize status
  const status: ReportGenerationStatus = {
    storeId,
    status: 'generating',
    progress: 0,
    startedAt: new Date(),
  };
  generationStatus.set(storeId, status);
  onProgress?.(status);

  const orchestrator = getOrchestrator();
  const sectionsToGenerate = sections || store.sections;
  const sectionReports: SectionReport[] = [];
  let totalProgress = 0;
  const progressPerSection = 100 / sectionsToGenerate.length;

  try {
    // Generate each section sequentially with progress updates
    for (const sectionKey of sectionsToGenerate) {
      const currentStatus: ReportGenerationStatus = {
        ...status,
        progress: totalProgress,
        currentSection: sectionKey,
      };
      generationStatus.set(storeId, currentStatus);
      onProgress?.(currentStatus);

      const sectionReport = await orchestrator.generateSectionReport(store, sectionKey);
      sectionReports.push(sectionReport);

      totalProgress += progressPerSection;
    }

    // Generate the complete report
    const report = await orchestrator.generateReport(store, sectionsToGenerate);

    // Update to completed
    const completedStatus: ReportGenerationStatus = {
      storeId,
      status: 'completed',
      progress: 100,
      completedAt: new Date(),
    };
    generationStatus.set(storeId, completedStatus);
    onProgress?.(completedStatus);

    return report;
  } catch (error) {
    const failedStatus: ReportGenerationStatus = {
      storeId,
      status: 'failed',
      progress: totalProgress,
      error: (error as Error).message,
    };
    generationStatus.set(storeId, failedStatus);
    onProgress?.(failedStatus);
    throw error;
  }
}

/**
 * Get report generation status for a store
 */
export function getReportStatus(storeId: string): ReportGenerationStatus | undefined {
  return generationStatus.get(storeId);
}

/**
 * Get all active report generation statuses
 */
export function getAllReportStatuses(): Map<string, ReportGenerationStatus> {
  return generationStatus;
}

/**
 * Clear report status (after completion or for cleanup)
 */
export function clearReportStatus(storeId: string): void {
  generationStatus.delete(storeId);
}

/**
 * Get tasks for a specific section
 */
export function getTasksForSection(sectionKey: SectionKey): TaskType[] {
  return SECTION_TASKS[sectionKey] || [];
}

/**
 * Get section info with its tasks
 */
export function getSectionWithTasks(sectionKey: SectionKey): {
  section: typeof SECTIONS[0] | undefined;
  tasks: TaskType[];
} {
  const section = SECTIONS.find((s) => s.key === sectionKey);
  const tasks = SECTION_TASKS[sectionKey] || [];
  return { section, tasks };
}

/**
 * Calculate estimated generation time (in seconds) for a report
 */
export function estimateGenerationTime(sections: SectionKey[]): number {
  // Each section takes roughly 3-5 seconds per task
  const totalTasks = sections.reduce((sum, key) => {
    return sum + (SECTION_TASKS[key]?.length || 0);
  }, 0);

  // Base time + 3 seconds per task
  return 5 + totalTasks * 3;
}

/**
 * Quick report - generates a lightweight summary using primary agents only
 */
export async function generateQuickReport(
  storeId: string,
  onProgress?: ProgressCallback
): Promise<Partial<StoreReport>> {
  const store = getStoreById(storeId);
  if (!store) {
    throw new Error(`Store not found: ${storeId}`);
  }

  const status: ReportGenerationStatus = {
    storeId,
    status: 'generating',
    progress: 0,
    startedAt: new Date(),
  };
  onProgress?.(status);

  const orchestrator = getOrchestrator();

  // Execute key tasks only
  const keyTasks: TaskType[] = [
    'sales_forecast',
    'inventory_optimization',
    'customer_insights',
  ];

  const insights: string[] = [];

  for (let i = 0; i < keyTasks.length; i++) {
    const task = keyTasks[i];
    const response = await orchestrator.executeTask(task, {
      prompt: `Provide a quick summary of ${task.replace('_', ' ')} for Store #${store.number}`,
      store,
    }, true); // Use primary agent only

    if (response.responses.length > 0) {
      insights.push(response.responses[0].content);
    }

    onProgress?.({
      ...status,
      progress: ((i + 1) / keyTasks.length) * 100,
    });
  }

  onProgress?.({
    storeId,
    status: 'completed',
    progress: 100,
    completedAt: new Date(),
  });

  return {
    storeId: store.id,
    storeName: store.name,
    storeNumber: store.number,
    generatedAt: new Date(),
    executiveSummary: insights.join('\n\n'),
    agentsUsed: ['chatgpt', 'deepseek', 'perplexity'],
    overallConfidence: 0.8,
  };
}

const reportGeneratorExports = {
  generateSectionReport,
  generateFullStoreReport,
  generateQuickReport,
  getReportStatus,
  getAllReportStatuses,
  clearReportStatus,
  getTasksForSection,
  getSectionWithTasks,
  estimateGenerationTime,
  SECTION_TASKS,
};

export default reportGeneratorExports;
