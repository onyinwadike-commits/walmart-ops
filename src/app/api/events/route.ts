// Local Events API Endpoint
// Uses Perplexity API to fetch upcoming large crowd events in Las Vegas
// Caches results for 24 hours, refreshes at 5am daily

import { NextResponse } from 'next/server';

export interface LocalEvent {
  id: string;
  name: string;
  venue: string;
  date: string;
  time: string;
  expectedAttendance: string;
  category: 'sports' | 'concert' | 'convention' | 'festival' | 'rodeo' | 'other';
  description: string;
  impactLevel: 'high' | 'medium' | 'low';
  nearbyStores: string[];
  distanceMiles: number; // Distance from 2310 East Serene Ave, Las Vegas 89123
}

// Default reference location: Store 2593 - Serene Ave Supercenter
const DEFAULT_REFERENCE_LOCATION = {
  lat: 36.0154,
  lng: -115.1186,
  address: '2310 E Serene Ave, Las Vegas, NV 89123'
};

// Known venue coordinates in Las Vegas
const VENUE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'allegiant stadium': { lat: 36.0909, lng: -115.1833 },
  't-mobile arena': { lat: 36.1028, lng: -115.1783 },
  'las vegas convention center': { lat: 36.1312, lng: -115.1522 },
  'sphere las vegas': { lat: 36.1203, lng: -115.1658 },
  'sphere': { lat: 36.1203, lng: -115.1658 },
  'mgm grand': { lat: 36.1025, lng: -115.1702 },
  'mgm grand garden arena': { lat: 36.1025, lng: -115.1702 },
  'resorts world': { lat: 36.1243, lng: -115.1683 },
  'resorts world theatre': { lat: 36.1243, lng: -115.1683 },
  'mandalay bay': { lat: 36.0920, lng: -115.1760 },
  'mandalay bay events center': { lat: 36.0920, lng: -115.1760 },
  'thomas & mack center': { lat: 36.1094, lng: -115.1417 },
  'orleans arena': { lat: 36.1025, lng: -115.2067 },
  'sam boyd stadium': { lat: 36.0617, lng: -115.0508 },
  'las vegas motor speedway': { lat: 36.2719, lng: -115.0103 },
  'downtown las vegas events center': { lat: 36.1711, lng: -115.1419 },
  'the venetian': { lat: 36.1217, lng: -115.1697 },
  'caesars palace': { lat: 36.1162, lng: -115.1745 },
  'park mgm': { lat: 36.1028, lng: -115.1754 },
  'michelob ultra arena': { lat: 36.0920, lng: -115.1760 },
  'dolby live': { lat: 36.1025, lng: -115.1702 },
  'bakkt theater': { lat: 36.1058, lng: -115.1717 },
  'fremont street': { lat: 36.1699, lng: -115.1426 },
};

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal place
}

// Get distance for a venue from a reference location
function getVenueDistance(venue: string, refLat: number, refLng: number): number {
  const venueLower = venue.toLowerCase();

  // Check for exact or partial venue match
  for (const [knownVenue, coords] of Object.entries(VENUE_COORDINATES)) {
    if (venueLower.includes(knownVenue) || knownVenue.includes(venueLower)) {
      return calculateDistance(
        refLat,
        refLng,
        coords.lat,
        coords.lng
      );
    }
  }

  // Default to approximate Strip distance if venue not found
  return calculateDistance(
    refLat,
    refLng,
    36.1147, // Approximate center of Las Vegas Strip
    -115.1728
  );
}

interface CachedEvents {
  events: LocalEvent[];
  lastFetch: string;
  nextRefresh: string;
}

// In-memory cache (in production, use Redis or similar)
let eventsCache: CachedEvents | null = null;

// Calculate next 5am Pacific time
function getNext5amPacific(): Date {
  const now = new Date();
  const pacific = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
  const next5am = new Date(pacific);
  next5am.setHours(5, 0, 0, 0);

  // If it's past 5am today, set for tomorrow
  if (pacific.getHours() >= 5) {
    next5am.setDate(next5am.getDate() + 1);
  }

  return next5am;
}

// Check if cache is still valid
function isCacheValid(): boolean {
  if (!eventsCache) return false;

  const now = new Date();
  const nextRefresh = new Date(eventsCache.nextRefresh);

  return now < nextRefresh;
}

