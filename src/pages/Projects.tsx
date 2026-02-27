import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Globe, Recycle, Zap, Play, Info, ArrowRight, Layers, Leaf, RefreshCcw } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { generateImpactReport2025 } from "@/lib/generateImpactReport";
import { SEO } from "@/components/SEO";

const initiatives = [
  {
    id: 1,
    title: "Nairobi River Recovery",
    type: "image",
    url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=1200&auto=format&fit=crop",
    impact: "15 Tons Recovered",
    category: "Waste Interception",
    pillar: "Eliminate",
    description: "Intercepting textile waste before it enters the ecosystem. A critical first step in systemic circularity.",
    size: "large"
  },
    {
      id: 2,
      title: "Artisan Empowerment Hub",
      type: "image",
      url: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=1200&auto=format&fit=crop",
      impact: "Fair Wage Certified",
      category: "Social Value",
      pillar: "Circulate",
      description: "Preserving traditional Kenyan weaving techniques while ensuring economic resilience for artisans.",
      size: "medium"
    },
  {
    id: 3,
    title: "The Digital Passport",
    type: "image",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    impact: "100% Traceable",
    category: "Traceability",
    pillar: "Circulate",
    description: "Implementing blockchain-backed documentation for every material recovered and repurposed.",
    size: "small"
  },
  {
    id: 4,
    title: "Regenerative Cotton Flow",
    type: "image",
    url: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1200&auto=format&fit=crop",
    impact: "500 Acres",
    category: "Agriculture",
    pillar: "Regenerate",
    description: "Supporting Makueni County's transition to organic regenerative farming practices.",
    size: "medium"
  },
  {
    id: 5,
    title: "Eco-System Restoration",
    type: "image",
    url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop",
    impact: "892kg CO₂ Offset",
    category: "Environment",
    pillar: "Regenerate",
    description: "Restoring local landscapes through community-led biodiversity initiatives.",
    size: "large"
  },
  {
    id: 6,
    title: "Circular Design Details",
    type: "image",
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop",
    impact: "Design for Longevity",
    category: "Innovation",
    pillar: "Eliminate",
    description: "Technical exploration of mono-material construction to ensure future recyclability.",
    size: "small"
  },
  {
    id: 7,
    title: "Kibera Production Hub",
    type: "image",
    url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop",
    impact: "45 Jobs Created",
    category: "Livelihoods",
    pillar: "Circulate",
    description: "The systemic heartbeat of our local production, turning waste into high-value garments.",
    size: "medium"
  },
  {
    id: 8,
    title: "Hydraulic Integrity",
    type: "image",
    url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=1200&auto=format&fit=crop",
    impact: "45k L Water Saved",
    category: "Resource Management",
    pillar: "Regenerate",
    description: "Protecting local water cycles by eliminating toxic runoff in production.",
    size: "small"
  }
];

const pillars = [
  {
    title: "Eliminate",
    icon: <Layers className="h-6 w-6" />,
    description: "Waste and pollution by design. We intercept textiles before they reach landfill or river systems.",
    accent: "text-blue-600"
  },
  {
    title: "Circulate",
    icon: <RefreshCcw className="h-6 w-6" />,
    description: "Products and materials at their highest value. We empower Kenyan artisans to upcycle with dignity.",
    accent: "text-[#2D5A43]"
  },
  {
    title: "Regenerate",
    icon: <Leaf className="h-6 w-6" />,
    description: "Nature and local ecosystems. We invest in regenerative farming and biodiversity restoration.",
    accent: "text-amber-600"
  }
];

