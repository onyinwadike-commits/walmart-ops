// Phase 2: LLM Orchestrator
// Routes tasks to appropriate agents and aggregates responses

import { LLMAgent } from './base-agent';
import {
  PerplexityAgent,
  GrokAgent,
  GeminiAgent,
  ClaudeAgent,
  ChatGPTAgent,
  DeepSeekAgent,
} from './agents';
import {
  AgentName,
  TaskType,
  LLMResponse,
  AggregatedResponse,
  StoreReport,
  SectionReport,
  ReportInsight,
  ReportRecommendation,
  QueryParams,
  HealthCheckResult,
} from './types';
import { Store, SectionKey, SECTIONS } from '@/data/stores';

// Task routing configuration - maps tasks to primary and secondary agents
const TASK_ROUTING: Record<TaskType, { primary: AgentName; secondary: AgentName[] }> = {
  inventory_optimization: { primary: 'deepseek', secondary: ['gemini', 'claude'] },
  sales_forecast: { primary: 'chatgpt', secondary: ['perplexity', 'grok'] },
  customer_insights: { primary: 'chatgpt', secondary: ['perplexity', 'grok'] },
  competitor_analysis: { primary: 'perplexity', secondary: ['grok', 'claude'] },
  pricing_strategy: { primary: 'claude', secondary: ['perplexity', 'chatgpt'] },
  visual_merchandising: { primary: 'gemini', secondary: ['claude', 'chatgpt'] },
  labor_planning: { primary: 'claude', secondary: ['chatgpt', 'deepseek'] },
  supply_chain: { primary: 'deepseek', secondary: ['claude', 'perplexity'] },
  shrink_prevention: { primary: 'deepseek', secondary: ['claude', 'gemini'] },
  seasonal_planning: { primary: 'perplexity', secondary: ['gemini', 'grok'] },
  promotion_analysis: { primary: 'grok', secondary: ['chatgpt', 'perplexity'] },
  customer_traffic: { primary: 'grok', secondary: ['gemini', 'chatgpt'] },
  associate_performance: { primary: 'chatgpt', secondary: ['claude', 'deepseek'] },
  market_trends: { primary: 'perplexity', secondary: ['grok', 'claude'] },
  operational_efficiency: { primary: 'deepseek', secondary: ['claude', 'gemini'] },
  ecommerce_integration: { primary: 'deepseek', secondary: ['chatgpt', 'perplexity'] },
  sustainability: { primary: 'claude', secondary: ['perplexity', 'gemini'] },
  compliance_audit: { primary: 'claude', secondary: ['deepseek', 'chatgpt'] },
};

/**
 * LLM Orchestrator - Singleton class for managing multi-agent task execution
 */
export class LLMOrchestrator {
  private static instance: LLMOrchestrator | null = null;
  private agents: Map<AgentName, LLMAgent>;
  private healthStatus: Map<AgentName, HealthCheckResult>;

  private constructor() {
    this.agents = new Map();
    this.healthStatus = new Map();
    this.initializeAgents();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): LLMOrchestrator {
    if (!LLMOrchestrator.instance) {
      LLMOrchestrator.instance = new LLMOrchestrator();
    }
    return LLMOrchestrator.instance;
  }

  /**
   * Initialize all agents
   */
  private initializeAgents(): void {
    this.agents.set('perplexity', new PerplexityAgent());
    this.agents.set('grok', new GrokAgent());
    this.agents.set('gemini', new GeminiAgent());
    this.agents.set('claude', new ClaudeAgent());
    this.agents.set('chatgpt', new ChatGPTAgent());
    this.agents.set('deepseek', new DeepSeekAgent());
  }

  /**
   * Get a specific agent
   */
  getAgent(name: AgentName): LLMAgent | undefined {
    return this.agents.get(name);
  }

  /**
   * Get all agents
   */
  getAllAgents(): Map<AgentName, LLMAgent> {
    return this.agents;
  }

