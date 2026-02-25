import { useEffect, useRef, useState, useCallback } from "react";
import { useCMSContent } from "@/hooks/useCMSContent";

const defaultCollageItems = [
  {
    title: "UK Collection",
    description: "Textile waste collected across the United Kingdom",
    hoverDetails: "Over 336,000 tonnes of clothing is thrown away in the UK annually. We divert this from landfills to give it new life.",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=60&w=600&auto=format&fit=crop",
    color: "bg-primary/10",
  },
  {
    title: "Sorting & Processing",
    description: "Materials sorted by fiber type and condition",
    hoverDetails: "Advanced manual and automated sorting ensures 95% of collected textiles find a second life through reuse or recycling.",
    image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?q=60&w=600&auto=format&fit=crop",
    color: "bg-accent/10",
  },
  {
    title: "Kenya Manufacturing",
    description: "Skilled artisans transform materials in Nairobi",
    hoverDetails: "Supporting Nairobi's economy by transforming global waste into high-value products with skilled local artisans.",
    image: "https://images.unsplash.com/photo-1558770147-d2a384e1ad85?q=60&w=600&auto=format&fit=crop",
    color: "bg-secondary/10",
  },
  {
    title: "Sustainable Fashion",
    description: "New garments with full carbon traceability",
    hoverDetails: "Our garments use 99% less water and produce 90% fewer emissions than virgin textile production.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=60&w=600&auto=format&fit=crop",
    color: "bg-primary/10",
  },
  {
    title: "Global Impact",
    description: "Reducing landfill waste worldwide",
    hoverDetails: "Every ton of textiles recycled saves approximately 8 tons of CO2e emissions globally.",
    image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=60&w=600&auto=format&fit=crop",
    color: "bg-accent/10",
  },
  {
    title: "Community Employment",
    description: "Creating jobs in developing economies",
    hoverDetails: "Creating dignified work opportunities for women and youth in the Kenyan textile and manufacturing sectors.",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=60&w=600&auto=format&fit=crop",
    color: "bg-secondary/10",
  },
  {
    title: "Carbon Offset",
    description: "Every product tracks its environmental savings",
    hoverDetails: "Transparent traceability allowing brands to account for every kilogram of carbon saved through our circular model.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=60&w=600&auto=format&fit=crop",
    color: "bg-primary/10",
  },
  {
    title: "B2B Solutions",
    description: "EPR compliance for fashion brands",
    hoverDetails: "Helping brands meet Extended Producer Responsibility requirements through closed-loop systems and real impact data.",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=60&w=600&auto=format&fit=crop",
    color: "bg-accent/10",
  },
];

interface CollageItem {
  title: string;
  description: string;
  hoverDetails?: string;
  subtitle?: string;
  image?: string;
  url?: string;
  color: string;
}

interface ImpactCollageContent {
  title?: string;
  subtitle?: string;
  images?: CollageItem[];
}

