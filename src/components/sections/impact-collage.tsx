import React from 'react';

const ImpactCollage = () => {
  const images = [
    {
      url: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=100&w=1200",
      caption: "Material Recovery",
      description: "Post-consumer textile collection at UK consolidation points.",
      tag: "Logistics / UK",
    },
    {
      url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=100&w=800",
      caption: "Traceable Logistics",
      description: "Automated batch sorting for international transit efficiency.",
      tag: "Process / Transit",
    },
      {
        url: "https://images.unsplash.com/photo-1565891741441-64926e441838?auto=format&fit=crop&q=100&w=800",
        caption: "Facility Ingestion",
        description: "Arrival at Nairobi Hub 01 for circular processing.",
        tag: "Operations / KE",
      },
    {
      url: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=100&w=800",
      caption: "Quality Verification",
      description: "Institutional-grade inspection for circular feedstocks.",
      tag: "Compliance / QA",
    }
  ];

  return (
    <section className="py-32 bg-white border-b border-black/5">
      <div className="container">
        <div className="mb-20">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-forest font-bold mb-6">Process Documentation</p>
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <h2 className="font-display text-4xl font-medium tracking-tight text-foreground max-w-xl">
              Visual Archive of the Circular Supply Chain
            </h2>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Every step in our loop is documented and verified. This archive provides a technical window into the physical transformation of textiles.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/5 border border-black/5">
          {images.map((image, index) => (
            <div
              key={index}
              className="bg-white p-6 group transition-colors hover:bg-black/[0.01]"
            >
              <div className="aspect-[4/5] overflow-hidden mb-8 bg-[#F5F5F5]">
                <img
                  src={image.url}
                  alt={image.caption}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              <div className="space-y-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  {image.tag}
                </p>
                <h3 className="text-xl font-medium text-foreground tracking-tight">
                  {image.caption}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {image.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 flex justify-center">
          <div className="inline-flex items-center gap-4 px-6 py-3 border border-black/5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>● Visual Log v4.2</span>
            <span className="h-4 w-px bg-black/5" />
            <span>Total Frames: 1,240</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactCollage;
