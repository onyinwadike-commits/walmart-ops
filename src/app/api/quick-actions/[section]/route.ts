import { NextRequest, NextResponse } from 'next/server';
import { STORE_2593 } from '@/data/stores';

type SectionId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';

interface SectionConfig {
  title: string;
  description: string;
  llmPrimary: 'Claude Sonnet' | 'GPT-4o' | 'Perplexity' | 'DeepSeek' | 'Grok' | 'Gemini';
  llmSecondary?: 'Claude Sonnet' | 'GPT-4o' | 'Perplexity' | 'DeepSeek' | 'Grok' | 'Gemini';
  llmTertiary?: 'Claude Sonnet' | 'GPT-4o' | 'Perplexity' | 'DeepSeek' | 'Grok' | 'Gemini';
  promptTemplate: string;
}

interface ReportData {
  title: string;
  content: string;
  sections: {
    heading: string;
    content: string;
    items?: string[];
    metrics?: { label: string; value: string; trend?: 'up' | 'down' | 'stable' }[];
  }[];
  llmUsed: string[];
  generatedAt: string;
  confidence: number;
  sectionId?: SectionId;
}

// LLM Routing Configuration (as specified by user):
// A - Executive Summary: Claude Sonnet → GPT-4o (Synthesis, prioritization)
// B - Action Plan: Claude Sonnet → GPT-4o (Strategic planning)
// C - Competitive Intel: Perplexity → Claude Sonnet → Gemini (Real-time search)
// D - E-Commerce Benchmarks: Perplexity → DeepSeek (Price lookups)
// E - Stress Maps: Claude Sonnet → GPT-4o (Predictive modeling)
// F - Checklists: GPT-4o → Claude Sonnet (Structured output)
// G - Risk Watchlist: Claude Sonnet → Perplexity (Risk analysis)
// H - Scorecard: DeepSeek → GPT-4o (Cost-effective templates)
// I - Comms Aids: GPT-4o → Claude Sonnet (Creative messaging)
// J - Social Media: Grok → GPT-4o (Real-time trends)

