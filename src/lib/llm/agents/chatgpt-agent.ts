// Phase 2: ChatGPT Agent - General Role
// Uses gpt-4o for general purpose analysis and customer communication

import { LLMAgent } from '../base-agent';
import { AgentConfig, LLMResponse, QueryParams } from '../types';

const CHATGPT_CONFIG: AgentConfig = {
  name: 'chatgpt',
  role: 'general',
  model: 'gpt-4o',
  apiEndpoint: 'https://api.openai.com/v1/chat/completions',
  apiKeyEnvVar: 'OPENAI_API_KEY',
  maxTokens: 4096,
  temperature: 0.5,
  rateLimit: {
    requestsPerMinute: 60,
    tokensPerMinute: 300000,
  },
  specialties: [
    'customer_insights',
    'associate_performance',
    'promotion_analysis',
    'sales_forecast',
    'ecommerce_integration',
  ],
  description: 'Versatile general-purpose agent for customer analytics, communication, and broad retail analysis',
};

export class ChatGPTAgent extends LLMAgent {
  constructor() {
    super(CHATGPT_CONFIG);
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
              content: `You are a retail analytics expert for Walmart stores.
              Your strength is synthesizing diverse data sources into clear, actionable insights.
              Focus on customer behavior, sales patterns, and performance optimization.
              Communicate findings in a clear, accessible manner suitable for store leadership.`,
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
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      const totalTokens = data.usage?.total_tokens || 0;

      return {
        agentName: this.name,
        role: this.role,
        content,
        confidence: this.parseConfidence(content),
        tokensUsed: totalTokens,
        latencyMs: Date.now() - startTime,
        timestamp: new Date(),
        metadata: {
          dataPoints: this.countAnalyticsTerms(content),
        },
      };
    } catch (error) {
      // For development/demo, return mock response if API fails
      if (process.env.NODE_ENV === 'development' || !process.env.OPENAI_API_KEY) {
        return this.getMockResponse(params, startTime);
      }
      throw error;
    }
  }

  private countAnalyticsTerms(content: string): number {
    const terms = ['customer', 'sales', 'performance', 'trend', 'growth', 'conversion', 'basket'];
    return terms.reduce((count, term) => {
      return count + (content.toLowerCase().match(new RegExp(term, 'g'))?.length || 0);
    }, 0);
  }

  private getMockResponse(params: QueryParams, startTime: number): LLMResponse {
    const storeName = params.store?.name || 'Store';
    const satisfaction = params.store?.metrics.customerSatisfaction || 4.3;

    const mockResponses: Record<string, string> = {
      customer_insights: `## Customer Intelligence Report (Confidence: 88%)

### ${storeName} Customer Profile Analysis

**Customer Segmentation:**
| Segment | % of Traffic | Avg Basket | Visit Freq |
|---------|-------------|------------|------------|
| Value Seekers | 35% | $42 | 2.1x/week |
| Convenience Shoppers | 28% | $28 | 3.4x/week |
| Stock-Up Buyers | 22% | $156 | 0.8x/week |
| Digital-First | 15% | $89 | 1.2x/week |

**Satisfaction Drivers (CSAT: ${satisfaction}/5):**
1. **Product Availability** - Score: 4.1/5
   - Key feedback: Fresh produce quality praised
   - Opportunity: Electronics in-stock improvement

2. **Checkout Experience** - Score: 4.2/5
   - Wait times within acceptable range
   - Self-checkout adoption increasing

3. **Store Cleanliness** - Score: 4.5/5
   - Consistently high marks
   - Restroom feedback improved

**Voice of Customer Themes:**
- "Great prices on groceries" - 234 mentions
- "Need more staff during busy times" - 89 mentions
- "Love the pickup service" - 156 mentions

**Recommended Actions:**
1. Targeted loyalty offers for Convenience segment
2. Expand Stock-Up buyer exclusive deals
3. Enhance digital experience for mobile shoppers`,

      sales_forecast: `## Sales Forecast Analysis (Confidence: 86%)

### Projected Performance - Next 4 Weeks

**Weekly Sales Projections:**
| Week | Projected Sales | vs LY | Confidence |
|------|----------------|-------|------------|
| Week 1 | $1.82M | +3.2% | High |
| Week 2 | $1.78M | +2.8% | High |
| Week 3 | $1.91M | +5.1% | Medium |
| Week 4 | $2.04M | +7.2% | Medium |

**Category Forecasts:**
- **Grocery (+4.2%)**: Stable demand, seasonal uptick
- **Fresh (+6.8%)**: Back-to-school meal prep driving
- **GM (-1.2%)**: Post-summer normalization
- **Apparel (+3.5%)**: Fall transition beginning

**Contributing Factors:**
1. Local events calendar (positive impact)
2. Weather forecast (favorable for traffic)
3. Competitor promotional calendar (moderate pressure)
4. Economic indicators (consumer confidence stable)

**Risk Factors:**
- Supply chain delays in electronics
- Labor shortage during peak hours
- Competitor price aggressive in grocery

**Recommended Preparations:**
1. Increase Fresh department staffing 10%
2. Pre-position back-to-school inventory
3. Prepare markdown budget for GM clearance`,

      associate_performance: `## Associate Performance Analytics (Confidence: 87%)

### Team Performance Summary

**Engagement Score: ${params.store?.metrics.associateEngagement || 78}%**

**Department Performance:**
| Department | Productivity | Engagement | Turnover |
|------------|-------------|------------|----------|
| Fresh | 94% | 82% | 18% |
| GM | 88% | 75% | 24% |
| Front End | 91% | 79% | 22% |
| OGP | 96% | 84% | 15% |
| Stocking | 85% | 71% | 28% |

**Top Performers (Recognition Candidates):**
1. OGP Team - Exceeding all metrics
2. Fresh Department - Quality scores highest in market
3. Customer Service Desk - Lowest complaint rate

**Improvement Opportunities:**
1. **Stocking Team**
   - Challenge: High turnover, productivity gaps
   - Solution: Mentorship program, shift flexibility

2. **GM Department**
   - Challenge: Engagement declining
   - Solution: Cross-training, recognition program

**Training Priorities:**
- New POS system (all front end)
- Safety recertification (all associates)
- Customer service excellence (targeted 20%)

**Recommended Investments:**
- Recognition program enhancement: $2,500
- Training hours increase: 15%
- Schedule optimization tool: $4,000/year`,

      default: `## General Analytics Summary (Confidence: 85%)

### Store Performance Overview

**Key Performance Indicators:**
- Sales performance: Tracking to plan
- Customer satisfaction: ${satisfaction}/5
- Operational metrics: Within targets

**Highlights:**
- Strong performance in fresh departments
- Digital adoption continuing to grow
- Customer traffic patterns normalizing

**Areas for Focus:**
1. Inventory management optimization
2. Peak hour staffing alignment
3. Cross-category selling opportunities

**Customer Feedback Summary:**
- Overall sentiment: Positive
- Top compliments: Value, convenience
- Top concerns: Wait times during peak

**Recommended Next Steps:**
1. Review weekly performance dashboards
2. Address staffing for upcoming events
3. Monitor competitor activity`,
    };

    const taskType = params.taskType || 'default';
    const content = mockResponses[taskType] || mockResponses.default;

    return {
      agentName: this.name,
      role: this.role,
      content,
      confidence: 0.86,
      tokensUsed: Math.floor(content.length / 4),
      latencyMs: Date.now() - startTime,
      timestamp: new Date(),
      metadata: {
        dataPoints: this.countAnalyticsTerms(content),
        reasoning: 'Mock response for development environment',
      },
    };
  }
}

export default ChatGPTAgent;