// Parse Perplexity response into structured events
function parseEventsFromResponse(content: string, refLat: number, refLng: number): LocalEvent[] {
  const events: LocalEvent[] = [];

  // Try to extract JSON from the response
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.map((event: Record<string, unknown>, index: number) => {
        const venue = String(event.venue || 'Las Vegas');
        return {
          id: `event-${Date.now()}-${index}`,
          name: event.name || 'Unknown Event',
          venue,
          date: event.date || 'TBD',
          time: event.time || 'TBD',
          expectedAttendance: event.expectedAttendance || event.attendance || 'Unknown',
          category: categorizeEvent(String(event.name || ''), venue),
          description: event.description || '',
          impactLevel: determineImpactLevel(String(event.expectedAttendance || event.attendance || '')),
          nearbyStores: ['2059', '3455'], // Both stores in Market 396
          distanceMiles: getVenueDistance(venue, refLat, refLng),
        };
      });
    } catch {
      // If JSON parsing fails, continue to text parsing
    }
  }

  // Fallback: parse text-based response
  const lines = content.split('\n').filter(line => line.trim());
  let currentEvent: Partial<LocalEvent> = {};

  for (const line of lines) {
    if (line.includes('**') || line.match(/^\d+\./)) {
      // New event detected
      if (currentEvent.name) {
        const venue = currentEvent.venue || 'Las Vegas';
        events.push({
          id: `event-${Date.now()}-${events.length}`,
          name: currentEvent.name || 'Unknown Event',
          venue,
          date: currentEvent.date || 'TBD',
          time: currentEvent.time || 'TBD',
          expectedAttendance: currentEvent.expectedAttendance || 'Unknown',
          category: categorizeEvent(currentEvent.name || '', venue),
          description: currentEvent.description || '',
          impactLevel: determineImpactLevel(currentEvent.expectedAttendance || ''),
          nearbyStores: ['2059', '3455'],
          distanceMiles: getVenueDistance(venue, refLat, refLng),
        });
      }
      currentEvent = { name: line.replace(/\*\*/g, '').replace(/^\d+\.\s*/, '').trim() };
    } else if (line.toLowerCase().includes('venue') || line.toLowerCase().includes('location')) {
      currentEvent.venue = line.split(':').slice(1).join(':').trim();
    } else if (line.toLowerCase().includes('date')) {
      currentEvent.date = line.split(':').slice(1).join(':').trim();
    } else if (line.toLowerCase().includes('time')) {
      currentEvent.time = line.split(':').slice(1).join(':').trim();
    } else if (line.toLowerCase().includes('attendance') || line.toLowerCase().includes('crowd')) {
      currentEvent.expectedAttendance = line.split(':').slice(1).join(':').trim();
    }
  }

  // Add last event
  if (currentEvent.name) {
    const venue = currentEvent.venue || 'Las Vegas';
    events.push({
      id: `event-${Date.now()}-${events.length}`,
      name: currentEvent.name || 'Unknown Event',
      venue,
      date: currentEvent.date || 'TBD',
      time: currentEvent.time || 'TBD',
      expectedAttendance: currentEvent.expectedAttendance || 'Unknown',
      category: categorizeEvent(currentEvent.name || '', venue),
      description: currentEvent.description || '',
      impactLevel: determineImpactLevel(currentEvent.expectedAttendance || ''),
      nearbyStores: ['2059', '3455'],
      distanceMiles: getVenueDistance(venue, refLat, refLng),
    });
  }

  return events;
}