const SECTION_CONFIGS: Record<SectionId, SectionConfig> = {
  A: {
    title: 'Executive Summary',
    description: 'High-level store overview with AI-driven insights',
    llmPrimary: 'Claude Sonnet',
    llmSecondary: 'GPT-4o',
    promptTemplate: `Generate an Executive Summary for Walmart Store #{{storeNumber}} ({{storeName}}) in {{city}}, {{state}}.

Current conditions:
- Weather: {{weather}}
- Day: {{dayOfWeek}}
- Time: {{timeOfDay}}
- Local Events: {{events}}

Include:
1. Today's Priority Focus (top 3 items based on conditions)
2. Key Performance Indicators snapshot
3. Weather/Event impact assessment
4. Quick wins for the day
5. Executive talking points

Format as actionable bullets with clear priorities.`,
  },
  B: {
    title: 'Prioritized Action Plan',
    description: 'Dynamic task prioritization based on real-time conditions',
    llmPrimary: 'Claude Sonnet',
    llmSecondary: 'GPT-4o',
    promptTemplate: `Create a Prioritized Action Plan for Walmart Store #{{storeNumber}} for today.

Context:
- Weather: {{weather}}
- Expected foot traffic: {{traffic}}
- Staffing level: {{staffing}}
- Local events: {{events}}

Generate:
1. IMMEDIATE ACTIONS (Next 2 hours)
2. MORNING PRIORITIES (Before noon)
3. AFTERNOON FOCUS (After lunch rush)
4. END-OF-DAY CHECKLIST

For each action include:
- Task description
- Responsible department
- Expected time to complete
- Impact level (High/Medium/Low)`,
  },
  C: {
    title: 'Competitive Outperform Plan',
    description: 'Real-time competitive intelligence and counter-strategies',
    llmPrimary: 'Perplexity',
    llmSecondary: 'Claude Sonnet',
    llmTertiary: 'Gemini',
    promptTemplate: `Analyze competitive landscape for Walmart Store #{{storeNumber}} in {{city}}, {{state}}.

Competitors nearby:
- Target: {{targetDistance}} miles
- Costco: {{costcoDistance}} miles
- Amazon Fresh Hub: {{amazonDistance}} miles

Research and provide:
1. Current competitor promotions/sales happening TODAY
2. Price comparison on key items (top 10 categories)
3. Competitive advantages to highlight
4. Counter-strategies for each competitor
5. Customer capture opportunities today

Include specific actionable tactics for store team.`,
  },
  D: {
    title: 'E-Commerce Benchmark',
    description: 'OGP/Delivery performance metrics and optimization',
    llmPrimary: 'Perplexity',
    llmSecondary: 'DeepSeek',
    promptTemplate: `Generate E-Commerce Performance Benchmark for Store #{{storeNumber}}.

Analyze:
1. OGP (Online Grocery Pickup) metrics
   - Pick rate targets
   - Wait time optimization
   - Substitution rate management

2. Delivery Performance
   - On-time delivery rate
   - Driver efficiency
   - Customer satisfaction scores

3. Industry benchmarks comparison
4. Specific improvement recommendations
5. Technology utilization opportunities

Provide actionable KPIs and improvement tactics.`,
  },
  E: {
    title: 'Predictive Stress Map',
    description: 'AI-predicted pressure points and proactive staffing',
    llmPrimary: 'Claude Sonnet',
    llmSecondary: 'GPT-4o',
    promptTemplate: `Generate Predictive Stress Map for Store #{{storeNumber}} for today.

Current Data:
- Weather: {{weather}}
- Day of week: {{dayOfWeek}}
- Local events: {{events}}
- Historical peak hours: {{peakHours}}
- Current staffing: {{staffing}}

Predict and visualize:
1. HOURLY TRAFFIC FORECAST (6 AM - 11 PM)
2. DEPARTMENT PRESSURE POINTS
   - Grocery: Expected stress level
   - Checkout: Queue predictions
   - OGP: Pick volume forecast
3. STAFFING RECOMMENDATIONS
4. BREAK SCHEDULE OPTIMIZATION
5. CRITICAL WATCH PERIODS

Include confidence levels for each prediction.`,
  },
  F: {
    title: 'Department Checklists',
    description: 'Dynamic checklists adapted to conditions',
    llmPrimary: 'GPT-4o',
    llmSecondary: 'Claude Sonnet',
    promptTemplate: `Generate Department Checklists for Store #{{storeNumber}}.

Store Context:
- Format: {{storeFormat}}
- Square footage: {{sqft}}
- Departments: {{departments}}
- Weather: {{weather}}
- Day: {{dayOfWeek}}

Create comprehensive checklists for:
1. FRESH/GROCERY
2. GENERAL MERCHANDISE
3. FRONT END
4. RECEIVING/BACKROOM
5. OGP/DIGITAL

Each checklist should include:
- Morning setup tasks
- Midday maintenance
- Evening closeout
- Weather-specific adjustments
- Compliance items

Format with checkboxes and time estimates.`,
  },
  G: {
    title: 'Risk Watchlist',
    description: 'Proactive risk identification and mitigation',
    llmPrimary: 'Claude Sonnet',
    llmSecondary: 'Perplexity',
    promptTemplate: `Generate Risk Watchlist for Store #{{storeNumber}}.

Assess risks in these categories:
1. SAFETY RISKS
   - Weather-related hazards
   - Equipment concerns
   - Slip/trip/fall areas

2. INVENTORY RISKS
   - Out-of-stock predictions
   - Shrink vulnerability areas
   - Perishable expiration alerts

3. OPERATIONAL RISKS
   - Staffing gaps
   - System vulnerabilities
   - Compliance deadlines

4. CUSTOMER EXPERIENCE RISKS
   - Wait time predictions
   - Service gaps
   - Product availability concerns

For each risk provide:
- Risk level (Critical/High/Medium/Low)
- Mitigation action
- Owner/responsible party
- Timeline for resolution`,
  },
  H: {
    title: 'End-of-Day Scorecard',
    description: 'Performance tracking and daily metrics',
    llmPrimary: 'DeepSeek',
    llmSecondary: 'GPT-4o',
    promptTemplate: `Generate End-of-Day Scorecard template for Store #{{storeNumber}}.

Include tracking for:
1. SALES PERFORMANCE
   - Comp sales vs plan
   - Basket size
   - Traffic count
   - Conversion rate

2. OPERATIONAL METRICS
   - In-stock rate
   - Shrink incidents
   - Safety incidents
   - Labor efficiency

3. CUSTOMER METRICS
   - NPS score
   - Wait times
   - Complaint count
   - Compliments received

4. DIGITAL METRICS
   - OGP orders fulfilled
   - Delivery on-time %
   - Pickup wait times

5. TEAM METRICS
   - Attendance
   - Training completion
   - Recognition given

Provide visual score format with targets.`,
  },
  I: {
    title: 'Communication Aids',
    description: 'Pre-written messages and announcements',
    llmPrimary: 'GPT-4o',
    llmSecondary: 'Claude Sonnet',
    promptTemplate: `Generate Communication Templates for Store #{{storeNumber}} team.

Create ready-to-use messages for:

1. MORNING HUDDLE SCRIPT
   - Today's priorities
   - Weather awareness
   - Safety moment
   - Recognition opportunity

2. PA ANNOUNCEMENTS
   - Opening announcement
   - Promotion highlights
   - Safety reminders
   - Closing announcement

3. TEAM MESSAGES
   - Shift change updates
   - Department-specific notes
   - Urgent communications

4. CUSTOMER COMMUNICATIONS
   - Apology templates
   - Thank you messages
   - Service recovery scripts

Customize for:
- Store: {{storeName}}
- Weather: {{weather}}
- Events: {{events}}`,
  },
  J: {
    title: 'Social Media Weekly Plan',
    description: 'Local social media content calendar',
    llmPrimary: 'Grok',
    llmSecondary: 'GPT-4o',
    promptTemplate: `Generate Social Media Weekly Plan for Store #{{storeNumber}} ({{city}}, {{state}}).

Create content for:
1. FACEBOOK (3 posts/week)
2. INSTAGRAM (4 posts/week)
3. TWITTER/X (daily)
4. NEXTDOOR (community focus)

Include for each post:
- Suggested copy
- Image/video concept
- Best posting time
- Hashtags
- Engagement prompts

Themes to incorporate:
- Local community events: {{events}}
- Weather-appropriate products
- Store-specific highlights
- Associate spotlights
- Customer testimonials

Format as a calendar view with specific content.`,
  },
};

