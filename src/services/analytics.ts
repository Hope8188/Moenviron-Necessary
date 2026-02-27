import { supabase } from "@/integrations/supabase/client";

export interface PageViewData {
  page_path: string;
  referrer: string;
  visitor_id: string;
  session_id: string;
  user_agent: string;
  country: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  device_type: string;
}

export async function getGeoData() {
  try {
    const response = await fetch("https://get.geojs.io/v1/ip/geo.json");
    if (!response.ok) throw new Error("Failed to fetch geo data");
    const data = await response.json();

    return {
      country: data.country || "Unknown",
      city: data.city || "Unknown",
      region: data.region || "Unknown",
      latitude: parseFloat(data.latitude) || 0,
      longitude: parseFloat(data.longitude) || 0,
    };
  } catch (error) {
    console.error("Error fetching geo data:", error);
    return {
      country: "Unknown",
      city: "Unknown",
      region: "Unknown",
      latitude: 0,
      longitude: 0,
    };
  }
}

export async function trackPageView(pagePath: string) {
  try {
    const geoData = await getGeoData();
    const sessionId = sessionStorage.getItem("session_id") || `sess_${Math.random().toString(36).substr(2, 9)}`;
    const visitorId = localStorage.getItem("visitor_id") || `vis_${Math.random().toString(36).substr(2, 9)}`;

    sessionStorage.setItem("session_id", sessionId);
    localStorage.setItem("visitor_id", visitorId);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const deviceType = isMobile ? 'mobile' : 'desktop';

    const payload = {
      page_path: pagePath,
      referrer: document.referrer || "direct",
      visitor_id: visitorId,
      session_id: sessionId,
      user_agent: navigator.userAgent,
      country: geoData.country,
      city: geoData.city,
      region: geoData.region,
      latitude: geoData.latitude,
      longitude: geoData.longitude,
      device_type: deviceType,
    };

    const { error } = await supabase.from("page_views").insert(payload);

    if (error) {
      // If RLS blocks it, we log it but don't crash
      console.warn("Analytics tracking blocked or failed:", error.message);
    }
  } catch (err) {
    console.error("Error in trackPageView:", err);
  }
}

export async function getAnalytics() {
  const { data, error } = await supabase
    .from("page_views")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const totalViews = data.length;
  const uniqueVisitors = new Set(data.map((v: any) => v.visitor_id || v.ip_hash)).size;

  // Calculate top countries
  const countryCounts: Record<string, number> = {};
  data.forEach((view) => {
    const country = view.country || "Unknown";
    countryCounts[country] = (countryCounts[country] || 0) + 1;
  });

  const topCountries = Object.entries(countryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalViews,
    uniqueVisitors,
    topCountries,
    recentViews: data.slice(0, 100),
  };
}
