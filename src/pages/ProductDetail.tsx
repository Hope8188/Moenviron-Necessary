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
import { Leaf, ArrowLeft, Plus, Minus, ShoppingBag, MapPin, Recycle, Loader2, Heart } from "lucide-react";
import { trackProductInteraction } from "@/lib/analytics";
import { SEO } from "@/components/SEO";
import { formatPrice } from "@/lib/currency";
import { SustainableJourney } from "@/components/shop/SustainableJourney";

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
  const { user } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

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
  }, [id]);

  const addToCart = () => {
    if (!product) return;

    trackProductInteraction(product.id, 'add_to_cart', product.name);

    const savedCart = localStorage.getItem("moenviron-cart");
    const cart = savedCart ? JSON.parse(savedCart) : [];

    const existingIndex = cart.findIndex((item: { id: string }) => item.id === product.id);

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        currency: product.currency,
        quantity,
        image_url: product.image_url,
        carbon_offset_kg: product.carbon_offset_kg,
      });
    }

    localStorage.setItem("moenviron-cart", JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cart-updated"));
    toast.success(`Added ${quantity} ${product.name} to cart`);
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

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
      <main className="flex-1 py-12 md:py-20">
        <div className="container px-4 md:px-6">
          {/* Breadcrumb */}
          <Link
            to="/shop"
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </Link>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-zinc-50 border border-zinc-100 shadow-sm">
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
              <Badge className="absolute left-6 top-6 bg-white/80 backdrop-blur-md text-black border-none hover:bg-white">{product.category}</Badge>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-4xl font-display font-medium text-foreground md:text-5xl lg:text-6xl">
                {product.name}
              </h1>

              <div className="mt-6 flex items-center gap-6">
                <span className="text-3xl font-bold text-foreground">
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.carbon_offset_kg && (
                  <Badge variant="secondary" className="bg-[#7CC38A]/10 text-[#2D5A43] border-none px-4 py-1.5 font-bold uppercase tracking-widest text-[10px]">
                    <Leaf className="mr-1.5 h-3.5 w-3.5" />
                    -{product.carbon_offset_kg}kg CO₂
                  </Badge>
                )}
              </div>

              {product.description && (
                <p className="mt-8 text-lg text-muted-foreground font-light leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Product Details Highlights */}
              <div className="mt-10 grid grid-cols-2 gap-4">
                {product.source_location && (
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 shadow-sm">
                    <MapPin className="h-5 w-5 text-[#7CC38A]" />
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Crafted In</span>
                      <span className="text-sm font-medium">{product.source_location}</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 shadow-sm">
                  <Recycle className="h-5 w-5 text-[#7CC38A]" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Materials</span>
                    <span className="text-sm font-medium">100% Recycled UK</span>
                  </div>
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="mt-12 space-y-6">
                <div className="flex items-center gap-6">
                  <span className="text-sm font-bold uppercase tracking-widest text-zinc-400">Quantity</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full h-10 w-10"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full h-10 w-10"
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">
                    {product.stock_quantity} available
                  </span>
                </div>

                <div className="flex gap-4 pt-2">
                  <Button size="lg" className="flex-1 h-16 rounded-full bg-black hover:bg-[#7CC38A] transition-all duration-300 gap-3 font-bold uppercase tracking-widest text-xs" onClick={addToCart}>
                    <ShoppingBag className="h-5 w-5" />
                    Add to Collection
                  </Button>
                  <Button
                    size="lg"
                    variant={isInWishlist(product.id) ? "default" : "outline"}
                    onClick={handleWishlistToggle}
                    className="h-16 w-16 rounded-full border-zinc-200"
                  >
                    <Heart className={`h-6 w-6 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </div>

              {/* Environmental Impact Summary */}
              {product.carbon_offset_kg && (
                <div className="mt-12 group cursor-default">
                  <div className="relative overflow-hidden rounded-[2rem] bg-[#2D5A43] text-white p-8">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-40 w-40 bg-white/5 rounded-full blur-3xl group-hover:bg-[#7CC38A]/20 transition-all duration-1000" />
                    <div className="relative z-10 flex items-start gap-6">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1rem] bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
                        <Leaf className="h-7 w-7 text-[#7CC38A]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-medium">Environmental Impact</h3>
                        <p className="mt-2 text-sm text-white/60 font-light leading-relaxed">
                          This piece prevents <span className="text-white font-bold">{product.carbon_offset_kg}kg of CO₂</span> from entering the atmosphere. By choosing upcycled, you are actively participating in the circular economy and protecting our planet's future.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* New Sustainable Journey Tracker */}
          <section className="mt-20 md:mt-32">
            <SustainableJourney />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