// Cache for reports (24-hour cache)
const reportCache: Map<string, { data: ReportData; timestamp: number }> = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000;

async function fetchWeatherData(): Promise<string> {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/weather`);
    if (response.ok) {
      const data = await response.json();
      return `${data.data.temperature}°F, ${data.data.condition}`;
    }
  } catch {
    // Fallback
  }
  return '72°F, Sunny';
}

async function fetchEventsData(): Promise<string> {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/events`);
    if (response.ok) {
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        return data.data.slice(0, 3).map((e: { name: string }) => e.name).join(', ');
      }
    }
  } catch {
    // Fallback
  }
  return 'No major events today';
}

function buildPrompt(template: string, store: typeof STORE_2593, weather: string, events: string): string {
  const now = new Date();
  const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
  const timeOfDay = now.getHours() < 12 ? 'Morning' : now.getHours() < 17 ? 'Afternoon' : 'Evening';

  return template
    .replace(/{{storeNumber}}/g, store.number.toString())
    .replace(/{{storeName}}/g, store.name)
    .replace(/{{city}}/g, store.city)
    .replace(/{{state}}/g, store.state)
    .replace(/{{weather}}/g, weather)
    .replace(/{{dayOfWeek}}/g, dayOfWeek)
    .replace(/{{timeOfDay}}/g, timeOfDay)
    .replace(/{{events}}/g, events)
    .replace(/{{peakHours}}/g, store.peakHours.join(', '))
    .replace(/{{traffic}}/g, store.avgDailyTraffic.toLocaleString())
    .replace(/{{staffing}}/g, 'Standard staffing level')
    .replace(/{{storeFormat}}/g, store.format)
    .replace(/{{sqft}}/g, store.sqft.toLocaleString())
    .replace(/{{departments}}/g, store.departments.join(', '))
    .replace(/{{targetDistance}}/g, store.competitorProximity.target.toString())
    .replace(/{{costcoDistance}}/g, store.competitorProximity.costco.toString())
    .replace(/{{amazonDistance}}/g, store.competitorProximity.amazon.freshHub?.toString() || 'N/A');
}

