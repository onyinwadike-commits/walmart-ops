import { NextResponse } from 'next/server';

export interface DemographicData {
  population: string;
  medianIncome: string;
  medianAge: string;
  households: string;
  growthRate: string;
  topEmployers: string[];
  keyInsight: string;
  lastUpdated: string;
}

// Cache demographics data (refresh every 24 hours)
let cachedData: DemographicData | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

async function fetchDemographicsFromPerplexity(): Promise<DemographicData> {
  const apiKey = process.env.PERPLEXITY_API_KEY;

  if (!apiKey) {
    console.log('No Perplexity API key found, using mock data');
    return getMockDemographics();
  }

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a demographic data analyst. Provide accurate, current demographic statistics. Return data in a structured format with specific numbers. Be concise and factual.'
          },
          {
            role: 'user',
            content: `Provide current demographic data for the Las Vegas metropolitan area (Clark County, Nevada) near zip code 89123. Include:
1. Total population (format: X.X million or XXX,XXX)
2. Median household income (format: $XX,XXX)
3. Median age (format: XX years)
4. Number of households (format: X.X million or XXX,XXX)
5. Population growth rate (format: X.X% per year)
6. Top 3 major employers in the area
7. One key retail/consumer insight about this demographic

Format your response exactly like this:
POPULATION: [value]
MEDIAN_INCOME: [value]
MEDIAN_AGE: [value]
HOUSEHOLDS: [value]
GROWTH_RATE: [value]
TOP_EMPLOYERS: [employer1], [employer2], [employer3]
KEY_INSIGHT: [one sentence insight]`
          }
        ],
        max_tokens: 500,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    return parseDemographicResponse(content);
  } catch (error) {
    console.error('Error fetching demographics from Perplexity:', error);
    return getMockDemographics();
  }
}

function parseDemographicResponse(content: string): DemographicData {
  const lines = content.split('\n');
  const data: Partial<DemographicData> = {};

  for (const line of lines) {
    if (line.startsWith('POPULATION:')) {
      data.population = line.replace('POPULATION:', '').trim();
    } else if (line.startsWith('MEDIAN_INCOME:')) {
      data.medianIncome = line.replace('MEDIAN_INCOME:', '').trim();
    } else if (line.startsWith('MEDIAN_AGE:')) {
      data.medianAge = line.replace('MEDIAN_AGE:', '').trim();
    } else if (line.startsWith('HOUSEHOLDS:')) {
      data.households = line.replace('HOUSEHOLDS:', '').trim();
    } else if (line.startsWith('GROWTH_RATE:')) {
      data.growthRate = line.replace('GROWTH_RATE:', '').trim();
    } else if (line.startsWith('TOP_EMPLOYERS:')) {
      const employers = line.replace('TOP_EMPLOYERS:', '').trim();
      data.topEmployers = employers.split(',').map(e => e.trim()).slice(0, 3);
    } else if (line.startsWith('KEY_INSIGHT:')) {
      data.keyInsight = line.replace('KEY_INSIGHT:', '').trim();
    }
  }

  // Validate and return with defaults if needed
  return {
    population: data.population || '2.3 million',
    medianIncome: data.medianIncome || '$62,000',
    medianAge: data.medianAge || '38 years',
    households: data.households || '850,000',
    growthRate: data.growthRate || '2.1%',
    topEmployers: data.topEmployers || ['MGM Resorts', 'Caesars Entertainment', 'Clark County School District'],
    keyInsight: data.keyInsight || 'High tourism economy drives strong retail demand year-round',
    lastUpdated: new Date().toISOString(),
  };
}

function getMockDemographics(): DemographicData {
  return {
    population: '2.3 million',
    medianIncome: '$62,500',
    medianAge: '38 years',
    households: '855,000',
    growthRate: '2.1%',
    topEmployers: ['MGM Resorts International', 'Caesars Entertainment', 'Clark County School District'],
    keyInsight: 'Strong population growth and tourism economy drive consistent retail demand',
    lastUpdated: new Date().toISOString(),
  };
}

export async function GET() {
  try {
    const now = Date.now();

    // Check if we have valid cached data
    if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
      return NextResponse.json({
        ...cachedData,
        cached: true,
      });
    }

    // Fetch fresh data
    const demographics = await fetchDemographicsFromPerplexity();

    // Update cache
    cachedData = demographics;
    cacheTimestamp = now;

    return NextResponse.json({
      ...demographics,
      cached: false,
    });
  } catch (error) {
    console.error('Demographics API error:', error);
    return NextResponse.json(getMockDemographics());
  }
}