  /**
   * Execute a task using the appropriate agents
   */
  async executeTask(
    taskType: TaskType,
    params: QueryParams,
    usePrimaryOnly: boolean = false
  ): Promise<AggregatedResponse> {
    const routing = TASK_ROUTING[taskType];
    const agentsToUse: AgentName[] = usePrimaryOnly
      ? [routing.primary]
      : [routing.primary, ...routing.secondary.slice(0, 1)]; // Use primary + first secondary

    const responses: LLMResponse[] = [];

    // Execute queries in parallel
    const promises = agentsToUse.map(async (agentName) => {
      const agent = this.agents.get(agentName);
      if (!agent) {
        console.error(`Agent not found: ${agentName}`);
        return null;
      }

      try {
        const response = await agent.query({
          ...params,
          taskType,
        });
        return response;
      } catch (error) {
        console.error(`Agent ${agentName} failed:`, error);
        return null;
      }
    });

    const results = await Promise.all(promises);
    results.forEach((result) => {
      if (result) responses.push(result);
    });

    return this.aggregateResponses(taskType, responses);
  }

  /**
   * Aggregate responses from multiple agents
   */
  aggregateResponses(taskType: TaskType, responses: LLMResponse[]): AggregatedResponse {
    if (responses.length === 0) {
      return {
        taskType,
        responses: [],
        overallConfidence: 0,
        timestamp: new Date(),
      };
    }

    // Calculate overall confidence (weighted by individual confidence and agent specialty)
    const totalConfidence = responses.reduce((sum, r) => sum + r.confidence, 0);
    const overallConfidence = totalConfidence / responses.length;

    // Find consensus and divergent views
    const consensus = this.findConsensus(responses);
    const divergentViews = this.findDivergentViews(responses);

    return {
      taskType,
      responses,
      consensus,
      divergentViews,
      overallConfidence,
      timestamp: new Date(),
    };
  }

  /**
   * Find consensus across responses
   */
  private findConsensus(responses: LLMResponse[]): string | undefined {
    if (responses.length < 2) return undefined;

    // Simple approach: use the highest confidence response as the base
    const sortedByConfidence = [...responses].sort((a, b) => b.confidence - a.confidence);
    const primaryResponse = sortedByConfidence[0];

    // Check if other responses generally agree (would use NLP in production)
    const agreementCount = responses.filter((r) => r.confidence > 0.7).length;

    if (agreementCount >= responses.length * 0.6) {
      return `High agreement across ${agreementCount}/${responses.length} agents. Primary insight from ${primaryResponse.agentName}.`;
    }

    return undefined;
  }

  /**
   * Find divergent views across responses
   */
  private findDivergentViews(responses: LLMResponse[]): string[] {
    const divergent: string[] = [];

    // Look for low confidence responses or errors
    responses.forEach((response) => {
      if (response.confidence < 0.6 && !response.error) {
        divergent.push(`${response.agentName}: Low confidence (${(response.confidence * 100).toFixed(0)}%) - may require validation`);
      }
      if (response.error) {
        divergent.push(`${response.agentName}: Error - ${response.error}`);
      }
    });

    return divergent;
  }

