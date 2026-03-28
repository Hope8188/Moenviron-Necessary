"use client";

import { useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(".cta-content", 
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
  }, { scope: ref });

  return (
    <section
      id="contact"
      className="py-16 md:py-20 lg:py-24 bg-[#183D32] bg-[radial-gradient(circle_at_top_right,var(--color-forest),transparent_60%)] relative overflow-hidden"
    >
      {/* Glow Orbs */}
      <div className="absolute w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full blur-[80px] bg-[rgba(62,229,142,0.2)] -top-[50px] -left-[50px] md:-top-[100px] md:-left-[100px] z-0" />
      <div className="absolute w-[150px] h-[150px] md:w-[300px] md:h-[300px] rounded-full blur-[80px] bg-[rgba(44,85,69,0.8)] -bottom-[25px] md:-bottom-[50px] right-[5%] z-0" />

      <div ref={ref} className="max-w-[1200px] mx-auto px-4 md:px-8 text-center relative z-10">
        <div className="cta-content">
          <h2
            className="text-[1.75rem] md:text-[2rem] lg:text-[clamp(2rem,4vw,3rem)] font-bold mb-4 tracking-[-0.02em] text-white"
          >
            Let us Build the Future of Circular Textiles
          </h2>

          <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-4 md:gap-6 mt-16">
            <Link
              to="/partners"
              className="w-full md:w-auto max-w-[280px] md:max-w-none px-8 py-[0.875rem] font-display font-semibold rounded-full bg-[#3EE58E] text-[#183D32] shadow-[0_0_20px_rgba(62,229,142,0.3)] hover:bg-white hover:shadow-[0_0_30px_rgba(62,229,142,0.6)] hover:-translate-y-0.5 transition-all duration-400 cursor-pointer text-[0.9375rem] md:text-base"
            >
              Partner With Us
            </Link>
            <button
              className="w-full md:w-auto max-w-[280px] md:max-w-none px-8 py-[0.875rem] font-display font-semibold rounded-full bg-transparent text-white border border-white hover:bg-white/10 hover:border-[#3EE58E] hover:text-[#3EE58E] transition-all duration-400 cursor-pointer text-[0.9375rem] md:text-base"
            >
              Join Our Network
            </button>
            <button
              className="w-full md:w-auto max-w-[280px] md:max-w-none px-8 py-[0.875rem] font-display font-semibold rounded-full bg-[#3EE58E] text-[#183D32] shadow-[0_0_20px_rgba(62,229,142,0.3)] hover:bg-white hover:shadow-[0_0_30px_rgba(62,229,142,0.6)] hover:-translate-y-0.5 transition-all duration-400 cursor-pointer text-[0.9375rem] md:text-base"
            >
              Explore Opportunities
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
