import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Recycle, Cloud, Droplets, Users } from "lucide-react";
import { useCMSContent } from "@/hooks/useCMSContent";

interface ImpactMetric {
  metric_name: string;
  metric_value: number;
  unit: string;
}

const CountUp = ({ value, format, delay = 0 }: { value: number, format: (v: number) => string, delay?: number }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    const stepTime = duration / steps;
    
    setTimeout(() => {
      const timer = setInterval(() => {
        countRef.current += increment;
        if (countRef.current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(countRef.current);
        }
      }, stepTime);
      return () => clearInterval(timer);
    }, delay * 1000);
  }, [value, isVisible, delay]);

  return <div ref={elementRef}>{format(count)}</div>;
};

const metricConfig: Record<string, { icon: React.ElementType; label: string; format: (v: number) => string }> = {
  tonnes_recycled: {
    icon: Recycle,
    label: "Textiles Recycled",
    format: (v) => `${v.toFixed(1)} tonnes`,
  },
  carbon_offset: {
    icon: Cloud,
    label: "Carbon Prevented",
    format: (v) => `${v.toFixed(0)} kg CO₂`,
  },
  water_saved: {
    icon: Droplets,
    label: "Water Saved",
    format: (v) => `${Math.round(v / 1000)}k litres`,
  },
  jobs_created: {
    icon: Users,
    label: "Jobs Created",
    format: (v) => `${v.toFixed(0)} people`,
  },
};

interface ImpactCounterContent {
  title?: string;
  subtitle?: string;
}

export function ImpactCounter() {
  const [metrics, setMetrics] = useState<ImpactMetric[]>([
    { metric_name: "tonnes_recycled", metric_value: 12.5, unit: "tonnes" },
    { metric_name: "carbon_offset", metric_value: 8450, unit: "kg CO2" },
    { metric_name: "water_saved", metric_value: 45000, unit: "litres" },
    { metric_name: "jobs_created", metric_value: 45, unit: "people" },
  ]);
  const { data: cms } = useCMSContent("home", "impact-counter");

  const cmsContent = (cms?.content || {}) as ImpactCounterContent;
  const content = {
    title: cmsContent.title || "Our Impact So Far",
    subtitle: cmsContent.subtitle || "Real-time metrics from our UK-Kenya circular fashion operation"
  };

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const { data, error } = await supabase
          .from("impact_metrics")
          .select("metric_name, metric_value, unit")
          .order("recorded_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const latestMetrics = data.reduce((acc, metric) => {
            if (!acc[metric.metric_name]) {
              acc[metric.metric_name] = metric;
            }
            return acc;
          }, {} as Record<string, ImpactMetric>);
          
          setMetrics(Object.values(latestMetrics));
        }
      } catch (err) {
        console.error("Error fetching metrics:", err);
      }
    }

    fetchMetrics();
  }, []);

  return (
    <section className="border-y border-border bg-card py-12">
      <div className="container">
        <div className="mb-8 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground md:text-4xl">
            {content.title}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {content.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {metrics.map((metric, index) => {
            const config = metricConfig[metric.metric_name];
            if (!config) return null;

            const Icon = config.icon;
            
            return (
                <div 
                  key={metric.metric_name} 
                  className="text-center animate-counter-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground md:text-3xl">
                    <CountUp 
                      value={Number(metric.metric_value)} 
                      format={config.format} 
                      delay={index * 0.1}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {config.label}
                  </div>
                </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
