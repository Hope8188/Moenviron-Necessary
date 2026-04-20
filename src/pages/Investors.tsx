"use client";

import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Globe, Recycle, Target, BarChart3, Building2, Mail, Users, Handshake, Wallet, TrendingDown, Leaf } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

function InvestorsHero() {
  return (
    <section className="relative py-8 md:py-12 lg:py-16 flex flex-col items-center justify-center overflow-hidden bg-sand bg-[radial-gradient(circle_at_15%_50%,rgba(226,239,231,1),transparent_50%),radial-gradient(circle_at_85%_30%,rgba(196,223,200,0.5),transparent_50%)]">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[200px] h-[200px] md:w-[350px] md:h-[350px] lg:w-[500px] lg:h-[500px] bg-[rgba(196,223,200,0.4)] rounded-full blur-[80px] -top-[30px] -right-[30px] lg:-top-[80px] lg:-right-[80px]" />
        <div className="absolute w-[150px] h-[150px] md:w-[250px] md:h-[250px] lg:w-[350px] lg:h-[350px] bg-[rgba(62,229,142,0.1)] rounded-full blur-[80px] bottom-0 -left-[30px] lg:-left-[80px]" />
      </div>
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8 text-center">
        <h1 
          className="text-3xl md:text-5xl lg:text-7xl font-extrabold mb-4 tracking-tight text-dark-green leading-[1.05]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Why Invest in <span className="text-forest">Moenviron</span>
        </h1>
        <p 
          className="text-base md:text-lg lg:text-xl text-dark-green/80 leading-relaxed max-w-3xl mx-auto font-medium mb-4"
        >
          Invest in the Future of Circular Textiles
        </p>
        <p className="text-lg md:text-xl text-text-dark/80 max-w-4xl mx-auto font-medium leading-relaxed">
          The global textile sector faces a critical imbalance, creating a clear opportunity to build integrated circular systems.
        </p>
      </div>
    </section>
  );
}

