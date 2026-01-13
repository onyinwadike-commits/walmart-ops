// Phase 2: Multi-LLM Report Generation Engine - Base Agent Class
// Abstract class with rate limiting and retry logic

import {
  AgentConfig,
  AgentName,
  AgentRole,
  LLMResponse,
  QueryParams,
  TokenBucket,
  RetryConfig,
  HealthCheckResult,
  TaskType,
} from './types';

// Default retry configuration
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 30000,
  exponentialBackoff: true,
};

/**
 * Abstract base class for all LLM agents
 * Implements token bucket rate limiting and exponential backoff retry logic
 */
export abstract class LLMAgent {
  protected config: AgentConfig;
  protected tokenBucket: TokenBucket;
  protected retryConfig: RetryConfig;
  protected isInitialized: boolean = false;
  protected lastHealthCheck: HealthCheckResult | null = null;

  constructor(config: AgentConfig, retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG) {
    this.config = config;
    this.retryConfig = retryConfig;

    // Initialize token bucket for rate limiting
    this.tokenBucket = {
      tokens: config.rateLimit.requestsPerMinute,
      lastRefill: Date.now(),
      maxTokens: config.rateLimit.requestsPerMinute,
      refillRate: config.rateLimit.requestsPerMinute / 60000, // tokens per ms
    };
  }

  // Getters for agent properties
  get name(): AgentName {
    return this.config.name;
  }

  get role(): AgentRole {
    return this.config.role;
  }

  get model(): string {
    return this.config.model;
  }

  get specialties(): TaskType[] {
    return this.config.specialties;
  }

  get description(): string {
    return this.config.description;
  }

  /**
   * Refill token bucket based on elapsed time
   */
  private refillTokenBucket(): void {
    const now = Date.now();
    const elapsed = now - this.tokenBucket.lastRefill;
    const tokensToAdd = elapsed * this.tokenBucket.refillRate;

    this.tokenBucket.tokens = Math.min(
      this.tokenBucket.maxTokens,
      this.tokenBucket.tokens + tokensToAdd
    );
    this.tokenBucket.lastRefill = now;
  }

  /**
   * Check if we can make a request (rate limiting)
   */
  protected async waitForRateLimit(): Promise<void> {
    this.refillTokenBucket();

    if (this.tokenBucket.tokens < 1) {
      // Calculate wait time until we have a token
      const waitTime = (1 - this.tokenBucket.tokens) / this.tokenBucket.refillRate;
      console.log(`[${this.name}] Rate limited, waiting ${Math.ceil(waitTime)}ms`);
      await this.sleep(Math.ceil(waitTime));
      this.refillTokenBucket();
    }

    // Consume a token
    this.tokenBucket.tokens -= 1;
  }

  /**
   * Sleep utility
   */
  protected sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Calculate delay for exponential backoff
   */
  protected calculateBackoffDelay(attempt: number): number {
    if (!this.retryConfig.exponentialBackoff) {
      return this.retryConfig.baseDelayMs;
    }

    const delay = this.retryConfig.baseDelayMs * Math.pow(2, attempt);
    // Add jitter (0-25% of delay)
    const jitter = delay * Math.random() * 0.25;
    return Math.min(delay + jitter, this.retryConfig.maxDelayMs);
  }

  /**
   * Execute query with retry logic
   */
  async query(params: QueryParams): Promise<LLMResponse> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        // Wait for rate limit
        await this.waitForRateLimit();

        // Execute the actual query
        const startTime = Date.now();
        const response = await this.executeQuery(params);
        response.latencyMs = Date.now() - startTime;

