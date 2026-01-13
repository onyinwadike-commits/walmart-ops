// Phase 2: Multi-LLM Report Generation Engine - Type Definitions
// Walmart Store Operations Orchestrator

import { SectionKey, Store } from '@/data/stores';

// Agent Role Types - Each LLM specializes in a specific domain
export type AgentRole =
  | 'research'    // Deep research and analysis (Perplexity)
  | 'realtime'    // Real-time data and social trends (Grok)
  | 'visual'      // Visual merchandising and layout (Gemini)
  | 'strategy'    // Strategic planning and recommendations (Claude)
  | 'general'     // General purpose analysis (ChatGPT)
  | 'technical';  // Technical/operational optimization (DeepSeek)

// Available AI Agent Names
export type AgentName =
  | 'perplexity'
  | 'grok'
  | 'gemini'
  | 'claude'
  | 'chatgpt'
  | 'deepseek';

// Task Types for Retail Operations
export type TaskType =
  | 'inventory_optimization'
  | 'sales_forecast'
  | 'customer_insights'
  | 'competitor_analysis'
  | 'pricing_strategy'
  | 'visual_merchandising'
  | 'labor_planning'
  | 'supply_chain'
  | 'shrink_prevention'
  | 'seasonal_planning'
  | 'promotion_analysis'
  | 'customer_traffic'
  | 'associate_performance'
  | 'market_trends'
  | 'operational_efficiency'
  | 'ecommerce_integration'
  | 'sustainability'
  | 'compliance_audit';

// Agent Configuration
export interface AgentConfig {
  name: AgentName;
  role: AgentRole;
  model: string;
  apiEndpoint: string;
  apiKeyEnvVar: string;
  maxTokens: number;
  temperature: number;
  rateLimit: {
    requestsPerMinute: number;
    tokensPerMinute: number;
  };
  specialties: TaskType[];
  description: string;
}

// Token Bucket for Rate Limiting
export interface TokenBucket {
  tokens: number;
  lastRefill: number;
  maxTokens: number;
  refillRate: number; // tokens per millisecond
}

// LLM Query Parameters
export interface QueryParams {
  prompt: string;
  context?: string;
  maxTokens?: number;
  temperature?: number;
  store?: Store;
  section?: SectionKey;
  taskType?: TaskType;
}

// LLM Response Structure
export interface LLMResponse {
  agentName: AgentName;
  role: AgentRole;
  content: string;
  confidence: number; // 0-1 confidence score
  tokensUsed: number;
  latencyMs: number;
  timestamp: Date;
  metadata?: {
    sources?: string[];
    citations?: string[];
    dataPoints?: number;
    reasoning?: string;
  };
  error?: string;
}

// Aggregated Response from Multiple Agents
export interface AggregatedResponse {
  taskType: TaskType;
  responses: LLMResponse[];
  consensus?: string;
  divergentViews?: string[];
  overallConfidence: number;
  timestamp: Date;
}

// Section Report Structure
export interface SectionReport {
  sectionKey: SectionKey;
  sectionName: string;
  generatedAt: Date;
  summary: string;
  insights: ReportInsight[];
  recommendations: ReportRecommendation[];
  metrics: ReportMetric[];
  agentsContributed: AgentName[];
  overallConfidence: number;
}

// Report Insight
export interface ReportInsight {
  id: string;
  title: string;
  description: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  agentSource: AgentName;
  confidence: number;
  dataPoints?: string[];
}

// Report Recommendation
export interface ReportRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'immediate' | 'short-term' | 'long-term';
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  estimatedROI?: string;
  agentSource: AgentName;
  confidence: number;
}

// Report Metric
export interface ReportMetric {
  name: string;
  value: string | number;
  trend?: 'up' | 'down' | 'stable';
  changePercent?: number;
  target?: string | number;
  status: 'good' | 'warning' | 'critical';
}

// Complete Store Report
export interface StoreReport {
  storeId: string;
  storeName: string;
  storeNumber: number;
  generatedAt: Date;
  generationDurationMs: number;
  sections: SectionReport[];
  executiveSummary: string;
  topPriorities: ReportRecommendation[];
  agentsUsed: AgentName[];
  totalTokensUsed: number;
  overallConfidence: number;
  cacheHit?: boolean;
}

// Report Generation Status
export interface ReportGenerationStatus {
  storeId: string;
  status: 'queued' | 'generating' | 'completed' | 'failed';
  progress: number; // 0-100
  currentSection?: SectionKey;
  currentAgent?: AgentName;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

// API Request/Response Types
export interface GenerateReportRequest {
  storeId: string;
  sections?: SectionKey[];
  forceRefresh?: boolean;
}

export interface GenerateReportResponse {
  success: boolean;
  report?: StoreReport;
  error?: string;
  cached?: boolean;
}

// Cache Entry
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

// Retry Configuration
export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  exponentialBackoff: boolean;
}

// Health Check Response
export interface HealthCheckResult {
  agentName: AgentName;
  healthy: boolean;
  latencyMs?: number;
  error?: string;
  lastChecked: Date;
}