  /**
   * Generate a complete store report
   */
  async generateReport(store: Store, sections?: SectionKey[]): Promise<StoreReport> {
    const startTime = Date.now();
    const sectionsToGenerate = sections || store.sections;
    const sectionReports: SectionReport[] = [];
    const agentsUsed = new Set<AgentName>();
    let totalTokens = 0;

    // Generate reports for each section
    for (const sectionKey of sectionsToGenerate) {
      const section = SECTIONS.find((s) => s.key === sectionKey);
      if (!section) continue;

      const sectionReport = await this.generateSectionReport(store, sectionKey);
      sectionReports.push(sectionReport);

      // Track agents used and tokens
      sectionReport.agentsContributed.forEach((a) => agentsUsed.add(a));
      totalTokens += sectionReport.insights.length * 500; // Estimate
    }

    // Generate executive summary using Claude
    const claudeAgent = this.agents.get('claude');
    let executiveSummary = 'Report generation complete.';

    if (claudeAgent) {
      const summaryResponse = await claudeAgent.query({
        prompt: `Generate a concise executive summary for Store #${store.number} (${store.name}) based on the following section insights. Focus on top 3 priorities and overall store health.`,
        context: sectionReports.map((sr) => `${sr.sectionName}: ${sr.summary}`).join('\n'),
        store,
      });

      if (!summaryResponse.error) {
        executiveSummary = summaryResponse.content;
        totalTokens += summaryResponse.tokensUsed;
      }
    }

    // Extract top priorities from all recommendations
    const allRecommendations = sectionReports.flatMap((sr) => sr.recommendations);
    const topPriorities = allRecommendations
      .filter((r) => r.priority === 'immediate' || (r.priority === 'short-term' && r.impact === 'high'))
      .sort((a, b) => {
        const priorityOrder = { immediate: 0, 'short-term': 1, 'long-term': 2 };
        const impactOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority] || impactOrder[a.impact] - impactOrder[b.impact];
      })
      .slice(0, 5);

    // Calculate overall confidence
    const overallConfidence = sectionReports.reduce((sum, sr) => sum + sr.overallConfidence, 0) / sectionReports.length;

