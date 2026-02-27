import { Package, Truck, Factory, ShoppingBag, LucideIcon } from "lucide-react";
import { useCMSContent } from "@/hooks/useCMSContent";

const iconMap: Record<string, LucideIcon> = {
  Package,
  Truck,
  Factory,
  ShoppingBag,
};

interface Step {
  icon: string;
  title: string;
  description: string;
  location: string;
}

interface HowItWorksContent {
  title?: string;
  subtitle?: string;
  steps?: Step[];
}

export function HowItWorks() {
  const { data: cms } = useCMSContent("home", "how-it-works");

  const cmsContent = (cms?.content || {}) as HowItWorksContent;
  const content = {
    title: cmsContent.title || "The London-Nairobi Circular Loop",
    subtitle: cmsContent.subtitle || "Our unique cross-continental partnership proves that waste is merely a resource in the wrong place. Experience the journey of a garment from collection to restoration.",
    steps: cmsContent.steps || [
      {
        icon: "Package",
        title: "UK Collection",
        description: "We curate high-potential discarded textiles from across the UK, diverting tonnes from landfills every month.",
        location: "United Kingdom",
      },
      {
        icon: "Truck",
        title: "The Circular Bridge",
        description: "Our carbon-optimised logistics bridge the gap between UK surplus and Kenyan craftsmanship.",
        location: "Transit",
      },
      {
        icon: "Factory",
        title: "Artisanal Processing",
        description: "At our Nairobi hub, skilled artisans transform textiles through expert cleaning, repair, and creative upcycling.",
        location: "Nairobi, Kenya",
      },
      {
        icon: "ShoppingBag",
        title: "Conscious Fashion",
        description: "Ethically restored pieces return to the market as premium circular garments with full carbon transparency.",
        location: "Worldwide",
      },
    ]
  };

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            {content.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {content.subtitle}
          </p>
        </div>

        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="absolute left-0 right-0 top-16 hidden h-0.5 bg-border md:block" />

          <div className="grid gap-8 md:grid-cols-4">
            {content.steps.map((step: Step, index: number) => {
              const Icon = iconMap[step.icon] || Package;
              return (
                <div 
                  key={step.title} 
                  className="relative text-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {/* Icon Circle */}
                  <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-medium">
                    <Icon className="h-8 w-8 text-primary-foreground" />
                    {/* Step Number */}
                    <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mb-3 text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                  <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                    {step.location}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
