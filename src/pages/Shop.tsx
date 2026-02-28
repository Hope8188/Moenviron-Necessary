import { safeToastError } from '@/lib/error-handler';
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, ShoppingBag, Leaf, Recycle, Plus, X, ChevronDown, Filter, Star, Truck, Shield, Heart } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { SEO } from "@/components/SEO";
import { formatPrice } from "@/lib/currency";
import { trackProductInteraction } from "@/lib/analytics";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const categories = ["All", "Tops", "Bottoms", "Dresses", "Outerwear", "Accessories", "Footwear", "Swimwear"];
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Name A-Z", value: "name_asc" },
];

const Shop = () => {
  const { data: products = [] } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<string | null>(null);
  const [quickViewSize, setQuickViewSize] = useState<string>("M");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const productsRef = useRef<HTMLElement>(null);

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

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price_asc": return a.price - b.price;
        case "price_desc": return b.price - a.price;
        case "name_asc": return a.name.localeCompare(b.name);
        default: return 0; // newest = default order from DB
      }
    });

  const handleProductClick = (product: { id: string; name: string }) => {
    trackProductInteraction(product.id, 'view', product.name);
  };

  const addToCartQuick = (product: any, size: string) => {
    trackProductInteraction(product.id, 'add_to_cart', product.name);

    const savedCart = localStorage.getItem("moenviron-cart");
    const cart = savedCart ? JSON.parse(savedCart) : [];

    const cartKey = `${product.id}-${size}`;
    const existingIndex = cart.findIndex((item: { id: string; size?: string }) =>
      item.id === product.id && item.size === size
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        currency: product.currency,
        quantity: 1,
        size,
        image_url: product.image_url,
        carbon_offset_kg: product.carbon_offset_kg,
      });
    }

    localStorage.setItem("moenviron-cart", JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cart-updated"));
    toast.success(`${product.name} (${size}) added to bag`, {
      action: {
        label: "View Bag",
        onClick: () => window.dispatchEvent(new CustomEvent("open-cart")),
      },
    });
    setQuickViewProduct(null);
  };

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const activeFiltersCount = (selectedCategory !== "All" ? 1 : 0) + (selectedSize ? 1 : 0);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SEO
        title="Shop Sustainable Fashion | Moenviron"
        description="Discover ethically crafted pieces that give waste a second life. Shop upcycled tops, bottoms, dresses, and accessories from Moenviron's circular fashion collection."
        keywords="sustainable fashion, upcycled clothing, circular fashion, recycled textiles, ethical fashion UK, eco-friendly clothing Kenya"
      />
      <Navbar />
      <main className="flex-1">
        {/* Compact Hero — shows products faster */}
        <section className="relative overflow-hidden bg-zinc-900 py-12 md:py-20">
          <div className="absolute inset-0 opacity-30">
            <img
              src="https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=1600&auto=format&fit=crop"
              alt="Sustainable fashion collection"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/60 via-zinc-900/80 to-zinc-900" />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="max-w-2xl mx-auto text-center space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#7CC38A] bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10"
              >
                <Recycle className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Circular Fashion Collection</span>
              </motion.div>

              <h1 className="text-3xl md:text-6xl lg:text-7xl font-display leading-[0.95] text-white px-2">
                The <span className="italic font-light text-[#7CC38A]">Marketplace</span>
              </h1>

              <p className="text-sm md:text-base text-white/50 font-light max-w-md mx-auto leading-relaxed px-4">
                Ethically crafted from recycled UK textiles. Each piece tells a story.
              </p>

              <Button
                size="lg"
                onClick={scrollToProducts}
                className="rounded-full bg-white text-black hover:bg-[#7CC38A] hover:text-white transition-all duration-300 px-8 h-12 md:h-14 uppercase tracking-[0.15em] text-[10px] md:text-[11px] font-bold"
              >
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Trust Strip */}
        <div className="bg-[#F9F7F2] border-b border-black/5">
          <div className="container px-4 md:px-6 py-3">
            <div className="flex items-center justify-center gap-6 md:gap-12 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-zinc-500 flex-wrap">
              <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-[#7CC38A]" /> Free UK Shipping</span>
              <span className="flex items-center gap-1.5"><Recycle className="h-3.5 w-3.5 text-[#7CC38A]" /> 100% Upcycled</span>
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-[#7CC38A]" /> Secure Checkout</span>
              <span className="hidden md:flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-[#7CC38A]" /> Ethical Supply Chain</span>
            </div>
          </div>
        </div>

        {/* Filter + Sort Bar */}
        <section ref={productsRef} className="sticky top-16 z-40 border-b border-black/5 bg-white/95 backdrop-blur-md">
          <div className="container px-4 md:px-6 py-3">
            <div className="flex items-center justify-between gap-3">
              {/* Left: Categories */}
              <div className="flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar flex-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`text-[10px] md:text-[11px] font-bold uppercase tracking-[0.12em] md:tracking-[0.18em] transition-all whitespace-nowrap px-2 py-1.5 rounded-full ${selectedCategory === category
                      ? "bg-black text-white"
                      : "text-zinc-400 hover:text-black hover:bg-zinc-100"
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Right: Search + Sort + Filter */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-300" />
                  <label htmlFor="shop-search" className="sr-only">Search products</label>
                  <input
                    id="shop-search"
                    name="search"
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoComplete="off"
                    className="w-40 lg:w-56 bg-zinc-50 border border-zinc-100 rounded-full py-2 pl-9 pr-3 text-xs focus:ring-1 focus:ring-black/10 focus:border-zinc-200 transition-all"
                  />
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-full border transition-all ${showFilters || activeFiltersCount > 0
                    ? "bg-black text-white border-black"
                    : "border-zinc-200 text-zinc-500 hover:border-zinc-400"
                    }`}
                >
                  <Filter className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-[#7CC38A] text-white rounded-full h-4 w-4 flex items-center justify-center text-[9px]">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Expandable filter panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 pb-1 flex flex-col md:flex-row items-start md:items-center gap-4 border-t border-zinc-100 mt-3">
                    {/* Mobile Search */}
                    <div className="relative w-full md:hidden">
                      <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-300" />
                      <label htmlFor="shop-search-mobile" className="sr-only">Search products</label>
                      <input
                        id="shop-search-mobile"
                        name="search-mobile"
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoComplete="off"
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-full py-2.5 pl-9 pr-3 text-sm focus:ring-1 focus:ring-black/10 transition-all"
                      />
                    </div>

                    {/* Size filters */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mr-1">Size:</span>
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                          className={`h-8 w-8 md:h-9 md:w-9 rounded-full text-[10px] md:text-[11px] font-bold transition-all border ${selectedSize === size
                            ? "bg-black text-white border-black"
                            : "border-zinc-200 text-zinc-500 hover:border-black hover:text-black"
                            }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Sort:</span>
                      <select
                        id="shop-sort"
                        name="sort"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="text-xs border border-zinc-200 rounded-full px-3 py-1.5 bg-white focus:ring-1 focus:ring-black/10"
                      >
                        {sortOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Clear all */}
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={() => { setSelectedCategory("All"); setSelectedSize(null); setSearchQuery(""); }}
                        className="text-[10px] font-bold uppercase tracking-wider text-red-500 hover:text-red-700 flex items-center gap-1"
                      >
                        <X className="h-3 w-3" /> Clear all
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-6 md:py-12">
          <div className="container px-4 md:px-6">
            {/* Results count */}
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <p className="text-xs text-zinc-400 font-medium">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-16 md:py-24 text-center">
                <ShoppingBag className="mx-auto h-12 w-12 text-zinc-200 mb-4" />
                <h3 className="text-lg md:text-xl font-display mb-2">No items found</h3>
                <p className="text-muted-foreground font-light mb-6 text-sm">Try adjusting your filters</p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setSelectedSize(null);
                  }}
                  variant="outline"
                  className="rounded-full px-8 text-xs font-bold uppercase tracking-wider"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group relative"
                  >
                    <Link
                      to={`/shop/${product.id}`}
                      className="block"
                      onClick={() => handleProductClick(product)}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden rounded-xl md:rounded-2xl bg-zinc-50 border border-zinc-100 shadow-sm group-hover:shadow-xl transition-all duration-500">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            loading={index < 8 ? "eager" : "lazy"}
                            width="400"
                            height="533"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop";
                            }}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100">
                            <Leaf className="h-10 w-10 text-zinc-200" />
                          </div>
                        )}

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* CO2 badge */}
                        {product.carbon_offset_kg && (
                          <div className="absolute top-2.5 left-2.5 md:top-3 md:left-3">
                            <span className="text-[9px] md:text-[10px] font-bold text-white bg-[#2D5A43]/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
                              -{product.carbon_offset_kg}kg CO₂
                            </span>
                          </div>
                        )}

                        {/* Quick Add button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setQuickViewProduct(product.id);
                            setQuickViewSize("M");
                          }}
                          className="absolute bottom-2.5 right-2.5 md:bottom-3 md:right-3 bg-white/95 backdrop-blur-md p-2.5 md:p-3 rounded-full shadow-lg border border-white/50 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-black hover:text-white active:scale-95"
                          aria-label={`Quick add ${product.name}`}
                        >
                          <Plus className="h-4 w-4 md:h-5 md:w-5" />
                        </button>

                        {/* Mobile: always-visible add btn */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setQuickViewProduct(product.id);
                            setQuickViewSize("M");
                          }}
                          className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-md p-2 rounded-full shadow-lg md:hidden"
                          aria-label={`Quick add ${product.name}`}
                        >
                          <ShoppingBag className="h-4 w-4" />
                        </button>
                      </div>
                    </Link>

                    {/* Product info */}
                    <div className="mt-2.5 md:mt-3 space-y-1 px-0.5">
                      <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-[#7CC38A]">
                        {product.category}
                      </span>
                      <Link to={`/shop/${product.id}`} onClick={() => handleProductClick(product)}>
                        <h3 className="text-xs md:text-sm font-medium leading-tight text-zinc-800 line-clamp-2 hover:text-black transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm md:text-base font-bold text-zinc-900">
                        {formatPrice(product.price, product.currency || 'GBP')}
                      </p>

                      <div className="flex items-center gap-1.5 pt-0.5">
                        <Truck className="h-3 w-3 text-[#7CC38A]" />
                        <span className="text-[8px] md:text-[9px] text-[#2D5A43] font-bold uppercase tracking-wider">Free UK Delivery</span>
                      </div>
                    </div>

                    {/* Quick view overlay */}
                    <AnimatePresence>
                      {quickViewProduct === product.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute inset-0 z-50 bg-white rounded-xl md:rounded-2xl shadow-2xl border border-zinc-200 p-3 md:p-4 flex flex-col justify-between"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7CC38A]">Quick Add</span>
                              <button
                                onClick={() => setQuickViewProduct(null)}
                                className="p-1 hover:bg-zinc-100 rounded-full transition-colors"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <h4 className="text-xs md:text-sm font-semibold line-clamp-2 mb-1">{product.name}</h4>
                            <p className="text-sm md:text-base font-bold text-zinc-900 mb-3">
                              {formatPrice(product.price, product.currency || 'GBP')}
                            </p>

                            {/* Size selector */}
                            <div className="space-y-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Select Size</span>
                              <div className="grid grid-cols-3 gap-1.5">
                                {sizes.map((size) => (
                                  <button
                                    key={size}
                                    onClick={() => setQuickViewSize(size)}
                                    className={`py-2 text-[10px] md:text-xs font-bold rounded-lg border transition-all ${quickViewSize === size
                                      ? "bg-black text-white border-black"
                                      : "border-zinc-200 text-zinc-600 hover:border-black"
                                      }`}
                                  >
                                    {size}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <Button
                            onClick={() => addToCartQuick(product, quickViewSize)}
                            className="w-full rounded-full bg-black hover:bg-[#2D5A43] transition-all h-10 md:h-11 text-[10px] md:text-xs font-bold uppercase tracking-wider mt-3"
                          >
                            <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
                            Add to Bag — {quickViewSize}
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-10 md:py-20 bg-white border-t border-black/5">
          <div className="container px-4 md:px-6">
            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-[#1A1A1A] text-white p-6 md:p-12 lg:p-16">
              <div className="absolute inset-0 opacity-15">
                <img
                  src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop"
                  alt="Sustainable textiles background"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="relative z-10 max-w-lg mx-auto text-center space-y-4">
                <h2 className="text-2xl md:text-4xl font-display leading-tight">
                  Stay in the <span className="italic text-[#7CC38A]">Loop</span>
                </h2>
                <p className="text-xs md:text-sm text-white/50 font-light max-w-sm mx-auto">
                  New drops, artisan stories, and circular economy insights. No spam.
                </p>

                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <label htmlFor="shop-newsletter-email" className="sr-only">Email for newsletter</label>
                  <input
                    id="shop-newsletter-email"
                    name="email"
                    type="email"
                    required
                    placeholder="Your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    autoComplete="email"
                    className="flex-1 bg-white/10 border border-white/20 rounded-full px-5 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#7CC38A]/50 transition-all"
                  />
                  <Button
                    type="submit"
                    disabled={isSubscribing}
                    className="bg-white text-black hover:bg-[#7CC38A] hover:text-white rounded-full h-12 px-6 font-bold uppercase tracking-[0.15em] text-[10px] transition-all"
                  >
                    {isSubscribing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
                    {!isSubscribing && <ArrowRight className="ml-2 h-3.5 w-3.5" />}
                  </Button>
                </form>
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