const Projects = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const pillarRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToPillars = () => {
    pillarRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMethodology = (title: string) => {
    toast({
      title: `${title} Methodology`,
      description: "Technical documentation and impact verification reports will be available soon in our digital library.",
    });
  };

  const handleDownloadReport = () => {
    toast({
      title: "Generating Report",
      description: "Your 2025 Impact & Traceability report is being prepared for download.",
    });
    generateImpactReport2025();
  };

  return (
      <div className="flex min-h-screen flex-col bg-[#F9F7F2]">
          <SEO
            title="Projects & Initiatives"
            description="Explore our systemic transformation initiatives bridging UK textile waste with Kenyan artisan innovation for genuine circular fashion impact."
            url="https://moenviron.com/projects"
            keywords="circular fashion projects, textile upcycling Kenya, UK textile waste initiatives, sustainable fashion programs, artisan training program"
            breadcrumbs={[{ name: "Projects & Initiatives", url: "/projects" }]}
          />
        <Navbar />
        <main className="flex-1">
          {/* Editorial Hero Section (EMF Style) */}
          <section className="relative pt-32 pb-24 border-b border-black/5">
            <div className="container px-6 lg:px-12">
              <div className="grid lg:grid-cols-2 gap-12 items-end">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-black/60 mb-8">
                    <Globe className="h-3 w-3" />
                    Impact Overview
                  </div>
                  <h1 className="text-6xl md:text-8xl font-medium tracking-tight text-[#1A1A1A] font-display leading-[0.9] mb-8">
                    A Systemic <br />
                    <span className="italic font-normal">Transformation</span>
                  </h1>
                </div>
              <div className="lg:max-w-md pb-2">
                <p className="text-xl text-muted-foreground leading-relaxed font-light mb-8">
                  Moving beyond "sustainability" towards a circular economy that is regenerative by design. Our initiatives bridge the gap between UK waste and Kenyan artisan innovation.
                </p>
                <div className="flex items-center gap-6">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-bold uppercase tracking-widest text-xs group"
                    onClick={scrollToPillars}
                  >
                    Our Theory of Change <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Strategic Pillars Section (EMF Style) */}
        <section ref={pillarRef} className="py-24 bg-white">
          <div className="container px-6 lg:px-12">
            <div className="mb-16">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4">The Circular Model</h2>
              <h3 className="text-3xl font-display max-w-2xl">Three principles driven by design to tackle our global environmental challenges.</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              {pillars.map((pillar) => (
                <div key={pillar.title} className="group cursor-default">
                  <div className={`mb-6 p-4 rounded-2xl bg-black/[0.02] inline-block transition-colors group-hover:bg-black/[0.05]`}>
                    {pillar.icon}
                  </div>
                  <h4 className="text-2xl font-bold mb-4 font-display">{pillar.title}</h4>
                  <p className="text-muted-foreground leading-relaxed font-light mb-6">
                    {pillar.description}
                  </p>
                  <div className={`h-1 w-0 bg-black transition-all duration-500 group-hover:w-12`} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Initiatives Gallery (Refined Masonry) */}
        <section className="py-24 bg-[#F9F7F2]">
          <div className="container px-6 lg:px-12">
            <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4">Case Studies</h2>
                <h3 className="text-5xl font-display leading-tight">Authentic <br />Impact in Motion</h3>
              </div>
              <p className="max-w-xs text-sm text-muted-foreground leading-relaxed italic">
                A non-curated, raw look at the systems we are building on the ground in Nairobi and beyond.
              </p>
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
              {initiatives.map((item) => (
                <div 
                  key={item.id}
                  className="relative group break-inside-avoid overflow-hidden bg-white border border-black/5 transition-all duration-700"
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Technical Header */}
                  <div className="p-5 flex justify-between items-center border-b border-black/5 bg-white">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">
                      {item.pillar} — {item.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#2D5A43]">
                      <Zap className="h-3 w-3" />
                      {item.impact}
                    </div>
                  </div>

                  {/* Media Content */}
                  <div className="relative overflow-hidden bg-black/[0.02]">
                    {item.type === "video" ? (
                      <video 
                        src={item.url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-auto object-cover transition-all duration-700"
                      />
                    ) : (
                      <img 
                        src={item.url}
                        alt={item.title}
                        className="w-full h-auto object-cover transition-all duration-700"
                        loading="lazy"
                      />
                    )}
                    
                    {/* Media Type Icon */}
                    {item.type === "video" && (
                      <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm p-1.5 rounded-full text-white pointer-events-none opacity-50">
                        <Play className="h-3 w-3 fill-white" />
                      </div>
                    )}

                    {/* Minimal Overlay */}
                    <div className={`absolute inset-0 bg-white/90 transition-all duration-500 p-8 flex flex-col justify-center items-center text-center ${hoveredId === item.id ? 'opacity-100' : 'opacity-0'}`}>
                      <h3 className="text-2xl font-bold mb-4 font-display text-[#1A1A1A]">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-light">
                        {item.description}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-none border-black/10 text-[10px] font-bold tracking-widest uppercase hover:bg-black hover:text-white px-6 h-10 transition-colors"
                        onClick={() => handleMethodology(item.title)}
                      >
                        Explore Methodology
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Systemic Traceability Map (Circular.fashion Style) */}
        <section className="py-32 bg-[#1A1A1A] text-white overflow-hidden relative">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          <div className="container px-6 lg:px-12 relative z-10">
            <div className="max-w-3xl mb-24">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[#D97706] mb-6">Material Sovereignty</h2>
              <h3 className="text-5xl md:text-7xl font-display leading-[1.1] mb-8">
                The Technical <br />
                <span className="italic font-normal">Circular Loop</span>
              </h3>
              <p className="text-xl text-white/60 font-light leading-relaxed">
                We've mapped every node of our ecosystem to ensure maximum resource recovery and artisan empowerment.
              </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-1 relative">
              {/* Connecting Lines (Desktop Only) */}
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2" />
              
              {[
                { step: "01", label: "Recovery", detail: "Multi-point textile interception at source." },
                { step: "02", label: "Classification", detail: "AI-assisted material sorting in Nairobi." },
                { step: "03", label: "Value Addition", detail: "Artisan-led upcycling and design." },
                { step: "04", label: "Circulation", detail: "Digital passporting for full lifecycle." }
              ].map((node, i) => (
                <div key={node.step} className="relative p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors group">
                  <div className="mb-12 flex items-center justify-between">
                    <span className="text-5xl font-display font-light text-white/20 group-hover:text-[#D97706]/50 transition-colors">{node.step}</span>
                    <div className="h-2 w-2 rounded-full bg-[#D97706]" />
                  </div>
                  <h4 className="text-xl font-bold mb-4">{node.label}</h4>
                  <p className="text-sm text-white/50 leading-relaxed font-light">{node.detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-24 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-12">
                <div>
                  <div className="text-3xl font-bold mb-1">100%</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40">Traceable Materials</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">15.4t</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40">Waste Diverted</div>
                </div>
              </div>
              <Button 
                className="bg-[#D97706] hover:bg-[#B45309] text-white rounded-none h-14 px-12 font-bold uppercase tracking-widest text-xs"
                onClick={handleDownloadReport}
              >
                Download Impact Report
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
