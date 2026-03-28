"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    num: "01",
    title: "Textile Recovery & Sourcing",
    body: "We work with partners to channel post-consumer textile waste into structured value streams.",
    image: "/demand.jpg",
    imageAlt: "Textile recovery and sourcing",
    description: "Our collection network partners with retailers, manufacturers, and community drop-off points to gather post-consumer textiles before they reach landfill. Each kilogram represents raw materials, water, and energy that can be recovered."
  },
  {
    num: "02",
    title: "Reuse & Redistribution",
    body: "By aligning with existing second-hand markets, we extend the life of garments and unlock immediate economic value.",
    image: "/reuse.jpg",
    imageAlt: "Reuse and redistribution",
    description: "Quality garments are sorted and redirected to second-hand markets in Africa and emerging economies. This creates jobs, provides affordable clothing, and keeps textiles in use for years longer than traditional disposal methods."
  },
  {
    num: "03",
    title: "Circular Processing (Next Phase)",
    body: "We are developing scalable pathways for textile recycling and material recovery to close the loop.",
    image: "/waste.jpg",
    imageAlt: "Circular processing",
    description: "Non-reusable textiles undergo mechanical or chemical recycling to create new raw materials. These feed back into the textile industry, reducing the need for virgin resources and closing the circular economy loop."
  },
];

export default function Solution() {
  const ref = useRef<HTMLDivElement>(null);
  const [selectedPillar, setSelectedPillar] = useState<number | null>(null);

  useGSAP(() => {
    // Header animation
    gsap.fromTo(".solution-header", 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          once: true
        }
      }
    );

    // Cards with enhanced animation
    gsap.fromTo(".solution-card", 
      { opacity: 0, y: 50, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".solution-cards",
          start: "top 80%",
          once: true
        }
      }
    );

    // Glow background pulse
    const glow = ref.current?.querySelector(".solution-glow");
    if (glow) {
      gsap.to(glow, {
        scale: 1.1,
        opacity: 0.3,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

    // Card hover animations
    const cards = gsap.utils.toArray(".solution-card") as HTMLElement[];
    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, { scale: 1.02, y: -5, duration: 0.3, ease: "power2.out" });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { scale: 1, y: 0, duration: 0.3, ease: "power2.out" });
      });
    });
  }, { scope: ref });

  return (
    <section id="solution" ref={ref} className="py-16 md:py-20 lg:py-24 bg-white relative">
      {/* Glow BG */}
      <div className="solution-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen md:w-[80vw] h-[60vh] md:h-[80vh] bg-[radial-gradient(circle,rgba(62,229,142,0.15)_0%,transparent_70%)] z-0 pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10">
        <div className="solution-header text-center">
          <h2
            className="text-[1.75rem] md:text-[2rem] lg:text-[clamp(2rem,4vw,3rem)] font-extrabold mb-4 tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-heading)", color: "#183D32" }}
          >
            A Smarter Circular Textile System
          </h2>
          <p className="text-base md:text-lg text-text-muted max-w-3xl mx-auto">
            Moenviron is building an integrated approach to textile
            circularity, starting with what works today and scaling toward
            what's needed tomorrow. Our model focuses on three key pillars:
          </p>
        </div>

        <div className="solution-cards grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.num}
              className="solution-card bg-sand rounded-3xl p-8 md:p-12 relative overflow-hidden border-transparent hover:scale-[1.02] hover:border-mint hover:bg-white hover:shadow-[0_4px_20px_rgba(30,58,47,0.08)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group cursor-pointer"
              onClick={() => setSelectedPillar(i)}
            >
              <div
                className="absolute -top-[5px] right-[10px] text-[4rem] md:text-[6rem] font-[800] text-forest/5 leading-none group-hover:text-neon-accent/10 group-hover:scale-110 transition-all duration-400"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {pillar.num}
              </div>
              <h3
                className="text-xl md:text-2xl font-bold mb-3 relative z-[2]"
                style={{ fontFamily: "var(--font-heading)", color: "#183D32" }}
              >
                {pillar.title}
              </h3>
              <p className="text-text-muted relative z-[2] text-[0.9375rem] md:text-base">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedPillar !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPillar(null)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedPillar(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative w-full h-[50vh] md:h-[60vh]">
              <img
                src={pillars[selectedPillar].image}
                alt={pillars[selectedPillar].imageAlt}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h3 
                  className="text-2xl md:text-3xl font-bold text-white mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {pillars[selectedPillar].title}
                </h3>
                <p className="text-white/90 text-lg leading-relaxed">
                  {pillars[selectedPillar].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
