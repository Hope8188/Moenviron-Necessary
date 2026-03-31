"use client";

import { useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  RiRecycleLine,
  RiSortAsc,
  RiShirtLine,
  RiLoopLeftLine,
} from "react-icons/ri";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const rotatingRingRef = useRef<HTMLDivElement>(null);
  const iconsContainerRef = useRef<HTMLDivElement>(null);
  const centerIconRef = useRef<HTMLDivElement>(null);

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

    // Visual entrance animation
    gsap.fromTo(visualRef.current, 
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.8, delay: 0.3, ease: "power2.out" }
    );

    // Rotate the ring with icons
    gsap.to(rotatingRingRef.current, {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "none",
      transformOrigin: "center center"
    });

    // Counter-rotate icons to keep them upright
    if (iconsContainerRef.current) {
      const icons = iconsContainerRef.current.children;
      for (let i = 0; i < icons.length; i++) {
        const icon = icons[i] as HTMLElement;
        gsap.to(icon, {
          rotation: -360,
          duration: 20,
          repeat: -1,
          ease: "none",
          transformOrigin: "center center"
        });
      }
    }

    // Pulsing animation for center icon
    gsap.to(centerIconRef.current, {
      scale: 1.1,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Floating animation for individual icons
    const iconCards = gsap.utils.toArray(".icon-card");
    iconCards.forEach((card: any, index: number) => {
      gsap.to(card, {
        y: -8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.2
      });
    });

    // Button hover animations
    const buttons = gsap.utils.toArray(".hero-btn");
    buttons.forEach((btn: any) => {
      btn.addEventListener("mouseenter", () => {
        gsap.to(btn, { scale: 1.05, duration: 0.3, ease: "back.out(1.7)" });
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { scale: 1, duration: 0.3, ease: "power2.out" });
      });
    });
  }, { scope: containerRef });

  const flowItems = [
    { 
      label: "Collection", 
      icon: RiShirtLine,
      color: "from-green-600 to-emerald-500",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      position: { top: 0, left: "50%", transform: "translate(-50%, -50%)" }
    },
    { 
      label: "Sorting", 
      icon: RiSortAsc,
      color: "from-blue-600 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      position: { top: "50%", left: "100%", transform: "translate(-50%, -50%)" }
    },
    { 
      label: "Recycling", 
      icon: RiRecycleLine,
      color: "from-teal-600 to-green-500",
      bgColor: "bg-gradient-to-br from-teal-50 to-green-50",
      borderColor: "border-teal-200",
      position: { top: "100%", left: "50%", transform: "translate(-50%, -50%)" }
    },
    { 
      label: "Reuse", 
      icon: RiLoopLeftLine,
      color: "from-amber-600 to-orange-500",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
      borderColor: "border-amber-200",
      position: { top: "50%", left: 0, transform: "translate(-50%, -50%)" }
    },
  ];

  return (
    <section ref={containerRef} className="relative pt-8 pb-12 md:pt-12 md:pb-16 lg:pt-12 lg:pb-24 flex flex-col min-h-screen overflow-hidden bg-sand bg-[radial-gradient(circle_at_15%_50%,rgba(226,239,231,1),transparent_50%),radial-gradient(circle_at_85%_30%,rgba(196,223,200,0.5),transparent_50%)]">
      {/* Background Shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="bg-shape-1 absolute w-[200px] h-[200px] md:w-[350px] md:h-[350px] lg:w-[500px] lg:h-[500px] bg-[rgba(196,223,200,0.4)] rounded-full blur-[80px] -top-[30px] -right-[30px] lg:-top-[80px] lg:-right-[80px]" />
        <div className="bg-shape-2 absolute w-[150px] h-[150px] md:w-[250px] md:h-[250px] lg:w-[350px] lg:h-[350px] bg-[rgba(62,229,142,0.1)] rounded-full blur-[80px] bottom-0 -left-[30px] lg:-left-[80px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-2 md:px-4 w-full flex-1 flex flex-col md:flex-row items-center md:items-center gap-8 md:gap-10 lg:gap-16">
        {/* Text */}
        <div
          ref={textRef}
          className="order-1 flex-1"
        >
          <h1
            className="text-3xl md:text-5xl lg:text-7xl leading-tight md:leading-[1.05] mb-6 tracking-tight text-center md:text-left"
            style={{ fontFamily: "var(--font-heading)", fontWeight: 800, color: "#183D32" }}
          >
            <span className="block whitespace-nowrap">Redefining</span>
            <span className="block whitespace-nowrap">Textile Waste</span>
            <span className="block whitespace-nowrap">into Circular Value</span>
          </h1>
          <p className="text-sm md:text-[0.9375rem] lg:text-lg text-[#1a1a1a] mb-6 leading-relaxed font-medium text-center md:text-left max-w-lg">
            Moenviron builds scalable solutions to transform post-consumer
            textiles into reusable, recyclable, and traceable resources bridging
            global supply chains and Africa&#39;s growing circular economy.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full md:w-auto justify-center md:justify-start">
            <Link
              to="/partners"
              className="hero-btn w-full sm:w-auto text-center px-6 md:px-8 lg:px-10 py-3 md:py-4 lg:py-[1.125rem] text-sm md:text-base lg:text-lg font-heading font-semibold rounded-full bg-[#3EE58E] text-[#183D32] shadow-[0_0_20px_rgba(62,229,142,0.3)] hover:bg-white hover:shadow-[0_0_30px_rgba(62,229,142,0.6)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(24,61,50,0.5)] transition-all duration-300"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Partner With Us
            </Link>
            <a
              href="#how-it-works"
              className="hero-btn w-full sm:w-auto text-center px-6 md:px-8 lg:px-10 py-3 md:py-4 lg:py-[1.125rem] text-sm md:text-base lg:text-lg font-heading font-semibold rounded-full bg-[#3EE58E] text-[#183D32] shadow-[0_0_20px_rgba(62,229,142,0.3)] hover:bg-white hover:shadow-[0_0_30px_rgba(62,229,142,0.6)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(24,61,50,0.5)] transition-all duration-300"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Explore Our Model
            </a>
          </div>
        </div>

        {/* Spinning Visual */}
        <div
          ref={visualRef}
          className="order-2 relative h-[160px] md:h-[300px] lg:h-[480px] w-full flex justify-center items-center flex-1"
        >
          <div className="relative w-[140px] h-[140px] md:w-[260px] md:h-[260px] lg:w-[420px] lg:h-[420px]">
            {/* Outer Ring - Static */}
            <div className="absolute inset-0 rounded-full border-2 border-mint/30 shadow-lg">
              {/* Decorative Dots on Outer Ring */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={`dot-${i}`}
                  className="absolute w-1 h-1 md:w-1.5 md:h-1.5 lg:w-2 lg:h-2 bg-neon-accent rounded-full"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${i * 30}deg) translate(calc(50% - 2px), -50%)`,
                    transformOrigin: "0 0"
                  }}
                />
              ))}
            </div>

            {/* Rotating Container for Icons */}
            <div 
              ref={rotatingRingRef}
              className="absolute inset-0"
            >
              <div ref={iconsContainerRef} className="relative w-full h-full">
                {flowItems.map((item, index) => {
                  const Icon = item.icon;
                  const iconColor = ['#16a34a', '#2563eb', '#0d9488', '#d97706'][index];
                  return (
                    <div
                      key={item.label}
                      className="icon-card absolute"
                      style={item.position}
                    >
                      <div className={`${item.bgColor} backdrop-blur-sm border ${item.borderColor} rounded-full p-1.5 md:p-2.5 lg:p-4 shadow-lg hover:shadow-xl transition-all duration-300 group`}>
                        <div className="relative">
                          <Icon className={`w-3 h-3 md:w-5 md:h-5 lg:w-8 lg:h-8`} style={{ color: iconColor }} />
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
                        </div>
                      </div>
                      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 md:mt-2 lg:mt-3 whitespace-nowrap">
                        <span className="text-[0.5rem] md:text-xs lg:text-sm font-heading font-semibold text-dark-green/80 group-hover:text-dark-green transition-colors">
                          {item.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inner Ring */}
            <div className="absolute inset-[10%] md:inset-[12%] lg:inset-[15%] rounded-full border border-dashed border-neon-accent/40" />
            
            {/* Center Icon with Pulse Effect */}
            <div 
              ref={centerIconRef}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-accent to-forest rounded-full blur-xl opacity-50 animate-pulse" />
                <div className="relative bg-gradient-to-br from-dark-green to-forest rounded-full p-3 md:p-5 lg:p-8 shadow-2xl">
                  <RiRecycleLine className="w-6 h-6 md:w-10 md:h-10 lg:w-16 lg:h-16 text-white" />
                </div>
              </div>
            </div>

            {/* Decorative Circles */}
            <div className="absolute inset-[5%] rounded-full border border-mint/20" />
            <div className="absolute inset-[15%] rounded-full border border-mint/20" />
            
            {/* Connecting Lines SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <circle
                cx="50%"
                cy="50%"
                r="42%"
                fill="none"
                stroke="url(#gradientStroke)"
                strokeWidth="1.5"
                strokeDasharray="5 5"
                className="opacity-40"
              />
              <defs>
                <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3EE58E" />
                  <stop offset="100%" stopColor="#2D6A4F" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Section - maintain the loop */}
      <div className="relative z-10 w-full px-5 sm:px-6 lg:px-8 mt-8 md:mt-12">
        <div className="max-w-4xl mx-auto text-center">
        
          <p className="text-xs md:text-[0.8125rem] lg:text-base text-[#183D32] font-medium max-w-3xl mx-auto">
            From collection to reuse, and from reuse to recycling, we enable a smarter, more sustainable textile system.
          </p>
        </div>
      </div>
    </section>
  );
}