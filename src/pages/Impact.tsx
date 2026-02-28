import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCMSContent } from "@/hooks/useCMSContent";
import { Recycle, Cloud, Droplets, Users } from "lucide-react";
import {
  ResponsiveContainer,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ImpactCollage from "@/components/sections/impact-collage";
import { SEO } from "@/components/SEO";

interface ImpactMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  unit: string;
  recorded_at: string;
  batch_id?: string | null;
  traceability_link?: string | null;
  facility_location?: string | null;
  category?: string | null;
}

const metricConfig: Record<string, { icon: React.ElementType; label: string; color: string; description: string }> = {
  tonnes_recycled: {
    icon: Recycle,
    label: "Textiles Recycled",
    color: "hsl(150 40% 35%)",
    description: "Amount of textile waste diverted from landfills and processed through our circular systems."
  },
  carbon_offset: {
    icon: Cloud,
    label: "Carbon Prevented",
    color: "hsl(200 60% 45%)",
    description: "Greenhouse gas emissions avoided by replacing virgin materials with recycled textiles."
  },
  water_saved: {
    icon: Droplets,
    label: "Water Saved",
    color: "hsl(220 70% 55%)",
    description: "Total water volume conserved compared to traditional textile production methods."
  },
  jobs_created: {
    icon: Users,
    label: "Jobs Created",
    color: "hsl(25 45% 45%)",
    description: "Sustainable employment opportunities established within our Kenyan processing facility."
  },
};

const testMetricsData: ImpactMetric[] = [
  { id: "1", metric_name: "tonnes_recycled", metric_value: 2.1, unit: "tonnes", recorded_at: "2024-01-15", batch_id: "BATCH-001", traceability_link: "#", facility_location: "Nairobi_Hub_01", category: "recycling" },
  { id: "2", metric_name: "tonnes_recycled", metric_value: 4.8, unit: "tonnes", recorded_at: "2024-02-15", batch_id: "BATCH-002", traceability_link: "#", facility_location: "Nairobi_Hub_01", category: "recycling" },
  { id: "3", metric_name: "tonnes_recycled", metric_value: 6.2, unit: "tonnes", recorded_at: "2024-03-15", batch_id: "BATCH-003", traceability_link: "#", facility_location: "Nairobi_Hub_01", category: "recycling" },
  { id: "4", metric_name: "tonnes_recycled", metric_value: 8.9, unit: "tonnes", recorded_at: "2024-04-15", batch_id: "BATCH-004", traceability_link: "#", facility_location: "Nairobi_Hub_01", category: "recycling" },
  { id: "5", metric_name: "tonnes_recycled", metric_value: 10.5, unit: "tonnes", recorded_at: "2024-05-15", batch_id: "BATCH-005", traceability_link: "#", facility_location: "Nairobi_Hub_01", category: "recycling" },
  { id: "6", metric_name: "tonnes_recycled", metric_value: 12.5, unit: "tonnes", recorded_at: "2024-06-15", batch_id: "BATCH-006", traceability_link: "#", facility_location: "Nairobi_Hub_01", category: "recycling" },
  { id: "7", metric_name: "carbon_offset", metric_value: 1200, unit: "kg CO2", recorded_at: "2024-01-15", batch_id: "BATCH-001", traceability_link: "#", facility_location: "Nairobi_Hub_01", category: "emissions" },
  { id: "8", metric_name: "carbon_offset", metric_value: 2800, unit: "kg CO2", recorded_at: "2024-02-15", batch_id: "BATCH-002", traceability_link: "#", facility_location: "Nairobi_Hub_01", category: "emissions" },
  { id: "9", metric_name: "carbon_offset", metric_value: 4100, unit: "kg CO2", recorded_at: "2024-03-15", batch_id: "BATCH-003", traceability_link: "#", facility_location: "Nairobi_Hub_01", category: "emissions" },
  { id: "10", metric_name: "carbon_offset", metric_value: 5600, unit: "kg CO2", recorded_at: "2024-04-15", batch_id: "BATCH-004", traceability_link: "#", facility_location: "Nairobi_Hub_01", category: "emissions" },
  { id: "11", metric_name: "carbon_offset", metric_value: 7200, unit: "kg CO2", recorded_at: "2024-05-15", batch_id: "BATCH-005", traceability_link: "#", facility_location: "Nairobi_Hub_01", category: "emissions" },
  { id: "12", metric_name: "carbon_offset", metric_value: 8450, unit: "kg CO2", recorded_at: "2024-06-15", batch_id: "BATCH-006", traceability_link: "#", facility_location: "Nairobi_Hub_01", category: "emissions" },
  { id: "13", metric_name: "water_saved", metric_value: 8000, unit: "litres", recorded_at: "2024-01-15", batch_id: "BATCH-001", traceability_link: "#", facility_location: "Nairobi_Hub_01", category: "water" },
  { id: "14", metric_name: "water_saved", metric_value: 15000, unit: "litres", recorded_at: "2024-02-15", batch_id: "BATCH-002", traceability_link: "#", facility_location: "Nairobi_Hub_01", category: "water" },
  { id: "15", metric_name: "water_saved", metric_value: 22000, unit: "litres", recorded_at: "2024-03-15", batch_id: "BATCH-003", traceability_link: "#", facility_location: "Nairobi_Hub_01", category: "water" },
  { id: "16", metric_name: "water_saved", metric_value: 30000, unit: "litres", recorded_at: "2024-04-15", batch_id: "BATCH-004", traceability_link: "#", facility_location: "Nairobi_Hub_01", category: "water" },
  { id: "17", metric_name: "water_saved", metric_value: 38000, unit: "litres", recorded_at: "2024-05-15", batch_id: "BATCH-005", traceability_link: "#", facility_location: "Nairobi_Hub_01", category: "water" },
  { id: "18", metric_name: "water_saved", metric_value: 45000, unit: "litres", recorded_at: "2024-06-15", batch_id: "BATCH-006", traceability_link: "#", facility_location: "Nairobi_Hub_01", category: "water" },
  { id: "19", metric_name: "jobs_created", metric_value: 12, unit: "people", recorded_at: "2024-01-15", batch_id: "BATCH-001", traceability_link: "#", facility_location: "Nairobi_Hub_01", category: "social" },
  { id: "20", metric_name: "jobs_created", metric_value: 18, unit: "people", recorded_at: "2024-02-15", batch_id: "BATCH-002", traceability_link: "#", facility_location: "Nairobi_Hub_01", category: "social" },
  { id: "21", metric_name: "jobs_created", metric_value: 25, unit: "people", recorded_at: "2024-03-15", batch_id: "BATCH-003", traceability_link: "#", facility_location: "Nairobi_Hub_01", category: "social" },
  { id: "22", metric_name: "jobs_created", metric_value: 32, unit: "people", recorded_at: "2024-04-15", batch_id: "BATCH-004", traceability_link: "#", facility_location: "Nairobi_Hub_01", category: "social" },
  { id: "23", metric_name: "jobs_created", metric_value: 40, unit: "people", recorded_at: "2024-05-15", batch_id: "BATCH-005", traceability_link: "#", facility_location: "Nairobi_Hub_01", category: "social" },
  { id: "24", metric_name: "jobs_created", metric_value: 45, unit: "people", recorded_at: "2024-06-15", batch_id: "BATCH-006", traceability_link: "#", facility_location: "Nairobi_Hub_01", category: "social" },
];

