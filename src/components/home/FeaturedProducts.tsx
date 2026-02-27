import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Leaf } from "lucide-react";
import { useCMSContent } from "@/hooks/useCMSContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/currency";

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  category: string;
  image_url: string | null;
  carbon_offset_kg: number | null;
  source_location: string | null;
}

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "fallback-1",
    name: "Upcycled Denim Jacket",
    price: 85.00,
    currency: "GBP",
    category: "Outerwear",
    image_url: "https://images.unsplash.com/photo-1551537482-f20300fc4ea1?q=80&w=800&auto=format&fit=crop",
    carbon_offset_kg: 12.5,
    source_location: "Nairobi, Kenya"
  },
  {
    id: "fallback-2",
    name: "Cotton Tote Bag",
    price: 25.00,
    currency: "GBP",
    category: "Accessories",
    image_url: "https://ih1.redbubble.net/image.2345126169.5448/ssrco,tote,cotton,canvas_creme,flatlay,square,600x600-bg,f8f8f8.1.jpg",
    carbon_offset_kg: 3.2,
    source_location: "Nairobi, Kenya"
  },
  {
    id: "fallback-3",
    name: "Vintage Reworked Dress",
    price: 65.00,
    currency: "GBP",
    category: "Dresses",
    image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop",
    carbon_offset_kg: 8.3,
    source_location: "Nairobi, Kenya"
  },
  {
    id: "fallback-4",
    name: "Recycled Cotton T-Shirt",
    price: 35.00,
    currency: "GBP",
    category: "Tops",
    image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
    carbon_offset_kg: 5.2,
    source_location: "Nairobi, Kenya"
  }
];

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await (supabase as any)
        .from("products")
        .select("id, name, price, currency, category, image_url, carbon_offset_kg, source_location")
        .eq("is_active", true)
        .limit(4);

      if (!error && data && data.length > 0) {
        setProducts(data as Product[]);
      } else {
        setProducts(FALLBACK_PRODUCTS);
      }
    }

    fetchProducts();
  }, []);

  const { data: cms } = useCMSContent("home", "featured-products");
  const cmsContent = (cms?.content || {}) as { title?: string; subtitle?: string };

  const content = {
    title: cmsContent.title || "Featured Products",
    subtitle: cmsContent.subtitle || "Sustainable fashion with full carbon traceability"
  };

  if (products.length === 0) {
    return (
      <section className="py-16 md:py-24">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            {content.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {content.subtitle}
          </p>
          <Link to="/contact" className="mt-6 inline-block">
            <Button>Get Notified</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 lg:py-24">
      <div className="container px-4 md:px-6">
        <div className="mb-6 md:mb-8 flex flex-col items-start justify-between gap-3 md:gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              {content.title}
            </h2>
            <p className="mt-1 md:mt-2 text-sm md:text-base text-muted-foreground">
              {content.subtitle}
            </p>
          </div>
          <Link to="/shop">
            <Button variant="outline" className="gap-2 text-sm" size="sm">
              View All
              <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <Link
              key={product.id}
              to={`/shop/${product.id}`}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card className="overflow-hidden border-border/50 transition-all hover:shadow-medium">
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      width={400}
                      height={533}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Leaf className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground/30" />
                    </div>
                  )}

                  <div className="absolute left-1.5 top-1.5 md:left-2 md:top-2 rounded-full bg-background/90 px-1.5 py-0.5 md:px-2 text-[8px] md:text-[10px] font-medium text-foreground backdrop-blur-sm">
                    {product.category}
                  </div>

                  {product.carbon_offset_kg && (
                    <div className="absolute bottom-1.5 right-1.5 md:bottom-2 md:right-2 flex items-center gap-0.5 md:gap-1 rounded-full bg-primary/90 px-1.5 py-0.5 md:px-2 text-[8px] md:text-[10px] font-medium text-primary-foreground backdrop-blur-sm">
                      <Leaf className="h-2.5 w-2.5 md:h-3 md:w-3" />
                      -{product.carbon_offset_kg}kg CO₂
                    </div>
                  )}
                </div>

                <CardContent className="p-2 md:p-3">
                  <h3 className="text-xs md:text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-xs md:text-sm font-semibold text-foreground">
                      {formatPrice(product.price, product.currency)}
                    </span>
                    {product.source_location && (
                      <span className="text-[8px] md:text-[10px] text-muted-foreground hidden sm:inline">
                        {product.source_location}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
