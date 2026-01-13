// Phase 4: Visual Merchandising AI Module - Barrel Exports
// Walmart Store Operations Orchestrator

// Type definitions
export * from './types';

// Planogram analysis service
export { PlanogramAnalyzerService, getPlanogramAnalyzer } from './planogram-analyzer';

// Visual Merchandising AI service
export {
  VisualMerchandisingAIService,
  getVisualMerchandisingAI,
  type ComplianceStatus,
  type StoreComplianceSummary,
  type AIAnalysisResult,
} from './merchandising-ai';
