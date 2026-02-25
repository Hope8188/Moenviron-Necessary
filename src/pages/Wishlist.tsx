import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/hooks/useWishlist";
import { toast } from "sonner";
import { Heart, ShoppingBag, Leaf, Trash2, Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  image_url: string | null;
  category: string;
  carbon_offset_kg: number | null;
}

const Wishlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { items, isLoading, removeFromWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    async function fetchProducts() {
      if (items.length === 0) {
        setProducts([]);
        setProductsLoading(false);
        return;
      }

      const productIds = items.map(item => item.product_id);
      const { data, error } = await (supabase as any)
        .from("products")
        .select("id, name, price, currency, image_url, category, carbon_offset_kg")
        .in("id", productIds);

      if (!error && data) {
        setProducts(data as Product[]);
      }
      setProductsLoading(false);
    }

    if (!isLoading) {
      fetchProducts();
    }
  }, [items, isLoading]);

  const addToCart = (product: Product) => {
    const savedCart = localStorage.getItem("moenviron-cart");
    const cart = savedCart ? JSON.parse(savedCart) : [];
    
    const existingIndex = cart.findIndex((item: { id: string }) => item.id === product.id);
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        currency: product.currency,
        quantity: 1,
        image_url: product.image_url,
        carbon_offset_kg: product.carbon_offset_kg,
      });
    }

    localStorage.setItem("moenviron-cart", JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cart-updated"));
    toast.success(`Added ${product.name} to cart`);
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
            <p className="mt-2 text-muted-foreground">
              {products.length} {products.length === 1 ? "item" : "items"} saved
            </p>
          </div>

          {isLoading || productsLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center">
              <Heart className="mx-auto h-16 w-16 text-muted-foreground/30" />
              <h2 className="mt-4 text-xl font-semibold">Your wishlist is empty</h2>
              <p className="mt-2 text-muted-foreground">
                Start adding items you love!
              </p>
              <Link to="/shop" className="mt-6 inline-block">
                <Button>Browse Shop</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden border-border/50">
                  <Link to={`/shop/${product.id}`}>
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Leaf className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium">
                        {product.category}
                      </div>
                      {product.carbon_offset_kg && (
                        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-primary/90 px-2 py-1 text-xs font-medium text-primary-foreground">
                          <Leaf className="h-3 w-3" />
                          -{product.carbon_offset_kg}kg CO₂
                        </div>
                      )}
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <Link to={`/shop/${product.id}`}>
                      <h3 className="font-medium text-foreground hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="mt-1 text-lg font-semibold">
                      £{product.price.toFixed(2)}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 gap-1"
                        onClick={() => addToCart(product)}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Add to Cart
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromWishlist(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