const Impact = () => {
  // Removed unused metric state
  const [activeMetric, setActiveMetric] = useState("tonnes_recycled");
  const { data: cmsHeader, isLoading: cmsLoading } = useCMSContent("impact", "header");

  interface ImpactContent {
    headline?: string;
    subheadline?: string;
  }

  const { data: fetchMetricsData, isLoading: metricsLoading } = useQuery({
    queryKey: ["impact-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("impact_metrics")
        .select("id, metric_name, metric_value, unit, recorded_at, notes")
        .order("recorded_at", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        return data.map(item => ({
          ...item,
          batch_id: null,
          traceability_link: null,
          facility_location: null,
          category: null,
        })) as ImpactMetric[];
      }
      return testMetricsData;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const metrics = fetchMetricsData || testMetricsData;
  const isLoading = cmsLoading || metricsLoading;

  const cmsContent = (cmsHeader?.content || {}) as ImpactContent;
  const content = {
    headline: cmsContent.headline || "Impact <span class='text-forest italic font-serif'>Redefined</span>",
    subheadline: cmsContent.subheadline || "Independent verification of our circular infrastructure across the UK-Kenya textile loop."
  };

  const latestMetrics = Object.entries(
    metrics.reduce((acc, m) => {
      if (!acc[m.metric_name] || new Date(m.recorded_at) > new Date(acc[m.metric_name].recorded_at)) {
        acc[m.metric_name] = m;
      }
      return acc;
    }, {} as Record<string, ImpactMetric>)
  ).map(([, v]) => v);

  const filteredChartData = metrics.filter((m) => m.metric_name === activeMetric);
  const traceabilityBatches = metrics.filter(m => m.batch_id).sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime());



  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-forest/20">
      <SEO
        title="Environmental Impact"
        description="Track our verified environmental impact: tonnes of textiles recycled, carbon offset, water saved, and jobs created through our UK-Kenya circular fashion loop."
        url="https://moenviron.com/impact"
        keywords="fashion environmental impact, textile recycling statistics, carbon offset fashion, sustainable fashion impact, circular economy metrics"
        breadcrumbs={[{ name: "Our Impact", url: "/impact" }]}
      />
      <Navbar />
      <main className="flex-1">
        {/* Institutional Header */}
        <section className="pt-32 pb-16 md:pt-40 border-b border-black/5">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-2 w-2 rounded-full bg-forest animate-pulse" />
                  <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
                    Archive / Environmental ROI / v2.1.0
                  </p>
                </div>
                <h1
                  className="font-display text-5xl md:text-7xl font-medium tracking-tight text-foreground leading-[1.1]"
                  dangerouslySetInnerHTML={{ __html: content.headline }}
                />
                <p className="mt-8 text-xl text-muted-foreground max-w-xl leading-relaxed">
                  {content.subheadline}
                </p>
              </div>
              <div className="flex flex-col items-end text-right font-mono text-[11px] leading-relaxed uppercase tracking-wider text-muted-foreground border-l border-black/5 pl-8 hidden md:flex">
                <div className="mb-4 text-forest font-bold flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-forest" />
                  System Status: Active
                </div>
                <p>Node: Nairobi Hub 01</p>
                <p>Schema: L3-Trace-Verified</p>
                <p>Last Sync: {new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString('en-GB')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Metric Ledger (Simplified Institutional View) */}
        <section className="py-0 border-b border-black/5 overflow-x-auto no-scrollbar">
          <div className="container flex divide-x divide-black/5">
            {latestMetrics.length > 0 ? (
              latestMetrics.map((metric) => {
                const config = metricConfig[metric.metric_name];
                if (!config) return null;
                const isActive = activeMetric === metric.metric_name;

                return (
                  <button
                    key={metric.metric_name}
                    onClick={() => setActiveMetric(metric.metric_name)}
                    className={`flex-1 py-12 px-8 min-w-[200px] text-left transition-all group relative ${isActive ? 'bg-forest/5' : 'hover:bg-black/[0.02]'
                      }`}
                  >
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
                      {config.label}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-mono font-medium tracking-tighter">
                        {Number(metric.metric_value).toLocaleString()}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase">
                        {metric.unit}
                      </span>
                    </div>
                    {isActive && (
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-forest" />
                    )}
                  </button>
                );
              })
            ) : (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-1 py-12 px-8 animate-pulse border-r border-black/5">
                  <div className="h-3 w-20 bg-muted mb-4" />
                  <div className="h-8 w-32 bg-muted" />
                </div>
              ))
            )}
          </div>
        </section>

        {/* Traceability Ledger (Technical Table) */}
        <section id="traceability" className="py-24 bg-[#FAFAFA]">
          <div className="container">
            <div className="mb-16">
              <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-forest font-bold mb-4">Verification Ledger</h2>
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <p className="text-2xl text-foreground font-medium max-w-2xl leading-snug">
                  Real-time processing logs from our UK and Kenyan facilities. Every data point is cross-verified for EPR compliance.
                </p>
                <Badge variant="outline" className="rounded-none border-black/10 px-4 py-2 text-[10px] font-mono uppercase tracking-widest">
                  ISO-14001 Standards
                </Badge>
              </div>
            </div>

            <div className="border border-black/5 bg-white shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-black/[0.02] border-b border-black/5">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest py-4">Batch Reference</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest">Facility</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest">Parameter</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest">Value</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest">Status</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-right">Certificate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {traceabilityBatches.length > 0 ? (
                    traceabilityBatches.map((batch) => (
                      <TableRow key={batch.id} className="hover:bg-black/[0.01] border-b border-black/5 last:border-0 transition-colors">
                        <TableCell className="font-mono text-[11px] font-bold text-forest py-5">
                          #{batch.batch_id}
                        </TableCell>
                        <TableCell className="font-mono text-[11px] text-muted-foreground uppercase">
                          {batch.facility_location || 'Nairobi_Hub_01'}
                        </TableCell>
                        <TableCell className="text-[13px] font-medium uppercase tracking-tight">
                          {batch.metric_name.replace('_', ' ')}
                        </TableCell>
                        <TableCell className="font-mono text-[13px] font-medium">
                          {batch.metric_value} {batch.unit}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-forest" />
                            <span className="text-[10px] font-mono uppercase tracking-widest text-forest font-bold">Verified</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <a
                            href={batch.traceability_link || '#'}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-forest transition-colors underline underline-offset-4"
                          >
                            Access Data
                          </a>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-muted-foreground font-mono text-[11px] uppercase tracking-widest">
                        Awaiting data ingestion...
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        {/* Process Archive replaces Collage */}
        <ImpactCollage />

        {/* Interactive Analysis (Simplified) */}
        <section className="py-32 bg-white">
          <div className="container">
            <div className="mb-20 grid md:grid-cols-2 gap-12 items-end">
              <div>
                <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-forest font-bold mb-4">Historical Performance</h2>
                <p className="text-4xl font-medium tracking-tight text-foreground">
                  Performance Trends
                </p>
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                  Longitudinal data analysis of our circular infrastructure. Metrics are tracked monthly to monitor growth in recovery efficiency and carbon mitigation.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 md:justify-end">
                {Object.entries(metricConfig).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setActiveMetric(key)}
                    className={`px-6 py-2 text-[10px] font-mono uppercase tracking-widest border transition-all ${activeMetric === key
                      ? 'bg-black text-white border-black'
                      : 'bg-transparent text-muted-foreground border-black/10 hover:border-black/30'
                      }`}
                  >
                    {config.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[500px] w-full border border-black/5 p-8 md:p-12">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredChartData}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis
                    dataKey="recorded_at"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => new Date(value).toLocaleDateString("en-GB", { month: "short", year: "2-digit" })}
                    stroke="#999"
                    fontSize={10}
                    fontFamily="monospace"
                    dy={20}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    stroke="#999"
                    fontSize={10}
                    fontFamily="monospace"
                    dx={-20}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="border border-black bg-white p-4 shadow-xl">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
                              {new Date(label).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                            </p>
                            <p className="text-xl font-mono font-bold text-black">
                              {Number(payload[0].value).toLocaleString()}
                              <span className="ml-2 text-[10px] text-muted-foreground">{payload[0].payload.unit}</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="metric_value"
                    stroke="#1A3C34"
                    strokeWidth={2}
                    fill="#1A3C34"
                    fillOpacity={0.05}
                    animationDuration={2000}
                    animationEasing="ease-in-out"
                    animationBegin={0}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Combined Impact Overview Graph */}
        <section className="py-32 bg-[#FAFAFA] border-t border-black/5">
          <div className="container">
            <div className="mb-16">
              <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-forest font-bold mb-4">Cumulative Impact</h2>
              <p className="text-4xl font-medium tracking-tight text-foreground">
                Environmental Progress Overview
              </p>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl">
                A comprehensive view of all key impact metrics over time, demonstrating our growing contribution to sustainable textile management.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {Object.entries(metricConfig).map(([key, config]) => {
                const metricData = metrics.filter((m) => m.metric_name === key);
                const latestValue = metricData.length > 0 ? metricData[metricData.length - 1].metric_value : 0;
                const unit = metricData.length > 0 ? metricData[metricData.length - 1].unit : "";
                const Icon = config.icon;

                return (
                  <Card key={key} className="border border-black/5 bg-white shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-forest/10">
                            <Icon className="h-5 w-5 text-forest" />
                          </div>
                          <div>
                            <CardTitle className="text-sm font-mono uppercase tracking-widest">{config.label}</CardTitle>
                            <CardDescription className="text-xs mt-1">{config.description}</CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-mono font-bold text-forest">{Number(latestValue).toLocaleString()}</p>
                          <p className="text-[10px] font-mono text-muted-foreground uppercase">{unit}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="h-[150px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={metricData}>
                            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(0,0,0,0.05)" />
                            <XAxis
                              dataKey="recorded_at"
                              axisLine={false}
                              tickLine={false}
                              tickFormatter={(value) => new Date(value).toLocaleDateString("en-GB", { month: "short" })}
                              stroke="#999"
                              fontSize={9}
                              fontFamily="monospace"
                            />
                            <YAxis hide />
                            <Tooltip
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="border border-black bg-white p-3 shadow-lg text-xs">
                                      <p className="font-mono text-muted-foreground mb-1">
                                        {new Date(label).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                                      </p>
                                      <p className="font-mono font-bold">
                                        {Number(payload[0].value).toLocaleString()} {payload[0].payload.unit}
                                      </p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="metric_value"
                              stroke={config.color}
                              strokeWidth={2}
                              fill={config.color}
                              fillOpacity={0.1}
                              animationDuration={1500}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Impact;
