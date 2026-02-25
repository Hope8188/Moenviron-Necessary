import React from 'react';
import { Recycle, Cloud, Droplets, Users } from 'lucide-react';

/**
 * ImpactMetrics Section component
 * Clones the statistics section displaying 'Textiles Recycled', 'Carbon Prevented', 
 * 'Water Saved', and 'Jobs Created'.
 */
const ImpactMetrics = () => {
  const metrics = [
    {
      id: 1,
      icon: <Recycle className="h-6 w-6 text-primary" />,
      value: "127.5 tonnes",
      label: "Textiles Recycled",
    },
    {
      id: 2,
      icon: <Cloud className="h-6 w-6 text-primary" />,
      value: "892 kg CO₂",
      label: "Carbon Prevented",
    },
    {
      id: 3,
      icon: <Droplets className="h-6 w-6 text-primary" />,
      value: "45.0k litres",
      label: "Water Saved",
    },
    {
      id: 4,
      icon: <Users className="h-6 w-6 text-primary" />,
      value: "23 people",
      label: "Jobs Created",
    },
  ];

  return (
    <section className="border-y border-border bg-card py-12 md:py-16">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-3.5xl">
            Our Impact So Far
          </h2>
          <p className="mt-2 text-[16px] text-muted-foreground">
            Real-time metrics from our UK-Kenya circular fashion operation
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-y-12 gap-x-6 md:grid-cols-4 md:gap-8">
          {metrics.map((metric) => (
            <div 
              key={metric.id} 
              className="group flex flex-col items-center text-center animate-counter-up"
            >
              {/* Circular Icon Container */}
              <div 
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-colors duration-300 group-hover:bg-primary/15"
                style={{ backgroundColor: "rgba(45, 90, 67, 0.1)" }}
              >
                {metric.icon}
              </div>

              {/* Data Point */}
              <div className="text-2xl font-bold text-foreground md:text-3xl leading-tight">
                {metric.value}
              </div>

              {/* Metric Label */}
              <div className="mt-1 text-sm font-medium text-muted-foreground uppercase tracking-wider md:text-xs">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactMetrics;