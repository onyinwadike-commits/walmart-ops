// Phase 2: Grok Agent - Realtime Role
// Uses grok-2-latest for real-time social trends and current events

import { LLMAgent } from '../base-agent';
import { AgentConfig, LLMResponse, QueryParams } from '../types';

const GROK_CONFIG: AgentConfig = {
  name: 'grok',
  role: 'realtime',
  model: 'grok-2-latest',
  apiEndpoint: 'https://api.x.ai/v1/chat/completions',
  apiKeyEnvVar: 'XAI_API_KEY',
  maxTokens: 4096,
  temperature: 0.3,
  rateLimit: {
    requestsPerMinute: 30,
    tokensPerMinute: 150000,
  },
  specialties: [
    'customer_traffic',
    'promotion_analysis',
    'market_trends',
    'customer_insights',
    'seasonal_planning',
  ],
  description: 'Real-time analysis agent with social media and current events awareness for trend detection',
};

export class GrokAgent extends LLMAgent {
  constructor() {
    super(GROK_CONFIG);
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
              content: `You are a real-time retail intelligence analyst for Walmart.
              Your strength is analyzing current trends, social media sentiment, and breaking events that impact retail.
              Focus on timely, actionable insights about customer behavior and market dynamics.
              Provide specific, data-driven recommendations with urgency levels.`,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: params.maxTokens || this.config.maxTokens,
          temperature: params.temperature ?? this.config.temperature,
        }),
      });

      if (!response.ok) {
        throw new Error(`Grok API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';

      return {
        agentName: this.name,
        role: this.role,
        content,
        confidence: this.parseConfidence(content),
        tokensUsed: data.usage?.total_tokens || 0,
        latencyMs: Date.now() - startTime,
        timestamp: new Date(),
        metadata: {
          dataPoints: this.countTrendIndicators(content),
        },
      };
    } catch (error) {
      // For development/demo, return mock response if API fails
      if (process.env.NODE_ENV === 'development' || !process.env.XAI_API_KEY) {
        return this.getMockResponse(params, startTime);
      }
      throw error;
    }
  }

  private countTrendIndicators(content: string): number {
    const trendWords = ['trending', 'viral', 'spike', 'surge', 'drop', 'peak'];
    return trendWords.reduce((count, word) => {
      return count + (content.toLowerCase().match(new RegExp(word, 'g'))?.length || 0);
    }, 0);
  }

  private getMockResponse(params: QueryParams, startTime: number): LLMResponse {
    const currentHour = new Date().getHours();
    const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    const mockResponses: Record<string, string> = {
      customer_traffic: `## Real-Time Traffic Analysis (Confidence: 89%)

### Current Store Conditions - ${dayOfWeek}

**Live Traffic Status:**
- Current hour (${currentHour}:00): ${currentHour >= 10 && currentHour <= 20 ? 'HIGH' : 'MODERATE'} traffic
- Parking lot utilization: ~${Math.floor(Math.random() * 30) + 60}%
- Checkout wait times: ${Math.floor(Math.random() * 5) + 3} minutes average

**Trending Events Impact:**
- Local sports event tonight: +15% expected traffic (6-8 PM)
- Social media buzz: "Walmart deals" mentions up 23% today
- Weather forecast: Clear skies, outdoor section traffic expected

**Immediate Actions:**
1. Staff additional registers from 5-8 PM
2. Restock grab-and-go items at front
3. Deploy floor associates to Electronics (high interest)

**Traffic Prediction (Next 4 Hours):**
- ${currentHour + 1}:00 - ${currentHour >= 16 && currentHour <= 18 ? 'PEAK' : 'STEADY'}
- ${currentHour + 2}:00 - ${currentHour >= 17 && currentHour <= 19 ? 'PEAK' : 'MODERATE'}
- ${currentHour + 3}:00 - MODERATE
- ${currentHour + 4}:00 - ${currentHour >= 20 ? 'DECLINING' : 'MODERATE'}`,

      promotion_analysis: `## Promotion Effectiveness - Live Analysis (Confidence: 86%)

### Active Promotions Performance

**Top Performing (Real-Time):**
1. Electronics Bundle Deal - Conversion: 34% (up from 28%)
2. Grocery BOGO - Basket size: +$18 average
3. Back-to-School Promo - High social engagement

**Social Media Sentiment:**
- Twitter mentions: 847 (last 24h)
- Sentiment: 72% positive, 18% neutral, 10% negative
- Top complaint: "Stock availability" on deal items

**Competitor Promos Detected:**
- Target: 20% off home goods (ends Sunday)
- Amazon: Prime Day echo deals extended
- Best Buy: Price matching most electronics

**Optimization Recommendations:**
1. Increase signage visibility for Bundle Deal
2. Cross-promote related items at endcaps
3. Address stock concerns with additional replenishment`,

      default: `## Real-Time Market Intelligence (Confidence: 84%)

### Current Trends & Events

**What's Happening Now:**
- Regional traffic patterns show ${dayOfWeek} typical behavior
- No major disruptive events detected
- Consumer sentiment: Stable with slight positive trend

**Social Listening Highlights:**
- Brand mentions: Within normal range
- Trending products: Home organization, seasonal items
- Customer service mentions: Positive sentiment

**Actionable Insights:**
1. Capitalize on positive sentiment with engagement
2. Monitor competitor flash sales
3. Prepare for upcoming weekend traffic

**Alert Level:** Normal Operations`,
    };

    const taskType = params.taskType || 'default';
    const content = mockResponses[taskType] || mockResponses.default;

    return {
      agentName: this.name,
      role: this.role,
      content,
      confidence: 0.87,
      tokensUsed: Math.floor(content.length / 4),
      latencyMs: Date.now() - startTime,
      timestamp: new Date(),
      metadata: {
        dataPoints: this.countTrendIndicators(content),
        reasoning: 'Mock response for development environment',
      },
    };
  }
}

export default GrokAgent;
