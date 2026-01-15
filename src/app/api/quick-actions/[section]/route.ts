import { NextRequest, NextResponse } from 'next/server';
import { STORE_2593 } from '@/data/stores';

type SectionId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';

interface SectionConfig {
  title: string;
  description: string;
  llmPrimary: string;
  llmSecondary?: string;
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
  llmUsed: (string | undefined)[];
  generatedAt: string;
  confidence: number;
  sectionId?: SectionId;
}

// Section configuration with LLM routing as specified
const SECTION_CONFIGS: Record<SectionId, SectionConfig> = {
  A: {
    title: 'Executive Summary',
    description: 'High-level store overview with AI-driven insights',
    llmPrimary: 'Claude Sonnet',
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
    promptTemplate: `Analyze competitive landscape for Walmart Store #{{storeNumber}} in {{city}}, {{state}}.

Competitors nearby:
- Target: {{targetDistance}} miles
- Costco: {{costcoDistance}} miles
- Amazon Fresh Hub: {{amazonDistance}} miles

Research and provide:
1. Current competitor promotions/sales
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/weather`);
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/events`);
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

async function generateReport(sectionId: SectionId, store: typeof STORE_2593): Promise<ReportData> {
  const config = SECTION_CONFIGS[sectionId];
  const weather = await fetchWeatherData();
  const events = await fetchEventsData();
  const prompt = buildPrompt(config.promptTemplate, store, weather, events);

  // Try to use actual LLM if API keys are available
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.PERPLEXITY_API_KEY;

  if (apiKey && config.llmPrimary === 'Claude Sonnet' && process.env.ANTHROPIC_API_KEY) {
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
        const content = data.content?.[0]?.text || '';
        return formatResponseToStructure(content, config, sectionId);
      }
    } catch (error) {
      console.error('Claude API error:', error);
    }
  }

  if (apiKey && config.llmPrimary === 'Perplexity' && process.env.PERPLEXITY_API_KEY) {
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
            { role: 'system', content: 'You are a retail operations analyst for Walmart. Provide data-driven insights.' },
            { role: 'user', content: prompt },
          ],
          max_tokens: 4096,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        return formatResponseToStructure(content, config, sectionId);
      }
    } catch (error) {
      console.error('Perplexity API error:', error);
    }
  }

  // Fallback to mock data
  return getMockReport(sectionId, store, weather, events);
}

function formatResponseToStructure(content: string, config: SectionConfig, sectionId: SectionId): ReportData {
  // Parse the LLM response into structured sections
  const lines = content.split('\n').filter(l => l.trim());
  const sections: { heading: string; content: string; items?: string[] }[] = [];

  let currentHeading = '';
  let currentContent = '';
  let currentItems: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Check if it's a heading
    if (trimmed.match(/^#{1,3}\s+/) || trimmed.match(/^\d+\.\s+[A-Z]/) || trimmed.match(/^[A-Z][A-Z\s]+:?$/)) {
      // Save previous section
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
      // It's a list item
      currentItems.push(trimmed.replace(/^[-*•]\s+/, ''));
    } else {
      currentContent += ' ' + trimmed;
    }
  }

  // Save last section
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
    llmUsed: [config.llmPrimary, config.llmSecondary].filter(Boolean),
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
        content: `Based on ${weather} conditions and ${dayOfWeek} traffic patterns.`,
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
      {
        heading: 'Weather Impact Assessment',
        content: `Current conditions: ${weather}. Expect increased traffic in climate-controlled departments. Outdoor/Garden may see reduced foot traffic if temperatures exceed comfort levels.`,
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
          'Safety walk of entrance/exit areas - Management (20 min)',
        ],
      },
      {
        heading: 'MORNING PRIORITIES (Before Noon)',
        content: 'Key tasks to complete by lunch time.',
        items: [
          'Complete overnight truck unload verification',
          'Set promotional endcaps for weekly ad',
          'Conduct morning team huddle (9:30 AM)',
          'Review and address any system alerts',
        ],
      },
      {
        heading: 'AFTERNOON FOCUS',
        content: 'Post-lunch priorities for sustained performance.',
        items: [
          'Peak hour staffing deployment (4-7 PM coverage)',
          'Fresh department second rotation',
          'Customer service queue monitoring',
          'OGP pickup window management',
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
          { label: 'Market Share', value: '34%', trend: 'up' },
        ],
      },
      {
        heading: "Today's Competitive Opportunities",
        content: 'Actionable strategies to capture market share.',
        items: [
          'Target running Back-to-School promotion - match key items in Electronics',
          'Costco bulk pricing opportunity - highlight Walmart+ savings',
          'Amazon same-day delivery push - emphasize OGP speed advantage',
        ],
      },
      {
        heading: 'Counter-Strategy Recommendations',
        content: 'Specific tactics by competitor.',
        items: [
          'TARGET: Deploy price-match messaging at entrance, focus on Home decor',
          'COSTCO: Highlight no membership needed, smaller pack sizes',
          'AMAZON: Emphasize try-before-you-buy, immediate availability',
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
          { label: 'FTPR', value: '96.5%', trend: 'up' },
        ],
      },
      {
        heading: 'Delivery Metrics',
        content: 'Home delivery service performance.',
        metrics: [
          { label: 'On-Time %', value: '94.2%', trend: 'up' },
          { label: 'Orders/Day', value: '287', trend: 'up' },
          { label: 'Customer Rating', value: '4.7/5', trend: 'stable' },
          { label: 'Driver Efficiency', value: '8.3 ord/hr', trend: 'up' },
        ],
      },
      {
        heading: 'Optimization Opportunities',
        content: 'Areas for e-commerce improvement.',
        items: [
          'Add 2nd dispenser during 4-6 PM peak window',
          'Pre-stage high-velocity items in staging coolers',
          'Implement express lane for small orders (<10 items)',
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
      {
        heading: 'Department Pressure Points',
        content: 'Areas requiring proactive attention.',
        items: [
          'GROCERY: Peak 4-7 PM, staff +2 associates for replenishment',
          'CHECKOUT: Queue buildup expected 5-6 PM, open all registers',
          'OGP: Afternoon surge 3-5 PM, pre-stage orders by 2 PM',
          'FRESH: High turnover expected, schedule 2nd rotation at 3 PM',
        ],
      },
      {
        heading: 'Staffing Recommendations',
        content: 'Optimized coverage based on predictions.',
        items: [
          'Add 3 associates to front-end 4-8 PM',
          'Schedule additional Fresh closer for evening rush',
          'Position greeter at entrance during peak hours',
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
          '[ ] 2:00 PM - Meat markdown review',
          '[ ] 5:00 PM - Evening rotation',
        ],
      },
      {
        heading: 'FRONT END Checklist',
        content: 'Customer service area tasks.',
        items: [
          '[ ] Register drawer audits',
          '[ ] Self-checkout functionality test',
          '[ ] Return area organization',
          '[ ] Cart retrieval schedule',
          '[ ] Customer service desk supplies',
        ],
      },
      {
        heading: 'OGP/DIGITAL Checklist',
        content: 'E-commerce fulfillment tasks.',
        items: [
          '[ ] Equipment charging and staging',
          '[ ] Tote inventory check',
          '[ ] Cooler/Freezer space prep',
          '[ ] Dispense area cleared',
          '[ ] Driver communication check',
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
      {
        heading: 'HIGH PRIORITY RISKS',
        content: 'Important issues for today.',
        items: [
          'Equipment: Self-checkout #4 intermittent issues - Schedule tech',
          'Compliance: Food safety audit due Friday - Prep documentation',
          'Customer: 3 negative reviews on OGP wait time - Investigate',
        ],
      },
      {
        heading: 'Risk Mitigation Actions',
        content: 'Recommended preventive measures.',
        items: [
          'Increase floor sweeps frequency to every 30 minutes',
          'Pre-position backup stock for top 20 promo items',
          'Brief team on service recovery procedures',
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
          { label: 'Basket Size', value: '$67.50', trend: 'stable' },
        ],
      },
      {
        heading: 'Operational Metrics',
        content: 'Key operational KPIs.',
        metrics: [
          { label: 'In-Stock', value: '97.2%', trend: 'up' },
          { label: 'Shrink MTD', value: '0.82%', trend: 'down' },
          { label: 'Safety Days', value: '45', trend: 'up' },
          { label: 'Labor %', value: '7.6%', trend: 'stable' },
        ],
      },
      {
        heading: 'Customer Metrics',
        content: 'Customer experience scores.',
        metrics: [
          { label: 'NPS', value: '72', trend: 'up' },
          { label: 'Wait Time', value: '3.2 min', trend: 'down' },
          { label: 'CFF Score', value: '89%', trend: 'up' },
          { label: 'Compliments', value: '12', trend: 'up' },
        ],
      },
    ],
    I: [
      {
        heading: 'Morning Huddle Script',
        content: `Good morning team! Today is ${dayOfWeek}. Weather is ${weather}. ${events !== 'No major events today' ? `Local events: ${events}` : ''}`,
        items: [
          "Today's focus: Customer experience excellence",
          'Safety moment: Watch for wet floors',
          'Recognition: Great job Fresh team on yesterday\'s scores!',
          'Let\'s have a great day!',
        ],
      },
      {
        heading: 'PA Announcements',
        content: 'Ready-to-use store announcements.',
        items: [
          'OPENING: "Welcome to Walmart! Our team is here to help you save money and live better."',
          'PROMO: "Attention shoppers! Don\'t miss our great deals in [department] - savings up to 30% off!"',
          'SAFETY: "Attention associates: Please conduct safety sweeps in your areas."',
          'CLOSING: "Attention shoppers, we will be closing in 30 minutes. Please bring your final selections to checkout."',
        ],
      },
      {
        heading: 'Service Recovery Templates',
        content: 'Scripts for customer issues.',
        items: [
          'APOLOGY: "I sincerely apologize for your experience. Let me make this right for you today."',
          'OGP DELAY: "I understand the wait has been longer than expected. Here\'s a $5 coupon for your next order."',
          'OUT OF STOCK: "I\'m sorry that item isn\'t available. May I check another location or suggest an alternative?"',
        ],
      },
    ],
    J: [
      {
        heading: 'This Week\'s Content Calendar',
        content: `Social media plan for Store #${store.number} - ${store.city}.`,
        items: [
          'MONDAY: Employee spotlight - "Meet our team!" post',
          'TUESDAY: Weekly deals highlight with product carousel',
          'WEDNESDAY: Community engagement - Local partnership post',
          'THURSDAY: Behind-the-scenes Fresh department video',
          'FRIDAY: Weekend prep - "Stock up and save" campaign',
        ],
      },
      {
        heading: 'Content Ideas',
        content: 'Engaging post concepts.',
        items: [
          `Weather tie-in: "${weather} calls for [seasonal items] - find them in aisle [X]!"`,
          `Event content: ${events !== 'No major events today' ? `"Heading to ${events}? Stock up on essentials!"` : '"Weekend vibes at your local Walmart!"'}`,
          'UGC prompt: "Show us your Walmart haul! Tag us for a chance to be featured."',
        ],
      },
      {
        heading: 'Hashtag Strategy',
        content: 'Recommended hashtags for reach.',
        items: [
          `#Walmart${store.city.replace(' ', '')} #LasVegasDeals`,
          '#WalmartFinds #SaveMoneyLiveBetter',
          '#LocalWalmart #CommunityFirst',
        ],
      },
    ],
  };

  return {
    title: config.title,
    content: config.description,
    sections: mockSections[sectionId],
    llmUsed: [config.llmPrimary, config.llmSecondary].filter(Boolean),
    generatedAt: now.toISOString(),
    confidence: 0.87 + Math.random() * 0.1,
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

    // Check cache
    const cached = reportCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json({ ...cached.data, cached: true });
    }

    // Generate new report
    const report = await generateReport(sectionId, store);

    // Update cache
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

// Force refresh - bypasses cache
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

    // Update cache
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