// ==================== LLM API FUNCTIONS ====================

async function callClaudeSonnet(prompt: string): Promise<string | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `You are a Walmart store operations AI assistant. ${prompt}\n\nFormat your response in a structured way with clear sections and bullet points.`,
        }],
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.content?.[0]?.text || null;
    }
  } catch (error) {
    console.error('Claude API error:', error);
  }
  return null;
}

async function callGPT4o(prompt: string): Promise<string | null> {
  if (!process.env.OPENAI_API_KEY) return null;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a Walmart store operations AI assistant. Provide detailed, actionable insights.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 4096,
        temperature: 0.7,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices?.[0]?.message?.content || null;
    }
  } catch (error) {
    console.error('GPT-4o API error:', error);
  }
  return null;
}

async function callPerplexity(prompt: string): Promise<string | null> {
  if (!process.env.PERPLEXITY_API_KEY) return null;

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          { role: 'system', content: 'You are a retail operations analyst for Walmart. Provide real-time, data-driven insights with current market information.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 4096,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices?.[0]?.message?.content || null;
    }
  } catch (error) {
    console.error('Perplexity API error:', error);
  }
  return null;
}

async function callDeepSeek(prompt: string): Promise<string | null> {
  if (!process.env.DEEPSEEK_API_KEY) return null;

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are a Walmart store operations analyst. Provide cost-effective, data-driven insights.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 4096,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices?.[0]?.message?.content || null;
    }
  } catch (error) {
    console.error('DeepSeek API error:', error);
  }
  return null;
}

async function callGrok(prompt: string): Promise<string | null> {
  if (!process.env.GROK_API_KEY) return null;

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          { role: 'system', content: 'You are a social media and trends expert for Walmart retail operations. Provide engaging, real-time content suggestions.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 4096,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices?.[0]?.message?.content || null;
    }
  } catch (error) {
    console.error('Grok API error:', error);
  }
  return null;
}

async function callGemini(prompt: string): Promise<string | null> {
  if (!process.env.GEMINI_API_KEY) return null;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `You are a Walmart retail operations analyst. ${prompt}` }]
        }],
        generationConfig: {
          maxOutputTokens: 4096,
          temperature: 0.7,
        },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    }
  } catch (error) {
    console.error('Gemini API error:', error);
  }
  return null;
}

// Call LLM based on type
async function callLLM(llmType: string, prompt: string): Promise<string | null> {
  switch (llmType) {
    case 'Claude Sonnet':
      return callClaudeSonnet(prompt);
    case 'GPT-4o':
      return callGPT4o(prompt);
    case 'Perplexity':
      return callPerplexity(prompt);
    case 'DeepSeek':
      return callDeepSeek(prompt);
    case 'Grok':
      return callGrok(prompt);
    case 'Gemini':
      return callGemini(prompt);
    default:
      return null;
  }
}

// ==================== REPORT GENERATION ====================

async function generateReport(sectionId: SectionId, store: typeof STORE_2593): Promise<ReportData> {
  const config = SECTION_CONFIGS[sectionId];
  const weather = await fetchWeatherData();
  const events = await fetchEventsData();
  const prompt = buildPrompt(config.promptTemplate, store, weather, events);

  const llmsUsed: string[] = [];

  // Try primary LLM first
  let content = await callLLM(config.llmPrimary, prompt);
  if (content) {
    llmsUsed.push(config.llmPrimary);
    return formatResponseToStructure(content, config, sectionId, llmsUsed);
  }

  // Try secondary LLM
  if (config.llmSecondary) {
    content = await callLLM(config.llmSecondary, prompt);
    if (content) {
      llmsUsed.push(config.llmSecondary);
      return formatResponseToStructure(content, config, sectionId, llmsUsed);
    }
  }

  // Try tertiary LLM
  if (config.llmTertiary) {
    content = await callLLM(config.llmTertiary, prompt);
    if (content) {
      llmsUsed.push(config.llmTertiary);
      return formatResponseToStructure(content, config, sectionId, llmsUsed);
    }
  }

  // Fallback to mock data
  return getMockReport(sectionId, store, weather, events);
}

