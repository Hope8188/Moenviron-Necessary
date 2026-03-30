import React from 'react';
import { ArrowRight, ClipboardCheck, BarChart3, Briefcase } from 'lucide-react';

const PartnersCTA = () => {
  return (
    <section className="bg-[#2D4C3B] text-white py-16 md:py-24 overflow-hidden">
      <div className="container px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left Column: Text Content */}
          <div className="flex flex-col items-start max-w-xl">
            <div className="mb-6 inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/90">
              For Brands & Retailers
            </div>
            
            <h2 className="mb-6 text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
              Partner With Moenviron
            </h2>
            
            <p className="mb-8 text-lg leading-relaxed text-white/80">
              Are you a fashion brand looking to meet EPR requirements, improve ESG scores, or launch a textile take-back program? Our UK-Kenya infrastructure provides verified, traceable circular fashion solutions at scale.
            </p>
            
            <a 
              href="/partners" 
              className="hero-btn inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white px-6 md:px-8 lg:px-10 py-3 md:py-4 lg:py-[1.125rem] text-sm md:text-base lg:text-lg font-heading font-semibold text-[#2D4C3B] shadow-md transition-all hover:bg-[#F3F0E8] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(24,61,50,0.5)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Explore Partnership
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Right Column: Feature Cards */}
          <div className="flex flex-col gap-4">
            {/* Card 1: EPR Compliance */}
            <div className="group flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:bg-white/10 hover:shadow-lg">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                <ClipboardCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold text-white">EPR Compliance</h3>
                <p className="text-sm leading-relaxed text-white/70">
                  Meet Extended Producer Responsibility requirements with verified textile recycling and distribution tracking.
                </p>
              </div>
            </div>

            {/* Card 2: ESG Reporting */}
            <div className="group flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:bg-white/10 hover:shadow-lg">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold text-white">ESG Reporting</h3>
                <p className="text-sm leading-relaxed text-white/70">
                  Detailed impact metrics for your sustainability reports and stakeholders with full carbon footprint analysis.
                </p>
              </div>
            </div>

            {/* Card 3: Brand Partnership */}
            <div className="group flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:bg-white/10 hover:shadow-lg">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-1 text-lg font-semibold text-white">Brand Partnership</h3>
                <p className="text-sm leading-relaxed text-white/70">
                  White-label solutions for take-back schemes and circular fashion programs powered by our ethical supply chain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersCTA;