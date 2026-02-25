import React from 'react';
import { ArrowRight, Recycle, Globe, Leaf } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#FBF9F4] min-h-[700px] flex items-center">
      {/* Subtle Grid Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="hero-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-6 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            {/* Circular Fashion Badge */}
            <div className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#2D5A43] animate-fade-in">
              <Recycle className="h-4 w-4" />
              <span>Circular Fashion • UK & Kenya Partnership</span>
            </div>

          {/* Large Bold Heading */}
          <h1 className="mb-6 text-[40px] font-bold tracking-tight text-[#1A1A1A] md:text-[60px] lg:text-[60px] leading-[1.1] transition-all duration-700 delay-100 animate-in fade-in slide-in-from-bottom-4">
            Transforming Textile Waste Into{" "}
            <span className="text-[#2D5A43]">Sustainable Fashion</span>
          </h1>

          {/* Subtext */}
          <p className="mb-10 text-lg text-[#6B7280] md:text-xl max-w-2xl mx-auto leading-[1.6] transition-all duration-700 delay-200 animate-in fade-in slide-in-from-bottom-4">
            We collect discarded textiles in the UK, process them sustainably in Kenya, and bring them back as premium circular fashion. Every purchase reduces landfill waste and creates jobs.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row transition-all duration-700 delay-300 animate-in fade-in slide-in-from-bottom-4">
            <a href="/shop">
              <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-transform hover:scale-[1.02] active:scale-[0.98] bg-[#2D5A43] text-white hover:bg-[#2D5A43]/90 h-12 rounded-[1rem] px-8 gap-2 shadow-[0_10px_15px_-3px_rgba(45,90,67,0.1)]">
                Shop Sustainable
                <ArrowRight className="h-4 w-4" />
              </button>
            </a>
            <a href="/partners">
              <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors border border-[#E5E7EB] bg-white text-[#1A1A1A] hover:bg-[#F3F0E8] h-12 rounded-[1rem] px-8 gap-2">
                Partner With Us
              </button>
            </a>
          </div>

          {/* Trust/Impact Icons */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-[#6B7280] transition-all duration-700 delay-400 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2D5A43]/10">
                <Globe className="h-5 w-5 text-[#2D5A43]" />
              </div>
              <span>UN SDG Aligned</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2D5A43]/10">
                <Leaf className="h-5 w-5 text-[#2D5A43]" />
              </div>
              <span>Carbon Tracked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D97706]/10">
                <Recycle className="h-5 w-5 text-[#D97706]" />
              </div>
              <span>100% Circular</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;