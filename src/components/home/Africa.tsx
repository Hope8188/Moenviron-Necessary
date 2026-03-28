"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Africa() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Image on Right with enhanced animation
    gsap.fromTo(".africa-image", 
      { opacity: 0, x: 60, scale: 0.95 },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 1,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          once: true
        }
      }
    );

    // Content on Left
    gsap.fromTo(".africa-content", 
      { opacity: 0, x: -60 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        delay: 0.2,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          once: true
        }
      }
    );

    // Highlight box animation
    gsap.fromTo(".africa-highlight", 
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.5,
        scrollTrigger: {
          trigger: ".africa-highlight",
          start: "top 85%",
          once: true
        }
      }
    );

    // Scanline animation
    gsap.fromTo(".scanline-overlay", 
      { top: "-100%" },
      { top: "100%", duration: 2, repeat: -1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom bottom", scrub: 1 }}
    );
  }, { scope: ref });

  return (
    <section id="impact" ref={ref} className="py-16 md:py-20 lg:py-24 bg-sand relative overflow-hidden">
      <div
        className="max-w-[1200px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16"
      >
        {/* Content - Left side */}
        <div className="africa-content flex flex-col justify-center order-2 md:order-1">
          <h2
            className="text-[1.75rem] md:text-[2rem] lg:text-[clamp(2rem,4vw,3rem)] font-bold mb-4 tracking-[-0.02em] text-dark-green"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Why Africa Matters in Circular Textiles
          </h2>
          <p className="text-base md:text-lg text-text-muted">
            Africa plays a critical role in the global textile circular economy.
          </p>

          {/* Highlight Box */}
          <div className="africa-highlight my-6 md:my-8 p-6 md:p-8 text-forest text-[0.9375rem]">
            <h4
              className="font-bold mb-3"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              In markets like Kenya:
            </h4>
            <ul className="space-y-2">
              {[
                "Second-hand clothing is a primary source of affordable fashion",
                "Demand drives strict quality selection",
                "Entire ecosystems of traders, retailers, and consumers depend on this system",
                "Far from being waste destinations, these markets are active value creators, extending the life of textiles and generating economic opportunity"
              ].map((item) => (
                <li
                  key={item}
                  className="relative pl-7 text-text-dark text-[0.9375rem] md:text-base"
                >
                  <span className="absolute left-0 text-forest font-bold">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          
          <p className="text-slate-700 md:text-lg text-text-muted mt-4">
            Moenviron is positioning itself within this ecosystem to build more
            structured, transparent, and scalable circular solutions.
          </p>
        </div>

        {/* Image - Right side */}
        <div className="africa-image order-1 md:order-2">
          <div className="relative rounded-3xl p-3 md:p-4 futuristic-border mt-8 md:mt-0">
            <div
              className="w-full h-[300px] md:h-[400px] lg:h-[500px] bg-mint bg-cover bg-center rounded-2xl md:rounded-3xl relative overflow-hidden"
              style={{
                backgroundImage:
                  "url('/moet.webp')",
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(30,58,47,0.8)] to-transparent" />
            </div>
            {/* Scanline */}
            <div className="scanline-overlay" />
            {/* Corner elements */}
            <div className="corner-element top-3 left-3 md:top-5 md:left-5 border-r-0 border-b-0" />
            <div className="corner-element bottom-3 right-3 md:bottom-5 md:right-5 border-l-0 border-t-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
