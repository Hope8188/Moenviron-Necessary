"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, AlertCircle, Heart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    icon: Zap,
    title: "Growing Demand",
    text: "Demand for affordable clothing continues to grow unprecedentedly.",
    image: "/demand.webp",
    imageAlt: "Growing demand for affordable clothing",
    description: "Fast fashion consumption has doubled in the last 15 years, with the average consumer buying 60% more clothing items but keeping them for half as long."
  },
  {
    icon: AlertCircle,
    title: "Underdeveloped Systems",
    text: "Waste management systems remain underdeveloped in emerging markets.",
    image: "/waste.webp",
    imageAlt: "Underdeveloped waste management systems",
    description: "Only 15% of post-consumer textiles are collected for recycling globally, with emerging markets lacking proper infrastructure for sorting and processing."
  },
  {
    icon: Heart,
    title: "Lost Resources",
    text: "Valuable materials are lost instead of reused.",
    image: "/reuse.webp",
    imageAlt: "Lost textile resources",
    description: "$500 billion in value is lost annually due to clothing underutilization and lack of recycling, with 73% of textiles ending up in landfill or incineration."
  },
];

export default function Problem() {
  const ref = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  useGSAP(() => {
    // Header
    gsap.fromTo(".problem-header", 
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

    // Subheader
    gsap.fromTo(".problem-subheader", 
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        scrollTrigger: {
          trigger: ".problem-subheader",
          start: "top 85%",
          once: true
        }
      }
    );

    // Cards
    gsap.fromTo(".problem-card", 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".problem-cards-container",
          start: "top 85%",
          once: true
        }
      }
    );

    // Footer Box
    gsap.fromTo(".problem-footer", 
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        scrollTrigger: {
          trigger: ".problem-footer",
          start: "top 85%",
          once: true
        }
      }
    );

    // Icon Hover animations
    const cardElements = gsap.utils.toArray(".problem-card") as HTMLElement[];
    cardElements.forEach((card) => {
      const icon = card.querySelector("svg");
      card.addEventListener("mouseenter", () => {
        gsap.to(icon, { scale: 1.2, rotation: 10, duration: 0.3, ease: "back.out(1.7)" });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(icon, { scale: 1, rotation: 0, duration: 0.3, ease: "power2.out" });
      });
    });
  }, { scope: ref });

  return (
    <section id="problem" ref={ref} className="py-2 md:py-1 lg:py-1 bg-sand bg-[radial-gradient(circle_at_15%_50%,rgba(226,239,231,1),transparent_50%),radial-gradient(circle_at_85%_30%,rgba(196,223,200,0.5),transparent_50%)]">
      <div className="max-w-[1200px] mx-auto px-3 md:px-4">
        <div className="problem-header text-center">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-mint/30 max-w-4xl mx-auto">
            <h2
              className="text-[1.75rem] md:text-[2rem] lg:text-[clamp(2rem,4vw,3rem)] font-extrabold mb-2 tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-heading)", color: "#183D32" }}
            >
              The Textile Waste System Is Broken
            </h2>
            <p className="text-base md:text-lg text-text-muted max-w-3xl mx-auto">
              Every year, millions of tonnes of textiles are discarded
              globally, yet most are still wearable or recyclable. In Europe alone,
              the majority of post-consumer textiles are either incinerated or
              landfilled, despite clear opportunities for reuse and recycling.
            </p>
          </div>
        </div>

        <h3
          className="problem-subheader text-lg md:text-xl lg:text-[clamp(1.25rem,2vw,1.5rem)] font-bold text-center mt-8"
          style={{ fontFamily: "var(--font-heading)", color: "hsl(var(--forest))" }}
        >
          At the same time:
        </h3>

        <div className="problem-cards-container grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {cards.map((card, index) => (
            <div
              key={card.title}
              className="problem-card group relative bg-white border border-light-green rounded-3xl p-5 md:p-6 text-center shadow-[0_4px_20px_rgba(30,58,47,0.08)] hover:-translate-y-[5px] hover:shadow-[0_15px_30px_rgba(30,58,47,0.1)] hover:border-mint transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => setSelectedCard(index)}
            >
              {/* Hover Image Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br from-forest/95 to-dark-green/95 transition-all duration-500 ease-in-out z-10 ${
                hoveredCard === index ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}>
                <div className="relative w-full h-full">
                  <img
                    src={card.image}
                    alt={card.imageAlt}
                    className="object-cover mix-blend-overlay"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-left">
                    <p className="text-sm leading-relaxed font-medium">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className={`relative z-20 transition-all duration-500 ${
                hoveredCard === index ? 'scale-95 blur-[2px]' : 'scale-100 blur-0'
              }`}>
                <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-5 bg-light-green text-forest rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:bg-neon-accent/20">
                  <card.icon className="w-7 h-7 md:w-8 md:h-8" strokeWidth={1.5} />
                </div>
                <h4
                  className="text-lg md:text-xl font-bold mb-2"
                  style={{ fontFamily: "var(--font-heading)", color: "#183D32" }}
                >
                  {card.title}
                </h4>
                <p className="text-text-muted text-[0.9375rem]">{card.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="problem-footer mt-8 p-5 md:p-6 max-w-full md:max-w-[800px] mx-auto text-forest text-[0.9375rem]">
          <p className="text-center font-bold">
            The result is a system that wastes resources, increases emissions,
            and misses economic opportunities.
          </p>
        </div>
      </div>

      {/* Modal */}
      {selectedCard !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCard(null)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedCard(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors shadow-lg"
            >
              <svg className="w-5 h-5 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Image on top */}
            <div className="relative w-full h-[50vh] md:h-[55vh]">
              <img
                src={cards[selectedCard].image}
                alt={cards[selectedCard].imageAlt}
                className="object-cover w-full h-full"
              />
            </div>
            {/* Description below */}
            <div className="p-6 md:p-8 bg-white">
              <h3 
                className="text-2xl md:text-3xl font-bold mb-4"
                style={{ fontFamily: "var(--font-heading)", color: "#183D32" }}
              >
                {cards[selectedCard].title}
              </h3>
              <p className="text-text-muted text-lg leading-relaxed">
                {cards[selectedCard].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}