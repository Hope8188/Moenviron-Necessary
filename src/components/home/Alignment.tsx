"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const tags = [
  "The EU Strategy for Sustainable and Circular Textiles",
  "Emerging global frameworks for textile reuse and recycling",
  "Cross-border circular value chains connecting Europe and Africa",
];

const benefits = [
  { icon: "🍃", text: "Resource efficiency" },
  { icon: "🤝", text: "Job creation" },
  { icon: "🌍", text: "Reduced environmental impact" },
  { icon: "⚙️", text: "Scalable circular infrastructure" },
];

export default function Alignment() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header
    gsap.fromTo(".align-header", 
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

    // Marquee
    gsap.fromTo(".align-marquee", 
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.6,
        delay: 0.3,
        scrollTrigger: {
          trigger: ".align-marquee",
          start: "top 85%",
          once: true
        }
      }
    );

    // Subheader
    gsap.fromTo(".align-subheader", 
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.5,
        scrollTrigger: {
          trigger: ".align-subheader",
          start: "top 85%",
          once: true
        }
      }
    );

    // Benefits
    gsap.fromTo(".align-benefit", 
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".align-benefits-container",
          start: "top 85%",
          once: true
        }
      }
    );

    // Badge Icon Hover
    const badge = ref.current?.querySelector(".align-badge");
    const icon = badge?.querySelector("svg");
    if (badge && icon) {
      badge.addEventListener("mouseenter", () => {
        gsap.to(icon, { scale: 1.2, rotation: 15, duration: 0.3, ease: "back.out(1.7)" });
      });
      badge.addEventListener("mouseleave", () => {
        gsap.to(icon, { scale: 1, rotation: 0, duration: 0.3, ease: "power2.out" });
      });
    }

  }, { scope: ref });

  return (
    <section id="alignment" ref={ref} className="py-16 md:py-20 lg:py-24 bg-white text-center">
      <div className="max-w-[56rem] mx-auto px-4 md:px-8">
        <div className="align-header">
          {/* Badge */}
          <div className="align-badge w-16 h-16 md:w-20 md:h-20 bg-light-green text-forest rounded-full flex items-center justify-center mx-auto mb-8 cursor-default">
            <CheckCircle className="w-8 h-8 md:w-10 md:h-10" strokeWidth={2} />
          </div>

          <h2
            className="text-[1.75rem] md:text-[2rem] lg:text-[clamp(2rem,4vw,3rem)] font-bold mb-4 tracking-[-0.02em] text-dark-green"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Aligned With Global Circular Economy Systems
          </h2>
          <p className="text-base md:text-lg text-text-muted">
            Moenviron's approach aligns with:
          </p>
        </div>

        {/* Marquee Tags */}
        <div className="align-marquee marquee-container relative my-6 md:my-8 overflow-hidden">
          {/* Left blur gradient overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-14 md:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

          <div className="flex w-fit animate-marquee hover:[animation-play-state:paused] whitespace-nowrap">
            <div className="flex items-center gap-6 px-3">
              {tags.map((tag, i) => (
                <span
                  key={`first-${i}`}
                  className="bg-sand/50 border border-mint px-4 md:px-6 py-2.5 rounded-full text-[0.8125rem] md:text-sm text-forest font-semibold backdrop-blur-sm hover:bg-light-green hover:border-forest hover:-translate-y-1 transition-all duration-400"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-6 px-3">
              {tags.map((tag, i) => (
                <span
                  key={`second-${i}`}
                  className="bg-sand/50 border border-mint px-4 md:px-6 py-2.5 rounded-full text-[0.8125rem] md:text-sm text-forest font-semibold backdrop-blur-sm hover:bg-light-green hover:border-forest hover:-translate-y-1 transition-all duration-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right blur gradient overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-14 md:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        </div>

        {/* Benefits */}
        <div>
          <h3
            className="align-subheader text-lg md:text-xl lg:text-[clamp(1.25rem,2vw,1.5rem)] font-medium mt-16 mb-8"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            We are building a model that supports:
          </h3>

          <div className="align-benefits-container grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <div
                key={b.text}
                className="align-benefit flex flex-col items-center gap-3 p-6 md:p-8 bg-sand rounded-2xl hover:bg-white hover:shadow-[0_4px_20px_rgba(30,58,47,0.08)] hover:-translate-y-[3px] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
              >
                <span className="text-[2rem] md:text-[2.5rem]">{b.icon}</span>
                <span className="font-semibold text-dark-green text-[0.8125rem] md:text-base">
                  {b.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
