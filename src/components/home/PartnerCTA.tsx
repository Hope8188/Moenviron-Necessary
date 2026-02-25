import { Link } from "react-router-dom";
import { ArrowRight, Building2, FileCheck, TrendingUp, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCMSContent } from "@/hooks/useCMSContent";

const iconMap: Record<string, LucideIcon> = {
  Building2,
  FileCheck,
  TrendingUp,
};

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

interface PartnerCTAContent {
  badge?: string;
  title?: string;
  description?: string;
  cta_text?: string;
  cta_link?: string;
  benefits?: Benefit[];
}

export function PartnerCTA() {
  const { data: cms } = useCMSContent("home", "partner-cta");

  const cmsContent = (cms?.content || {}) as PartnerCTAContent;
  const content = {
    badge: cmsContent.badge || "For Brands & Retailers",
    title: cmsContent.title || "Partner With Moenviron",
    description: cmsContent.description || "Are you a fashion brand looking to meet EPR requirements, improve ESG scores, or launch a textile take-back program? Our UK-Kenya infrastructure provides verified, traceable circular fashion solutions at scale.",
    cta_text: cmsContent.cta_text || "Explore Partnership",
    cta_link: cmsContent.cta_link || "/partners",
    benefits: cmsContent.benefits || [
      {
        icon: "FileCheck",
        title: "EPR Compliance",
        description: "Meet Extended Producer Responsibility requirements with verified textile recycling",
      },
      {
        icon: "TrendingUp",
        title: "ESG Reporting",
        description: "Detailed impact metrics for your sustainability reports and stakeholders",
      },
      {
        icon: "Building2",
        title: "Brand Partnership",
        description: "White-label solutions for take-back schemes and circular fashion programs",
      },
    ]
  };

  return (
    <section className="relative overflow-hidden bg-primary py-16 md:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="partner-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#partner-grid)" />
        </svg>
      </div>

      <div className="container relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Content */}
          <div className="text-primary-foreground">
            <span className="mb-4 inline-block rounded-full bg-primary-foreground/10 px-4 py-2 text-sm font-medium">
              {content.badge}
            </span>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              {content.title}
            </h2>
            <p className="mb-8 text-lg opacity-90 leading-relaxed">
              {content.description}
            </p>
            <Link to={content.cta_link}>
              <Button 
                size="lg" 
                variant="secondary" 
                className="gap-2"
              >
                {content.cta_text}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

            {/* Benefits Cards */}
            <div className="space-y-4">
              {(content.benefits || []).map((benefit: Benefit, index: number) => {
              const Icon = iconMap[benefit.icon] || FileCheck;
              return (
                <div 
                  key={benefit.title}
                  className="flex gap-4 rounded-xl bg-primary-foreground/10 p-5 backdrop-blur-sm animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/20">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-foreground">
                      {benefit.title}
                    </h3>
                    <p className="mt-1 text-sm text-primary-foreground/80">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