function categorizeEvent(name: string, venue: string): LocalEvent['category'] {
  const lower = (name + ' ' + venue).toLowerCase();

  if (lower.includes('raiders') || lower.includes('allegiant') || lower.includes('football') ||
      lower.includes('golden knights') || lower.includes('hockey') || lower.includes('aces') ||
      lower.includes('basketball') || lower.includes('nfl') || lower.includes('nba') ||
      lower.includes('nhl') || lower.includes('ufc') || lower.includes('boxing') ||
      lower.includes('f1') || lower.includes('formula') || lower.includes('nascar')) {
    return 'sports';
  }
  if (lower.includes('concert') || lower.includes('residency') || lower.includes('tour') ||
      lower.includes('sphere') || lower.includes('t-mobile arena') || lower.includes('mgm grand')) {
    return 'concert';
  }
  if (lower.includes('convention') || lower.includes('ces') || lower.includes('conference') ||
      lower.includes('expo') || lower.includes('trade show')) {
    return 'convention';
  }
  if (lower.includes('rodeo') || lower.includes('nfr') || lower.includes('pbr') || lower.includes('bull')) {
    return 'rodeo';
  }
  if (lower.includes('festival') || lower.includes('edc') || lower.includes('life is beautiful')) {
    return 'festival';
  }

  return 'other';
}

function determineImpactLevel(attendance: string): LocalEvent['impactLevel'] {
  const lower = attendance.toLowerCase();
  const numbers = attendance.match(/\d+/g);

  if (numbers) {
    const num = parseInt(numbers.join(''));
    if (num >= 50000) return 'high';
    if (num >= 20000) return 'medium';
  }

  if (lower.includes('sold out') || lower.includes('capacity') || lower.includes('65,000') ||
      lower.includes('100,000')) {
    return 'high';
  }
  if (lower.includes('20,000') || lower.includes('30,000') || lower.includes('40,000')) {
    return 'medium';
  }

  return 'low';
}

