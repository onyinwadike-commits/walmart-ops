import { NextResponse } from 'next/server';

export interface RaceDemographics {
  white: number;
  hispanic: number;
  black: number;
  asian: number;
  other: number;
}

export interface DemographicData {
  population: string;
  medianIncome: string;
  medianAge: string;
  households: string;
  growthRate: string;
  raceDemographics: RaceDemographics;
  keyInsight: string;
  lastUpdated: string;
  zipCode: string;
  city: string;
}

// Cache demographics data per zip code (refresh every 24 hours)
const cacheMap: Map<string, { data: DemographicData; timestamp: number }> = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

async function fetchDemographicsFromPerplexity(zipCode: string, city: string): Promise<DemographicData> {
  const apiKey = process.env.PERPLEXITY_API_KEY;

  if (!apiKey) {
    console.log('No Perplexity API key found, using mock data');
    return getMockDemographics(zipCode, city);
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
            content: `Provide current demographic data for ${city}, Nevada near zip code ${zipCode}. Include:
1. Total population for the immediate area/zip code (format: XX,XXX or X.X million)
2. Median household income (format: $XX,XXX)
3. Median age (format: XX years)
4. Number of households (format: XX,XXX or X.X million)
5. Population growth rate (format: X.X% per year)
6. Race/ethnicity breakdown as percentages (White, Hispanic/Latino, Black/African American, Asian, Other)
7. One key retail/consumer insight about this demographic that would help a Walmart store manager

Format your response exactly like this:
POPULATION: [value]
MEDIAN_INCOME: [value]
MEDIAN_AGE: [value]
HOUSEHOLDS: [value]
GROWTH_RATE: [value]
RACE_WHITE: [percentage as number, e.g. 45.2]
RACE_HISPANIC: [percentage as number]
RACE_BLACK: [percentage as number]
RACE_ASIAN: [percentage as number]
RACE_OTHER: [percentage as number]
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

    return parseDemographicResponse(content, zipCode, city);
  } catch (error) {
    console.error('Error fetching demographics from Perplexity:', error);
    return getMockDemographics(zipCode, city);
  }
}

function parseDemographicResponse(content: string, zipCode: string, city: string): DemographicData {
  const lines = content.split('\n');
  const data: Partial<DemographicData> = {};
  const raceDemographics: Partial<RaceDemographics> = {};

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
    } else if (line.startsWith('RACE_WHITE:')) {
      raceDemographics.white = parseFloat(line.replace('RACE_WHITE:', '').trim()) || 0;
    } else if (line.startsWith('RACE_HISPANIC:')) {
      raceDemographics.hispanic = parseFloat(line.replace('RACE_HISPANIC:', '').trim()) || 0;
    } else if (line.startsWith('RACE_BLACK:')) {
      raceDemographics.black = parseFloat(line.replace('RACE_BLACK:', '').trim()) || 0;
    } else if (line.startsWith('RACE_ASIAN:')) {
      raceDemographics.asian = parseFloat(line.replace('RACE_ASIAN:', '').trim()) || 0;
    } else if (line.startsWith('RACE_OTHER:')) {
      raceDemographics.other = parseFloat(line.replace('RACE_OTHER:', '').trim()) || 0;
    } else if (line.startsWith('KEY_INSIGHT:')) {
      data.keyInsight = line.replace('KEY_INSIGHT:', '').trim();
    }
  }

  // Default race demographics for Las Vegas area (89123)
  const defaultRaceDemographics: RaceDemographics = {
    white: 44.2,
    hispanic: 33.1,
    black: 12.4,
    asian: 7.1,
    other: 3.2,
  };

  // Validate and return with defaults if needed
  return {
    population: data.population || '2.3 million',
    medianIncome: data.medianIncome || '$62,000',
    medianAge: data.medianAge || '38 years',
    households: data.households || '850,000',
    growthRate: data.growthRate || '2.1%',
    raceDemographics: {
      white: raceDemographics.white || defaultRaceDemographics.white,
      hispanic: raceDemographics.hispanic || defaultRaceDemographics.hispanic,
      black: raceDemographics.black || defaultRaceDemographics.black,
      asian: raceDemographics.asian || defaultRaceDemographics.asian,
      other: raceDemographics.other || defaultRaceDemographics.other,
    },
    keyInsight: data.keyInsight || 'High tourism economy drives strong retail demand year-round',
    lastUpdated: new Date().toISOString(),
    zipCode,
    city,
  };
}

// Mock data varies based on location for realism
const LOCATION_MOCK_DATA: Record<string, Partial<DemographicData>> = {
  'Las Vegas': {
    population: '2.3 million',
    medianIncome: '$62,500',
    households: '855,000',
    growthRate: '2.1%',
    raceDemographics: {
      white: 44.2,
      hispanic: 33.1,
      black: 12.4,
      asian: 7.1,
      other: 3.2,
    },
    keyInsight: 'Strong tourism economy drives consistent retail demand year-round',
  },
  'Henderson': {
    population: '340,000',
    medianIncome: '$72,500',
    households: '125,000',
    growthRate: '2.8%',
    raceDemographics: {
      white: 58.3,
      hispanic: 21.5,
      black: 8.2,
      asian: 9.4,
      other: 2.6,
    },
    keyInsight: 'Growing family-oriented community with higher household incomes and suburban shopping patterns',
  },
  'Pahrump': {
    population: '45,000',
    medianIncome: '$48,500',
    households: '18,500',
    growthRate: '1.5%',
    raceDemographics: {
      white: 72.1,
      hispanic: 18.6,
      black: 3.2,
      asian: 2.8,
      other: 3.3,
    },
    keyInsight: 'Rural community with limited retail options making this store the primary shopping destination',
  },
};

function getMockDemographics(zipCode: string, city: string): DemographicData {
  const locationData = LOCATION_MOCK_DATA[city] || LOCATION_MOCK_DATA['Las Vegas'];
  const defaultRace = { white: 44.2, hispanic: 33.1, black: 12.4, asian: 7.1, other: 3.2 };

  return {
    population: locationData.population || '2.3 million',
    medianIncome: locationData.medianIncome || '$62,500',
    medianAge: '38 years',
    households: locationData.households || '855,000',
    growthRate: locationData.growthRate || '2.1%',
    raceDemographics: locationData.raceDemographics || defaultRace,
    keyInsight: locationData.keyInsight || 'Strong population growth and tourism economy drive consistent retail demand',
    lastUpdated: new Date().toISOString(),
    zipCode,
    city,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const zipCode = searchParams.get('zip') || '89123';
    const city = searchParams.get('city') || 'Las Vegas';
    const cacheKey = `${zipCode}-${city}`;

    const now = Date.now();

    // Check if we have valid cached data for this location
    const cached = cacheMap.get(cacheKey);
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      return NextResponse.json({
        ...cached.data,
        cached: true,
      });
    }

    // Fetch fresh data for this location
    const demographics = await fetchDemographicsFromPerplexity(zipCode, city);

    // Update cache for this location
    cacheMap.set(cacheKey, { data: demographics, timestamp: now });

    return NextResponse.json({
      ...demographics,
      cached: false,
    });
  } catch (error) {
    console.error('Demographics API error:', error);
    const { searchParams } = new URL(request.url);
    const zipCode = searchParams.get('zip') || '89123';
    const city = searchParams.get('city') || 'Las Vegas';
    return NextResponse.json(getMockDemographics(zipCode, city));
  }
}
