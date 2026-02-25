import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  currency: string;
  category: string;
  images: string[];
  image_url: string | null;
  carbon_offset_kg: number | null;
  source_location: string | null;
  stock_quantity: number;
  sku: string | null;
  is_active: boolean;
  featured: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export const productService = {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await (supabase as any)
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []) as Product[];
  },

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await (supabase as any)
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Product;
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    const { data, error } = await (supabase as any)
      .from("products")
      .select("*")
      .eq("category", category)
      .eq("is_active", true);

    if (error) throw error;
    return (data || []) as Product[];
  }
};
