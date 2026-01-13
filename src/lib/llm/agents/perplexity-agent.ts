// Phase 2: Perplexity Agent - Research Role
// Uses Sonar Pro model for deep research and competitor analysis

import { LLMAgent } from '../base-agent';
import { AgentConfig, LLMResponse, QueryParams } from '../types';

const PERPLEXITY_CONFIG: AgentConfig = {
  name: 'perplexity',
  role: 'research',
  model: 'sonar-pro',
  apiEndpoint: 'https://api.perplexity.ai/chat/completions',
  apiKeyEnvVar: 'PERPLEXITY_API_KEY',
  maxTokens: 4096,
  temperature: 0.2,
  rateLimit: {
    requestsPerMinute: 20,
    tokensPerMinute: 100000,
  },
  specialties: [
    'competitor_analysis',
    'market_trends',
    'customer_insights',
    'pricing_strategy',
    'seasonal_planning',
  ],
  description: 'Deep research and analysis agent with real-time web access for competitor intelligence and market trends',
};

export class PerplexityAgent extends LLMAgent {
  constructor() {
    super(PERPLEXITY_CONFIG);
  }

  protected async executeQuery(params: QueryParams): Promise<LLMResponse> {
    const startTime = Date.now();

    try {
      const apiKey = this.getApiKey();
      const prompt = this.buildStorePrompt(params);

      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: `You are a retail research analyst specializing in Walmart store operations.
              Provide data-driven insights with specific recommendations.
              Focus on actionable intelligence from market research, competitor analysis, and industry trends.
              Always cite sources when available and provide confidence levels for your analysis.`,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: params.maxTokens || this.config.maxTokens,
          temperature: params.temperature ?? this.config.temperature,
          return_citations: true,
          return_images: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      const citations = data.citations || [];

      return {
        agentName: this.name,
        role: this.role,
        content,
        confidence: this.parseConfidence(content),
        tokensUsed: data.usage?.total_tokens || 0,
        latencyMs: Date.now() - startTime,
        timestamp: new Date(),
        metadata: {
          sources: citations.map((c: { url?: string }) => c.url).filter(Boolean),
          citations: citations,
          dataPoints: this.countDataPoints(content),
        },
      };
    } catch (error) {
      // For development/demo, return mock response if API fails
      if (process.env.NODE_ENV === 'development' || !process.env.PERPLEXITY_API_KEY) {
        return this.getMockResponse(params, startTime);
      }
      throw error;
    }
  }

  private countDataPoints(content: string): number {
    // Count numbers, percentages, and statistics in the response
    const matches = content.match(/\d+(?:\.\d+)?%?|\$[\d,]+(?:\.\d+)?[MBK]?/g);
    return matches?.length || 0;
  }

  private getMockResponse(params: QueryParams, startTime: number): LLMResponse {
    const mockResponses: Record<string, string> = {
      competitor_analysis: `## Competitor Analysis for ${params.store?.name || 'Store'}

### Key Findings (Confidence: 87%)

**Amazon Threat Assessment:**
- Amazon Fresh locations within 10-mile radius: 2
- Prime membership penetration in area: 68%
- Same-day delivery coverage: Full coverage

**Local Competition:**
1. Target (2.3 miles) - Strong in Home and Apparel
2. Costco (4.1 miles) - Bulk consumables overlap
3. Albertsons (0.8 miles) - Grocery price competition

**Recommendations:**
1. Enhance OGP capacity during peak hours (2-6 PM)
2. Price match strategy for top 50 SKUs in Fresh
3. Emphasize exclusive brands in promotional materials

**Data Sources:** Nielsen retail data, Placer.ai foot traffic, local market surveys`,

      market_trends: `## Market Trends Analysis (Confidence: 84%)

### Las Vegas Metro Retail Insights

**Consumer Behavior Shifts:**
- 23% increase in curbside pickup usage (YoY)
- Premium private label growth: +18%
- Sustainability-focused products: +31% demand

**Seasonal Factors:**
- Tourism peak: March-May, Oct-Dec
- Local resident shopping patterns shift during events
- Weather impact on lawn/garden: Extreme heat considerations

**Emerging Categories:**
1. Smart home devices (+42% growth)
2. Plant-based alternatives (+28%)
3. Pet premium products (+19%)

**Action Items:**
- Adjust inventory for tourism peaks
- Expand sustainable product endcaps
- Increase smart home demo areas`,

      default: `## Research Analysis Report (Confidence: 82%)

Based on comprehensive market research and data analysis:

**Key Insights:**
1. Market conditions show positive trends in the region
2. Consumer preferences are shifting toward convenience
3. Competition intensity remains moderate

**Recommendations:**
- Focus on differentiation through service quality
- Optimize pricing strategy for key categories
- Invest in digital integration capabilities

**Sources:** Industry reports, market surveys, competitive intelligence`,
    };

    const taskType = params.taskType || 'default';
    const content = mockResponses[taskType] || mockResponses.default;

    return {
      agentName: this.name,
      role: this.role,
      content,
      confidence: 0.85,
      tokensUsed: Math.floor(content.length / 4),
      latencyMs: Date.now() - startTime,
      timestamp: new Date(),
      metadata: {
        sources: ['Nielsen Retail Data', 'Placer.ai', 'Industry Reports'],
        dataPoints: this.countDataPoints(content),
        reasoning: 'Mock response for development environment',
      },
    };
  }
}

export default PerplexityAgent;
