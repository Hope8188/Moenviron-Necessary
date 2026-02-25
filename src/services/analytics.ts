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

function getDeviceType(): string {
  const ua = navigator.userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera mini|opera mobi|iemobile/i.test(ua)) return 'mobile';
  return 'desktop';
}

export async function trackPageView(pagePath: string) {
  try {
    const sid = getSessionId();
    const userAgent = navigator.userAgent;
    const referrer = document.referrer || null;
    const deviceType = getDeviceType();
    
    // Get geo data asynchronously (non-blocking)
    const geoData = await getGeoData();

    const { error } = await supabase.from('page_views').insert({
      page_path: pagePath,
      session_id: sid,
      user_agent: userAgent,
      referrer: referrer,
      device_type: deviceType,
      country: geoData.country || null,
      city: geoData.city || null,
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

    // Calculate unique visitors by session_id
    const uniqueSessions = new Set(pageViews.map(v => v.session_id).filter(Boolean));
    const uniqueVisitors = uniqueSessions.size;

    // Calculate top pages
    const pageCounts: Record<string, number> = {};
    pageViews.forEach(v => {
      pageCounts[v.page_path] = (pageCounts[v.page_path] || 0) + 1;
    });
    const topPages = Object.entries(pageCounts)
      .map(([page_path, count]) => ({ page_path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate views by day
    const dayCounts: Record<string, number> = {};
    pageViews.forEach(v => {
      const date = v.created_at.split('T')[0];
      dayCounts[date] = (dayCounts[date] || 0) + 1;
    });
    const viewsByDay = Object.entries(dayCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Recent views (last 20)
    const recentViews = pageViews.slice(0, 20).map(v => ({
      created_at: v.created_at,
      page_path: v.page_path,
      country: '',
      city: ''
    }));

    return {
      totalViews,
      uniqueVisitors,
      topPages,
      topCountries: [],
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
