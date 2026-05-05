"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Activity, Calendar, Users, Rocket, Recycle, Globe, Lightbulb } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

gsap.registerPlugin(ScrollTrigger);

function ImpactHero() {
  const textRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    gsap.fromTo(textRef.current, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );
  }, { scope: textRef });

  return (
    <section className="relative py-8 md:py-12 lg:py-16 flex flex-col items-center justify-center overflow-hidden bg-sand bg-[radial-gradient(circle_at_15%_50%,rgba(226,239,231,1),transparent_50%),radial-gradient(circle_at_85%_30%,rgba(196,223,200,0.5),transparent_50%)]">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[200px] h-[200px] md:w-[350px] md:h-[350px] lg:w-[500px] lg:h-[500px] bg-[rgba(196,223,200,0.4)] rounded-full blur-[80px] -top-[30px] -right-[30px] lg:-top-[80px] lg:-right-[80px]" />
        <div className="absolute w-[150px] h-[150px] md:w-[250px] md:h-[250px] lg:w-[350px] lg:h-[350px] bg-[rgba(62,229,142,0.1)] rounded-full blur-[80px] bottom-0 -left-[30px] lg:-left-[80px]" />
      </div>
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8 text-center" ref={textRef}>
        <h1 
          className="text-4xl md:text-6xl lg:text-8xl font-extrabold mb-6 tracking-tight text-dark-green leading-[1.05]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Our <span className="text-forest">Impact</span>
        </h1>
        <p 
          className="text-xl md:text-2xl lg:text-3xl text-dark-green/80 leading-relaxed max-w-3xl mx-auto font-medium"
        >
          Driving circular innovation through action, education, and community engagement.
        </p>
      </div>
    </section>
  );
}

function ImpactInitiatives() {
  const initiatives = [
    {
      icon: Recycle,
      title: "Textile Recovery Program",
      desc: "Establishing structured collection points and logistics networks to intercept post-consumer textiles before they reach landfills.",
      status: "Active"
    },
    {
      icon: Globe,
      title: "Regional Trade Networks",
      desc: "Building ethical redistribution channels across East Africa to ensure quality second-hand textiles reach the markets that need them most.",
      status: "Active"
    },
    {
      icon: Rocket,
      title: "Material Innovation Lab",
      desc: "R&D focused on mechanical recycling processes to transform non-reusable fibers into industrial insulation and padding.",
      status: "In Development"
    }
  ];

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-4xl font-bold text-dark-green mb-3" style={{ fontFamily: "var(--font-heading)" }}>
              Environmental & Social Initiatives
            </h2>
            <p className="text-base text-text-dark opacity-80">
              Our core operations focused on immediate impact and long-term systemic change in the textile value chain.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {initiatives.map((item, i) => (
            <div key={i} className="group relative bg-sand border border-light-green rounded-[1.5rem] p-6 hover:border-mint transition-all duration-500 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-white text-forest flex items-center justify-center mb-4 shadow-sm group-hover:bg-neon-accent/20 transition-all duration-300">
                <item.icon className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-bold mb-4 uppercase tracking-wider">
                {item.status}
              </div>
              <h3 className="text-2xl font-bold text-dark-green mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                {item.title}
              </h3>
              <p className="text-text-dark leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommunitySection() {
  return (
    <section className="py-8 md:py-12 bg-dark-green/5">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-4xl font-bold text-dark-green" style={{ fontFamily: "var(--font-heading)" }}>
              Community & Education
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-neon-accent/20 flex items-center justify-center text-forest">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-dark-green mb-1">Local Empowerment</h4>
                  <p className="text-text-dark">Creating jobs and training opportunities within local communities for sorting, repair, and logistics.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-neon-accent/20 flex items-center justify-center text-forest">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-dark-green mb-1">Circularity Workshops</h4>
                  <p className="text-text-dark">Educating stakeholders and the public on the importance of textile longevity and circular economy principles.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-neon-accent/20 flex items-center justify-center text-forest">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-dark-green mb-1">Industry Events</h4>
                  <p className="text-text-dark">Participating in and hosting events that drive the conversation forward for sustainable fashion and trade.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[16/9] lg:aspect-square rounded-[2rem] bg-gradient-to-br from-forest to-dark-green overflow-hidden shadow-xl relative group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-40 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                <div className="space-y-3">
                  <Activity className="w-12 h-12 text-neon-accent mx-auto animate-pulse" />
                  <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>Join the Movement</h3>
                  <p className="text-white/80 text-base">We're always looking for passionate individuals and organizations to join our mission.</p>
                </div>
              </div>
            </div>
            {/* Floating stats card */}
            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-white p-4 md:p-6 rounded-2xl shadow-lg border border-light-green max-w-[200px]">
              <p className="text-3xl font-bold text-forest mb-1" style={{ fontFamily: "var(--font-heading)" }}>500+</p>
              <p className="text-text-dark text-sm font-medium leading-tight">Community members engaged this year</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ImpactCTA() {
  return (
    <section className="py-8 md:py-12 bg-[#183D32]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="relative rounded-[2rem] bg-gradient-to-r from-forest/20 to-transparent p-6 md:p-12 border border-white/10 overflow-hidden text-center">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Support Our Impact
            </h2>
            <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
              Whether you're a local community leader, a textile professional, or a sustainability enthusiast, there's a place for you in our circular ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 font-heading font-bold rounded-full bg-neon-accent text-dark-green hover:bg-white transition-all duration-300"
              >
                Volunteer With Us
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 font-heading font-bold rounded-full bg-transparent text-white border-2 border-white/20 hover:border-white transition-all duration-300"
              >
                Request a Workshop
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Impact() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <ImpactHero />
        <ImpactInitiatives />
        <CommunitySection />
        <ImpactCTA />
      </main>
      <Footer />
    </div>
  );
}
