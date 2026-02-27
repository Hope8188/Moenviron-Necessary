import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  FileCheck,
  TrendingUp,
  Building2,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Recycle,
} from "lucide-react";
import { SEO } from "@/components/SEO";

const benefits = [
  {
    icon: FileCheck,
    title: "EPR Compliance",
    description:
      "Meet Extended Producer Responsibility requirements with our verified textile recycling infrastructure. Full documentation for regulatory reporting.",
  },
  {
    icon: TrendingUp,
    title: "ESG Reporting",
    description:
      "Access detailed impact metrics for your sustainability reports. Carbon data, job creation stats, and waste diversion figures on demand.",
  },
  {
    icon: Building2,
    title: "Take-Back Programs",
    description:
      "Launch branded textile take-back schemes. We handle collection, processing, and can provide white-label resale options.",
  },
  {
    icon: BarChart3,
    title: "Impact Dashboard",
    description:
      "Real-time access to your partnership metrics. See exactly where your textiles go and the impact they create.",
  },
];

const processSteps = [
  "Initial consultation to understand your sustainability goals",
  "Custom partnership proposal with pricing and logistics",
  "Pilot program with full impact tracking",
  "Scale to full partnership with dedicated account management",
];

const Partners = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <SEO 
        title="Partner With Us"
        description="Join leading fashion brands using our UK-Kenya infrastructure for EPR compliance, ESG reporting, and genuine circular fashion impact."
      />
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center text-primary-foreground">
              <span className="mb-4 inline-block rounded-full bg-primary-foreground/10 px-4 py-2 text-sm font-medium">
                For Brands & Retailers
              </span>
              <h1 className="text-4xl font-bold md:text-5xl">
                Partner With Moenviron
              </h1>
              <p className="mt-4 text-lg opacity-90">
                Join leading fashion brands using our UK-Kenya infrastructure for 
                EPR compliance, ESG reporting, and genuine circular fashion impact.
              </p>
              <Link to="/contact" className="mt-8 inline-block">
                <Button size="lg" variant="secondary" className="gap-2">
                  Start Conversation
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="container">
            <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
              Partnership Benefits
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={benefit.title}
                    className="flex gap-4 rounded-xl border border-border bg-card p-6"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-foreground">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-card py-16">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  How Partnership Works
                </h2>
                <p className="mt-4 text-muted-foreground">
                  From initial conversation to full-scale operation, we guide you through 
                  every step of building a genuine circular fashion program.
                </p>
                <ul className="mt-8 space-y-4">
                  {processSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-foreground">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-border bg-background p-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Recycle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-4 text-xl font-semibold text-foreground">
                  Ready to Start?
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Whether you're exploring EPR compliance or ready to launch a full 
                  circular fashion program, we're here to help.
                </p>
                <Link to="/contact">
                  <Button className="w-full gap-2">
                    Contact Our Team
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-foreground">
                Built for Enterprise Trust
              </h2>
              <p className="mt-4 text-muted-foreground">
                Our infrastructure runs on enterprise-grade systems. PostgreSQL database, 
                Stripe-powered payments, and full GDPR compliance. Your brand's reputation 
                is safe with us.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Partners;
