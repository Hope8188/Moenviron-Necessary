import { safeToastError } from '@/lib/error-handler';
import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, ShoppingBag, Leaf, Recycle, Plus } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { SEO } from "@/components/SEO";
import { formatPrice } from "@/lib/currency";

import { trackProductInteraction } from "@/lib/analytics";

const categories = ["All", "Tops", "Bottoms", "Dresses", "Outerwear", "Accessories", "Footwear", "Swimwear"];

import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "motion/react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Shop = () => {
  const { data: products = [] } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setIsSubscribing(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email: newsletterEmail, source: "shop_page" }]);

      if (error) {
        if (error.code === '23505') {
          toast.info("You're already subscribed!");
        } else {
          throw error;
        }
      } else {
        toast.success("Welcome to the circular movement!");
        setNewsletterEmail("");
      }
    } catch (err) {
      toast.error("Subscription failed. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleProductClick = (product: { id: string; name: string }) => {
    trackProductInteraction(product.id, 'view', product.name);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SEO
        title="Shop Sustainable Fashion | Moenviron"
        description="Discover ethically crafted pieces that give waste a second life. Beautifully designed, radically circular fashion from Moenviron."
      />
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden min-h-[60vh] md:min-h-[70vh] flex items-center bg-zinc-900">
          <AuroraBackground className="absolute inset-0 z-0">
            <div className="container px-4 md:px-6 relative z-10">
              <div className="max-w-3xl mx-auto text-center space-y-8 md:space-y-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest text-[#7CC38A] bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
                >
                  <Recycle className="h-4 w-4" aria-hidden="true" />
                  <span>Circular Fashion Collection</span>
                </motion.div>

                <h1 className="text-5xl md:text-8xl font-display leading-[0.9] text-white">
                  The <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#7CC38A] via-[#93c5fd] to-[#7CC38A] animate-aurora-glow">Marketplace</span>
                </h1>

                <p className="text-lg md:text-xl text-white/60 font-light max-w-xl mx-auto leading-relaxed px-4">
                  Discover ethically crafted pieces that give waste a second life.
                  Beautifully designed, radically circular.
                </p>

                <div className="flex items-center justify-center gap-4 pt-4">
                  <Button size="lg" className="rounded-full bg-white text-black hover:bg-[#7CC38A] hover:text-white transition-all duration-300 px-8 h-14 uppercase tracking-widest text-[11px] font-bold">
                    Explore Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </AuroraBackground>
        </section>

        <section className="sticky top-16 z-40 border-y border-black/5 bg-white/80 backdrop-blur-md py-3 md:py-4">
          <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <div className="flex items-center gap-4 md:gap-6 overflow-x-auto no-scrollbar w-full md:w-auto pb-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] transition-all whitespace-nowrap ${selectedCategory === category ? "text-black border-b-2 border-black pb-1" : "text-black/30 hover:text-black/60 pb-1"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/20" />
              <input
                type="text"
                placeholder="Find upcycled styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F9F7F2] border-none rounded-full py-2 md:py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-black/5 transition-all"
              />
            </div>
          </div>
        </section>

        <section className="py-8 md:py-16">
          <div className="container px-4 md:px-6">
            {filteredProducts.length === 0 ? (
              <div className="py-16 md:py-24 text-center">
                <h3 className="text-xl md:text-2xl font-display mb-4">No products found</h3>
                <p className="text-muted-foreground font-light mb-6 md:mb-8 text-sm md:text-base">Try adjusting your filters or search.</p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  variant="outline"
                  className="rounded-full px-8"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:gap-6 md:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/shop/${product.id}`}
                    className="group relative"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="space-y-4 transition-all duration-500 group-hover:-translate-y-2">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl md:rounded-[2rem] bg-zinc-50 border border-zinc-100 shadow-sm group-hover:shadow-2xl group-hover:border-[#7CC38A]/30 transition-all duration-500">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            loading="lazy"
                            width="300"
                            height="400"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop";
                            }}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Leaf className="h-8 w-8 text-zinc-200" />
                          </div>
                        )}

                        {/* Premium Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Float Badge */}
                        <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hidden md:block">
                          <div className="bg-white/95 backdrop-blur-md p-3 rounded-full shadow-xl border border-white/20">
                            <ShoppingBag className="h-5 w-5 text-black" />
                          </div>
                        </div>

                        {product.carbon_offset_kg && (
                          <div className="absolute top-3 left-3 md:top-4 md:left-4">
                            <span className="text-[10px] md:text-[11px] font-bold text-white bg-[#2D5A43] px-3 py-1 rounded-full shadow-lg border border-white/10 backdrop-blur-md">
                              -{product.carbon_offset_kg}kg CO₂
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="text-left space-y-1.5 px-1">
                        <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-[#7CC38A]">
                          {product.category}
                        </span>
                        <h3 className="text-sm md:text-base font-medium leading-tight group-hover:text-black transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-base md:text-lg font-bold text-[#1A1A1A]">
                            {formatPrice(product.price, product.currency || 'GBP')}
                          </span>
                          <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-12 md:py-24 bg-white border-t border-black/5">
          <div className="container px-4 md:px-6">
            <div className="relative overflow-hidden rounded-2xl md:rounded-[2rem] bg-[#1A1A1A] text-white p-6 md:p-12 lg:p-20">
              <div className="absolute inset-0 opacity-20">
                <img
                  src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop"
                  alt="Background"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="space-y-4 md:space-y-6 text-center md:text-left">
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-display leading-tight">
                    Stay in the <span className="italic text-[#7CC38A]">Loop</span>
                  </h2>
                  <p className="text-sm md:text-lg text-white/60 font-light max-w-sm mx-auto md:mx-0">
                    Be the first to know about new collection drops and artisan stories.
                  </p>
                </div>

                <div className="space-y-3 md:space-y-4">
                  <form onSubmit={handleSubscribe} className="flex flex-col gap-3 md:gap-4">
                    <input
                      type="email"
                      required
                      placeholder="Your email address"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-full px-5 py-3 md:px-6 md:py-4 text-white text-sm md:text-base placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#2D5A43] transition-all"
                    />
                    <Button
                      type="submit"
                      disabled={isSubscribing}
                      className="w-full md:w-auto bg-white text-black hover:bg-[#F9F7F2] rounded-full h-12 md:h-14 px-6 md:px-8 font-bold uppercase tracking-widest text-[9px] md:text-[10px]"
                    >
                      {isSubscribing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
                      {!isSubscribing && <ArrowRight className="ml-2 h-3.5 w-3.5 md:h-4 md:w-4" />}
                    </Button>
                  </form>
                  <p className="text-[9px] md:text-[10px] text-white/30 uppercase tracking-widest text-center md:text-left">
                    By joining, you agree to receive circular updates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