export function ImpactCollage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const { data: cms } = useCMSContent("home", "impact-collage");

  const cmsContent = (cms?.content || {}) as ImpactCollageContent;
  const content = {
    title: cmsContent.title || "Our Circular Journey",
    subtitle: cmsContent.subtitle || "From textile waste collection to sustainable fashion — discover how we're transforming the industry through high-impact circular systems.",
    images: cmsContent.images || defaultCollageItems
  };

  const items: CollageItem[] = content.images;
  const duplicatedItems = [...items, ...items];

  const updateScrollProgress = useCallback(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || isDraggingProgress) return;
    const progress = (scrollContainer.scrollLeft / (scrollContainer.scrollWidth / 2)) * 100;
    setScrollProgress(Math.min(progress, 100));
  }, [isDraggingProgress]);

  const handleProgressDrag = useCallback((clientX: number) => {
    const scrollContainer = scrollRef.current;
    const progressBar = progressRef.current;
    if (!scrollContainer || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

    const halfWidth = scrollContainer.scrollWidth / 2;
    scrollContainer.scrollLeft = (percentage / 100) * halfWidth;
    setScrollProgress(percentage);
  }, []);

  useEffect(() => {
    if (!isDraggingProgress) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      handleProgressDrag(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      handleProgressDrag(e.touches[0].clientX);
    };

    const handleEnd = () => {
      setIsDraggingProgress(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDraggingProgress, handleProgressDrag]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = scrollContainer.scrollLeft;
    const scrollSpeed = 0.5;
    let isPaused = false;
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(scrollContainer);

    const halfWidth = scrollContainer.scrollWidth / 2;
    const animate = () => {
      if (!isVisible || isPaused || isDraggingProgress) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      scrollPosition += scrollSpeed;

      if (scrollPosition >= halfWidth) {
        scrollPosition = 0;
      }

      scrollContainer.scrollLeft = scrollPosition;

      // Update progress only occasionally or without re-reading scrollWidth
      if (Math.round(scrollPosition) % 10 === 0) {
        setScrollProgress((scrollPosition / halfWidth) * 100);
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    const handleMouseEnter = () => { isPaused = true; };
    const handleMouseLeave = () => {
      isPaused = false;
      scrollPosition = scrollContainer.scrollLeft;
    };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [items, updateScrollProgress, isDraggingProgress]);

  return (
    <section className="py-16 md:py-24 overflow-hidden bg-muted/30">
      <div className="container mb-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl tracking-tight">
            {content.title}
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            {content.subtitle}
          </p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-hidden cursor-grab px-4"
        style={{ scrollBehavior: "auto" }}
      >
        {duplicatedItems.map((item: CollageItem, index: number) => {
          return (
            <div
              key={`${item.title}-${index}`}
              className="group relative flex-shrink-0 w-80 h-[450px] overflow-hidden rounded-2xl border border-border/50 transition-all hover:shadow-2xl"
            >
              <img
                src={item.image.includes('unsplash.com')
                  ? `${item.image.split('?')[0]}?w=320&h=450&fit=crop&auto=format&q=70`
                  : (item.image || item.url)}
                alt={item.title}
                width={320}
                height={450}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/95 group-hover:via-black/60 transition-colors duration-500" />

              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <div className="transition-transform duration-500 transform group-hover:-translate-y-4">
                  <h3 className="text-2xl font-bold mb-3 tracking-tight group-hover:text-primary-foreground transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/80 leading-relaxed font-medium transition-opacity duration-300 group-hover:opacity-0 group-hover:h-0 overflow-hidden">
                    {item.description}
                  </p>
                </div>

                <div className="absolute bottom-8 left-8 right-8 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out delay-75">
                  <div className="bg-primary/20 backdrop-blur-md p-4 rounded-xl border border-white/20">
                    <p className="text-sm leading-relaxed font-medium text-white/95">
                      {item.hoverDetails || item.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/80">
                  Step {(index % items.length) + 1}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-center px-4">
        <div
          ref={progressRef}
          className="w-full max-w-xs md:max-w-md h-2 md:h-3 bg-[#E5E7EB] rounded-full overflow-hidden relative cursor-pointer select-none"
          onMouseDown={(e) => {
            setIsDraggingProgress(true);
            handleProgressDrag(e.clientX);
          }}
          onTouchStart={(e) => {
            setIsDraggingProgress(true);
            handleProgressDrag(e.touches[0].clientX);
          }}
          onClick={(e) => {
            handleProgressDrag(e.clientX);
          }}
        >
          <div
            className="h-full bg-[#2D5A43] rounded-full transition-all duration-150 pointer-events-none"
            style={{ width: `${Math.max(scrollProgress, 5)}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 bg-[#2D5A43] rounded-full shadow-md border-2 border-white pointer-events-none"
            style={{ left: `calc(${Math.max(scrollProgress, 2)}% - 8px)` }}
          />
        </div>
      </div>

      <div className="container mt-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-background/50 backdrop-blur-sm rounded-full border border-border shadow-sm">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <p className="text-sm font-medium text-muted-foreground">
            Hover to explore the impact • Scroll continues automatically
          </p>
        </div>
      </div>
    </section>
  );
}
