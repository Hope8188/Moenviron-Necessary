import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Truck, 
  Recycle, 
  Factory, 
  Shirt, 
  Globe, 
  Users, 
  Leaf, 
  Package 
} from 'lucide-react';

interface JourneyItem {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  bgColor: string;
  iconBg: string;
}

const journeyItems: JourneyItem[] = [
  {
    id: 1,
    title: "UK Collection",
    description: "Textile waste collected across the United Kingdom",
    icon: Truck,
    bgColor: "bg-[#E9EDEB]",
    iconBg: "bg-[#D4DDD9]",
  },
  {
    id: 2,
    title: "Sorting & Processing",
    description: "Materials sorted by fiber type and condition",
    icon: Recycle,
    bgColor: "bg-[#FBF1E2]",
    iconBg: "bg-[#D4DDD9]",
  },
  {
    id: 3,
    title: "Kenya Manufacturing",
    description: "Skilled artisans transform materials in Nairobi",
    icon: Factory,
    bgColor: "bg-[#F3F0E8]",
    iconBg: "bg-[#D4DDD9]",
  },
  {
    id: 4,
    title: "Sustainable Fashion",
    description: "New garments with full carbon traceability",
    icon: Shirt,
    bgColor: "bg-[#E9EDEB]",
    iconBg: "bg-[#D4DDD9]",
  },
  {
    id: 5,
    title: "Global Impact",
    description: "Reducing landfill waste worldwide",
    icon: Globe,
    bgColor: "bg-[#FBF1E2]",
    iconBg: "bg-[#D4DDD9]",
  },
  {
    id: 6,
    title: "Community Employment",
    description: "Creating jobs in developing economies",
    icon: Users,
    bgColor: "bg-[#F3F0E8]",
    iconBg: "bg-[#D4DDD9]",
  },
  {
    id: 7,
    title: "Carbon Offset",
    description: "Every product tracks its environmental savings",
    icon: Leaf,
    bgColor: "bg-[#E9EDEB]",
    iconBg: "bg-[#D4DDD9]",
  },
  {
    id: 8,
    title: "B2B Solutions",
    description: "EPR compliance for fashion brands",
    icon: Package,
    bgColor: "bg-[#FBF1E2]",
    iconBg: "bg-[#D4DDD9]",
  }
];

const displayItems = [...journeyItems, ...journeyItems, ...journeyItems];

const CircularCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isManualScrolling, setIsManualScrolling] = useState(false);
  const autoScrollSpeed = 0.8;
  const resumeDelay = 2000;
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationRef = useRef<number | null>(null);
  const isInitializedRef = useRef(false);

  const handleInfiniteLoop = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    
    const scrollWidth = container.scrollWidth / 3;
    
    if (container.scrollLeft >= scrollWidth * 2) {
      container.scrollLeft = container.scrollLeft - scrollWidth;
    } else if (container.scrollLeft <= 0) {
      container.scrollLeft = scrollWidth;
    }
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || isInitializedRef.current) return;
    
    const initializeScroll = () => {
      const scrollWidth = container.scrollWidth / 3;
      if (scrollWidth > 0) {
        container.scrollLeft = scrollWidth;
        isInitializedRef.current = true;
      }
    };
    
    requestAnimationFrame(() => {
      requestAnimationFrame(initializeScroll);
    });
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const autoScroll = () => {
      if (!isPaused && !isManualScrolling && container) {
        container.scrollLeft += autoScrollSpeed;
        handleInfiniteLoop();
      }
      animationRef.current = requestAnimationFrame(autoScroll);
    };
    
    animationRef.current = requestAnimationFrame(autoScroll);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, isManualScrolling, handleInfiniteLoop]);

  const startManualScroll = () => {
    setIsManualScrolling(true);
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
  };

  const endManualScroll = () => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      setIsManualScrolling(false);
    }, resumeDelay);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const container = scrollRef.current;
    if (!container) return;
    
    e.preventDefault();
    container.scrollLeft += e.deltaY || e.deltaX;
    handleInfiniteLoop();
    startManualScroll();
    endManualScroll();
  };

  const handleTouchStart = () => {
    startManualScroll();
  };

  const handleTouchEnd = () => {
    endManualScroll();
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    endManualScroll();
  };

  return (
    <section className="py-16 md:py-24 overflow-hidden bg-[#FBF9F4]">
      <div className="container mb-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-[2.25rem] font-bold text-[#1A1A1A] leading-[1.2] mb-4">
            Our Circular Journey
          </h2>
          <p className="text-[1.125rem] text-[#6B7280] leading-[1.5]">
            From textile waste collection to sustainable fashion — discover how we're transforming the industry while creating positive social and environmental impact.
          </p>
        </div>
      </div>

      <div className="relative w-full">
        <div 
          ref={scrollRef}
          className="flex w-full overflow-x-auto pb-4 scrollbar-hide cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onScroll={handleInfiniteLoop}
        >
          <div className="flex gap-6 px-4">
            {displayItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className={`flex-shrink-0 w-72 p-6 rounded-2xl border border-[#E5E7EB]/50 transition-all duration-300 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] hover:scale-[1.02] ${item.bgColor}`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBg} mb-4`}>
                  <item.icon className="h-6 w-6 text-[#2D5A43]" aria-hidden="true" />
                </div>
                <h3 className="text-[1.25rem] font-semibold text-[#1A1A1A] leading-[1.4] mb-2">
                  {item.title}
                </h3>
                <p className="text-[0.875rem] text-[#6B7280] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center text-[0.875rem] text-[#6B7280]">
          <span className="inline-block opacity-70">
            Hover to pause • Scroll or swipe to navigate
          </span>
        </div>
      </div>
    </section>
  );
};

export default CircularCarousel;