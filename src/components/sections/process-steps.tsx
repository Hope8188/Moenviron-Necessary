import React from 'react';
import { Package, Truck, Factory, ShoppingBag } from 'lucide-react';

const steps = [
  {
    icon: <Package className="h-8 w-8 text-primary-foreground" />,
    title: "UK Collection",
    description: "We collect discarded textiles from UK homes, charities, and brands that would otherwise go to landfill.",
    location: "United Kingdom",
    stepNumber: 1
  },
  {
    icon: <Truck className="h-8 w-8 text-primary-foreground" />,
    title: "Sustainable Shipping",
    description: "Textiles are shipped to our Kenya facility using optimised logistics to minimise carbon footprint.",
    location: "Transit",
    stepNumber: 2
  },
  {
    icon: <Factory className="h-8 w-8 text-primary-foreground" />,
    title: "Kenya Processing",
    description: "Our Nairobi team sorts, cleans, repairs, and transforms textiles into premium resale items.",
    location: "Kenya",
    stepNumber: 3
  },
  {
    icon: <ShoppingBag className="h-8 w-8 text-primary-foreground" />,
    title: "Global Resale",
    description: "Finished products return to UK and global markets as sustainable, traceable circular fashion.",
    location: "Worldwide",
    stepNumber: 4
  }
];

const ProcessSteps = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl" style={{ lineHeight: '1.2' }}>
            How Circular Fashion Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
            Our UK-Kenya partnership creates a sustainable loop that reduces waste, creates jobs, and delivers quality fashion with full traceability.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative">
          {/* Horizontal Connection Line - Hidden on mobile */}
          <div 
            className="absolute left-0 right-0 top-8 hidden h-0.5 bg-border md:block" 
            style={{ zIndex: 0 }}
          />
          
          <div className="grid gap-8 md:grid-cols-4">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="relative flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Icon Container with Badge */}
                <div className="relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-md">
                  {step.icon}
                  {/* Step Number Badge */}
                  <div 
                    className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[12px] font-bold text-accent-foreground"
                    style={{ 
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      border: '2px solid white' 
                    }}
                  >
                    {step.stepNumber}
                  </div>
                </div>

                {/* Content */}
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p 
                  className="mb-3 text-sm text-muted-foreground leading-relaxed" 
                  style={{ maxWidth: '240px' }}
                >
                  {step.description}
                </p>

                {/* Location Badge */}
                <span 
                  className="inline-block rounded-full bg-secondary px-3 py-1 text-[11px] font-medium text-secondary-foreground"
                  style={{ letterSpacing: '0.02em' }}
                >
                  {step.location}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;