function TheOpportunity() {
  const opportunityItems = [
    { icon: TrendingDown, title: "Rising Consumption", desc: "Rising consumption generates unprecedented waste levels." },
    { icon: Recycle, title: "Underutilized Resources", desc: "Massive untapped value in post-consumer textiles." },
    { icon: Building2, title: "Infrastructure Gap", desc: "Opportunity for new entrants in recycling." },
    { icon: Globe, title: "Regulatory Pressure", desc: "EU regulations accelerating industry shift." },
    { icon: Users, title: "Proven Reuse Markets", desc: "Established, scalable revenue opportunities." },
    { icon: ArrowRight, title: "Growing Demand", desc: "ESG-driven demand across industries." }
  ];

  return (
    <section className="py-8 md:py-10 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-green mb-3" style={{ fontFamily: "var(--font-heading)" }}>
            The Opportunity
          </h2>
          <div className="w-20 h-1.5 bg-neon-accent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunityItems.map((item, idx) => (
            <div key={idx} className="group bg-sand border border-light-green rounded-2xl p-5 text-center shadow-[0_4px_20px_rgba(30,58,47,0.08)] hover:-translate-y-[3px] hover:shadow-[0_15px_30px_rgba(30,58,47,0.1)] hover:border-mint transition-all duration-400">
              <div className="w-14 h-14 rounded-2xl bg-forest/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                <item.icon className="w-7 h-7 text-forest" />
              </div>
              <h3 className="text-xl font-bold text-dark-green mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                {item.title}
              </h3>
              <p className="text-base text-text-dark font-medium opacity-80">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ImpactStats() {
  const items = [
    { value: "73%", label: "textiles to landfill" },
    { value: "$500B", label: "lost annually" },
    { value: "15%", label: "currently recycled" },
    { value: "60%", label: "more clothes bought" }
  ];

  return (
    <section className="py-8 md:py-10 bg-sand">
      <div className="max-w-[1200px] mx-auto">
        <div className="relative bg-[#183D32] bg-[radial-gradient(circle_at_top_right,var(--color-forest),transparent_60%)] rounded-[2rem] p-6 md:p-8 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-forest),transparent_70%)] opacity-30" />
          
          <div className="relative z-10">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                The Scale of Opportunity
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto font-medium">
                Textile waste is one of the world's biggest environmental challenges, and investment opportunities.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {items.map((item, idx) => (
                <div key={idx} className="p-3 bg-white/5 backdrop-blur-sm rounded-xl text-center border border-white/10">
                  <p className="text-2xl md:text-3xl font-bold text-neon-accent mb-1" style={{ fontFamily: "var(--font-heading)" }}>{item.value}</p>
                  <p className="text-white/70 text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyMoenviron() {
  const reasons = [
    {
      id: "01",
      title: "Proven Value Chain",
      content: "Global reuse systems already operate at scale. We are building the next layer: recycling infrastructure."
    },
    {
      id: "02", 
      title: "Scalable Model",
      content: "Short-term: sourcing revenue. Mid-term: structured reuse. Long-term: textile recycling."
    },
    {
      id: "03",
      title: "Market Alignment",
      content: "Aligned with EU regulations, circular economy trends, and second-hand market growth."
    },
    {
      id: "04",
      title: "Africa Growth Market",
      content: "Emerging markets in Africa are key to the global textile value chain."
    }
  ];

  return (
    <section className="py-8 md:py-10 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-green mb-3" style={{ fontFamily: "var(--font-heading)" }}>
            Why Moenviron
          </h2>
          <div className="w-20 h-1.5 bg-neon-accent mx-auto rounded-full" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {reasons.map((reason) => (
            <div key={reason.id} className="flex gap-4 p-5 bg-sand border border-light-green rounded-2xl shadow-[0_4px_20px_rgba(30,58,47,0.08)] hover:-translate-y-[3px] hover:shadow-[0_15px_30px_rgba(30,58,47,0.1)] hover:border-mint transition-all duration-400">
              <div className="w-12 h-12 rounded-xl bg-[#183D32] text-white flex items-center justify-center text-xl font-bold shadow-lg flex-shrink-0" style={{ fontFamily: "var(--font-heading)" }}>
                {reason.id}
              </div>
              <div>
                <h3 className="text-lg font-bold text-dark-green mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  {reason.title}
                </h3>
                <p className="text-base text-text-dark leading-relaxed">
                  {reason.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BusinessModel() {
  const models = [
    { icon: Recycle, title: "Textile Sourcing", text: "Revenue through sourcing and aggregation." },
    { icon: Handshake, title: "Partnership Trade", text: "Partnership-based distribution." },
    { icon: BarChart3, title: "Material Recovery", text: "Recycling revenue in future phase." },
    { icon: Users, title: "B2B Services", text: "Circular supply chain services." }
  ];

  return (
    <section className="py-8 md:py-10 bg-sand">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-green mb-3" style={{ fontFamily: "var(--font-heading)" }}>
            Business Model
          </h2>
          <div className="w-20 h-1.5 bg-neon-accent mx-auto rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {models.map((item, idx) => (
            <div key={idx} className="group bg-white border border-light-green rounded-2xl p-5 text-center shadow-[0_4px_20px_rgba(30,58,47,0.08)] hover:-translate-y-[3px] hover:shadow-[0_15px_30px_rgba(30,58,47,0.1)] hover:border-mint transition-all duration-400">
              <div className="w-14 h-14 rounded-2xl bg-forest/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-forest group-hover:text-white transition-all duration-500">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-dark-green mb-2" style={{ fontFamily: "var(--font-heading)" }}>{item.title}</h3>
              <p className="text-base text-text-dark font-medium opacity-80">
                {item.text}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <p className="text-base text-dark-green font-bold leading-relaxed max-w-3xl mx-auto">
            This diversified model enables both short-term revenue and long-term scalability.
          </p>
        </div>
      </div>
    </section>
  );
}

function MarketTiming() {
  const timingItems = [
    "New regulations on textile waste and exports",
    "Pressure on brands to adopt circular models",
    "Growth of ESG-driven investment",
    "Increasing cost of raw materials",
    "Expansion of second-hand and resale markets"
  ];

  return (
    <section className="py-8 md:py-10 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="relative bg-[#183D32] bg-[radial-gradient(circle_at_top_right,var(--color-forest),transparent_60%)] rounded-[2rem] p-6 md:p-10 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-forest),transparent_70%)] opacity-30" />
          
          <div className="relative z-10">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                Market Timing
              </h2>
              <p className="text-base text-white/70 max-w-2xl mx-auto font-medium">
                Several global shifts make this the right time to invest:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {timingItems.map((text, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-neon-accent/50 transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center flex-shrink-0 group-hover:bg-neon-accent group-hover:scale-110 transition-all">
                    <ArrowRight className="w-5 h-5 text-white group-hover:text-dark-green transition-colors" />
                  </div>
                  <span className="text-base md:text-lg text-white font-medium">{text}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 text-center">
              <p className="text-lg font-bold text-neon-accent" style={{ fontFamily: "var(--font-heading)" }}>
                The market is moving from linear to circular—and infrastructure is missing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CurrentStage() {
  const currentItems = [
    "Building strategic partnerships",
    "Validating supply and demand channels",
    "Structuring scalable operating models",
    "Positioning within international networks"
  ];

  const futureItems = [
    "Textile recovery at scale",
    "Integrated reuse and recycling systems",
    "Cross-border circular trade",
    "Material regeneration into new products"
  ];

  return (
    <section className="py-8 md:py-10 bg-sand">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-dark-green mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Our Current Stage
            </h2>
            <p className="text-base text-text-dark mb-6 opacity-80 leading-relaxed">
              Moenviron is in the pilot and growth development phase, focused on:
            </p>
            <div className="space-y-3">
              {currentItems.map((text, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-mint/30 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-4 h-4 text-forest" />
                  </div>
                  <span className="text-base font-bold text-dark-green">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute w-full h-full bg-neon-accent/10 rounded-[2rem] blur-3xl -z-10" />
            <div className="bg-[#183D32] p-6 md:p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden border border-white/10">
              <h3 className="text-xl font-bold mb-4 text-white" style={{ fontFamily: "var(--font-heading)" }}>What We're Building Toward</h3>
              <p className="text-base text-white/80 font-medium mb-6 leading-relaxed">
                Our long-term objective is to become a circular textile infrastructure company:
              </p>
              <div className="space-y-3">
                {futureItems.map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-neon-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ArrowRight className="w-3 h-3 text-neon-accent" />
                    </div>
                    <span className="text-base font-bold text-white">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InvestmentOpportunity() {
  const opportunities = [
    { icon: Globe, title: "Market Expansion", text: "Growth into new geographic markets" },
    { icon: BarChart3, title: "Operational Growth", text: "Scaling operations and infrastructure" },
    { icon: Target, title: "Tech & Infrastructure", text: "Planning for recycling facilities" },
    { icon: Wallet, title: "Network Growth", text: "Growing partnerships and networks" }
  ];

  return (
    <section className="py-8 md:py-10 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-green mb-3" style={{ fontFamily: "var(--font-heading)" }}>
            Investment Opportunity
          </h2>
          <div className="w-20 h-1.5 bg-neon-accent mx-auto rounded-full" />
          <p className="text-base text-text-dark mt-4 opacity-80">
            We are seeking strategic partners and investors to support:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {opportunities.map((item, idx) => (
            <div key={idx} className="group bg-sand border border-light-green rounded-2xl p-5 text-center shadow-[0_4px_20px_rgba(30,58,47,0.08)] hover:-translate-y-[3px] hover:shadow-[0_15px_30px_rgba(30,58,47,0.1)] hover:border-mint transition-all duration-400">
              <div className="w-14 h-14 rounded-2xl bg-forest/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                <item.icon className="w-6 h-6 text-forest" />
              </div>
              <h3 className="text-lg font-bold text-dark-green mb-2" style={{ fontFamily: "var(--font-heading)" }}>{item.title}</h3>
              <p className="text-base text-text-dark font-medium opacity-80">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InvestorsCTA() {
  return (
    <section className="py-8 md:py-10 bg-[#183D32] bg-[radial-gradient(circle_at_top_right,var(--color-forest),transparent_60%)]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="relative rounded-[2rem] p-6 md:p-10 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--color-forest),transparent_70%)] opacity-50" />
          <div className="absolute w-[300px] h-[300px] rounded-full blur-[100px] bg-neon-accent/10 bottom-0 right-0" />

          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>
              Partner With Us
            </h2>
            <p className="text-lg md:text-xl text-white/80 mb-5 max-w-3xl mx-auto font-medium leading-relaxed">
              Moenviron offers a unique opportunity to participate in the transformation of one of the world's most resource-intensive industries.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link to="/contact" className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 font-heading font-semibold rounded-full bg-neon-accent text-dark-green shadow-[0_4px_20px_rgba(62,229,142,0.3)] hover:bg-white hover:text-dark-green hover:shadow-[0_8px_30px_rgba(62,229,142,0.5)] hover:-translate-y-1 transition-all duration-300">
                Request Deck
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <a href="mailto:investors@moenviron.com" className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 font-heading font-semibold rounded-full bg-transparent text-white border-2 border-white/30 hover:bg-white/10 hover:border-white transition-all duration-300">
                Email Us
                <Mail className="w-5 h-5 ml-2 text-neon-accent" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Investors() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <InvestorsHero />
        <TheOpportunity />
        <ImpactStats />
        <WhyMoenviron />
        <BusinessModel />
        <MarketTiming />
        <CurrentStage />
        <InvestmentOpportunity />
        <InvestorsCTA />
      </main>
      <Footer />
    </div>
  );
}