"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, TrendingUp, Globe, Recycle, Target, BarChart3, Clock, Building2, Mail, Users, Handshake, Wallet } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function Investor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Background shapes floating animation
    gsap.to(".bg-shape-1", {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    gsap.to(".bg-shape-2", {
      y: 20,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.5
    });

    // Text entrance animation
    gsap.fromTo(textRef.current, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );

    gsap.utils.toArray<HTMLElement>(".investor-section").forEach((section) => {
      gsap.fromTo(section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    gsap.fromTo(".metric-card",
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".metrics-grid",
          start: "top 80%"
        }
      }
    );
  }, { scope: containerRef });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div ref={containerRef} className="bg-sand bg-[radial-gradient(circle_at_15%_50%,rgba(226,239,231,1),transparent_50%),radial-gradient(circle_at_85%_30%,rgba(196,223,200,0.5),transparent_50%)] pt-20 overflow-hidden">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative py-20 md:py-28 lg:py-32 flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Background Shapes */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="bg-shape-1 absolute w-[200px] h-[200px] md:w-[350px] md:h-[350px] lg:w-[500px] lg:h-[500px] bg-[rgba(196,223,200,0.4)] rounded-full blur-[80px] -top-[30px] -right-[30px] lg:-top-[80px] lg:-right-[80px]" />
          <div className="bg-shape-2 absolute w-[150px] h-[150px] md:w-[250px] md:h-[250px] lg:w-[350px] lg:h-[350px] bg-[rgba(62,229,142,0.1)] rounded-full blur-[80px] bottom-0 -left-[30px] lg:-left-[80px]" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8 text-center" ref={textRef}>
          <h1 
            className="text-3xl md:text-5xl lg:text-7xl font-extrabold mb-6 tracking-tight text-dark-green leading-[1.05]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Why Invest in <span className="text-forest">Moenviron</span>
          </h1>
          <p 
            className="text-base md:text-lg lg:text-xl text-dark-green/80 leading-relaxed max-w-3xl mx-auto font-medium mb-8"
          >
            Invest in the Future of Circular Textiles
          </p>
          <div className="w-24 h-1.5 bg-neon-accent mx-auto rounded-full" />
        </div>
      </section>

      {/* The Opportunity */}
      <section className="investor-section py-24 px-6 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-green mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              The Opportunity
            </h2>
            <p className="text-xl text-text-dark font-medium leading-relaxed">
              The global textile sector faces a critical imbalance, creating a clear opportunity to build integrated circular systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 metrics-grid">
            {[
              { icon: TrendingUp, title: "Rising Consumption", desc: "Rising consumption is generating unprecedented levels of waste, creating urgency for circular solutions." },
              { icon: Recycle, title: "Underutilized Resources", desc: "The majority of post-consumer textiles are still underutilized, representing massive untapped value." },
              { icon: Building2, title: "Infrastructure Gap", desc: "Recycling infrastructure remains limited and fragmented, creating opportunity for new entrants." },
              { icon: Globe, title: "Regulatory Pressure", desc: "Regulatory pressure especially in Europe, is accelerating industry transformation." },
              { icon: Users, title: "Proven Reuse Markets", desc: "Reuse markets are already established and scalable, providing immediate revenue opportunities." },
              { icon: ArrowRight, title: "Growing Demand", desc: "Demand for circular solutions is growing across industries, driven by ESG requirements." }
            ].map((item, idx) => (
              <div key={idx} className="metric-card group bg-white border border-light-green rounded-3xl p-8 md:p-10 text-center shadow-[0_4px_20px_rgba(30,58,47,0.08)] hover:-translate-y-[5px] hover:shadow-[0_15px_30px_rgba(30,58,47,0.1)] hover:border-mint transition-all duration-400">
                <div className="w-16 h-16 rounded-2xl bg-forest/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <item.icon className="w-8 h-8 text-forest" />
                </div>
                <h3 className="text-2xl font-bold text-dark-green mb-4" style={{ fontFamily: "var(--font-heading)" }}>{item.title}</h3>
                <p className="text-lg text-text-dark font-medium opacity-80 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Moenviron */}
      <section className="investor-section py-16 md:py-20 lg:py-24 px-6 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark-green mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              Why Moenviron
            </h2>
            <div className="w-24 h-1.5 bg-neon-accent mx-auto rounded-full" />
          </div>
          
          <div className="space-y-12">
            {[
              {
                id: 1,
                title: "Positioned in a Proven Value Chain",
                content: "Global textile reuse systems already exist and operate at scale-driven by structured sorting, grading, and redistribution. Moenviron is strategically positioning itself within this system while building the next layer: recycling and material recovery."
              },
              {
                id: 2,
                title: "Phased, Scalable Model",
                content: "Our approach reduces risk and enables growth:",
                subItems: [
                  { label: "Short-term", text: "Revenue through sourcing, aggregation, and partnerships" },
                  { label: "Mid-term", text: "Expansion into structured reuse and trade facilitation" },
                  { label: "Long-term", text: "Textile recycling and material processing infrastructure" }
                ]
              },
              {
                id: 3,
                title: "Strong Market Alignment",
                content: "Moenviron aligns with global circular economy trends, EU textile and waste regulations, increasing demand for traceability and sustainability, and the growth of second-hand and resale markets."
              },
              {
                id: 4,
                title: "Africa as a Strategic Growth Market",
                content: "Emerging markets particularly in Africa are already key to the global textile value chain:",
                highlights: [
                  "High demand for second-hand clothing",
                  "Established trade systems",
                  "Strong price-value dynamics",
                  "Large, growing consumer base"
                ]
              }
            ].map((point) => (
              <div key={point.id} className="group bg-white border border-light-green rounded-3xl p-8 md:p-10 shadow-[0_4px_20px_rgba(30,58,47,0.08)] hover:-translate-y-[5px] hover:shadow-[0_15px_30px_rgba(30,58,47,0.1)] hover:border-mint transition-all duration-400">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#183D32] text-white flex items-center justify-center text-2xl md:text-3xl font-bold shadow-lg group-hover:scale-105 transition-transform duration-300" style={{ fontFamily: "var(--font-heading)" }}>
                      {point.id}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl md:text-2xl font-bold text-dark-green mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                      {point.title}
                    </h3>
                    <p className="text-base md:text-lg text-text-dark font-medium leading-relaxed opacity-80 mb-6">
                      {point.content}
                    </p>
                    {point.subItems && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {point.subItems.map((item, i) => (
                          <div key={i} className="bg-light-green/30 rounded-2xl p-4 md:p-6 border border-light-green/50">
                            <p className="text-sm font-bold text-forest uppercase tracking-wider mb-2">{item.label}</p>
                            <p className="text-text-dark font-medium">{item.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {point.highlights && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {point.highlights.map((highlight, i) => (
                          <div key={i} className="flex items-center gap-3 bg-light-green/30 p-3 rounded-xl">
                            <ArrowRight className="w-4 h-4 text-neon-accent flex-shrink-0" />
                            <span className="text-text-dark font-medium text-sm md:text-base">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Model */}
      <section className="investor-section py-24 px-6 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark-green mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              Business Model
            </h2>
            <div className="w-24 h-1.5 bg-neon-accent mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Recycle, title: "Textile Sourcing", text: "Revenue through textile sourcing and aggregation from multiple waste streams." },
              { icon: Handshake, title: "Partnership Trade", text: "Partnership-based trade and distribution through established networks." },
              { icon: BarChart3, title: "Material Recovery", text: "Material recovery and recycling revenue in future phase." },
              { icon: Users, title: "B2B Services", text: "Circular supply chain services for B2B clients." }
            ].map((item, idx) => (
              <div key={idx} className="group bg-white/40 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-mint/30 text-center">
                <div className="w-16 h-16 rounded-2xl bg-forest/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-forest group-hover:text-white transition-all duration-500">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-dark-green mb-4" style={{ fontFamily: "var(--font-heading)" }}>{item.title}</h3>
                <p className="text-lg text-text-dark font-medium leading-relaxed opacity-80">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <p className="text-2xl text-dark-green font-bold leading-relaxed max-w-3xl mx-auto">
              This diversified model enables both short-term revenue and long-term scalability.
            </p>
          </div>
        </div>
      </section>

      {/* Market Timing */}
      <section className="investor-section py-24 px-6 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="relative bg-[#183D32] bg-[radial-gradient(circle_at_top_right,var(--color-forest),transparent_60%)] rounded-[3rem] p-12 md:p-20 overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-forest),transparent_70%)] opacity-30" />
            
            <div className="relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                  Market Timing
                </h2>
                <p className="text-xl text-white/70 max-w-2xl mx-auto font-medium">
                  Several global shifts make this the right time to invest:
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  "New regulations on textile waste and exports",
                  "Pressure on brands to adopt circular models",
                  "Growth of ESG-driven investment",
                  "Increasing cost of raw materials",
                  "Expansion of second-hand and resale markets"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-6 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-neon-accent/50 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-full bg-forest flex items-center justify-center flex-shrink-0 group-hover:bg-neon-accent group-hover:scale-110 transition-all">
                      <ArrowRight className="w-6 h-6 text-white group-hover:text-dark-green transition-colors" />
                    </div>
                    <span className="text-lg md:text-xl text-white font-medium">{text}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-16 p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-center">
                <p className="text-2xl font-bold text-neon-accent" style={{ fontFamily: "var(--font-heading)" }}>
                  The market is moving from linear to circular and infrastructure is missing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Stage */}
      <section className="investor-section py-16 md:py-20 lg:py-24 px-6 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark-green mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                Our Current Stage
              </h2>
              <p className="text-lg text-text-dark font-medium mb-8 opacity-80 leading-relaxed">
                Moenviron is in the pilot and growth development phase, focused on:
              </p>
              <div className="space-y-4">
                {[
                  "Building strategic partnerships",
                  "Validating supply and demand channels",
                  "Structuring scalable operating models",
                  "Positioning within international networks"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white border border-light-green rounded-2xl shadow-sm hover:shadow-md hover:border-mint transition-all duration-300">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-light-green flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-forest" />
                    </div>
                    <span className="text-base md:text-lg font-bold text-dark-green" style={{ fontFamily: "var(--font-heading)" }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute w-full h-full bg-neon-accent/10 rounded-[3rem] blur-3xl -z-10" />
              <div className="bg-[#183D32] bg-[radial-gradient(circle_at_top_right,var(--color-forest),transparent_60%)] p-8 md:p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden border border-white/10">
                <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-[radial-gradient(circle_at_top_right,var(--color-forest),transparent_70%)] opacity-50" />
                
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)" }}>What We're Building Toward</h3>
                <p className="text-base md:text-lg text-white/80 font-medium mb-8 leading-relaxed">
                  Our long-term objective is to become a circular textile infrastructure company, enabling:
                </p>
                <div className="space-y-4">
                  {[
                    "Textile recovery at scale",
                    "Integrated reuse and recycling systems",
                    "Cross-border circular trade",
                    "Material regeneration into new products"
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-neon-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-neon-accent" />
                      </div>
                      <span className="text-base md:text-lg font-bold">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Opportunity Opportunity */}
      <section className="investor-section py-24 px-6 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-dark-green mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              Investment Opportunity
            </h2>
            <div className="w-24 h-1.5 bg-neon-accent mx-auto rounded-full" />
            <p className="text-xl text-text-dark font-medium mt-8 opacity-80">
              We are seeking strategic partners and investors to support:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Globe, title: "Market Expansion", text: "Growth into new geographic markets and segments" },
              { icon: BarChart3, title: "Operational Growth", text: "Scaling operations and infrastructure" },
              { icon: Target, title: "Tech & Infrastructure", text: "Planning for recycling and processing facilities" },
              { icon: Wallet, title: "Network Growth", text: "Growing partnerships and stakeholder networks" }
            ].map((item, idx) => (
              <div key={idx} className="group bg-white/40 backdrop-blur-md rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-mint/30">
                <div className="w-14 h-14 rounded-2xl bg-forest/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <item.icon className="w-6 h-6 text-forest" />
                </div>
                <h3 className="text-xl font-bold text-dark-green mb-3" style={{ fontFamily: "var(--font-heading)" }}>{item.title}</h3>
                <p className="text-lg text-text-dark font-medium opacity-80">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="investor-section py-16 md:py-20 lg:py-24 relative z-10 mb-20 px-4">
        <div className="max-w-[1200px] mx-auto relative bg-[#183D32] bg-[radial-gradient(circle_at_top_right,var(--color-forest),transparent_60%)] rounded-[3rem] p-12 md:p-20 text-center overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--color-forest),transparent_70%)] opacity-50" />
          <div className="absolute w-[600px] h-[600px] rounded-full blur-[120px] bg-neon-accent/10 bottom-0 right-0 -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-8 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Partner With Us
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-white/80 mb-12 max-w-4xl mx-auto font-medium leading-relaxed">
              Moenviron offers a unique opportunity to participate in the transformation of one of the world's most resource-intensive industries.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <button className="w-full sm:w-auto inline-flex items-center justify-center px-12 py-6 font-heading font-extrabold text-2xl rounded-2xl bg-neon-accent text-dark-green shadow-[0_4px_30px_rgba(62,229,142,0.4)] hover:bg-white hover:text-dark-green hover:shadow-[0_8px_50px_rgba(62,229,142,0.6)] hover:-translate-y-1 transition-all duration-300">
                Request Deck
                <ArrowRight className="w-6 h-6 ml-3" />
              </button>
              <button className="w-full sm:w-auto inline-flex items-center justify-center px-12 py-6 font-heading font-extrabold text-2xl rounded-2xl bg-transparent text-white border-2 border-white/30 hover:bg-white/10 hover:border-white transition-all duration-300">
                Email Us
                <Mail className="w-6 h-6 ml-3 text-neon-accent" />
              </button>
            </div>
          </div>
        </div>
      </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