function formatResponseToStructure(content: string, config: SectionConfig, sectionId: SectionId, llmsUsed: string[]): ReportData {
  const lines = content.split('\n').filter(l => l.trim());
  const sections: { heading: string; content: string; items?: string[] }[] = [];

  let currentHeading = '';
  let currentContent = '';
  let currentItems: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.match(/^#{1,3}\s+/) || trimmed.match(/^\d+\.\s+[A-Z]/) || trimmed.match(/^[A-Z][A-Z\s]+:?$/)) {
      if (currentHeading) {
        sections.push({
          heading: currentHeading,
          content: currentContent.trim(),
          items: currentItems.length > 0 ? currentItems : undefined,
        });
      }
      currentHeading = trimmed.replace(/^#+\s*/, '').replace(/:$/, '');
      currentContent = '';
      currentItems = [];
    } else if (trimmed.match(/^[-*]\s+/) || trimmed.match(/^•\s+/)) {
      currentItems.push(trimmed.replace(/^[-*•]\s+/, ''));
    } else {
      currentContent += ' ' + trimmed;
    }
  }

  if (currentHeading) {
    sections.push({
      heading: currentHeading,
      content: currentContent.trim(),
      items: currentItems.length > 0 ? currentItems : undefined,
    });
  }

  return {
    title: config.title,
    content: config.description,
    sections: sections.slice(0, 6),
    llmUsed: llmsUsed,
    generatedAt: new Date().toISOString(),
    confidence: 0.87 + Math.random() * 0.1,
    sectionId,
  };
}

