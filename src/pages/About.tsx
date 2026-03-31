"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Globe, Leaf, Recycle, TrendingUp, Users, Handshake, Target } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
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

    gsap.utils.toArray<HTMLElement>(".about-section").forEach((section, i) => {
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
            About Moenviron
          </h1>
          <p 
            className="text-lg md:text-xl lg:text-2xl text-dark-green/80 leading-relaxed max-w-3xl mx-auto font-medium"
          >
            Redefining Textile Waste into Circular Value for a Sustainable Future
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="about-section py-16 md:py-24 relative z-10">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xl md:text-2xl text-text-dark leading-relaxed font-medium">
              Moenviron is a circular economy company focused on transforming textile waste into structured, scalable value. 
              We operate at the intersection of sustainability, global trade, and material innovation—developing solutions 
              that extend the life of textiles today while building the systems required for full circularity tomorrow.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="about-section py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-white border border-light-green rounded-3xl p-8 md:p-10 text-center shadow-[0_4px_20px_rgba(30,58,47,0.08)] hover:-translate-y-[5px] hover:shadow-[0_15px_30px_rgba(30,58,47,0.1)] hover:border-mint transition-all duration-400 group">
              <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-5 bg-light-green text-forest rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:bg-neon-accent/20">
                <Target className="w-7 h-7 md:w-8 md:h-8" strokeWidth={1.5} />
              </div>
              <h3 
                className="text-2xl md:text-3xl font-bold mb-6 text-dark-green"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Our Vision
              </h3>
              <p className="text-lg text-text-dark leading-relaxed">
                To become a leading circular textile infrastructure company connecting global supply chains with emerging markets, 
                enabling textiles to be reused, recycled, and continuously reintegrated into the economy.
              </p>
            </div>
            <div className="bg-white border border-light-green rounded-3xl p-8 md:p-10 text-center shadow-[0_4px_20px_rgba(30,58,47,0.08)] hover:-translate-y-[5px] hover:shadow-[0_15px_30px_rgba(30,58,47,0.1)] hover:border-mint transition-all duration-400 group">
              <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-5 bg-neon-accent/20 text-forest rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:bg-neon-accent/30">
                <Leaf className="w-7 h-7 md:w-8 md:h-8" strokeWidth={1.5} />
              </div>
              <h3 
                className="text-2xl md:text-3xl font-bold mb-6 text-dark-green"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Our Mission
              </h3>
              <div className="space-y-4">
                <p className="text-lg text-text-dark leading-relaxed">
                  To reduce textile waste and unlock its value by:
                </p>
                <ul className="space-y-4 text-text-dark">
                  <li className="flex items-start gap-4">
                    <div className="mt-1.5 w-5 h-5 rounded-full bg-forest/20 flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="w-3 h-3 text-forest" />
                    </div>
                    <span className="text-lg">Enabling efficient recovery of post-consumer textiles</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-1.5 w-5 h-5 rounded-full bg-forest/20 flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="w-3 h-3 text-forest" />
                    </div>
                    <span className="text-lg">Supporting reuse through structured second-hand markets</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-1.5 w-5 h-5 rounded-full bg-forest/20 flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="w-3 h-3 text-forest" />
                    </div>
                    <span className="text-lg">Developing scalable pathways for textile-to-textile recycling</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Opportunity */}
      <section className="about-section py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="max-w-3xl mb-16">
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-dark-green"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              The Opportunity We See
            </h2>
            <p className="text-xl text-text-dark leading-relaxed opacity-90">
              The global textile industry is undergoing a structural shift. Rising consumption, increasing waste, and tightening 
              environmental regulations, particularly across Europe, are accelerating the need for circular solutions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 md:p-10 rounded-3xl bg-white border border-light-green hover:border-mint transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-light-green text-forest flex items-center justify-center mb-6 group-hover:bg-neon-accent/20 transition-all duration-300">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="text-xl font-bold text-dark-green mb-4">Market Gap</h3>
              <p className="text-text-dark leading-relaxed">
                Large volumes of reusable textiles remain underutilized despite growing demand for affordable clothing in emerging markets.
              </p>
            </div>
            <div className="p-8 md:p-10 rounded-3xl bg-white border border-light-green hover:border-mint transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-light-green text-forest flex items-center justify-center mb-6 group-hover:bg-neon-accent/20 transition-all duration-300">
                <Globe className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="text-xl font-bold text-dark-green mb-4">Growing Demand</h3>
              <p className="text-text-dark leading-relaxed">
                Demand for affordable clothing continues to grow in emerging markets, creating opportunities for structured redistribution.
              </p>
            </div>
            <div className="p-8 md:p-10 rounded-3xl bg-white border border-light-green hover:border-mint transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-light-green text-forest flex items-center justify-center mb-6 group-hover:bg-neon-accent/20 transition-all duration-300">
                <Recycle className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="text-xl font-bold text-dark-green mb-4">Infrastructure Need</h3>
              <p className="text-text-dark leading-relaxed">
                Recycling infrastructure for textiles is still limited and fragmented, presenting a significant opportunity for innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="about-section py-16 md:py-24 bg-dark-green/5">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-16 text-dark-green text-center"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Our Approach
          </h2>
          
          <div className="space-y-10 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 p-8 md:p-10 bg-white border border-light-green rounded-3xl shadow-[0_4px_20px_rgba(30,58,47,0.08)] group hover:-translate-y-[5px] hover:shadow-[0_15px_30px_rgba(30,58,47,0.1)] hover:border-mint transition-all duration-400">
              <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#183D32] text-white flex items-center justify-center text-2xl md:text-3xl font-bold shadow-lg" style={{ fontFamily: "var(--font-heading)" }}>
                01
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-dark-green" style={{ fontFamily: "var(--font-heading)" }}>
                  Recovery & Sourcing
                </h3>
                <p className="text-base md:text-lg text-text-dark leading-relaxed">
                  We collaborate with partners to channel post-consumer textiles into organized value streams, ensuring materials 
                  are not lost to landfill or incineration.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 md:gap-12 p-8 md:p-10 bg-white border border-light-green rounded-3xl shadow-[0_4px_20px_rgba(30,58,47,0.08)] group hover:-translate-y-[5px] hover:shadow-[0_15px_30px_rgba(30,58,47,0.1)] hover:border-mint transition-all duration-400">
              <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#183D32] text-white flex items-center justify-center text-2xl md:text-3xl font-bold shadow-lg" style={{ fontFamily: "var(--font-heading)" }}>
                02
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-dark-green" style={{ fontFamily: "var(--font-heading)" }}>
                  Reuse & Redistribution
                </h3>
                <p className="text-base md:text-lg text-text-dark leading-relaxed">
                  We align with established second-hand ecosystems to extend garment life, supporting markets where demand, 
                  quality control, and economic value already exist.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 md:gap-12 p-8 md:p-10 bg-white border border-light-green rounded-3xl shadow-[0_4px_20px_rgba(30,58,47,0.08)] group hover:-translate-y-[5px] hover:shadow-[0_15px_30px_rgba(30,58,47,0.1)] hover:border-mint transition-all duration-400">
              <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#183D32] text-white flex items-center justify-center text-2xl md:text-3xl font-bold shadow-lg" style={{ fontFamily: "var(--font-heading)" }}>
                03
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-dark-green" style={{ fontFamily: "var(--font-heading)" }}>
                  Circular Processing <span className="text-base font-normal text-forest">(Next Phase)</span>
                </h3>
                <p className="text-lg text-text-dark leading-relaxed">
                  We are developing pathways for textile recycling and material recovery, enabling non-reusable textiles 
                  to be transformed into new raw materials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="about-section py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 
                className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-dark-green"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Why This Matters
              </h2>
              <div className="space-y-6">
                <p className="text-lg text-text-dark leading-relaxed">
                  Extending the life of textiles is one of the most effective ways to reduce environmental impact. 
                  Reuse significantly lowers emissions, reduces resource consumption, and creates economic opportunities 
                  across the value chain.
                </p>
                <p className="text-lg text-text-dark leading-relaxed">
                  At the same time, building recycling capacity is essential to address textiles that have reached end-of-life. 
                  Moenviron's model integrates both—ensuring no value is lost.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute w-[400px] h-[400px] rounded-full blur-[100px] bg-neon-accent/15 -top-20 -right-20" />
              <div className="relative bg-[#183D32] bg-[radial-gradient(circle_at_top_right,var(--color-forest),transparent_60%)] p-10 md:p-12 rounded-[2.5rem] text-white shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-forest/20 to-transparent" />
                <h3 className="text-2xl font-bold mb-10 relative z-10" style={{ fontFamily: "var(--font-heading)" }}>Impact at a Glance</h3>
                <div className="grid grid-cols-2 gap-10 relative z-10">
                  <div>
                    <p className="text-4xl md:text-5xl font-bold text-neon-accent mb-2" style={{ fontFamily: "var(--font-heading)" }}>70%</p>
                    <p className="text-white/70 text-base">less emissions from reuse</p>
                  </div>
                  <div>
                    <p className="text-4xl md:text-5xl font-bold text-neon-accent mb-2" style={{ fontFamily: "var(--font-heading)" }}>3x</p>
                    <p className="text-white/70 text-base">more value retained</p>
                  </div>
                  <div>
                    <p className="text-4xl md:text-5xl font-bold text-neon-accent mb-2" style={{ fontFamily: "var(--font-heading)" }}>90%</p>
                    <p className="text-white/70 text-base">water saved vs new textiles</p>
                  </div>
                  <div>
                    <p className="text-4xl md:text-5xl font-bold text-neon-accent mb-2" style={{ fontFamily: "var(--font-heading)" }}>∞</p>
                    <p className="text-white/70 text-base">circular potential</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="about-section py-16 md:py-20 lg:py-24 mb-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="relative bg-[#183D32] bg-[radial-gradient(circle_at_top_right,var(--color-forest),transparent_60%)] rounded-[3rem] p-12 md:p-20 text-center overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--color-forest),transparent_70%)] opacity-50" />
            <div className="absolute w-[400px] h-[400px] rounded-full blur-[100px] bg-neon-accent/10 bottom-0 right-0" />
            
            <div className="relative z-10">
              <h2 
                className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Join Us
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
                We are actively seeking partners, collaborators, and investors who share our vision for a circular textile future.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-6">
                <a
                  href="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 font-heading font-semibold rounded-full bg-neon-accent text-dark-green shadow-[0_4px_20px_rgba(62,229,142,0.3)] hover:bg-white hover:text-dark-green hover:shadow-[0_8px_30px_rgba(62,229,142,0.5)] hover:-translate-y-1 transition-all duration-300"
                >
                  Partner With Us
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
                <a
                  href="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 font-heading font-semibold rounded-full bg-transparent text-white border-2 border-white/30 hover:bg-white/10 hover:border-white transition-all duration-300"
                >
                  Explore Opportunities
                </a>
              </div>
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
