import { Link } from "react-router-dom";
import { ArrowRight, Recycle, Globe, Leaf, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCMSContent } from "@/hooks/useCMSContent";
import { useState, useEffect, useCallback } from "react";
import heroMountainImage from "@/assets/hero-mountain.png";
import heroMountainWebp from "@/assets/hero-mountain.webp";
import heroMountainAvif from "@/assets/hero-mountain.avif";

const DEFAULT_SLIDES = [
  {
    url: heroMountainImage,
    alt: "Mountain landscape with forests and river valley"
  },
  {
    url: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&h=675&fit=crop&auto=format&q=75",
    alt: "Sustainable fashion production"
  },
  {
    url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200&h=675&fit=crop&auto=format&q=75",
    alt: "Textile recycling process"
  }
];

interface HeroContent {
  badge?: string;
  headline?: string;
  title?: string;
  subheadline?: string;
  subtitle?: string;
  cta_primary_text?: string;
  ctaText?: string;
  cta_primary_link?: string;
  ctaLink?: string;
  cta_secondary_text?: string;
  cta_secondary_link?: string;
  slides?: Array<{ url: string; alt: string }>;
}

export function HeroSection() {
  const { data: cms } = useCMSContent("home", "hero");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const cmsContent = (cms?.content || {}) as HeroContent;
  const slides = Array.isArray(cmsContent.slides) && cmsContent.slides.length > 0
    ? cmsContent.slides
    : DEFAULT_SLIDES;

  const content = {
    badge: cmsContent.badge || "Circular Fashion • UK, Kenya & African Partnership",
    headline: cmsContent.headline || cmsContent.title || 'Transforming Textile Waste into <i>Sustainable Fashion</i>',
    subheadline: cmsContent.subheadline || cmsContent.subtitle || "The London-Nairobi Circular Bridge. We collect discarded textiles in the UK, process them with artisanal Kenya and African craftsmanship, and bring them back as premium circular fashion.",
    cta_primary_text: cmsContent.cta_primary_text || cmsContent.ctaText || "Join the Movement",
    cta_primary_link: cmsContent.cta_primary_link || cmsContent.ctaLink || "/shop",
    cta_secondary_text: cmsContent.cta_secondary_text || "Partner With Us",
    cta_secondary_link: cmsContent.cta_secondary_link || "/partners",
  };

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, slides.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }, [currentSlide, slides.length, goToSlide]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="relative overflow-hidden min-h-[70vh] md:min-h-[85vh] flex items-center">
      <div className="absolute inset-0 z-0">
        {slides.map((slide: { url: string; alt: string }, index: number) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
          >
            {index === 0 && !slide.url.includes('unsplash.com') ? (
              <picture>
                <source srcSet={heroMountainAvif} type="image/avif" />
                <source srcSet={heroMountainWebp} type="image/webp" />
                <img
                  src={slide.url}
                  alt={slide.alt}
                  width={1536}
                  height={1024}
                  className="h-full w-full object-cover object-center md:object-top"
                  style={{
                    filter: 'contrast(1.05) saturate(1.1) brightness(1.02)',
                    imageRendering: 'auto',
                  }}
                  loading="eager"
                  fetchPriority="high"
                  decoding="sync"
                />
              </picture>
            ) : (
              <img
                src={slide.url.includes('unsplash.com')
                  ? `${slide.url.split('?')[0]}?w=1200&h=675&fit=crop&auto=format&q=80`
                  : slide.url}
                alt={slide.alt}
                width={1200}
                height={675}
                className="h-full w-full object-cover object-center md:object-top"
                style={{
                  filter: 'contrast(1.05) saturate(1.1) brightness(1.02)',
                  imageRendering: 'auto',
                }}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "low"}
                decoding={index === 0 ? "sync" : "async"}
              />
            )}
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60 md:from-black/30 md:via-black/40 md:to-black/50" />
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 p-3 md:p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
          </button>

          <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_: unknown, index: number) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${index === currentSlide
                  ? "bg-white scale-110"
                  : "bg-white/40 hover:bg-white/60"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      <div className="container relative z-10 py-12 px-6 md:py-32 md:px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-4 md:mb-6 inline-flex items-center gap-2 text-xs md:text-sm font-medium text-white/90 animate-fade-in">
            <Recycle className="h-3.5 w-3.5 md:h-4 md:w-4" aria-hidden="true" />
            <span>{content.badge}</span>
          </div>

          <h1
            className="mb-4 md:mb-6 font-serif text-3xl sm:text-4xl font-normal tracking-tight text-white md:text-6xl lg:text-7xl animate-fade-in leading-[1.15]"
            style={{ animationDelay: "0.1s" }}
            dangerouslySetInnerHTML={{ __html: content.headline }}
          />

          <p className="mb-8 md:mb-10 text-base md:text-xl text-white/85 max-w-2xl mx-auto animate-fade-in leading-relaxed px-2 md:px-0" style={{ animationDelay: "0.2s" }}>
            {content.subheadline}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link to={content.cta_primary_link}>
              <Button size="lg" className="gap-2 bg-[#2D5A43] text-white hover:bg-[#3d7a5a] border-0 px-8 rounded-full">
                {content.cta_primary_text}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to={content.cta_secondary_link}>
              <Button size="lg" variant="outline" className="gap-2 border-white/50 text-white hover:bg-white/10 bg-transparent px-8 rounded-full">
                {content.cta_secondary_text}
              </Button>
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-white/80 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" aria-hidden="true" />
              <span>UN SDG Aligned</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5" aria-hidden="true" />
              <span>Carbon Tracked</span>
            </div>
            <div className="flex items-center gap-2">
              <Recycle className="h-5 w-5" aria-hidden="true" />
              <span>100% Circular</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