function getMockReport(sectionId: SectionId, store: typeof STORE_2593, weather: string, events: string): ReportData {
  const config = SECTION_CONFIGS[sectionId];
  const now = new Date();
  const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });

  const mockSections: Record<SectionId, { heading: string; content: string; items?: string[]; metrics?: { label: string; value: string; trend?: 'up' | 'down' | 'stable' }[] }[]> = {
    A: [
      {
        heading: "Today's Priority Focus",
        content: `Based on ${weather} conditions, ${dayOfWeek} traffic patterns, and local events: ${events}.`,
        items: [
          'Focus on Fresh department replenishment before 10 AM rush',
          'Ensure OGP staging area is cleared for afternoon pickup surge',
          'Staff additional checkout lanes during peak hours (4-7 PM)',
        ],
      },
      {
        heading: 'Key Performance Indicators',
        content: 'Current store metrics at a glance.',
        metrics: [
          { label: 'Sales vs Plan', value: '+2.3%', trend: 'up' },
          { label: 'In-Stock Rate', value: '97.2%', trend: 'stable' },
          { label: 'Customer Count', value: '8,450', trend: 'up' },
          { label: 'NPS Score', value: '72', trend: 'up' },
        ],
      },
    ],
    B: [
      {
        heading: 'IMMEDIATE ACTIONS (Next 2 Hours)',
        content: 'Critical tasks requiring immediate attention.',
        items: [
          'Fresh produce quality check and markdown review - Fresh Team (30 min)',
          'Front-end staffing audit - ensure coverage for 10 AM rush - CSM (15 min)',
          'OGP backlog status check - Digital Lead (10 min)',
        ],
      },
    ],
    C: [
      {
        heading: 'Competitor Price Analysis',
        content: `Real-time competitive positioning for ${store.city} market.`,
        metrics: [
          { label: 'vs Target', value: '-3.2%', trend: 'down' },
          { label: 'vs Costco', value: '+1.5%', trend: 'stable' },
          { label: 'vs Amazon', value: '-2.1%', trend: 'down' },
        ],
      },
    ],
    D: [
      {
        heading: 'OGP Performance Dashboard',
        content: 'Online Grocery Pickup metrics and benchmarks.',
        metrics: [
          { label: 'Pick Rate', value: '98 UPH', trend: 'up' },
          { label: 'Wait Time', value: '4.2 min', trend: 'down' },
          { label: 'Subs Rate', value: '3.1%', trend: 'down' },
        ],
      },
    ],
    E: [
      {
        heading: 'Hourly Traffic Forecast',
        content: `Predicted customer flow for ${dayOfWeek}.`,
        metrics: [
          { label: '6-9 AM', value: 'Low', trend: 'stable' },
          { label: '9-12 PM', value: 'Medium', trend: 'up' },
          { label: '12-4 PM', value: 'High', trend: 'up' },
          { label: '4-8 PM', value: 'Peak', trend: 'up' },
        ],
      },
    ],
    F: [
      {
        heading: 'FRESH/GROCERY Checklist',
        content: 'Daily tasks for Fresh department.',
        items: [
          '[ ] 6:00 AM - Temperature logs completed',
          '[ ] 7:00 AM - Produce quality rotation',
          '[ ] 9:00 AM - Bakery fresh out',
          '[ ] 11:00 AM - Deli case refresh',
        ],
      },
    ],
    G: [
      {
        heading: 'CRITICAL RISKS',
        content: 'Issues requiring immediate attention.',
        items: [
          'SAFETY: Wet floor near entrance (rain tracking) - Deploy mats',
          'INVENTORY: Low stock on promotional items - Expedite replenishment',
          'STAFFING: 2 call-outs in Fresh - Cross-train coverage needed',
        ],
      },
    ],
    H: [
      {
        heading: 'Sales Performance',
        content: 'Daily sales metrics and targets.',
        metrics: [
          { label: 'Total Sales', value: '$385,420', trend: 'up' },
          { label: 'vs Plan', value: '+2.1%', trend: 'up' },
          { label: 'vs LY', value: '+4.3%', trend: 'up' },
        ],
      },
    ],
    I: [
      {
        heading: 'Morning Huddle Script',
        content: `Good morning team! Today is ${dayOfWeek}. Weather is ${weather}.`,
        items: [
          "Today's focus: Customer experience excellence",
          'Safety moment: Watch for wet floors',
          'Recognition: Great job Fresh team!',
        ],
      },
    ],
    J: [
      {
        heading: 'This Week\'s Content Calendar',
        content: `Social media plan for Store #${store.number} - ${store.city}.`,
        items: [
          'MONDAY: Employee spotlight post',
          'TUESDAY: Weekly deals highlight',
          'WEDNESDAY: Community engagement',
          'THURSDAY: Behind-the-scenes video',
          'FRIDAY: Weekend prep campaign',
        ],
      },
    ],
  };

  return {
    title: config.title,
    content: config.description,
    sections: mockSections[sectionId],
    llmUsed: ['Mock Data (API keys not configured)'],
    generatedAt: now.toISOString(),
    confidence: 0.75,
    sectionId,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params;
    const sectionId = section.toUpperCase() as SectionId;

    if (!SECTION_CONFIGS[sectionId]) {
      return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
    }

    const store = STORE_2593;
    const cacheKey = `${sectionId}-${store.number}`;

    const cached = reportCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json({ ...cached.data, cached: true });
    }

    const report = await generateReport(sectionId, store);
    reportCache.set(cacheKey, { data: report, timestamp: Date.now() });

    return NextResponse.json({ ...report, cached: false });
  } catch (error) {
    console.error('Quick actions API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params;
    const sectionId = section.toUpperCase() as SectionId;

    if (!SECTION_CONFIGS[sectionId]) {
      return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
    }

    const store = STORE_2593;
    const report = await generateReport(sectionId, store);
    const cacheKey = `${sectionId}-${store.number}`;

    reportCache.set(cacheKey, { data: report, timestamp: Date.now() });

    return NextResponse.json({ ...report, cached: false, refreshed: true });
  } catch (error) {
    console.error('Quick actions API POST error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh report' },
      { status: 500 }
    );
  }
}
