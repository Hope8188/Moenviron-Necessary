import { supabase } from "@/integrations/supabase/client";

interface GeoData {
  country?: string;
  city?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
}

const GEO_CACHE_KEY = 'moenv_geo_data';
const GEO_CACHE_TTL = 24 * 60 * 60 * 1000;

let visitorId: string | null = null;
let sessionId: string | null = null;
let cachedGeoData: GeoData | null = null;

function getVisitorId(): string {
  if (visitorId) return visitorId;

  try {
    const stored = localStorage.getItem('moenv_visitor_id');
    if (stored) {
      visitorId = stored;
      return stored;
    }

    visitorId = crypto.randomUUID();
    localStorage.setItem('moenv_visitor_id', visitorId);
  } catch {
    visitorId = crypto.randomUUID();
  }
  return visitorId;
}

function getSessionId(): string {
  if (sessionId) return sessionId;

  try {
    const stored = sessionStorage.getItem('moenv_session_id');
    if (stored) {
      sessionId = stored;
      return stored;
    }

    sessionId = crypto.randomUUID();
    sessionStorage.setItem('moenv_session_id', sessionId);
  } catch {
    sessionId = crypto.randomUUID();
  }
  return sessionId;
}

async function getGeoData(): Promise<GeoData> {
  if (cachedGeoData) return cachedGeoData;

  try {
    const cached = sessionStorage.getItem(GEO_CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < GEO_CACHE_TTL) {
        cachedGeoData = data;
        return data;
      }
    }
  } catch {
    // Ignore cache errors
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
      mode: 'cors'
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (!data.error && data.country_name) {
        const geo: GeoData = {
          country: data.country_name,
          city: data.city,
          region: data.region,
          latitude: data.latitude,
          longitude: data.longitude
        };
        cachedGeoData = geo;
        try {
          sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify({ data: geo, timestamp: Date.now() }));
        } catch {
          // Ignore storage errors
        }
        return geo;
      }
    }
  } catch {
    // Silently fail - geo data is optional
  }

  return {};
}

export async function trackPageView(pagePath: string) {
  try {
    const sid = getSessionId();
    const vid = getVisitorId();
    const userAgent = navigator.userAgent;
    const referrer = document.referrer || null;

    // Get geo data asynchronously (non-blocking)
    const geoData = await getGeoData();

    // Insert using the actual page_views schema:
    // columns: id, page_path, visitor_id, user_agent, referrer,
    //          country, city, region, latitude, longitude, ip_address, session_id, created_at
    const { error } = await supabase.from('page_views').insert({
      page_path: pagePath,
      session_id: sid,
      visitor_id: vid,
      user_agent: userAgent,
      referrer: referrer,
      country: geoData.country || null,
      city: geoData.city || null,
      region: geoData.region || null,
      latitude: geoData.latitude || null,
      longitude: geoData.longitude || null,
    });

    if (error) {
      console.error('Error tracking page view:', error);
    }
  } catch (error) {
    console.debug('Analytics tracking skipped:', error);
  }
}

export interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  topPages: { page_path: string; count: number }[];
  topCountries: { country: string; count: number }[];
  recentViews: { created_at: string; page_path: string; country: string; city: string }[];
  viewsByDay: { date: string; count: number }[];
}

export async function getAnalytics(days: number = 30): Promise<AnalyticsData> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString();

    // Get all page views within the date range
    const { data: pageViews, error } = await supabase
      .from('page_views')
      .select('*')
      .gte('created_at', startDateStr)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching analytics:', error);
      return getEmptyAnalytics();
    }

    if (!pageViews || pageViews.length === 0) {
      return getEmptyAnalytics();
    }

    // Calculate total views
    const totalViews = pageViews.length;

    // Calculate unique visitors by visitor_id or session_id
    const uniqueSessions = new Set(
      pageViews
        .map((v: Record<string, unknown>) => (v.visitor_id as string) || (v.session_id as string))
        .filter(Boolean)
    );
    const uniqueVisitors = uniqueSessions.size;

    // Calculate top pages
    const pageCounts: Record<string, number> = {};
    pageViews.forEach((v: Record<string, unknown>) => {
      const path = v.page_path as string;
      pageCounts[path] = (pageCounts[path] || 0) + 1;
    });
    const topPages = Object.entries(pageCounts)
      .map(([page_path, count]) => ({ page_path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate views by day
    const dayCounts: Record<string, number> = {};
    pageViews.forEach((v: Record<string, unknown>) => {
      const date = (v.created_at as string).split('T')[0];
      dayCounts[date] = (dayCounts[date] || 0) + 1;
    });
    const viewsByDay = Object.entries(dayCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Top countries
    const countryCounts: Record<string, number> = {};
    pageViews.forEach((v: Record<string, unknown>) => {
      const country = v.country as string;
      if (country) {
        countryCounts[country] = (countryCounts[country] || 0) + 1;
      }
    });
    const topCountries = Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Recent views (last 20)
    const recentViews = pageViews.slice(0, 20).map((v: Record<string, unknown>) => ({
      created_at: v.created_at as string,
      page_path: v.page_path as string,
      country: (v.country as string) || '',
      city: (v.city as string) || ''
    }));

    return {
      totalViews,
      uniqueVisitors,
      topPages,
      topCountries,
      recentViews,
      viewsByDay
    };
  } catch (error) {
    console.error('Error in getAnalytics:', error);
    return getEmptyAnalytics();
  }
}

function getEmptyAnalytics(): AnalyticsData {
  return {
    totalViews: 0,
    uniqueVisitors: 0,
    topPages: [],
    topCountries: [],
    recentViews: [],
    viewsByDay: []
  };
}
