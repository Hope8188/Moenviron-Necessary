import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Globe, FileText, ExternalLink, BarChart, Quote, Shield, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SEO } from "@/components/SEO";

const About = () => {
  const [selectedPaper, setSelectedPaper] = useState<{ title: string; description: string; date: string; content: string; category: string } | null>(null);

  const whitepapers = [
    {
      title: "2026 Textile Traceability Report",
        description: "A comprehensive look at our supply chain transparency from UK collection to Kenya and Africa processing.",
        date: "January 2026",
        category: "Sustainability",
        content: `
          ## Executive Summary
          As of January 2026, Moenviron has achieved 100% blockchain-verified traceability for all textile movements between the UK and Kenya and Africa. This report details our methodology and the carbon reduction results.
          
          ## Key Findings
          - 45% reduction in logistics-related carbon emissions compared to 2024.
          - 1.2 million kg of textiles diverted from landfills in the last 12 months.
          - 300+ local jobs created in the Nairobi upcycling facility.
          
          ## Future Outlook
          We are expanding our collection points across Northern Europe by Q3 2026.
        `
      },
      {
        title: "Nairobi Processing: A Circular Case Study",
        description: "Exploring the socio-economic impact of our artisanal upcycling facility in the heart of Kenya and Africa.",
        date: "January 2026",
        category: "Impact",
        content: `
          ## The Nairobi Model
          Our facility in Nairobi serves as a blueprint for localized circular economies. By combining high-tech sorting with traditional artisanal repair, we create high-value fashion from perceived waste.
          
          ## Socio-Economic Impact
          - Average artisan wage is 60% above the regional living wage.
          - On-site daycare and education programs for 150 families.
          - Zero-waste production: All offcuts are repurposed into industrial stuffing or paper.
        `
      },
      {
        title: "The UK-Kenya and Africa Fashion Bridge 2026",
        description: "Policy recommendations for cross-border circular economies in the textile sector.",
        date: "January 2026",
        category: "Policy",
        content: `
          ## Policy Framework
          This paper outlines the necessary regulatory shifts to support circular trade. We advocate for "Green Lanes" in international shipping for certified upcycled goods.
          
          ## Recommendations
          1. Removal of import duties on textile waste destined for verified upcycling.
          2. Standardized carbon labeling across the Commonwealth.
          3. Tax incentives for brands participating in verified "Take-Back" programs.
        `
      }
    ];

  return (
    <div className="flex min-h-screen flex-col">
      <SEO
          title="About Us"
          description="Learn about Moenviron's mission to transform fashion's relationship with waste through our UK-Kenya circular economy partnership."
          url="https://moenviron.com/about"
          keywords="sustainable fashion brand, circular economy UK Kenya, textile recycling, ethical fashion company, eco fashion brand"
          breadcrumbs={[{ name: "About Us", url: "/about" }]}
        />
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-hero py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-display text-3xl font-bold text-foreground md:text-5xl">
                About Moenviron
              </h1>
              <p className="mt-3 md:mt-4 text-base md:text-lg text-muted-foreground px-4">
                We're on a mission to transform fashion's relationship with waste, 
                creating a circular economy that benefits people and planet.
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-10 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:gap-12 lg:grid-cols-2 lg:items-center">
              <div className="animate-fade-in order-2 lg:order-1">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Our Mission</h2>
                <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                  Every year, millions of tonnes of textiles end up in landfills across the UK. 
                  At Moenviron, we see this waste as an opportunity. We collect discarded textiles, 
                  ship them to our facility in Kenya, where skilled artisans sort, repair, and 
                  transform them into premium sustainable fashion.
                </p>
                <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                  Our UK-Kenya partnership creates jobs, reduces environmental impact, and proves 
                  that circular fashion can be both ethical and profitable.
                </p>
              </div>
              <div className="relative aspect-[4/3] md:aspect-[4/5] overflow-hidden rounded-xl md:rounded-2xl bg-muted shadow-xl md:shadow-2xl animate-fade-in-up order-1 lg:order-2">
                <img 
                  src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop" 
                  alt="Sustainable fashion mission" 
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* CEO Vision */}
        <section className="bg-secondary/30 py-10 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
                <div className="w-32 h-32 md:w-56 md:h-56 flex-shrink-0 rounded-xl md:rounded-2xl overflow-hidden border-2 md:border-4 border-white shadow-xl md:shadow-2xl rotate-3 transition-transform hover:rotate-0">
                  <img 
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/2274ce5a-a92d-4b73-b73e-99562f585de3/image-1768041036895.png?width=8000&height=8000&resize=contain" 
                    alt="Moses Mnai - CEO" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <Quote className="h-8 w-8 md:h-10 md:w-10 text-primary/20 mb-3 md:mb-4 mx-auto md:mx-0" />
                  <h2 className="font-display text-xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">A Note from our CEO</h2>
                  <p className="text-base md:text-xl italic text-muted-foreground mb-4 md:mb-6 leading-relaxed">
                    “At Moenviron, we believe that nurturing nature is life. Our mission is to bridge the gap between the global textile waste and Africa’s artisanal brilliance, creating a circular system that empowers communities and protects our planet.”
                  </p>
                  <p className="font-display text-sm md:text-lg font-semibold text-foreground">— Moses Mnai, Founder & CEO</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-card py-10 md:py-16">
          <div className="container px-4 md:px-6">
            <h2 className="mb-3 md:mb-4 text-center text-2xl md:text-3xl font-bold text-foreground">Why Choose Us</h2>
            <p className="mb-8 md:mb-12 text-center text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Premium quality, ethically restored fashion that's built to last
            </p>
            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
              {[
                {
                  icon: Shield,
                  title: "Sanitized & Safe",
                  description: "Every piece undergoes professional sanitization and quality checks before reaching you.",
                },
                {
                  icon: Sparkles,
                  title: "Artisan Restored",
                  description: "Skilled Kenyan craftspeople repair and elevate each garment to premium standards.",
                },
                {
                  icon: Zap,
                  title: "Built to Last",
                  description: "High-quality materials and expert restoration mean your pieces last longer than fast fashion.",
                },
              ].map((value) => {
                const Icon = value.icon;
                return (
                  <div key={value.title} className="rounded-xl border border-border bg-background p-4 md:p-6 text-center">
                    <div className="mx-auto mb-3 md:mb-4 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                    </div>
                    <h3 className="mb-2 text-base md:text-lg font-semibold text-foreground">{value.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-10 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">UK-Kenya Partnership</h2>
              <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground">
                Our team spans two continents, united by a shared commitment to sustainable fashion. 
                From our London office coordinating collections to our Nairobi facility where the 
                transformation happens, we work together to close the fashion loop.
              </p>
            </div>
          </div>
        </section>

        {/* Whitepapers Section */}
        <section id="whitepapers" className="bg-secondary/30 py-10 md:py-16 scroll-mt-20">
          <div className="container px-4 md:px-6">
            <div className="mb-8 md:mb-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Whitepapers & Insights</h2>
              <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                Discover our deep dives into circular economy, textile traceability, and 
                the socio-economic impact of sustainable fashion in East Africa.
              </p>
            </div>
            
          <div className="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {whitepapers.map((paper) => (
              <div key={paper.title} className="group relative flex flex-col rounded-xl md:rounded-2xl border border-border bg-background p-4 md:p-6 transition-all hover:shadow-lg">
                <div className="mb-3 md:mb-4 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div className="mb-2 flex items-center gap-2 text-[10px] md:text-xs font-medium text-primary uppercase tracking-wider">
                  <BarChart className="h-3 w-3" />
                  {paper.category}
                </div>
                <h3 className="mb-2 text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {paper.title}
                </h3>
                <p className="mb-4 md:mb-6 flex-1 text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {paper.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] md:text-xs text-muted-foreground">{paper.date}</span>
                  <button 
                    onClick={() => setSelectedPaper(paper)}
                    className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-semibold text-primary hover:underline"
                  >
                    Read Paper
                    <ExternalLink className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Dialog open={!!selectedPaper} onOpenChange={() => setSelectedPaper(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto mx-4">
              <DialogHeader>
                <div className="flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider mb-2">
                  <BarChart className="h-3 w-3" />
                  {selectedPaper?.category}
                </div>
                <DialogTitle className="font-display text-xl md:text-2xl lg:text-3xl">{selectedPaper?.title}</DialogTitle>
                <DialogDescription className="text-muted-foreground italic text-sm">
                  Published {selectedPaper?.date}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 md:mt-6 prose prose-slate max-w-none">
                {selectedPaper?.content.split('\n').map((line: string, i: number) => {
                  if (line.trim().startsWith('##')) {
                    return <h3 key={i} className="text-lg md:text-xl font-bold mt-4 md:mt-6 mb-2 md:mb-3 text-foreground">{line.replace('##', '').trim()}</h3>;
                  }
                  if (line.trim().startsWith('-')) {
                    return <li key={i} className="ml-4 mb-1 text-sm text-muted-foreground">{line.replace('-', '').trim()}</li>;
                  }
                  if (line.trim().length > 0) {
                    return <p key={i} className="mb-3 md:mb-4 text-sm text-muted-foreground leading-relaxed">{line.trim()}</p>;
                  }
                  return null;
                })}
              </div>
              <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t flex justify-end">
                <Button onClick={() => setSelectedPaper(null)} size="sm">Close Reader</Button>
              </div>
            </DialogContent>
          </Dialog>


            <div className="mt-10 md:mt-16 rounded-xl md:rounded-2xl bg-primary p-6 md:p-8 lg:p-12 text-white">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
                <div className="text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Informed by Global Standards</h3>
                  <p className="text-sm md:text-base text-primary-foreground/90 mb-4 md:mb-6">
                    Our research and methodology are aligned with industry leaders like the Ellen MacArthur Foundation 
                    and the Global Fashion Agenda.
                  </p>
                  <div className="flex flex-wrap gap-2 md:gap-4 justify-center md:justify-start">
                    <a 
                      href="https://www.ellenmacarthurfoundation.org/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 md:gap-2 rounded-lg bg-white/10 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium hover:bg-white/20 transition-colors"
                    >
                      Ellen MacArthur
                      <ExternalLink className="h-3 w-3 md:h-4 md:w-4" />
                    </a>
                    <a 
                      href="https://globalfashionagenda.org/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 md:gap-2 rounded-lg bg-white/10 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium hover:bg-white/20 transition-colors"
                    >
                      Global Fashion Agenda
                      <ExternalLink className="h-3 w-3 md:h-4 md:w-4" />
                    </a>
                  </div>
                </div>
                <div className="hidden md:flex justify-end">
                  <Globe className="h-24 w-24 lg:h-32 lg:w-32 text-white/20" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
