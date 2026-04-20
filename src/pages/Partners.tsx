"use client";

import { Link } from "react-router-dom";
import { ArrowRight, Package, Truck, ShoppingBag, Factory, Network, Handshake, Globe2, Leaf } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

function PartnersHero() {
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
          Work With <span className="text-forest">Moenviron</span>
        </h1>
        <p 
          className="text-base md:text-lg lg:text-xl text-dark-green/80 leading-relaxed max-w-3xl mx-auto font-medium mb-4"
        >
          Building Circular Systems Together
        </p>
        <p className="text-lg md:text-xl text-text-dark/80 max-w-4xl mx-auto font-medium leading-relaxed">
          Circularity in textiles cannot be achieved by a single organization. 
          Moenviron works with partners across the value chain to create systems that are connected, scalable, and economically viable.
        </p>
      </div>
    </section>
  );
}

function WhoWeWorkWith() {
  const partnerCategories = [
    {
      id: "collection",
      icon: Package,
      title: "Textile Collection",
      description: "We partner with organizations managing post-consumer textiles.",
      collaborations: ["Streamlining textile flows", "Connecting materials to reuse markets", "Improving value recovery"]
    },
    {
      id: "exporters",
      icon: Truck,
      title: "Exporters & Traders",
      description: "We work with established players in the second-hand textile trade.",
      collaborations: ["Aligning supply with demand", "Enhancing quality-based distribution", "Expanding market access"]
    },
    {
      id: "fashion",
      icon: ShoppingBag,
      title: "Fashion Brands",
      description: "We support brands transitioning toward circular models.",
      collaborations: ["Circular strategy development", "Textile recovery programs", "Supply chain integration"]
    },
    {
      id: "recycling",
      icon: Factory,
      title: "Recycling Partners",
      description: "We engage with organizations developing textile recycling technologies.",
      collaborations: ["Feedstock sourcing", "Pilot collaborations", "Infrastructure development"]
    },
    {
      id: "ecosystem",
      icon: Network,
      title: "Ecosystem Partners",
      description: "We connect with networks shaping the circular economy.",
      collaborations: ["Cross-border initiatives", "Research and pilot programs", "Market development"]
    }
  ];

  return (
    <section className="py-8 md:py-10 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-green mb-3" style={{ fontFamily: "var(--font-heading)" }}>
            Who We Work With
          </h2>
          <div className="w-20 h-1.5 bg-neon-accent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {partnerCategories.map((partner) => (
            <div key={partner.id} className="group bg-sand border border-light-green rounded-2xl p-5 text-center shadow-[0_4px_20px_rgba(30,58,47,0.08)] hover:-translate-y-[3px] hover:shadow-[0_15px_30px_rgba(30,58,47,0.1)] hover:border-mint transition-all duration-400">
              <div className="w-14 h-14 rounded-2xl bg-forest/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                <partner.icon className="w-7 h-7 text-forest" />
              </div>
              <h3 className="text-xl font-bold text-dark-green mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                {partner.title}
              </h3>
              <p className="text-base text-text-dark mb-3 font-medium opacity-80">
                {partner.description}
              </p>
              <div className="border-t border-forest/10 pt-3">
                <p className="text-xs font-bold text-forest uppercase tracking-wider mb-2">How we collaborate:</p>
                <ul className="space-y-1.5">
                  {partner.collaborations.map((collab, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-dark font-medium">
                      <ArrowRight className="w-4 h-4 text-neon-accent mt-0.5 flex-shrink-0" />
                      {collab}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnershipOpportunities() {
  const opportunities = [
    "Textile sourcing and aggregation",
    "Reuse market expansion",
    "Circular supply chain development",
    "Recycling and material innovation",
    "Market entry and regional expansion"
  ];

  return (
    <section className="py-8 md:py-10 bg-sand">
      <div className="max-w-[1200px] mx-auto">
        <div className="relative bg-[#183D32] bg-[radial-gradient(circle_at_top_right,var(--color-forest),transparent_60%)] rounded-[2rem] p-6 md:p-8 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-forest),transparent_70%)] opacity-30" />
          
          <div className="relative z-10">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                Partnership Opportunities
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto font-medium">
                We are actively seeking partners in the following areas:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {opportunities.map((opp, index) => (
                <div key={index} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-neon-accent/50 transition-all duration-300 group">
                  <div className="w-8 h-8 rounded-full bg-forest flex items-center justify-center flex-shrink-0 group-hover:bg-neon-accent group-hover:scale-110 transition-all">
                    <span className="text-white group-hover:text-dark-green font-bold text-sm">{index + 1}</span>
                  </div>
                  <span className="text-base md:text-lg text-white font-medium">{opp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowWeWork() {
  const partnershipValues = [
    "Mutual value creation",
    "Clear commercial alignment",
    "Scalable collaboration structures",
    "Long-term ecosystem thinking"
  ];

  return (
    <section className="py-8 md:py-10 bg-white">
      <div className="max-w-[1000px] mx-auto px-4 md:px-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-green mb-3" style={{ fontFamily: "var(--font-heading)" }}>
            How We Work
          </h2>
          <div className="w-20 h-1.5 bg-neon-accent mx-auto rounded-full" />
        </div>

        <div className="bg-sand/60 backdrop-blur-md rounded-[2rem] p-5 md:p-8 shadow-lg border border-mint/30">
          <p className="text-center text-lg text-text-dark mb-5 font-medium">
            Our partnership model is built on shared vision and structural alignment:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {partnershipValues.map((value, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-forest/5 rounded-xl border border-forest/10 hover:bg-forest/10 transition-all duration-300">
                <div className="w-8 h-8 rounded-full bg-neon-accent/20 flex items-center justify-center flex-shrink-0">
                  <Handshake className="w-4 h-4 text-forest" />
                </div>
                <span className="text-base font-bold text-dark-green" style={{ fontFamily: "var(--font-heading)" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyPartner() {
  const benefits = [
    {
      title: "Access to emerging circular markets",
      description: "Be part of growing markets for post-consumer textiles and recycled materials."
    },
    {
      title: "Integration into structured value chains",
      description: "Connect with organized channels that maximize material value and efficiency."
    },
    {
      title: "Strategic positioning",
      description: "Establish your brand at the forefront of textile circularity."
    },
    {
      title: "Forward-looking platform",
      description: "Work with a partner committed to long-term industry transformation."
    }
  ];

  return (
    <section className="py-8 md:py-10 bg-sand">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-green mb-3" style={{ fontFamily: "var(--font-heading)" }}>
            Why Partner With Moenviron
          </h2>
          <div className="w-20 h-1.5 bg-neon-accent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="group bg-white/40 backdrop-blur-md rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-500 border border-mint/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-forest/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                  <Leaf className="w-6 h-6 text-forest" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-dark-green mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                    {benefit.title}
                  </h3>
                  <p className="text-base text-text-dark font-medium opacity-80 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnersCTA() {
  return (
    <section className="py-8 md:py-10 bg-[#183D32] bg-[radial-gradient(circle_at_top_right,var(--color-forest),transparent_60%)]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="relative rounded-[2rem] p-6 md:p-10 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--color-forest),transparent_70%)] opacity-50" />
          <div className="absolute w-[300px] h-[300px] rounded-full blur-[100px] bg-neon-accent/10 bottom-0 right-0" />

          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>
              Start a Partnership
            </h2>
            <p className="text-lg md:text-xl text-white/80 mb-5 max-w-3xl mx-auto font-medium leading-relaxed">
              We are building a global network of partners committed to transforming the textile industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link to="/contact" className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 font-heading font-semibold rounded-full bg-neon-accent text-dark-green shadow-[0_4px_20px_rgba(62,229,142,0.3)] hover:bg-white hover:text-dark-green hover:shadow-[0_8px_30px_rgba(62,229,142,0.5)] hover:-translate-y-1 transition-all duration-300">
                Become a Partner
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <a href="mailto:partners@moenviron.com" className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 font-heading font-semibold rounded-full bg-transparent text-white border-2 border-white/30 hover:bg-white/10 hover:border-white transition-all duration-300">
                Schedule a Call
                <Globe2 className="w-5 h-5 ml-2 text-neon-accent" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Partnership() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <PartnersHero />
        <WhoWeWorkWith />
        <PartnershipOpportunities />
        <HowWeWork />
        <WhyPartner />
        <PartnersCTA />
      </main>
      <Footer />
    </div>
  );
}