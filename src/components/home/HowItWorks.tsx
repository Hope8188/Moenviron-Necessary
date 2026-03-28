"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Box, Filter, RefreshCw, CloudDownload, Globe } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: Box,
    num: 1,
    title: "Collection",
    desc: "Textiles gathered from post-consumer sources.",
  },
  {
    icon: Filter,
    num: 2,
    title: "Sorting & Quality",
    desc: "Garments categorized by usability and market demand.",
  },
  {
    icon: RefreshCw,
    num: 3,
    title: "Reuse First",
    desc: "High-quality items redistributed into second-hand markets.",
  },
  {
    icon: CloudDownload,
    num: 4,
    title: "Recycling Pathways",
    desc: "Non-reusable textiles directed toward recycling.",
  },
  {
    icon: Globe,
    num: 5,
    title: "Market Integration",
    desc: "Products re-enter the economy through structured systems.",
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header animation with stagger for text
    gsap.fromTo(".how-header", 
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

    // Steps with enhanced animation
    gsap.fromTo(".how-step", 
      { opacity: 0, y: 40, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".how-steps-container",
          start: "top 80%",
          once: true
        }
      }
    );

    // Connecting line animation
    gsap.fromTo(".how-line", 
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".how-steps-container",
          start: "top 80%",
          once: true
        }
      }
    );

    // Icon Hover animations with scale and rotation
    const stepElements = gsap.utils.toArray(".how-step") as HTMLElement[];
    stepElements.forEach((step) => {
      const iconWrapper = step.querySelector(".how-icon-wrapper");
      const icon = step.querySelector("svg");
      step.addEventListener("mouseenter", () => {
        gsap.to(iconWrapper, { scale: 1.1, duration: 0.3, ease: "back.out(1.7)" });
        gsap.to(icon, { rotation: 15, duration: 0.3, ease: "back.out(1.7)" });
      });
      step.addEventListener("mouseleave", () => {
        gsap.to(iconWrapper, { scale: 1, duration: 0.3, ease: "power2.out" });
        gsap.to(icon, { rotation: 0, duration: 0.3, ease: "power2.out" });
      });
    });

  }, { scope: ref });

  return (
    <section id="how-it-works" ref={ref} className="py-16 md:py-20 lg:py-24 bg-forest relative">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="how-header text-center">
          <h2
            className="text-[1.75rem] md:text-[2rem] lg:text-[clamp(2rem,4vw,3rem)] font-bold mb-4 tracking-[-0.02em] text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            How the System Works
          </h2>
        </div>

        <div className="how-steps-container flex flex-col md:flex-row items-center md:items-start md:justify-between gap-10 md:gap-0 mt-12 relative">
          {/* Connecting Line (desktop) */}
          <div className="hidden md:block how-line absolute top-[40px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-white/10 via-neon-accent to-white/10 z-[1] origin-left" />

          {steps.map((step, i) => (
            <div
              key={step.num}
              className="how-step flex-1 text-center relative z-[2] px-0 md:px-4 max-w-[300px] md:max-w-none"
            >
              {/* Icon Wrapper */}
              <div className="how-icon-wrapper w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-5 bg-darker-green border-2 border-mint rounded-full flex items-center justify-center relative shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-neon-accent hover:shadow-[0_0_20px_rgba(62,229,142,0.3)] hover:scale-105 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]">
                <div className="absolute -top-2 -right-2 w-6 h-6 lg:w-7 lg:h-7 bg-neon-accent text-dark-green rounded-full flex items-center justify-center font-bold text-xs lg:text-sm">
                  {step.num}
                </div>
                <step.icon className="w-7 h-7 lg:w-8 lg:h-8 text-white" strokeWidth={1.5} />
              </div>
              <h4
                className="text-white mb-2 text-base lg:text-lg"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {step.title}
              </h4>
              <p className="text-sand opacity-80 text-[0.8125rem] lg:text-sm">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
