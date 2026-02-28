import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/hooks/useProducts";
import {
  Leaf, ArrowLeft, Plus, Minus, ShoppingBag, MapPin, Recycle,
  Loader2, Heart, Truck, Ruler, Info, Star, ChevronDown, ChevronUp, Shield
} from "lucide-react";
import { trackProductInteraction } from "@/lib/analytics";
import { SEO } from "@/components/SEO";
import { formatPrice } from "@/lib/currency";
import { SustainableJourney } from "@/components/shop/SustainableJourney";

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

const sizeGuideData = [
  { size: "XS", chest: "82-86", waist: "62-66", hips: "86-90" },
  { size: "S", chest: "87-91", waist: "67-71", hips: "91-95" },
  { size: "M", chest: "92-96", waist: "72-76", hips: "96-100" },
  { size: "L", chest: "97-102", waist: "77-82", hips: "101-106" },
  { size: "XL", chest: "103-108", waist: "83-88", hips: "107-112" },
  { size: "XXL", chest: "109-114", waist: "89-94", hips: "113-118" },
];

// Curated testimonials shown on every product
const testimonials = [
  { name: "Sarah M.", location: "London", rating: 5, text: "The quality is incredible — you can't tell it's upcycled. I get compliments every time I wear my blazer." },
  { name: "James K.", location: "Manchester", rating: 5, text: "Love knowing my purchase diverts textile waste from landfill. The craftsmanship is outstanding." },
  { name: "Amara O.", location: "Bristol", rating: 4, text: "Beautiful packaging, fast delivery. The materials feel premium and the fit was perfect." },
];

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  category: string;
  image_url: string | null;
  carbon_offset_kg: number | null;
  source_location: string | null;
  stock_quantity: number;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const { user } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { data: allProducts = [] } = useProducts();

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;

      const { data, error } = await (supabase as any)
        .from("products")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .maybeSingle();

      if (!error && data) {
        setProduct(data as Product);
        trackProductInteraction(data.id, 'view', data.name);
      }
      setIsLoading(false);
    }

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const addToCart = () => {
    if (!product) return;

    trackProductInteraction(product.id, 'add_to_cart', product.name);

    const savedCart = localStorage.getItem("moenviron-cart");
    const cart = savedCart ? JSON.parse(savedCart) : [];

    const existingIndex = cart.findIndex((item: { id: string; size?: string }) => item.id === product.id && item.size === selectedSize);

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        currency: product.currency,
        quantity,
        size: selectedSize,
        image_url: product.image_url,
        carbon_offset_kg: product.carbon_offset_kg,
      });
    }

    localStorage.setItem("moenviron-cart", JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cart-updated"));
    toast.success(`Added ${quantity} ${product.name} (${selectedSize}) to cart`);
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  // "You May Also Like" — same category, different product, max 4
  const relatedProducts = product
    ? allProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4)
    : [];

  // If not enough in same category, fill from other categories
  const suggestions = relatedProducts.length >= 2
    ? relatedProducts
    : allProducts.filter(p => p.id !== product?.id).slice(0, 4);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <Leaf className="mx-auto h-16 w-16 text-muted-foreground/30" />
            <h2 className="mt-4 text-xl font-semibold">Product not found</h2>
            <p className="mt-2 text-muted-foreground">This product may no longer be available.</p>
            <Link to="/shop" className="mt-6 inline-block">
              <Button>Back to Shop</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SEO
        title={product.name}
        description={product.description || `${product.name} - Sustainable fashion made from 100% recycled UK textiles`}
        image={product.image_url || undefined}
        type="product"
        product={{
          name: product.name,
          description: product.description || `${product.name} - Sustainable fashion made from 100% recycled UK textiles`,
          price: product.price,
          currency: product.currency,
          image: product.image_url || undefined,
          sku: product.id,
          availability: product.stock_quantity > 0 ? "InStock" : "OutOfStock",
          category: product.category,
        }}
      />
      <Navbar />
      <main className="flex-1 py-8 md:py-16">
        <div className="container px-4 md:px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 md:mb-8">
            <ol className="flex items-center gap-2 text-xs md:text-sm">
              <li><Link to="/" className="text-zinc-400 hover:text-black transition-colors">Home</Link></li>
              <li className="text-zinc-300">/</li>
              <li><Link to="/shop" className="text-zinc-400 hover:text-black transition-colors">Shop</Link></li>
              <li className="text-zinc-300">/</li>
              <li className="text-zinc-600 font-medium truncate max-w-[200px]">{product.name}</li>
            </ol>
          </nav>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Product Image */}
            <div className="relative aspect-[3/4] md:aspect-square overflow-hidden rounded-2xl md:rounded-[2rem] bg-zinc-50 border border-zinc-100 shadow-sm">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop";
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Leaf className="h-24 w-24 text-zinc-100" />
                </div>
              )}
              <Badge className="absolute left-4 top-4 md:left-6 md:top-6 bg-white/80 backdrop-blur-md text-black border-none hover:bg-white">{product.category}</Badge>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-foreground leading-tight">
                {product.name}
              </h1>

              {/* Price + "Why this price" */}
              <div className="mt-4 md:mt-6">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-2xl md:text-3xl font-bold text-foreground">
                    {formatPrice(product.price, product.currency)}
                  </span>
                  {product.carbon_offset_kg && (
                    <Badge variant="secondary" className="bg-[#7CC38A]/10 text-[#2D5A43] border-none px-3 py-1 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">
                      <Leaf className="mr-1 h-3 w-3" />
                      -{product.carbon_offset_kg}kg CO₂
                    </Badge>
                  )}
                </div>
                <button
                  onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                  className="mt-2 flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  <Info className="h-3 w-3" />
                  Why this price?
                  {showPriceBreakdown ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
                {showPriceBreakdown && (
                  <div className="mt-3 p-4 bg-[#F9F7F2] rounded-xl text-xs text-zinc-600 space-y-1.5 border border-zinc-100">
                    <p className="font-bold text-zinc-800 text-sm mb-2">What goes into this price:</p>
                    <div className="flex justify-between"><span>UK textile sourcing & sorting</span><span className="font-medium">18%</span></div>
                    <div className="flex justify-between"><span>International logistics (UK → Kenya)</span><span className="font-medium">12%</span></div>
                    <div className="flex justify-between"><span>Artisan craftsmanship (8-14 hours)</span><span className="font-medium">40%</span></div>
                    <div className="flex justify-between"><span>Quality inspection & finishing</span><span className="font-medium">10%</span></div>
                    <div className="flex justify-between"><span>Fair wages & community programs</span><span className="font-medium">15%</span></div>
                    <div className="flex justify-between"><span>Carbon offset & packaging</span><span className="font-medium">5%</span></div>
                    <div className="border-t border-zinc-200 mt-2 pt-2 flex justify-between font-bold text-zinc-800">
                      <span>Total</span><span>100%</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-2 italic">Every purchase directly supports Kenyan artisans and diverts textiles from landfill.</p>
                  </div>
                )}
              </div>

              {/* Free shipping + trust badges */}
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider text-[#2D5A43] bg-[#7CC38A]/10 px-3 py-1.5 rounded-full">
                  <Truck className="h-3 w-3" /> Free UK Delivery
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider text-zinc-500 bg-zinc-100 px-3 py-1.5 rounded-full">
                  <Shield className="h-3 w-3" /> Secure Checkout
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider text-zinc-500 bg-zinc-100 px-3 py-1.5 rounded-full">
                  <Recycle className="h-3 w-3" /> 100% Upcycled
                </span>
              </div>

              {product.description && (
                <p className="mt-6 text-sm md:text-base text-muted-foreground font-light leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Product Details Highlights */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {product.source_location && (
                  <div className="flex items-center gap-3 p-3 md:p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                    <MapPin className="h-4 w-4 text-[#7CC38A] shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-zinc-400">Crafted In</span>
                      <span className="text-xs md:text-sm font-medium truncate">{product.source_location}</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 md:p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                  <Recycle className="h-4 w-4 text-[#7CC38A] shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-zinc-400">Materials</span>
                    <span className="text-xs md:text-sm font-medium">100% Recycled UK</span>
                  </div>
                </div>
              </div>

              {/* Size Selection + Guide */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-zinc-400">Size</span>
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-black transition-colors"
                  >
                    <Ruler className="h-3 w-3" />
                    Size Guide
                    {showSizeGuide ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                </div>

                {showSizeGuide && (
                  <div className="mb-4 p-4 bg-zinc-50 rounded-xl border border-zinc-100 overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-zinc-400 font-bold uppercase tracking-wider">
                          <th className="text-left py-1.5">Size</th>
                          <th className="text-left py-1.5">Chest (cm)</th>
                          <th className="text-left py-1.5">Waist (cm)</th>
                          <th className="text-left py-1.5">Hips (cm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sizeGuideData.map((row) => (
                          <tr key={row.size} className={`border-t border-zinc-100 ${row.size === selectedSize ? 'bg-[#7CC38A]/10 font-bold' : ''}`}>
                            <td className="py-1.5">{row.size}</td>
                            <td className="py-1.5">{row.chest}</td>
                            <td className="py-1.5">{row.waist}</td>
                            <td className="py-1.5">{row.hips}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="text-[10px] text-zinc-400 mt-2">Each piece is unique — slight variations are a mark of artisan craftsmanship.</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-10 w-10 md:h-11 md:w-11 rounded-full text-xs font-bold transition-all border-2 ${selectedSize === size
                          ? "bg-black text-white border-black shadow-lg scale-110"
                          : "border-zinc-200 text-zinc-600 hover:border-black hover:text-black"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-4 md:gap-6">
                  <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-zinc-400">Qty</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="w-8 text-center font-bold text-base">{quantity}</span>
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9" onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}>
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">
                    {product.stock_quantity} left
                  </span>
                </div>

                <div className="flex gap-3">
                  <Button size="lg" className="flex-1 h-13 md:h-14 rounded-full bg-black hover:bg-[#2D5A43] transition-all duration-300 gap-2 font-bold uppercase tracking-widest text-[10px] md:text-xs" onClick={addToCart}>
                    <ShoppingBag className="h-4 w-4" />
                    Add to Bag — {selectedSize}
                  </Button>
                  <Button
                    size="lg"
                    variant={isInWishlist(product.id) ? "default" : "outline"}
                    onClick={handleWishlistToggle}
                    className="h-13 md:h-14 w-14 rounded-full border-zinc-200 shrink-0"
                  >
                    <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </div>

              {/* Environmental Impact */}
              {product.carbon_offset_kg && (
                <div className="mt-8 group cursor-default">
                  <div className="relative overflow-hidden rounded-2xl bg-[#2D5A43] text-white p-6 md:p-8">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-32 w-32 bg-white/5 rounded-full blur-3xl group-hover:bg-[#7CC38A]/20 transition-all duration-1000" />
                    <div className="relative z-10 flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                        <Leaf className="h-6 w-6 text-[#7CC38A]" />
                      </div>
                      <div>
                        <h3 className="text-base md:text-lg font-display font-medium">Your Impact</h3>
                        <p className="mt-1 text-xs md:text-sm text-white/60 font-light leading-relaxed">
                          This piece prevents <span className="text-white font-bold">{product.carbon_offset_kg}kg of CO₂</span> emissions. You're keeping textiles out of landfill and supporting artisan livelihoods.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customer Reviews */}
          <section className="mt-16 md:mt-24">
            <h2 className="text-xl md:text-2xl font-display font-medium mb-6 md:mb-8">What Our Customers Say</h2>
            <div className="grid gap-4 md:grid-cols-3 md:gap-6">
              {testimonials.map((review, i) => (
                <div key={i} className="p-5 md:p-6 rounded-2xl bg-[#F9F7F2] border border-zinc-100">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5 fill-[#7CC38A] text-[#7CC38A]" />
                    ))}
                    {Array.from({ length: 5 - review.rating }).map((_, j) => (
                      <Star key={j + review.rating} className="h-3.5 w-3.5 text-zinc-200" />
                    ))}
                  </div>
                  <p className="text-sm text-zinc-600 font-light leading-relaxed italic">"{review.text}"</p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-[#2D5A43] flex items-center justify-center text-white text-xs font-bold">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-800">{review.name}</span>
                      <span className="text-[10px] text-zinc-400 ml-2">{review.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* You May Also Like */}
          {suggestions.length > 0 && (
            <section className="mt-16 md:mt-24">
              <h2 className="text-xl md:text-2xl font-display font-medium mb-6 md:mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
                {suggestions.map((item) => (
                  <Link
                    key={item.id}
                    to={`/shop/${item.id}`}
                    className="group"
                    onClick={() => trackProductInteraction(item.id, 'view', item.name)}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl md:rounded-2xl bg-zinc-50 border border-zinc-100 group-hover:shadow-lg transition-all duration-300">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Leaf className="h-8 w-8 text-zinc-200" />
                        </div>
                      )}
                      {item.carbon_offset_kg && (
                        <span className="absolute top-2 left-2 text-[9px] font-bold text-white bg-[#2D5A43]/90 px-2 py-0.5 rounded-full">
                          -{item.carbon_offset_kg}kg CO₂
                        </span>
                      )}
                    </div>
                    <div className="mt-2 space-y-0.5 px-0.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#7CC38A]">{item.category}</span>
                      <h3 className="text-xs md:text-sm font-medium line-clamp-1">{item.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{formatPrice(item.price, item.currency || 'GBP')}</span>
                        <span className="text-[9px] text-[#2D5A43] font-bold hidden md:inline">Free UK Delivery</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Sustainable Journey */}
          <section className="mt-16 md:mt-24">
            <SustainableJourney />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