        return response;
      } catch (error) {
        lastError = error as Error;
        console.error(`[${this.name}] Query attempt ${attempt + 1} failed:`, lastError.message);

        // Don't retry on the last attempt
        if (attempt < this.retryConfig.maxRetries) {
          const delay = this.calculateBackoffDelay(attempt);
          console.log(`[${this.name}] Retrying in ${Math.ceil(delay)}ms...`);
          await this.sleep(delay);
        }
      }
    }

    // Return error response after all retries failed
    return {
      agentName: this.name,
      role: this.role,
      content: '',
      confidence: 0,
      tokensUsed: 0,
      latencyMs: 0,
      timestamp: new Date(),
      error: lastError?.message || 'Unknown error after retries',
    };
  }

  /**
   * Abstract method to be implemented by each agent
   * Performs the actual API call to the LLM provider
   */
  protected abstract executeQuery(params: QueryParams): Promise<LLMResponse>;

  /**
   * Health check to verify the agent is operational
   */
  async healthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      // Simple health check query
      const response = await this.executeQuery({
        prompt: 'Respond with "OK" if you are operational.',
        maxTokens: 10,
      });

      const result: HealthCheckResult = {
        agentName: this.name,
        healthy: !response.error && response.content.toLowerCase().includes('ok'),
        latencyMs: Date.now() - startTime,
        lastChecked: new Date(),
      };

      this.lastHealthCheck = result;
      return result;
    } catch (error) {
      const result: HealthCheckResult = {
        agentName: this.name,
        healthy: false,
        error: (error as Error).message,
        lastChecked: new Date(),
      };

      this.lastHealthCheck = result;
      return result;
    }
  }

  /**
   * Get the last health check result
   */
  getLastHealthCheck(): HealthCheckResult | null {
    return this.lastHealthCheck;
  }

  /**
   * Check if the agent handles a specific task type
   */
  canHandleTask(taskType: TaskType): boolean {
    return this.config.specialties.includes(taskType);
  }

  /**
   * Get confidence score for a task type based on specialization
   */
  getTaskConfidence(taskType: TaskType): number {
    if (!this.canHandleTask(taskType)) {
      return 0.3; // Low confidence for non-specialty tasks
    }

    // Higher confidence for specialty tasks
    const specialtyIndex = this.config.specialties.indexOf(taskType);
    // First specialty gets highest confidence
    return 0.95 - specialtyIndex * 0.05;
  }

  /**
   * Build a context-aware prompt for store operations
   */
  protected buildStorePrompt(params: QueryParams): string {
    let prompt = params.prompt;

    if (params.store) {
      prompt = `
Store Context:
- Store #${params.store.number}: ${params.store.name}
- Location: ${params.store.city}, ${params.store.state}
- Format: ${params.store.format}
- Square Footage: ${params.store.sqft.toLocaleString()} sq ft
- Associates: ${params.store.associates}
- Sales YTD: $${(params.store.metrics.salesYTD / 1000000).toFixed(1)}M
- Comp %: ${params.store.metrics.compPercent}%
- Inventory Accuracy: ${params.store.metrics.inventoryAccuracy}%
- Customer Satisfaction: ${params.store.metrics.customerSatisfaction}/5

${params.context || ''}

Task: ${params.prompt}
`;
    }

    if (params.section) {
      prompt += `\n\nFocus Area: Section ${params.section}`;
    }

    return prompt;
  }

  /**
   * Parse confidence from model response
   * Looks for explicit confidence indicators in the response
   */
  protected parseConfidence(response: string): number {
    // Look for explicit confidence mentions
    const confidenceMatch = response.match(/confidence[:\s]+(\d+(?:\.\d+)?)[%]?/i);
    if (confidenceMatch) {
      const value = parseFloat(confidenceMatch[1]);
      return value > 1 ? value / 100 : value;
    }

    // Default to medium-high confidence for successful responses
    return 0.75;
  }

  /**
   * Get API key from environment
   */
  protected getApiKey(): string {
    const apiKey = process.env[this.config.apiKeyEnvVar];
    if (!apiKey) {
      throw new Error(`API key not found: ${this.config.apiKeyEnvVar}`);
    }
    return apiKey;
  }
}

export default LLMAgent;