async function fetchEventsFromPerplexity(refLat: number, refLng: number): Promise<LocalEvent[]> {
  const apiKey = process.env.PERPLEXITY_API_KEY;

  if (!apiKey) {
    console.error('Perplexity API key not configured');
    return getMockEvents(refLat, refLng);
  }

  const today = new Date();
  const twoWeeksOut = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
  const dateRange = `${today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} to ${twoWeeksOut.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;

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
            content: `You are a Las Vegas events researcher. Return ONLY a JSON array of events, no other text. Each event object must have these exact fields: name, venue, date, time, expectedAttendance, description. Focus on large crowd events that will impact retail traffic.`
          },
          {
            role: 'user',
            content: `Find all major upcoming events in Las Vegas from ${dateRange} that will draw large crowds (5,000+ people). Include:

1. Sports events at Allegiant Stadium (Raiders games, soccer, etc.)
2. Events at T-Mobile Arena (Golden Knights, UFC, concerts)
3. Events at Las Vegas Convention Center
4. Rodeos and NFR events (National Finals Rodeo)
5. Major concerts at The Sphere, MGM Grand, Resorts World
6. Festivals and conventions
7. Any other events expecting 10,000+ attendees

Return as a JSON array with this exact format:
[
  {
    "name": "Event Name",
    "venue": "Venue Name",
    "date": "January 20, 2026",
    "time": "7:00 PM",
    "expectedAttendance": "65,000",
    "description": "Brief description"
  }
]`
          }
        ],
        max_tokens: 2000,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      console.error('Perplexity API error:', response.status, response.statusText);
      return getMockEvents(refLat, refLng);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    const events = parseEventsFromResponse(content, refLat, refLng);

    if (events.length === 0) {
      return getMockEvents(refLat, refLng);
    }

    return events;
  } catch (error) {
    console.error('Error fetching events from Perplexity:', error);
    return getMockEvents(refLat, refLng);
  }
}

// Mock events for fallback
function getMockEvents(refLat: number, refLng: number): LocalEvent[] {
  const today = new Date();

  return [
    {
      id: 'mock-1',
      name: 'Las Vegas Raiders vs TBD',
      venue: 'Allegiant Stadium',
      date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      time: '1:25 PM',
      expectedAttendance: '65,000',
      category: 'sports',
      description: 'NFL Regular Season Game at Allegiant Stadium',
      impactLevel: 'high',
      nearbyStores: ['2059', '3455'],
      distanceMiles: getVenueDistance('Allegiant Stadium', refLat, refLng),
    },
    {
      id: 'mock-2',
      name: 'Vegas Golden Knights Game',
      venue: 'T-Mobile Arena',
      date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      time: '7:00 PM',
      expectedAttendance: '18,500',
      category: 'sports',
      description: 'NHL Hockey - Vegas Golden Knights home game',
      impactLevel: 'medium',
      nearbyStores: ['2059', '3455'],
      distanceMiles: getVenueDistance('T-Mobile Arena', refLat, refLng),
    },
    {
      id: 'mock-3',
      name: 'CES 2026',
      venue: 'Las Vegas Convention Center',
      date: 'January 7-10, 2026',
      time: '9:00 AM - 6:00 PM',
      expectedAttendance: '180,000+',
      category: 'convention',
      description: 'Consumer Electronics Show - World\'s largest tech trade show',
      impactLevel: 'high',
      nearbyStores: ['2059', '3455'],
      distanceMiles: getVenueDistance('Las Vegas Convention Center', refLat, refLng),
    },
    {
      id: 'mock-4',
      name: 'U2:UV Achtung Baby Live',
      venue: 'Sphere Las Vegas',
      date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      time: '8:00 PM',
      expectedAttendance: '18,600',
      category: 'concert',
      description: 'U2 Residency at The Sphere',
      impactLevel: 'medium',
      nearbyStores: ['2059', '3455'],
      distanceMiles: getVenueDistance('Sphere Las Vegas', refLat, refLng),
    },
    {
      id: 'mock-5',
      name: 'Professional Bull Riders World Finals',
      venue: 'T-Mobile Arena',
      date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      time: '6:45 PM',
      expectedAttendance: '17,500',
      category: 'rodeo',
      description: 'PBR World Finals Championship Round',
      impactLevel: 'medium',
      nearbyStores: ['2059', '3455'],
      distanceMiles: getVenueDistance('T-Mobile Arena', refLat, refLng),
    },
  ];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || String(DEFAULT_REFERENCE_LOCATION.lat));
    const lng = parseFloat(searchParams.get('lng') || String(DEFAULT_REFERENCE_LOCATION.lng));

    // Note: We cache events globally but recalculate distances per request
    // This is more efficient than making API calls for each store
    if (isCacheValid() && eventsCache) {
      // Recalculate distances for the specific store location
      const eventsWithDistances = eventsCache.events.map(event => ({
        ...event,
        distanceMiles: getVenueDistance(event.venue, lat, lng),
      }));

      return NextResponse.json({
        success: true,
        data: eventsWithDistances,
        cached: true,
        lastFetch: eventsCache.lastFetch,
        nextRefresh: eventsCache.nextRefresh,
        storeLocation: { lat, lng },
      });
    }

    // Fetch fresh events
    const events = await fetchEventsFromPerplexity(lat, lng);
    const now = new Date();
    const nextRefresh = getNext5amPacific();

    // Update cache (store with default distances, recalculate per request)
    eventsCache = {
      events,
      lastFetch: now.toISOString(),
      nextRefresh: nextRefresh.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: events,
      cached: false,
      lastFetch: now.toISOString(),
      nextRefresh: nextRefresh.toISOString(),
      storeLocation: { lat, lng },
    });
  } catch (error) {
    console.error('Events API error:', error);

    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || String(DEFAULT_REFERENCE_LOCATION.lat));
    const lng = parseFloat(searchParams.get('lng') || String(DEFAULT_REFERENCE_LOCATION.lng));

    // Return mock events on error
    const mockEvents = getMockEvents(lat, lng);
    return NextResponse.json({
      success: true,
      data: mockEvents,
      cached: false,
      error: 'Using fallback data',
      lastFetch: new Date().toISOString(),
      nextRefresh: getNext5amPacific().toISOString(),
      storeLocation: { lat, lng },
    });
  }
}

// Force refresh endpoint
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || String(DEFAULT_REFERENCE_LOCATION.lat));
    const lng = parseFloat(searchParams.get('lng') || String(DEFAULT_REFERENCE_LOCATION.lng));

    const events = await fetchEventsFromPerplexity(lat, lng);
    const now = new Date();
    const nextRefresh = getNext5amPacific();

    // Update cache
    eventsCache = {
      events,
      lastFetch: now.toISOString(),
      nextRefresh: nextRefresh.toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Events cache refreshed',
      data: events,
      lastFetch: now.toISOString(),
      nextRefresh: nextRefresh.toISOString(),
      storeLocation: { lat, lng },
    });
  } catch (error) {
    console.error('Events API POST error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
