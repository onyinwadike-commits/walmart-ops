// Phase 2: Gemini Agent - Visual Role
// Uses gemini-2.0-flash for visual merchandising and layout analysis

import { LLMAgent } from '../base-agent';
import { AgentConfig, LLMResponse, QueryParams } from '../types';

const GEMINI_CONFIG: AgentConfig = {
  name: 'gemini',
  role: 'visual',
  model: 'gemini-2.0-flash',
  apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
  apiKeyEnvVar: 'GOOGLE_AI_API_KEY',
  maxTokens: 8192,
  temperature: 0.4,
  rateLimit: {
    requestsPerMinute: 60,
    tokensPerMinute: 200000,
  },
  specialties: [
    'visual_merchandising',
    'inventory_optimization',
    'seasonal_planning',
    'customer_traffic',
    'operational_efficiency',
  ],
  description: 'Visual intelligence agent specializing in merchandising layouts, planograms, and space optimization',
};

export class GeminiAgent extends LLMAgent {
  constructor() {
    super(GEMINI_CONFIG);
  }

  protected async executeQuery(params: QueryParams): Promise<LLMResponse> {
    const startTime = Date.now();

    try {
      const apiKey = this.getApiKey();
      const prompt = this.buildStorePrompt(params);

      const response = await fetch(`${this.config.apiEndpoint}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a visual merchandising expert for Walmart retail stores.
                  Your expertise includes planogram optimization, store layout, visual displays, and space management.
                  Provide specific, actionable recommendations for improving visual appeal and sales lift.
                  Include measurements and specific locations when relevant.

                  ${prompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: params.temperature ?? this.config.temperature,
            maxOutputTokens: params.maxTokens || this.config.maxTokens,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const tokenCount = data.usageMetadata?.totalTokenCount || 0;

      return {
        agentName: this.name,
        role: this.role,
        content,
        confidence: this.parseConfidence(content),
        tokensUsed: tokenCount,
        latencyMs: Date.now() - startTime,
        timestamp: new Date(),
        metadata: {
          dataPoints: this.countVisualElements(content),
        },
      };
    } catch (error) {
      // For development/demo, return mock response if API fails
      if (process.env.NODE_ENV === 'development' || !process.env.GOOGLE_AI_API_KEY) {
        return this.getMockResponse(params, startTime);
      }
      throw error;
    }
  }

  private countVisualElements(content: string): number {
    const visualTerms = ['display', 'endcap', 'planogram', 'signage', 'fixture', 'layout', 'shelf', 'aisle'];
    return visualTerms.reduce((count, term) => {
      return count + (content.toLowerCase().match(new RegExp(term, 'g'))?.length || 0);
    }, 0);
  }

  private getMockResponse(params: QueryParams, startTime: number): LLMResponse {
    const sectionKey = params.section || 'A';

    const mockResponses: Record<string, string> = {
      visual_merchandising: `## Visual Merchandising Recommendations (Confidence: 91%)

### Section ${sectionKey} Layout Analysis

**Current Assessment:**
- Aisle flow efficiency: 78% (Target: 85%)
- Visual blocking points: 3 identified
- Cross-merchandise opportunities: 7 potential zones

**Priority Improvements:**

1. **Entry Focal Point (High Impact)**
   - Current: Basic promotional table
   - Recommended: Elevated 3-tier seasonal display
   - Expected lift: +12% category sales
   - Implementation: 2 hours, 2 associates

2. **Endcap Optimization**
   | Location | Current | Recommended | Est. Lift |
   |----------|---------|-------------|-----------|
   | Aisle 1 End | Static | Interactive demo | +18% |
   | Aisle 3 End | Mixed | Themed bundle | +15% |
   | Aisle 5 End | Overflow | Value story | +10% |

3. **Sightline Corrections**
   - Remove 6ft fixture blocking from main aisle
   - Lower signage height at zones B2, B4
   - Add directional floor graphics

**Color Psychology Application:**
- Warm tones for impulse areas (entrance, checkout)
- Cool tones for consideration zones (electronics, home)
- Accent colors at decision points

**Planogram Compliance:**
- Current compliance: 87%
- Non-compliant sections: 4
- Estimated revenue impact of correction: +$4,200/week`,

      inventory_optimization: `## Visual Inventory Optimization (Confidence: 88%)

### Space-to-Sales Analysis

**Overallocated Categories:**
1. Basic paper goods - 15% more space than sales warrant
2. Standard cleaning supplies - 12% over
3. Non-premium pet food - 8% over

**Underallocated Categories:**
1. Premium snacks - Needs 20% more facing
2. Health/wellness - Space constraint limiting sales
3. Home organization - High velocity, low allocation

**Recommended Adjustments:**

**Fixture Changes:**
- Add 4ft gondola to high-velocity snacks
- Convert 8ft section to adjustable shelving
- Install 2 additional power aisle displays

**Visual Stock Levels:**
- Maintain 80% shelf capacity for premium appearance
- Create "abundance" zones at entrance categories
- Implement forward-facing protocol for premium items

**Expected Results:**
- Space efficiency improvement: +18%
- Sales per square foot increase: +$2.40
- Inventory turn improvement: 0.3x`,

      default: `## Visual Analysis Report (Confidence: 85%)

### Store Visual Assessment

**Overall Visual Score:** 7.8/10

**Strengths:**
- Clean sightlines in main action alley
- Effective use of seasonal displays
- Good lighting in fresh departments

**Improvement Opportunities:**
1. Enhance wayfinding signage consistency
2. Optimize endcap rotation schedule
3. Improve cross-category visual connections

**Quick Wins (This Week):**
- Refresh promotional signage
- Reposition feature tables
- Add visual breaks in long aisles

**Strategic Projects (This Quarter):**
- Digital signage pilot in electronics
- Enhanced checkout visual merchandising
- Entrance experience redesign`,
    };

    const taskType = params.taskType || 'default';
    const content = mockResponses[taskType] || mockResponses.default;

    return {
      agentName: this.name,
      role: this.role,
      content,
      confidence: 0.89,
      tokensUsed: Math.floor(content.length / 4),
      latencyMs: Date.now() - startTime,
      timestamp: new Date(),
      metadata: {
        dataPoints: this.countVisualElements(content),
        reasoning: 'Mock response for development environment',
      },
    };
  }
}

export default GeminiAgent;
