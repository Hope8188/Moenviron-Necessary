import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { ImpactCounter } from "@/components/home/ImpactCounter";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ImpactCollage } from "@/components/home/ImpactCollage";
import { SDGBadges } from "@/components/home/SDGBadges";
import { PartnerCTA } from "@/components/home/PartnerCTA";
import { NewsletterPopup } from "@/components/sections/NewsletterPopup";
import { SEO } from "@/components/SEO";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <SEO
        title="Sustainable Fashion from Recycled Textiles"
        description="Pioneering the circular economy through sustainable fashion. Ethical UK collection, advanced Kenya processing, and measurable global impact."
      />
      <Navbar />
      <NewsletterPopup />
      <main className="flex-1">

        <HeroSection />
        <ImpactCounter />
        <HowItWorks />
        <ImpactCollage />
        <SDGBadges />
        <PartnerCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
