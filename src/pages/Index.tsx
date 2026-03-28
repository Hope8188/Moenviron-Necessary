import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Problem from "@/components/home/Problem";
import Solution from "@/components/home/Solution";
import Africa from "@/components/home/Africa";
import Alignment from "@/components/home/Alignment";
import HowItWorks from "@/components/home/HowItWorks";
import CTA from "@/components/home/CTA";
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
        <Hero />
        <Problem />
        <Solution />
        <HowItWorks />
        <Africa />
        <Alignment />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