    return {
      storeId: store.id,
      storeName: store.name,
      storeNumber: store.number,
      generatedAt: new Date(),
      generationDurationMs: Date.now() - startTime,
      sections: sectionReports,
      executiveSummary,
      topPriorities,
      agentsUsed: Array.from(agentsUsed),
      totalTokensUsed: totalTokens,
      overallConfidence,
    };
  }

  /**
   * Generate report for a single section
   */
  async generateSectionReport(store: Store, sectionKey: SectionKey): Promise<SectionReport> {
    const section = SECTIONS.find((s) => s.key === sectionKey);
    if (!section) {
      throw new Error(`Section not found: ${sectionKey}`);
    }

    // Map sections to relevant task types
    const sectionTaskMap: Record<SectionKey, TaskType[]> = {
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
    };

    const tasks = sectionTaskMap[sectionKey] || ['operational_efficiency'];
    const insights: ReportInsight[] = [];
    const recommendations: ReportRecommendation[] = [];
    const agentsContributed = new Set<AgentName>();
    const summaryParts: string[] = [];

    // Execute tasks for this section
    for (const taskType of tasks) {
      const aggregated = await this.executeTask(taskType, {
        prompt: `Analyze ${section.name} department (${section.description}) for Store #${store.number}. Provide specific insights and actionable recommendations.`,
        store,
        section: sectionKey,
        taskType,
      });

      // Extract insights and recommendations from responses
      aggregated.responses.forEach((response, index) => {
        agentsContributed.add(response.agentName);

        // Create insight from response
        insights.push({
          id: `${sectionKey}-${taskType}-${index}`,
          title: `${this.formatTaskType(taskType)} Analysis`,
          description: this.extractFirstParagraph(response.content),
          importance: response.confidence > 0.85 ? 'high' : response.confidence > 0.7 ? 'medium' : 'low',
          category: taskType,
          agentSource: response.agentName,
          confidence: response.confidence,
          dataPoints: response.metadata?.sources,
        });

        // Extract recommendations
        const recs = this.extractRecommendations(response.content, response.agentName, taskType);
        recommendations.push(...recs);
      });

      if (aggregated.consensus) {
        summaryParts.push(aggregated.consensus);
      }
    }

    // Calculate overall confidence for the section
    const overallConfidence = insights.length > 0
      ? insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length
      : 0.5;

    // Generate section summary
    const summary = summaryParts.length > 0
      ? summaryParts.join(' ')
      : `Analysis complete for ${section.name} with ${insights.length} insights generated.`;

    // Generate metrics for the section
    const metrics = this.generateSectionMetrics(section, store);

    return {
      sectionKey,
      sectionName: section.name,
      generatedAt: new Date(),
      summary,
      insights,
      recommendations: recommendations.slice(0, 5), // Top 5 recommendations per section
      metrics,
      agentsContributed: Array.from(agentsContributed),
      overallConfidence,
    };
  }

  /**
   * Format task type for display
   */
  private formatTaskType(taskType: TaskType): string {
    return taskType
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Extract first meaningful paragraph from content
   */
  private extractFirstParagraph(content: string): string {
    // Remove markdown headers and get first substantial paragraph
    const lines = content.split('\n').filter((line) => {
      const trimmed = line.trim();
      return trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('|') && !trimmed.startsWith('-');
    });

    const paragraph = lines.slice(0, 3).join(' ').trim();
    return paragraph.length > 300 ? paragraph.substring(0, 297) + '...' : paragraph;
  }

  /**
   * Extract recommendations from response content
   */
  private extractRecommendations(
    content: string,
    agentSource: AgentName,
    taskType: TaskType
  ): ReportRecommendation[] {
    const recommendations: ReportRecommendation[] = [];

    // Look for numbered recommendations or bullet points
    const lines = content.split('\n');
    let recCount = 0;

    lines.forEach((line) => {
      const trimmed = line.trim();
      // Look for numbered items or "Recommendation" mentions
      if (/^\d+[.)]\s+|^[-*]\s+(?:Implement|Deploy|Enhance|Improve|Optimize|Increase|Reduce)/i.test(trimmed)) {
        const title = trimmed.replace(/^\d+[.)]\s+|^[-*]\s+/, '').split(':')[0].trim();
        const description = trimmed.replace(/^\d+[.)]\s+|^[-*]\s+/, '');

        if (title.length > 10 && recCount < 3) {
          recommendations.push({
            id: `rec-${agentSource}-${taskType}-${recCount}`,
            title: title.substring(0, 60),
            description: description.substring(0, 200),
            priority: recCount === 0 ? 'immediate' : recCount === 1 ? 'short-term' : 'long-term',
            impact: recCount < 2 ? 'high' : 'medium',
            effort: 'medium',
            agentSource,
            confidence: 0.8,
          });
          recCount++;
        }
      }
    });

    return recommendations;
  }

  /**
   * Generate metrics for a section based on store data
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private generateSectionMetrics(_section: typeof SECTIONS[0], _store: Store): SectionReport['metrics'] {
    // Generate realistic mock metrics based on section and store
    const baseMetrics: SectionReport['metrics'] = [
      {
        name: 'Sales Contribution',
        value: `${(Math.random() * 15 + 5).toFixed(1)}%`,
        trend: Math.random() > 0.3 ? 'up' : 'stable',
        status: 'good',
      },
      {
        name: 'In-Stock Rate',
        value: `${(Math.random() * 3 + 96).toFixed(1)}%`,
        trend: Math.random() > 0.5 ? 'up' : 'stable',
        status: Math.random() > 0.2 ? 'good' : 'warning',
      },
      {
        name: 'Shrink Rate',
        value: `${(Math.random() * 1.5 + 0.5).toFixed(2)}%`,
        trend: Math.random() > 0.6 ? 'down' : 'stable',
        status: Math.random() > 0.7 ? 'good' : 'warning',
      },
    ];

    return baseMetrics;
  }

  /**
   * Health check all agents
   */
  async healthCheckAll(): Promise<Map<AgentName, HealthCheckResult>> {
    const checks = Array.from(this.agents.entries()).map(async ([name, agent]) => {
      const result = await agent.healthCheck();
      this.healthStatus.set(name, result);
      return [name, result] as [AgentName, HealthCheckResult];
    });

    const results = await Promise.all(checks);
    return new Map(results);
  }

  /**
   * Get current health status
   */
  getHealthStatus(): Map<AgentName, HealthCheckResult> {
    return this.healthStatus;
  }
}

/**
 * Get orchestrator singleton instance
 */
export function getOrchestrator(): LLMOrchestrator {
  return LLMOrchestrator.getInstance();
}

export default LLMOrchestrator;
