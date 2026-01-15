// Weather API Endpoint
// Uses Perplexity API to fetch current weather for Las Vegas
// Caches results for 24 hours

import { NextResponse } from 'next/server';

export interface WeatherData {
  temperature: number;
  condition: string;
  icon: 'sun' | 'cloud' | 'rain' | 'snow' | 'storm' | 'partly-cloudy' | 'wind';
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  high: number;
  low: number;
  location: string;
  lastUpdated: string;
}

interface CachedWeather {
  data: WeatherData;
  lastFetch: string;
  expiresAt: string;
}

// In-memory cache
let weatherCache: CachedWeather | null = null;

// Cache duration: 24 hours
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000;

function isCacheValid(): boolean {
  if (!weatherCache) return false;
  const now = new Date();
  const expiresAt = new Date(weatherCache.expiresAt);
  return now < expiresAt;
}

function parseWeatherIcon(condition: string): WeatherData['icon'] {
  const lower = condition.toLowerCase();

  if (lower.includes('sunny') || lower.includes('clear')) return 'sun';
  if (lower.includes('partly') || lower.includes('partial')) return 'partly-cloudy';
  if (lower.includes('cloud') || lower.includes('overcast')) return 'cloud';
  if (lower.includes('rain') || lower.includes('shower') || lower.includes('drizzle')) return 'rain';
  if (lower.includes('snow') || lower.includes('flurr')) return 'snow';
  if (lower.includes('thunder') || lower.includes('storm') || lower.includes('lightning')) return 'storm';
  if (lower.includes('wind') || lower.includes('gust')) return 'wind';

  return 'sun'; // Default for Las Vegas
}

async function fetchWeatherFromPerplexity(): Promise<WeatherData> {
  const apiKey = process.env.PERPLEXITY_API_KEY;

  if (!apiKey) {
    console.error('Perplexity API key not configured');
    return getMockWeather();
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
            content: 'You are a weather reporter. Return ONLY a JSON object with current weather data, no other text. Be precise with numbers.'
          },
          {
            role: 'user',
            content: `What is the current weather in Las Vegas, Nevada right now? Return as a JSON object with this exact format:
{
  "temperature": 72,
  "condition": "Sunny",
  "humidity": 25,
  "windSpeed": 8,
  "feelsLike": 74,
  "high": 78,
  "low": 55
}

Temperature values should be in Fahrenheit. Wind speed in mph. Humidity as percentage.`
          }
        ],
        max_tokens: 500,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      console.error('Perplexity API error:', response.status, response.statusText);
      return getMockWeather();
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          temperature: parsed.temperature || 72,
          condition: parsed.condition || 'Clear',
          icon: parseWeatherIcon(parsed.condition || 'Clear'),
          humidity: parsed.humidity || 25,
          windSpeed: parsed.windSpeed || 8,
          feelsLike: parsed.feelsLike || parsed.temperature || 72,
          high: parsed.high || parsed.temperature + 5 || 78,
          low: parsed.low || parsed.temperature - 15 || 55,
          location: 'Las Vegas, NV',
          lastUpdated: new Date().toISOString(),
        };
      } catch {
        // JSON parsing failed
      }
    }

    return getMockWeather();
  } catch (error) {
    console.error('Error fetching weather from Perplexity:', error);
    return getMockWeather();
  }
}

// Mock weather for fallback (realistic Las Vegas weather)
function getMockWeather(): WeatherData {
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour > 20;

  // Simulate seasonal temperature variation
  const month = new Date().getMonth();
  const isWinter = month >= 11 || month <= 2;
  const isSummer = month >= 5 && month <= 8;

  let baseTemp = 72;
  if (isWinter) baseTemp = 55;
  if (isSummer) baseTemp = 95;

  // Add some randomness
  const tempVariation = Math.floor(Math.random() * 8) - 4;
  const temp = baseTemp + tempVariation;

  return {
    temperature: temp,
    condition: isNight ? 'Clear Night' : 'Sunny',
    icon: isNight ? 'partly-cloudy' : 'sun',
    humidity: isWinter ? 35 : 20,
    windSpeed: Math.floor(Math.random() * 10) + 5,
    feelsLike: temp + (isSummer ? 3 : -2),
    high: temp + 8,
    low: temp - 18,
    location: 'Las Vegas, NV',
    lastUpdated: new Date().toISOString(),
  };
}

export async function GET() {
  try {
    // Check if cache is valid
    if (isCacheValid() && weatherCache) {
      return NextResponse.json({
        success: true,
        data: weatherCache.data,
        cached: true,
        lastFetch: weatherCache.lastFetch,
      });
    }

    // Fetch fresh weather data
    const weatherData = await fetchWeatherFromPerplexity();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + CACHE_DURATION_MS);

    // Update cache
    weatherCache = {
      data: weatherData,
      lastFetch: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: weatherData,
      cached: false,
      lastFetch: now.toISOString(),
    });
  } catch (error) {
    console.error('Weather API error:', error);

    // Return mock weather on error
    const mockWeather = getMockWeather();
    return NextResponse.json({
      success: true,
      data: mockWeather,
      cached: false,
      error: 'Using fallback data',
      lastFetch: new Date().toISOString(),
    });
  }
}

// Force refresh endpoint
export async function POST() {
  try {
    const weatherData = await fetchWeatherFromPerplexity();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + CACHE_DURATION_MS);

    // Update cache
    weatherCache = {
      data: weatherData,
      lastFetch: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Weather cache refreshed',
      data: weatherData,
      lastFetch: now.toISOString(),
    });
  } catch (error) {
    console.error('Weather API POST error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
